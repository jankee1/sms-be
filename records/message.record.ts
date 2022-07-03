import {pool} from "../utils/db";
import {FieldPacket, ResultSetHeader} from "mysql2";
import {v4 as uuid} from 'uuid';
import { ValidationError } from "../utils/errors";
import {MessageInterface, GetMessage, OneMessageFromDB, DecryptedMessage} from '../types/message.entity'
import {secretKeyGenerator} from '../crypto/secretKeyGenerator';
import {encryptMessage, decryptMessage} from '../crypto/crypto';

type GetMessageResult = [OneMessageFromDB[], FieldPacket[]]

export class MessageRecord implements MessageInterface {

    id: string;
    sender: string;
    body: string;
    ivCrypto?: string;
    keyCrypto: string;
    toBeDeletedAfter24h: boolean;
    createdAt?: string;
    secretKey: string;

    constructor(obj: MessageRecord) {
        if(obj.sender == '' || obj.sender.length > 30)
            throw new ValidationError("Field sender cannot be empty or longer than 30 characters")
        if(obj.body == '' || obj.body.length > 500)
            throw new ValidationError("Message cannot be empty or longer than 500 characters")
        if(typeof obj.toBeDeletedAfter24h != 'boolean')
            throw new ValidationError("Value of delete after read field is incorrect")

        this.id = obj.id;
        this.sender = obj.sender;
        this.body = obj.body;
        this.toBeDeletedAfter24h = obj.toBeDeletedAfter24h;
        this.createdAt = obj.createdAt;
        this.secretKey = obj.secretKey
    }

    async insert() {
        if(!this.id)
            this.id = uuid();
        if(!this.secretKey)
            this.secretKey = secretKeyGenerator();

        let isSucces: boolean = false;

        const msg: DecryptedMessage = await encryptMessage(this.body);

        this.body = msg.body;
        this.ivCrypto = msg.ivCrypto;
        this.keyCrypto = msg.keyCrypto

        try {
            const [{affectedRows}] = await pool.execute("INSERT INTO `messages` (`id`,`secretKey`,`sender`,`body`, `ivCrypto`, `keyCrypto`) VALUES(:id, :secretKey, :sender, :body, :ivCrypto, :keyCrypto)", {
                id: this.id,
                secretKey: this.secretKey,
                sender: this.sender,
                body: this.body,
                ivCrypto: this.ivCrypto,
                keyCrypto: this.keyCrypto,
            }) as ResultSetHeader[];

            if(affectedRows){

                // if(this.toBeDeletedAfter24h)
                //     this.deleteAfter24h(this.id);

                return {
                    isSucces: true,
                    secretKey: this.secretKey,
                    sender: this.sender
                };
            }
        } catch(e) {
            console.error("Insert error: ", e)
            return {isSucces}
        }
    }

    static async getOne(getMessage: GetMessage): Promise<OneMessageFromDB | null> {
        const [data] = await pool.execute("SELECT `id`, `sender`,`body`, `ivCrypto`, `keyCrypto`, `createdAt` FROM `messages` WHERE sender = :sender AND secretKey = :secretKey", {
            sender: getMessage.sender,
            secretKey: getMessage.secretKey
        }) as GetMessageResult;
        if(data.length === 0)
            return null;

        const msg = data[0];

        const msgBody = await decryptMessage({ivCrypto: msg.ivCrypto, body: msg.body, keyCrypto: msg.keyCrypto});
        
        // this.deleteNow(msg.id);

        return {
            sender: msg.sender,
            body: msgBody,
            secretKey: msg.secretKey,
            createdAt: msg.createdAt.toLocaleString()
        };
    }

    private async deleteAfter24h(id: string): Promise<void> {
        setTimeout( async () => {
            try {
                await pool.execute("DELETE FROM `messages` WHERE id = :id", {
                    id
                })
            }
            catch(e) {
                console.error('deleteAfter24h Error: ', e)
            }
        }, 1000 * 60 * 60 * 24)
        
    }


    private static async deleteNow(id: string): Promise<void> {
        try {
            await pool.execute("DELETE FROM `messages` WHERE id = :id", {
                id
            })
        }catch(e) {
            console.error('deleteNow Error: ', e)
        }
    }


}
