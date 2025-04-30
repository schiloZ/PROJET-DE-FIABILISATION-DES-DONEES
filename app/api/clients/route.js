import { NextRequest, NextResponse } from "next/server";
import db from "../../../libs/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Ensure this is set in your .env file

// GET handler to fetch particulier data based on utilisateurNom from token
export async function GET(request) {
  try {
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
    const utilisateurNom = `${loggedInUser.prenom} ${loggedInUser.nom}`.trim();
    console.log("utilisateurNom:", utilisateurNom);

    // 3. SQL query to join particulier and historique tables
    const query = `
      SELECT p.*
      FROM particulier p
      INNER JOIN historique h ON p.id = h.particulierId
      WHERE h.utilisateurNom = ? and h.description= 'Nouveau client enregistré'
    `;

    // Execute the query with utilisateurNom as a parameter
    const [rows] = await db.execute(query, [utilisateurNom]);

    // If no records are found, return an empty array
    if (rows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Convert LONGBLOB fields to base64 for each record
    const processedRows = rows.map((row) => ({
      ...row,
      clientPhoto: row.clientPhoto
        ? Buffer.from(row.clientPhoto).toString("base64")
        : null,
      clientSignature: row.clientSignature
        ? Buffer.from(row.clientSignature).toString("base64")
        : null,
      cniBack: row.cniBack ? Buffer.from(row.cniBack).toString("base64") : null,
      cniFront: row.cniFront
        ? Buffer.from(row.cniFront).toString("base64")
        : null,
    }));

    return NextResponse.json(processedRows, { status: 200 });
  } catch (error) {
    console.error("Erreur :", error);
    return NextResponse.json(
      { message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}
