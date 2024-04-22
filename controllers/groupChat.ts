import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

// GET /api/groupChat
export async function getChatRooms(req: Request, res: Response) {
  const userId = req.body.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      chatRooms: {
        where: {
          isGroup: true,
        },
        select: {
          id: true,
          name: true,
          userIds: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
    });
  }

  const groupChatRooms = user.chatRooms;

  return res.status(200).json({
    success: true,
    data: groupChatRooms,
  });
}

// GET /api/groupChat/:chatRoomId
export async function getChatInfo(req: Request, res: Response) {
  const userId = req.body.user.id;
  const chatRoomId = req.params.chatRoomId;

  const chatRoom = await prisma.chatRoom.findUnique({
    where: {
      id: chatRoomId,
    },
    include: {
      users: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!chatRoom) {
    return res.status(404).json({
      success: false,
    });
  }

  if (!chatRoom.userIds.includes(userId)) {
    return res.status(401).json({
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    data: chatRoom,
  });
}

// GET /api/groupChat/:chatRoomId/messages
export async function getChatMessages(req: Request, res: Response) {
  const chatRoomId = req.params.chatRoomId;

  const chatRoom = await prisma.chatRoom.findUnique({
    where: {
      id: chatRoomId,
    },
    select: {
      messages: {
        select: {
          id: true,
          userId: true,
          createdAt: true,
          content: true,
          isImage: true,
        },
      },
    },
  });

  if (!chatRoom) {
    return res.status(404).json({
      success: false,
    });
  }

  res.status(200).json({
    success: true,
    data: chatRoom.messages,
  });
}

// POST /api/groupChat
export async function createGroupChat(req: Request, res: Response) {
  try {
    const userId = req.body.user.id;
    const name = req.body.name;
    const result = await prisma.chatRoom.create({
      data: {
        name: name,
        isGroup: true,
        userIds: [userId],
      },
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
}

//PUT /api/groupChat/:id
export async function joinGroupChat(req: Request, res: Response) {
  try {
    const userId = req.body.user.id;
    const chatRoomId = req.params.id;
    const result = await prisma.chatRoom.update({
      data: {
        userIds: {
          push: userId,
        },
      },
      where: {
        id: chatRoomId,
      },
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
}
