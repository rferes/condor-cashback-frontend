import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { TransactionService as ComponentService } from '../../services/transaction.service';
import { Transaction as ComponentEntity } from '../../entities/transaction.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { transactions_list_messages } from '../utils/transaction-list-response-msg';
import { Wallet } from 'src/app/payment/wallet/wallet-view/entities/wallet.entity';
import { WalletService } from 'src/app/payment/wallet/wallet-view/services/wallet.service';

const component_list_toasts = transactions_list_messages();

@Component({
  selector: 'app-transaction-list',
  templateUrl: '../views/transaction-list.component.html',
})
export class TransactionListComponent implements OnInit {
  isLoading: boolean = false;
  entitys: ComponentEntity[] = [];
  index: number = 0;
  itemsFiltrados: ComponentEntity[] = [];
  globalFilter: string = '';
  balance: boolean = false;
  user_mode: string = localStorage.getItem('type') || '';

  typeMap: { [key: string]: string } = {
    SUBSCRIPTION_INFLUENCER: 'Assinatura Influencer',
    SUBSCRIPTION_MERCHANT: 'Assinatura Comerciante',
    ADD_CAMPAIGN_CREDITS: 'Créditos de Campanha',
    REFOUND_CAMPAIGN_CREDITS: 'Estorno de Créditos',
    COMISSION_INFLUENCER: 'Comissão do Influencer',
    CASHBACK_CONSUMER: 'Cashback do Consumidor',
  };

  modeMap: { [key: string]: string } = {
    IN: 'Entrada',
    OUT: 'Saida',
  };

  statusMap: { [key: string]: string } = {
    new: 'Novo',
    created: 'Criado',
    pending: 'Pendente',
    approved: 'Aprovado',
    confirmed: 'Confirmado',
    registered: 'Registrado',
    processing: 'Processando',
    paid: 'Pago',
    failed: 'Falhou',
    denied: 'Negado',
    refused: 'Recusado',
    canceled: 'Cancelado',
    refunded: 'Estornado',
    voided: 'Cancelado',
  };

  constructor(
    private messageService: MessageService,
    private componentService: ComponentService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    if (this.user_mode == 'merchant') {
      this.fetchComponentMerchant();
      this.applyFilter();
    } else if (this.user_mode == 'influencer') {
      this.balance = true;
      this.fetchComponentInfluencer();
      this.applyFilter();
    }
  }

  fetchComponentMerchant(): void {
    this.isLoading = true;
    this.componentService.list().subscribe({
      next: (response: HttpResponse<ListResponse<ComponentEntity>>) => {
        //toastMessage(this.messageService, store_list_toasts[response.status]);
        this.entitys = response.body?.results || [];
        this.itemsFiltrados = this.entitys;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
      },
    });
  }

  fetchComponentInfluencer(): void {
    this.isLoading = true;
    this.componentService.list().subscribe({
      next: (response: HttpResponse<ListResponse<ComponentEntity>>) => {
        //toastMessage(this.messageService, store_list_toasts[response.status]);
        this.entitys = response.body?.results || [];
        this.itemsFiltrados = this.entitys;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
      },
    });
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  applyFilter(): void {
    this.itemsFiltrados = this.entitys.filter((itens) =>
      itens.document?.toLowerCase().includes(this.globalFilter.toLowerCase())
    );

    this.itemsFiltrados.sort((a, b) => {
      const nameA = a.document?.toLowerCase() || '';
      const nameB = b.document?.toLowerCase() || '';

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
