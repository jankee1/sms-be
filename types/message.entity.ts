
export interface MessageInterface {
    id: string;
    sender: string;
    secretKey?: string;
    body: string;
    toBeDeletedAfterRead: boolean;
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
    createdAt: Date | string;
}
export type DecryptedMessage = {
    ivCrypto: string; 
    keyCrypto: string;
    body: string;
}

export type CreateMessageApiResponse = {
    isSucces: boolean
    secretKey: string
    sender?: string,
    errMsg?: string

}

export type ReadMessageApiResponse = {

}