export class Address {
  id?: number;

  zipcode?: string;
  number?: string;
  neighborhood?: string;
  street?: string;
  complement?: string;

  city?: City;
  state?: State;

  updated_date?: Date;
  created_date?: Date;
}

export class State {
  id?: number;

  name?: string;
  initials?: string;
}

export class City {
  id?: number;

  name?: string;
  state?: State;
}

export class AddressByCEP {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: number;
  uf?: number;
  city_name?: string;
  state_name?: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
}
