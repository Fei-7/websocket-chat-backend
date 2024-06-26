

export type toServerTextMessage = {
    text: string
};

export type toServerImageMessage = {
    type: string,
    size: number,
    buffer: Buffer
};

export type toClientMessage = {
    id: string;
    userId: string;
    username: string;
    createdAt: string;
    content: string;
    isImage: boolean;
};
export type Message = {
    id: string;
    userId: string;
    username: string;
    createdAt: Date;
    content: string;
    isImage: boolean;
}
  
export type MessagesGroupByDate = {
    Date: string;
    Messages: Message[];
}