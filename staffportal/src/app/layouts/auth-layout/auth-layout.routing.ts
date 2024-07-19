import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { ChangePasswordComponent } from 'src/app/pages/changepassword/changepassword.component';
import { ResetPasswordComponent } from 'src/app/pages/resetpassword/resetpassword.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'register',       component: RegisterComponent },
    { path: 'changepassword',  component: ChangePasswordComponent},
    { path: 'resetpassword', component:ResetPasswordComponent}
];
