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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
// Component imports
import { AutoReloadCampaignCreditComponent } from './components/auto-reload-campaign-credit.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
// Module imports

@NgModule({
  declarations: [AutoReloadCampaignCreditComponent],
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
export class AutoReloadCampaignCreditModule {}
