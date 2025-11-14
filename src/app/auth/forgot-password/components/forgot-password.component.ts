// Angular imports
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

// Third-party library imports
import { MessageService } from 'primeng/api';

// Application imports
import { UserService } from '../../../shared/services/user.service';
import { SMSService } from '../../../shared/services/sms.service';

// Validators
import { passwordValidator } from '../../../shared/utils/passwordValidator';
import { passowrdConfirmValidator } from '../../../shared/utils/passwordConfirmValidator';
import { cpfCnpjValidator } from '../../../shared/utils/cpfCnpjValidator';

// Utils
import { toastMessage } from 'src/app/shared/utils/toast';
import { sms_messages } from '../../../shared/utils/sms-response-msg';
import { forgot_password_messages } from '../utils/forgot-password-response-msg';

//Entities
import { SendSMSCodeVerifyResponse } from 'src/app/shared/entities/sms.entity';
import { UserChangePasswordResponse } from 'src/app/shared/entities/user.entity';

const sms_toasts = sms_messages();
const forgot_toasts = forgot_password_messages();

@Component({
  selector: 'app-forgot-password',
  templateUrl: '../views/forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private static readonly SMS_RESEND_TIME_MIN = 3; // 3 minutes
  private intervalId = 0;
  step = 1;

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
  forgotPasswordForm: FormGroup;
  isLinkDisabled: boolean = true;

  constructor(
    private userService: UserService,
    private smsService: SMSService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeForgotPasswordForm();
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
      this.step--;
    }
  }

  resendSMS(): void {
    const payload = {
      document: this.forgotPasswordForm
        .get('step1')
        ?.value.document.replace(/[-/.]/g, ''),
      cellphone: this.forgotPasswordForm
        .get('step1')
        ?.value.cellphone.replace(/[\s()-]/g, ''),
    };
    this.smsService.sendSMSVerify(payload).subscribe({
      next: (response: HttpResponse<SendSMSCodeVerifyResponse>) => {
        this.startCountdown(ForgotPasswordComponent.SMS_RESEND_TIME_MIN * 60);
        this.isLinkDisabled = true;
        toastMessage(this.messageService, sms_toasts[response.status]);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, sms_toasts[error.status]);
      },
    });
  }

  onCheckConfirmPassword() {
    const password = this.forgotPasswordForm.get('step1')?.value.password;
    const confirm = this.forgotPasswordForm.get('step1')?.value.confirm;
    if (password !== confirm) {
      this.forgotPasswordForm
        .get('step1')
        ?.get('confirm')
        ?.setErrors({ passwordConfirm: true });
    } else {
      this.forgotPasswordForm.get('step1')?.get('confirm')?.setErrors(null);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initializeForgotPasswordForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      step1: this.formBuilder.group({
        document: new FormControl('', [Validators.required, cpfCnpjValidator]),
        cellphone: new FormControl('', [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(15),
        ]),
        password: new FormControl('', [Validators.required, passwordValidator]),
        confirm: new FormControl('', [
          Validators.required,
          passowrdConfirmValidator,
        ]),
      }),
      step2: this.formBuilder.group({
        code: new FormControl('', [Validators.required]),
      }),
    });
  }

  private submitStep1() {
    if (this.forgotPasswordForm.get('step1')?.invalid) {
      this.forgotPasswordForm.get('step1')?.markAllAsTouched();
      toastMessage(this.messageService, forgot_toasts[400]);
      return;
    }

    const clean_document = this.forgotPasswordForm
      .get('step1')
      ?.value.document.replace(/[-/.]/g, '');
    const clean_cellphone = this.forgotPasswordForm
      .get('step1')
      ?.value.cellphone.replace(/[\s()-]/g, '');

    const payload = {
      document: clean_document,
      cellphone: clean_cellphone,
    };
    this.smsService.sendSMSVerify(payload).subscribe({
      next: (response: HttpResponse<SendSMSCodeVerifyResponse>) => {
        console.log('Response:', response);
        this.startCountdown(ForgotPasswordComponent.SMS_RESEND_TIME_MIN * 60);
        this.isLinkDisabled = true;
        this.step = 2;
        toastMessage(this.messageService, sms_toasts[response.status]);
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error:', error);
        toastMessage(this.messageService, sms_toasts[error.status]);
      },
    });
  }

  private submitStep2() {
    if (this.forgotPasswordForm.get('step2')?.invalid) {
      this.forgotPasswordForm.get('step2')?.markAllAsTouched();
      toastMessage(this.messageService, forgot_toasts[400]);
      return;
    }

    const clean_document = this.forgotPasswordForm
      .get('step1')
      ?.value.document.replace(/[-/.]/g, '');
    const clean_cellphone = this.forgotPasswordForm
      .get('step1')
      ?.value.cellphone.replace(/[\s()-]/g, '');
    const clean_code = this.forgotPasswordForm
      .get('step2')
      ?.value.code.replace(/[\s-]/g, '');
    const passord = this.forgotPasswordForm.get('step1')?.value.password;
    const confirm = this.forgotPasswordForm.get('step1')?.value.confirm;

    const payload = {
      document: clean_document,
      cellphone: clean_cellphone,
      code: clean_code,
      password: passord,
      confirm: confirm,
    };

    this.userService.forgotPassword(payload).subscribe({
      next: (response: HttpResponse<UserChangePasswordResponse>) => {
        toastMessage(this.messageService, forgot_toasts[response.status]);
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, forgot_toasts[error.status]);
        if (error.status === 429) {
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
        }
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
}
