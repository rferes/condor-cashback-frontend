// Angular imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideNgxMask, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

// Ngprime imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { InputSwitchModule } from 'primeng/inputswitch';
import { ListboxModule } from 'primeng/listbox';
import { ScrollerModule } from 'primeng/scroller';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// Component imports
import { AccountComponent } from './components/account.component';

@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    InputMaskModule,
    ToggleButtonModule,

    InputSwitchModule,
    ListboxModule,
    ScrollerModule,
    ImageCropperModule,
    TooltipModule,
    ToastModule,
    DialogModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ConfirmDialogModule,
  ],
  providers: [provideNgxMask()],
})
export class AccountModule {}
