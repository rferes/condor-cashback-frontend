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
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ChipsModule } from 'primeng/chips';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectButtonModule } from 'primeng/selectbutton';

// Component imports
import { ConsumerGroupViewComponent } from './components/consumer-group-view.component';
// Module imports

@NgModule({
  declarations: [ConsumerGroupViewComponent],
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
    InputSwitchModule,
    InputMaskModule,
    DropdownModule,
    TooltipModule,
    ChipsModule,
    ProgressSpinnerModule,
    SplitButtonModule,
    FileUploadModule,
    SelectButtonModule,
  ],
  providers: [ConfirmationService],
})
export class ConsumerGroupViewModule {}
