import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // ... you will write your Prisma Client queries here
    // const user1 = await prisma.user.create({
    //     data: {
    //         username: "USER1_TEST",
    //         hashedPassword: "root"
    //     }
    // });

    // const user2 = await prisma.user.create({
    //     data: {
    //         username: "USER2_TEST",
    //         hashedPassword: "root"
    //     }
    // });

    // const newChat = await prisma.chatRoom.create({
    //     data: {
    //         name: "hihi",
    //         userIds: [user1.id, user2.id]
    //     }
    // });

    const user1Id = "6624c13178ea4ac142ca861c";
    const user2Id = "6624c13278ea4ac142ca861d";

    // console.log(newChat);

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

    console.log(chatRoom);
}

main()
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })