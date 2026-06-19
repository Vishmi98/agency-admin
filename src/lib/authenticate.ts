import { NextRequest, NextResponse } from "next/server";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { JWT_SECRET } from "@/constants/env";
import { AuthUser } from "@/type/user.type";


export async function authenticate(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { status: "error", message: "Unauthorized: No token provided" },
            { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET || "11223344556677") as AuthUser;

        // Return user info if valid
        return decoded;
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized: Expired token" },
                { status: 401 }
            );
        } else if (err instanceof JsonWebTokenError) {
            return NextResponse.json(
                { status: "error", message: "Unauthorized: Invalid token" },
                { status: 401 }
            );
        } else {
            return NextResponse.json(
                { status: "error", message: "Unauthorized: Token verification failed" },
                { status: 401 }
            );
        }
    }
}
