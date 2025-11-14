import { Component, OnInit } from '@angular/core';
import { ConsumerGroupService as ComponentService } from '../../services/consumer-group.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { ConsumerGroup as ComponentEntity } from '../../entities/consumer-group.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { toastMessage } from 'src/app/shared/utils/toast';
import { consumer_group_list_messages } from '../utils/consumer-group-list-response-msg';

const component_list_toasts = consumer_group_list_messages();

@Component({
  selector: 'app-consumer-group-list',
  templateUrl: '../views/consumer-group-list.component.html',
})
export class ConsumerGroupListComponent implements OnInit {
  entitys: ComponentEntity[] = [];
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
        this.entitys = response.body?.results || [];
        this.itemsFiltrados = this.entitys;
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
            const index = this.entitys.findIndex(
              (item) => String(item.id) === componentId
            );
            if (index !== -1) {
              this.entitys.splice(index, 1);
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
        console.log('Rejeitado');
      },
    });
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  applyFilter(): void {
    this.itemsFiltrados = this.entitys.filter((itens) =>
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
    let stores = '';
    for (const store of storeGroups.stores) {
      if ((stores + store.name).length > 90) break;
      stores += store.name + ', ';
    }
    return stores.slice(0, -2) + '...'; // Remove the last comma and space, and add '...'
  }
}
