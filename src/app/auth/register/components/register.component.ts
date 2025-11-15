// Angular imports
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

// Third-party library imports
import { MessageService } from 'primeng/api';

// Application imports
// Services
import { UserService } from '../../../shared/services/user.service';
import { SMSService } from '../../../shared/services/sms.service';

// Utils
import { passwordValidator } from 'src/app/shared/utils/passwordValidator';
import { toastMessage } from 'src/app/shared/utils/toast';

// Messages
import { register_messages } from '../utils/register-response-msg';
import { sms_messages } from '../../../shared/utils/sms-response-msg';

// Entities
import { UserCreateResponse } from '../../../shared/entities/user.entity';
import { SendSMSCodeVerifyResponse } from '../../../shared/entities/sms.entity';
import { SMSCodeCheckVerifyResponse } from '../../../shared/entities/sms.entity';
import { TermsAcceptanceService } from '../../../shared/services/terms-acceptance.service';
import { TermsAcceptance } from '../../../shared/entities/terms-acceptance.entity';

const register_toasts = register_messages();
const sms_toasts = sms_messages();

@Component({
  selector: 'app-register',
  templateUrl: '../views/register.component.html',
})
export class RegisterComponent {
  private static readonly SMS_RESEND_TIME_MIN = 3; // 3 minutes
  private intervalId = 0;
  step = 1;
  account_type: string = 'merchant';
  invited_by: string = '';

  // step1
  checkDocument: boolean | null = null;
  stateOptions: { label: string; value: string }[] = [
    { label: 'Merchant', value: 'merchant' },
    { label: 'Influencer', value: 'influencer' },
    { label: 'Consumidor', value: 'consumer' },
    { label: 'Gerente', value: 'manager' },
  ];

  // step2
  countdown: string = '03:00';
  isCodeError: boolean = false;
  registerForm: FormGroup;
  isLinkDisabled: boolean = true;

