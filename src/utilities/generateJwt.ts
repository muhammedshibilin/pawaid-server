import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function generateJwtToken(payload: object, secretKeyType: 'access' | 'refresh' | 'reset', expiresIn: string): string {
    let secretKey: string | undefined;
    
    if (secretKeyType === 'access') {
        secretKey = process.env.JWT_SECRET;
    } else if (secretKeyType === 'refresh') {
        secretKey = process.env.JWT_REFRESH_SECRET;
    } else if (secretKeyType === 'reset') {
        secretKey = process.env.JWT_RESET;
    } else {
        throw new Error('Invalid secret type');
    }

    if (!secretKey) {
        throw new Error('Missing secret key');
    }

    return jwt.sign(payload, secretKey, { expiresIn: expiresIn as unknown as number | string });
}
