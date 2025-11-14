// Angular imports
import * as moment from 'moment-timezone';
import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

// Third-party libraries
import { MessageService, ConfirmationService } from 'primeng/api';

import { Coupon as ComponentEntity } from 'src/app/coupon/entities/coupon.entity';
import { CouponService as ComponentService } from 'src/app/coupon/services/coupon.service';
import { toastMessage } from 'src/app/shared/utils/toast';
import { coupon_view_messages } from '../utils/coupon-view-response-msg';

const component_toasts = coupon_view_messages();

@Component({
  selector: 'app-coupon-view',
  templateUrl: '../views/coupon-view.component.html',
})
export class CouponViewComponent implements OnInit {
  user_type: string = 'merchant';
  entity: ComponentEntity = {} as ComponentEntity;
  entityId: string = '';
  user_mode: string = localStorage.getItem('type') || '';
  refound_allow: boolean = false;

  typeMap: { [key: string]: string } = {
    PERCENTAGE: 'Porcentagem',
    FIXED: 'Valor Fixo',
    SHIPPING: 'Frete Grátis',
  };

  statusMap: { [key: string]: string } = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    EXPIRED: 'Expirado',
    USED: 'Utilizado',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService,
    private confirmationService: ConfirmationService
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
        this.checkRefundAllow();
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  // Check if the coupon can be refunded
  checkRefundAllow(): void {
    if (this.entity.status === 'USED' && this.entity.created_date) {
      const current_date = new Date();
      const created_date = new Date(this.entity.created_date);
      const diff_time = current_date.getTime() - created_date.getTime();
      const diff_days = Math.floor(diff_time / (1000 * 60 * 60 * 24));
      if (diff_days <= 30) {
        this.refound_allow = true;
      }
    }
  }

  // Refund Coupon
  refundCoupon(): void {
    console.log('Estorno do cupom');
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja estornar este cupom?',
      header: 'Confirmação de Estorno',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const coupon_id: string = this.entity.id.toString();
        this.componentService.refund_coupon(coupon_id).subscribe({
          next: (response) => {
            this.entity.status = 'REFUNDED'; // Update local status after successful refund
            toastMessage(this.messageService, {
              severity: 'success',
              summary: 'Cupom estornado',
              detail: 'O cupom foi estornado com sucesso.',
              life: 3000,
            });
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, {
              severity: 'error',
              summary: 'Erro ao estornar cupom',
              detail:
                'Ocorreu um erro ao tentar estornar o cupom. Por favor, tente novamente.',
              life: 4000,
            });
          },
        });
      },
      reject: () => {
        console.log('Estorno cancelado');
      },
    });
  }

  back(): void {
    this.router.navigate(['reports/coupon-list']);
  }
}
