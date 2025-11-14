// Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FileDownloadService } from 'src/app/shared/services/file-downloads.service';

// Third-party libraries
import { MessageService } from 'primeng/api';

// Application imports
import { StoreService } from '../../services/store.service';
import { AddressService } from 'src/app/shared/services/address.service';
import { Store } from '../../entities/store.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { cpfCnpjValidator } from 'src/app/shared/utils/cpfCnpjValidator';
import { store_view_messages } from '../utils/store-view-response-msg';
import { address_by_cep_messages } from 'src/app/shared/utils/address-response-msg';
import {
  AddressByCEP,
  City,
  State,
} from 'src/app/shared/entities/address.entity';

const component_toasts = store_view_messages();
const address_by_cep_toasts = address_by_cep_messages();
const initial_state = 26; //SP
const initial_city = 5097; //SP

@Component({
  selector: 'app-store-view',
  templateUrl: '../views/store-view.component.html',
})
export class StoreViewComponent implements OnInit {
  baseURL: string = environment.apiUrl;
  endURL: string = 'stores/receipt_store_csv/';

  entity: Store = {} as Store;
  idComponentEntity: string = '';
  entityForm: FormGroup;

  editMode: boolean = false;
  newObject: boolean = true;

  cities: City[] = [];
  states: State[] = [];

