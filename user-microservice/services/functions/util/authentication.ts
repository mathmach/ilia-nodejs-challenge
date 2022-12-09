import jwt, { Jwt } from 'jsonwebtoken';

export default class Authentication {
  static readToken(token: string): Jwt {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new Error('JWT must be provided.');
    }
  }

  static createToken(user: any): string {
    return jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }
}
