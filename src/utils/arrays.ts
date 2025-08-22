export function getEnumValues(enumType: any) {
  return Object.keys(enumType).filter((key) => typeof enumType[key as keyof typeof enumType] === "number");
}
