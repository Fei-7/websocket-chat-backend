import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

// GET /api/privateChat/:userId
export async function getChatInfo(req: Request, res: Response) {
    const user1Id = req.body.user.id;
    const user2Id = req.params.userId;

    const chatRoom = await prisma.chatRoom.findFirst({
        include :{
            users: true,
            messages: true,
        },
        where : {
            OR : [
                {
                    userIds: {
                        equals: [user1Id, user2Id]
                    }
                },
                {
                    userIds: {
                        equals: [user2Id, user1Id]
                    }
                }
            ]
        },
    });

    res.send(200).json({
        success: true,
        data: chatRoom
    });
}