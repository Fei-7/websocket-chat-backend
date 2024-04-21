import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

// GET /api/privateChat/:userId
export async function getChatInfo(req: Request, res: Response) {
    const user1Id = req.body.user.id;
    const user2Id = req.params.userId;

    let chatRoom = await prisma.chatRoom.findFirst({
        where : {
            isGroup: false,
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
        chatRoom = await prisma.chatRoom.create({
            data: {
                isGroup: false,
                userIds: [user1Id, user2Id]
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
    }

    res.send(200).json({
        success: true,
        data: chatRoom
    });
}

// GET /api/privateChat/:userId/messages
export async function getChatMessages(req: Request, res: Response) {
    const user1Id = req.body.user.id;
    const user2Id = req.params.userId;

    const chatRoom = await prisma.chatRoom.findFirst({
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