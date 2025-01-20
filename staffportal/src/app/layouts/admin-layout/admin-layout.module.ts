import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { EmployeesComponent } from 'src/app/pages/employees/employees.component';
import { ProjectsComponent } from 'src/app/pages/projects/projects.component';
import { ProjectService } from 'src/app/services/project-service/project-service';
import { EmployeeService } from 'src/app/services/employee-service/employee-service';
import { LookupService } from 'src/app/services/lookup-service/lookup-service';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { AuditTrailService } from 'src/app/services/audittrail-service/audittrail-service';
import { RequestsComponent } from 'src/app/pages/requests/requests.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    AgGridModule,
    ToastrModule,
    DatePipe
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    EmployeesComponent,
    ProjectsComponent,
    RequestsComponent
  ],
providers: [ProjectService, EmployeeService, LookupService, AuditTrailService],
schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class AdminLayoutModule {}
