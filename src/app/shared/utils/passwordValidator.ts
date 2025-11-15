import { AbstractControl } from '@angular/forms';

export const passwordValidator = (
  control: AbstractControl
): { [key: string]: boolean } | null => {
  const password = control.value;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumeric = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const isLength = password.length >= 8;
  const response = {
    isLength: false,
    passwordUpperCase: false,
    passwordLowerCase: false,
    passwordNumeric: false,
    passwordSpecial: false,
    passwordLength: false,
  };
  if (password.length === 0) {
    return null;
  }
  if (!isLength) {
    response['isLength'] = true; // Return null if password is valid according to all rules
  }
  if (!hasUpperCase) {
    response['passwordUpperCase'] = true; // Return an error object if password is invalid
  }
  if (!hasLowerCase) {
    response['passwordLowerCase'] = true; // Return an error object if password is invalid
  }
  if (!hasNumeric) {
    response['passwordNumeric'] = true; // Return an error object if password is invalid
  }
  if (!hasSpecial) {
    response['passwordSpecial'] = true;
  }

  if (Object.values(response).every((value) => value === false)) {
    return null;
  }
  return response;
};
