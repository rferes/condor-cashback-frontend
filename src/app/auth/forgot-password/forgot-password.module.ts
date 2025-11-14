// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG imports
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TooltipModule } from 'primeng/tooltip';

// Component imports
import { ForgotPasswordComponent } from './components/forgot-password.component';

// Module imports

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    // Angular modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // PrimeNG modules
    ToastModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    InputMaskModule,
    InputNumberModule,
    KeyFilterModule,
    TooltipModule,
  ],
  providers: [],
})
export class ForgotPasswordModule {}
