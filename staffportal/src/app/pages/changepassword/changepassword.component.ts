import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Password } from 'src/app/services/Models/password';
import { UserService } from 'src/app/services/user-service/user-service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  currentpwd: String;
  newpwd: String;
  confirmnewpwd: String;
  changedPassword: Password;
  empId: String;
  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.empId = sessionStorage.getItem('_id');
  }
  changePassword()
  {
    this.changedPassword = new Password(this.newpwd, true);
    if(this.currentpwd = "Welcome123")
    {
      if(this.newpwd == this.confirmnewpwd)
      {
        this.userService.changepassword(this.empId, this.changedPassword).subscribe(res=>{
          console.log(res);
          this.router.navigate(['./home']);
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

}