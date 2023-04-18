import { compare, hash } from 'bcrypt';
import { Service, Container } from 'typedi';
import { DB } from '@database';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { TokenService } from './token.service';
import { TokenObj, TokenTypes } from '@/interfaces/auth.interface';
import httpStatus from 'http-status';

@Service()
export class AuthService {
  public Token = Container.get(TokenService);

  public async signup(userData: CreateUserDto): Promise<{
    tokenData: TokenObj;
    user: User;
  }> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(httpStatus.BAD_REQUEST, 'Email already taken');

    const hashedPassword = await hash(userData.password, 10);

    const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });

    const tokenData = await this.Token.generateAuthTokens(createUserData);

    return { tokenData, user: createUserData };
  }

  public async login(userData: CreateUserDto): Promise<{
    tokenData: TokenObj;
    user: User;
  }> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);

    if (!isPasswordMatching) throw new HttpException(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

    const tokenData = await this.Token.generateAuthTokens(findUser);

    return { tokenData, user: findUser };
  }

  public async logout(userData: User, refreshToken: string): Promise<void> {
    await DB.Tokens.destroy({ where: { token: refreshToken, type: TokenTypes.REFRESH, user_id: userData.id } });
  }
}
