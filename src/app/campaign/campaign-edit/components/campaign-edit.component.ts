import * as moment from 'moment-timezone';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, firstValueFrom, Observable } from 'rxjs';

// Third-party libraries
import { MessageService } from 'primeng/api';
import { ImageCroppedEvent } from 'ngx-image-cropper';

// Application imports
import { ListResponse } from 'src/app/shared/entities/list-response.entity';

import { CampaignService as ComponentService } from '../../services/campaign.service';
import { Campaign as ComponentEntity } from '../../entities/campaign.entity';

import { MerchantInfluencerFriendshipService } from 'src/app/merchant/influencer/services/influencer.service';
import { MerchantInfluencerFriendship } from 'src/app/shared/entities/merchant-influencer-friendship.entity';

import { Store } from 'src/app/merchant/store/entities/store.entity';

import { StoreGroupService } from 'src/app/merchant/store-group/services/store-group.service';
import { StoreGroup } from 'src/app/merchant/store-group/entities/store-group.entity';

import { Product } from 'src/app/merchant/product/entities/product.entity';
import { CollectionService } from 'src/app/merchant/product-collection/services/collection.service';
import { Collection } from 'src/app/merchant/product-collection/entities/collection.entity';

import { ConsumerGroupService } from 'src/app/merchant/consumer-group/services/consumer-group.service';
import { ConsumerGroup } from 'src/app/merchant/consumer-group/entities/consumer-group.entity';

import { toastMessage } from 'src/app/shared/utils/toast';
import { campaign_edit_view_messages } from '../utils/campaign-edit-response-msg';
import { influencer_response } from 'src/app/influencer/profile/utils/profile-response-msg';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { ProfileService as MerchantService } from 'src/app/merchant/profile/services/profile.service';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';
import { ProfileService as InfluencerService } from 'src/app/influencer/profile/services/profile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/entities/user.entity';

import { LinkedMerchantCreditOptions } from 'src/app/merchant/partnership/services/partnership.service';
import { MerchantPartnershipService } from 'src/app/merchant/partnership/services/partnership.service';

import { environment } from 'src/environments/environment';

import { ProfileService } from 'src/app/influencer/profile/services/profile.service';

const component_toasts = campaign_edit_view_messages();
const influencer_toasts = influencer_response();

interface CampaignLoadResponse {
  storeGroups: HttpResponse<ListResponse<StoreGroup>>;
  collections: HttpResponse<ListResponse<Collection>>;
  consumerGroups: HttpResponse<ListResponse<ConsumerGroup>>;
  merchantProfile?: HttpResponse<Merchant>;
}

// Interfaces para tipar as respostas
interface StoreGroupResponse {
  body: StoreGroup[];
}

interface CollectionResponse {
  body: Collection[];
}

interface ConsumerGroupResponse {
  body: ConsumerGroup[];
}

interface LinkedCredit {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-campaign-edit',
  templateUrl: '../views/campaign-edit.component.html',
})
export class CampaignEditComponent implements OnInit {
  baseUrl = environment.baseUrl;
  mediaUrl = environment.mediaUrl;
  user_type: string = 'merchant';
  entity: ComponentEntity = {} as ComponentEntity;
  campaign_stores: Store[] = [];
  campaign_influencers: StoreGroup[] = [];
  entityId: string = '';
  entityForm: FormGroup;
  user: User = {} as User;
  influencerProfile: Influencer = {} as Influencer;
  activeIndex = 0;

  newObject: boolean = true;

  selectedInfluencer: Influencer = {} as Influencer;
  influencerSuggestions: Influencer[] = [];
  influencerFavorites: Influencer[] = [];
  last_influencer_selected: string = '';
  merchantInfluencerFriendships: MerchantInfluencerFriendship[] = [];
  linkedCreditOptions: LinkedMerchantCreditOptions[] = [];
  linked_credit: LinkedMerchantCreditOptions | null = null;

  sponsor: Merchant = {} as Merchant;
  storeGroupListScroolerItems: any[] = [];
  stores: Store[] = [];
  colectionListScroolerItems: any[] = [];
  products: Product[] = [];
  consumerGroupListScroolerItems: any[] = [];

  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageLoaded: boolean = false;
  fileName: string = '';

  minDateStart = new Date(new Date().setHours(0, 0, 0, 0));
  minDateFinish = new Date(new Date().setHours(0, 0, 0, 0));

  typesComission: any[] = [
    { label: 'Porcentagem (%)', value: 'PERC' },
    { label: 'Valor Fixo (R$)', value: 'FIXED' },
  ];

  bonificationMode: any[] = [
    { label: 'Crédito Livre', value: 'FREE_CREDIT' },
    { label: 'Crédito Vinculado', value: 'LINKED_CREDIT' },
  ];

