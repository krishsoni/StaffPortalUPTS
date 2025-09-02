import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { EmployeesComponent } from 'src/app/pages/employees/employees.component';
import { ProjectsComponent } from 'src/app/pages/projects/projects.component';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { BalanceComponent } from 'src/app/pages/balance/balance.component';
import { ExpenseComponent } from 'src/app/pages/expense/expense.component';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { FillExpenseDetailsComponent } from 'src/app/pages/fillexpensedetails/fillexpensedetails.component';
import { RequestsComponent } from 'src/app/pages/requests/requests.component';
import { RecordComponent } from 'src/app/pages/record/record.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'employees',      component: EmployeesComponent },
    { path: 'projects',       component: ProjectsComponent },
    { path: 'home',           component:HomeComponent},
    { path: 'balance',        component:BalanceComponent},
    { path: 'expense',        component:ExpenseComponent},
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'fillexp',        component:FillExpenseDetailsComponent},
    { path: 'requests',       component:RequestsComponent},
    { path: 'labourrecord',       component:RecordComponent},




];
