// Angular imports
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Third-party libraries
import { MessageService } from 'primeng/api';

// Application imports
import { ListResponse } from 'src/app/shared/entities/list-response.entity';

import { AutoReloadCampaignCreditService as ComponentService } from '../services/auto-reload-campaign-credit.service';
import { AutoReloadCampaignCredit as ComponentEntity } from '../entities/auto-reload-campaign-credit.entity';

import { CreditCardService } from 'src/app/payment/credit-card/services/credit-card.service';
import { CreditCard } from 'src/app/payment/credit-card/entities/credit-card.entity';

import { toastMessage } from 'src/app/shared/utils/toast';
import { auto_reload_campaign_credits_messages } from '../utils/auto-reload-campaign-credit-response-msg';

const component_toasts = auto_reload_campaign_credits_messages();

@Component({
  selector: 'app-auto-reload-campaign-credit',
  templateUrl: '../views/auto-reload-campaign-credit.component.html',
})
export class AutoReloadCampaignCreditComponent implements OnInit {
  entity: ComponentEntity = {} as ComponentEntity;
  idComponentEntity: string = '';
  entityForm: FormGroup;

  editMode: boolean = false;

  creditCards: CreditCard[] = [];

  system_min_balance: number = 500;
  system_add_balance: number = 1000;

  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService,
    private creditCardService: CreditCardService,
    private cdr: ChangeDetectorRef
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeEntityForm();
    const params = this.route.snapshot.params;
    this.fetchComponent('me');
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.isLoading = true;
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.system_min_balance = parseFloat(this.entity.system_min_balance);
        this.system_add_balance = parseFloat(this.entity.system_add_balance);
        this.disableFields();
        this.fetchDataSuport();
        this.entityForm.patchValue(this.entity);
        this.entityForm.patchValue({
          min_balance: parseFloat(this.entity.min_balance),
          add_balance: parseFloat(this.entity.add_balance),
          system_min_balance: parseFloat(this.entity.system_min_balance),
          system_add_balance: parseFloat(this.entity.system_add_balance),
        });
        this.system_min_balance = parseFloat(this.entity.system_min_balance);
        this.system_add_balance = parseFloat(this.entity.system_add_balance);
        this.updateMinBalanceValidator(this.system_min_balance);
        this.updateAddBalanceValidator(this.system_add_balance);
        this.cdr.detectChanges();

        if (this.entity.auto_reload) {
          this.entityForm.patchValue({
            credit_card: this.entity.credit_card.id,
          });
        }
        setTimeout(() => {
          this.entityForm.get('auto_reload')?.setValue(this.entity.auto_reload);
        }, 100); // Delay in milliseconds
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  // Stores
  fetchDataSuport(): void {
    this.isLoading = true;
    this.creditCardService.list().subscribe({
      next: (response: HttpResponse<ListResponse<CreditCard>>) => {
        this.creditCards = response.body?.results || [];
        if (this.creditCards.length > 0) {
          this.entityForm.patchValue({
            credit_card:
              this.entityForm.value.credit_card || this.creditCards[0].id,
          });
        } else {
          this.entityForm.patchValue({
            credit_card: '',
          });
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  private initializeEntityForm() {
    this.entityForm = this.formBuilder.group({
      credit_card: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      min_balance: new FormControl('', [
        Validators.required,
        Validators.min(this.system_min_balance),
      ]),
      add_balance: new FormControl('', [
        Validators.required,
        Validators.min(this.system_add_balance),
      ]),
      auto_reload: new FormControl(false),
    });
  }

  edit() {
    this.enableFields();
  }

  save() {
    if (this.entityForm.invalid) {
      toastMessage(this.messageService, component_toasts[400]);
      this.updateComponentEntity(this.entityForm.value);
      return;
    }

    const payload = { ...this.entityForm.value };
    delete payload.id;
    this.updateComponentEntity(payload);
  }

  cancel() {
    this.disableFields();
    this.entityForm.markAsPristine();
    this.entityForm.patchValue(this.entity);
  }

  updateComponentEntity(payload: any) {
    this.isLoading = true;
    const pk = this.entityForm.value.id;
    this.componentService.partial_update(payload, pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.entityForm.patchValue(response);
        this.disableFields();
        this.entityForm.markAsPristine();
        toastMessage(this.messageService, component_toasts[response.status]);
        this.isLoading = false;
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        this.isLoading = false;
        this.entityForm.patchValue({ auto_reload: false });
      },
    });
  }

  enableFields(): void {
    this.editMode = true;
    this.entityForm.get('credit_card')?.enable();
    this.entityForm.get('auto_reload')?.enable();
  }

  disableFields(): void {
    this.editMode = false;
    this.entityForm.get('credit_card')?.disable();
    this.entityForm.get('auto_reload')?.disable();
  }

  updateMinBalanceValidator(newMinValue: number) {
    const minBalanceControl = this.entityForm.get('min_balance');
    if (minBalanceControl) {
      minBalanceControl.setValidators([
        Validators.required,
        Validators.min(newMinValue), // Set the new minimum value
      ]);
      minBalanceControl.updateValueAndValidity(); // Re-evaluate the control validity
    }
  }

  updateAddBalanceValidator(newAddValue: number) {
    const addBalanceControl = this.entityForm.get('add_balance');
    if (addBalanceControl) {
      addBalanceControl.setValidators([
        Validators.required,
        Validators.min(newAddValue), // Set the new minimum value
      ]);
      addBalanceControl.updateValueAndValidity(); // Re-evaluate the control validity
    }
  }

  back(): void {
    this.router.navigate(['/merchant/store-group-list']);
  }
}
