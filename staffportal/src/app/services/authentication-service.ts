import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { environment } from '../../../environments/environment';
//import { Login } from '../services/models/login';
import { Observable } from 'rxjs';
import { UserService } from '../services/user-service/user-service'
import { User } from './Models/user';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient,private userService:UserService, private dataService: DataService,
    private router:Router, private toastr:ToastrService, ) { }
  result:User;

  login(user:User) : User{
   
    //call db service 
    this.userService.getUserbyUserName(user).subscribe(res=>{
      this.result = res[0];
    });
    return this.result;   
  }

  logout() {
    // clear session
    //sessionStorage.clear();
    this.dataService.clear();
    this.router.navigate(['/login']);
  }

}
