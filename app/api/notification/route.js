import { NextRequest, NextResponse } from "next/server";
import db from "../../../libs/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Ensure this is set in your .env file

// GET handler to fetch anomalie records for the connected agent
export async function GET(request) {
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

    // 3. Fetch anomalies where agentFiabilisation matches utilisateurNom
    const [anomalies] = await db.query(
      "SELECT id, clientFullName, clientBirthDate, accountNumber, agentCollect, agentFiabilisation, comments FROM anomalie WHERE agentCollect = ? ORDER BY createdAt DESC",
      [utilisateurNom]
    );

    // 4. Return the anomalies
    return NextResponse.json(
      {
        message: "Anomalies retrieved successfully",
        data: anomalies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur :", error);
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an anomalie record
export async function DELETE(request) {
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

    // 3. Get anomaly ID from query parameters
    const url = new URL(request.url);
    const anomalyId = url.searchParams.get("id");
    if (!anomalyId) {
      return NextResponse.json(
        { message: "Anomaly ID is required" },
        { status: 400 }
      );
    }

    // 4. Verify the anomaly exists and belongs to the user's agentCollect
    const [anomalies] = await db.query(
      "SELECT id FROM anomalie WHERE id = ? AND agentCollect = ?",
      [anomalyId, utilisateurNom]
    );
    if (!Array.isArray(anomalies) || anomalies.length === 0) {
      return NextResponse.json(
        { message: "Anomaly not found or not authorized to delete" },
        { status: 404 }
      );
    }

    // 5. Delete the anomaly
    await db.query("DELETE FROM anomalie WHERE id = ?", [anomalyId]);

    // 6. Return success response
    return NextResponse.json(
      { message: "Anomaly deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur :", error);
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 }
    );
  }
}
