// Angular imports
import { Component, OnInit } from '@angular/core';
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
import { LoginService } from '../services/login.service';
import { UserService } from '../../../shared/services/user.service';
import { User } from '../../../shared/entities/user.entity';
import { SMSService } from '../../../shared/services/sms.service';
import { EmailService } from '../../../shared/services/email.service';
import { TermsAcceptanceService } from '../../../shared/services/terms-acceptance.service';

// Utils
import { toastMessage } from 'src/app/shared/utils/toast';
import { cpfCnpjValidator } from 'src/app/shared/utils/cpfCnpjValidator';
import { passwordValidator } from 'src/app/shared/utils/passwordValidator';
import { login_messages } from '../utils/login-response-msg';
import { email_messages } from '../../../shared/utils/email-response-msg';
import { sms_messages } from '../../../shared/utils/sms-response-msg';

// Entities
import { UserChangeEmailResponse } from '../../../shared/entities/user.entity';
import { SendSMSCodeVerifyResponse } from 'src/app/shared/entities/sms.entity';
import { SendEmailVerifyResponse } from '../../../shared/entities/email.entity';
import { LoginResponse } from '../entities/login.entity';
import { TermsAcceptance } from '../../../shared/entities/terms-acceptance.entity';
import { HttpClient } from '@angular/common/http';

const login_toasts = login_messages();
const email_toasts = email_messages();
const sms_toasts = sms_messages();

@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html',
})
export class LoginComponent implements OnInit {
  private static readonly SMS_RESEND_TIME_MIN = 3; // 3 minutes

  private intervalId = 0;

  countdown = '03:00';
  cellphone = '';
  step = 1;
  account_type: string = 'merchant';

  isLinkDisabled = true;
  isCodeError = false;
  loginForm: FormGroup;

  terms_version: string = '1.0';
  termsContent: string = '';
  acceptance_type:
    | 'consumer_terms'
    | 'privacy_policy'
    | 'merchant_terms'
    | 'influencer_terms' = 'merchant_terms';

