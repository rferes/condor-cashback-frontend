// Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

// Application imports
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { ProfileService as ComponentService } from '../services/profile.service';
import { Merchant as ComponentEntity } from '../entities/profile.entity';
import { merchantTypes } from '../utils/profile.util';
import { ComercialCategoryService } from 'src/app/shared/services/comercial-categories.service';
import { ComercialCategory } from 'src/app/shared/entities/comercial-category.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { merchant_response } from '../utils/profile-response-msg';
import { AddressService } from 'src/app/shared/services/address.service';
import { address_by_cep_messages } from 'src/app/shared/utils/address-response-msg';
import { AddressByCEP } from 'src/app/shared/entities/address.entity';
import { HttpClient } from '@angular/common/http';
import { TermsAcceptanceService } from 'src/app/shared/services/terms-acceptance.service';
import { TermsAcceptance } from 'src/app/shared/entities/terms-acceptance.entity';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/entities/user.entity';

// Third-party library imports
import { ImageCroppedEvent } from 'ngx-image-cropper';

const component_toasts = merchant_response();
const address_by_cep_toasts = address_by_cep_messages();

@Component({
  selector: 'app-merchant-profile',
  templateUrl: '../views/profile.component.html',
})
export class ProfileComponent implements OnInit {
  isNew: boolean = false;
  isSemiNew: boolean = false;
  entity: ComponentEntity = {} as ComponentEntity; // Initialize entity
  entityForm: FormGroup;
  editMode: boolean = false;
  merchantTypesList = merchantTypes;

  listComercialCategories: ComercialCategory[] = [];
  comercialCategory: ComercialCategory = {} as ComercialCategory;
  scroolerItemsQuantity: number = 99;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageLoaded: boolean = false;
  fileName: string = '';

  free_url: boolean = true;
  url_valid: boolean = true;
  actual_url: string = '';

  termsDialogCheckBoxVisible: boolean = false;
  termsContent: string = '';
  private toastShown = false;
  is_premium: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private componentService: ComponentService,
    private comercialCategoryService: ComercialCategoryService,
    private messageService: MessageService,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private termsAcceptanceService: TermsAcceptanceService,
    private userService: UserService
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit() {
    const isNewParam = this.route.snapshot.queryParamMap.get('new');
    const isSemiNewParam = this.route.snapshot.queryParamMap.get('semi_new');
    this.userService.get().subscribe({
      next: (response: User) => {
        localStorage.setItem('type', (response.account_type ?? '').toLowerCase());
        this.is_premium = response.is_premium;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao obter o usuário:', error);
        toastMessage(this.messageService, component_toasts[400]);
      },
    });

    this.isSemiNew = isSemiNewParam === 'true';
    this.isNew = isNewParam === 'true' || this.isSemiNew;

    this.initializeProfileForm();

    if (this.isNew) {
      this.loadTermsContent();
      this.enableFormControls();
      this.entity.image = 'src/assets/logo.png';
      this.editMode = true;
      this.loadCommercialCategories();
    } else {
      this.loadExistingProfile();
      this.loadCommercialCategories();
    }
  }

  private loadTermsContent() {
    this.http
      .get('/assets/terms/merchant_terms.html', { responseType: 'text' })
      .subscribe({
        next: (content) => {
          this.termsContent = content;
        },
        error: (error) => {
          console.error('Error loading terms:', error);
          this.termsContent = 'Error loading terms and conditions.';
        },
      });
  }

  private initializeProfileForm() {
    this.entityForm = this.formBuilder.group({
      id: new FormControl('', []),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      url: new FormControl('', [Validators.required]),
      document: new FormControl('', []),
      image: new FormControl(null, [Validators.required]),
      is_active: new FormControl(true, [Validators.required]),
      type: new FormControl('', [Validators.required]),
      commercial_category: new FormControl([], [Validators.required]),
      cep: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      accept_terms: new FormControl(false, [Validators.required]),
      google_play_store_url: new FormControl('', []),
      app_store_url: new FormControl('', []),
    });
  }

