import { user } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || "";
const jwtCookieExpire = parseInt(process.env.JWT_COOKIE_EXPIRE || "1");

export async function register(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        const createdUser = await prisma.user.create({
            data: {
                username: username,
                hashedPassword: hashedPassword
            }
        });

        sendTokenResponse(createdUser, 201, res);
    } catch (err) {
        res.status(400).json({ success: false });
        console.error(err);
    }
}

export async function login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide username and password",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    });
    if (!user) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid credentials" 
        });
    }

    const validPassword = await bcrypt.compareSync(password, user.hashedPassword);
    if (!validPassword) {
        return res.status(401).json({ 
            success: false, 
            message: "Invalid credentials" 
        });
    }

    sendTokenResponse(user, 200, res);
}

function sendTokenResponse(user: user, statusCode: number, res: Response) {
    const token = jwt.sign({
        id: user.id
    }, jwtSecret, {
        expiresIn: process.env.JWT_EXPIRE
    });
    const options = {
        expires: new Date(
            Date.now() + jwtCookieExpire * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token: token
    });
}