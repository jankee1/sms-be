export interface MessageInterface {
    id: string;
    sender: string;
    secretKey?: string;
    body: string;
    deletedAfterRead: boolean;
    createdAt?: string;
}
export type GetMessage = {
    sender: string;
    secretKey: string;
    
}