  viewOnly: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: StoreService,
    private addressService: AddressService,
    private fileDownloadService: FileDownloadService
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeEntityForm();
    const params = this.route.snapshot.params;
    this.route.queryParams.subscribe((params) => {
      this.viewOnly = params['view_only'] === 'true';
    });
    if (params['id'] && params['id'] !== 'new') {
      this.fetchComponent(params['id']);
      this.disableFormControls();
    } else if (params['id'] === 'new') {
      this.newObject = true;
      this.enableFormControls();
      this.fetchDataSuport(initial_state);
      this.entityForm.get('address.state')?.setValue(initial_state);
      this.entityForm.get('address.city')?.setValue(initial_city);
    } else {
      this.router.navigate(['/merchant/store-list']);
    }
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<Store>) => {
        this.entity = response.body as Store;
        this.newObject = false;
        this.editMode = false;

        if (this.entity.address?.state?.id) {
          this.fetchDataSuport(this.entity.address?.state?.id);
        } else {
          this.fetchDataSuport(initial_state);
        }

        this.entityForm.patchValue(this.entity);
        this.entityForm.get('address')?.patchValue({
          city: this.entity?.address?.city?.id,
          state: this.entity?.address?.state?.id,
          zipcode: this.entity?.address?.zipcode
            ?.toString()
            .replace('.', '')
            .replace('-', ''),
        });
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/store-list']);
        }, 2000);
      },
    });
  }

  // Cities and States
  fetchDataSuport(state_id: number): void {
    this.addressService.listCitiesByState(state_id).subscribe((data) => {
      this.cities = this.cities.concat(data);
      this.addressService.listStates().subscribe((data) => {
        this.states = data.results;
      });
    });
  }

  private initializeEntityForm() {
    this.entityForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      document: new FormControl('', [Validators.required, cpfCnpjValidator]),
      is_active: new FormControl(true, [Validators.required]),
      address: this.formBuilder.group({
        zipcode: new FormControl('', [Validators.required]),
        state: new FormControl(initial_state, [Validators.required]),
        city: new FormControl(initial_city, [Validators.required]),
        street: new FormControl('', [Validators.required]),
        neighborhood: new FormControl('', [Validators.required]),
        number: new FormControl('', [Validators.required]),
        complement: new FormControl(''), //
      }),
    });
  }

  edit() {
    this.editMode = true;
    this.enableFormControls();
  }

  save() {
    if (this.entityForm.invalid) {
      toastMessage(this.messageService, component_toasts[400]);
      return;
    }

    this.cleanFormValues();

    const payload = { ...this.entityForm.value };
    delete payload.id;

    if (this.isNewComponentEntity()) {
      this.createComponentEntity(payload);
    } else {
      this.updateComponentEntity(payload);
    }
  }

  cancel() {
    this.entity.address.zipcode = this.entity.address.zipcode
      ?.replace('-', '')
      .replace('.', '');
    this.entityForm.patchValue(this.entity);
    this.entityForm.get('address')?.patchValue({
      city: this.entity?.address?.city?.id,
      state: this.entity?.address?.state?.id,
    });
    this.disableFormControls();
    this.entityForm.markAsPristine();
  }

  isNewComponentEntity(): boolean {
    return this.entityForm.get('id')?.value === '';
  }

  createComponentEntity(payload: any) {
    this.componentService.create(payload).subscribe({
      next: (response: HttpResponse<Store>) => {
        this.entity = response.body as Store;
        toastMessage(this.messageService, component_toasts[response.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/store-list']);
        }, 2000);
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  updateComponentEntity(payload: any) {
    const pk = this.entityForm.value.id;
    this.componentService.partial_update(payload, pk).subscribe({
      next: (response: HttpResponse<Store>) => {
        this.entity = response.body as Store;
        this.entityForm.patchValue(response);
        this.disableFormControls();
        this.entityForm.markAsPristine();
        toastMessage(this.messageService, component_toasts[response.status]);
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  cleanFormValues() {
    const documentControl = this.entityForm.get('document');
    const zipcodeControl = this.entityForm.get('address.zipcode');

    const cleanedDocument = this.cleanValue(documentControl?.value);
    documentControl?.setValue(cleanedDocument);

    const cleanedZipcode = this.cleanValue(zipcodeControl?.value);
    zipcodeControl?.setValue(cleanedZipcode);

    if (this.entity.address) {
      this.entity.address.zipcode = cleanedZipcode;
    }
  }

  cleanValue(value: string): string {
    return value.replace(/\./g, '').replace(/-/g, '').replace(/\//g, '');
  }

  disableFormControls() {
    this.editMode = false;
    this.entityForm.get('is_active')?.disable();
    this.entityForm.get('address.state')?.disable();
    this.entityForm.get('address.city')?.disable();
  }

  enableFormControls() {
    this.editMode = true;
    this.entityForm.get('is_active')?.enable();
    this.entityForm.get('address.state')?.enable();
    this.entityForm.get('address.city')?.enable();
  }

  back(): void {
    this.router.navigate(['/merchant/store-list']);
  }

  getCities(state_id: number, city_id: number): void {
    this.addressService.listCitiesByState(state_id).subscribe((data) => {
      this.cities = [];
      this.cities = this.cities.concat(data);
      this.entityForm.get('address')?.patchValue({ city: city_id });
    });
  }

  searchZipcode(): void {
    let zipcode = this.entityForm.get('address.zipcode')?.value || '';
    zipcode = this.cleanValue(zipcode);
    if (zipcode.length === 8) {
      this.addressService.getAddressByZipcode(zipcode).subscribe({
        next: (response: HttpResponse<AddressByCEP>) => {
          toastMessage(
            this.messageService,
            address_by_cep_toasts[response.status]
          );
          const addressData = response.body as AddressByCEP;
          this.patchAddressForm(addressData, zipcode);
          if (addressData.localidade && addressData.uf) {
            this.getCities(
              addressData.uf ?? initial_state,
              addressData.localidade ?? initial_city
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(
            this.messageService,
            address_by_cep_toasts[error.status]
          );
        },
      });
    } else {
      toastMessage(this.messageService, address_by_cep_toasts[400]);
    }
  }

  patchAddressForm(addressData: AddressByCEP, zipcode: string) {
    this.entityForm.get('address')?.patchValue({
      state: addressData.uf,
      street: addressData.logradouro,
      neighborhood: addressData.bairro,
      complement: '',
      number: '',
      cep: zipcode,
    });
  }

  downloadCSV() {
    const fileName: string = `RedRed_Notas_Loja_${this.entity.name}.csv`;
    const formData = new FormData();
    formData.append('store_id', this.entity.id.toString());
    const url_csv_campaign_detail = this.baseURL + this.endURL;
    this.fileDownloadService.fileDownload(
      url_csv_campaign_detail,
      fileName,
      formData
    );
  }
}
