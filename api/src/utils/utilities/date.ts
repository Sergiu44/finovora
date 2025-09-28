export const oneYearFromNow = () => {
  return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
};

export const thirtyDaysFromNow = () => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};

export const fifteenMinutesFromNow = () => {
  return new Date(Date.now() + 15 * 60 * 1000);
};

export const fiveMinutesFromNow = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

export const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60 * 1000);

export const oneHourFromNow = () => new Date(Date.now() + 60 * 60 * 1000);

export const ONE_DAYS_MS = 24 * 60 * 60 * 1000;

export const getFirstDayOfMonth = () => {
  return new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0);
};

export const getFirstDayOfLastMonth = () => {
  return new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0, 0);
};

export const getLastDayOfMonth = () => {
  return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
};
