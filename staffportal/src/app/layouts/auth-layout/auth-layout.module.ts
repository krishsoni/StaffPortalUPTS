import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { ChangePasswordComponent } from 'src/app/pages/changepassword/changepassword.component';
import { ResetPasswordComponent } from 'src/app/pages/resetpassword/resetpassword.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ResetPasswordComponent
  ]
})
export class AuthLayoutModule { }