  disseminationMode: any[] = [
    { label: 'Member', value: 'MEMBER' },
    { label: 'Influencer', value: 'INFLUENCER' },
  ];

  // Add the new property here
  disabledDisseminationMode = this.disseminationMode.map((mode) => ({
    ...mode,
    disabled: true,
  }));

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

  // Add new properties for influencer mode
  isInfluencerMode: boolean = false;

  availableMerchants: Merchant[] = [];
  selectedMerchant: Merchant | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService,
    private merchantPartnershipService: MerchantPartnershipService,
    private storeGroupService: StoreGroupService,
    private collectionService: CollectionService,
    private consumerGroupService: ConsumerGroupService,
    private merchantService: MerchantService,
    private influencerService: InfluencerService,
    private merchantInfluencerFriendshipService: MerchantInfluencerFriendshipService,
    private userService: UserService,
    private profileService: ProfileService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  async ngOnInit() {
    try {
      this.initializeComponent();
      await this.handleRouteParams();
    } catch (error) {
      this.handleError(error);
    }
  }

  private initializeComponent() {
    this.user_type = localStorage.getItem('type') || 'merchant';
    this.isInfluencerMode = this.user_type === 'influencer';
    this.initializeEntityForm();
    this.fetchUser();
  }

  private async handleRouteParams() {
    const params = this.route.snapshot.params;

    if (!params['id']) {
      await this.router.navigate(['/campaign-list']);
      return;
    }

    try {
      if (params['id'] === 'new') {
        await this.handleNewCampaign();
      } else {
        await this.handleExistingCampaign(params['id']);
      }
      if (this.isInfluencerMode) {
        this.entityForm.patchValue({
          dissemination_mode: {
            value: 'INFLUENCER',
          },
        });
      }
    } catch (error) {
      throw error; // Propaga o erro para ser tratado no ngOnInit
    }
  }

  private async handleNewCampaign() {
    this.newObject = true;

    if (this.isInfluencerMode) {
      await Promise.all([
        await this.loadAvailableMerchants(),
        await this.loadInfluencerProfile(),
        await this.loadLinkedCredits(),
        await this.loadMerchantSpecificData(
          this.availableMerchants[0].id.toString()
        ),
      ]);
    } else {
      await Promise.all([
        await this.loadMerchantData('me'),
        await this.loadMerchantInfluencerFriendships(),
        await this.loadLinkedCredits(),
      ]);
    }

    // Após carregar os dados iniciais, configure o modo de bonificação padrão
    this.bonificationTypeChange({
      value: {
        value: 'FREE_CREDIT',
      },
    });
  }

  private async handleExistingCampaign(id: string) {
    if (!id) {
      throw new Error('ID da campanha não fornecido');
    }

    try {
      // 1. Carrega a campanha
      const campaignResponse = await firstValueFrom(
        this.componentService.get(id)
      );

      if (!campaignResponse?.body) {
        throw new Error('Dados da campanha não encontrados');
      }

      this.entity = campaignResponse.body;
      this.newObject = false;

      if (!this.entity?.sponsor?.id) {
        throw new Error('Dados do sponsor não encontrados');
      }

      // 2. Define o sponsor
      this.entityId = this.entity.sponsor.id.toString();
      this.sponsor = this.entity.sponsor;

      // 3. Carrega dados em paralelo, incluindo os linked credits
      await Promise.all([
        this.loadMerchantSpecificData(this.entityId),
        this.loadLinkedCredits(),
        ...(this.isInfluencerMode
          ? [this.loadAvailableMerchants(), this.loadInfluencerProfile()]
          : [this.loadMerchantInfluencerFriendships()]),
      ]);

      // 4. Atualiza o formulário DEPOIS de carregar todos os dados
      this.updateFormWithCampaignData();
    } catch (error) {
      console.error('Erro ao carregar campanha:', error);
      toastMessage(this.messageService, {
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível carregar a campanha',
        life: 3000,
      });

      await this.router.navigate(['/campaign-list']);
      throw error;
    }
  }

