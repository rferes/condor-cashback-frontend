// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Ngprime imports
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
// Component imports
import { WalletComponent } from './components/wallet.component';

// Module imports

@NgModule({
  declarations: [WalletComponent],
  imports: [
    // Angular modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // NGPrime modules
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    FormsModule,
    InputSwitchModule,
    InputMaskModule,
    DropdownModule,
    TooltipModule,
    ProgressSpinnerModule,
  ],
  providers: [ConfirmationService],
})
export class WalletModule {}
