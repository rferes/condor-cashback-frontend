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
import { ConfirmationService } from 'primeng/api';

import { CampaignService as ComponentService } from '../../services/campaign.service';
import {
  Campaign as ComponentEntity,
  CampaignInfluencer,
  CampaignMerchantStore,
  CampaignConflict,
} from '../../entities/campaign.entity';

import { toastMessage } from 'src/app/shared/utils/toast';
import { campaign_view_messages } from '../utils/campaign-view-response-msg';
import { Store } from 'src/app/merchant/store/entities/store.entity';
import { Product } from 'src/app/merchant/product/entities/product.entity';
import { FileDownloadService } from 'src/app/shared/services/file-downloads.service';
import { environment } from 'src/environments/environment';

const component_toasts = campaign_view_messages();

@Component({
  selector: 'app-campaign-view',
  templateUrl: '../views/campaign-view.component.html',
})
export class CampaignViewComponent implements OnInit {
  baseURL: string = environment.baseUrl;
  baseAPIURL: string = environment.apiUrl;
  endURL: string = 'campaigns/receipt_campaign_csv/';
  mediaUrl: string = environment.mediaUrl;
  user_type: string = 'merchant';
  entity: ComponentEntity = {} as ComponentEntity;
  entityId: string = '';
  entityForm: FormGroup;
  influencerParticipations: CampaignInfluencer[] = [];
  storesSellersParticipations: CampaignMerchantStore[] = [];
  influencerInvite: CampaignInfluencer = {} as CampaignInfluencer;
  campaignConflicts: CampaignConflict[] = [];

  stores: Store[] = [];
  products: Product[] = [];

  typesComission: any[] = [
    { label: 'Porcentagem (%)', value: 'PERC' },
    { label: 'Valor Fixo (R$)', value: 'FIXED' },
  ];

  consumersGroupsAllow: any[] = [
    { label: 'Todos Permitidos', value: false },
    { label: 'Permitir por Grupo', value: true },
  ];

  consumersGroupsBlock: any[] = [
    { label: 'Nenhum Bloqueado', value: false },
    { label: 'Bloquear por Grupo', value: true },
  ];

  campaignMode: any[] = [
    { label: 'Ticket', value: 'TICKET' },
    { label: 'Produto', value: 'PRODUCT' },
  ];

