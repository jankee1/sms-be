import {pool} from "../utils/db";
import {FieldPacket, ResultSetHeader} from "mysql2";
import {v4 as uuid} from 'uuid';
import { ValidationError } from "../utils/errors";
import {MessageInterface} from '../types/message.entity'
import {secretKeyGenerator} from '../auth/secretKeyGenerator';


export class MessageRecord implements MessageInterface {

    id: string;
    sender: string;
    body: string;
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

        try {
            const [{affectedRows}] = await pool.execute("INSERT INTO `messages` (`id`,`secretKey`,`sender`,`body`,`deletedAfterRead`) VALUES(:id, :secretKey, :sender, :body, :deletedAfterRead)", {
                id: this.id,
                secretKey: this.secretKey,
                sender: this.sender,
                body: this.body,
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

    getOne() {

    }

    delete() {

    }

    update() {

    }

}
