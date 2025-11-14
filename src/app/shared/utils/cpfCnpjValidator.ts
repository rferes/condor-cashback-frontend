import { AbstractControl } from '@angular/forms';

export const cpfCnpjValidator = (
  control: AbstractControl
): { [key: string]: boolean } | null => {
  const value = control.value;

  if (!value) {
    return null;
  }

  const isCpf = value.length === 11 || value.length === 14;
  const isCnpj = value.length === 14 || value.length === 18;

  if (!isCpf && !isCnpj) {
    return { cpfCnpj: true };
  }

  return null;
};
