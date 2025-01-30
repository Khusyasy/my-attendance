import bcrypt from "bcryptjs";

const HASH_SALT = 10;

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, HASH_SALT);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};
