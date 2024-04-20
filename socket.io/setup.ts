import { Server } from "socket.io";
import { toClientTextMessage, toServerTextMessage } from "../types/chat";
import { prisma } from "../lib/prisma";

const chatRoomIdToArrayOfSocketId = new Map<string, string[]>();

export default function setup(io: Server) {
    io.on('connection', (socket) => {
        const socketId = socket.id;
        const chatRoomId = socket.handshake.headers['chatRoomId'] as string;
        const userId = socket.handshake.headers['userId'] as string;
        console.log('A user connected', chatRoomId, socketId, userId);


        if (!chatRoomIdToArrayOfSocketId.has(chatRoomId)) {
            chatRoomIdToArrayOfSocketId.set(chatRoomId, []);
        }

        // Handle chat text messages
        socket.on('chat text message', async (message: toServerTextMessage) => {
            /* Handle chat message */
            console.log(message);

            // save message into db
            const savedMessage = await prisma.message.create({
                data: {
                    content: message.text,
                    chatRoomId: chatRoomId,
                    userId: userId
                }
            });

            // construct a toClientTextMessage object to send back to clients
            const messageToClient: toClientTextMessage = {
                userId: savedMessage.userId,
                createdAt: savedMessage.createdAt,
                content: savedMessage.content
            };

            // emits message back
            const socketsInTheRoom = chatRoomIdToArrayOfSocketId.get(chatRoomId) as string[];
            io.to(socketsInTheRoom).emit('chat text message', messageToClient);
        });

        socket.on('disconnect', () => {
            const socketsInTheRoom = chatRoomIdToArrayOfSocketId.get(chatRoomId) as string[];
            if (socketsInTheRoom) {
                const socketIdToRemove = socketId;
                const indexToRemove = socketsInTheRoom.indexOf(socketIdToRemove);
                if (indexToRemove >= 0) {
                    socketsInTheRoom.splice(indexToRemove, 1);
                }
                if (socketsInTheRoom.length === 0) {
                    chatRoomIdToArrayOfSocketId.delete(chatRoomId);
                }
            }
    
            console.log('A user disconnected');
        });
    });
}