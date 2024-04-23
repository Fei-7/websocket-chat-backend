import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const jwtSecret = process.env.JWT_SECRET || "";

export async function protect(req: Request, res: Response, next: Function){
    const token = req.cookies.token;

    // Make sure token exists
    if (!token) {
        console.log("TOken not found");
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }

    console.log(req.method);
    try {
        // Verify token
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        console.log(decoded);
        req.body.user = await prisma.user.findUniqueOrThrow({
            where: {
                id: decoded.id
            }
        });

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route",
        });
    }
}