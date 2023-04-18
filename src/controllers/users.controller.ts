import { Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import catchAsync from '@/utils/catchAsync';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = catchAsync(async (req: Request, res: Response) => {
    const findAllUsersData: User[] = await this.user.findAllUser();

    res.status(200).json({ data: findAllUsersData, message: 'findAll' });
  });

  public getUserById = catchAsync(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const findOneUserData: User = await this.user.findUserById(userId);

    res.status(200).json({ data: findOneUserData, message: 'findOne' });
  });

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const userData: CreateUserDto = req.body;
    const createUserData: User = await this.user.createUser(userData);

    res.status(201).json({ data: createUserData, message: 'created' });
  });

  public updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const userData: CreateUserDto = req.body;
    const updateUserData: User = await this.user.updateUser(userId, userData);

    res.status(200).json({ data: updateUserData, message: 'updated' });
  });

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const deleteUserData: User = await this.user.deleteUser(userId);

    res.status(200).json({ data: deleteUserData, message: 'deleted' });
  });
}
