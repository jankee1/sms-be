import express, {json} from 'express';
import cors from 'cors';
import {config} from './config/config';

import {homeRouter} from './routers/home.router';
import {messageRouter} from './routers/message.router';

const app = express();

app.use(cors({
    origin: `http://localhost:${config.PORT_CLIENT}`,
}));

app.use(json());

app.use('/', homeRouter)
app.use('/message', messageRouter)


app.listen(config.PORT_SERVER, () => {
    console.log(`PORT_SERVER ${config.PORT_SERVER}`);
    console.log(`PORT_CLIENT ${config.PORT_CLIENT}`);
});