  edit() {
    this.enableFormControls();
  }
  async save() {
    if (this.entityForm.valid) {
      const payload = this.preparePayload();
      await this.updateProfile(payload);
    }
  }

  create() {
    if (this.entityForm.valid) {
      const payload = this.preparePayload();
      this.componentService.create(payload).subscribe({
        next: (response: HttpResponse<ComponentEntity>) => {
          this.entity = response.body!;
          this.resetForm();
          toastMessage(this.messageService, component_toasts[response.status]);
          setTimeout(() => {
            window.location.href = '/merchant/profile';
          }, 2000);
        },
        error: (error) => {
          toastMessage(this.messageService, component_toasts[error.status]);
        },
      });
    }
  }

  cancel() {
    this.resetForm();
  }

  private updateProfile(payload: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.componentService.update(payload).subscribe({
        next: (response: HttpResponse<ComponentEntity>) => {
          this.entity = response.body!;
          this.resetForm();
          if (!this.toastShown) {
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
            this.toastShown = true;
            setTimeout(() => {
              this.toastShown = false;
            }, 500);
          }
          resolve();
        },
        error: (error) => {
          if (!this.toastShown) {
            toastMessage(this.messageService, component_toasts[error.status]);
            this.toastShown = true;
            setTimeout(() => {
              this.toastShown = false;
            }, 500);
          }
          reject(error);
        },
      });
    });
  }

  private preparePayload(): any {
    const payload = { ...this.entityForm.value };

    // Converter commercial_category para array de IDs
    if (
      payload.commercial_category &&
      Array.isArray(payload.commercial_category)
    ) {
      payload.commercial_category = payload.commercial_category.map(
        (category: any) =>
          typeof category === 'object' ? category.id : category
      );
    }

    if (this.croppedImage) {
      payload.image = this.croppedImage;
    } else {
      delete payload.image;
    }

    // remove special characters from CEP brazilian
    payload.cep = payload.cep.replace(/\D/g, '');
    delete payload.city;
    return payload;
  }

  private resetForm(): void {
    this.entityForm.patchValue(this.entity);
    this.imageLoaded = false;
    this.fileName = '';
    this.croppedImage = '';
    this.disableFormControls();
    this.entityForm.markAsPristine();
  }

  private enableFormControls(): void {
    this.editMode = true;
    this.entityForm.get('is_active')?.enable();
    this.entityForm.get('type')?.enable();
    this.entityForm.get('commercial_category')?.enable();
  }

  private disableFormControls(): void {
    this.editMode = false;
    this.entityForm.get('is_active')?.disable();
    this.entityForm.get('type')?.disable();
    this.entityForm.get('commercial_category')?.disable();
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files as FileList;
    if (files.length > 0) {
      this.imageChangedEvent = event;
      this.imageLoaded = true;
      const fullName = files[0].name;
      if (fullName.length > 28) {
        this.fileName = fullName.slice(0, 15) + '...' + fullName.slice(-10);
      } else {
        this.fileName = fullName;
      }
    }
    // chekc if entityform is valid, if not, show error
    if (this.entityForm.invalid) {
      //show error invalid
    }
  }

  onImageCropped(event: ImageCroppedEvent) {
    if (event && event.objectUrl) {
      fetch(event.objectUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
            this.entityForm.get('image')?.setValue(this.croppedImage);
            this.entityForm.markAsDirty();
          };
          reader.readAsDataURL(blob);
        });
    }
  }

  cancelImage() {
    this.imageLoaded = false;
    this.fileName = '';
    this.croppedImage = '';
  }

  searchZipcode() {
    let zipcode = this.entityForm.get('cep')?.value || '';
    zipcode = this.cleanValue(zipcode);
    if (zipcode.length === 8) {
      this.addressService.getAddressByZipcode(zipcode).subscribe({
        next: (response: HttpResponse<AddressByCEP>) => {
          toastMessage(
            this.messageService,
            address_by_cep_toasts[response.status]
          );
          const addressData = response.body as AddressByCEP;
          this.entityForm.patchValue({ city: addressData.city_name });
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(
            this.messageService,
            address_by_cep_toasts[error.status]
          );
          this.entityForm.setValue({ city: '' });
        },
      });
    } else {
      toastMessage(this.messageService, address_by_cep_toasts[400]);
    }
  }

  cleanValue(value: string): string {
    return value.replace(/\./g, '').replace(/-/g, '').replace(/\//g, '');
  }

  checkUrl() {
    if (this.actual_url === this.entityForm.get('url')?.value) {
      this.free_url = true;
      this.url_valid = true;
      this.entityForm.get('url')?.setErrors(null);
      return;
    }
    this.componentService
      .getByUrl(this.entityForm.get('url')?.value)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.free_url = response.status === 204;
          if (!this.free_url) {
            this.entityForm.get('url')?.setErrors({ url_already_used: true });
          }
        },
        error: (error: HttpErrorResponse) => {
          this.free_url = true;
        },
      });
    this.validateUrl();
  }

  validateUrl() {
    const url = this.entityForm.get('url')?.value;
    // Check if URL has any spaces or special characters and minimum length of 3
    const urlRegex = /^[a-zA-Z0-9-_]+$/;
    this.url_valid = url.length >= 3 && urlRegex.test(url);
  }

  private loadExistingProfile(): void {
    this.componentService.get('me').subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body!;
        this.entityForm.patchValue(this.entity);
        this.scroolerItemsQuantity = this.entity.commercial_category.length;
        this.actual_url = this.entity.url;
        this.editMode = false;
        this.disableFormControls();
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[400]);
      },
    });
  }

  private loadCommercialCategories(): void {
    this.comercialCategoryService.list().subscribe({
      next: (response: HttpResponse<ListResponse<ComercialCategory>>) => {
        this.listComercialCategories = response.body?.results || [];
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[400]);
      },
    });
  }

  acceptTermsCheckBox() {
    this.termsDialogCheckBoxVisible = true;

    if (this.entityForm.get('accept_terms')?.value) {
      this.entityForm.patchValue({ accept_terms: true });

      setTimeout(() => {
        this.termsDialogCheckBoxVisible = false;
      }, 200);

      toastMessage(this.messageService, {
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Termos aceitos com sucesso',
        life: 3000,
      });

      this.acceptTerms('merchant_terms');
      this.create();
    } else {
      toastMessage(this.messageService, {
        severity: 'error',
        summary: 'Erro',
        detail: 'Você precisa aceitar os termos para continuar',
        life: 3000,
      });
    }
  }

  private acceptTerms(acceptance_type: string) {
    const payload = {
      terms_version: '1.0',
      acceptance_type: acceptance_type as 'merchant_terms' | 'influencer_terms' | 'consumer_terms',
    };

    this.termsAcceptanceService.create(payload).subscribe({
      next: (response: HttpResponse<TermsAcceptance>) => {
        console.log('Termos aceitos com sucesso!');

        // Atualizar o campo de termos aceitos do usuário conforme o tipo
        const userUpdatePayload: any = {};
        if (acceptance_type === 'merchant_terms') {
          userUpdatePayload.is_terms_comercial_accepted = true;
        } else if (acceptance_type === 'influencer_terms') {
          userUpdatePayload.is_terms_comercial_accepted = true;
        } else if (acceptance_type === 'consumer_terms') {
          userUpdatePayload.is_terms_consumer_accepted = true;
        }

        this.userService.partialUpdate(userUpdatePayload).subscribe({
          next: (userResponse: HttpResponse<User>) => {
            localStorage.setItem('type', (userResponse.body?.account_type ?? '').toLowerCase());
            toastMessage(this.messageService, component_toasts[202]);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao atualizar o usuário:', error);
            toastMessage(this.messageService, component_toasts[400]);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao aceitar os termos:', error);
        toastMessage(this.messageService, component_toasts[401]);
      },
    });
  }
}
