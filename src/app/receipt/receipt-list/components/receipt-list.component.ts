import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { ReceiptService as ComponentService } from '../../services/receipt.service';
import { Receipt_In as ComponentEntity } from '../../entities/receipt.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { receipt_list_messages } from '../utils/receipt-list-response-msg';

const component_list_toasts = receipt_list_messages();

@Component({
  selector: 'app-receipt-list',
  templateUrl: '../views/receipt-list.component.html',
})
export class ReceiptListComponent implements OnInit {
  entitys: ComponentEntity[] = [];
  index: number = 0;
  itemsFiltrados: ComponentEntity[] = [];
  globalFilter: string = '';
  balance: boolean = false;
  user_mode: string = localStorage.getItem('type') || '';
  isLoading: boolean = false;

  typeMap: { [key: string]: string } = {
    SUBSCRIPTION_INFLUENCER: 'Assinatura Influencer',
    SUBSCRIPTION_MERCHANT: 'Assinatura Comerciante',
    ADD_RED_CREDITS: 'Adicionar RedAds Creditos',
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
    PIX_NOT_FOUND: 'Pix não encontrado',
  };

  constructor(
    private messageService: MessageService,
    private componentService: ComponentService
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
        this.isLoading = false;
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
        this.isLoading = false;
      },
    });
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  applyFilter(): void {
    this.itemsFiltrados = this.entitys.filter(
      (itens) =>
        itens.access_key
          ?.toLowerCase()
          .includes(this.globalFilter.toLowerCase()) ||
        itens.status?.toLowerCase().includes(this.globalFilter.toLowerCase())
    );

    this.itemsFiltrados.sort((a, b) => {
      const nameA = a.access_key?.toLowerCase() || '';
      const nameB = b.access_key?.toLowerCase() || '';

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
