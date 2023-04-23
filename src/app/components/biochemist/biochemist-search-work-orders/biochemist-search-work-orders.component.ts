import {Component, OnInit} from '@angular/core';
import {LabWorkOrder} from "../../../models/laboratory/LabWorkOrder";
import {LaboratoryService} from "../../../services/laboratory-service/laboratory.service";
import {AuthService} from "../../../services/auth.service";
import {UserService} from "../../../services/user-service/user.service";
import {PatientService} from "../../../services/patient-service/patient.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {OrderStatus} from "../../../models/laboratory-enums/OrderStatus";
import {AnalysisParameter} from "../../../models/laboratory/AnalysisParameter";
import {Page} from "../../../models/models";
import {LabWorkOrderNew} from "../../../models/laboratory/LabWorkOrderNew";

@Component({
  selector: 'app-biochemist-search-work-orders',
  templateUrl: './biochemist-search-work-orders.component.html',
  styleUrls: ['./biochemist-search-work-orders.component.css']
})
export class BiochemistSearchWorkOrdersComponent implements OnInit{

  workOrdersList: LabWorkOrderNew[] = [];
  workOrdersPage: Page<LabWorkOrderNew> = new Page<LabWorkOrderNew>();

  PAGE_SIZE: number = 5;
  page: number = 0;
  total: number = 0;

  dateFrom: Date = new Date();
  dateTo: Date = new Date();
  exactDate: Date = new Date();

  form: FormGroup;

  constructor(private patientService: PatientService, private authService: AuthService,
              private laboratoryService:LaboratoryService, private router: Router,
              private formBuilder: FormBuilder,) {

    this.form = this.formBuilder.group({
      lbp: ['', [Validators.required]],
      dateFrom: ['', [Validators.required]],
      dateTo: ['', [Validators.required]],
      selectedStatus: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    // this.lbz = this.authService.getLBZ();
    // console.log("lbz: " + this.lbz);
  }


  getWorkOrders(): void{
    const sendData = this.form.value;
    console.log(sendData)
    console.log(sendData.selectedStatus.toString())

    this.dateFrom.setHours(0, 0, 0, 0)
    this.dateTo.setHours(23, 59, 59, 999)

    this.laboratoryService.findWorkOrders(sendData.lbp, this.dateFrom, this.dateTo,
      sendData.selectedStatus.toString(), this.page, this.PAGE_SIZE)
      .subscribe(res=>{
        this.workOrdersPage = res
        this.workOrdersList = this.workOrdersPage.content
        this.total = this.workOrdersPage.totalElements
      })
  }

  onTableDataChange(event: any): void {
    this.page = event;
    this.getWorkOrders();
  }


  onRowClick(lab: LabWorkOrderNew): void {
    console.log("Id radnog naloga za detalje: " + lab.id)
    const url = `/biochemist-details/${lab.id}`;

    this.router.navigateByUrl(url, { state: { lab } });
  }

}
