import { Server } from "socket.io";
import { toClientMessage, toServerImageMessage, toServerTextMessage } from "../types/chat";
import { prisma } from "../lib/prisma";
import http from "http";

export let io: Server;

// A map mapping from chatRoomId to array of all the socketId in the chatRoom
const chatRoomIdToArrayOfSocketId = new Map<string, string[]>();

const onlineUsers:{
    id: string
    username: string
}[]  = [];

export function setup(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["chatRoomId", "userId"],
            credentials: true
        },
        maxHttpBufferSize: 5 * 1e6,
        pingTimeout: 60000
    });

    io.on('connection', async (socket) => {
        const socketId = socket.id;
        const chatRoomId = socket.handshake.headers['chatRoomId'] as string;
        const userId = socket.handshake.headers['userId'] as string;
        console.log('A user connected', chatRoomId, socketId, userId);

        // if such chatRoom doesn't exists in the map create one
        if (!chatRoomIdToArrayOfSocketId.has(chatRoomId)) {
            chatRoomIdToArrayOfSocketId.set(chatRoomId, []);
        }

        // put the current socketId into the map
        chatRoomIdToArrayOfSocketId.get(chatRoomId)?.push(socketId);

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                username: true
            }
        });

        if (!user) {
            socket.disconnect();
            return;
        }

        onlineUsers.push(user);

        socket.broadcast.emit("online users update", onlineUsers);

        // Handle chat text messages
        socket.on('chat text message', async (message: toServerTextMessage) => {
            /* Handle chat message */
            console.log(message);

            // save message into db
            const savedMessage = await prisma.message.create({
                data: {
                    content: message.text,
                    isImage: false,
                    chatRoomId: chatRoomId,
                    userId: userId
                }
            });

            // construct a toClientMessage object to send back to clients
            const messageToClient: toClientMessage = {
                id: savedMessage.id,
                userId: savedMessage.userId,
                createdAt: savedMessage.createdAt.toISOString(),
                content: savedMessage.content,
                isImage: savedMessage.isImage
            };

            // emits message back
            const socketsInTheRoom = chatRoomIdToArrayOfSocketId.get(chatRoomId) as string[];
            io.to(socketsInTheRoom).emit('chat text message', messageToClient);
        });

        socket.on('chat image message', async (message: toServerImageMessage) => {
            console.log(message);
            try {
                /*
                TODO : save image to wherever and get the url
                 */

                const imageURL = "";

                // save message into db
                const savedMessage = await prisma.message.create({
                    data: {
                        content: imageURL,
                        isImage: true,
                        chatRoomId: chatRoomId,
                        userId: userId
                    }
                });

                // construct a toClientMessage object to send back to clients
                const messageToClient: toClientMessage = {
                    id: savedMessage.id,
                    userId: savedMessage.userId,
                    createdAt: savedMessage.createdAt.toISOString(),
                    content: savedMessage.content,
                    isImage: savedMessage.isImage
                };
    
                // emits image back
                const socketsInTheRoom = chatRoomIdToArrayOfSocketId.get(chatRoomId) as string[];
                io.to(socketsInTheRoom).emit('chat image message', messageToClient);
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('disconnect', () => {
            const socketsInTheRoom = chatRoomIdToArrayOfSocketId.get(chatRoomId) as string[];
            let indexToRemove = -1;
            if (socketsInTheRoom) {
                const socketIdToRemove = socketId;
                indexToRemove = socketsInTheRoom.indexOf(socketIdToRemove);
                if (indexToRemove >= 0) {
                    socketsInTheRoom.splice(indexToRemove, 1);
                }
                if (socketsInTheRoom.length === 0) {
                    chatRoomIdToArrayOfSocketId.delete(chatRoomId);
                }
            }

            const userIdToRemove = userId;
            indexToRemove = -1;
            for (let i=0;i<onlineUsers.length;i++) {
                if (onlineUsers[i].id === userIdToRemove) {
                    indexToRemove = i;
                    break;
                }
            }
            if (indexToRemove >= 0) {
                onlineUsers.splice(indexToRemove, 1);
            }

            socket.broadcast.emit("online users update", onlineUsers);
    
            console.log('A user disconnected');
        });
    });
}
