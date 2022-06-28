
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

export type OneMessageFromDB = {
    sender: string;
    secretKey: string;
    ivCrypto?: string;
    keyCrypto?: string;
    body: string;
}
export type DecryptedMessage = {
    ivCrypto: string; 
    keyCrypto: string;
    body: string;
}