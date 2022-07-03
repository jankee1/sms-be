import express, {json} from 'express';
import rateLimit from 'express-rate-limit'
import cors from 'cors';
import {config} from './config/config';

import {homeRouter} from './routers/home.router';
import {messageRouter} from './routers/message.router';
import {handleErrors} from './utils/errors'

const app = express();

app.use(cors({
    origin: `http://localhost:${config.PORT_CLIENT}`,
}));

app.use(json());

app.use('/', homeRouter)
app.use('/message', messageRouter)

app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}))

app.use(handleErrors)


app.listen(config.PORT_SERVER, '0.0.0.0', () => {
    console.log(`PORT_SERVER ${config.PORT_SERVER}`);
    console.log(`PORT_CLIENT ${config.PORT_CLIENT}`);
});