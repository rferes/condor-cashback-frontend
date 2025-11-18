import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Partnership } from 'src/app/merchant/partnership/entities/partnership.entity';
import { MerchantPartnershipService } from 'src/app/merchant/partnership/services/partnership.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MerchantPartnerHost {
  id: string;
  name: string;
  image: string;
  document: string;
  city: string;
  type: string;
  partnership_date: Date;
  total_value: number;
  cashback_value: number;
  quantity_receipts: number;
}

@Component({
  selector: 'app-partnership-host-view',
  templateUrl: '../views/partnership-view.component.html',
})
export class PartnershipHostViewComponent implements OnInit {
  isFavorited = false;
  merchantPartnerHost = {} as MerchantPartnerHost;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private partnershipService: MerchantPartnershipService,
    private router: Router
  ) {}

  ngOnInit() {
    const pk = this.route.snapshot.params['id'];
    if (pk) {
      this.fetchMerchant(pk);
    }
  }

  fetchMerchant(pk: string) {
    this.partnershipService.get_partnership_host_data(pk).subscribe({
      next: (res) => {
        if (res.body) {
          this.merchantPartnerHost = {
            id: res.body.id,
            name: res.body.name,
            image: res.body.image,
            document: res.body.document,
            city: res.body.city,
            type: res.body.type,
            partnership_date: new Date(res.body.partnership_date),
            total_value: res.body.total_value,
            cashback_value: res.body.cashback_value,
            quantity_receipts: res.body.quantity_receipts,
          };
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados da parceria',
          life: 8000,
        });
      },
    });
  }

  back() {
    this.router.navigate(['/merchant/partnership-list']);
  }
}
