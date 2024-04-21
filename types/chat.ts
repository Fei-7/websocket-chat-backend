export type toServerTextMessage = {
    text: string
};

export type toClientMessage = {
    id: string;
    userId: string;
    createdAt: string;
    content: string;
    isImage: boolean;
};

export type toServerImageMessage = {
    type: string,
    size: number,
    buffer: Buffer
};