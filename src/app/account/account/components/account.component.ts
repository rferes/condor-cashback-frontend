// Angular imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

// Application imports
import { UserService as ComponentService } from '../../../shared/services/user.service';
import {
  User as ComponentEntity,
  UserChangePasswordResponse,
  UserChangeEmailResponse,
  UserChangeCellphoneResponse,
} from '../../../shared/entities/user.entity';
import { merchantTypes } from '../utils/account.util';
import { cpfCnpjValidator } from 'src/app/shared/utils/cpfCnpjValidator';
import { toastMessage } from 'src/app/shared/utils/toast';
import { account_response } from '../utils/account-response-msg';
import { SMSService } from 'src/app/shared/services/sms.service';
import { sms_messages } from 'src/app/shared/utils/sms-response-msg';
import { SendSMSCodeVerifyResponse } from 'src/app/shared/entities/sms.entity';
import { EmailService } from 'src/app/shared/services/email.service';
import { email_messages } from 'src/app/shared/utils/email-response-msg';
import { SendEmailVerifyResponse } from 'src/app/shared/entities/email.entity';
import { ConfirmationService } from 'primeng/api';
// Constants
const RESEND_TIMER_SECONDS = 180;
const component_toasts = account_response();
const sms_toasts = sms_messages();
const email_toasts = email_messages();

// Interfaces
interface DialogState {
  password: boolean;
  email: boolean;
  cellphone: boolean;
}

@Component({
  selector: 'app-account',
  templateUrl: '../views/account.component.html',
})
export class AccountComponent implements OnInit, OnDestroy {
  // Forms
  entity: ComponentEntity = {} as ComponentEntity;
  entityForm!: FormGroup;
  changePasswordForm!: FormGroup;
  changeEmailForm!: FormGroup;
  changeCellphoneForm!: FormGroup;

  // UI State
  editMode = false;
  merchantTypesList = merchantTypes;
  dialogState: DialogState = {
    password: false,
    email: false,
    cellphone: false,
  };

  // Verification State
  canResendSMSCode = false;
  canResendEmailCode = false;
  remainingTimeSMS = 0;
  remainingTimeEmail = 0;
  passwordErrorMsg = '';
  requestErrorMsg = '';

  // Timers and Subscriptions
  private resendSMSTimer?: any;
  private resendEmailTimer?: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private componentService: ComponentService,
    private smsService: SMSService,
    private messageService: MessageService,
    private emailService: EmailService,
    private confirmationService: ConfirmationService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.clearResendTimers();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Form Setup
  private initializeForms(): void {
    this.entityForm = this.createEntityForm();
    this.changePasswordForm = this.createPasswordForm();
    this.changeEmailForm = this.createEmailForm();
    this.changeCellphoneForm = this.createCellphoneForm();
  }

