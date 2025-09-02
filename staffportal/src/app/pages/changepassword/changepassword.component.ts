import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/data.service';
import { Password } from 'src/app/services/Models/password';
import { UserService } from 'src/app/services/user-service/user-service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  currentpwd: String = 'Welcome@123';
  newpwd: String;
  confirmnewpwd: String;
  changedPassword: Password;
  empId: String;
  constructor(private userService: UserService, private toastr: ToastrService, private router: Router, private dataService:DataService) { }

  ngOnInit() {
    this.empId = sessionStorage.getItem('id');
    //this.empId = this.dataService.getId();
  }

  onPasswordKeyDown(evt) {
    if (evt.key === "Enter") {
      this.changePassword();
    }
  }

  changePassword()
  {
    this.changedPassword = new Password(this.newpwd, true);
    if(this.newpwd)
    {
    if(this.currentpwd = "Welcome@123")
    {
      if(this.newpwd == this.confirmnewpwd)
      {
        this.userService.changepassword(this.empId, this.changedPassword).subscribe(res=>{
          console.log(res);
          this.toastr.success("Password Changed Successfully");
          this.toastr.warning("Please Login using Your New Credentials");
          this.router.navigate(['./login']);
        });
      }
      else{
        this.toastr.warning("New Password Not Matching");
      }
    }
    else{
      this.toastr.warning("Please Enter Correct Password");
    }
  }
  else
  this.toastr.warning("Please Enter Password");

  }

}
