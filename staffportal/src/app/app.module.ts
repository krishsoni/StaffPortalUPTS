import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModal, NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { UserService } from './services/user-service/user-service';
import { BalanceService } from './services/balance-service/balance-service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProjectService } from './services/project-service/project-service';
import { EmployeeService } from './services/employee-service/employee-service';
import { ExpenseService } from './services/expense-service/expense-service';
import { AuthenticationService } from './services/authentication-service';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ProjectsComponent } from './pages/projects/projects.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeComponent } from './pages/home/home.component';
import { ExpenseComponent } from './pages/expense/expense.component';
import { BalanceComponent } from './pages/balance/balance.component';
import { AttachmentService } from './services/attachment-service/attachment-service';
import { AuditTrailService } from './services/audittrail-service/audittrail-service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgIdleModule } from '@ng-idle/core';
import { IdleService } from './services/idle-service/idle-service';
import { QueryService } from './services/query-service/query-service';
import { LabourRecordService } from './services/labourrecord-service/labourrecord-service';
import { NgChartsModule } from 'ng2-charts';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    //NgChartsModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    MatDialogModule,
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    MatFormFieldModule,
    NgbRatingModule,
    AgGridModule,
    AgGridAngular,
    NgIdleModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    AdminLayoutModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    HomeComponent,
    ExpenseComponent,
    BalanceComponent,
    //UserProfileComponent
  ],
  providers: [AuthenticationService, UserService, ProjectService, EmployeeService, BalanceService, ExpenseService, AttachmentService, AuditTrailService, ToastrService, IdleService, QueryService, LabourRecordService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
