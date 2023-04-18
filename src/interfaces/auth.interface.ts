import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { TokenModel } from '@/models/tokens.model';

export interface DataStoredInToken {
  sub: number;
  iat: number;
  exp: number;
  type: TokenTypes;
}

export interface TokenData {
  token: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export enum TokenTypes {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'reset_password',
  VERIFY_EMAIL = 'verify_email',
}

export interface TokenPayload {
  token: string;
  id: number;
  type: TokenTypes;
  user_id: number;
}

export interface TokenObj {
  accessToken: TokenData;
  refreshToken: TokenData;
  tokenDoc: TokenModel;
}
