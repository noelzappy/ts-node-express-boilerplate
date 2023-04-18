import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@interfaces/users.interface';

export type UserCreationAttributes = Optional<User, 'id'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  declare id: number;
  public email: string;
  public password: string;
  public name: string;
  public first_name: string;
  public last_name: string;
  public phone: string;
  public id_number: string;
  public id_type: string;
  public is_verified: boolean;
  public is_email_verified: boolean;
  public role: 'admin' | 'user';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      first_name: {
        allowNull: true,
        type: DataTypes.STRING(45),
      },
      last_name: {
        allowNull: true,
        type: DataTypes.STRING(45),
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING(45),
      },
      id_number: {
        allowNull: true,
        type: DataTypes.STRING(45),
      },
      id_type: {
        allowNull: true,
        type: DataTypes.STRING(45),
      },
      is_verified: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_email_verified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
      },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );

  return UserModel;
}
