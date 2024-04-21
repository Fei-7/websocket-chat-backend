import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

// GET /api/groupChat/:chatRoomId
export async function getChatInfo(req: Request, res: Response) {
    const chatRoomId = req.params.chatRoomId;

    const chatRoom = await prisma.chatRoom.findUnique({
        where: {
            id: chatRoomId
        },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                }
            }
        }
    });

    res.send(200).json({
        success: true,
        data: chatRoom
    });
}