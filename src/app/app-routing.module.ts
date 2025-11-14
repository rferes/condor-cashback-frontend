// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Modules
import { LoginRoutingModule } from './auth/login/routers/login-routing.module';
import { RegisterRoutingModule } from './auth/register/routers/register-routing.module';
import { ForgotPasswordRoutingModule } from './auth/forgot-password/routers/forgot-password-routing.module';

import { LayoutModule } from './layout/layout.module';

import { DashboardRoutingModule as MerchantDashboardRoutingModule } from './merchant/dashboard/routers/dashboard-routing.module';
import { DashboardRoutingModule as InfluencerDashboardRoutingModule } from './influencer/dashboard/routers/dashboard-routing.module';
import { CampaignRoutingModule } from './campaign/routers/campaign-routing.module';

import { AccountRoutingModule } from './account/account/routers/account-routing.module';
import { ProfileRoutingModule as MerchantProfileRoutingModule } from './merchant/profile/routers/profile-routing.module';
import { ProfileRoutingModule as InfluencerProfileRoutingModule } from './influencer/profile/routers/profile-routing.module';

import { WalletRoutingModule } from './payment/wallet/wallet-view/routers/wallet-routing.module';
import { AutoReloadCampaignCreditRoutingModule } from './payment/wallet/auto-reload-campaign-credit/routers/auto-reload-campaign-credit-routing.module';
import { RedCreditRoutingModule } from './payment/red-credit/routers/red-credit-routing.module';
import { RedComissionRoutingModule } from './payment/red-comission/routers/red-comission-routing.module';

import { StoreRoutingModule } from './merchant/store/routers/store-routing.module';
import { StoreGroupRoutingModule } from './merchant/store-group/routers/store-group-routing.module';
import { ProductRoutingModule } from './merchant/product/routers/product-routing.module';
import { CollectionRoutingModule } from './merchant/product-collection/routers/collection-routing.module';
import { ConsumerGroupRoutingModule } from './merchant/consumer-group/routers/consumer-group-routing.module';
import { ConsumerRoutingModule } from './merchant/consumer/routers/consumer-routing.module';
import { InfluencerMerchantRoutingModule } from './merchant/influencer/routers/influencer-routing.module';
import { PartnershipRoutingModule } from './merchant/partnership/routers/partnership-routing.module';

import { ReceiptSearchRoutingModule } from './receipt/receipt-search/routers/receipt-search-routing.module';

import { PageRoutingModule as InfluencerPageRoutingModule } from './influencer/page/routers/page-routing.module';
import { PageRoutingModule as MerchantPageRoutingModule } from './merchant/page/routers/page-routing.module';

import { PixKeyRoutingModule } from './payment/pix-key/routers/pix-key-routing.module';
import { CreditCardRoutingModule } from './payment/credit-card/routers/credit-card-routing.module';
import { TransactionRoutingModule } from './payment/transaction/routers/transaction-routing.module';
import { ReceiptRoutingModule } from './receipt/routers/receipt-routing.module';
import { CouponRoutingModule } from './coupon/routers/coupon-routing.module';
import { MerchantApiKeysRoutingModule } from './merchant/api-keys/routers/api-keys-routing.module';

// Components
import { LoginComponent } from './auth/login/components/login.component';

const routes: Routes = [{ path: '**', component: LoginComponent }];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),

    LayoutModule,

    LoginRoutingModule,
    RegisterRoutingModule,
    ForgotPasswordRoutingModule,

    MerchantDashboardRoutingModule,
    InfluencerDashboardRoutingModule,
    CampaignRoutingModule,

    AccountRoutingModule,
    MerchantProfileRoutingModule,
    InfluencerProfileRoutingModule,

    WalletRoutingModule,
    AutoReloadCampaignCreditRoutingModule,
    RedCreditRoutingModule,
    RedComissionRoutingModule,

    StoreRoutingModule,
    StoreGroupRoutingModule,
    ProductRoutingModule,
    CollectionRoutingModule,
    ConsumerGroupRoutingModule,
    ConsumerRoutingModule,
    InfluencerMerchantRoutingModule,
    PartnershipRoutingModule,
    InfluencerPageRoutingModule,
    MerchantPageRoutingModule,

    ReceiptSearchRoutingModule,

    PixKeyRoutingModule,
    CreditCardRoutingModule,
    TransactionRoutingModule,
    ReceiptRoutingModule,
    CouponRoutingModule,
    MerchantApiKeysRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
