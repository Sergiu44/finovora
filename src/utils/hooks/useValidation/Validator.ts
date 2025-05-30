export default class Validator {
  public currentKey: string[] = [];
  public configuration: { [key: string]: any } = {};
  public checkOnlyOnSubmit: boolean = false;

  constructor(
  ) {

  }

  forProperty = (name: string, value = "") => {
    const keys = name.split(".");

    this.currentKey = keys;

    for (const keyIndex in keys) {
      this.configuration = {
        ...this.configuration,
        [keys[keyIndex]]:
          parseInt(keyIndex) == keys.length - 1
            ? {
                value,
                validations: [],
              }
            : {
                ...this.configuration[keys[keyIndex]],
              },
      };
    }

    return this;
  };

  check = (callbackFn: Function, message: string) => {
    for (const keyIndex in this.currentKey) {
      this.configuration = {
        ...this.configuration,
        [this.currentKey[keyIndex]]:
          parseInt(keyIndex) == this.currentKey.length - 1
            ? {
                ...this.configuration[this.currentKey[keyIndex]],
                validations: [
                  ...this.configuration[this.currentKey[keyIndex]].validations,
                  {
                    check: callbackFn,
                    errorMessage: message,
                  },
                ],
              }
            : {
                ...this.configuration[this.currentKey[keyIndex]],
              },
      };
    }

    return this;
  };

  applyCheckOnlyOnSubmit = () => {
    this.checkOnlyOnSubmit = true;
    return this;
  };

  getConfiguration = () => {
    return this.configuration;
  };

  getCheckOnlyOnSubmit = () => {
    return this.checkOnlyOnSubmit;
  };
}
