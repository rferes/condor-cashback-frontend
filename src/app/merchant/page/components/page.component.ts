import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { Campaign } from 'src/app/campaign/entities/campaign.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CampaignService } from 'src/app/campaign/services/campaign.service';
import { ProfileService as MerchantService } from 'src/app/merchant/profile/services/profile.service';
import { ReceiptService } from 'src/app/receipt/services/receipt.service';
import { Receipt_Out } from 'src/app/receipt/entities/receipt.entity';
import { BarcodeFormat } from '@zxing/library';
import { toastMessage } from 'src/app/shared/utils/toast';
import { MessageService } from 'primeng/api';
import { receipt_response } from 'src/app/receipt/utils/receipt-response-msg';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
const component_toasts = receipt_response();

@Component({
  selector: 'app-page',
  templateUrl: '../views/page.component.html',
})
export class PageComponent implements OnInit {
  mediaUrl: string = environment.mediaUrl;
  torchEnabled = false;
  formats = [BarcodeFormat.QR_CODE];

  sponsor: Merchant = {} as Merchant;
  campaigns: Campaign[] = [];
  entityForm: FormGroup;
  sponsor_url: string = '';
  member_link: string = window.location.href;
  results_page: boolean = false;
  receipt_out: Receipt_Out = {} as Receipt_Out;
  receipt_access_key: string = '';
  member_approved: boolean = false;

  member_document: string = '';
  member_pix_type: string = '';
  member_pix_code: string = '';

  consumer_pix_type = [
    { label: 'CPF', value: 'CPF' },
    // { label: 'CNPJ', value: 'CNPJ' },
    { label: 'Celular', value: 'CELLPHONE' },
    { label: 'Email', value: 'EMAIL' },
  ];

  termsDialogVisible: boolean = false;
  termsDialogCheckBoxVisible: boolean = false;
  termsContent: string = '';
  url_not_found: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private campaignService: CampaignService,
    private merchantService: MerchantService,
    private receiptService: ReceiptService,
    private http: HttpClient
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.http
      .get('/assets/terms/merchant_terms.html', { responseType: 'text' })
      .subscribe({
        next: (content) => {
          this.termsContent = content;
        },
        error: (error) => {
          console.error('Error loading terms:', error);
          this.termsContent = 'Error loading terms and conditions.';
        },
      });

    // Get URL parameters using ActivatedRoute
    this.route.queryParams.subscribe((params) => {
      if (params['data']) {
        const decodedParams = this.decodeUrlParams(params['data']);
        this.member_document = decodedParams.member;
        this.member_pix_type = decodedParams.type;
        this.member_pix_code = decodedParams.code;
      }
    });

