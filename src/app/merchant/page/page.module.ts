// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Ngprime imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MessageService } from 'primeng/api';

// Component imports
import { PageComponent } from './components/page.component';

@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    InputMaskModule,
    ToastModule,
    TableModule,
    ZXingScannerModule,
    TooltipModule,
    DialogModule,
    HttpClientModule,
    ScrollPanelModule,
  ],
  providers: [MessageService],
})
export class PageModule {}
