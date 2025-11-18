// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Ngprime imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputMaskModule } from 'primeng/inputmask';

import { AutoCompleteModule } from 'primeng/autocomplete';

// Component imports
import { PartnershipGuestViewComponent } from './components/partnership-view.component';

// Module imports

@NgModule({
  declarations: [PartnershipGuestViewComponent],
  imports: [
    // Angular modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // NGPrime modules
    ButtonModule,
    InputTextModule,
    TableModule,
    ToastModule,
    PanelModule,
    FormsModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule,
    InputMaskModule,
    AutoCompleteModule,
  ],
  providers: [ConfirmationService],
})
export class PartnershipViewModule {}
