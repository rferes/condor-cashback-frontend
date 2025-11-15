// Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

// Third-party libraries
import { MessageService } from 'primeng/api';

import { environment } from 'src/environments/environment';

// Application imports
import { CreditCardService as ComponentService } from '../../services/credit-card.service';
import { CreditCard as ComponentEntity } from '../../entities/credit-card.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { credit_card_view_messages } from '../utils/credit-card-view-response-msg';
import { cpfCnpjValidator } from 'src/app/shared/utils/cpfCnpjValidator';

import { AddressService } from 'src/app/shared/services/address.service';
import { address_by_cep_messages } from 'src/app/shared/utils/address-response-msg';
import {
  AddressByCEP,
  City,
  State,
} from 'src/app/shared/entities/address.entity';

import { HttpClient } from '@angular/common/http';

const address_by_cep_toasts = address_by_cep_messages();
const initial_state = 26; //SP
const initial_city = 5097; //SP

function monthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value !== null && (isNaN(value) || value < 1 || value > 12)) {
    return { month: true };
  }
  return null;
}

function yearValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const currentYear = new Date().getFullYear();
  if (
    value !== null &&
    (isNaN(value) || value < currentYear || value > currentYear + 20)
  ) {
    return { year: true };
  }
  return null;
}

function expirationDateValidator(
  group: AbstractControl
): ValidationErrors | null {
  const month = group.get('month')?.value;
  const year = group.get('year')?.value;

  if (!month || !year) return null;

  const today = new Date();
  const cardExpiration = new Date(year, month - 1); // month is 0-based in Date
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(today.getMonth() + 1);

  if (cardExpiration < oneMonthFromNow) {
    return { invalidExpiration: true };
  }

  return null;
}

const component_toasts = credit_card_view_messages();

@Component({
  selector: 'app-credit-card-view',
  templateUrl: '../views/credit-card-view.component.html',
})
export class CreditCardViewComponent implements OnInit {
  entity: ComponentEntity = {} as ComponentEntity;
  idComponentEntity: string = '';
  entityForm: FormGroup;
  cities: City[] = [];
  states: State[] = [];

  sessionUuid: string = '';
  user_document: string = '';

