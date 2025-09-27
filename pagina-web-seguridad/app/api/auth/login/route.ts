import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validación mínima de entrada
    if (!email || !password) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 400 }
      );
    }

    // Conexión a la BD
    const client = await clientPromise;
    const db = client.db("usuariosdb");
    const users = db.collection("users");

    // Buscar usuario por email
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Respuesta con token + datos del usuario
    return NextResponse.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}

