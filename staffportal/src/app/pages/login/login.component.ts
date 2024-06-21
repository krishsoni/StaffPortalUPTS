import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/Models/user';
import { UserService } from 'src/app/services/user-service/user-service';

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

  constructor(private router: Router, private userService:UserService) {}

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
    this.userService.getUserbyUserName(this.user).subscribe(res => {
      this.response = res[0];
      //console.log(this.response);
      if (this.response == undefined) {
        this.errorMessage = "Invalid Credentials!";
      }
      else
      {
        if (this.response != null) {
          sessionStorage.setItem('empId', res[0].empId);
          sessionStorage.setItem('isadmin', res[0].isadmin.toString());
          console.log(sessionStorage.getItem('empId'));
          // -- generatetoken
          this.userService.generateToken(this.user).subscribe(res => {
            this.token = res;
            console.log('token-->' + this.token);
            sessionStorage.setItem('token', this.token);
            console.log(sessionStorage.getItem('token'));
          })
      }
      if(this.response.isadmin && this.response.password == this.password)
      {
        if(res[0].passwordChange)
        {
            sessionStorage.setItem('username', this.response.username.toString());
            this.router.navigate(['/dashboard']);
        }
        else {
          sessionStorage.setItem('_id', res[0]._id);
          this.router.navigate(['/changepassword']);
        }
      }
      else if (this.response.isadmin == false) 
        {
          sessionStorage.setItem('username', this.response.username.toString());
          if(res[0].passwordChange)
          {
            this.router.navigate(['/home']);
          }
          else{
            sessionStorage.setItem('_id', res[0]._id);
            this.router.navigate(['/changepassword']);
          }
        }
      else 
        {
          this.errorMessage = "Invalid Credentials!";
        }
      }
    });
  }
  error() {
    this.errorMessage = "Please Enter Name and Password";
  }

}