  ruleMode: any[] = [
    { label: 'Valor', value: 'VALUE' },
    { label: 'Quantidade', value: 'QUANTITY' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService,
    private confirmationService: ConfirmationService,
    private fileDownloadService: FileDownloadService
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeEntityForm();
    this.user_type = localStorage.getItem('type') || 'merchant';
    const params = this.route.snapshot.params;
    if (params['id']) {
      this.fetchComponent(params['id']);
      if (this.user_type === 'influencer') {
        this.componentService.influencerInvite(params['id']).subscribe({
          next: (response: HttpResponse<CampaignInfluencer>) => {
            this.influencerInvite = response.body as CampaignInfluencer;
          },
          error: (error: HttpErrorResponse) => {
          },
        });
      } else if (this.user_type === 'merchant') {
        this.componentService.listCampaingConflicts(params['id']).subscribe({
          next: (response: HttpResponse<CampaignConflict[]>) => {
            if (response.body) {
              this.campaignConflicts = Array.isArray(response.body)
                ? response.body
                : [response.body];
            } else {
              this.campaignConflicts = [];
            }
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });
      }
    }
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.products = this.entity.collections
          .map((collection) => collection.products)
          .flat();
        this.stores = this.entity.store_groups
          .map((storeGroup) => storeGroup.stores)
          .flat();
        this.entity.start_date = moment
          .tz(this.entity.start_date, 'America/Sao_Paulo')
          .toDate();
        this.entity.end_date = moment
          .tz(this.entity.end_date, 'America/Sao_Paulo')
          .toDate();
        this.entityForm.patchValue(this.entity);
        this.entityId = this.entity.sponsor.id.toString();
        this.entityForm.patchValue({
          seller: `${this.entity.sponsor.name} (${this.entity.sponsor.document})`,
        });

        const campaign_mode_dict = this.campaignMode.find(
          (item) => item.value === this.entity.campaign_mode
        );
        this.entityForm.patchValue({
          campaign_mode: campaign_mode_dict,
        });
        const campaign_rule_mode_dict = this.ruleMode.find(
          (item) => item.value === this.entity.rule_mode
        );
        this.entityForm.patchValue({
          rule_mode: campaign_rule_mode_dict,
        });
        const influencer_comission_type_dict = this.typesComission.find(
          (item) => item.value === this.entity.influencer_comission_type
        );
        this.entityForm.patchValue({
          influencer_comission_type: influencer_comission_type_dict,
        });
        const consumer_comission_type_dict = this.typesComission.find(
          (item) => item.value === this.entity.consumer_comission_type
        );
        this.entityForm.patchValue({
          consumer_comission_type: consumer_comission_type_dict,
        });

        this.componentService.influencersParticipations(pk).subscribe({
          next: (response: HttpResponse<CampaignInfluencer>) => {
            if (response.body) {
              this.influencerParticipations = Array.isArray(response.body)
                ? response.body
                : [response.body];
            } else {
              this.influencerParticipations = [];
            }
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });

        this.componentService.storesSellersParticipations(pk).subscribe({
          next: (response: HttpResponse<CampaignMerchantStore>) => {
            if (
              response.body &&
              (!Array.isArray(response.body) || response.body.length > 0)
            ) {
              this.storesSellersParticipations = Array.isArray(response.body)
                ? response.body
                : [response.body];
            } else {
              this.stores = [];
            }
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/campaign-list']);
        }, 2000);
      },
    });
  }

  private initializeEntityForm() {
    this.entityForm = this.formBuilder.group({
      id: new FormControl(''),
      status: new FormControl('SKETCH', [Validators.required]),

      // Setp 0
      name: new FormControl('', [Validators.required]),
    });
  }

  getRuleModeLabel(ruleModeValue: string): string {
    const ruleModeObj = this.ruleMode.find(
      (mode) => mode.value === ruleModeValue
    );
    return ruleModeObj ? ruleModeObj.label : '';
  }
  getCampaignModeLabel(campaignModeValue: string): string {
    const campaignModeObj = this.campaignMode.find(
      (mode) => mode.value === campaignModeValue
    );
    return campaignModeObj ? campaignModeObj.label : '';
  }

  getComissionTypeLabel(comissionTypeValue: string): string {
    const comissionTypeObj = this.typesComission.find(
      (type) => type.value === comissionTypeValue
    );
    return comissionTypeObj ? comissionTypeObj.label : '';
  }

  acceptInvite(): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja PARTICIPAR da campanha?',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        const pk = this.entity.id.toString();
        const payload = { status: 'APPROVED' };
        this.componentService.influencerInviteUpdate(payload, pk).subscribe({
          next: (response: HttpResponse<CampaignInfluencer>) => {
            //
            this.influencerInvite = response.body as CampaignInfluencer;
            this.influencerParticipations.map((participation) => {
              if (participation.id === this.influencerInvite.id) {
                participation.status = 'APPROVED';
                this.influencerInvite.status = 'APPROVED';
                if (this.entity.status === 'APPROVED_NO_INFLUENCER') {
                  this.entity.status = 'APPROVED';
                }
              }
            });
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
            setTimeout(() => {
              this.router.navigate(['campaign-list']);
            }, 2000);
          },
          error: (error) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });
      },
      reject: () => {},
    });
  }

  rejectInvite(): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja REJEITAR a campanha?',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        const pk = this.entity.id.toString();
        const payload = { status: 'REPROVED' };
        this.componentService.influencerInviteUpdate(payload, pk).subscribe({
          next: (response: HttpResponse<CampaignInfluencer>) => {
            //
            this.influencerInvite = response.body as CampaignInfluencer;
            this.influencerParticipations.map((participation) => {
              if (participation.id === this.influencerInvite.id) {
                participation.status = 'REPROVED';
              }
            });
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
          },
          error: (error) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });
      },
      reject: () => {},
    });
  }

  downloadCSV() {
    const fileName: string = `RedRed_Notas_Campanha_${this.entity.name}.csv`;
    const formData = new FormData();
    formData.append('campaign_id', this.entity.id.toString());
    const url_csv_campaign_detail = this.baseAPIURL + this.endURL;
    this.fileDownloadService.fileDownload(
      url_csv_campaign_detail,
      fileName,
      formData
    );
  }

  downloadPDF(): void {
  }

  back(): void {
    this.router.navigate(['/campaign-list']);
  }
}
