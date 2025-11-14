// Angular imports
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG imports
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TagModule } from 'primeng/tag';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Component imports
import { LayoutComponent } from './components/layout.component';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    // Angular modules
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,

    // PrimeNG modules
    OverlayPanelModule,
    DropdownModule,
    ButtonModule,
    PanelMenuModule,
    TagModule,
  ],
  providers: [],
  exports: [LayoutComponent],
})
export class LayoutModule {}
