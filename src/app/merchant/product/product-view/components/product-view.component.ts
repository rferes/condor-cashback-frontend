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
import { ProductService } from '../../services/product.service';
import { AddressService } from 'src/app/shared/services/address.service';
import { Product } from '../../entities/product.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { product_view_messages } from '../utils/product-view-response-msg';

const component_toasts = product_view_messages();

@Component({
  selector: 'app-product-view',
  templateUrl: '../views/product-view.component.html',
})
export class ProductViewComponent implements OnInit {
  entity: Product = {} as Product;
  idComponentEntity: string = '';
  entityForm: FormGroup;

  editMode: boolean = false;
  newObject: boolean = true;

  viewOnly: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ProductService,
    private addressService: AddressService
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
      this.fetchDataSuport();
    } else {
      this.router.navigate(['/merchant/product-list']);
    }
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<Product>) => {
        this.entity = response.body as Product;
        this.newObject = false;
        this.editMode = false;

        if (this.entity) {
          this.fetchDataSuport();
        } else {
          this.fetchDataSuport();
        }

        this.entityForm.patchValue(this.entity);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/product-list']);
        }, 2000);
      },
    });
  }

  // Cities and States
  fetchDataSuport(): void {
    console.log('fetchDataSuport');
  }

  private initializeEntityForm() {
    this.entityForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(60),
      ]),
      is_active: new FormControl(true, [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(300),
      ]),
      product_eans: new FormControl(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      category: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
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

    const payload = { ...this.entityForm.value };
    delete payload.id;

    if (this.isNewComponentEntity()) {
      this.createComponentEntity(payload);
    } else {
      this.updateComponentEntity(payload);
    }
  }

  cancel() {
    this.entityForm.patchValue(this.entity);
    this.disableFormControls();
    this.entityForm.markAsPristine();
  }

  isNewComponentEntity(): boolean {
    return this.entityForm.get('id')?.value === '';
  }

  createComponentEntity(payload: any) {
    this.componentService.create(payload).subscribe({
      next: (response: HttpResponse<Product>) => {
        this.entity = response.body as Product;
        toastMessage(this.messageService, component_toasts[response.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/product-list']);
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
      next: (response: HttpResponse<Product>) => {
        this.entity = response.body as Product;
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

  onAddChip(event: any) {
    if (!/^\d+$/.test(event.value)) {
      // Se o valor não for composto apenas por dígitos
      event.preventDefault(); // Impede a adição do chip
      // Opcional: Adicione uma mensagem de erro ou notificação aqui
    }
  }

  disableFormControls() {
    this.editMode = false;
    this.entityForm.get('is_active')?.disable();
    this.entityForm.get('product_eans')?.disable();
  }

  enableFormControls() {
    this.editMode = true;
    this.entityForm.get('is_active')?.enable();
    this.entityForm.get('product_eans')?.enable();
  }

  back(): void {
    this.router.navigate(['/merchant/product-list']);
  }
}
