import dotenv from 'dotenv'
dotenv.config({path:'./src/.env'})
import { CookieOptions, Response ,Request} from 'express';
import { createResponse } from './createResponse.utils';



export function setCookie(
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  const defaultOptions: CookieOptions = {
    httpOnly: true, 
    sameSite: 'lax', 
    maxAge: 14 * 24 * 60 * 60 * 1000 
  };

  const cookieOptions = { ...defaultOptions, ...options };
  res.cookie(name, value, cookieOptions);
}

export function logout(req: Request, res: Response): void {
  console.log('logout function called');
  res.clearCookie('refreshToken', {
    httpOnly: true, 
    sameSite: 'lax', 
    domain:'localhost'
  });

  res.status(200).json(createResponse(200,'logout successfully'));
}
