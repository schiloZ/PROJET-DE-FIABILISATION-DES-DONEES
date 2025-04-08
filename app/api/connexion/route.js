// app/api/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../libs/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request) {
  try {
    await db.getConnection();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const [users] = await db.query(
      "SELECT * FROM utilisateur WHERE email = ?",
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const user = users[0];

    if (!user.mot_de_passe) {
      return NextResponse.json(
        { message: "Erreur avec le mot de passe de l'utilisateur" },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Include more user information in the token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.prenom,
        lastName: user.nom,
        agence: user.agence,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message: "Connexion réussie",
        token,
        user: {
          id: user.id,
          firstName: user.prenom,
          lastName: user.nom,
          email: user.email,
          agence: user.agence,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { message: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
