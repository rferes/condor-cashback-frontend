// Angular
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';

// Third Party
import { ConfirmationService, MessageService } from 'primeng/api';

// Services
import { MerchantApiKeysService } from '../../services/api-keys.service';
import { UserService } from 'src/app/shared/services/user.service';

// Entities
import { MerchantApiKey } from '../../entities/api-keys.entity';
import { User } from 'src/app/shared/entities/user.entity';

// Utils
import { toastMessage } from 'src/app/shared/utils/toast';
import { api_keys_list_messages } from '../utils/api-keys-list-response-msg';

const component_toasts = api_keys_list_messages();

@Component({
  selector: 'app-merchant-api-keys-list',
  templateUrl: '../views/api-keys-list.component.html',
})
export class MerchantApiKeysListComponent implements OnInit {
  apiKeys: MerchantApiKey[] = [];
  filteredApiKeys: MerchantApiKey[] = [];
  globalFilterApiKeys: string = '';

  userIsPremium = false;
  showCreateForm = false;
  showGenerateNewApiKey = false;
  apiKeyForm: FormGroup;
  generatedKeys: {
    publicKey: string;
    privateKey: string;
    id: string;
  } | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private apiKeysService: MerchantApiKeysService,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) {
    this.apiKeyForm = this.formBuilder.group({});
  }

  ngOnInit() {
    this.initializeApiKeyForm();
    this.fetchComponent();
    this.checkIsPremium();
  }

  fetchComponent(): void {
    this.getApiKeys();
  }

  private initializeApiKeyForm() {
    this.apiKeyForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      expirationDays: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(365),
      ]),
    });
  }

  checkIsPremium() {
    this.userService.get().subscribe((user) => {
      this.userIsPremium = user.is_premium;
    });
  }

  clearGlobalFilter() {
    this.globalFilterApiKeys = '';
    this.applyFilterApiKeys();
  }

  getApiKeys() {
    this.apiKeysService.list().subscribe({
      next: (response: HttpResponse<ListResponse<MerchantApiKey>>) => {
        this.apiKeys = response.body?.results || [];
        this.filteredApiKeys = this.apiKeys;
        this.applyFilterApiKeys();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  applyFilterApiKeys(): void {
    this.filteredApiKeys = this.apiKeys.filter(
      (apiKey) =>
        apiKey.name
          ?.toLowerCase()
          .includes(this.globalFilterApiKeys.toLowerCase()) ||
        apiKey.description
          ?.toLowerCase()
          .includes(this.globalFilterApiKeys.toLowerCase())
    );
  }

  deleteApiKey(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja EXCLUIR esta chave de API?',
      accept: () => {
        const row = this.filteredApiKeys[rowPosition];
        const keyId = String(row?.id) || '';
        this.apiKeysService.delete(keyId).subscribe({
          next: (response: HttpResponse<void>) => {
            const index = this.apiKeys.findIndex(
              (item) => String(item.id) === keyId
            );
            if (index !== -1) {
              this.apiKeys.splice(index, 1);
            }
            this.applyFilterApiKeys();
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
        console.log('Rejeitado');
      },
    });
  }

  createApiKey() {
    const payload = {
      name: this.apiKeyForm.get('name')?.value,
      description: this.apiKeyForm.get('description')?.value,
      expiration_days: this.apiKeyForm.get('expirationDays')?.value,
    };
    this.apiKeysService.create(payload).subscribe({
      next: (response: HttpResponse<MerchantApiKey>) => {
        this.generatedKeys = {
          publicKey: response.body?.public_key || '',
          privateKey: response.body?.private_key || '',
          id: response.body?.id || '',
        };
        toastMessage(this.messageService, component_toasts[response.status]);
        this.showGenerateNewApiKey = true;
        this.getApiKeys();
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  generateNewApiKey() {
    this.showCreateForm = true;
  }

  copyApiKey(key: string): void {
    navigator.clipboard.writeText(key).then(() => {
      toastMessage(this.messageService, {
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Chave copiada com sucesso!',
        life: 3000,
      });
    });
  }

  toggleApiKeyStatus(apiKey: MerchantApiKey): void {
    const keyId = String(apiKey.id);
    this.apiKeysService.toggleStatus(keyId).subscribe({
      next: (response: HttpResponse<void>) => {
        toastMessage(this.messageService, component_toasts[response.status]);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
      },
    });
  }

  closeCreateForm() {
    this.showCreateForm = false;
    this.generatedKeys = null;
    this.apiKeyForm.reset();
    this.showGenerateNewApiKey = false;
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Chave copiada para a área de transferência',
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível copiar a chave. Tente copiar manualmente.',
      });
    }
  }
}
