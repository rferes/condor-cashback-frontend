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
import { CollectionService } from '../../services/collection.service';
import { ProductService } from 'src/app/merchant/product/services/product.service';
import { Collection } from '../../entities/collection.entity';
import { Product } from 'src/app/merchant/product/entities/product.entity';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { collection_view_messages } from '../utils/collection-view-response-msg';
const component_toasts = collection_view_messages();

@Component({
  selector: 'app-collection-view',
  templateUrl: '../views/collection-view.component.html',
})
export class CollectionViewComponent implements OnInit {
  entity: Collection = {} as Collection;
  idComponentEntity: string = '';
  entityForm: FormGroup;

  editMode: boolean = false;
  newObject: boolean = true;

  listScroolerItems: any[] = [];
  scroolerItemsQuantity: number = 21;
  products: Product[] = [];

  viewOnly: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: CollectionService,
    private productService: ProductService
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
      this.editMode = true;
      this.fetchDataSuport();
    } else {
      this.router.navigate(['/merchant/collection-list']);
    }
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<Collection>) => {
        this.entity = response.body as Collection;
        this.newObject = false;
        this.editMode = false;

        this.fetchDataSuport();
        this.entityForm.patchValue(this.entity);
        const listProducts = this.entity.products.map((product) => ({
          ...product,
          combinedLabel: `${product.name}  ${
            product.is_active ? '(Ativa)' : '(Inativa)'
          }`,
        }));
        this.entityForm.get('products')?.setValue(listProducts);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/collection-list']);
        }, 2000);
      },
    });
  }

  // Stores
  fetchDataSuport(): void {
    this.productService.list().subscribe({
      next: (response: HttpResponse<ListResponse<Product>>) => {
        this.products = response.body?.results || [];
        this.listScroolerItems = this.products.map((product) => ({
          ...product,
          combinedLabel: `${product.name}  ${
            product.is_active ? '(Ativa)' : '(Inativa)'
          }`,
        }));
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  private initializeEntityForm() {
    this.entityForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      products: new FormControl(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
    });
  }

  edit() {
    this.editMode = true;
  }

  save() {
    if (this.entityForm.invalid) {
      toastMessage(this.messageService, component_toasts[400]);
      return;
    }

    const payload = { ...this.entityForm.value };
    delete payload.id;
    payload.products = payload.products.map((product: any) => product.id);
    // payload change
    if (this.isNewComponentEntity()) {
      this.createComponentEntity(payload);
    } else {
      this.updateComponentEntity(payload);
    }
  }

  cancel() {
    this.disableFormControls();
    this.entityForm.markAsPristine();
    this.entityForm.patchValue(this.entity);
    const listStores = this.entity.products.map((product) => ({
      ...product,
      combinedLabel: `${product.name}  ${
        product.is_active ? '(Ativa)' : '(Inativa)'
      }`,
    }));
    this.entityForm.get('products')?.setValue(listStores);
  }

  isNewComponentEntity(): boolean {
    return this.entityForm.get('id')?.value === '';
  }

  createComponentEntity(payload: any) {
    this.componentService.create(payload).subscribe({
      next: (response: HttpResponse<Collection>) => {
        this.entity = response.body as Collection;
        toastMessage(this.messageService, component_toasts[response.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/collection-list']);
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
      next: (response: HttpResponse<Collection>) => {
        this.entity = response.body as Collection;
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

  disableFormControls() {
    this.editMode = false;
    this.entityForm.get('address.state')?.disable();
    this.entityForm.get('address.city')?.disable();
  }

  back(): void {
    this.router.navigate(['/merchant/store-group-list']);
  }
}
