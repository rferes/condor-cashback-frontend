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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Component imports
import { RedCreditListComponent } from './components/red-credit-list.component';

// Module imports

@NgModule({
  declarations: [RedCreditListComponent],
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
    AutoCompleteModule,
    ProgressSpinnerModule,
  ],
  providers: [ConfirmationService],
})
export class RedCreditListModule {}
