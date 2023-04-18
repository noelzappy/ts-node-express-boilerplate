import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  public name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}

export class UpdateUserDto {
  @IsString()
  @MinLength(9)
  public password: string;

  @IsString()
  @MinLength(2)
  public name: string;
}

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
export class LogoutUserDto {
  @IsString()
  @IsNotEmpty()
  public refreshToken: string;
}
