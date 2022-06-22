import Router, { Request, Response } from 'express'

export const homeRouter = Router()
    .get('/', (req:Request, res:Response) => {
        res
            .status(200)
            .json({
                message: 'this is main page'
            })
    })