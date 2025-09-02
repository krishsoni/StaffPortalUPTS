import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/data.service';
import { Password } from 'src/app/services/Models/password';
import { ResetPassword } from 'src/app/services/Models/resetpassword';
import { UserService } from 'src/app/services/user-service/user-service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  username: String;
  phoneNumber: Number;
  newpwd: String;
  confirmnewpwd: String;
  resetPassword: ResetPassword;
  empId: Number;
  rusername: String;
  changedPassword: Password;

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router, private dataService: DataService) { }

  ngOnInit() {
    //this.empId = this.dataService.getEmpId();
    this.empId = Number(sessionStorage.getItem('empId'));
    //this.rusername = this.dataService.getUsername();
    this.rusername = sessionStorage.getItem('username');
  }

  onPasswordKeyDown(evt) {
    if (evt.key === "Enter") {
      this.changePassword();
    }
  }

  changePassword()
  {
    this.resetPassword = new ResetPassword(this.username, this.phoneNumber, this.newpwd, this.confirmnewpwd);
    this.userService.getUserbyName(this.username).subscribe(res => {
      console.log(res);
      if(res == undefined)
      {
        this.toastr.warning("Please Enter Correct Details");
      }
      else
      {
      if (res.mobilenumber == this.phoneNumber) {
        if (this.newpwd == this.confirmnewpwd) {
          this.changedPassword = new Password(this.newpwd, true);
          this.userService.changepassword(res.id, this.changedPassword).subscribe(res => {
            console.log(res);
            this.toastr.success("Password Changed Successfully. Please Login");
            this.router.navigate(['./login']);
          });
        }
        else {
          this.toastr.warning("Password Not Matching");
        }
      }
      else {
        this.toastr.warning("Please Enter Correct Phone Number");
      }
    }
    });

  }
  backtologin()
  {
    this.router.navigate(['/login']);
  }

}
