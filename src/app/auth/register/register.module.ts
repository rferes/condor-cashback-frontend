// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG imports
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollPanelModule } from 'primeng/scrollpanel';
// Component imports
import { RegisterComponent } from './components/register.component';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    // Angular modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    // PrimeNG modules
    ToastModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    InputMaskModule,
    InputNumberModule,
    KeyFilterModule,
    SelectButtonModule,
    TooltipModule,
    ScrollPanelModule,
  ],
  providers: [],
})
export class RegisterModule {}
