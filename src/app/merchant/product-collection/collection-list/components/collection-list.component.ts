import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Collection } from '../../entities/collection.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { toastMessage } from 'src/app/shared/utils/toast';
import { collection_list_messages } from '../utils/collection-list-response-msg';

const component_list_toasts = collection_list_messages();

@Component({
  selector: 'app-collection-list',
  templateUrl: '../views/collection-list.component.html',
})
export class CollectionListComponent implements OnInit {
  collections: Collection[] = [];
  index: number = 0;
  itemsFiltrados: Collection[] = [];
  globalFilter: string = '';
  isLoading: boolean = false;

  constructor(
    private messageService: MessageService,
    private collectionService: CollectionService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.fetchComponent();
  }

  fetchComponent(): void {
    this.isLoading = true;
    this.collectionService.list().subscribe({
      next: (response: HttpResponse<ListResponse<Collection>>) => {
        this.collections = response.body?.results || [];
        this.itemsFiltrados = this.collections;
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
        const row = this.itemsFiltrados[rowPosition];
        const componentId = String(row?.id) || '';
        this.isLoading = true;
        this.collectionService.delete(componentId).subscribe({
          next: (response: HttpResponse<Collection>) => {
            const index = this.collections.findIndex(
              (item) => String(item.id) === componentId
            );
            if (index !== -1) {
              this.collections.splice(index, 1);
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
    this.itemsFiltrados = this.collections.filter((itens) =>
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

  getProductsString(collections: any): string {
    if (!collections?.products || !Array.isArray(collections.products)) {
      return 'Não há produtos cadastrados';
    }

    let collection = '';
    for (const product of collections.products) {
      if ((collection + product.name).length > 90) break;
      collection += product.name + ', ';
    }
    return collection.slice(0, -2) + '...'; // Remove the last comma and space, and add '...'
  }
}
