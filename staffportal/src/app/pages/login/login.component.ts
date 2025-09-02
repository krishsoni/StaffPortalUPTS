import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/Models/user';
import { UserService } from 'src/app/services/user-service/user-service';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  username: string;
  password: string;
  errorMessage: string;
  isadmin = false;
  user: User;
  subscribParam = "";
  response: User;
  token: string;

  constructor(private router: Router, private userService:UserService, private dataservice: DataService) {}

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("app-login");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
  }
  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
  }
  onPasswordKeyDown(evt) {
    if (evt.key === "Enter") {
      this.login();
    }
  }
  login() {

    this.user = new User(this.username, this.password, this.isadmin);

    this.userService.getUserbyUserName(this.user).subscribe({
      next: res => {
        this.response = res;
        console.log(this.response);
    
        if (!this.response) {
          this.errorMessage = "Invalid Credentials!";
          return;
        }
    
        // Save session data
        sessionStorage.setItem('empId', res.empid);
        sessionStorage.setItem('isadmin', res.isadmin.toString());
        sessionStorage.setItem('username', res.username);
    
        if (res.isadmin) {
          if (res.passwordchange) {
            this.router.navigate(['/dashboard']);
          } else {
            sessionStorage.setItem('id', res.id);
            this.router.navigate(['/changepassword']);
          }
        } else {
          if (res.passwordchange) {
            this.router.navigate(['/home']);
          } else {
            sessionStorage.setItem('id', res.id);
            this.router.navigate(['/changepassword']);
          }
        }
      },
      error: err => {
        console.error("Login error:", err);
        this.errorMessage = "Invalid Credentials!";
      }
    });
    
  }
  error() {
    this.errorMessage = "Please Enter Name and Password";
  }
  resetpassword()
  {
    this.router.navigate(['/resetpassword']);
  }

}
