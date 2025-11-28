const minLength = (length: number) => (value: string) => value.length >= length;
const maxLength = (length: number) => (value: string) => value.length <= length;
const betweenLength = (length: number) => (value: string) => minLength(length)(value) && maxLength(length)(value);
const isNumeric = (value: string) => value.match(/^[0-9]+$/i);
const isLowercase = (value: string) => value.match(/^[a-z]+$/i);
const isUppercase = (value: string) => value.match(/^[A-Z]+$/i);
const isAlphanumeric = (value: string) => value.match(/^[0-9a-zA-Z ]+$/i);
const isText = (value: string) => value.match(/^[0-9a-zA-Z!@#$%^&*()_+-=~`[\]{}|;':",./<>? ]+$/i);

// Enhanced email validation with RFC 5322 standard
const isEmail = (value: string) =>
  value.match(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  );

// Password strength validation
const hasMinPasswordLength = (minLength: number) => (value: string) => value.length >= minLength;
const hasUppercase = (value: string) => /[A-Z]/.test(value);
const hasLowercase = (value: string) => /[a-z]/.test(value);
const hasNumber = (value: string) => /[0-9]/.test(value);
const hasSpecialChar = (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value);

// Password strength checker that returns true if password meets all criteria
const isStrongPassword = (value: string) =>
  hasMinPasswordLength(8)(value) &&
  hasUppercase(value) &&
  hasLowercase(value) &&
  hasNumber(value) &&
  hasSpecialChar(value);

// Dropdown value validation
const isValidDropdownValue = (validValues: any[]) => (value: any) => validValues.includes(value);

const isRequired = (value: string | undefined | null) =>
  value !== undefined &&
  value !== null &&
  ((typeof value === "string" && value !== "" && value.trim() !== "") ||
    (typeof value === "number" && !isNaN(value)) ||
    (typeof value === "object" && Object.keys(value).length > 0) ||
    (typeof value === "boolean" && value === true));

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
  isText,
  // New validations
  hasMinPasswordLength,
  hasUppercase,
  hasLowercase,
  hasNumber,
  hasSpecialChar,
  isStrongPassword,
  isValidDropdownValue,
};

export default VALIDATIONS;