  private createEntityForm(): FormGroup {
    return this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      document: ['', [Validators.required, cpfCnpjValidator]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', Validators.required],
    });
  }

  private createPasswordForm(): FormGroup {
    const passwordPattern =
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';

    return this.formBuilder.group(
      {
        code: ['', Validators.required],
        password: [
          '',
          [Validators.required, Validators.pattern(passwordPattern)],
        ],
        confirm: ['', Validators.required],
        document: ['', Validators.required],
        cellphone: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private createEmailForm(): FormGroup {
    return this.formBuilder.group({
      code: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
    });
  }

  private createCellphoneForm(): FormGroup {
    const phonePattern = '^\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}$';

    return this.formBuilder.group({
      code: ['', Validators.required],
      cellphone: ['', [Validators.required, Validators.pattern(phonePattern)]],
      confirmCellphone: [
        '',
        [Validators.required, Validators.pattern(phonePattern)],
      ],
    });
  }

  // Data Loading
  private loadUserData(): void {
    const subscription = this.componentService.get().subscribe({
      next: (user: ComponentEntity) => {
        this.entity = user;
        this.patchAllForms(user);
      },
      error: (error) => this.handleError(error),
    });
    this.subscriptions.push(subscription);
  }

  private patchAllForms(user: ComponentEntity): void {
    this.entityForm.patchValue(user);
    this.changePasswordForm.patchValue(user);
    this.changeEmailForm.patchValue(user);
    this.changeCellphoneForm.patchValue(user);
  }

  // Form Actions
  edit(): void {
    this.editMode = true;
  }

  save(): void {
    if (this.entityForm.valid) {
      this.updateEntity(this.entityForm.value);
      this.editMode = false;
    }
  }

  cancel(): void {
    this.resetForm();
    this.editMode = false;
  }

  resetForm(): void {
    this.entityForm.reset();
    this.entityForm.patchValue(this.entity);
  }

  // Dialog Management
  openDialog(type: keyof DialogState): void {
    this.dialogState[type] = true;

    if (type === 'email') {
      if (this.remainingTimeEmail === 0) {
        this.startResendEmailTimer();
        this.sendEmailCode();
      }
    } else {
      if (this.remainingTimeSMS === 0) {
        this.startResendSMSTimer();
        this.sendSMSCode();
      }
    }
  }

  closeDialog(type: keyof DialogState, form: FormGroup): void {
    this.dialogState[type] = false;
    form.reset();
    // type === 'email' ? this.resetEmailState() : this.resetSMSState();
  }

  // Password Validation
  validatePassword(event: any): void {
    const password = event.target.value;
    const validations = [
      {
        condition: password.length >= 8,
        message: 'A senha deve ter no mínimo 8 caracteres',
      },
      {
        condition: /[A-Z]/.test(password),
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      },
      {
        condition: /[a-z]/.test(password),
        message: 'A senha deve conter pelo menos uma letra minúscula',
      },
      {
        condition: /\d/.test(password),
        message: 'A senha deve conter pelo menos um número',
      },
      {
        condition: /[@$!%*?&]/.test(password),
        message: 'A senha deve conter pelo menos um caractere especial',
      },
    ];

    const failedValidation = validations.find((v) => !v.condition);
    this.passwordErrorMsg = failedValidation ? failedValidation.message : '';
  }

  // Save Methods
  savePassword(): void {
    if (
      this.isFormValidWithMatchingFields(
        this.changePasswordForm,
        'password',
        'confirm'
      )
    ) {
      const formValue = this.prepareFormValue(this.changePasswordForm);
      this.changePasswordRequest(formValue);
    }
  }

  saveNewEmail(): void {
    if (
      this.isFormValidWithMatchingFields(
        this.changeEmailForm,
        'email',
        'confirmEmail'
      )
    ) {
      const formValue = this.prepareFormValue(this.changeEmailForm);
      this.changeEmailRequest(formValue);
    }
  }

  saveNewCellphone(): void {
    if (
      this.isFormValidWithMatchingFields(
        this.changeCellphoneForm,
        'cellphone',
        'confirmCellphone'
      )
    ) {
      const formValue = this.prepareFormValue(this.changeCellphoneForm);
      formValue.cellphone = formValue.cellphone.replace(/[\s()-]/g, '');
      formValue.confirmCellphone = formValue.confirmCellphone.replace(
        /[\s()-]/g,
        ''
      );
      this.changeCellphoneRequest(formValue);
    }
  }

  private prepareFormValue(form: FormGroup): any {
    const formValue = form.value;
    formValue.code = formValue.code.replace(/[\s-]/g, '');
    formValue.document = this.entityForm.get('document')?.value;
    formValue.cellphone = this.entityForm.get('cellphone')?.value;
    return formValue;
  }

  // Code Management
  resendSMSCode(): void {
    if (this.canResendSMSCode) {
      this.sendSMSCode();
      this.startResendSMSTimer();
    }
  }

  resendEmailCode(): void {
    if (this.canResendEmailCode) {
      this.sendEmailCode();
      this.startResendEmailTimer();
    }
  }

  private sendSMSCode(): void {
    this.requestErrorMsg = '';
    const payload = {
      document: this.entityForm.get('document')?.value,
      cellphone: this.entityForm.get('cellphone')?.value,
    };

    const subscription = this.smsService.sendSMSVerify(payload).subscribe({
      next: (response: HttpResponse<SendSMSCodeVerifyResponse>) => {
        toastMessage(this.messageService, sms_toasts[response.status]);
      },
      error: (error: unknown) => this.handleError(error, sms_toasts),
    });
    this.subscriptions.push(subscription);
  }

  private sendEmailCode(): void {
    this.requestErrorMsg = '';
    const payload = {
      document: this.entityForm.get('document')?.value,
      email: this.entityForm.get('email')?.value,
    };

    const subscription = this.emailService.sendEmailVerify(payload).subscribe({
      next: (response: HttpResponse<SendEmailVerifyResponse>) => {
        toastMessage(this.messageService, email_toasts[response.status]);
      },
      error: (error: unknown) => this.handleError(error, email_toasts),
    });
    this.subscriptions.push(subscription);
  }

  // Helper Methods
  private isFormValidWithMatchingFields(
    form: FormGroup,
    field1: string,
    field2: string
  ): boolean {
    if (!form.valid) return false;

    const value1 = form.get(field1)?.value;
    const value2 = form.get(field2)?.value;

    if (value1 !== value2) {
      toastMessage(this.messageService, component_toasts[400]);
      return false;
    }

    return true;
  }

  private handleError(error: any, toasts = component_toasts): void {
    toastMessage(this.messageService, toasts[error.status] || toasts[500]);
  }

  // Timer Management
  private startResendSMSTimer(): void {
    this.clearResendSMSTimer();
    this.canResendSMSCode = false;
    this.remainingTimeSMS = RESEND_TIMER_SECONDS;

    this.resendSMSTimer = setInterval(() => {
      this.remainingTimeSMS--;
      if (this.remainingTimeSMS <= 0) {
        this.resetSMSState();
      }
    }, 1000);
  }

  private startResendEmailTimer(): void {
    this.clearResendEmailTimer();
    this.canResendEmailCode = false;
    this.remainingTimeEmail = RESEND_TIMER_SECONDS;

    this.resendEmailTimer = setInterval(() => {
      this.remainingTimeEmail--;
      if (this.remainingTimeEmail <= 0) {
        this.resetEmailState();
      }
    }, 1000);
  }

  private resetSMSState(): void {
    this.canResendSMSCode = true;
    this.remainingTimeSMS = RESEND_TIMER_SECONDS;
    this.clearResendSMSTimer();
  }

  private resetEmailState(): void {
    this.canResendEmailCode = true;
    this.remainingTimeEmail = RESEND_TIMER_SECONDS;
    this.clearResendEmailTimer();
  }

  private clearResendSMSTimer(): void {
    if (this.resendSMSTimer) {
      clearInterval(this.resendSMSTimer);
      this.resendSMSTimer = undefined;
    }
  }

  private clearResendEmailTimer(): void {
    if (this.resendEmailTimer) {
      clearInterval(this.resendEmailTimer);
      this.resendEmailTimer = undefined;
    }
  }

  private clearResendTimers(): void {
    this.clearResendSMSTimer();
    this.clearResendEmailTimer();
  }

  // API Requests
  private updateEntity(payload: Partial<ComponentEntity>): void {
    const subscription = this.componentService
      .partialUpdate(payload)
      .subscribe({
        next: (response: HttpResponse<ComponentEntity>) => {
          if (response.body) {
            this.entity = response.body;
            this.resetForm();
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
          }
        },
        error: (error) => this.handleError(error),
      });
    this.subscriptions.push(subscription);
  }

  private changePasswordRequest(payload: any): void {
    const subscription = this.componentService
      .forgotPassword(payload)
      .subscribe({
        next: (response: HttpResponse<UserChangePasswordResponse>) => {
          toastMessage(this.messageService, component_toasts[response.status]);
          this.closeDialog('password', this.changePasswordForm);
          window.location.reload();
        },
        error: (error) => this.handleRequestError(error, 'sms'),
      });
    this.subscriptions.push(subscription);
  }

  private changeEmailRequest(payload: any): void {
    const subscription = this.componentService.changeEmail(payload).subscribe({
      next: (response: HttpResponse<UserChangeEmailResponse>) => {
        toastMessage(this.messageService, component_toasts[response.status]);
        this.closeDialog('email', this.changeEmailForm);
        window.location.reload();
      },
      error: (error) => this.handleRequestError(error, 'email'),
    });
    this.subscriptions.push(subscription);
  }

  private changeCellphoneRequest(payload: any): void {
    const subscription = this.componentService
      .changeCellphone(payload)
      .subscribe({
        next: (response: HttpResponse<UserChangeCellphoneResponse>) => {
          toastMessage(this.messageService, component_toasts[response.status]);
          this.closeDialog('cellphone', this.changeCellphoneForm);
          window.location.reload();
        },
        error: (error) => this.handleRequestError(error, 'sms'),
      });
    this.subscriptions.push(subscription);
  }

  private handleRequestError(error: any, type: 'sms' | 'email'): void {
    if (error.status === 406) {
      this.requestErrorMsg = `O código de verificação é inválido, já foi ${
        error.error.attempts
      } ${error.error.attempts === '1' ? 'tentativa' : 'tentativas'}`;
    } else if (error.status === 429) {
      if (type === 'sms') {
        this.remainingTimeSMS = RESEND_TIMER_SECONDS;
        this.startResendSMSTimer();
        this.requestErrorMsg =
          'Você realizou muitas requisições, aguarde e reenvie o código sms';
      } else {
        this.remainingTimeEmail = RESEND_TIMER_SECONDS;
        this.startResendEmailTimer();
        this.requestErrorMsg =
          'Você realizou muitas requisições, aguarde e reenvie o código por email';
      }
    } else {
      this.handleError(error);
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirm = form.get('confirm');

    if (!password || !confirm) return null;

    if (password.value !== confirm.value) {
      confirm.setErrors({ passwordMismatch: true });
    } else if (confirm.errors?.['passwordMismatch']) {
      const errors = { ...confirm.errors };
      delete errors['passwordMismatch'];
      confirm.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }

    return null;
  }

  confirmChangeCellphone() {
    this.confirmationService.confirm({
      message: 'Você deseja alterar o número de celular?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.openDialog('cellphone');
      },
    });
  }

  confirmChangeEmail() {
    this.confirmationService.confirm({
      message: 'Você deseja alterar o email?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.openDialog('email');
      },
    });
  }

  confirmChangePassword() {
    this.confirmationService.confirm({
      message: 'Você deseja alterar a senha?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.openDialog('password');
      },
    });
  }
}
