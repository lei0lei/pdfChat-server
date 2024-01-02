// jwt.middleware.ts
import { verify } from 'jsonwebtoken';
import { jwtConstants } from './auth/constants';


export const jwtMiddleware = (socket, next) => {
  if (socket.handshake.headers && socket.handshake.headers.authorization) {
    const token = socket.handshake.headers.authorization.split(' ')[1]; // Extract the token from the header
    verify(token, jwtConstants.secret, (err, decoded) => { // Replace 'SECRET' with your actual secret
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }    
}