import { MessageRecord } from './../records/message.record';
import { MessageInterface, GetMessage } from './../types/message.entity';
import Router, { Request, Response } from 'express'

export const messageRouter = Router()
    .get('/:sender?/:secretKey?', (req:Request, res:Response) => {
        const msg = req.params as GetMessage;


        console.log(msg);
        res
            .status(200)
            .json({
                message: 'show secret message',
                ...msg
            })
    })
    .post('/', (req:Request, res:Response) => {
        const msg = new MessageRecord(req.body);

        try {
            msg.insert();
        } catch(e) {
            console.error("Insert error: ", e) // TODO zrobic komunikat na stronie
        }

        console.log(msg);
        res
            .status(200)
            .json({
                message: 'send secret message',
                ...msg
            })
    })
    .delete('/:sender/:secretKey', (req:Request, res:Response) => {
        res
            .status(200)
            .json({
                message: 'delete secret message'
            })
    })