  private async loadMerchantSpecificData(merchantId: string): Promise<void> {
    if (!merchantId) {
      throw new Error('ID do merchant não fornecido');
    }

    try {
      // Limpa TODOS os dados anteriores
      this.storeGroupListScroolerItems = [];
      this.colectionListScroolerItems = [];
      this.consumerGroupListScroolerItems = [];
      this.stores = []; // Limpa também a lista de stores
      this.products = []; // Limpa também a lista de products

      // Reseta todos os campos relevantes do formulário
      this.entityForm.patchValue({
        store_groups: [],
        stores: [], // Adiciona reset das stores
        collections: [],
        products: [], // Adiciona reset dos products
        consumer_groups_allow: [],
        consumer_groups_block: [],
        member_groups_allow: [], // Adiciona reset dos member groups
      });

      // Carrega dados do merchant se necessário
      if (this.user_type === 'merchant') {
        const merchantResponse = await firstValueFrom(
          this.merchantService.get(merchantId)
        );

        if (!merchantResponse?.body) {
          throw new Error('Dados do merchant não encontrados');
        }

        this.sponsor = merchantResponse.body;
        this.entityForm.patchValue({
          sponsor: this.sponsor,
          banner: this.entityForm.value?.banner || this.sponsor.image,
        });
        this.linked_credit = this
          .sponsor as unknown as LinkedMerchantCreditOptions;
      }

      // Carrega dados específicos do merchant

      const [storeGroups, collections, consumerGroups] = await Promise.all([
        firstValueFrom(
          this.storeGroupService.listStoreGroupsByMerchant(merchantId)
        ),
        firstValueFrom(
          this.collectionService.listMerchantCollections(merchantId)
        ),
        firstValueFrom(
          this.consumerGroupService.listGroupsConsumersByMerchant(merchantId)
        ),
      ]);

      // Atualiza as listas com verificação de segurança
      this.storeGroupListScroolerItems = storeGroups?.body || [];
      this.colectionListScroolerItems = collections?.body || [];
      this.consumerGroupListScroolerItems = consumerGroups?.body || [];

      // Atualiza o estado disabled do controle consumer_groups_block_mode
      this.updateConsumerGroupsBlockDisabledState();

      // Força a atualização do formulário para refletir as mudanças
      this.entityForm.markAsDirty();
      this.entityForm.updateValueAndValidity();
    } catch (error) {
      console.error('Erro ao carregar dados do merchant:', error);
      throw error;
    }
  }

