import { Component, OnInit } from '@angular/core';
import { CreditCardService as ComponentService } from '../../services/credit-card.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { CreditCard as ComponentEntity } from '../../entities/credit-card.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { toastMessage } from 'src/app/shared/utils/toast';
import { credit_card_list_messages } from '../utils/credit-card-list-response-msg';

const component_list_toasts = credit_card_list_messages();

@Component({
  selector: 'app-credit-card-list',
  templateUrl: '../views/credit-card-list.component.html',
})
export class CreditCardListComponent implements OnInit {
  components: ComponentEntity[] = [];
  index: number = 0;
  itemsFiltrados: ComponentEntity[] = [];
  globalFilter: string = '';
  isLoading: boolean = false;
  codeTypeMap: { [key: string]: string } = {
    CPF: 'CPF',
    CNPJ: 'CNPJ',
    EMAIL: 'Email',
    CELLCELLPHONE: 'Celular',
  };

  constructor(
    private messageService: MessageService,
    private componentService: ComponentService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.fetchComponent();
  }

  fetchComponent(): void {
    this.isLoading = true;
    this.componentService.list().subscribe({
      next: (response: HttpResponse<ListResponse<ComponentEntity>>) => {
        this.components = response.body?.results || [];
        this.itemsFiltrados = this.components;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  deleteComponent(rowPosition: number, event: Event): void {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja remover este item?',
      header: 'Confirmação de Remoção',
      icon: 'pi pi-trash',
      acceptLabel: 'Sim', // substitua por seu texto
      rejectLabel: 'Não',
      accept: () => {
        this.isLoading = true;
        const row = this.itemsFiltrados[rowPosition];
        const componentId = String(row?.id) || '';
        this.componentService.delete(componentId).subscribe({
          next: (response: HttpResponse<ComponentEntity>) => {
            const index = this.components.findIndex(
              (item) => String(item.id) === componentId
            );
            if (index !== -1) {
              this.components.splice(index, 1);
            }
            this.applyFilter();
            toastMessage(
              this.messageService,
              component_list_toasts[response.status]
            );
            this.isLoading = false;
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(
              this.messageService,
              component_list_toasts[error.status]
            );
            this.isLoading = false;
          },
        });
      },
      reject: () => {
      },
    });
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  applyFilter(): void {
    this.itemsFiltrados = this.components.filter((itens) =>
      itens.last_four_digits
        ?.toLowerCase()
        .includes(this.globalFilter.toLowerCase())
    );

    this.itemsFiltrados.sort((a, b) => {
      const nameA = a.last_four_digits?.toLowerCase() || '';
      const nameB = b.last_four_digits?.toLowerCase() || '';

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  formatDocument(document: string): string {
    if (document.length === 11) {
      // Format as CPF (###.###.###-##)
      return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (document.length === 14) {
      // Format as CNPJ (##.###.###/####-##)
      return document.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    } else {
      // Return the document as is if it's not 11 or 14 characters long
      return document;
    }
  }

  formatCodeType(codeType: string): string {
    return this.codeTypeMap[codeType] || '';
  }

  formatCode(code: string, codeType: string): string {
    if (codeType === 'CPF') {
      // Format as CPF (###.###.###-##)
      return code.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (codeType === 'CNPJ') {
      // Format as CNPJ (##.###.###/####-##)
      return code.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    } else if (codeType === 'CELLCELLPHONE') {
      // Format as cellphone (##) #####-####
      return code.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (codeType === 'EMAIL') {
      //if email bigger than 70 characters, show only the first 70 characters and ...
      if (code.length > 70) {
        return code.substring(0, 70) + '...';
      } else {
        return code;
      }
    } else {
      // Return the code as is if it's not CPF or CNPJ
      return code;
    }
  }
}
