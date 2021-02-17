import { REST_METHODS, errors, createError, CUSTOM_ERROR } from './errors';

export const processErrors = async (
  message: string,
  method: REST_METHODS,
  endpoint: string,
  err: any
) => {
  var errorList: any = [];
  if (err.name === 'ValidationError') {
    errorList = await processMongooseErrors(err);
  } else if (err.name === 'ExpressError') {
    errorList = err;
  } else if (err.code == 11000) {
    const key = Object.keys(err.keyValue)[0];
    errors.DUPLICATE_KEY.message = `${key} already exist`;
    errorList.push(errors.DUPLICATE_KEY);
  } else if (err.name === CUSTOM_ERROR.name) {
    errorList.push(err)
  } else {
    errorList = [errors.UNKNOWN_ERROR];
  }
  return createError(message, method, endpoint, errorList);
};

const processMongooseErrors = async (err: any) => {
  var errorList: any = [];
  if (err.errors) {
    for (const key in err.errors) {
      const { message, name, kind, path, value, reason } = err.errors[key];
      const errorObjectTemp = {
        message,
        name,
        kind,
        path,
        value,
        reason,
      };
      errorList.push(errorObjectTemp);
    }
  }
  return errorList;
};

export const processExpressError = async (err: any) => {
  const errorsArray = err.array();
  const errorObj = {
    name: 'ExpressError',
    message: errorsArray[0].msg,
    ...errorsArray[0],
  };
  delete errorObj['msg'];
  return errorObj;
};