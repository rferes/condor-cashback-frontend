import { Component, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Store } from '../../entities/store.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { toastMessage } from 'src/app/shared/utils/toast';
import { store_list_messages } from '../utils/store-list-response-msg';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

const component_list_toasts = store_list_messages();

@Component({
  selector: 'app-store-list',
  templateUrl: '../views/store-list.component.html',
})
export class StoreListComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: FileUpload;
  stores: Store[] = [];
  index: number = 0;
  itemsFiltrados: Store[] = [];
  globalFilter: string = '';
  isLoading: boolean = false;
  multipleStoresView: boolean = false;
  selectedStores: Store[] = [];
  items: MenuItem[] = [
    {
      label: 'Multiplas Lojas',
      icon: 'pi pi-plus',
      tooltip: 'Criar múltiplas lojas com .csv',
      command: () => {
        this.createMultipleStoresView();
      },
    },
    {
      label: 'Deletar Lojas',
      icon: 'pi pi-trash',
      tooltip: 'Deletar lojas selecionadas',
      command: () => {
        this.deleteSelectedStores();
      },
    },
  ];

  selectedFile: File | undefined;
  fileUploaded: boolean = false;
  fileURL: any;

  constructor(
    private messageService: MessageService,
    private storeService: StoreService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    const filePath = environment.mediaModelsFiles + 'Criar-Multiplas-Lojas.csv';
    this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
  }

  ngOnInit() {
    this.fetchComponent();
  }

  fetchComponent(): void {
    this.isLoading = true;
    this.storeService.list().subscribe({
      next: (response: HttpResponse<ListResponse<Store>>) => {
        //toastMessage(this.messageService, component_list_toasts[response.status]);
        this.stores = response.body?.results || [];
        this.itemsFiltrados = this.stores;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  createStore(): void {
    this.router.navigate(['/merchant/store-view', 'new']);
  }

  createMultipleStoresView(): void {
    this.multipleStoresView = !this.multipleStoresView;
  }

  deleteSelectedStores(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja remover os itens selecionados?',
      header: 'Confirmação de Remoção',
      icon: 'pi pi-trash',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.selectedStores.forEach((store) => {
          const storePosition = this.itemsFiltrados.findIndex(
            (item) => item.id === store.id
          );
          if (storePosition !== -1) {
            this.deleteComponentAction(storePosition);
          } else {
            console.error('Store not found in itemsFiltrados:', store);
          }
        });
      },
      reject: () => {
        console.log('Rejeitado');
      },
    });
  }

  deleteComponent(rowPosition: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja remover este item?',
      header: 'Confirmação de Remoção',
      icon: 'pi pi-trash',
      acceptLabel: 'Sim', // substitua por seu texto
      rejectLabel: 'Não',
      accept: () => {
        this.deleteComponentAction(rowPosition);
      },
      reject: () => {
        console.log('Rejeitado');
      },
    });
  }

  deleteComponentAction(rowPosition: number): void {
    this.isLoading = true;
    const row = this.itemsFiltrados[rowPosition];
    const storeId = String(row?.id) || '';
    this.storeService.delete(storeId).subscribe({
      next: (response: HttpResponse<Store>) => {
        const index = this.stores.findIndex(
          (item) => String(item.id) === storeId
        );
        if (index !== -1) {
          this.stores.splice(index, 1);
        }
        this.applyFilter();
        toastMessage(
          this.messageService,
          component_list_toasts[response.status]
        );
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  clearGlobalFilter() {
    this.globalFilter = '';
    this.applyFilter();
  }

  applyFilter(): void {
    this.itemsFiltrados = this.stores.filter(
      (store) =>
        store.name?.toLowerCase().includes(this.globalFilter.toLowerCase()) ||
        store.document
          ?.toLowerCase()
          .includes(this.globalFilter.toLowerCase()) ||
        store.address?.zipcode
          ?.toLowerCase()
          .includes(this.globalFilter.toLowerCase()) ||
        store.address?.city?.name
          ?.toLowerCase()
          .includes(this.globalFilter.toLowerCase())
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

  getAddress(stores: any): string {
    let address = `${stores.address.city.name} - ${stores.address.city.state.initials} | ${stores.address.street}, ${stores.address.number}`;
    if (stores.address.complement) {
      address += ` (${stores.address.complement})`;
    }
    return address.length > 80 ? address.slice(0, 80) + '...' : address;
  }

  submitMultiple(): void {
    if (this.fileUploaded) {
      const formData = new FormData();
      formData.append('file', this.selectedFile!);
      this.isLoading = true;
      this.storeService.addFile(formData).subscribe({
        next: (response: HttpResponse<Store>) => {
          toastMessage(
            this.messageService,
            component_list_toasts[response.status]
          );
          this.fileUploaded = false;
          this.selectedFile = undefined;
          this.resetFileUpload();
          this.fetchComponent();
          this.isLoading = false;
          this.multipleStoresView = false;
        },
        error: (error: HttpErrorResponse) => {
          toastMessage(this.messageService, {
            severity: 'error',
            summary: 'Arquivo com erro',
            detail: 'Por favor, confira os dados da tabela CSV adicionada.',
            life: 5000,
          });
          this.isLoading = false;
        },
      });
    }
  }

  onSelectFile(event: any): void {
    const uploadedFiles = event.files; // Access the uploaded files array

    // Handle the uploaded file(s)
    if (uploadedFiles && uploadedFiles.length > 0) {
      this.selectedFile = uploadedFiles[0]; // Access the first uploaded file
      this.fileUploaded = true;
    } else {
      this.selectedFile = undefined;
      this.fileUploaded = false;
    }
  }

  resetFileUpload(): void {
    this.fileUpload.clear();
    // this.registerGroupIndicatedForm.get('file')?.reset();
    this.fileUploaded = false; // Set the fileUploaded flag to false to indicate no file is selected
  }
}
