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
    .post('/', async (req:Request, res:Response) => {
        const msg = new MessageRecord(req.body);

        const data = await msg.insert();

        if(!data.isSucces) {
            res
                .status(500)
                .json({
                    isSukcess: false,
                    message: 'Something went wrong',
                })
        } else {
            res
                .status(200)
                .json({
                    isSukcess: true,
                    secretKey: data.secretKey
                })
        }
    })
    .delete('/:sender/:secretKey', (req:Request, res:Response) => {
        res
            .status(200)
            .json({
                message: 'delete secret message'
            })
    })