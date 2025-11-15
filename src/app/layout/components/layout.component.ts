import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/entities/user.entity';
import { ChangeDetectorRef } from '@angular/core';
import { LoginService } from 'src/app/auth/login/services/login.service';
interface TipeAccount {
  label: string;
  value: string;
}

@Component({
  selector: 'app-layout',
  templateUrl: '../views/layout.component.html', // adjust the path as needed
})
export class LayoutComponent implements OnInit {
  visibleSidebar = true;
  itemsSidebar: MenuItem[] = [];
  selectedItemSideBar: string;
  mode: string = 'merchant';

  new_account_type: boolean = false;
  semi_new: boolean = false;

  accountTypes: TipeAccount[] = [
    { label: 'Comerciante', value: 'merchant' },
    { label: 'Influenciador', value: 'influencer' },
    // { label: 'Consumidor', value: 'Consumer' },
    // { label: 'Gerente', value: 'Manager' },
  ];
  accountTypesClean: TipeAccount[] | undefined;
  accountTypeFormGroup: FormGroup;

  user?: User;
  user_plan: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private loginService: LoginService
  ) {
    this.accountTypeFormGroup = new FormGroup({
      accountType: new FormControl<TipeAccount>({
        label: 'Comerciante',
        value: 'merchant',
      }),
    });
    this.selectedItemSideBar = this.router.url;
    this.accountTypeFormGroup.updateValueAndValidity();
  }

  ngOnInit() {
    // Add delay to ensure proper initialization after login
    setTimeout(() => {
      // Set initial value based on localStorage
      const storedType = localStorage.getItem('type') || 'merchant';
      this.mode = storedType;

      // Initialize accountTypesClean based on stored type
      this.accountTypesClean = this.accountTypes.filter(
        (type) =>
          type.value === storedType ||
          (storedType === 'merchant' && type.value === 'influencer') ||
          (storedType === 'influencer' && type.value === 'merchant')
      );

      this.accountTypeFormGroup.controls['accountType'].setValue({
        label: storedType === 'merchant' ? 'Comerciante' : 'Influenciador',
        value: storedType,
      });
      this.accountTypeFormGroup.updateValueAndValidity();

      if (localStorage.getItem('accessToken')) {
        this.userService.get().subscribe({
          next: (response) => {
            this.user = response;
            if (this.user?.is_premium) {
              this.user_plan = 'Conta Premium';
            }

            // Update accountTypesClean based on user document
            if (this.user.document.length === 14) {
              this.accountTypesClean = this.accountTypes.filter(
                (type) => type.value !== 'consumer'
              );
            } else if (this.user.document.length === 11) {
              this.accountTypesClean = this.accountTypes.filter(
                (type) => type.value !== 'merchant'
              );
            }

            if (
              this.user.merchant !== null &&
              this.user.account_type === 'merchant'
            ) {
              this.mode = 'merchant';
              localStorage.setItem('type', 'merchant');
              this.itemsSidebar = this.initializeMerchantItemsSidebar();
              this.accountTypeFormGroup.controls['accountType'].setValue({
                label: 'Comerciante',
                value: 'merchant',
              });
            } else if (
              this.user.influencer !== null &&
              this.user.account_type === 'influencer'
            ) {
              this.mode = 'influencer';
              localStorage.setItem('type', 'influencer');
              this.itemsSidebar = this.initializeInfluencerItemsSidebar();
              this.accountTypeFormGroup.controls['accountType'].setValue({
                label: 'Influenciador',
                value: 'influencer',
              });
            } else if (
              this.user.merchant === null &&
              this.user.account_type === 'merchant'
            ) {
              this.new_account_type = true;
              this.router.navigate(['/merchant/profile'], {
                queryParams: { new: 'true' },
              });

              this.mode = 'merchant';
              localStorage.setItem('type', 'merchant');
              this.itemsSidebar = this.initializeMerchantItemsSidebar();
              if (this.user.influencer !== null) {
                this.router.navigate(['/merchant/profile'], {
                  queryParams: { semi_new: 'true' },
                });
                this.semi_new = true;
              } else {
                this.router.navigate(['/merchant/profile'], {
                  queryParams: { new: 'true' },
                });
              }
            } else if (
              this.user.influencer === null &&
              this.user.account_type === 'influencer'
            ) {
              this.mode = 'influencer';
              localStorage.setItem('type', 'influencer');
              this.new_account_type = true;
              this.itemsSidebar = this.initializeInfluencerItemsSidebar();
              if (this.user.merchant !== null) {
                this.router.navigate(['/influencer/profile'], {
                  queryParams: { semi_new: 'true' },
                });
                this.semi_new = true;
              } else {
                this.router.navigate(['/influencer/profile'], {
                  queryParams: { new: 'true' },
                });
              }
            } else if (this.user.merchant === null) {
              this.new_account_type = true;
              this.router.navigate(['/merchant/profile'], {
                queryParams: { semi_new: 'true' },
              });
              this.itemsSidebar = this.initializeMerchantItemsSidebar();
              this.mode = 'merchant';
              localStorage.setItem('type', 'merchant');
              this.semi_new = true;
              this.itemsSidebar = this.initializeMerchantItemsSidebar();
            } else if (this.user.influencer === null) {
              this.mode = 'influencer';
              localStorage.setItem('type', 'influencer');
              this.new_account_type = true;
              this.router.navigate(['/influencer/profile'], {
                queryParams: { semi_new: 'true' },
              });
              this.semi_new = true;
              this.itemsSidebar = this.initializeInfluencerItemsSidebar();
            }

            if (this.user.document.length === 14) {
              this.accountTypesClean = this.accountTypes.filter(
                (type) => type.value !== 'consumer'
              );
              const account_type = this.accountTypesClean.filter(
                (type) => type.value === this.mode.toLowerCase()
              );
              this.accountTypeFormGroup.controls['accountType'].setValue(
                account_type[0]
              );
            } else if (this.user.document.length === 11) {
              this.accountTypesClean = this.accountTypes.filter(
                (type) => type.value !== 'merchant'
              );
              const account_type = this.accountTypesClean.filter(
                (type) => type.value === this.mode.toLowerCase()
              );
              this.accountTypeFormGroup.controls['accountType'].setValue(
                account_type[0]
              );
            }
          },
          error: (error) => {
            if (error.status === 406) {
            }
          },
        });
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.selectedItemSideBar = event.urlAfterRedirects;
          }
        });
      }

      // check if route have influencer or merchant
      // how to get route
      const url = this.router.url.split('?')[0]; // Remove query parameters
      const route = url.split('/').slice(1);
      if (localStorage.getItem('type') === 'merchant') {
        this.itemsSidebar = this.initializeMerchantItemsSidebar();
        this.mode = localStorage.getItem('type') || 'merchant';
        setTimeout(() => {
          this.accountTypeFormGroup.controls['accountType'].setValue({
            label: 'Comerciante',
            value: 'merchant',
          });
        });
      } else if (localStorage.getItem('type') === 'influencer') {
        setTimeout(() => {
          this.itemsSidebar = this.initializeInfluencerItemsSidebar();
          this.mode = localStorage.getItem('type') || 'influencer';
          this.accountTypeFormGroup.controls['accountType'].setValue({
            label: 'Influenciador',
            value: 'influencer',
          });
          this.cd.detectChanges();
        });
      }
    }, 500); // 500ms delay
  }

  isSelected(route: string) {
    this.itemsSidebar.forEach((item) => {
      if (item.routerLink === route) {
        item.styleClass = 'selected';
      } else {
        item.styleClass = '';
      }
    });
    this.selectedItemSideBar = route;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('type');
    this.router.navigate(['login']);
  }

  logoutForgetDevice() {
    this.loginService.logoutForgetDevice().subscribe({
      next: () => {
        alert('Atenção: No próximo login será necessário verificação por SMS');
        this.logout();
      },
      error: (error) => {
        console.error('Erro ao esquecer dispositivo:', error);
      },
    });
  }

  show(event: any, overlaypanel: OverlayPanel) {
    overlaypanel.toggle(event);
  }

  select_user_type(event: any) {
    this.router.navigate([`/${event.value.value}/home`]);
    if (event.value.value === 'merchant') {
      this.itemsSidebar = this.initializeMerchantItemsSidebar();
      this.mode = 'merchant';
      localStorage.setItem('type', 'merchant');
      if (this.user?.merchant === null) {
        this.new_account_type = true;
        this.router.navigate(['/merchant/profile'], {
          queryParams: { semi_new: 'true' },
        });
        this.semi_new = true;
      } else {
        this.semi_new = false;
        this.new_account_type = false;
      }
    } else if (event.value.value === 'influencer') {
      this.itemsSidebar = this.initializeInfluencerItemsSidebar();
      this.mode = 'influencer';
      localStorage.setItem('type', 'influencer');
      if (this.user?.influencer === null) {
        this.new_account_type = true;
        this.router.navigate(['/influencer/profile'], {
          queryParams: { semi_new: 'true' },
        });
        this.semi_new = true;
      } else {
        this.semi_new = false;
        this.new_account_type = false;
      }
    }
  }

  initializeMerchantItemsSidebar() {
    return (this.itemsSidebar = [
      {
        label: 'Dashboard',
        //icon: 'pi pi-fw pi-plus',
        routerLink: '/merchant/dashboard',
        styleClass: '',
        command: () => {
          this.isSelected('/merchant/dashboard');
        },
      },
      {
        label: 'Campanhas',
        routerLink: '/campaign-list',
        styleClass: '',
        command: () => {
          this.isSelected('/campaign-list');
        },
      },
      {
        separator: true,
      },
      {
        label: 'Perfil',
        routerLink: '/merchant/profile',
        styleClass: '',
        command: () => {
          this.isSelected('/merchant/profile');
        },
      },
      {
        label: 'Carteira',
        routerLink: '/wallet',
        styleClass: '',
        command: () => {
          this.isSelected('/wallet');
        },
        items: [
          {
            label: 'Carteira',
            routerLink: '/wallet',
            styleClass: '',
            command: () => {
              this.isSelected('/wallet');
            },
          },
          {
            label: 'Recarga Créditos',
            routerLink: '/merchant/auto-reload-campaign-credit',
            styleClass: '',
            command: () => {
              this.isSelected('/wallet');
            },
          },
        ],
      },
      {
        separator: true,
      },
      {
        label: 'Lojas',
        routerLink: '/merchant/store-list',
        styleClass: '',
        command: () => {
          this.isSelected('/merchant/store-list');
        },
        items: [
          {
            label: 'Lojas',
            routerLink: '/merchant/store-list',
            styleClass: '',
            command: () => {
              this.isSelected('/merchant/store-list');
            },
          },
          {
            label: 'Grupos de Lojas',
            routerLink: '/merchant/store-group-list',
            styleClass: '',
            command: () => {
              this.isSelected('/merchant/store-list');
            },
          },
        ],
      },
      {
        label: 'Produtos',
        routerLink: '/merchant/product-list',
        styleClass: '',
        command: () => {
          this.isSelected('/merchant/product-list');
        },
        items: [
          {
            label: 'Produtos',
            routerLink: '/merchant/product-list',
            styleClass: '',
            command: () => {
              this.isSelected('/merchant/product-list');
            },
          },
          {
            label: 'Coleções',
            routerLink: '/merchant/collection-list',
            styleClass: '',
            command: () => {
              this.isSelected('/merchant/product-list');
            },
          },
        ],
      },

      {
        separator: true,
      },

      {
        label: 'Consumidores',
        routerLink: '/merchant/consumer-view',
        styleClass: '',
        command: () => {
          this.isSelected('/merchant/consumer-view');
        },
        items: [
          {
            label: 'Consumidores',
            routerLink: '/merchant/consumer-view',
            command: () => {
              this.isSelected('/merchant/consumer-view');
            },
          },
          {
            label: 'Grupo Consumidores',
            routerLink: '/merchant/consumer-group-list',
            command: () => {
              this.isSelected('/merchant/consumer-view');
            },
          },
        ],
      },
      {
        label: 'Influenciadores',
        routerLink: '/merchant/influencer-view',
        command: () => {
          this.isSelected('/merchant/influencer-view');
        },
      },
      {
        label: 'Parceiros',
        routerLink: '/merchant/partnership-list',
        command: () => {
          this.isSelected('/merchant/partnership-list');
        },
      },

      {
        separator: true,
      },

      // {
      //   label: 'Gerentes',
      //   routerLink: '/merchant/managers',
      //   command: () => {
      //     this.isSelected('/merchant/managers');
      //   },
      // },
      {
        label: 'Relatórios',
        routerLink: '/reports/receipt-list',
        styleClass: '',
        command: () => {
          this.isSelected('/reports/receipt-list');
        },
        items: [
          {
            label: 'Notas Fiscais',
            routerLink: '/reports/receipt-list',
            command: () => {
              this.isSelected('/reports/receipt-list');
            },
          },
          {
            label: 'Cupons',
            routerLink: '/reports/coupon-list',
            command: () => {
              this.isSelected('/reports/receipt-list');
            },
          },
          {
            label: 'Transações',
            routerLink: '/reports/transaction-list',
            command: () => {
              this.isSelected('/reports/receipt-list');
            },
          },
        ],
      },
    ]);
  }

  initializeInfluencerItemsSidebar() {
    return (this.itemsSidebar = [
      {
        label: 'Dashboard',
        //icon: 'pi pi-fw pi-plus',
        routerLink: '/influencer/dashboard',
        styleClass: '',
        command: () => {
          this.isSelected('/influencer/dashboard');
        },
      },
      {
        label: 'Campanhas',
        routerLink: '/campaign-list',
        styleClass: '',
        command: () => {
          this.isSelected('/campaign-list');
        },
      },
      {
        separator: true,
      },
      {
        label: 'Perfil',
        routerLink: '/influencer/profile',
        styleClass: '',
        command: () => {
          this.isSelected('/influencer/profile');
        },
      },
      {
        label: 'Carteira',
        routerLink: '/wallet',
        styleClass: '',
        command: () => {
          this.isSelected('/wallet');
        },
        items: [
          {
            label: 'Carteira',
            routerLink: '/wallet',
            command: () => {
              this.isSelected('/wallet');
            },
          },
          {
            label: 'C. Provisionados',
            routerLink: '/wallet/red-comission-list',
            command: () => {
              this.isSelected('/wallet');
            },
          },
        ],
      },

      {
        separator: true,
      },

      {
        label: 'Relatórios',
        routerLink: '/reports/receipt-list',
        styleClass: '',
        command: () => {
          this.isSelected('/reports/receipt-list');
        },
        items: [
          {
            label: 'Notas Fiscais',
            routerLink: '/reports/receipt-list',
            command: () => {
              this.isSelected('/reports/receipt-list');
            },
          },

          {
            label: 'Transações',
            routerLink: '/reports/transaction-list',
            command: () => {
              this.isSelected('/reports/receipt-list');
            },
          },
        ],
      },
    ]);
  }
}
