import { NextResponse } from "next/server";
import db from "../../../../../libs/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// GET handler to fetch account statistics
export async function GET(request) {
  try {
    // Verify JWT token
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

    // Get user details
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

    // Get total accounts collected by this user
    const [totalAccountsResult] = await db.query(
      `SELECT COUNT(*) as count FROM historique 
         WHERE utilisateurNom = ? AND description = 'Nouveau client enregistré'`,
      [utilisateurNom]
    );
    const totalAccounts = totalAccountsResult[0]?.count || 0;

    // Get weekly accounts (last 7 days)
    const [weeklyAccountsResult] = await db.query(
      `SELECT 
           DAYNAME(createdAt) as day,
           DAYOFWEEK(createdAt) as dayOfWeek,
           COUNT(*) as count 
         FROM historique 
         WHERE utilisateurNom = ? 
           AND description = 'Nouveau client enregistré'
           AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY DAYNAME(createdAt), DAYOFWEEK(createdAt)
         ORDER BY DAYOFWEEK(createdAt)`,
      [utilisateurNom]
    );

    // Get verification status counts
    const [verificationStats] = await db.query(
      `SELECT 
            SUM(CASE WHEN status = 'FIABILISEE' THEN 1 ELSE 0 END) as verified,
            SUM(CASE WHEN status = 'NON FIABILISER' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'ANOMALIE' THEN 1 ELSE 0 END) as rejected
         FROM particulier
         WHERE id IN (
           SELECT particulierId FROM historique 
           WHERE utilisateurNom = ? AND description = 'Nouveau client enregistré'
         )`,
      [utilisateurNom]
    );

    // Format weekly data for chart (default to 0 for days with no data)
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weeklyData = days.map((day, index) => {
      // DAYOFWEEK: 1=Sunday, 2=Monday, ..., 7=Saturday
      const found = weeklyAccountsResult.find((d) => d.dayOfWeek === index + 1);
      return found ? found.count : 0;
    });

    return NextResponse.json(
      {
        totalAccounts,
        weeklyTarget: 150,
        weeklyProgress: weeklyData,
        verificationStatus: verificationStats[0] || {
          verified: 0,
          pending: 0,
          rejected: 0,
        },
        verificationRate: verificationStats[0]
          ? Math.round((verificationStats[0].verified / totalAccounts) * 100)
          : 0,
      },
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
