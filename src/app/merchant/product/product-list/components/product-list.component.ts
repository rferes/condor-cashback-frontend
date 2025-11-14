import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ListResponse } from 'src/app/shared/entities/list-response.entity';
import { Product } from '../../entities/product.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { toastMessage } from 'src/app/shared/utils/toast';
import { product_list_messages } from '../utils/product-list-response-msg';
import { MenuItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const component_list_toasts = product_list_messages();

@Component({
  selector: 'app-product-list',
  templateUrl: '../views/product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  index: number = 0;
  itemsFiltrados: Product[] = [];
  globalFilter: string = '';
  isLoading: boolean = false;

  multipleProductsView: boolean = false;
  selectedProducts: Product[] = [];
  items: MenuItem[] = [
    {
      label: 'Multiplos Produtos',
      icon: 'pi pi-plus',
      tooltip: 'Criar múltiplas produtos com .csv',
      command: () => {
        this.createMultipleProductsView();
      },
    },
    {
      label: 'Deletar Produtos',
      icon: 'pi pi-trash',
      tooltip: 'Deletar Produtos selecionados',
      command: () => {
        this.deleteSelectedProducts();
      },
    },
  ];

  selectedFile: File | undefined;
  fileUploaded: boolean = false;
  fileURL: any;
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    const filePath =
      environment.mediaModelsFiles + 'Criar-Multiplos-Produtos.csv';
    this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
  }

  ngOnInit() {
    this.fetchComponent();
  }

  fetchComponent(): void {
    this.isLoading = true;
    this.productService.list().subscribe({
      next: (response: HttpResponse<ListResponse<Product>>) => {
        //toastMessage(this.messageService, component_list_toasts[response.status]);
        this.products = response.body?.results || [];
        this.itemsFiltrados = this.products;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_list_toasts[error.status]);
        this.isLoading = false;
      },
    });
  }

  deleteSelectedProducts(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza de que deseja remover os itens selecionados?',
      header: 'Confirmação de Remoção',
      icon: 'pi pi-trash',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.selectedProducts.forEach((product) => {
          const productPosition = this.itemsFiltrados.findIndex(
            (item) => item.id === product.id
          );
          if (productPosition !== -1) {
            this.deleteComponentAction(productPosition);
          } else {
            console.error('Product not found in itemsFiltrados:', product);
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
      acceptLabel: 'Sim',
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
    const productId = String(row?.id) || '';
    this.productService.delete(productId).subscribe({
      next: (response: HttpResponse<Product>) => {
        const index = this.products.findIndex(
          (item) => String(item.id) === productId
        );
        if (index !== -1) {
          this.products.splice(index, 1);
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
    this.itemsFiltrados = this.products.filter(
      (product) =>
        product.name?.toLowerCase().includes(this.globalFilter.toLowerCase()) ||
        product.category
          ?.toLowerCase()
          .includes(this.globalFilter.toLowerCase()) ||
        product.category
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

  createProduct(): void {
    this.router.navigate(['/merchant/product-view', 'new']);
  }

  createMultipleProductsView(): void {
    this.multipleProductsView = !this.multipleProductsView;
  }

  submitMultiple(): void {
    if (this.fileUploaded) {
      const formData = new FormData();
      formData.append('file', this.selectedFile!);
      this.isLoading = true;
      this.productService.addFile(formData).subscribe({
        next: (response: HttpResponse<Product>) => {
          toastMessage(
            this.messageService,
            component_list_toasts[response.status]
          );
          this.fileUploaded = false;
          this.selectedFile = undefined;
          this.resetFileUpload();
          this.fetchComponent();
          this.isLoading = false;
          this.multipleProductsView = false;
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
    const uploadedFiles = event.files;

    if (uploadedFiles && uploadedFiles.length > 0) {
      this.selectedFile = uploadedFiles[0];
      this.fileUploaded = true;
    } else {
      this.selectedFile = undefined;
      this.fileUploaded = false;
    }
  }

  resetFileUpload(): void {
    this.fileUpload.clear();
    this.fileUploaded = false;
  }
}