  private async loadMerchantData(merchantId: string): Promise<void> {
    try {
      const response = await firstValueFrom(this.loadSupportData(merchantId));
      this.updateComponentWithMerchantData(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  private loadSupportData(
    merchantId: string
  ): Observable<CampaignLoadResponse> {
    const requests: Record<string, Observable<any>> = {
      storeGroups: this.storeGroupService.list(),
      collections: this.collectionService.list(),
      consumerGroups: this.consumerGroupService.list(),
    };

    if (this.user_type === 'merchant') {
      requests['merchantProfile'] = this.merchantService.get(merchantId);
    }

    return forkJoin(requests) as Observable<CampaignLoadResponse>;
  }

  private updateComponentWithMerchantData(response: CampaignLoadResponse) {
    if (response.merchantProfile) {
      this.sponsor = response.merchantProfile.body as Merchant;
      this.entityForm.patchValue({
        sponsor: this.sponsor,
        banner: this.entityForm.value?.banner || this.sponsor.image,
      });
      this.linked_credit = this
        .sponsor as unknown as LinkedMerchantCreditOptions;
    }

    this.storeGroupListScroolerItems = response.storeGroups.body?.results || [];
    this.colectionListScroolerItems = response.collections.body?.results || [];
    this.consumerGroupListScroolerItems =
      response.consumerGroups.body?.results || [];
  }

  private async loadInfluencerProfile(): Promise<void> {
    try {
      const response = await firstValueFrom(this.profileService.get('me'));
      this.influencerProfile = response.body as Influencer;
      this.entityForm.patchValue({
        banner: this.influencerProfile.image,
        influencers: [this.influencerProfile],
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  private async loadMerchantInfluencerFriendships(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.merchantInfluencerFriendshipService.list()
      );
      this.merchantInfluencerFriendships = Array.isArray(response.body)
        ? response.body
        : response.body
        ? [response.body]
        : [];
      this.influencerFavorites = this.merchantInfluencerFriendships.map(
        (item) => item.influencer
      );
      this.influencerSuggestions = this.influencerFavorites;
    } catch (error) {
      this.handleError(error);
    }
  }

  private async loadLinkedCredits(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.merchantPartnershipService.list_linked_merchant_credits()
      );
      this.linkedCreditOptions = response.body || [];
    } catch (error) {
      console.error('Error loading linked credits:', error);
      this.linkedCreditOptions = [];
    }
  }

  private handleError(error: any) {
    console.error('Erro na aplicação:', error);

    let message = 'Ocorreu um erro inesperado';

    if (error instanceof HttpErrorResponse) {
      message = component_toasts[error.status]?.detail || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    toastMessage(this.messageService, {
      severity: 'error',
      summary: 'Erro',
      detail: message,
      life: 3000,
    });
  }

  private initializeEntityForm() {
    interface BaseControls {
      id: FormControl;
      status: FormControl;
      name: FormControl;
      description: FormControl;
      start_date: FormControl;
      end_date: FormControl;
      banner: FormControl;
      sponsor: FormControl;
      store_groups: FormControl;
      stores: FormControl;
      dissemination_mode: FormControl;
      influencers_search: FormControl;
      influencers: FormControl;
      influencer_selected: FormControl;
      member_groups_allow: FormControl;
      member_groups_allow_mode: FormControl;
      consumer_groups_allow: FormControl;
      consumer_groups_allow_mode: FormControl;
      consumer_groups_block: FormControl;
      consumer_groups_block_mode: FormControl;
      campaign_mode: FormControl;
      collections: FormControl;
      products: FormControl;
      rule_mode: FormControl;
      purchase_min_amount: FormControl;
      purchase_max_amount: FormControl;
      participations_maximum_permitted: FormControl;
      maximum_cost_campaign: FormControl;
      influencer_comission_type: FormControl;
      influencer_comission: FormControl;
      consumer_comission_type: FormControl;
      consumer_comission: FormControl;
      credit_provisioning_time: FormControl;
      bonification_type: FormControl;
      linked_credit: FormControl;
      selected_merchant?: FormControl; // Optional property for influencer mode
      creator: FormControl<string | null>;
    }

    const baseControls: BaseControls = {
      creator: new FormControl<string | null>(null),
      id: new FormControl(''),
      status: new FormControl('SKETCH', [Validators.required]),

      // Setp 0
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      banner: new FormControl('', [Validators.required]),

      // Setp 1
      sponsor: new FormControl(null, [Validators.required]),
      store_groups: new FormControl([], [Validators.required]),
      stores: new FormControl([], [Validators.required]),

      // Step 2
      dissemination_mode: new FormControl(
        { label: 'Influencer', value: 'INFLUENCER' },
        [Validators.required]
      ),
      influencers_search: new FormControl([]),
      influencers: new FormControl([]),
      influencer_selected: new FormControl(''),

      member_groups_allow: new FormControl([]),
      member_groups_allow_mode: new FormControl(
        { label: 'Todos Permitidos', value: false },
        [Validators.required]
      ),
      // Step 3
      consumer_groups_allow: new FormControl([]),
      consumer_groups_allow_mode: new FormControl(
        { label: 'Todos Permitidos', value: false },
        [Validators.required]
      ),
      consumer_groups_block: new FormControl([]),
      consumer_groups_block_mode: new FormControl(
        { value: { label: 'Nenhum Bloqueado', value: false }, disabled: false },
        [Validators.required]
      ),

      // Step 4
      campaign_mode: new FormControl({ label: 'Ticket', value: 'TICKET' }, [
        Validators.required,
      ]),
      collections: new FormControl([]),
      products: new FormControl([]),
      rule_mode: new FormControl({ label: 'Valor', value: 'VALUE' }, [
        Validators.required,
      ]),
      purchase_min_amount: new FormControl(0.01, [Validators.required]),
      purchase_max_amount: new FormControl(1000, [Validators.required]),
      participations_maximum_permitted: new FormControl(1, [
        Validators.required,
      ]),
      maximum_cost_campaign: new FormControl(100000, [Validators.required]),
      // Step 5
      influencer_comission_type: new FormControl(
        { label: 'Porcentagem (%)', value: 'PERC' },
        [Validators.required]
      ),
      influencer_comission: new FormControl(5, [Validators.required]),
      consumer_comission_type: new FormControl(
        { label: 'Porcentagem (%)', value: 'PERC' },
        [Validators.required]
      ),
      consumer_comission: new FormControl(10, [Validators.required]),
      credit_provisioning_time: new FormControl(0, [Validators.required]),
      bonification_type: new FormControl(
        { label: 'Crédito Livre', value: 'FREE_CREDIT' },
        [Validators.required]
      ),
      linked_credit: new FormControl(
        { value: null, disabled: true },
        []
      ),
    };

    if (this.isInfluencerMode) {
      baseControls.selected_merchant = new FormControl('', [
        Validators.required,
      ]);
    }

    this.entityForm = this.formBuilder.group(baseControls);
  }

  // New method to load available merchants for influencer
  async loadAvailableMerchants(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.profileService.merchant_partnership_list()
      );
      this.availableMerchants = response.body ?? [];

      if (this.availableMerchants.length > 0) {
        const defaultMerchant = this.availableMerchants[0];
        this.sponsor = defaultMerchant;
        this.selectedMerchant = defaultMerchant;

        this.entityForm.patchValue({
          sponsor: defaultMerchant,
          selected_merchant: defaultMerchant.id.toString(),
        });
      } else {
        toastMessage(this.messageService, {
          severity: 'warn',
          summary: 'Aviso',
          detail: 'Nenhum patrocinador disponível',
          life: 3000,
        });
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        toastMessage(this.messageService, component_toasts[error.status]);
      }
    }
  }

  // New method to handle merchant selection in influencer mode
  onMerchantSelect(event: any) {
    const selectedMerchant = this.availableMerchants.find(
      (m) => m.id.toString() === event.value.id.toString()
    );

    if (selectedMerchant) {
      this.selectedMerchant = selectedMerchant;
      this.sponsor = selectedMerchant;

      // Update form values
      this.entityForm.patchValue({
        sponsor: selectedMerchant,
        selected_merchant: selectedMerchant.id.toString(),
      });

      // Load merchant-specific data
      this.loadMerchantSpecificData(selectedMerchant.id.toString());
      this.loadLinkedCredits();
    }
  }

  fetchUser() {
    this.userService.get().subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  // Fetch Component
  async fetchComponent(pk: string): Promise<void> {
    try {
      const response = await firstValueFrom(this.componentService.get(pk));
      this.entity = response.body as ComponentEntity;
      this.newObject = false;
      this.entityId = this.entity.sponsor.id.toString();
      this.sponsor = this.entity.sponsor;

      await this.fetchDataSuportMerchant(this.entityId);
      this.updateFormWithCampaignData();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/campaign-list']);
        }, 2000);
      }
    }
  }

