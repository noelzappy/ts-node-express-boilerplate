import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { TokenPayload, TokenTypes } from '@/interfaces/auth.interface';
import { UserModel } from './users.model';

export type TokenCreationAttributes = Optional<TokenPayload, 'id'>;

export class TokenModel extends Model<TokenPayload, TokenCreationAttributes> implements TokenPayload {
  declare id: number;
  public token: string;
  public type: TokenTypes;
  public user_id: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof TokenModel {
  TokenModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      token: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'tokens',
      sequelize,
    },
  );

  TokenModel.belongsTo(UserModel, { foreignKey: 'user_id' });

  return TokenModel;
}
