// Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
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

import { WalletService as ComponentService } from '../services/wallet.service';
import { Wallet as ComponentEntity } from '../entities/wallet.entity';
import { Wallet_expiron_soon } from '../entities/wallet.entity';

import { CampaignCreditService } from 'src/app/payment/campaign-credit/services/campaign-credit.service';

import { RedCreditService } from 'src/app/payment/red-credit/services/red-credit.service';

import { CreditCardService } from 'src/app/payment/credit-card/services/credit-card.service';
import { CreditCard } from 'src/app/payment/credit-card/entities/credit-card.entity';

import { PixKeyService } from 'src/app/payment/pix-key/services/pix-key.service';
import { PixKey } from 'src/app/payment/pix-key/entities/pix-key.entity';

import { Transaction } from 'src/app/payment/transaction/entities/transaction.entity';

import { toastMessage } from 'src/app/shared/utils/toast';
import { wallet_messages } from '../utils/wallet-response-msg';
import { float } from '@zxing/library/esm/customTypings';

const component_toasts = wallet_messages();

@Component({
  selector: 'app-wallet',
  templateUrl: '../views/wallet.component.html',
})
export class WalletComponent implements OnInit {
  entity: ComponentEntity = {} as ComponentEntity;
  entity_expiring_soon: Wallet_expiron_soon = {} as Wallet_expiron_soon;
  transaction_pix: Transaction = {} as Transaction;
  idComponentEntity: string = '';
  entityForm: FormGroup;
  redads_tax_withdraw: float = 0.05;

  editMode: boolean = false;

  creditCards: CreditCard[] = [];

  withdrawForm: FormGroup;
  pixKeys: PixKey[] = [];
  user_mode: string = localStorage.getItem('type') || '';
  wallet_auto_reload: boolean = false;

  isLoading: boolean = false;
  tax_withdraw: float = 0.0;
  tax_withdraw_percentage: float = 0.0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService,
    private creditCardService: CreditCardService,
    private pixKeyService: PixKeyService,
    private campaignCreditService: CampaignCreditService,
    private redCreditService: RedCreditService
  ) {
    this.entityForm = this.formBuilder.group({});
    this.withdrawForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeEntityForm();
    this.initializeWithdrawForm();
    this.fetchComponent('me');
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.isLoading = true;
    let loadingCounter = 0;
    const totalRequests = this.user_mode == 'merchant' ? 4 : 3; // wallet + expiring_soon + pixKeys + (creditCards for merchant)

    const markLoadingComplete = () => {
      loadingCounter++;
      if (loadingCounter === totalRequests) {
        this.isLoading = false;
      }
    };

    // Fetch main wallet
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.disableFields();
        this.entityForm.patchValue(this.entity);
        markLoadingComplete();
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        markLoadingComplete();
      },
    });

    // Fetch expiring soon
    this.componentService.campaign_credits_expiring_soon().subscribe({
      next: (response: HttpResponse<Wallet_expiron_soon>) => {
        this.entity_expiring_soon = response.body as Wallet_expiron_soon;
        markLoadingComplete();
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        markLoadingComplete();
      },
    });

    // Fetch support data
    this.fetchDataSuport(markLoadingComplete);
  }

  fetchDataSuport(markLoadingComplete?: () => void): void {
    if (this.user_mode == 'merchant') {
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
          if (markLoadingComplete) markLoadingComplete();
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(this.messageService, component_toasts[error.status]);
          if (markLoadingComplete) markLoadingComplete();
        },
      });
    } else {
      // For influencer, mark this request as complete immediately
      if (markLoadingComplete) markLoadingComplete();
    }

    this.pixKeyService.list().subscribe({
      next: (response: HttpResponse<ListResponse<PixKey>>) => {
        this.pixKeys = response.body?.results || [];
        if (this.pixKeys.length > 0) {
          this.withdrawForm.patchValue({ pix_key: this.pixKeys[0].id });
        }
        if (markLoadingComplete) markLoadingComplete();
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        if (markLoadingComplete) markLoadingComplete();
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
        Validators.minLength(1),
      ]),
      add_balance: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      auto_reload: new FormControl(false),
    });
  }

  private initializeWithdrawForm() {
    this.withdrawForm = this.formBuilder.group({
      amount: new FormControl(0, [Validators.required, Validators.min(10.0)]),
      pix_key: new FormControl('', [Validators.required]),
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
      },
    });
  }

  withdraw() {
    if (this.withdrawForm.invalid) {
      toastMessage(this.messageService, component_toasts[400]);
      return;
    }

    let payload = { ...this.withdrawForm.value };
    payload.pix_key_id = payload.pix_key;
    payload.amount = parseFloat(payload.amount);

    delete payload.pix_key;
    delete payload.id;
    if (this.user_mode == 'merchant') {
      this.withdrawCampaignCredit(payload);
    } else if (this.user_mode == 'influencer') {
      this.withdrawRedCredit(payload);
    }
  }

  withdrawCampaignCredit(payload: any) {
    this.isLoading = true;
    this.campaignCreditService.withdraw(payload).subscribe({
      next: (response: HttpResponse<Transaction>) => {
        this.transaction_pix = response.body as Transaction;
        toastMessage(this.messageService, component_toasts[response.status]);
        this.fetchComponent('me');
        this.isLoading = false;
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  withdrawRedCredit(payload: any) {
    this.isLoading = true;
    this.redCreditService.withdraw(payload).subscribe({
      next: (response: HttpResponse<Transaction>) => {
        this.transaction_pix = response.body as Transaction;
        toastMessage(this.messageService, component_toasts[response.status]);
        this.fetchComponent('me');
        this.isLoading = false;
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  withdrawTax() {
    const withdrawAmount = this.withdrawForm.get('amount')?.value || 0;
    const transferredCredits =
      this.entity_expiring_soon.campaign_credits_transferred || 0;
    const grantedCredits = this.entity.campaign_credits_granted || 0;

    // Se o valor do saque for menor ou igual aos créditos transferidos
    if (withdrawAmount <= transferredCredits) {
      this.tax_withdraw = 0.0;
      return;
    }

    // Calcula quanto precisa usar dos créditos concedidos
    const remainingAmount = withdrawAmount - transferredCredits;
    const grantedCreditsUsed = Math.min(remainingAmount, grantedCredits);

    // Calcula a taxa (5% sobre os créditos concedidos utilizados)
    this.tax_withdraw = grantedCreditsUsed * this.redads_tax_withdraw;
    this.tax_withdraw_percentage = (this.tax_withdraw / withdrawAmount) * 100;
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

  back(): void {
    this.router.navigate(['/merchant/store-group-list']);
  }
}
