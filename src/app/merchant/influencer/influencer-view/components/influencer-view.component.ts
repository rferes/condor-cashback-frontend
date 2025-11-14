import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { FileDownloadService } from 'src/app/shared/services/file-downloads.service';
import { uuid } from 'uuidv4';

import { ProfileService as InfluencerService } from 'src/app/influencer/profile/services/profile.service';
import { MerchantInfluencerFriendshipService } from 'src/app/merchant/influencer/services/influencer.service';
import { ReceiptService } from 'src/app/receipt/services/receipt.service';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';
import { Receipt } from 'src/app/receipt/entities/receipt.entity';
import { MerchantInfluencerFriendship } from 'src/app/shared/entities/merchant-influencer-friendship.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { toastMessage } from 'src/app/shared/utils/toast';

import { influencer_response } from 'src/app/influencer/profile/utils/profile-response-msg';
import { influencer_view_messages } from '../utils/influencer-view-response-msg';

const component_toasts = influencer_view_messages();
const influencer_toasts = influencer_response();

@Component({
  selector: 'app-influencer-view',
  templateUrl: '../views/influencer-view.component.html',
})
export class InfluencerViewComponent implements OnInit {
  baseURL: string = environment.apiUrl;
  endURL: string = 'influencers/receipt_influencer_csv/';
  receipts: Receipt[] = [];
  influencerName: string = '';
  influencer = {} as Influencer;
  influencerSuggestions: Influencer[] = [];
  lastInfluencerName: string = '';
  itemsFiltrados: Receipt[] = [];
  globalFilter: string = '';

  merchantInfluencerFriendships: MerchantInfluencerFriendship[] = [];
  itemsFiltradosFriendship: MerchantInfluencerFriendship[] = [];
  globalFilterFriendship: string = '';
  isFavorited = false;

  invite_influencer = false;

  emailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private merchantInfluencerFriendshipService: MerchantInfluencerFriendshipService,
    private influencerService: InfluencerService,
    private receiptService: ReceiptService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    private fileDownloadService: FileDownloadService
  ) {
    this.emailForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeEmailForm();
    this.influencerName = '';
    this.fetchComponent();
  }

  fetchComponent(): void {
    this.getMerchantInfluencerFriendship();
  }

  private initializeEmailForm() {
    this.emailForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  getInfluencerData(influencer: Influencer): void {
    const influencerId = influencer.id?.toString();
    if (influencerId) {
      this.receiptService.get_receipts_by_influencer(influencerId).subscribe({
        next: (response: HttpResponse<Receipt>) => {
          if (response.status === 200) {
            if (response.body) {
              this.receipts = Array.isArray(response.body)
                ? response.body
                : [response.body];
              this.applyFilter();

              if (
                this.merchantInfluencerFriendships?.some(
                  (friendship) => friendship?.influencer?.id === influencer.id
                )
              ) {
                this.isFavorited = true;
              } else {
                this.isFavorited = false;
              }
            } else {
              toastMessage(this.messageService, component_toasts[404]);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(this.messageService, component_toasts[error.status]);
        },
      });
    } else {
      console.error('Invalid influencerId:', influencerId);
    }
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  getMerchantInfluencerFriendship() {
    this.merchantInfluencerFriendshipService.list().subscribe({
      next: (response: HttpResponse<MerchantInfluencerFriendship>) => {
        this.merchantInfluencerFriendships = Array.isArray(response.body)
          ? response.body
          : response.body
          ? [response.body]
          : [];
        this.itemsFiltradosFriendship = this.merchantInfluencerFriendships;
        this.applyFilterFriendship();
      },
      error: (error: HttpErrorResponse) => {
        //console.log(error);
      },
    });
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

  applyFilterFriendship(): void {
    this.itemsFiltradosFriendship = this.merchantInfluencerFriendships.filter(
      (itens) =>
        itens.influencer.name
          ?.toLowerCase()
          .includes(this.globalFilter.toLowerCase()) ||
        itens.merchant.name?.toString().includes(this.globalFilter) ||
        itens.influencer.document?.toString().includes(this.globalFilter) ||
        itens.merchant.document?.toString().includes(this.globalFilter)
    );

    this.itemsFiltradosFriendship.sort((a, b) => {
      const nameA = a.created_date;
      const nameB = b.created_date;

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  deleteMerchantInfluencerFriendship(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja EXCLUIR sua campanha?',
      accept: () => {
        const row = this.itemsFiltradosFriendship[rowPosition];
        const componentId = String(row?.id) || '';
        this.merchantInfluencerFriendshipService.delete(componentId).subscribe({
          next: (response: HttpResponse<MerchantInfluencerFriendship>) => {
            const index = this.merchantInfluencerFriendships.findIndex(
              (item) => String(item.id) === componentId
            );
            if (index !== -1) {
              this.merchantInfluencerFriendships.splice(index, 1);
            }
            this.applyFilter();
            if (this.influencer.id === row.influencer.id) {
              this.isFavorited = false;
            }
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });
      },
      reject: () => {
        console.log('Rejeitado');
      },
    });
  }

  favoriteInfluencer(): void {
    const payload = {
      influencer: this.influencer.id,
    };
    this.merchantInfluencerFriendshipService.create(payload).subscribe({
      next: (response: HttpResponse<MerchantInfluencerFriendship>) => {
        this.merchantInfluencerFriendships.push(
          response.body as MerchantInfluencerFriendship
        );
        this.applyFilterFriendship();
        this.isFavorited = true;
        toastMessage(this.messageService, component_toasts[response.status]);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  unfavoriteInfluencer(): void {
    const influencerId = this.influencer.id;
    const friendship = this.merchantInfluencerFriendships.find(
      (item) => item.influencer.id === influencerId
    );
    if (friendship) {
      const componentId = String(friendship.id) || '';
      this.merchantInfluencerFriendshipService.delete(componentId).subscribe({
        next: (response: HttpResponse<MerchantInfluencerFriendship>) => {
          const index = this.merchantInfluencerFriendships.findIndex(
            (item) => String(item.id) === componentId
          );
          if (index !== -1) {
            this.merchantInfluencerFriendships.splice(index, 1);
          }
          this.applyFilterFriendship();
          this.isFavorited = false;
          toastMessage(this.messageService, component_toasts[response.status]);
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(this.messageService, component_toasts[error.status]);
        },
      });
    }
  }

  async searchInfluencer(event: any) {
    const influencerName = event.query;

    if (!influencerName || influencerName.length < 3) return;

    const params = { name_or_document: influencerName };

    if (
      influencerName.length === 3 ||
      (influencerName.length > 2 &&
        !influencerName.includes(this.lastInfluencerName))
    ) {
      try {
        const response = await this.influencerService.list(params).toPromise();
        this.influencerSuggestions = response?.body?.results || [];
      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          console.error('Error fetching influencer data:', error);
          toastMessage(this.messageService, component_toasts[error.status]);
        }
      }
    } else {
      this.influencerSuggestions = this.influencerSuggestions.filter(
        (influencer: any) =>
          influencer.name.includes(influencerName) ||
          influencer.document.includes(influencerName.replace(/[-.\/]/g, ''))
      );
    }

    this.lastInfluencerName = influencerName;
  }

  onSelectInfluencer(event: any) {
    let influencersList = this.influencerSuggestions;

    // Encontre o influenciador selecionado na lista
    let selectedInfluencer = influencersList.find(
      (influencer: Influencer) => influencer.id === event.value.id
    );

    // Se o influenciador selecionado não estiver na lista, adicione-o
    if (!selectedInfluencer) {
      toastMessage(this.messageService, influencer_toasts[409]);
    }
    this.influencer = selectedInfluencer as Influencer;
    this.getInfluencerData(this.influencer);
  }

  toggleFavorite() {
    this.isFavorited = !this.isFavorited;
  }

  sendInfluencerInviteEmail() {
    const payload = {
      email: this.emailForm.get('email')?.value,
    };
    this.influencerService.inviteInfluencerByEmail(payload).subscribe({
      next: (response: HttpResponse<string>) => {
        toastMessage(this.messageService, component_toasts[response.status]);
        this.emailForm.get('email')?.setValue('');
        this.invite_influencer = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  viewInfluencer(
    influencer_name: string,
    influencer_id: typeof uuid,
    influencer: Influencer
  ): void {
    this.influencerName = influencer_name;
    this.influencer = influencer;
    this.receiptService
      .get_receipts_by_influencer(influencer_id.toString())
      .subscribe({
        next: (response: HttpResponse<Receipt>) => {
          if (response.status === 200) {
            if (response.body) {
              this.receipts = Array.isArray(response.body)
                ? response.body
                : [response.body];
              this.applyFilter();
              this.influencerService.get(influencer_id.toString()).subscribe({
                next: (response: HttpResponse<Influencer>) => {
                  this.influencer = response.body as Influencer;
                  this.getInfluencerData(this.influencer);

                  toastMessage(this.messageService, component_toasts[200]);
                },
                error: (error: HttpErrorResponse) => {
                  toastMessage(
                    this.messageService,
                    component_toasts[error.status]
                  );
                },
              });

              if (
                this.merchantInfluencerFriendships.some(
                  (friendship) => friendship.influencer.id === influencer_id
                )
              ) {
                this.isFavorited = true;
              } else {
                this.isFavorited = false;
              }
            } else {
              toastMessage(this.messageService, component_toasts[404]);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(this.messageService, component_toasts[error.status]);
          this.influencerService.get(influencer_id.toString()).subscribe({
            next: (response: HttpResponse<Influencer>) => {
              this.influencer = response.body as Influencer;
              this.getInfluencerData(this.influencer);
            },
            error: (error: HttpErrorResponse) => {
              toastMessage(this.messageService, component_toasts[error.status]);
            },
          });
        },
      });
  }

  downloadCSV() {
    const fileName: string = `RedRed_Notas_Influencer_${this.influencer.name}.csv`;
    const formData = new FormData();
    formData.append('influencer_id', this.influencer.id.toString());
    const url_csv_campaign_detail = this.baseURL + this.endURL;
    this.fileDownloadService.fileDownload(
      url_csv_campaign_detail,
      fileName,
      formData
    );
  }
}
