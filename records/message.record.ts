import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';


export class MessageRecord  {

    id: string;
    sender: string;
    secretKey?: string;
    body: string;
    deletedAfterRead: boolean;
    createdAt?: string;

    constructor() {
        
    }

    insert() {

    }

    getOne() {

    }

    delete() {

    }

    update() {

    }

}