  user_type: string = '';

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private smsService: SMSService,
    private emailService: EmailService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private termsAcceptanceService: TermsAcceptanceService,
    private http: HttpClient
  ) {
    this.loginForm = this.formBuilder.group({});
    if (
      localStorage.getItem('accessToken') !== null &&
      localStorage.getItem('refreshToken') !== null &&
      localStorage.getItem('type') !== null
    ) {
      this.user_type = localStorage.getItem('type') || '';
      const type = localStorage.getItem('type');
      console.log('Type:', type);
      if (localStorage.getItem('type') === 'Incomplete Email') {
        this.step = 3;
        this.router.navigate(['login']);
      } else if (
        localStorage.getItem('type') === 'Incomplete Terms Comercial'
      ) {
        this.step = 5;
        this.router.navigate(['login']);
      } else if (
        localStorage.getItem('type') === 'Incomplete Terms Influencer'
      ) {
        this.step = 6;
        this.router.navigate(['login']);
      } else if (
        type &&
        ['merchant', 'influencer', 'consumer', 'manager'].includes(type)
      ) {
        const type_lower = type.replace(/"/g, '').toLowerCase();
        this.router.navigate([type_lower + '/home']);
      } else {
        this.router.navigate(['login']);
      }
    }
  }

  loadTermsContent(type: string) {
    if (this.user_type === 'Incomplete Terms Comerciante') {
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
    } else if (this.user_type === 'Incomplete Terms Influencer') {
      this.http
        .get('/assets/terms/influencer_terms.html', { responseType: 'text' })
        .subscribe({
          next: (content) => {
            this.termsContent = content;
          },
          error: (error) => {
            console.error('Error loading terms:', error);
            this.termsContent = 'Error loading terms and conditions.';
          },
        });
    }
  }

  ngOnInit() {
    this.initializeLoginForm();
    this.loadTermsContent(this.user_type);
  }

  submit() {
    if (this.step === 1) {
      this.submitStep1();
    } else if (this.step === 2) {
      this.submitStep2();
    } else if (this.step === 3) {
      this.submitStep3();
    } else if (this.step === 4) {
      this.submitStep4();
    } else if (this.step === 5) {
      this.submitStep5();
    } else if (this.step === 6) {
      this.submitStep6();
    }
  }

  back() {
    if (this.step >= 2) {
      this.step--;
    }
    if (this.step === 4) {
      this.step = 1;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('type');
    this.step = 1;
    this.router.navigate(['login']);
  }

  resendEmail(): void {
    const payload = {
      email: this.loginForm.get('step3')?.value.email,
    };

    this.emailService.sendEmailVerify(payload).subscribe({
      next: (response: HttpResponse<SendEmailVerifyResponse>) => {
        this.startCountdown(LoginComponent.SMS_RESEND_TIME_MIN * 60);
        this.isLinkDisabled = true;
        toastMessage(this.messageService, email_toasts[response.status]);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, email_toasts[error.status]);
      },
    });
  }

  resendSMS(): void {
    const payload = {
      document: this.loginForm.get('step1')?.value.document,
      cellphone: this.cellphone,
    };
    this.smsService.sendSMSVerify(payload).subscribe({
      next: (response: HttpResponse<SendSMSCodeVerifyResponse>) => {
        this.startCountdown(LoginComponent.SMS_RESEND_TIME_MIN * 60);
        this.isLinkDisabled = true;
        toastMessage(this.messageService, sms_toasts[response.status]);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, sms_toasts[error.status]);
      },
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initializeLoginForm() {
    this.loginForm = this.formBuilder.group({
      step1: this.formBuilder.group({
        document: new FormControl('', [Validators.required, cpfCnpjValidator]),
        password: new FormControl('', [Validators.required, passwordValidator]),
        remember_device: new FormControl(true),
      }),
      step2: this.formBuilder.group({
        code: new FormControl('', [Validators.required]),
      }),
      step3: this.formBuilder.group({
        email: new FormControl('', [Validators.required, Validators.email]),
      }),
      step4: this.formBuilder.group({
        code: new FormControl('', [Validators.required]),
      }),
      step5: this.formBuilder.group({
        acceptTerms: [false, Validators.requiredTrue],
      }),
    });
  }

  private submitStep1() {
    if (this.loginForm.get('step1')?.invalid) {
      this.loginForm.get('step1')?.markAllAsTouched();
      toastMessage(this.messageService, login_toasts[400]);
      return;
    }

    const formValues = this.loginForm.get('step1')?.value;
    const payload = {
      document: formValues.document.replace(/\D/g, ''),
      password: formValues.password,
      remember_device: formValues.remember_device,
    };

    this.loginService.login(payload).subscribe({
      next: (response: HttpResponse<LoginResponse>) => {
        if (response.body?.type) {
          localStorage.setItem('accessToken', response.body.access);
          localStorage.setItem('refreshToken', response.body.refresh);
          localStorage.setItem('type', (response.body.type ?? '').toLowerCase());
          const type = (response.body?.type ?? '').toLowerCase();
          this.router.navigate([`${type}/dashboard`]);
        } else {
          this.cellphone = response.body?.cellphone ?? '';
          this.step = 2;
          this.startCountdown(LoginComponent.SMS_RESEND_TIME_MIN * 60);
          this.isLinkDisabled = true;
        }

        toastMessage(this.messageService, login_toasts[response.status]);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, login_toasts[error.status]);
      },
    });
  }

  private submitStep2() {
    if (this.loginForm.get('step2')?.invalid) {
      this.loginForm.get('step2')?.markAllAsTouched();
      toastMessage(this.messageService, login_toasts[400]);
      return;
    }

    const payload = {
      document: this.loginForm.get('step1')?.value.document.replace(/\D/g, ''),
      password: this.loginForm.get('step1')?.value.password,
      remember_device: this.loginForm.get('step1')?.value.remember_device,
      code: this.loginForm.get('step2')?.value.code.replace(/[\s-]/g, ''),
    };

    this.loginService.login(payload).subscribe({
      next: (response: HttpResponse<LoginResponse>) => {
        toastMessage(this.messageService, login_toasts[response.status]);
        if (response.status === 200 && response.body) {
          localStorage.setItem('accessToken', response.body.access);
          localStorage.setItem('refreshToken', response.body.refresh);
          localStorage.setItem('type', (response.body.type ?? '').toLowerCase());
        }
        if (response.body?.type === 'Incomplete Email') {
          this.step = 3;
          return;
        }
        const type = (response.body?.type ?? '').toLowerCase();
        this.router.navigate([`${type}/dashboard`]);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, login_toasts[error.status]);
        if (error.status === 429) {
          this.step = 1;
          this.logout();
        }
      },
    });
  }

  private submitStep3() {
    if (this.loginForm.get('step3')?.invalid) {
      this.loginForm.get('step3')?.markAllAsTouched();
      toastMessage(this.messageService, login_toasts[400]);
      return;
    }
    this.emailService
      .sendEmailVerify(this.loginForm.get('step3')?.value)
      .subscribe({
        next: (response) => {
          this.step = 4;
          this.startCountdown(LoginComponent.SMS_RESEND_TIME_MIN * 60);
          this.isLinkDisabled = true;
          toastMessage(this.messageService, email_toasts[response.status]);
        },
        error: (error) => {
          toastMessage(this.messageService, email_toasts[error.status]);
        },
      });
  }

  private submitStep4() {
    if (this.loginForm.get('step4')?.invalid) {
      this.loginForm.get('step4')?.markAllAsTouched();
      toastMessage(this.messageService, login_toasts[400]);
      return;
    }

    const payload = {
      email: this.loginForm.get('step3')?.value.email,
      confirmEmail: this.loginForm.get('step3')?.value.email,
      code: this.loginForm.get('step4')?.value.code.replace(/[\s-]/g, ''),
    };
    this.userService.changeEmail(payload).subscribe({
      next: (response: HttpResponse<UserChangeEmailResponse>) => {
        toastMessage(this.messageService, email_toasts[response.status]);
        if (response.status === 200) {
          if (response.body?.type === 'Incomplete Email') {
            this.step = 3;
            return;
          } else if (response.body?.type === 'merchant') {
            localStorage.setItem('type', 'merchant');
            this.router.navigate(['merchant/dashboard']);
          } else if (response.body?.type === 'influencer') {
            localStorage.setItem('type', 'influencer');
            this.router.navigate(['influencer/dashboard']);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, email_toasts[error.status]);
        if (error.status === 429) {
          this.step = 1;
          this.logout();
        }
      },
    });
  }

  private submitStep5() {
    if (!this.loginForm.get('step5.acceptTerms')?.value) {
      toastMessage(this.messageService, login_toasts[400]);
      return;
    }

    this.acceptTerms('merchant_terms');
    const type = localStorage.getItem('type')?.toLowerCase() || '';
    this.router.navigate([`${type}/dashboard`]);
  }

  private submitStep6() {
    if (!this.loginForm.get('step5.acceptTerms')?.value) {
      toastMessage(this.messageService, login_toasts[400]);
      return;
    }

    this.acceptTerms('influencer_terms');
    const type = localStorage.getItem('type')?.toLowerCase() || '';
    this.router.navigate([`${type}/dashboard`]);
  }

  private acceptTerms(acceptance_type: string) {
    const payload = {
      terms_version: '1.0',
      acceptance_type: acceptance_type as 'merchant_terms' | 'influencer_terms' | 'consumer_terms',
    };

    this.termsAcceptanceService.create(payload).subscribe({
      next: (response: HttpResponse<TermsAcceptance>) => {
        console.log('Termos aceitos com sucesso!');

        // Atualizar o campo de termos aceitos do usuário conforme o tipo
        const userUpdatePayload: any = {};
        if (acceptance_type === 'merchant_terms') {
          userUpdatePayload.is_terms_comercial_accepted = true;
        } else if (acceptance_type === 'influencer_terms') {
          userUpdatePayload.is_terms_comercial_accepted = true;
        } else if (acceptance_type === 'consumer_terms') {
          userUpdatePayload.is_terms_consumer_accepted = true;
        }

        this.userService.partialUpdate(userUpdatePayload).subscribe({
          next: (userUpdateResponse: HttpResponse<User>) => {
            localStorage.setItem('type', (userUpdateResponse.body?.account_type ?? '').toLowerCase());
            const type = (userUpdateResponse.body?.account_type ?? '').toLowerCase();
            this.router.navigate([`${type}/dashboard`]);
            toastMessage(this.messageService, login_toasts[200]);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao atualizar o usuário:', error);
            toastMessage(this.messageService, login_toasts[error.status]);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao aceitar os termos:', error);
        toastMessage(this.messageService, login_toasts[error.status]);
      },
    });
  }

  private startCountdown(seconds: number) {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }

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
    let document = this.loginForm.get('step1')?.get('document')?.value;
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
    this.loginForm
      .get('step1')
      ?.get('document')
      ?.setValue(document, { emitEvent: false });

    if (document.length !== 14 && document.length !== 18) {
      this.loginForm
        .get('step1')
        ?.get('document')
        ?.setErrors({ incorrect: true });
      return;
    }
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
