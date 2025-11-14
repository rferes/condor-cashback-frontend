// Angular imports
import * as moment from 'moment-timezone';
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

// Third-party libraries
import { MessageService } from 'primeng/api';

import { Receipt as ComponentEntity } from 'src/app/receipt/entities/receipt.entity';
import { ReceiptService as ComponentService } from 'src/app/receipt/services/receipt.service';
import { toastMessage } from 'src/app/shared/utils/toast';
import { receipt_view_messages } from '../utils/receipt-view-response-msg';

const component_toasts = receipt_view_messages();

@Component({
  selector: 'app-receipt-view',
  templateUrl: '../views/receipt-view.component.html',
})
export class ReceiptViewComponent implements OnInit {
  user_type: string = 'merchant';
  entity: ComponentEntity = {} as ComponentEntity;
  entityId: string = '';
  user_mode: string = localStorage.getItem('type') || '';

  typeMap: { [key: string]: string } = {
    SUBSCRIPTION_INFLUENCER: 'Assinatura Influencer',
    SUBSCRIPTION_MERCHANT: 'Assinatura Comerciante',
    ADD_RED_CREDITS: 'Adicionar Ads Creditos',
    COMISSION_INFLUENCER: 'Comissão do Influencer',
    CASHBACK_CONSUMER: 'Cashback do Consumidor',
  };

  modeMap: { [key: string]: string } = {
    IN: 'Entrada',
    OUT: 'Saida',
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
    this.router.navigate(['reports/receipt-list']);
  }
}
