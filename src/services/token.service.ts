import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY, TOKEN_EXPIRES_IN } from '@config';
import { DB } from '@database';
import { DataStoredInToken, TokenData, TokenObj, TokenPayload, TokenTypes } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import moment from 'moment';

type ExpiresIn = {
  value: number;
  unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
};

@Service()
export class TokenService {
  public async createToken(user: User, expiresIn: ExpiresIn, type: TokenTypes): Promise<TokenData> {
    const dataStoredInToken: DataStoredInToken = {
      sub: user.id,
      iat: moment().unix(),
      exp: moment()
        .add(expiresIn.value, expiresIn.unit as moment.unitOfTime.DurationConstructor)
        .unix(),
      type,
    };

    return { token: sign(dataStoredInToken, SECRET_KEY) };
  }

  public async verifyToken(token: string): Promise<TokenPayload> {
    const decoded = verify(token, SECRET_KEY) as any;

    const tokenDoc = await DB.Tokens.findOne({
      where: {
        token,
        user_id: decoded.sub,
        type: decoded.type,
      },
    });

    if (!tokenDoc) throw new Error('Token not found');

    return tokenDoc;
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  public async generateAuthTokens(user: User): Promise<TokenObj> {
    const accessToken = await this.createToken(
      user,
      {
        value: parseInt(TOKEN_EXPIRES_IN, 10),
        unit: 'days',
      },
      TokenTypes.ACCESS,
    );

    const refreshToken = await this.createToken(
      user,
      {
        value: parseInt(TOKEN_EXPIRES_IN, 10) + 10,
        unit: 'days',
      },
      TokenTypes.REFRESH,
    );

    const tokenDoc = await DB.Tokens.create({
      token: refreshToken.token,
      user_id: user.id,
      type: TokenTypes.REFRESH,
    });

    return { accessToken, refreshToken, tokenDoc };
  }

  public async generateResetPasswordToken(user: User): Promise<TokenData> {
    const token = await this.createToken(
      user,
      {
        value: 1,
        unit: 'hours',
      },
      TokenTypes.RESET_PASSWORD,
    );

    await DB.Tokens.create({
      token: token.token,
      user_id: user.id,
      type: TokenTypes.RESET_PASSWORD,
    });

    return token;
  }

  public async generateVerifyEmailToken(user: User): Promise<TokenData> {
    const token = await this.createToken(
      user,
      {
        value: 1,
        unit: 'hours',
      },
      TokenTypes.VERIFY_EMAIL,
    );

    await DB.Tokens.create({
      token: token.token,
      user_id: user.id,
      type: TokenTypes.VERIFY_EMAIL,
    });

    return token;
  }
}
