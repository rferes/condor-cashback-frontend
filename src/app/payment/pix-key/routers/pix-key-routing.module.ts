// login-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PixKeyListComponent } from '../pix-key-list/components/pix-key-list.component';
import { PixKeyViewComponent } from '../pix-key-view/components/pix-key-view.component';

import { AuthGuard } from 'src/app/utils/guards/auth.guard';

const routes: Routes = [
  {
    path: 'payment/pix-key-list',
    component: PixKeyListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payment/pix-key-view/:id',
    component: PixKeyViewComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PixKeyRoutingModule {}
