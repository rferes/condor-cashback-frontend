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
import { ListResponse } from 'src/app/shared/entities/list-response.entity';

import { StoreGroupService as ComponentService } from '../../services/store-group.service';
import { StoreGroup as ComponentEntity } from '../../entities/store-group.entity';

import { StoreService } from 'src/app/merchant/store/services/store.service';
import { Store } from 'src/app/merchant/store/entities/store.entity';

import { toastMessage } from 'src/app/shared/utils/toast';
import { store_group_view_messages } from '../utils/store-group-view-response-msg';

const component_toasts = store_group_view_messages();

@Component({
  selector: 'app-store-group-view',
  templateUrl: '../views/store-group-view.component.html',
})
export class StoreGroupViewComponent implements OnInit {
  entity: ComponentEntity = {} as ComponentEntity;
  idComponentEntity: string = '';
  entityForm: FormGroup;

  editMode: boolean = false;
  newObject: boolean = true;

  listScroolerItems: any[] = [];
  scroolerItemsQuantity: number = 21;
  stores: Store[] = [];

  viewOnly: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService,
    private storeService: StoreService
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
      this.editMode = false;
    } else if (params['id'] === 'new') {
      this.newObject = true;
      this.editMode = true;
      this.fetchDataSuport();
      // get stores value update
    } else {
      this.router.navigate(['/merchant/store-group-list']);
    }
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.newObject = false;
        this.editMode = false;

        this.fetchDataSuport();
        this.entityForm.patchValue(this.entity);
        const listStores = this.entity.stores.map((store) => ({
          ...store,
          combinedLabel: `${store.name}  ${
            store.is_active ? '(Ativa)' : '(Inativa)'
          }`,
        }));
        this.entityForm.get('stores')?.setValue(listStores);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/store-group-list']);
        }, 2000);
      },
    });
  }

  // Stores
  fetchDataSuport(): void {
    this.storeService.list().subscribe({
      next: (response: HttpResponse<ListResponse<Store>>) => {
        this.stores = response.body?.results || [];
        this.listScroolerItems = this.stores.map((store) => ({
          ...store,
          combinedLabel: `${store.name}  ${
            store.is_active ? '(Ativa)' : '(Inativa)'
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
      stores: new FormControl(
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
    payload.stores = payload.stores.map((store: any) => store.id);
    // payload change
    if (this.isNewComponentEntity()) {
      this.createComponentEntity(payload);
    } else {
      this.updateComponentEntity(payload);
    }
  }

  cancel() {
    this.editMode = false;
    this.entityForm.markAsPristine();
    this.entityForm.patchValue(this.entity);
    const listStores = this.entity.stores.map((store) => ({
      ...store,
      combinedLabel: `${store.name}  ${
        store.is_active ? '(Ativa)' : '(Inativa)'
      }`,
    }));
    this.entityForm.get('stores')?.setValue(listStores);
  }

  isNewComponentEntity(): boolean {
    return this.entityForm.get('id')?.value === '';
  }

  createComponentEntity(payload: any) {
    this.componentService.create(payload).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        toastMessage(this.messageService, component_toasts[response.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/store-group-list']);
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
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.entityForm.patchValue(response);
        this.editMode = false;
        this.entityForm.markAsPristine();
        toastMessage(this.messageService, component_toasts[response.status]);
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  back(): void {
    this.router.navigate(['/merchant/store-group-list']);
  }
}