  constructor(
    private userService: UserService,
    private smsService: SMSService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.account_type = params.get('type_account') || 'merchant';
      this.invited_by = params.get('invited_by') || '';
      this.initializeRegisterForm();
      this.registerForm
        .get('step1')
        ?.get('account_type')
        ?.setValue(this.account_type);
      this.registerForm
        .get('step1')
        ?.get('invited_by')
        ?.setValue(this.invited_by);
    });
    this.onCheckDocument();
  }

  submit() {
    if (this.step === 1) {
      this.submitStep1();
    } else if (this.step === 2) {
      this.submitStep2();
    }
  }

  back() {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  resendSMS(): void {
    const payload = {
      cellphone: this.registerForm
        .get('step1')
        ?.value.cellphone.replace(/[\s()-]/g, ''),
      document: this.registerForm
        .get('step1')
        ?.value.document.replace(/[-/.]/g, ''),
    };
    this.smsService.sendSMSVerify(payload).subscribe({
      next: (response: HttpResponse<SendSMSCodeVerifyResponse>) => {
        this.startCountdown(RegisterComponent.SMS_RESEND_TIME_MIN * 60);
        this.isLinkDisabled = true;
        toastMessage(this.messageService, sms_toasts[response.status]);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, sms_toasts[error.status]);
      },
    });
  }

  onChangeTypeAccount() {
    this.registerForm.get('step1')?.patchValue({
      document: '',
    });
    this.checkDocument = null;
    if (this.registerForm.get('step1')?.value.account_type === null) {
      this.registerForm
        .get('step1')
        ?.get('account_type')
        ?.setValue('account_type');
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initializeRegisterForm() {
    this.registerForm = this.formBuilder.group({
      step1: this.formBuilder.group({
        account_type: new FormControl('', []),
        document: new FormControl('', [Validators.required]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ]),
        cellphone: new FormControl('', [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(15),
        ]),
        password: new FormControl('', [Validators.required, passwordValidator]),
        invited_by: new FormControl('', []),
      }),
      termsStep: this.formBuilder.group({
        acceptTerms: [false, Validators.requiredTrue],
      }),
      step2: this.formBuilder.group({
        code: new FormControl('', [Validators.required]),
      }),
    });
  }

  private submitStep1() {
    const step1Form = this.registerForm.get('step1');
    const isStep1Invalid = step1Form?.invalid;
    const isCheckDocumentFalse = this.checkDocument === false;

    if (isStep1Invalid || isCheckDocumentFalse) {
      step1Form?.markAllAsTouched();
      toastMessage(this.messageService, register_toasts[400]);
      return;
    }
    const payload = {
      cellphone: this.registerForm
        .get('step1')
        ?.value.cellphone.replace(/[\s()-]/g, ''),
      document: this.registerForm
        .get('step1')
        ?.value.document.replace(/[-/.]/g, ''),
    };

    this.smsService.sendSMSVerify(payload).subscribe({
      next: (response: HttpResponse<SendSMSCodeVerifyResponse>) => {
        this.startCountdown(RegisterComponent.SMS_RESEND_TIME_MIN * 60);
        this.isLinkDisabled = true;
        toastMessage(this.messageService, sms_toasts[response.status]);
        this.step = 2;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, sms_toasts[error.status]);
      },
    });
    this.step = 2;
  }

  private submitStep2() {
    this.registerForm.get('step2')?.patchValue({
      code: this.registerForm.get('step2')?.value.code.replace(/[\s-]/g, ''),
    });
    if (this.registerForm.get('step2')?.invalid) {
      this.registerForm.get('step2')?.markAllAsTouched();
      toastMessage(this.messageService, register_toasts[400]);
      return;
    }
    const payload = {
      cellphone: this.registerForm
        .get('step1')
        ?.value.cellphone.replace(/[\s()-]/g, ''),
      document: this.registerForm
        .get('step1')
        ?.value.document.replace(/[-/.]/g, ''),
      code: this.registerForm.get('step2')?.value.code,
    };
    this.smsService.checkSMSVerify(payload).subscribe({
      next: (response: HttpResponse<SMSCodeCheckVerifyResponse>) => {
        toastMessage(this.messageService, sms_toasts[response.status]);
        const clean_document = this.registerForm
          .get('step1')
          ?.value.document.replace(/[-/.]/g, '');
        const clean_cellphone = this.registerForm
          .get('step1')
          ?.value.cellphone.replace(/[\s()-]/g, '');
        this.registerForm
          .get('step1')
          ?.patchValue({ document: clean_document });
        this.registerForm
          .get('step1')
          ?.patchValue({ cellphone: clean_cellphone });
        this.registerForm
          .get('step2')
          ?.patchValue({ document: clean_document });
        this.registerForm
          .get('step2')
          ?.patchValue({ cellphone: clean_cellphone });

        this.userService
          .create(this.registerForm.get('step1')?.value)
          .subscribe({
            next: (response: HttpResponse<UserCreateResponse>) => {
              toastMessage(
                this.messageService,
                register_toasts[response.status]
              );
              if (response?.body) {
                localStorage.setItem('accessToken', response.body.access);
                localStorage.setItem('refreshToken', response.body.refresh);
                localStorage.setItem('type', response.body.type);
                setTimeout(() => {
                  this.router.navigate(['login']);
                }, 2000);
              }
            },
            error: (error: HttpErrorResponse) => {
              toastMessage(this.messageService, register_toasts[error.status]);
            },
          });
      },
      error: (error: HttpErrorResponse) => {
        this.isCodeError = true;
        toastMessage(this.messageService, sms_toasts[error.status]);
        if (error.status === 429) {
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        }
      },
    });
  }

  private startCountdown(seconds: number) {
    this.intervalId = window.setInterval(() => {
      seconds--;
      this.countdown = new Date(seconds * 1000).toISOString().substr(14, 5);
      if (seconds <= 0) {
        clearInterval(this.intervalId);
        this.isLinkDisabled = false;
      }
    }, 1000);
  }

  onCheckDocument() {
    this.checkDocument = null;
    let document = this.registerForm.get('step1')?.get('document')?.value;
    if (!document) {
      return;
    }

    // Remove any non-digit characters
    document = document.replace(/\D/g, '');

    // Format as CPF or CNPJ
    if (document.length <= 11) {
      document = this.formatCPF(document);
    } else {
      document = this.formatCNPJ(document);
    }

    // Update the form control with the formatted value
    this.registerForm
      .get('step1')
      ?.get('document')
      ?.setValue(document, { emitEvent: false });

    if (document.length !== 14 && document.length !== 18) {
      this.registerForm
        .get('step1')
        ?.get('document')
        ?.setErrors({ incorrect: true });
      return;
    }

    const payload = {
      document: document.replace(/\D/g, ''),
    };

    this.userService.checkDocument(payload).subscribe({
      next: (data) => {
        this.checkDocument = true;
        this.registerForm.get('step1')?.get('document')?.setErrors(null);
      },
      error: (error) => {
        this.checkDocument = false;
        this.registerForm
          .get('step1')
          ?.get('document')
          ?.setErrors({ incorrect: true });
      },
    });
  }

  private formatCPF(value: string): string {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private formatCNPJ(value: string): string {
    return value.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }
}
