import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { nombre, email, password } = await req.json();

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("usuariosdb");
    const users = db.collection("users");

    // Verifica si ya existe el usuario
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // Hashea contraseña (costo 12 más seguro que 10)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insertar usuario
    await users.insertOne({
      nombre,
      email,
      password: hashedPassword,
      role: "user", // default role
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Usuario registrado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}

