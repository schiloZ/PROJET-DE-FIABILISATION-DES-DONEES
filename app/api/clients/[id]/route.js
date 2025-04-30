import { NextRequest, NextResponse } from "next/server";
import db from "../../../../libs/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// GET handler to fetch a specific particulier by ID
export async function GET(request, { params }) {
  try {
    // 1. Verify JWT token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication token missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
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

    const { id } = params;

    // 2. SQL query to fetch the specific particulier
    const query = "SELECT * FROM particulier WHERE id = ?";

    // Execute the query with the ID parameter
    const [rows] = await db.execute(query, [id]);

    // If no record is found, return 404
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    const clientData = rows[0];

    // Convert LONGBLOB fields to base64
    const processedData = {
      ...clientData,
      clientPhoto: clientData.clientPhoto
        ? Buffer.from(clientData.clientPhoto).toString("base64")
        : null,
      clientSignature: clientData.clientSignature
        ? Buffer.from(clientData.clientSignature).toString("base64")
        : null,
      cniBack: clientData.cniBack
        ? Buffer.from(clientData.cniBack).toString("base64")
        : null,
      cniFront: clientData.cniFront
        ? Buffer.from(clientData.cniFront).toString("base64")
        : null,
    };

    return NextResponse.json(processedData, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    // 1. Verify JWT token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authentication token missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
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

    const utilisateurId = decoded.id;
    const { id } = params;

    // 2. Validate the 'id' parameter
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { message: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    // 3. Fetch utilisateur details
    const [userRows] = await db.execute(
      "SELECT prenom, nom, agence, role FROM utilisateur WHERE id = ?",
      [utilisateurId]
    );
    if (userRows.length === 0) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const { prenom, nom, agence, role: agentType } = userRows[0];
    const utilisateurNom = `${prenom} ${nom}`.trim();

    // 4. Fetch particulier/client details before update
    const [clientRows] = await db.execute(
      "SELECT id, firstName, lastName, accountType, savingsAccountNumber, chequeAccountNumber, otherAccountNumber FROM particulier WHERE id = ?",
      [id]
    );
    if (clientRows.length === 0) {
      return NextResponse.json(
        { message: `Client avec ID ${id} introuvable` },
        { status: 404 }
      );
    }

    const client = clientRows[0];
    const clientName = `${client.firstName} ${client.lastName}`;
    const accountType = client.accountType;
    const account =
      client.savingsAccountNumber ||
      client.chequeAccountNumber ||
      client.otherAccountNumber;

    // 5. Update the particulier in the database
    const updateData = await request.json();
    const [updateResult] = await db.query(
      "UPDATE particulier SET ? WHERE id = ?",
      [updateData, id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { message: "Client not found or no changes made" },
        { status: 404 }
      );
    }

    // 6. Insert into historique
    const description = "Les détails du client ont été mis à jour";
    const actionType = "UPDATE";

    await db.execute(
      `INSERT INTO historique (
        utilisateurId,
        utilisateurNom,
        agence,
        particulierId,
        clientName,
        accountType,
        account,
        actionType,
        description,
        agentType
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        utilisateurId,
        utilisateurNom,
        agence,
        id,
        clientName,
        accountType,
        account,
        actionType,
        description,
        agentType,
      ]
    );

    return NextResponse.json(
      { message: "Client updated successfully and historique logged" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
