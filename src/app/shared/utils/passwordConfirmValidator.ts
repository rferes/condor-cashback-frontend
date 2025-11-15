import { AbstractControl } from '@angular/forms';

export const passowrdConfirmValidator = (
  control: AbstractControl
): { [key: string]: boolean } | null => {
  const password = control.value;
  const passwordControl = control.parent?.get('password')?.value;
  if (password !== passwordControl) {
    return { passwordConfirm: true };
  }
  return null;
};
