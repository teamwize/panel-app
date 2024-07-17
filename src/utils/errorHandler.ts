type ApiErrors = {
  [key: string]: string
}

const apiErrors: ApiErrors = {
  'INTERNET_ERROR': "Internet connection error. Please check your network.",
  'SERVER_ERROR': "Server error. Please try again later.",
  'BACKEND_ERROR': "Backend error. Please contact support.",
  'unknown': "An unknown error occurred.",
  '403': 'Username or password is incorrect.',
  'Failed to fetch': 'Check your connection'
};

export const getErrorMessage = (errorCode: string | Error): string => {
  let code: string | null = null;
  if (errorCode instanceof Error) {
    code = errorCode.message
  } else {
    code = errorCode
  }
  return apiErrors[code] || apiErrors.unknown;
};

type ErrorArguments = {
  [key: string]: string
}

type ErrorDetails = {
  code: string;
  arguments: ErrorArguments
}

type ErrorResponse = {
  errors?: ErrorDetails[]
}

// export default function translateErrors(error: ErrorResponse): string[] {
//   if (error.errors) {
//     const result = error.errors.map(i => {
//       return errorToMessage(i);
//     });
//     return result;
//   }
//   else {
//     return [errorToMessage(error)];
//   }
// }

// function errorToMessage(i: ErrorDetails): string {
//   var code = apiErrors.unknown;
//   if (apiErrors[i.code]) {
//     code = apiErrors[i.code];
//   }
//   console.log(i.arguments);
//   for (const argument in i.arguments) {
//     code = code.replaceAll("{" + argument + "}", i.arguments[argument])
//   }
//   code = code.replaceAll("{code}", i.code);
//   return code;
// }