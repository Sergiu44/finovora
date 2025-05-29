import { Optional } from "sequelize";
import { Model, Table } from "sequelize-typescript";

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Table({
  tableName: "users",
})
class User extends Model<UserAttributes, UserCreationAttributes> {}
