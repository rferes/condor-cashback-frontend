// red-comission-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedComissionListComponent } from '../red-comission-list/components/red-comission-list.component';
import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'wallet/red-comission-list',
    component: RedComissionListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedComissionRoutingModule {}
