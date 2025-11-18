// Angular imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

// Third-party libraries
import { MessageService } from 'primeng/api';

import { ConsumerGroupService as ComponentService } from '../../services/consumer-group.service';
import { ConsumerGroup as ComponentEntity } from '../../entities/consumer-group.entity';

import { toastMessage } from 'src/app/shared/utils/toast';
import { consumer_group_view_messages } from 'src/app/merchant/consumer-group/consumer-group-view/utils/consumer-group-view-response-msg';
import { FileUpload } from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

const component_toasts = consumer_group_view_messages();

@Component({
  selector: 'app-consumer-group-view',
  templateUrl: '../views/consumer-group-view.component.html',
})
export class ConsumerGroupViewComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: FileUpload;
  entity: ComponentEntity = {} as ComponentEntity;
  idComponentEntity: string = '';
  entityForm: FormGroup;
  isLoading: boolean = false;

  editMode: boolean = false;
  newObject: boolean = true;

  selectedFile: File | undefined;
  fileUploaded: boolean = false;
  fileURL: any;

  creationModeOptions = [
    { label: 'Manual', value: 'manual' },
    { label: 'Arquivo CSV', value: 'file' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private componentService: ComponentService,
    private sanitizer: DomSanitizer
  ) {
    this.entityForm = this.formBuilder.group({});
    const filePath = environment.mediaModelsFiles + 'Grupo-Consumidores.csv';
    this.fileURL = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
  }

  ngOnInit() {
    this.initializeEntityForm();
    const params = this.route.snapshot.params;
    if (params['id'] && params['id'] !== 'new') {
      this.fetchComponent(params['id']);
      this.editMode = false;
    } else if (params['id'] === 'new') {
      this.newObject = true;
      this.editMode = true;
    } else {
      this.router.navigate(['/merchant/consumer-group-list']);
    }
  }

  // Fetch Component
  fetchComponent(pk: string): void {
    this.componentService.get(pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.newObject = false;
        this.editMode = false;
        this.entityForm.patchValue(this.entity);
      },
      error: (error: HttpErrorResponse) => {
        toastMessage(this.messageService, component_toasts[error.status]);
        setTimeout(() => {
          this.router.navigate(['/merchant/consumer-group-list']);
        }, 2000);
      },
    });
  }

  private initializeEntityForm() {
    this.entityForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl(''),
    });
  }

  edit() {
    this.editMode = true;
  }

  save() {
    if (this.entityForm.invalid) {
      toastMessage(this.messageService, component_toasts[400]);
      return;
    }
    // payload change
    if (this.isNewComponentEntity()) {
      this.createComponentEntity();
    } else {
      this.updateComponentEntity();
    }
  }

  cancel() {
    this.editMode = false;
    this.entityForm.markAsPristine();
    this.entityForm.patchValue(this.entity);
  }

  isNewComponentEntity(): boolean {
    return this.entityForm.get('id')?.value === '';
  }

  createComponentEntity(): void {
    const formData = new FormData();
    if (this.fileUploaded) {
      formData.append('file', this.selectedFile!);
      formData.append('name', this.entityForm.value.name);
      formData.append('description', this.entityForm.value.description);
      this.isLoading = true;
      this.componentService.create(formData).subscribe({
        next: (response: HttpResponse<ComponentEntity>) => {
          toastMessage(this.messageService, component_toasts[response.status]);
          this.fileUploaded = false;
          this.selectedFile = undefined;
          this.resetFileUpload();
          // this.fetchComponent(this.idComponentEntity);
          this.isLoading = false;
          this.editMode = false;
          setTimeout(() => {
            this.router.navigate(['/merchant/consumer-group-list']);
          }, 2000);
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

  updateComponentEntity() {
    const formData = new FormData();

    const pk = this.entityForm.value.id;
    this.isLoading = true;
    if (this.fileUploaded) {
      formData.append('file', this.selectedFile!);
    }
    if (this.entityForm.value.description) {
      formData.append('description', this.entityForm.value.description);
    }
    if (this.entityForm.value.name) {
      formData.append('name', this.entityForm.value.name);
    }

    this.componentService.partial_update(formData, pk).subscribe({
      next: (response: HttpResponse<ComponentEntity>) => {
        this.entity = response.body as ComponentEntity;
        this.entityForm.patchValue(response);
        this.editMode = false;
        this.entityForm.markAsPristine();
        toastMessage(this.messageService, component_toasts[response.status]);
        this.fileUploaded = false;
        this.selectedFile = undefined;
        this.resetFileUpload();
        this.isLoading = false;
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

  back(): void {
    this.router.navigate(['/merchant/consumer-group-list']);
  }
  // validateChip(event: any) {
  //   const chip = event.value;
  //   if (chip.length !== 11 && chip.length !== 14) {
  //     // Remove the chip if it's not valid
  //     const index = this.entityForm.value.document_list.indexOf(chip);
  //     if (index > -1) {
  //       this.entityForm.value.document_list.splice(index, 1);
  //     }
  //   }
  //   // Remove duplicates
  //   const uniqueChips = Array.from(
  //     new Set(this.entityForm.value.document_list)
  //   );
  //   this.entityForm.controls['document_list'].setValue(uniqueChips);
  // }

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
