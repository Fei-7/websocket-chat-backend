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

    if (!chatRoom) {
        return res.send(404).json({
            success: false
        });
    }

    res.send(200).json({
        success: true,
        data: chatRoom
    });
}

// GET /api/groupChat/:chatRoomId/messages
export async function getChatMessages(req: Request, res: Response) {
    const chatRoomId = req.params.chatRoomId;

    const chatRoom = await prisma.chatRoom.findUnique({
        where: {
            id: chatRoomId
        },
        select: {
            messages: {
                select: {
                    id: true,
                    userId: true,
                    createdAt: true,
                    content: true,
                    isImage: true,
                }
            }
        }
    });

    if (!chatRoom) {
        return res.send(404).json({
            success: false
        });
    }

    res.send(200).json({
        success: true,
        data: chatRoom.messages
    });
}