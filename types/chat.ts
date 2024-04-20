export type toServerTextMessage = {
    text: string
};

export type toClientTextMessage = {
    userId: string;
    createdAt: Date;
    content: string;
};