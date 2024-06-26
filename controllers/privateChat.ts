import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { MessagesGroupByDate } from "../types/chat";

// GET /api/privateChat
export async function getUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true
        }
    });

    return res.status(200).json({
        success: true,
        data: users
    });
}

// GET /api/privateChat/:userId
export async function getChatInfo(req: Request, res: Response) {
    const user1Id = req.body.user.id;
    const user2Id = req.params.userId;

    let chatRoom = await prisma.chatRoom.findFirst({
        where: {
            isGroup: false,
            OR: [
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

        await prisma.user.update({
            where: {
                id: user1Id
            },
            data: {
                chatRoomIds: {
                    push: chatRoom.id,
                },
            }
        });
        await prisma.user.update({
            where: {
                id: user1Id
            },
            data: {
                chatRoomIds: {
                    push: chatRoom.id,
                },
            }
        });
    }

    res.status(200).json({
        success: true,
        data: chatRoom
    });
}

// GET /api/privateChat/:userId/messages
export async function getChatMessages(req: Request, res: Response) {
    const user1Id = req.body.user.id;
    const user2Id = req.params.userId;

    const chatRoom = await prisma.chatRoom.findFirst({
        where: {
            isGroup: false,
            OR: [
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
                    user: true
                }
            }
        }
    });

    if (!chatRoom) {
        return res.status(404).json({
            success: false
        });
    }

    const messages = chatRoom.messages.map((message) => {
        return {
            id: message.id,
            userId: message.userId,
            createdAt: message.createdAt,
            content: message.content,
            isImage: message.isImage,
            username: message.user.username
        }
    })

    // Group messages by createdAt date
    const groupedMessages: { [key: string]: { Date: string; Messages: typeof messages } } = {};
    messages.forEach((message) => {
        const createdAtDate = message.createdAt.toDateString();
        if (!groupedMessages[createdAtDate]) {
            groupedMessages[createdAtDate] = { Date: createdAtDate, Messages: [] };
        }
        groupedMessages[createdAtDate].Messages.push(message);
    });

    // Convert the groupedMessages object into an array of objects
    const result = Object.values(groupedMessages) as unknown as MessagesGroupByDate[];

    res.status(200).json({
        success: true,
        data: result
    });
}