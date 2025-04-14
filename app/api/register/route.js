import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";
import { Readable } from "stream";
import db from "../../../libs/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const UPLOAD_DIR =
  "/Users/schiloibo/Documents/next/saas-fiabilisation/public/uploads";

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  let connection; // Declare connection variable outside try block for rollback

  try {
    // Ensure upload directory exists
    await ensureUploadDir();

    // 1. Verify JWT token from Authorization header
    const authHeader = request.headers.get("authorization");
    console.log("Authorization Header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication token missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error("Invalid token:", err);
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // 2. Fetch logged-in user's details from utilisateur table
    const [users] = await db.query(
      "SELECT prenom, nom, agence, role FROM utilisateur WHERE id = ?",
      [userId]
    );
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: "Logged-in user not found" },
        { status: 404 }
      );
    }

    const loggedInUser = users[0];
    const agentName = `${loggedInUser.prenom} ${loggedInUser.nom}`.trim();

    // 3. Parse the multipart form data with modified formidable config to save files
    const readableStream = request.body;
    if (!readableStream) {
      return NextResponse.json(
        { message: "Request body is missing" },
        { status: 400 }
      );
    }

    const headers = Object.fromEntries(request.headers.entries());
    const nodeStream = Readable.from(readableStream);
    nodeStream.headers = headers;

    // Configure formidable to save files to disk
    const form = formidable({
      multiples: true,
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: 30 * 1024 * 1024, // 20MB per file limit
      maxTotalFileSize: 100 * 1024 * 1024, // 30MB total for all files
      filter: (part) => {
        // Filter to allow only image files
        return (
          part.name === "clientPhoto" ||
          part.name === "clientSignature" ||
          part.name === "cniBack" ||
          part.name === "cniFront"
        );
      },
      filename: (name, ext, part, form) => {
        // Create unique filenames
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `${part.name}-${timestamp}-${random}${ext}`;
      },
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeStream, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Function to get the relative path for a file
    const getFilePath = (file) => {
      if (!file) return null;
      const fileArray = Array.isArray(file) ? file : [file];
      if (!fileArray[0]) return null;

      // Get relative path from public directory
      const relativePath = `/uploads/${path.basename(fileArray[0].filepath)}`;
      return relativePath;
    };

    // 4. Get a connection from the pool and start a transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 5. Insert into particulier table with file paths instead of file content
    const particulierSql = `
    INSERT INTO particulier (
      accountType, activitySector, address, agence, authorization, bankDomiciliation,
      birthCountry, birthDate, birthPlace, clientNumber, chequeAccountNumber, contractType, email,
      expiryDate, firstName, gender, identityNumber, identityType, incomeRange,
      issueDate, issuePlace, jobFunction, lastName, maritalStatus, mobile1Number,
      mobile1Prefix, mobile2Number, mobile2Prefix, motherName, nationality, numberOfChildren,
      otherActivities, residenceCountry, savingsAccountNumber, secondNationality,
      otherAccountNumber, spouseEmployer, spouseJobFunction, spouseOccupation,
      clientPhotoPath, clientSignaturePath, cniBackPath, cniFrontPath, status
    ) VALUES (${Array(44).fill("?").join(", ")})
  `;

    const particulierValues = [
      fields.accountType?.[0] || null,
      fields.activitySector?.[0] || null,
      fields.address?.[0] || null,
      fields.agence?.[0] || null,
      fields.authorization?.[0] || null,
      fields.bankDomiciliation?.[0] || null,
      fields.birthCountry?.[0] || null,
      fields.birthDate?.[0] || null,
      fields.birthPlace?.[0] || null,
      fields.clientNumber?.[0] || null,
      fields.chequeAccountNumber?.[0] || null,
      fields.contractType?.[0] || null,
      fields.email?.[0] || null,
      fields.expiryDate?.[0] || null,
      fields.firstName?.[0] || null,
      fields.gender?.[0] || null,
      fields.identityNumber?.[0] || null,
      fields.identityType?.[0] || null,
      fields.incomeRange?.[0] || null,
      fields.issueDate?.[0] || null,
      fields.issuePlace?.[0] || null,
      fields.jobFunction?.[0] || null,
      fields.lastName?.[0] || null,
      fields.maritalStatus?.[0] || null,
      fields.mobile1Number?.[0] || null,
      fields.mobile1Prefix?.[0] || null,
      fields.mobile2Number?.[0] || null,
      fields.mobile2Prefix?.[0] || null,
      fields.motherName?.[0] || null,
      fields.nationality?.[0] || null,
      parseInt(fields.numberOfChildren?.[0] || "0", 10),
      fields.otherActivities?.[0] || null,
      fields.residenceCountry?.[0] || null,
      fields.savingsAccountNumber?.[0] || null,
      fields.secondNationality?.[0] || null,
      fields.otherAccountNumber?.[0] || null,
      fields.spouseEmployer?.[0] || null,
      fields.spouseJobFunction?.[0] || null,
      fields.spouseOccupation?.[0] || null,
      getFilePath(files.clientPhoto),
      getFilePath(files.clientSignature),
      getFilePath(files.cniBack),
      getFilePath(files.cniFront),
      fields.status?.[0] || "NON FIABILISER",
    ];
    console.log(loggedInUser);

    // Debugging: Verify counts match
    console.log(
      "Columns in SQL:",
      particulierSql.split("\n").filter((line) => line.trim()).length - 2
    );
    console.log("Values count:", particulierValues.length);

    const [result] = await connection.execute(
      particulierSql,
      particulierValues
    );
    const clientId = result.insertId;

    // 6. Insert into historique table
    const historiqueSql = `
      INSERT INTO historique (
        utilisateurId, utilisateurNom, agence, particulierId, clientName, 
        accountType, account, actionType, description, agentType
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const historiqueValues = [
      userId, // Logged-in user's ID
      agentName, // Constructed from prenom and nom
      loggedInUser.agence || null,
      clientId,
      `${fields.firstName?.[0] || ""} ${fields.lastName?.[0] || ""}`.trim(),
      fields.accountType?.[0] || null,
      fields.savingsAccountNumber?.[0] ||
        fields.chequeAccountNumber?.[0] ||
        null,
      "CREATION",
      "Nouveau client enregistré",
      loggedInUser.role || null,
    ];

    await connection.execute(historiqueSql, historiqueValues);

    // 7. Commit transaction
    await connection.commit();

    return NextResponse.json(
      {
        message: "Enregistrement réussi",
        clientId,
        filePaths: {
          clientPhoto: getFilePath(files.clientPhoto),
          clientSignature: getFilePath(files.clientSignature),
          cniBack: getFilePath(files.cniBack),
          cniFront: getFilePath(files.cniFront),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Rollback transaction if connection exists
    if (connection) {
      await connection.rollback();
      connection.release(); // Release the connection back to the pool
    }

    // Handle file size limit exceeded error
    if (error.code === 1009) {
      return NextResponse.json(
        {
          message:
            "La taille totale des fichiers dépasse la limite autorisée (30MB maximum)",
        },
        { status: 413 }
      );
    }
    // Handle duplicate entry error
    if (
      error.code === "ER_DUP_ENTRY" &&
      error.sqlMessage.includes("particulier.email")
    ) {
      return NextResponse.json(
        { message: "Cet utilisateur existe déjà avec cet email." },
        { status: 409 } // 409 Conflict is suitable for duplicate resource
      );
    }
    console.log(error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  } finally {
    // Ensure connection is released even on success
    if (connection) {
      connection.release();
    }
  }
}
