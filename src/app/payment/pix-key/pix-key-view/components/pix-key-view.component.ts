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

// Third-party libraries
import { MessageService } from 'primeng/api';

// Application imports
import { PixKeyService } from '../../services/pix-key.service';
import { PixKey as ComponentEntity } from '../../entities/pix-key.entity';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/entities/user.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { pix_key_view_messages } from '../utils/pix-key-view-response-msg';
const component_toasts = pix_key_view_messages();

@Component({
  selector: 'app-pix-key-view',
  templateUrl: '../views/pix-key-view.component.html',
})
export class PixKeyViewComponent implements OnInit {
  entity: ComponentEntity = {} as ComponentEntity;
  idComponentEntity: string = '';
  entityForm: FormGroup;
  newObject: boolean = true;
  isLoading: boolean = false;
  consumer_pix_type = [
    { label: 'CPF', value: 'cpf' },
    { label: 'CNPJ', value: 'cnpj' },
    { label: 'Celular', value: 'phone' },
    { label: 'Email', value: 'email' },
  ];
  user_document_type: string | null = null;
  user_document: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: PixKeyService,
    private userService: UserService
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeEntityForm();
    const params = this.route.snapshot.params;
    if (params['id'] && params['id'] !== 'new') {
      this.fetchComponent(params['id']);
      this.newObject = false;
    } else if (params['id'] === 'new') {
      this.newObject = true;
      this.isLoading = true;
      this.userService.get().subscribe({
        next: (response: User) => {
          this.user_document = response.document;
          this.user_document_type = this.detect_document_type_cpf_cnpj(
            this.user_document
          );
          if (this.user_document_type === 'cpf') {
            this.entityForm.get('document')?.setValue(this.user_document);
            this.entityForm.get('type')?.setValue('cpf');
            this.consumer_pix_type = [
              { label: 'CPF', value: 'cpf' },
              { label: 'Celular', value: 'phone' },
              { label: 'Email', value: 'email' },
            ];
          } else if (this.user_document_type === 'cnpj') {
            this.entityForm.get('document')?.setValue(this.user_document);
            this.entityForm.get('type')?.setValue('cnpj');
            this.consumer_pix_type = [
              { label: 'CNPJ', value: 'cnpj' },
              { label: 'Celular', value: 'phone' },
              { label: 'Email', value: 'email' },
            ];
          }
          this.updateKeyPixType();
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          toastMessage(this.messageService, component_toasts[error.status]);
          setTimeout(() => {
            this.router.navigate(['/payment/pix-key-list']);
          }, 2000);
        },
      });
    }
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
        this.isLoading = false;
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/payment/pix-key-list']);
        }, 2000);
      },
    });
  }

  private initializeEntityForm() {
    this.entityForm = this.formBuilder.group({
      id: new FormControl(''),
      pix_key: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      type: new FormControl('', [Validators.required]),
      document: new FormControl('', [Validators.required]),
    });
  }

  save() {
    if (
      this.entityForm.value.type === 'cpf' ||
      this.entityForm.value.type === 'cnpj'
    ) {
      this.entityForm.get('pix_key')?.setValue(this.entityForm.value.document);
    }
    if (this.entityForm.invalid) {
      toastMessage(this.messageService, component_toasts[400]);
      return;
    }

    const payload = { ...this.entityForm.value };
    if (payload.type === 'phone') {
      payload.pix_key = payload.pix_key.replace(/\D/g, '');
      payload.pix_key = `+55${payload.pix_key}`;
    }
    delete payload.id;
    // payload change
    this.createComponentEntity(payload);
  }

  createComponentEntity(payload: any) {
    this.isLoading = true;
    this.componentService.create(payload).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        toastMessage(this.messageService, component_toasts[response.status]);
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/payment/pix-key-list']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.error[0] === 'Invalid Pix Key') {
          toastMessage(this.messageService, component_toasts[499]);
        } else {
          toastMessage(this.messageService, component_toasts[error.status]);
        }
      },
    });
  }

  detect_document_type_cpf_cnpj(document: string) {
    let clean_document = document.replace(/\D/g, '');
    if (clean_document.length === 11) {
      return 'cpf';
    } else if (clean_document.length === 14) {
      return 'cnpj';
    }
    return null;
  }

  updateKeyPixType() {
    if (
      this.entityForm.value.type === 'cpf' ||
      this.entityForm.value.type === 'cnpj'
    ) {
      this.entityForm.get('pix_key')?.setValue(this.user_document);
    } else {
      this.entityForm.get('pix_key')?.setValue('');
    }
  }

  // onCheckDocument() {
  //   let document = this.entityForm.get('document')?.value;
  //   if (!document) {
  //     return;
  //   }

  //   // Remove any non-digit characters
  //   document = document.replace(/\D/g, '');

  //   // Format as CPF or CNPJ
  //   if (document.length <= 11) {
  //     document = this.formatCPF(document);
  //   } else {
  //     document = this.formatCNPJ(document);
  //   }

  //   // Update the form control with the formatted value
  //   this.entityForm.get('document')?.setValue(document, { emitEvent: false });

  //   if (
  //     document.length !== 14 &&
  //     this.entityForm.get('type')?.value === 'cpf'
  //   ) {
  //     this.entityForm.get('document')?.setErrors({ incorrect: true });
  //     return;
  //   } else if (
  //     document.length !== 18 &&
  //     this.entityForm.get('type')?.value === 'cnpj'
  //   ) {
  //     this.entityForm.get('document')?.setErrors({ incorrect: true });
  //     return;
  //   } else {
  //     this.entityForm.get('document')?.setErrors(null);
  //   }
  // }

  // private formatCPF(value: string): string {
  //   return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  // }

  // private formatCNPJ(value: string): string {
  //   return value.replace(
  //     /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
  //     '$1.$2.$3/$4-$5'
  //   );
  // }

  back(): void {
    this.router.navigate(['/payment/pix-key-list']);
  }
}
