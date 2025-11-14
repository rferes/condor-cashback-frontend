import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { CouponService as ComponentService } from '../../services/coupon.service';
import { Coupon as ComponentEntity } from '../../entities/coupon.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { coupon_list_messages } from '../utils/coupon-list-response-msg';

const component_list_toasts = coupon_list_messages();

@Component({
  selector: 'app-coupon-list',
  templateUrl: '../views/coupon-list.component.html',
})
export class CouponListComponent implements OnInit {
  entitys: ComponentEntity[] = [];
  index: number = 0;
  itemsFiltrados: ComponentEntity[] = [];
  globalFilter: string = '';
  balance: boolean = false;
  user_mode: string = localStorage.getItem('type') || '';
  isLoading: boolean = false;

  typeMap: { [key: string]: string } = {
    DISCOUNT_PERCENTAGE: 'Desconto Percentual',
    DISCOUNT_VALUE: 'Desconto em Valor',
    CASHBACK: 'Cashback',
  };

  statusMap: { [key: string]: string } = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    EXPIRED: 'Expirado',
    USED: 'Utilizado',
  };

  constructor(
    private messageService: MessageService,
    private componentService: ComponentService
  ) {}

  ngOnInit() {
    if (this.user_mode == 'merchant') {
      this.fetchComponentMerchant();
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

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  applyFilter(): void {
    this.itemsFiltrados = this.entitys.filter(
      (item) =>
        item.used_date?.toString().includes(this.globalFilter) ||
        item.status?.includes(this.globalFilter)
    );

    this.itemsFiltrados.sort((a, b) => {
      const dateA = a.used_date || '';
      const dateB = b.used_date || '';

      if (dateA < dateB) {
        return -1;
      } else if (dateA > dateB) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
