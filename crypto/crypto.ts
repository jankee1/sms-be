import {DecryptedMessage} from '../types/message.entity';
//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

// //Encrypting text
// export const encryptMessage = (text: string): DecryptedMessage => {
//     const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return { iv: iv.toString('hex'), body: encrypted.toString('hex') };
// }

// // Decrypting text
// export const decryptMessage = (text: DecryptedMessage): string => {
//     const iv = Buffer.from(text.iv, 'hex');
//     const encryptedText = Buffer.from(text.body, 'hex');
//     const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
// }

//Encrypting text
export const encryptMessage = async (body: string): Promise<DecryptedMessage> => {
    const iv = await crypto.randomBytes(16);
    const key = await crypto.randomBytes(32);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(body, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(key);
    return { 
        ivCrypto: iv.toString('hex'), 
        keyCrypto: key.toString('hex'), 
        body: encrypted
    };
}

// Decrypting text
export const decryptMessage = async (text: DecryptedMessage): Promise<string> => {

    const iv = Buffer.from(text.ivCrypto, 'hex');
    const key = Buffer.from(text.keyCrypto, 'hex')
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text.body, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}