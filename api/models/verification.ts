import { Model, Table } from "sequelize-typescript";
import VerificationCodeTypes from "../utils/constants/verificationCodeTypes";
import { Optional } from "sequelize";

interface VerificationCodeAttributes {
  id: string;
  userId: number;
  type: VerificationCodeTypes;
  expiresAt: Date;
  createdAt: Date;
}

interface VerificationCodeCreationAttributes extends Optional<VerificationCodeAttributes, "createdAt" | "id"> {}

@Table({
  tableName: "otp-verifications",
  timestamps: false,
})
export default class VerificationCode extends Model<VerificationCodeAttributes, VerificationCodeCreationAttributes> {}
