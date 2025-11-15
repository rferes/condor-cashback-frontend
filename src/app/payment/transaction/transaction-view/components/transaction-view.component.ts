// Angular imports
import * as moment from 'moment-timezone';
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

import { Transaction as ComponentEntity } from 'src/app/payment/transaction/entities/transaction.entity';
import { TransactionService as ComponentService } from 'src/app/payment/transaction/services/transaction.service';
import { toastMessage } from 'src/app/shared/utils/toast';
import { transcation_view_messages } from '../utils/transaction-view-response-msg';

const component_toasts = transcation_view_messages();

@Component({
  selector: 'app-transaction-view',
  templateUrl: '../views/transaction-view.component.html',
})
export class TransactionViewComponent implements OnInit {
  user_type: string = 'merchant';
  entity: ComponentEntity = {} as ComponentEntity;
  entityId: string = '';
  user_mode: string = localStorage.getItem('type') || '';

  typeMap: { [key: string]: string } = {
    SUBSCRIPTION_INFLUENCER: 'Assinatura Influencer',
    SUBSCRIPTION_MERCHANT: 'Assinatura Comerciante',
    ADD_CAMPAIGN_CREDITS: 'Créditos de Campanha',
    REFOUND_CAMPAIGN_CREDITS: 'Estorno de Créditos',
    COMISSION_INFLUENCER: 'Comissão do Influencer',
    CASHBACK_CONSUMER: 'Cashback do Consumidor',
    TRANSFER_CAMPAIGN_CREDITS: 'Transferência de Créditos',
  };

  modeMap: { [key: string]: string } = {
    IN: 'Entrada',
    OUT: 'Saída',
  };

  statusMap: { [key: string]: string } = {
    NEW: 'Novo',
    PENDING: 'Pendente',
    SUCCESS: 'Sucesso',
    FAILED: 'Falhou',
    REFUSED: 'Recusado',
    CANCELED: 'Cancelado',
    REFUNDED: 'Estornado',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService
  ) {}

  ngOnInit() {
    this.user_type = localStorage.getItem('type') || 'merchant';
    const params = this.route.snapshot.params;
    if (params['id']) {
      this.fetchComponent(params['id']);
      if (this.user_type === 'influencer') {
      }
    }
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        //toastMessage(this.messageService, store_list_toasts[response.status]);
        this.entity = response.body as ComponentEntity;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  back(): void {
    this.router.navigate(['reports/transaction-list']);
  }
}