  private starkbank_api_url = environment.starkbankApiUrl;

  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService,
    private addressService: AddressService,
    private http: HttpClient
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeEntityForm();
    this.fetchDataSuport(initial_state);
    this.entityForm.get('entityForm.billingStateCode')?.setValue(initial_state);
    this.entityForm.get('entityForm.billingCity')?.setValue(initial_city);
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.isLoading = true;
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.entityForm.patchValue(this.entity);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/payment/credit-card-list']);
        }, 2000);
        this.isLoading = false;
      },
    });
  }

  fetchDataSuport(state_id: number): void {
    this.addressService.listCitiesByState(state_id).subscribe((data) => {
      this.cities = this.cities.concat(data);
      this.addressService.listStates().subscribe((data) => {
        this.states = data.results;
      });
    });
  }

  // private initializeEntityForm() {
  //   this.entityForm = this.formBuilder.group(
  //     {
  //       number: new FormControl('4235647728025682', [
  //         Validators.required,
  //         Validators.minLength(16),
  //         Validators.maxLength(16),
  //       ]),
  //       cvv: new FormControl('123', [
  //         Validators.required,
  //         Validators.minLength(3),
  //         Validators.maxLength(4),
  //       ]),
  //       month: new FormControl('01', [Validators.required, monthValidator]),
  //       year: new FormControl('2035', [Validators.required, yearValidator]),
  //       name: new FormControl('Holder Name', [
  //         Validators.minLength(3),
  //         Validators.maxLength(255),
  //         Validators.required,
  //       ]),
  //       holderEmail: new FormControl('holdeName@email.com', []),
  //       holderPhone: new FormControl('11111111111', []),
  //       billingCountryCode: new FormControl('BRA', []),
  //       billingCity: new FormControl(initial_city, []),
  //       billingStateCode: new FormControl(initial_state, []),
  //       billingStreetLine1: new FormControl('Rua do Holder Name, 123', []),
  //       billingStreetLine2: new FormControl('', []),
  //       billingZipCode: new FormControl('11111-111', []),
  //     },
  //     { validators: expirationDateValidator }
  //   );
  // }

  private initializeEntityForm() {
    this.entityForm = this.formBuilder.group(
      {
        number: new FormControl('', [
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(19),
        ]),
        cvv: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(4),
        ]),
        month: new FormControl('', [Validators.required, monthValidator]),
        year: new FormControl('', [Validators.required, yearValidator]),
        name: new FormControl('', [
          Validators.minLength(3),
          Validators.maxLength(255),
          Validators.required,
        ]),
        holderEmail: new FormControl('', []),
        holderPhone: new FormControl('', []),
        billingCountryCode: new FormControl('', []),
        billingCity: new FormControl(null, []),
        billingStateCode: new FormControl(null, []),
        billingStreetLine1: new FormControl('', []),
        billingStreetLine2: new FormControl('', []),
        billingZipCode: new FormControl('', []),
      },
      { validators: expirationDateValidator }
    );
  }

  createComponentEntity(payload: any) {
    this.isLoading = true;
    this.componentService.create(payload).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        toastMessage(this.messageService, component_toasts[response.status]);
        setTimeout(() => {
          this.router.navigate(['/payment/credit-card-list']);
        }, 2000);
        this.isLoading = false;
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  back(): void {
    this.router.navigate(['/payment/credit-card-list']);
  }

  cleanValue(value: string): string {
    return value.replace(/\./g, '').replace(/-/g, '').replace(/\//g, '');
  }

  onStateChange(event: any): void {
    const stateId = event.value;
    if (stateId !== null) {
      this.getCities(stateId, 0);
    } else {
      // Clear the cities dropdown when no state is selected
      this.cities = [];
      this.entityForm.get('billingCity')?.setValue(null);
    }
  }

  getCities(state_id: number, city_id: number): void {
    this.isLoading = true;
    this.addressService.listCitiesByState(state_id).subscribe((data) => {
      this.cities = [];
      this.cities = this.cities.concat(data);
      this.isLoading = false;
    });
  }

  searchZipcode(): void {
    let zipcode = this.entityForm.get('billingZipCode')?.value || '';
    zipcode = this.cleanValue(zipcode);
    if (zipcode.length === 8) {
      this.isLoading = true;
      this.addressService.getAddressByZipcode(zipcode).subscribe({
        next: (response: HttpResponse<AddressByCEP>) => {
          toastMessage(
            this.messageService,
            address_by_cep_toasts[response.status]
          );
          const addressData = response.body as AddressByCEP;

          if (addressData.localidade && addressData.uf) {
            let state_id = this.states.find(
              (state) => state.name === addressData.uf
            )?.id;
            this.patchAddressForm(addressData, state_id, zipcode);

            this.getCities(
              state_id ?? initial_state,
              addressData.localidade ?? initial_city
            );
          }
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(
            this.messageService,
            address_by_cep_toasts[error.status]
          );
          this.isLoading = false;
        },
      });
    } else {
      toastMessage(this.messageService, address_by_cep_toasts[400]);
    }
  }

  patchAddressForm(addressData: AddressByCEP, state_id: any, zipcode: string) {
    let streetLine1: string = addressData.logradouro + ',';
    this.entityForm.patchValue({
      billingCountryCode: 'BRA',
      billingStateCode: state_id,
      billingCity: addressData.localidade,
      billingStreetLine1: streetLine1,
      billingStreetLine2: '',
      billingZipCode: zipcode,
    });
  }

  create_new_card() {
    this.getSessionUuid();
  }

  getSessionUuid() {
    this.isLoading = true;
    this.componentService.create_session().subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.body.errors) {
          toastMessage(this.messageService, component_toasts[400]);
          this.isLoading = false;
          return;
        }
        this.sessionUuid = response.body.session.uuid;
        this.user_document = response.body.user_document;
        this.getCardId(this.sessionUuid, this.user_document);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  getCardId(sessionUuid: string, user_document: string): void {
    let payload = this.getPayloadPurchase(user_document);
    const url = `${this.starkbank_api_url}/${sessionUuid}/purchase`;

    const options = {
      method: 'POST', // Método HTTP
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), // Converte o objeto payload em uma string JSON
    };

    // Faz a requisição e trata a resposta
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          if (response.status == 400) {
            toastMessage(this.messageService, component_toasts[499]);
          }
          throw new Error('Erro na requisição: ' + response.statusText);
        }
        return response.json(); // Converte a resposta para JSON
      })
      .then((data) => {
        let creditCard = {
          document: user_document,
          status: 'ACTIVE',
          last_four_digits: this.entityForm.get('number')?.value.slice(-4),
          card_id: data.purchase.cardId,
        };
        this.componentService.create(creditCard).subscribe({
          next: (response: HttpResponse<ComponentEntity>) => {
            this.entity = response.body as ComponentEntity;
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
            setTimeout(() => {
              this.router.navigate(['/payment/credit-card-list']);
            }, 2000);
            this.isLoading = false;
          },
          error: (error) => {
            toastMessage(this.messageService, component_toasts[error.status]);
            this.isLoading = false;
          },
        });
        // Exibe os dados recebidos da API
      })
      .catch((error) => {
        this.isLoading = false;
        console.error('Erro:', error);
        if (error instanceof Error) {
          toastMessage(this.messageService, component_toasts[500]);
        } else {
          toastMessage(this.messageService, component_toasts[400]);
        }
      });
  }

  getPayloadPurchase(user_document: string): any {
    let month = this.entityForm.get('month')?.value;
    if (month && month.length === 1) {
      month = '0' + month;
    }
    let date_card_expiration = this.entityForm.get('year')?.value + '-' + month;
    let state_name = this.states.find(
      (state) => state.id === this.entityForm.get('billingStateCode')?.value
    )?.initials;

    let city_name = this.cities.find(
      (city) => city.id === this.entityForm.get('billingCity')?.value
    )?.name;

    const holderEmail = this.entityForm.get('holderEmail')?.value;
    const holderPhone = this.entityForm.get('holderPhone')?.value;
    const billingCity = city_name;
    const billingStateCode = state_name;
    const billingCountryCode = this.entityForm.get('billingCountryCode')?.value;
    const billingStreetLine1 = this.entityForm.get('billingStreetLine1')?.value;
    const billingStreetLine2 = this.entityForm.get('billingStreetLine2')?.value;
    const billingZipCode = this.entityForm.get('billingZipCode')?.value;

    const returnObject: any = {
      amount: 0,
      installmentCount: 1,
      cardExpiration: date_card_expiration,
      cardNumber: this.entityForm.get('number')?.value,
      cardSecurityCode: this.entityForm.get('cvv')?.value,
      holderName: this.entityForm.get('name')?.value,
      fundingType: 'credit',
      tags: [user_document],
    };

    if (holderEmail) returnObject.holderEmail = holderEmail;
    if (holderPhone) returnObject.holderPhone = holderPhone;
    if (billingCity) returnObject.billingCity = billingCity;
    if (billingStateCode) returnObject.billingStateCode = billingStateCode;
    if (billingStateCode) returnObject.billingCountryCode = billingCountryCode;
    if (billingStreetLine1)
      returnObject.billingStreetLine1 = billingStreetLine1;
    if (billingStreetLine2)
      returnObject.billingStreetLine2 = billingStreetLine2;
    if (billingZipCode) returnObject.billingZipCode = billingZipCode;

    return returnObject;
  }
}
