import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const newPassword = await bcrypt.hash(password, 10);
    return newPassword;
  } catch (error) {
    console.log(error);
  }
};
export const comparePassword = async (password, hashedPassword) => {
  try {
    const matched = await bcrypt.compare(password, hashedPassword);
    return matched;
  } catch (error) {
    console.log(error);
  }
};
