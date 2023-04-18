import { Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto, LogoutUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import catchAsync from '@/utils/catchAsync';
import httpStatus from 'http-status';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = catchAsync(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;
    const { user, tokenData } = await this.auth.signup(userData);


    res.status(httpStatus.CREATED).send({
      user,
      refresh: tokenData.refreshToken,
      access: tokenData.accessToken,
    });
  });

  public logIn = catchAsync(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;
    const { user, tokenData } = await this.auth.login(userData);

    res.status(httpStatus.OK).send({
      user,
      refresh: tokenData.refreshToken,
      access: tokenData.accessToken,
    });
  });

  public logOut = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userData: User = req.user;
    const body: LogoutUserDto = req.body;
    await this.auth.logout(userData, body.refreshToken);
    res.sendStatus(httpStatus.NO_CONTENT);
  });
}
