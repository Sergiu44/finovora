import bcrypt from "bcrypt";

export const hashPassword = async (password: string, saltRounds?: number) => {
  return await bcrypt.hash(password, saltRounds || 10);
};
export const compareValues = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue);
};
