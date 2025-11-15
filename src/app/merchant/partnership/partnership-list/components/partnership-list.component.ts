// Angular
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

// Third Party
import { ConfirmationService, MessageService } from 'primeng/api';

// Services
import { MerchantPartnershipService } from '../../services/partnership.service';
import { ProfileService as MerchantService } from 'src/app/merchant/profile/services/profile.service';

// Entities
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Partnership } from '../../entities/partnership.entity';
import { User } from 'src/app/shared/entities/user.entity';
import { UserService } from 'src/app/shared/services/user.service';

// Utils
import { toastMessage } from 'src/app/shared/utils/toast';
import { partnership_list_messages } from '../utils/partnership-list-response-msg';
import { cpfCnpjValidator } from 'src/app/shared/utils/cpfCnpjValidator';
import { Router } from '@angular/router';
const component_toasts = partnership_list_messages();

@Component({
  selector: 'app-partnership-list',
  templateUrl: '../views/partnership-list.component.html',
})
export class PartnershipListComponent implements OnInit {
  merchantNameInvited: string = '';
  globalFilter: string = '';

  partnerships_guests: Partnership[] = [];
  itemsFiltradosPartnerships_guests: Partnership[] = [];
  globalFilterPartnerships_guests: string = '';

  partnerships_host: Partnership[] = [];
  itemsFiltradosPartnerships_host: Partnership[] = [];
  globalFilterPartnerships_host: string = '';

  isFavorited = false;
  userIsPremium = false;

  invite_merchant = false;

