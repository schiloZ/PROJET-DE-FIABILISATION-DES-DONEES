import db from "../../../libs/db"; // Importation de la connexion à la base de données
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await db.getConnection();
    return new Response(JSON.stringify({ message: "Connected to Database" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
  }
} // Réponse JSON avec le message de connexion réussie
