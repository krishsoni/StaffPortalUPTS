import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { environment } from '../../../environments/environment';
//import { Login } from '../services/models/login';
import { Observable } from 'rxjs';
import { UserService } from '../services/user-service/user-service'
import { User } from './Models/user';
@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient,private userService:UserService) { }
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
    sessionStorage.clear();
  }

}
