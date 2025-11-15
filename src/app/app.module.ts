// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { provideNgxMask, NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

// PrimeNG imports
import { MessageService } from 'primeng/api';

// Custom imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';
import { ForgotPasswordModule } from './auth/forgot-password/forgot-password.module';

import { AccountModule } from './account/account/account.module';
import { ProfileModule as MerchantModule } from './merchant/profile/profile.module';
import { ProfileModule as InfluencerModule } from './influencer/profile/profile.module';
import { DashboardModule as MerchantDashboardModule } from './merchant/dashboard/dashboard.module';
import { DashboardModule as InfluencerDashboardModule } from './influencer/dashboard/dashboard.module';

import { WalletModule } from './payment/wallet/wallet-view/wallet.module';
import { AutoReloadCampaignCreditModule } from './payment/wallet/auto-reload-campaign-credit/auto-reload-campaign-credit.module';
import { RedCreditListModule } from './payment/red-credit/red-credit-list/red-credit-list.module';
import { RedComissionListModule } from './payment/red-comission/red-comission-list/red-comission-list.module';

import { CampaignListModule } from './campaign/campaign-list/campaign-list.module';
import { CampaignEditModule } from './campaign/campaign-edit/campaign-edit.module';
import { CampaignViewModule } from './campaign/campaign-view/campaign-view.module';

import { StoreListModule } from './merchant/store/store-list/store-list.module';
import { StoreViewModule } from './merchant/store/store-view/store-view.module';
import { StoreGroupListModule } from './merchant/store-group/store-group-list/store-group-list.module';
import { StoreGroupViewModule } from './merchant/store-group/store-group-view/store-group-view.module';
import { ProductListModule } from './merchant/product/product-list/product-list.module';
import { ProductViewModule } from './merchant/product/product-view/product-view.module';
import { CollectionListModule } from './merchant/product-collection/collection-list/collection-list.module';
import { CollectionViewModule } from './merchant/product-collection/collection-view/collection-view.module';
import { ConsumerGroupListModule } from './merchant/consumer-group/consumer-group-list/consumer-group-list.module';
import { ConsumerGroupViewModule } from './merchant/consumer-group/consumer-group-view/consumer-group-view.module';
import { ConsumerViewModule } from './merchant/consumer/consumer-view/consumer-view.module';
import { InfluencerMerchantViewModule } from './merchant/influencer/influencer-view/influencer-view.module';
import { PartnershipViewModule as PartnershipGuestViewModule } from './merchant/partnership/partnership-guest-view/partnership-view.module';
import { PartnershipListModule } from './merchant/partnership/partnership-list/partnership-list.module';
import { PartnershipViewModule as PartnershipHostViewModule } from './merchant/partnership/partnership-host-view/partnership-view.module';
import { ReceiptSearchModule } from './receipt/receipt-search/receipt-search.module';

import { PageModule as InfluencerPageModule } from './influencer/page/page.module';
import { PageModule as MerchantPageModule } from './merchant/page/page.module';

import { PixKeyListModule } from './payment/pix-key/pix-key-list/pix-key-list.module';
import { PixKeyViewModule } from './payment/pix-key/pix-key-view/pix-key-view.module';
import { CreditCardListModule } from './payment/credit-card/credit-card-list/credit-card-list.module';
import { CreditCardViewModule } from './payment/credit-card/credit-card-view/credit-card-view.module';
import { TransactionListModule } from './payment/transaction/transaction-list/transaction-list.module';
import { TransactionViewModule } from './payment/transaction/transaction-view/transaction-view.module';
import { ReceiptViewModule } from './receipt/receipt-view/receipt-view.module';
import { ReceiptListModule } from './receipt/receipt-list/receipt-list.module';
import { MerchantKeyApiListModule } from './merchant/api-keys/api-keys-list/api-keys-list.module';

import { CouponListModule } from './coupon/coupon-list/coupon-list.module';
import { CouponViewModule } from './coupon/coupon-view/coupon-view.module';

import { AuthInterceptor } from './utils/interceptors/auth-interceptor';

registerLocaleData(ptBr);

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular modules
    BrowserModule,
    RouterModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,

    // Custom modules
    AppRoutingModule,
    LayoutModule,

    MerchantDashboardModule,
    InfluencerDashboardModule,

    LoginModule,
    RegisterModule,
    ForgotPasswordModule,

    AccountModule,
    PixKeyListModule,
    PixKeyViewModule,
    CreditCardListModule,
    CreditCardViewModule,
    TransactionListModule,
    TransactionViewModule,
    ReceiptViewModule,
    ReceiptListModule,
    CouponListModule,
    CouponViewModule,
    WalletModule,
    AutoReloadCampaignCreditModule,
    RedCreditListModule,
    RedComissionListModule,
    CampaignListModule,
    CampaignEditModule,
    CampaignViewModule,

    MerchantModule,
    StoreListModule,
    StoreViewModule,
    StoreGroupListModule,
    StoreGroupViewModule,
    ProductListModule,
    ProductViewModule,
    CollectionListModule,
    CollectionViewModule,
    ConsumerGroupListModule,
    ConsumerGroupViewModule,
    ConsumerViewModule,
    InfluencerMerchantViewModule,
    PartnershipGuestViewModule,
    PartnershipHostViewModule,
    PartnershipListModule,

    InfluencerModule,
    InfluencerPageModule,
    MerchantPageModule,

    ReceiptSearchModule,
    MerchantKeyApiListModule,
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideNgxMask(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
