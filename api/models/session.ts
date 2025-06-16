import { Optional } from "sequelize";
import { Model, Table } from "sequelize-typescript";

interface SessionAttributes {
  id: number;
  userId: number;
  userAgent?: string;
  expiresAt: Date;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, "expiresAt" | "id"> {}

@Table({
  tableName: "sessions",
  timestamps: false,
})
export class Session extends Model<SessionAttributes, SessionCreationAttributes> {}
