import { Component, OnInit } from '@angular/core';
import { StoreGroupService as ComponentService } from '../../services/store-group.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { StoreGroup as ComponentEntity } from '../../entities/store-group.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { toastMessage } from 'src/app/shared/utils/toast';
import { store_group_list_messages } from '../utils/store-group-list-response-msg';

const component_list_toasts = store_group_list_messages();

@Component({
  selector: 'app-store-group-list',
  templateUrl: '../views/store-group-list.component.html',
})
export class StoreGroupListComponent implements OnInit {
  storeGroups: ComponentEntity[] = [];
  index: number = 0;
  itemsFiltrados: ComponentEntity[] = [];
  globalFilter: string = '';
  isLoading: boolean = false;

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
        //toastMessage(this.messageService, store_list_toasts[response.status]);
        this.storeGroups = response.body?.results || [];
        this.itemsFiltrados = this.storeGroups;
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
            const index = this.storeGroups.findIndex(
              (item) => String(item.id) === componentId
            );
            if (index !== -1) {
              this.storeGroups.splice(index, 1);
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
    this.itemsFiltrados = this.storeGroups.filter((itens) =>
      itens.name?.toLowerCase().includes(this.globalFilter.toLowerCase())
    );

    this.itemsFiltrados.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || '';
      const nameB = b.name?.toLowerCase() || '';

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  getStoresString(storeGroups: any): string {
    if (!storeGroups.stores) return 'Não há lojas cadastradas';
    let stores = '';
    for (const store of storeGroups.stores) {
      if ((stores + store.name).length > 90) break;
      stores += store.name + ', ';
    }
    return stores.slice(0, -2) + '...'; // Remove the last comma and space, and add '...'
  }
}