  documentForm: FormGroup;
  emailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private merchantPartnershipService: MerchantPartnershipService,
    private userService: UserService,
    private merchantService: MerchantService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.documentForm = this.formBuilder.group({});
    this.emailForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializedocumentForm();
    this.initializeEmailForm();
    this.fetchComponent();
    this.checkIsPremium();
  }

  fetchComponent(): void {
    this.getMerchantPartnershipsGuests();
    this.getMerchantPartnershipsHost();
  }

  private initializedocumentForm() {
    this.documentForm = this.formBuilder.group({
      document: new FormControl('', [Validators.required, cpfCnpjValidator]),
    });
  }

  private initializeEmailForm() {
    this.emailForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  checkIsPremium() {
    this.userService.get().subscribe((user) => {
      this.userIsPremium = user.is_premium;
    });
  }

  clearGlobalFilterHosts() {
    this.globalFilterPartnerships_host = '';
    this.applyFilterPartnershipsHost();
  }

  getMerchantPartnershipsHost() {
    this.merchantPartnershipService.list_hosts().subscribe({
      next: (response: HttpResponse<Partnership[]>) => {
        this.partnerships_host = response.body || [];
        this.itemsFiltradosPartnerships_host = this.partnerships_host;
        this.applyFilterPartnershipsHost();
      },
      error: (error: HttpErrorResponse) => {
      },
    });
  }

  applyFilterPartnershipsHost(): void {
    // This method filters the partnerships array based on search text
    // It checks if either the merchant name or city contains the search text (case insensitive)
    // The filtered results are stored in itemsFiltradosPartnerships
    this.itemsFiltradosPartnerships_host = this.partnerships_host.filter(
      (partnership) =>
        partnership.merchant_host?.name
          ?.toLowerCase()
          .includes(this.globalFilterPartnerships_host.toLowerCase())
    );
  }

  deletePartnershipHost(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja EXCLUIR esta parceria?',
      accept: () => {
        const row = this.itemsFiltradosPartnerships_host[rowPosition];
        const componentId = String(row?.id) || '';
        this.merchantPartnershipService.delete(componentId).subscribe({
          next: (response: HttpResponse<void>) => {
            const index = this.partnerships_host.findIndex(
              (item) => String(item.id) === componentId
            );
            if (index !== -1) {
              this.partnerships_host.splice(index, 1);
            }
            this.applyFilterPartnershipsHost();
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });
      },
      reject: () => {
      },
    });
  }

  clearGlobalFilterGuests() {
    this.globalFilterPartnerships_guests = '';
    this.applyFilterPartnershipsGuests();
  }

  getMerchantPartnershipsGuests() {
    this.merchantPartnershipService.list_guests().subscribe({
      next: (response: HttpResponse<Partnership[]>) => {
        this.partnerships_guests = response.body || [];
        this.itemsFiltradosPartnerships_guests = this.partnerships_guests;
        this.applyFilterPartnershipsGuests();
      },
      error: (error: HttpErrorResponse) => {
      },
    });
  }

  applyFilterPartnershipsGuests(): void {
    // This method filters the partnerships array based on search text
    // It checks if either the merchant name or city contains the search text (case insensitive)
    // The filtered results are stored in itemsFiltradosPartnerships
    this.itemsFiltradosPartnerships_guests = this.partnerships_guests.filter(
      (partnership) =>
        partnership.merchant_guest?.name
          ?.toLowerCase()
          .includes(this.globalFilterPartnerships_guests.toLowerCase())
    );
  }

  deletePartnershipGuests(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja EXCLUIR esta parceria?',
      accept: () => {
        const row = this.itemsFiltradosPartnerships_guests[rowPosition];
        const componentId = String(row?.id) || '';
        this.merchantPartnershipService.delete(componentId).subscribe({
          next: (response: HttpResponse<void>) => {
            const index = this.partnerships_guests.findIndex(
              (item) => String(item.id) === componentId
            );
            if (index !== -1) {
              this.partnerships_guests.splice(index, 1);
            }
            this.applyFilterPartnershipsGuests();
            toastMessage(
              this.messageService,
              component_toasts[response.status]
            );
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, component_toasts[error.status]);
          },
        });
      },
      reject: () => {
      },
    });
  }

  sendMerchantInviteCnpj() {
    const payload = {
      document: this.documentForm.get('document')?.value.replace(/\D/g, ''),
    };
    this.merchantPartnershipService.create(payload).subscribe({
      next: (response: HttpResponse<Partnership>) => {
        toastMessage(this.messageService, component_toasts[response.status]);
        this.documentForm.get('document')?.setValue('');
        this.invite_merchant = false;
        // Refresh partnerships list after adding new one
        this.merchantPartnershipService.list_guests().subscribe({
          next: (response: HttpResponse<Partnership[]>) => {
            this.partnerships_guests = response.body || [];
            this.applyFilterPartnershipsGuests();
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  acceptPartnership(partnership: Partnership) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja ACEITAR esta parceria?',
      accept: () => {
        const payload = {
          status: 'active',
        };
        this.merchantPartnershipService
          .partial_update(payload, String(partnership.id))
          .subscribe({
            next: (response: HttpResponse<Partnership>) => {
              toastMessage(
                this.messageService,
                component_toasts[response.status]
              );
              this.merchantPartnershipService.list_guests().subscribe({
                next: (response: HttpResponse<Partnership[]>) => {
                  this.partnerships_guests = response.body || [];
                  this.applyFilterPartnershipsGuests();
                },
                error: (error: HttpErrorResponse) => {
                  console.error('Error fetching partnerships:', error);
                },
              });
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error updating partnership:', error);
            },
          });
      },
      reject: () => {
      },
    });
  }

  viewPartnershipGuest(partnership: Partnership) {
    this.router.navigate([`/merchant/partnership-view/${partnership.id}`]);
  }

  sendMerchantInviteEmail() {
    const payload = {
      email: this.emailForm.get('email')?.value,
      document: this.documentForm.get('document')?.value,
    };
    this.merchantService.inviteMerchantByEmail(payload).subscribe({
      next: (response: HttpResponse<string>) => {
        toastMessage(this.messageService, component_toasts[response.status]);
        this.emailForm.get('email')?.setValue('');
        this.invite_merchant = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  viewPartnershipHost(partnership: Partnership) {
    this.router.navigate([`/merchant/partnership-host-view/${partnership.id}`]);
  }
}
