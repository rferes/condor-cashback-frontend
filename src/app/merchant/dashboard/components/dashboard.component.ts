import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProfileService } from '../../profile/services/profile.service';
import { Merchant } from '../../profile/entities/profile.entity';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DashboardMerchant } from '../entities/dashboard.entity';
import { dashboard_messages } from '../utils/dashboard-response-msg';
import { toastMessage } from '../../../shared/utils/toast';
import { MessageService } from 'primeng/api';
import { FileDownloadService } from '../../../shared/services/file-downloads.service';
import { environment } from 'src/environments/environment';
import { ReceiptService } from '../../../receipt/services/receipt.service';
// Change Profile TO Dashboard

const dashboard_msg = dashboard_messages();

@Component({
  selector: 'app-dashboard-merchant',
  templateUrl: '../views/dashboard.component.html',
  styleUrls: ['../styles/dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private baseURL: string = environment.apiUrl;
  private endURLMensal: string = 'receipts/receipt_csv_mensal/';
  profile: Merchant = {} as Merchant; // Initialize profile
  dashboardData: DashboardMerchant = {} as DashboardMerchant;
  csvMensalForm: FormGroup;
  months: any[] = [];
  selectedMonth: any;
  chartData: any;
  chartOptions: any;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private receiptService: ReceiptService,
    private messageService: MessageService,
    private fileDownloadService: FileDownloadService
  ) {
    this.csvMensalForm = this.formBuilder.group({});
    this.initChartOptions();
  }

  ngOnInit() {
    this.fetchDashboardData();
    this.initCSVForm();
  }

  // downloadCSV() {
  //   const fileName: string = `RedRed_Notas_Geral_Comerciante_${this.profile.name}.csv`;
  //   const formData = new FormData();
  //   formData.append('profile_id', this.profile.id.toString());
  //   const url_csv_campaign_detail = this.baseURL + this.endURL;
  //   this.fileDownloadService.fileDownload(
  //     url_csv_campaign_detail,
  //     fileName,
  //     formData
  //   );
  // }

  initCSVForm() {
    this.csvMensalForm = this.formBuilder.group({
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      month_name: ['', Validators.required],
      month_code: ['', Validators.required],
    });
  }

  createMonths(created_user_date: Date) {
    const current_date = new Date();
    const months = [];
    let date_start = new Date(created_user_date);

    // Ajusta a data inicial para o primeiro dia do mês
    date_start.setDate(1);

    // Ajusta a data atual para o primeiro dia do mês
    const current_month_start = new Date(
      current_date.getFullYear(),
      current_date.getMonth(),
      1
    );

    // Garante que pelo menos o mês atual seja incluído
    do {
      const month_code =
        date_start.getMonth() === current_month_start.getMonth() &&
        date_start.getFullYear() === current_month_start.getFullYear()
          ? 'current'
          : `${date_start.getFullYear()}/${String(
              date_start.getMonth() + 1
            ).padStart(2, '0')}`;

      const month_name = `${String(date_start.getMonth() + 1).padStart(
        2,
        '0'
      )}/${date_start.getFullYear()}`;
      const end_of_month = new Date(
        date_start.getFullYear(),
        date_start.getMonth() + 1,
        0
      );

      months.push({
        month_name: month_name,
        month_code: month_code,
        start_day: 1,
        end_day: end_of_month.getDate(),
      });

      // Avança para o próximo mês
      date_start = new Date(
        date_start.getFullYear(),
        date_start.getMonth() + 1,
        1
      );
    } while (date_start <= current_month_start);

    // Sort months in descending order by month_code
    months.sort((a, b) =>
      (b.month_code || '').localeCompare(a.month_code || '')
    );

    return months;
  }

  downloadCSVmensal() {
    if (!this.profile?.id || !this.csvMensalForm.value?.month_code) {
      return;
    }

    const fileName: string = `RedRed_Relatorio_Mensal_Comerciante_${this.profile.name}_${this.csvMensalForm.value.month_code}.zip`;
    const formData = new FormData();
    formData.append('profile_id', this.profile.id.toString());
    formData.append('month_code', this.csvMensalForm.value.month_code);
    const url_relatorio_mensal = this.baseURL + this.endURLMensal;
    this.fileDownloadService.fileDownload(
      url_relatorio_mensal,
      fileName,
      formData
    );
  }

  fetchDashboardData() {
    this.profileService.get('me').subscribe({
      next: (response: HttpResponse<Merchant>) => {
        this.profile = response.body!;
        this.months = this.createMonths(this.profile.created_date);

        this.profileService.dashboard_data(String(this.profile.id)).subscribe({
          next: (response: HttpResponse<DashboardMerchant>) => {
            this.dashboardData = response.body!;

            if (this.months && this.months.length > 0) {
              this.selectedMonth = this.months[0];

              if (this.selectedMonth?.month_code) {
                this.csvMensalForm.patchValue({
                  month_code: this.selectedMonth.month_code,
                });
              }
            }
          },
          error: (error: HttpErrorResponse) => {
            toastMessage(this.messageService, dashboard_msg[error.status]);
          },
        });
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  initChartOptions() {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };
  }
}