  // Nova função para atualizar o formulário
  private updateFormWithCampaignData() {
    if (!this.entity) return;

    // Find the matching dissemination mode from the options array
    const selectedDisseminationMode =
      this.disseminationMode.find(
        (mode) => mode.value === this.entity.dissemination_mode
      ) || this.disseminationMode[0];

    // Formatação das datas
    const formattedStartDate = this.entity.start_date
      ? moment.tz(this.entity.start_date, 'America/Sao_Paulo').toDate()
      : null;

    const formattedEndDate = this.entity.end_date
      ? moment.tz(this.entity.end_date, 'America/Sao_Paulo').toDate()
      : null;

    if (this.entity.linked_credit) {
      this.entityForm.patchValue({
        bonification_type: {
          label: 'Crédito Vinculado',
          value: 'LINKED_CREDIT',
        },
        linked_credit:
          this.linkedCreditOptions.find(
            (credit) =>
              credit.id.toString() === this.entity.linked_credit.toString()
          ) || null,
      });
    }
    // Prepara os valores do formulário
    const formValues = {
      ...this.entity,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      sponsor: this.sponsor,

      // Atualiza o tipo de bonificação e linked_credit
      bonification_type: this.entity.linked_credit
        ? { label: 'Crédito Vinculado', value: 'LINKED_CREDIT' }
        : { label: 'Crédito Livre', value: 'FREE_CREDIT' },

      // Encontra o linked_credit correto nas opções disponíveis
      linked_credit: this.entity.linked_credit
        ? this.linkedCreditOptions.find(
            (credit) =>
              credit.id.toString() === this.entity.linked_credit.id.toString()
          )
        : null,

      // Use the found dissemination mode object
      dissemination_mode: selectedDisseminationMode,

      // Encontra os valores corretos nos arrays de opções
      campaign_mode:
        this.campaignMode.find(
          (item) => item.value === this.entity.campaign_mode
        ) || this.campaignMode[0],

      rule_mode:
        this.ruleMode.find((item) => item.value === this.entity.rule_mode) ||
        this.ruleMode[0],

      influencer_comission_type:
        this.typesComission.find(
          (item) => item.value === this.entity.influencer_comission_type
        ) || this.typesComission[0],

      consumer_comission_type:
        this.typesComission.find(
          (item) => item.value === this.entity.consumer_comission_type
        ) || this.typesComission[0],

      // Garante que arrays estejam inicializados
      store_groups: this.entity.store_groups || [],
      collections: this.entity.collections || [],
      consumer_groups_allow: this.entity.consumer_groups_allow || [],
      consumer_groups_block: this.entity.consumer_groups_block || [],
    };

    // Atualiza o formulário
    this.entityForm.patchValue(formValues);

    // Atualiza as listas relacionadas
    if (formValues.store_groups.length > 0) {
      this.storeGroupChange({ value: formValues.store_groups });
    }

    if (formValues.collections.length > 0) {
      this.productCollectionChange({ value: formValues.collections });
    }

    // Após atualizar o formulário, chame bonificationTypeChange
    if (this.entity.linked_credit) {
      this.bonificationTypeChange({
        value: {
          value: 'LINKED_CREDIT',
        },
      });
    } else {
      this.bonificationTypeChange({
        value: {
          value: 'FREE_CREDIT',
        },
      });
    }
  }

