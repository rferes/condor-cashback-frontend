// Angular imports
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';

// Application imports
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { ProfileService as ComponentService } from '../services/profile.service';
import { Influencer as ComponentEntity } from '../entities/profile.entity';
import { influencerTypes, genderList } from '../utils/profile.util';
import { ComercialCategoryService } from 'src/app/shared/services/comercial-categories.service';
import { ProfileService as InfluencerService } from 'src/app/influencer/profile/services/profile.service';
import { ComercialCategory } from 'src/app/shared/entities/comercial-category.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { influencer_response } from '../utils/profile-response-msg';
import { AddressService } from 'src/app/shared/services/address.service';
import { TermsAcceptanceService } from 'src/app/shared/services/terms-acceptance.service';
import { TermsAcceptance } from 'src/app/shared/entities/terms-acceptance.entity';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/entities/user.entity';
import { address_by_cep_messages } from 'src/app/shared/utils/address-response-msg';
import { HttpClient } from '@angular/common/http';
import {
  AddressByCEP,
  City,
  State,
} from 'src/app/shared/entities/address.entity';

// Third-party library imports
import { ImageCroppedEvent } from 'ngx-image-cropper';

const component_toasts = influencer_response();
const address_by_cep_toasts = address_by_cep_messages();

@Component({
  selector: 'app-influencer-profile',
  templateUrl: '../views/profile.component.html',
})
export class ProfileComponent implements OnInit {
  isNew: boolean = false;
  isSemiNew: boolean = false;
  entity: ComponentEntity = {} as ComponentEntity; // Initialize entity
  entityForm: FormGroup;
  editMode: boolean = false;
  influencerTypesList = influencerTypes;
  genderList = genderList;
  listComercialCategories: ComercialCategory[] = [];
  comercialCategory: ComercialCategory = {} as ComercialCategory;
  scroolerItemsQuantity: number = 21;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageLoaded: boolean = false;
  fileName: string = '';

  free_url: boolean = true;
  url_valid: boolean = true;
  actual_url: string = '';
  private toastShown = false;

  termsDialogCheckBoxVisible: boolean = false;
  termsContent: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private componentService: ComponentService,
    private comercialCategoryService: ComercialCategoryService,
    private messageService: MessageService,
    private addressService: AddressService,
    private influencerService: InfluencerService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private termsAcceptanceService: TermsAcceptanceService,
    private userService: UserService
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit() {
    const isNewParam = this.route.snapshot.queryParamMap.get('new');
    const isSemiNewParam = this.route.snapshot.queryParamMap.get('semi_new');

    this.isSemiNew = isSemiNewParam === 'true';
    this.isNew = isNewParam === 'true' || this.isSemiNew;

    this.initializeProfileForm();

    if (this.isNew) {
      this.loadTermsContent();
      this.entityForm.get('is_active')?.enable();
      this.entityForm.get('type')?.enable();
      this.entityForm.get('commercial_category')?.enable();
      this.entity.image = 'src/assets/logo.png';
      this.editMode = true;
      this.comercialCategoryService.list().subscribe({
        next: (response: HttpResponse<ListResponse<ComercialCategory>>) => {
          this.listComercialCategories = response.body?.results || [];
        },
        error: (error) => {
          toastMessage(this.messageService, component_toasts[error.status]);
        },
      });
    } else {
      this.componentService.get('me').subscribe({
        next: (response: HttpResponse<ComponentEntity>) => {
          this.entity = response.body!;
          setTimeout(() => {
            this.entityForm.patchValue(this.entity);
          }, 0);
          this.entityForm.get('is_active')?.disable();
          this.entityForm.get('type')?.disable();
          this.entityForm.get('commercial_category')?.disable();
          this.entityForm.get('type')?.setValue('');
          this.actual_url = this.entity.url;
          if (this.entity.birth_date) {
            this.entity.birth_date = moment
              .tz(this.entity.birth_date, 'America/Sao_Paulo')
              .toDate();
            this.entityForm.patchValue({ birth_date: this.entity.birth_date });
          }

          this.editMode = false;
          this.comercialCategoryService.list().subscribe({
            next: (response: HttpResponse<ListResponse<ComercialCategory>>) => {
              this.listComercialCategories = response.body?.results || [];
            },
            error: (error) => {
              toastMessage(
                this.messageService,
                component_toasts[response.status]
              );
            },
          });
        },
        error: (error) => {
          toastMessage(this.messageService, component_toasts[error.status]);
        },
      });
    }
  }

