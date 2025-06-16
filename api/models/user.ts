import { Optional } from "sequelize";
import { Model, Table } from "sequelize-typescript";
import { compareValues } from "../utils/utilities/bcrypt";
interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verified: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "firstName" | "lastName" | "verified"> {}

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model<UserAttributes, UserCreationAttributes> {
  public omitPassword(): Omit<UserAttributes, "password"> {
    const { password, ...userWithoutPassword } = this.dataValues;
    return userWithoutPassword;
  }
  public async comparePassword(val: string): Promise<boolean> {
    return await compareValues(val, this.dataValues.password);
  }
}