    this.initializeProfileForm();
    this.route.paramMap.subscribe((params) => {
      this.sponsor_url = params.get('id') || '';
    });
    this.fetchData();
  }

  fetchData() {
    this.merchantService.getByUrl(this.sponsor_url).subscribe({
      next: (response: HttpResponse<Merchant>) => {
        this.sponsor = response.body || ({} as Merchant);
        this.sponsor.image = response.body?.image || '';
        this.entityForm.get('sponsor')?.setValue(this.sponsor.id);
        if (response.status === 204) {
          this.url_not_found = true;
        } else {
          this.url_not_found = false;
        }
        if (
          this.member_document &&
          this.member_pix_type &&
          this.member_pix_code
        ) {
          this.fetchMemberData();
          this.entityForm
            .get('member_document')
            ?.setValue(this.member_document);
          this.entityForm
            .get('member_pix_type')
            ?.setValue(this.member_pix_type);
          this.entityForm
            .get('member_pix_code')
            ?.setValue(this.member_pix_code);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.url_not_found = true;
      },
    });
  }

  fetchMemberData() {
    this.campaignService
      .listMerchantMemberCampaignsActive(this.sponsor.id, this.member_document)
      .subscribe({
        next: (response: HttpResponse<Campaign[]>) => {
          if (response.body && response.body.length > 0) {
            this.url_not_found = false;
            this.campaigns = response.body;
            if (this.campaigns.length > 0) {
              this.member_approved = true;
              this.member_link = window.location.href;
            }
          } else {
            toastMessage(this.messageService, {
              severity: 'error',
              summary: 'Membro sem campanha disponível',
              detail:
                'Não foi encontrado nenhuma campanha ativa para o membro informado',
              life: 3000,
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          this.member_approved = false;
          this.url_not_found = true;
          toastMessage(this.messageService, {
            severity: 'error',
            summary: 'Membro sem campanha disponível',
            detail:
              'Não foi encontrado nenhuma campanha ativa para o membro informado',
            life: 3000,
          });
        },
      });
  }

  private initializeProfileForm() {
    this.entityForm = this.formBuilder.group({
      access_key: new FormControl('', [Validators.required]),
      consumer_document: new FormControl('', Validators.required),
      consumer_pix_type: new FormControl('CPF', Validators.required),
      consumer_pix_code: new FormControl(''),
      member_document: new FormControl(''),
      member_pix_type: new FormControl(''),
      member_pix_code: new FormControl(''),
      dissemination_mode: new FormControl('MEMBER', Validators.required),
      detection_type: new FormControl('TYPED', Validators.required),
      sponsor: new FormControl('', Validators.required),
      accept_terms: new FormControl(false),
    });
  }

  sendReceipt() {
    this.torchEnabled = false;
    if (this.entityForm.get('consumer_pix_type')?.value === 'CPF') {
      this.entityForm
        .get('consumer_pix_code')
        ?.setValue(this.entityForm.get('consumer_document')?.value);
    } else if (
      this.entityForm.get('consumer_pix_type')?.value === 'CELLPHONE'
    ) {
      const phonePattern =
        /^(?:\(?[1-9][0-9]\)? ?)?(?:9?[2-9][0-9]{3}-?[0-9]{4})$/;

      const consumer_pix_Code = this.entityForm.get('consumer_pix_code')?.value;

      if (!phonePattern.test(consumer_pix_Code)) {
        // The phone number is not valid
        toastMessage(this.messageService, component_toasts[402]);
      }
    } else if (this.entityForm.get('consumer_pix_type')?.value === 'EMAIL') {
      const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

      const consumer_pix_Code = this.entityForm.get('consumer_pix_code')?.value;

      if (!emailPattern.test(consumer_pix_Code)) {
        // The email is not valid
        toastMessage(this.messageService, component_toasts[403]);
      }
    }

    this.entityForm
      .get('access_key')
      ?.setValue(this.entityForm.get('access_key')?.value.replace(/\D/g, ''));
    if (this.entityForm.invalid) {
      return;
    }
    this.entityForm.get('sponsor')?.setValue(this.sponsor.id);
    this.receiptService.create(this.entityForm.value).subscribe({
      next: (response: HttpResponse<any>) => {
        toastMessage(this.messageService, component_toasts[response.status]);
        this.results_page = true;
        this.termsDialogCheckBoxVisible = false;
        this.receipt_out = response.body;
        this.receipt_access_key = this.receipt_out.access_key
          .replace(/(\d{4})/g, '$1 ')
          .trim();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          if (
            error.error?.terms_not_accepted ===
            'Consumer needs to accept terms and conditions before submitting receipts'
          ) {
            this.termsDialogCheckBoxVisible = true;
            return;
          } else if (
            error.error?.consumer_document[0] === 'Document must be a valid CPF'
          ) {
            toastMessage(this.messageService, component_toasts[491]);
            return;
          }
        }
        toastMessage(this.messageService, component_toasts[error.status]);
        this.entityForm.patchValue({ access_key: '' });
      },
    });
  }

  handleQrCodeResult(resultString: string) {
    // how to get only the code "https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240407799905000627650040000272181400320319|2|1|1|AA54953C276C19A2828F462F40BF62047DB4F470" => 31240407799905000627650040000272181400320319 for string
    let access_key = resultString.split('|')[0];
    access_key = access_key.split('p=')[1];
    const accessKeyPattern = /^\d{44}$/;

    if (!accessKeyPattern.test(access_key)) {
      //QrCodeMessageErroMsg
      toastMessage(this.messageService, component_toasts[405]);
      this.entityForm.patchValue({ access_key: '' });
      this.entityForm.patchValue({ detection_type: 'QRCODE' });
      this.torchEnabled = false;
      //QrCodeMessage
      return;
    }
    toastMessage(this.messageService, component_toasts[200]);
    this.entityForm.get('access_key')?.setValue(access_key);
    this.torchEnabled = false;
  }

  toggleTorch() {
    this.torchEnabled = !this.torchEnabled;
  }

  updateKeyPixType() {
    this.entityForm.get('code')?.setValue('');
    this.updateKeyPixDocument();
  }

  updateKeyPixDocument() {
    if (
      this.entityForm.value.consumer_pix_type === 'CPF' ||
      this.entityForm.value.consumer_pix_type === 'CNPJ'
    ) {
      this.entityForm
        .get('consumer_pix_code')
        ?.setValue(this.entityForm.value.consumer_document);
      this.entityForm.get('consumer_pix_type')?.setValue('CPF');
      this.entityForm.updateValueAndValidity();
    } else {
      this.entityForm.get('code')?.setValue('');
      this.entityForm.updateValueAndValidity();
    }
  }

  getPixCodeTypeLabel(pixCodeValue: string): string {
    const pixCodeObj = this.consumer_pix_type.find(
      (mode) => mode.value === pixCodeValue
    );
    return pixCodeObj ? pixCodeObj.label : '';
  }

  generateMemberLink() {
    const pix_type = this.entityForm.value.consumer_pix_type;
    const clean_document = this.entityForm.value.consumer_document.replace(
      /\D/g,
      ''
    );
    const pixCode = this.entityForm.value.consumer_pix_code;
    const clean_pix_code =
      pix_type === 'EMAIL' ? pixCode : pixCode.replace(/\D/g, '');

    // Create an object with the parameters
    const params = {
      member: clean_document,
      type: pix_type,
      code: clean_pix_code,
    };

    // Convert to base64
    const encodedParams = btoa(JSON.stringify(params));

    // Generate new URL with encoded parameter
    const baseUrl = window.location.pathname;
    this.router.navigate([baseUrl], {
      queryParams: {
        data: encodedParams,
      },
      replaceUrl: true,
    });

    const fullUrl = `${window.location.origin}${baseUrl}?data=${encodedParams}`;
    window.open(fullUrl, '_blank');
    return fullUrl;
  }

  // Adicione este método para decodificar os parâmetros
  private decodeUrlParams(encodedData: string): {
    member: string;
    type: string;
    code: string;
  } {
    try {
      return JSON.parse(atob(encodedData));
    } catch (e) {
      console.error('Error decoding URL parameters:', e);
      return { member: '', type: '', code: '' };
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toastMessage(this.messageService, {
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Link copiado com sucesso!',
      life: 3000,
    });
  }

  checkMemberDocument() {
    // check if the member document is different from the consumer document
    const consumer_document = this.entityForm.value.consumer_document.replace(
      /[.-]/g,
      ''
    );

    if (this.entityForm.value.member_document === consumer_document) {
      this.entityForm.get('consumer_document')?.setValue('');
      toastMessage(this.messageService, {
        severity: 'error',
        summary: 'Mesmo CPF',
        detail: 'O CPF do consumidor não pode ser igual ao CPF do membro',
        life: 3000,
      });
    }
  }

  ngOnDestroy() {
    this.torchEnabled = false; // Ensure camera is off when component is destroyed
  }

  showTermsDialog(event: Event) {
    event.preventDefault();
    this.termsDialogVisible = true;
  }

  acceptTerms() {
    this.termsDialogVisible = false;
    if (this.entityForm.get('accept_terms')?.value) {
      // Update form control
      this.entityForm.patchValue({ accept_terms: true });
      toastMessage(this.messageService, {
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Termos aceitos com sucesso',
        life: 3000,
      });
    } else {
      toastMessage(this.messageService, {
        severity: 'error',
        summary: 'Erro',
        detail: 'Você precisa aceitar os termos para continuar',
        life: 3000,
      });
    }
  }

  acceptTermsCheckBox() {
    if (this.entityForm.get('accept_terms')?.value) {
      // Update states
      this.entityForm.patchValue({ accept_terms: true });

      // Close both dialogs
      setTimeout(() => {
        this.termsDialogCheckBoxVisible = false;
        this.termsDialogVisible = false;
      }, 200);

      // Show success message
      toastMessage(this.messageService, {
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Termos aceitos com sucesso',
        life: 3000,
      });

      // Continue with receipt submission
      this.sendReceipt();
    } else {
      toastMessage(this.messageService, {
        severity: 'error',
        summary: 'Erro',
        detail: 'Você precisa aceitar os termos para continuar',
        life: 3000,
      });
    }
  }
}
