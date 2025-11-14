// Angular imports
// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Ngprime imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

// Component imports
import { ReceiptSearchComponent } from './components/receipt-search.component';

// Module imports

@NgModule({
  declarations: [ReceiptSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    InputMaskModule,
    ToastModule,
    TableModule,
    ZXingScannerModule,
  ],
  providers: [],
})
export class ReceiptSearchModule {}
