import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { CampaignService as ComponentService } from '../../services/campaign.service';
import {
  Campaign as ComponentEntity,
  CampaignInfluencer,
  CampaignConflict,
  Campaign,
} from '../../entities/campaign.entity';
import { toastMessage } from 'src/app/shared/utils/toast';
import { campaign_list_messages } from '../utils/campaign-list-response-msg';
import { Wallet } from 'src/app/payment/wallet/wallet-view/entities/wallet.entity';
import { WalletService } from 'src/app/payment/wallet/wallet-view/services/wallet.service';
import { ProfileService as InfluencerProfileService } from 'src/app/influencer/profile/services/profile.service';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';
import { Router } from '@angular/router';

const component_list_toasts = campaign_list_messages();

interface InfluencerInvitesStatus {
  [key: string]: string;
}

@Component({
  selector: 'app-campaign-list',
  templateUrl: '../views/campaign-list.component.html',
})
export class CampaignListComponent implements OnInit {
  entitys: ComponentEntity[] = [];
  index: number = 0;
  itemsFiltrados: ComponentEntity[] = [];
  globalFilter: string = '';
  balance: boolean = false;
  user_mode: string = localStorage.getItem('type') || '';
  isLoading: boolean = false;
  merchantPartnerships: any[] = [];
  influencerParticipations: CampaignInfluencer[] = [];
  influencerInvitesStatus: InfluencerInvitesStatus = {};
  campaignConflicts: CampaignConflict[] = [];
  statusMap: InfluencerInvitesStatus = {
    SKETCH: 'Rascunho',
    PROPROSAL: 'Proposta',
    PROPOSAL_FINISHED: 'Proposta Finalizada',
    REPROVED: 'Reprovado',
    APPROVED_NO_INFLUENCER: 'Aprovada SI',
    APPROVED: 'Aprovado',
    ACTIVE: 'Ativa',
    PAUSE_MANUAL: 'Pausada',
    PAUSE_NO_INFLUENCER: 'Pausada(sem influencer)',
    FINISHED: 'Encerrada',
    FINISHED_MANUAL: 'Encerrada Manualmente',
    FINISHED_MANUAL_INFLUENCER: 'Encerrada Manualmente Influencer',
    FINISHED_MANUAL_SPONSOR: 'Encerrada Manualmente Patrocinador',
  };
  influencer!: Influencer;
  campaignsWithConflicts: Set<string> = new Set();

  constructor(
    private messageService: MessageService,
    private componentService: ComponentService,
    private confirmationService: ConfirmationService,
    private walletService: WalletService,
    private router: Router,
    private influencerProfileService: InfluencerProfileService
  ) {}

  ngOnInit() {
    if (this.user_mode == 'merchant') {
      this.fetchWallet();
      this.fetchComponentMerchant();
    } else if (this.user_mode == 'influencer') {
      this.fetchComponentInfluencer();
    }
  }

  fetchWallet(): void {
    this.walletService.get('me').subscribe({
      next: (response: HttpResponse<Wallet>) => {
        const valueBalance = response.body?.campaign_credits_granted;
        if (valueBalance && valueBalance > 0) {
          this.balance = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
      },
    });
  }

  fetchComponentMerchant(): void {
    this.isLoading = true;
    this.componentService.list().subscribe({
      next: (response: HttpResponse<ListResponse<ComponentEntity>>) => {
        this.entitys = response.body?.results || [];
        this.itemsFiltrados = this.entitys;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
        this.isLoading = false;
      },
    });
    this.componentService.listAllConflictsCampaign().subscribe({
      next: (response: HttpResponse<CampaignConflict[]>) => {
        if (response.body) {
          this.campaignConflicts = Array.isArray(response.body)
            ? response.body
            : [response.body];
          this.processCampaignConflicts();
        } else {
          this.campaignConflicts = [];
        }
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
      },
    });
  }

  fetchComponentInfluencer(): void {
    this.isLoading = true;

    this.influencerProfileService.get('me').subscribe({
      next: (response: HttpResponse<Influencer>) => {
        if (response.body) {
          this.influencer = response.body;
          this.componentService.listInfluencerParticipations().subscribe({
            next: (response: HttpResponse<CampaignInfluencer[]>) => {
              this.influencerParticipations =
                (response.body as unknown as CampaignInfluencer[]) ?? [];
              this.componentService.list().subscribe({
                next: (response: HttpResponse<ListResponse<Campaign>>) => {
                  this.entitys = response.body?.results || [];
                  this.itemsFiltrados = this.entitys;
                  this.isLoading = false;
                  this.getStatusInviteInfluencers();
                  this.balance = true;
                  this.isLoading = false;
                  this.influencerProfileService
                    .merchant_partnership_list()
                    .subscribe({
                      next: (response: HttpResponse<Merchant[]>) => {
                        this.merchantPartnerships = response.body || [];
                      },
                      error: (error: HttpErrorResponse) => {
                        toastMessage(
                          this.messageService,
                          component_list_toasts[error.status]
                        );
                      },
                    });
                },
                error: (error: HttpErrorResponse) => {
                  toastMessage(
                    this.messageService,
                    component_list_toasts[error.status]
                  );
                  this.isLoading = false;
                },
              });
            },
            error: (error: HttpErrorResponse) => {
              toastMessage(
                this.messageService,
                component_list_toasts[error.status]
              );
            },
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
      },
    });
  }

  deleteComponent(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja EXCLUIR sua campanha?',
      accept: () => {
        this.isLoading = true;
        const row = this.itemsFiltrados[rowPosition];
        const componentId = String(row?.id) || '';
        this.componentService.delete(componentId).subscribe({
          next: (response: HttpResponse<ComponentEntity>) => {
            const index = this.entitys.findIndex(
              (item) => String(item.id) === componentId
            );
            if (index !== -1) {
              this.entitys.splice(index, 1);
            }
            this.applyFilter();
            this.isLoading = false;
            toastMessage(
              this.messageService,
              component_list_toasts[response.status]
            );
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(
              this.messageService,
              component_list_toasts[error.status]
            );
            this.isLoading = false;
          },
        });
      },
      reject: () => {
        console.log('Rejeitado');
      },
    });
  }

  reactivateCampaign(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja REATIVAR sua campanha?',
      accept: () => {
        this.isLoading = true;
        const row = this.itemsFiltrados[rowPosition];
        const componentId = String(row?.id) || '';
        const payload = {
          status: 'ACTIVE',
        };
        this.componentService.partial_update(payload, componentId).subscribe({
          next: (response: HttpResponse<ComponentEntity>) => {
            // Update the campaign status in the list
            this.entitys[rowPosition] = response.body as ComponentEntity;
            this.itemsFiltrados[rowPosition] = response.body as ComponentEntity;

            // Apply the filter to refresh the view
            this.applyFilter();

            toastMessage(
              this.messageService,
              component_list_toasts[response.status]
            );
            this.isLoading = false;
          },
          error: (error) => {
            toastMessage(
              this.messageService,
              component_list_toasts[error.status]
            );
            this.isLoading = false;
          },
        });
      },
      reject: () => {
        console.log('Rejeitado');
      },
    });
  }

