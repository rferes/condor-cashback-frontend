// Angular imports
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';

// Component imports
import { DashboardComponent } from './components/dashboard.component';

// Module imports

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    ChartModule,
  ],
  providers: [],
})
export class DashboardModule {}
