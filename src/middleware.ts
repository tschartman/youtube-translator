import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET:string = process.env.JWT_SECRET as string

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any) => {
    if (err) {
     return res.sendStatus(403);
    }
    next();
  })
}