  // Modifica a função fetchDataSuportMerchant para retornar uma Promise
  fetchDataSuportMerchant(pk: string): Promise<void> {
    return new Promise((resolve) => {
      forkJoin({
        storeGroups: this.storeGroupService.list(),
        collections: this.collectionService.list(),
        consumerGroups: this.consumerGroupService.list(),
        ...(this.user_type === 'merchant'
          ? { merchant: this.merchantService.get(pk) }
          : {}),
      }).subscribe({
        next: (responses) => {
          if (responses['merchant']?.body) {
            this.sponsor = responses['merchant'].body as Merchant;
            this.entityForm.patchValue({
              sponsor: this.sponsor,
              banner: this.entityForm.value?.banner || this.sponsor.image,
            });
          }
          this.storeGroupListScroolerItems =
            responses['storeGroups'].body?.results || [];
          this.colectionListScroolerItems =
            responses['collections'].body?.results || [];
          this.consumerGroupListScroolerItems =
            responses['consumerGroups'].body?.results || [];
          resolve();
        },
        error: (error) => {
          toastMessage(this.messageService, component_toasts[error.status]);
          resolve();
        },
      });
    });
  }

  getMerchantInfluencerFriendship() {
    this.merchantInfluencerFriendshipService.list().subscribe({
      next: (response: HttpResponse<MerchantInfluencerFriendship>) => {
        this.merchantInfluencerFriendships = Array.isArray(response.body)
          ? response.body
          : response.body
          ? [response.body]
          : [];
        this.influencerFavorites = this.merchantInfluencerFriendships.map(
          (item) => item.influencer
        );
        this.influencerSuggestions = this.influencerFavorites;
      },
      error: (error: HttpErrorResponse) => {
      },
    });
  }

  showFavoriteInfluencers() {
    this.getMerchantInfluencerFriendship();
    return this.influencerFavorites;
  }

