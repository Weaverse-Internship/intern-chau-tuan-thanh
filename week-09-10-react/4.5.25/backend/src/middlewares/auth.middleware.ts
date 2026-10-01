import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET?.trim()) {
    throw new Error('JWT_SECRET must be configured')
}


declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Lấy token từ header
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]  

  if (!token) {
    return res.status(401).json({ error: 'Cần đăng nhập' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    req.userId = decoded.userId  
    next()                       
  } 
  catch (error) {
    res.status(401).json({ error})
  }
}