  pauseCampaign(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja PAUSAR sua campanha?',
      accept: () => {
        this.isLoading = true;
        const row = this.itemsFiltrados[rowPosition];
        const componentId = String(row?.id) || '';
        const payload = {
          status: 'PAUSE_MANUAL',
        };
        this.componentService.partial_update(payload, componentId).subscribe({
          next: (response: HttpResponse<ComponentEntity>) => {
            // Update the campaign status in the list
            this.entitys[rowPosition] = response.body as ComponentEntity;
            this.itemsFiltrados[rowPosition] = response.body as ComponentEntity;

            // Apply the filter to refresh the view
            this.applyFilter();

            toastMessage(
              this.messageService,
              component_list_toasts[response.status]
            );
            this.isLoading = false;
          },
          error: (error) => {
            toastMessage(
              this.messageService,
              component_list_toasts[error.status]
            );
            this.isLoading = false;
          },
        });
      },
      reject: () => {
        console.log('Rejeitado');
      },
    });
  }

  stopCampaign(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja ENCERRAR essa campanha ?',
      accept: () => {
        this.isLoading = true;
        const row = this.itemsFiltrados[rowPosition];
        const componentId = String(row?.id) || '';
        const payload = {
          status: 'FINISHED_MANUAL',
        };
        this.componentService.partial_update(payload, componentId).subscribe({
          next: (response: HttpResponse<ComponentEntity>) => {
            this.entitys = [
              ...this.entitys.slice(0, rowPosition),
              response.body as ComponentEntity,
              ...this.entitys.slice(rowPosition + 1),
            ];
            toastMessage(
              this.messageService,
              component_list_toasts[response.status]
            );
            // Update the campaign status in the list
            this.entitys[rowPosition] = response.body as ComponentEntity;
            this.itemsFiltrados[rowPosition] = response.body as ComponentEntity;

            // Apply the filter to refresh the view
            this.applyFilter();

            // Set isLoading to false after updating the list
            this.isLoading = false;
          },
          error: (error) => {
            toastMessage(
              this.messageService,
              component_list_toasts[error.status]
            );
            this.isLoading = false;
          },
        });
      },
      reject: () => {
        console.log('Rejeitado');
      },
    });
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  // 'name',
  // 'start_date',
  // 'end_date',
  // 'counter_times',
  // 'status'
  applyFilter(): void {
    this.itemsFiltrados = this.entitys.filter(
      (itens) =>
        itens.name?.toLowerCase().includes(this.globalFilter.toLowerCase()) ||
        itens.start_date?.toString().includes(this.globalFilter) ||
        itens.end_date?.toString().includes(this.globalFilter) ||
        itens.counter_times?.toString().includes(this.globalFilter)
    );

    this.itemsFiltrados.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  getStoresString(storeGroups: any): string {
    let stores = '';
    for (const store of storeGroups.stores) {
      if ((stores + store.name).length > 90) break;
      stores += store.name + ', ';
    }
    return stores.slice(0, -2) + '...'; // Remove the last comma and space, and add '...'
  }

  getStatusInviteInfluencers(): void {
    for (const participation of this.influencerParticipations) {
      if (participation && participation.campaign.id) {
        // Convert id to string before using it as an index
        const participationId = String(participation.campaign.id);
        this.influencerInvitesStatus[participationId] = participation.status;
      } else {
        console.warn('Invalid participation structure:', participation);
      }
    }
  }

  getStatus(entityId: string): string {
    const participation = this.influencerParticipations.find(
      (p) =>
        p.campaign &&
        p.campaign.id &&
        p.campaign.id.toString() === entityId &&
        p.status
    );
    return participation?.status || 'PROPOSAL';
  }

  processCampaignConflicts(): void {
    this.campaignsWithConflicts.clear();
    for (const conflict of this.campaignConflicts) {
      if (conflict.existing_campaign) {
        this.campaignsWithConflicts.add(
          conflict.existing_campaign.id.toString()
        );
      }
      if (conflict.new_campaign) {
        this.campaignsWithConflicts.add(conflict.new_campaign.id.toString());
      }
    }
  }

  hasCampaignConflict(campaignId: string): boolean {
    return this.campaignsWithConflicts.has(campaignId);
  }
}