  private loadTermsContent() {
    this.http
      .get('/assets/terms/influencer_terms.html', { responseType: 'text' })
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
      image: new FormControl('', [Validators.required]),
      is_active: new FormControl(true, [Validators.required]),
      type: new FormControl('', [Validators.required]),
      commercial_category: new FormControl([], [Validators.required]),
      cep: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      birth_date: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      instagram: new FormControl('', []),
      facebook: new FormControl('', []),
      twitter: new FormControl('', []),
      tiktok: new FormControl('', []),
      youtube: new FormControl('', []),
      twitch: new FormControl('', []),
      snapchat: new FormControl('', []),
      website: new FormControl('', []),
      accept_terms: new FormControl(false, [Validators.required]),
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

  acceptTermsCheckBox() {
    this.termsDialogCheckBoxVisible = true;
    console.log('acceptTermsCheckBox called');
    if (this.entityForm.get('accept_terms')?.value) {
      // Update states
      this.entityForm.patchValue({ accept_terms: true });

      // Close both dialogs
      setTimeout(() => {
        this.termsDialogCheckBoxVisible = false;
      }, 200);

      // Show success message
      toastMessage(this.messageService, {
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Termos aceitos com sucesso',
        life: 3000,
      });

      // Continue with receipt submission
      this.acceptTerms('influencer_terms');
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

  create() {
    if (this.entityForm.valid) {
      const payload = this.preparePayload();
      this.componentService.create(payload).subscribe({
        next: (response: HttpResponse<ComponentEntity>) => {
          this.entity = response.body!;
          if (this.entity.birth_date) {
            this.entity.birth_date = moment
              .tz(this.entity.birth_date, 'America/Sao_Paulo')
              .toDate();
            this.entityForm.patchValue({ birth_date: this.entity.birth_date });
          }
          this.resetForm();
          toastMessage(this.messageService, component_toasts[response.status]);
          setTimeout(() => {
            window.location.href = '/influencer/profile';
          }, 2000); // Delay the redirect by 2 seconds to allow the toast to be seen
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
          if (this.entity.birth_date) {
            this.entity.birth_date = moment
              .tz(this.entity.birth_date, 'America/Sao_Paulo')
              .toDate();
            this.entityForm.patchValue({ birth_date: this.entity.birth_date });
          }
          // Use a flag to prevent multiple toasts
          if (!this.toastShown) {
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
            this.toastShown = true;
            // Reset the flag after a short delay
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
    payload.birth_date = this.convertDateToBack(payload.birth_date);
    if (this.croppedImage) {
      payload.image = this.croppedImage;
    } else {
      delete payload.image;
    }
    payload.commercial_category = payload.commercial_category.map(
      (comercial_categories_list: ComercialCategory) =>
        comercial_categories_list.id
    );
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
          this.entityForm.patchValue({ city: '' });
        },
      });
    } else {
      toastMessage(this.messageService, address_by_cep_toasts[400]);
    }
  }

  checkUrl() {
    if (this.actual_url === this.entityForm.get('url')?.value) {
      this.free_url = true;
      this.url_valid = true;
      this.entityForm.get('url')?.setErrors(null);
      return;
    }
    this.influencerService
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

  convertDateToBack(date: Date): string {
    return moment(date).tz('America/Sao_Paulo').utc().format('YYYY-MM-DD');
  }

  cleanValue(value: string): string {
    return value.replace(/\./g, '').replace(/-/g, '').replace(/\//g, '');
  }
}
