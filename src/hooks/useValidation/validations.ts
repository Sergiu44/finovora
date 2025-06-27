const minLength = (length: number) => (value: string) => value.length >= length;
const maxLength = (length: number) => (value: string) => value.length <= length;
const betweenLength = (length: number) => (value: string) => minLength(length)(value) && maxLength(length)(value);
const isNumeric = (value: string) => value.match(/^[0-9]+$/i);
const isLowercase = (value: string) => value.match(/^[a-z]+$/i);
const isUppercase = (value: string) => value.match(/^[A-Z]+$/i);
const isAlphanumeric = (value: string) => isNumeric(value) && isLowercase(value) && isUppercase(value);
const isEmail = (value: string) => value.match(/\S+@\S+\.\S+/);
const isRequired = (value: string | undefined | null | any[]) =>
  value !== undefined &&
  value !== null &&
  ((typeof value === "string" && value !== "" && value.trim() !== "") ||
    (typeof value === "object" && value.length > 0) ||
    (typeof value === "boolean" && value === true));

// New password validation functions
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasNumber = (value: string) => /[0-9]/.test(value);
const hasSpecialChar = (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value);
const hasNoSpaces = (value: string) => !/\s/.test(value);

const VALIDATIONS = {
  minLength,
  maxLength,
  betweenLength,
  isNumeric,
  isLowercase,
  isUppercase,
  isAlphanumeric,
  isEmail,
  isRequired,
  // New password validations
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecialChar,
  hasNoSpaces,
};

export default VALIDATIONS;
