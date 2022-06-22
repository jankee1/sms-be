import Router, { Request, Response } from 'express'

export const messageRouter = Router()
    .get('/', (req:Request, res:Response) => {
        res
            .status(200)
            .json({
                message: 'show secret message'
            })
    })
    .post('/', (req:Request, res:Response) => {
        res
            .status(200)
            .json({
                message: 'send secret message'
            })
    })
    .patch('/', (req:Request, res:Response) => {
        res
            .status(200)
            .json({
                message: 'update secret message'
            })
    })
    .delete('/', (req:Request, res:Response) => {
        res
            .status(200)
            .json({
                message: 'delete secret message'
            })
    })