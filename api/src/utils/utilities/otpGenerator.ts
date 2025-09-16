import { randomInt } from "crypto";
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function generateOTP(optLength: number = 6) {
  let otp = "";
  for (let i = 0; i < optLength; ++i) {
    otp += numbers[randomInt(numbers.length)];
  }
  return otp;
}
