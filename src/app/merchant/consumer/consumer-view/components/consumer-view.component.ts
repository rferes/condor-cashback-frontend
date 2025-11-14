import { Component, OnInit } from '@angular/core';
import { ConsumerService } from 'src/app/merchant/consumer/services/consumer.service';
import { ReceiptService } from 'src/app/receipt/services/receipt.service';
import { CouponService } from 'src/app/coupon/services/coupon.service';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Consumer } from '../../entities/consumer.entity';
import { Receipt } from 'src/app/receipt/entities/receipt.entity';
import { Coupon } from 'src/app/coupon/entities/coupon.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { toastMessage } from 'src/app/shared/utils/toast';
import { consumer_view_messages } from '../utils/consumer-view-response-msg';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

const component_toasts = consumer_view_messages();

@Component({
  selector: 'app-consumer-view',
  templateUrl: '../views/consumer-view.component.html',
})
export class ConsumerViewComponent implements OnInit {
  receipts: Receipt[] = [];
  consumer = {} as Consumer;
  consumerDocument: string = '';
  itemsFiltrados: Receipt[] = [];
  globalFilter: string = '';
  couponsFiltrados: Coupon[] | null = [];
  coupons: Coupon[] | null = [];
  couponFilter: string = '';

  last_consumers_receipts: Receipt[] = [];
  isLoading: boolean = false;

  constructor(
    private messageService: MessageService,
    private consumerService: ConsumerService,
    private receiptService: ReceiptService,
    private couponService: CouponService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchComponent();
  }

  fetchComponent(): void {
    this.isLoading = true;
    this.consumerService.get_lasts_new_consumers().subscribe({
      next: (response: HttpResponse<[Receipt]>) => {
        if (response.status === 201 && response.body) {
          this.last_consumers_receipts = response.body;
        }
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  getConsumerData(): void {
    this.isLoading = true;
    const consumerDocumentClean = this.consumerDocument.replace(/[-.\/]/g, '');
    this.receiptService
      .get_receipts_by_consumer(consumerDocumentClean)
      .subscribe({
        next: (response: HttpResponse<Receipt>) => {
          if (response.status === 200 && response.body) {
            this.receipts = Array.isArray(response.body)
              ? response.body
              : [response.body];
            this.applyFilter();
            this.consumerService.get_by_cpf(consumerDocumentClean).subscribe({
              next: (response: HttpResponse<Consumer>) => {
                if (response.body) {
                  this.consumer = response.body;
                }
              },
              error: (error: HttpErrorResponse) => {
                this.consumer = {} as Consumer;
                toastMessage(
                  this.messageService,
                  component_toasts[error.status]
                );
              },
            });
            this.getCoupons(consumerDocumentClean);
          }
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(this.messageService, component_toasts[error.status]);
          this.isLoading = false;
        },
      });
  }

  getCoupons(consumerDocumentClean: string): void {
    this.couponService
      .get_coupons_by_consumer(consumerDocumentClean)
      .subscribe({
        next: (response: HttpResponse<Coupon>) => {
          if (response.body) {
            this.coupons = Array.isArray(response.body)
              ? response.body
              : [response.body];
            this.couponsFiltrados = this.coupons;
          } else {
            this.coupons = [];
            this.couponsFiltrados = [];
          }
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(this.messageService, component_toasts[error.status]);
        },
      });
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  applyFilter(): void {
    this.itemsFiltrados = this.receipts.filter(
      (itens) =>
        itens.access_key
          ?.toLowerCase()
          .includes(this.globalFilter.toLowerCase()) ||
        itens.emission_date?.toString().includes(this.globalFilter) ||
        itens.consumer_document?.toString().includes(this.globalFilter) ||
        itens.influencer_document?.toString().includes(this.globalFilter)
    );

    this.itemsFiltrados.sort((a, b) => {
      const nameA = a.emission_date?.toString() || '';
      const nameB = b.emission_date?.toString() || '';

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  clearCouponFilter() {
    this.couponFilter = '';
  }

  viewConsumer(consumer_document: string): void {
    this.consumerDocument = consumer_document;
    this.getConsumerData();
    if (!this.consumer) {
      this.receipts = [];
    }
  }

  clearConsumerData(): void {
    this.consumer = {} as Consumer;
    this.receipts = [];
    this.itemsFiltrados = [];
    this.coupons = [];
    this.couponsFiltrados = [];
  }
}