  fetchDataSuportInfluencer(): void {
    this.profileService.get('me').subscribe({
      next: (response: HttpResponse<Influencer>) => {
        this.influencerProfile = response.body as Influencer;
        this.entityForm.patchValue({
          banner: this.influencerProfile.image,
        });
        this.entityForm.patchValue({
          influencers: [this.influencerProfile],
        });
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  save(proposal: boolean = false) {
    if (
      this.entityForm.controls['name'].invalid ||
      this.entityForm.controls['start_date'].invalid ||
      this.entityForm.controls['end_date'].invalid ||
      this.entityForm.controls['description'].invalid
    ) {
      toastMessage(this.messageService, component_toasts[400]);
      return;
    }

    const payload = this.preparetePayload(this.entityForm.value, proposal);

    if (this.entityForm.get('id')?.value === '') {
      this.createComponentEntity(payload);
    } else {
      this.updateComponentEntity(payload);
    }

    if (proposal) {
      setTimeout(() => {
        this.router.navigate(['/campaign-list']);
      }, 2000);
    }
  }

  cancel() {
    this.router.navigate(['/campaign-list']);
  }

  createComponentEntity(payload: any) {
    this.componentService.create(payload).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        toastMessage(this.messageService, component_toasts[response.status]);
        setTimeout(() => {
          this.router.navigate(['/campaign-list']);
        }, 2000);
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  updateComponentEntity(payload: any) {
    const pk = this.entity.id.toString();
    // Set appropriate status based on user type
    if (this.isInfluencerMode) {
      payload.status = 'PROPOSAL';
    }
    this.componentService.partial_update(payload, pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.entityForm.patchValue(response);
        this.entityForm.markAsPristine();
        toastMessage(this.messageService, component_toasts[response.status]);
        setTimeout(() => {
          this.router.navigate(['/campaign-list']);
        }, 2000);
      },
      error: (error) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  preparetePayload(payload: any, proposal: boolean) {
    payload.start_date = this.convertDateToBack(payload.start_date);
    payload.end_date = this.convertDateToBack(payload.end_date);
    payload.sponsor = this.sponsor.id;
    payload.store_groups = payload.store_groups.map(
      (storeGroup: StoreGroup) => storeGroup.id
    );
    payload.stores = payload.stores.map((store: Store) => store.id);
    payload.collections = payload.collections.map(
      (collection: Collection) => collection.id
    );
    payload.products = payload.products.map((product: Product) => product.id);
    if (payload.dissemination_mode.value === 'INFLUENCER') {
      payload.influencers = payload.influencers.map(
        (influencer: Influencer) => influencer.id
      );
    } else {
      payload.influencers = [];
    }

    if (payload.dissemination_mode.value === 'MEMBER') {
      payload.member_groups_allow = payload.member_groups_allow.map(
        (consumerGroup: ConsumerGroup) => consumerGroup.id
      );
    } else {
      payload.member_groups_allow = [];
    }

    payload.consumer_groups_allow = payload.consumer_groups_allow.map(
      (consumerGroup: ConsumerGroup) => consumerGroup.id
    );
    payload.consumer_groups_block = payload.consumer_groups_block.map(
      (consumerGroup: ConsumerGroup) => consumerGroup.id
    );

    payload.dissemination_mode = payload.dissemination_mode.value;
    payload.campaign_mode = payload.campaign_mode.value;
    payload.rule_mode = payload.rule_mode.value;
    payload.consumer_groups_allow_mode =
      payload.consumer_groups_allow_mode.value;
    payload.consumer_groups_block_mode =
      payload.consumer_groups_block_mode.value;
    payload.influencer_comission_type = payload.influencer_comission_type.value;
    payload.consumer_comission_type = payload.consumer_comission_type.value;
    if (!proposal) {
      payload.status = 'SKETCH';
    } else {
      if (this.isInfluencerMode) {
        payload.status = 'PROPOSAL';
      } else {
        payload.status = 'APPROVED';
      }
    }

    // Extrair o ID do linked_credit se for um objeto, ou manter null
    if (payload.bonification_type.value === 'LINKED_CREDIT') {
      if (payload.linked_credit && typeof payload.linked_credit === 'object') {
        payload.linked_credit = payload.linked_credit.id;
      }
    } else {
      // Se for FREE_CREDIT, seta como null
      payload.linked_credit = null;
    }

    delete payload.member_groups_allow_mode;
    delete payload.id;
    delete payload.influencers_search;
    delete payload.influencer_selected;
    delete payload.bonification_type;

    if (this.croppedImage) {
      payload.banner = this.croppedImage;
    } else {
      delete payload.banner;
    }
    return payload;
  }
  // Campaing Settings Functions
  campaignModeChange(event: any) {
    if (event.value === 'TICKET') {
      this.entityForm.patchValue({ product_eans: [] });
    } else {
      this.entityForm.patchValue({
        rule_mode: { label: 'Valor', value: 'VALUE' },
      });
    }
  }

  // Influencer Functions
  searchInfluencer(event: any) {
    const influencerSelected = event.query;
    const lastInfluencerSelected = this.last_influencer_selected;

    if (influencerSelected != null && lastInfluencerSelected != null) {
      const influencerSelectedLowercase = influencerSelected.toLowerCase();
      const lastInfluencerSelectedLowercase =
        lastInfluencerSelected.toLowerCase();

      // Check if the input has changed and is at least 3 characters long
      if (
        influencerSelected.length >= 3 &&
        influencerSelectedLowercase !== lastInfluencerSelectedLowercase
      ) {
        const params = {
          name_or_document: influencerSelected,
        };

        this.influencerService.list(params).subscribe({
          next: (response: HttpResponse<ListResponse<Influencer>>) => {
            // Uncomment or modify the toast message as needed
            // toastMessage(this.messageService, store_list_toasts[response.status]);
            this.influencerSuggestions = response.body?.results || [];
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });
      } else if (influencerSelected.length < 3) {
        // Optionally clear suggestions or handle shorter inputs differently
        if (this.user_type === 'merchant') {
          this.getMerchantInfluencerFriendship();
        }
      }

      // Update the last influencer selected for future comparisons
    } else if (this.user_type === 'merchant') {
      this.getMerchantInfluencerFriendship();
    }
  }

  onSelectInfluencer(event: any) {
    let influencersList = this.entityForm.get('influencers')?.value;
    // if (!Array.isArray(influencersList)) {
    //   influencersList = [];
    // }
    if (
      !influencersList.some(
        (influencer: Influencer) => influencer.id === event.value.id
      )
    ) {
      this.entityForm.patchValue({
        influencers: [...influencersList, event.value],
      });
    } else {
      toastMessage(this.messageService, influencer_toasts[409]);
    }
  }

  removeInfluencer(influencer: Influencer) {
    let influencers = this.entityForm.get('influencers')?.value;
    influencers = influencers.filter(
      (item: Influencer) => item.id !== influencer.id
    );
    this.entityForm.patchValue({ influencers });
  }

  // Consumer Groups Functions
  consumerGroupsAllowChange(event: any) {
    if (!event.value.value) {
      this.entityForm.patchValue({ consumer_groups_allow: [] });
    }
  }
  consumerGroupsBlockChange(event: any) {
    if (!event.value.value) {
      this.entityForm.patchValue({ consumer_groups_block: [] });
    }
    this.updateConsumerGroupsBlockDisabledState();
  }

  private updateConsumerGroupsBlockDisabledState(): void {
    const control = this.entityForm.get('consumer_groups_block_mode');
    if (control) {
      if (this.consumerGroupListScroolerItems.length === 0) {
        control.disable({ emitEvent: false });
      } else {
        control.enable({ emitEvent: false });
      }
    }
  }

  // Date Functions
  start_date_change(): void {
    this.dataFinishMinSet();
    this.entityForm.patchValue({
      start_date: this.entityForm.value.start_date,
    });
    if (this.entityForm.value.end_date < this.entityForm.value.start_date) {
      this.entityForm.patchValue({
        end_date: null,
      });
    }
  }

  end_date_change(): void {
    this.entityForm.patchValue({
      end_date: this.entityForm.value.end_date,
    });
    if (
      this.entityForm.value.end_date !== null &&
      this.entityForm.value.end_date < this.entityForm.value.start_date
    ) {
      this.entityForm.patchValue({
        start_date: null,
      });
    }
  }

  convertDateToBack(date: Date): string {
    return moment(date).tz('America/Sao_Paulo').utc().format('YYYY-MM-DD');
  }

  dataFinishMinSet(): void {
    this.minDateFinish = moment(this.entityForm.value.start_date).toDate();
    this.minDateFinish.setDate(this.minDateFinish.getDate() + 1);
  }

  // Image Functions
  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files as FileList;
    if (files.length > 0) {
      this.imageChangedEvent = event;
      this.imageLoaded = true;
      const fullName = files[0].name;
      if (fullName.length > 28) {
        this.fileName = fullName.slice(0, 15) + '...' + fullName.slice(-10);
      } else {
        this.fileName = fullName;
      }
    }
  }

  onImageCropped(event: ImageCroppedEvent) {
    if (event && event.objectUrl) {
      fetch(event.objectUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
            this.entityForm.get('banner')?.setValue(this.croppedImage);
            this.entityForm.markAsDirty();
          };
          reader.readAsDataURL(blob);
        });
    }
  }

  cancelImage() {
    this.imageLoaded = false;
    this.fileName = '';
    this.croppedImage = '';
  }

  // Store Functions
  storeGroupChange(event: any) {
    const storesGroups = event.value as StoreGroup[];
    this.stores = [];
    storesGroups.forEach((storeGroup) => {
      storeGroup.stores.forEach((store) => {
        this.stores.push(store);
      });
    });
    this.stores = Array.from(
      new Set(this.stores.map((store) => JSON.stringify(store)))
    ).map((store) => JSON.parse(store));
    this.entityForm.patchValue({ stores: this.stores });
  }

  // Products Functions
  productCollectionChange(event: any) {
    const collections = event.value as Collection[];
    this.products = [];
    collections.forEach((collection) => {
      collection.products.forEach((product) => {
        this.products.push(product);
      });
    });
    this.products = Array.from(
      new Set(this.products.map((product) => JSON.stringify(product)))
    ).map((product) => JSON.parse(product));
    this.entityForm.patchValue({ products: this.products });
  }

  bonificationTypeChange(event: any) {
    const isCreditLinked = event?.value?.value === 'LINKED_CREDIT';
    const linkedCreditControl = this.entityForm.get('linked_credit');

    // CORRIGIDO: Não sete linked_credit: null logo de cara!
    // Começa vazio e só seta null quando apropriado
    const formUpdate: any = {};

    // Adiciona ou remove a validação required baseado no tipo de bonificação
    if (isCreditLinked) {
      linkedCreditControl?.setValidators([Validators.required]);
      linkedCreditControl?.enable();

      // Configura o valor inicial se necessário
      if (this.linkedCreditOptions.length > 0) {
        formUpdate.linked_credit = this.linkedCreditOptions[0].id;
      } else {
        // Somente seta null se não houver opção disponível
        formUpdate.linked_credit = null;
      }
    } else {
      linkedCreditControl?.clearValidators();
      linkedCreditControl?.disable();
      formUpdate.linked_credit = null;
    }

    linkedCreditControl?.updateValueAndValidity();

    // Update form
    this.entityForm.patchValue(formUpdate);
    this.changeDetectorRef.detectChanges();
    this.entityForm.markAsDirty();
  }

  bonificationTypeChangeInfluencer(event: any) {
  }

  // Panel Functions
  panelChange() {}

  nextActiveIndex(): void {
    this.activeIndex++;
  }

  previousActiveIndex(): void {
    this.activeIndex--;
  }

  getFormControls() {
    return Object.keys(this.entityForm.controls);
  }
}
