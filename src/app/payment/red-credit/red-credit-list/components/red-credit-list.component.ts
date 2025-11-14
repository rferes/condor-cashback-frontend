import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { RedCreditService as ComponentService } from '../../services/red-credit.service';
import { RedCredit as ComponentEntity } from '../../entities/red-credit.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { red_credit_list_messages } from '../utils/red-credit-list-response-msg';
import { Wallet } from 'src/app/payment/wallet/wallet-view/entities/wallet.entity';
import { WalletService } from 'src/app/payment/wallet/wallet-view/services/wallet.service';

const component_list_toasts = red_credit_list_messages();

@Component({
  selector: 'app-red-credit-list',
  templateUrl: '../views/red-credit-list.component.html',
})
export class RedCreditListComponent implements OnInit {
  isLoading: boolean = false;
  entitys: ComponentEntity[] = [];
  index: number = 0;
  itemsFiltrados: ComponentEntity[] = [];
  globalFilter: string = '';
  user_mode: string = localStorage.getItem('type') || '';

  statusMap: { [key: string]: string } = {
    PROVISIONED: 'Crédito Provisionado',
    GRANTED: 'Crédito Concedido',
    PROCESSING_TRANSACTION: 'Transação em Processamento',
    USED: 'Crédito Utilizado',
    EXPIRED: 'Crédito Expirado',
    PIX_NOT_FOUND: 'PIX não encontrado',
  };

  constructor(
    private messageService: MessageService,
    private componentService: ComponentService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    if (this.user_mode == 'influencer') {
      this.fetchComponentInfluencer();
      this.applyFilter();
    }
  }

  fetchComponentInfluencer(): void {
    this.isLoading = true;
    this.componentService.listProvisioned().subscribe({
      next: (response: HttpResponse<ListResponse<ComponentEntity>>) => {
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
    this.itemsFiltrados.sort((a, b) => {
      const nameA = a.credit_grant_date || '';
      const nameB = b.credit_grant_date || '';

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
