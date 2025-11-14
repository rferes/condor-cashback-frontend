import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';
import { Campaign } from 'src/app/campaign/entities/campaign.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CampaignService } from 'src/app/campaign/services/campaign.service';
import { ProfileService as InfluencerService } from 'src/app/influencer/profile/services/profile.service';
import { ReceiptService } from 'src/app/receipt/services/receipt.service';
import { Receipt_Out } from 'src/app/receipt/entities/receipt.entity';
import { BarcodeFormat } from '@zxing/library';
import { toastMessage } from 'src/app/shared/utils/toast';
import { MessageService } from 'primeng/api';
import { receipt_response } from 'src/app/receipt/utils/receipt-response-msg';

const component_toasts = receipt_response();

const receiptStatusMap = {
  NEW: 'Nova',
  CHECKING: 'Checando',
  NOT_FOUND: 'Não Encontrado',
  REJECTED_DONT_HAVE_CAMPAIGN: 'Rejeitado - Não tem campanha',
  REJECTED_DONT_HAVE_PRODUCT_CAMPAIGN:
    'Rejeitado - Não tem produto na campanha',
  REJECTED_EMISSION_DATE_NOT_ALLOWED:
    'Rejeitado - Data de emissão não permitida',
  REJECTED_STORE_NOT_FOUND: 'Rejeitado - Loja não encontrada',
  REJECTED_CONSUMER_BLOCK: 'Rejeitado - Consumidor Bloqueado',
  REJECTED_CONSUMER_NOT_ALLOW: 'Rejeitado - Consumidor não permitido',
  REPROVED_LIMIT_PARTICIPATIONS_EXCEEDED: 'Reprovado - Limite de participação',
  REPROVED_MINIMUM_VALUE: 'Reprovado - Valor mínimo',
  REPROVED_MINIMUM_QUANTITY: 'Reprovado - Quantidade mínimo',
  REPROVED_BY_SELLER: 'Reprovado - Reprovado pelo Lojista',
  APPROVED: 'Aprovado',
  PENDINGPAYMENT: 'Aguardando Pagamento',
  PAID: 'Pago',
  PAYMENT_FAILED: 'Pagamento Falhou',
};

@Component({
  selector: 'app-receipt-search',
  templateUrl: '../views/receipt-search.component.html',
})
export class ReceiptSearchComponent implements OnInit {
  torchEnabled = false;
  formats = [BarcodeFormat.QR_CODE];

  influencer: Influencer = {} as Influencer;
  campaigns: Campaign[] = [];
  entityForm: FormGroup;
  influencer_url: string = '';
  results_page: boolean = false;
  receipt_access_key: string = '';
  receipt_out: Receipt_Out = {} as Receipt_Out;

  consumer_pix_type = [
    { label: 'CPF', value: 'CPF' },
    // { label: 'CNPJ', value: 'CNPJ' },
    { label: 'Celular', value: 'CELLPHONE' },
    { label: 'Email', value: 'EMAIL' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private campaignService: CampaignService,
    private influencerService: InfluencerService,
    private receiptService: ReceiptService
  ) {
    this.entityForm = this.formBuilder.group({});
  }

  getReceiptStatus(status: string): string {
    return (
      receiptStatusMap[status as keyof typeof receiptStatusMap] ||
      'Unknown Status'
    );
  }

  ngOnInit() {
    this.initializeProfileForm();
  }

  private initializeProfileForm() {
    this.entityForm = this.formBuilder.group({
      access_key: new FormControl(
        '31240407799905000627650030000188301950227801',
        [
          Validators.required, // replace 10 with the maximum number of characters
        ]
      ),
      detection_type: new FormControl('TYPED', Validators.required),
    });
  }

  searchReceipt() {
    this.torchEnabled = false;
    this.entityForm
      .get('access_key')
      ?.setValue(this.entityForm.get('access_key')?.value.replace(/\D/g, ''));
    if (this.entityForm.invalid) {
      return;
    }
    this.receiptService.search(this.entityForm.value.access_key).subscribe({
      next: (response: HttpResponse<any>) => {
        toastMessage(this.messageService, component_toasts[response.status]);
        this.results_page = true;
        this.receipt_out = response.body;
        this.receipt_access_key = this.entityForm
          .get('access_key')
          ?.value.replace(/(\d{4})/g, '$1 ')
          .trim();
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[490]);
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
      this.entityForm.get('code')?.setValue(this.entityForm.value.document);
    } else {
      this.entityForm.get('code')?.setValue('');
    }
  }

  getPixCodeTypeLabel(pixCodeValue: string): string {
    const pixCodeObj = this.consumer_pix_type.find(
      (mode) => mode.value === pixCodeValue
    );
    return pixCodeObj ? pixCodeObj.label : '';
  }

  ngOnDestroy() {
    this.torchEnabled = false; // Ensure camera is off when component is destroyed
  }
}
