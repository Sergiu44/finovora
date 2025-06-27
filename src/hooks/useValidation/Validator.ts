// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default class Validator {
  configuration: { [key: string]: any };
  currentKey: string[];
  checkOnlyOnSubmit: boolean;

  constructor() {
    this.configuration = {};
    this.currentKey = [];
    this.checkOnlyOnSubmit = false;
  }

  forProperty = (name: string, value = "") => {
    const keys = name.split(".");

    this.currentKey = keys;

    for (const keyIndex in keys) {
      this.configuration = {
        ...this.configuration,
        [keys[keyIndex]]:
          parseInt(keyIndex, 10) == keys.length - 1
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

  check = (callbackFn: (val: string) => void, message: string) => {
    for (const keyIndex in this.currentKey) {
      this.configuration = {
        ...this.configuration,
        [this.currentKey[keyIndex]]:
          parseInt(keyIndex, 10) == this.currentKey.length - 1
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
