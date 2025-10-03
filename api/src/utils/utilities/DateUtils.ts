export class DateUtils {
  static ONE_MINUTE_MS = 60 * 1000;
  static ONE_HOUR_MS = 60 * 60 * 1000;
  static ONE_DAY_MS = 24 * this.ONE_HOUR_MS;

  static oneYearFromNow = () => {
    return new Date(Date.now() + 365 * 24 * this.ONE_HOUR_MS);
  };

  static thirtyDaysFromNow = () => {
    return new Date(Date.now() + 30 * 24 * this.ONE_HOUR_MS);
  };

  static fifteenMinutesFromNow = () => {
    return new Date(Date.now() + 15 * this.ONE_MINUTE_MS);
  };

  static fiveMinutesFromNow = () => {
    return new Date(Date.now() + 5 * this.ONE_MINUTE_MS);
  };

  static fiveMinutesAgo = () => new Date(Date.now() - 5 * this.ONE_MINUTE_MS);

  static oneHourFromNow = () => new Date(Date.now() + this.ONE_HOUR_MS);


  static getFirstDayOfMonth = () => {
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0);
  };

  static getFirstDayOfLastMonth = () => {
    return new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1, 0, 0, 0, 0);
  };

  static getLastDayOfMonth = () => {
    return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);
  };

}
