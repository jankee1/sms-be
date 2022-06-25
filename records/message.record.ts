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
    deletedAfterRead: boolean;
    createdAt?: string;
    secretKey: string;

    constructor(obj: MessageRecord) {
        if(obj.sender == '' || obj.sender.length > 30)
            throw new ValidationError("Field sender cannot be empty or longer than 30 characters")
        if(obj.body == '' || obj.body.length > 500)
            throw new ValidationError("Message cannot be empty or longer than 500 characters")
        if(typeof obj.deletedAfterRead != 'boolean')
            throw new ValidationError("Value of delete after read field is incorrect")

        this.id = obj.id;
        this.sender = obj.sender;
        this.body = obj.body;
        this.deletedAfterRead = obj.deletedAfterRead;
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
        console.log(this)

        try {
            const [{affectedRows}] = await pool.execute("INSERT INTO `messages` (`id`,`secretKey`,`sender`,`body`, `ivCrypto`, `keyCrypto`,`deletedAfterRead`) VALUES(:id, :secretKey, :sender, :body, :ivCrypto, :keyCrypto, :deletedAfterRead)", {
                id: this.id,
                secretKey: this.secretKey,
                sender: this.sender,
                body: this.body,
                ivCrypto: this.ivCrypto,
                keyCrypto: this.keyCrypto,
                deletedAfterRead:this.deletedAfterRead
            }) as ResultSetHeader[];
            if(affectedRows){
                return {
                    isSucces: true,
                    secretKey: this.secretKey
                };
            }
        } catch(e) {
            console.error("Insert error: ", e)
            return {isSucces}
        }
    }

    static async getOne(getMessage: GetMessage): Promise<OneMessageFromDB | null> {
        const [data] = await pool.execute("SELECT `sender`,`body`, `ivCrypto`, `keyCrypto` FROM `messages` WHERE sender = :sender AND secretKey = :secretKey", {
            sender: getMessage.sender,
            secretKey: getMessage.secretKey
        }) as GetMessageResult;
        if(data.length === 0)
            return null;

        const msg = data[0];

        const msgBody = await decryptMessage({ivCrypto: msg.ivCrypto, body: msg.body, keyCrypto: msg.keyCrypto})

        return {
            sender: msg.sender,
            body: msgBody,
            secretKey: msg.secretKey
        };
    }

    private async deleteAfter24h() {
        console.log("Here the message will be deleted after 24h");
    }


}
