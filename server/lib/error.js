const ExtendableError = require('es6-error');

exports.BadRequest = class BadRequest extends ExtendableError {
  constructor(validationErrors) {
    super('Bad Request');

    const includedKeys = [];
    const formattedErrors = [];

    validationErrors.forEach(validationError => {
      const error = {
        field: Object.keys(validationError)[0],
        message: validationError[Object.keys(validationError)[0]]
      };

      if (!includedKeys.includes(error.field)) {
        formattedErrors.push(error);
      }

      includedKeys.push(error.field);
    });

    this.body = {
      errors: formattedErrors
    };
    this.status = 400;
  }
};
