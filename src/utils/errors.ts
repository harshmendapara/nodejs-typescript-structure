export const errors = {
  UNKNOWN_ERROR: {
    code: 5000,
    message: 'Unknown error !!!',
    hints: [
      "Please contact development team with information on 'how to reproduce this error'. Thank you for your help and support.",
    ],
  },
  DUPLICATE_KEY: {
    code: 11000,
    message: '',
    hints: [
      "Trying to add same value to primary keys.",
    ],
  }
};

export const createError = function (
  message: string,
  httpMethod: REST_METHODS,
  endpointInformation: string,
  errorList: any
) {
  return {
    text: message,
    timestamp: new Date(),
    method: httpMethod,
    endpoint: endpointInformation,
    errors: errorList,
  };
};

export const kinds = {
  REQUIRED: 'required',
  NOT_VALID: 'notvalid',
  NUMBER_ERROR: 'Number',
  MIN_ERROR: 'min',
  MAX_ERROR: 'max',
};

export enum REST_METHODS {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const CUSTOM_ERROR = {
  code: 101010,
  name: 'CUSTOM_ERROR',
  message: ''
}