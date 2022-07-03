import { MessageRecord } from './../records/message.record';
import { GetMessage } from './../types/message.entity';
import Router, { Request, Response } from 'express'

export const messageRouter = Router()
    .get('/:sender?/:secretKey?', async (req:Request, res:Response) => {
        if(typeof req.params.sender === 'undefined' || typeof req.params.secretKey === 'undefined') {
            res
                .status(401)
                .json({
                    isSucces: false,
                    errMsg: 'Sender and SecretKey fields cannot be empty',
                })
        } else {
            const data: GetMessage = {
                sender: req.params.sender,
                secretKey: req.params.secretKey
            }
            const msg =  await MessageRecord.getOne(data);

            if(!msg) {
                res
                    .status(401)
                    .json({
                        isSucces: false,
                        errMsg: 'No secret message has been found for the given cirterias',
                    })
            } else {
                res
                    .status(200)
                    .json(msg)
            }
        }

    })
    .post('/', async (req:Request, res:Response) => {
        
            if(!/^[a-zA-Z0-9]+$/.test(req.body.sender) 
            || req.body.sender == '' 
            || typeof req.body.sender == 'undefined'
            || req.body.body == '' 
            || typeof req.body.body == 'undefined') {
                res
                    .status(401)
                    .json({
                        isSukcess: false,
                        errMsg: 'Message or sender field are empty or special characters were used in sender field (only letters and digits are allowed)',
                    })
            } else {
                const msg = new MessageRecord(req.body);

                const data = await msg.insert();
        
                if(!data.isSucces) {
                    res
                        .status(500)
                        .json({
                            isSukcess: false,
                            errMsg: 'Something went wrong. Try again later',
                        })
                } else {
                    res
                        .status(200)
                        .json({
                            isSukcess: true,
                            secretKey: data.secretKey,
                            sender: data.sender
                        })
                }
            }
            
    })