import {v4 as uuid} from 'uuid';

export const secretKeyGenerator = () =>{
    const randomString = uuid().replace('-','').slice(0,10);
    return randomString;
}