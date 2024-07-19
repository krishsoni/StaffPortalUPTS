import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { User } from 'src/app/services/Models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewUser } from '../Models/newuser';
import { Password } from '../Models/password';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any>
  {
    return this.http.get(environment.apis.getAllUsers);
  }

  getUserbyUserName(user :User): Observable<any>
  {
    return this.http.post(environment.apis.getUserbyUserName,user);
  }

  getUserbyName(user :String): Observable<any>
  {
    return this.http.get(environment.apis.getUserbyName+user);
  }

  generateToken(user: User): Observable<any>
  {
    return this.http.post(environment.apis.generateToken, user.username, {responseType: 'text'});
  }

  createUser(user: User) : Observable<any> {
    return this.http.post(environment.apis.createuser, user);
  }

  createNewUser(newUser: NewUser) : Observable<any> {
    return this.http.post(environment.apis.createuser, newUser);
  }

  changepassword(id :String, password: Password): Observable<any> {
    return this.http.put(environment.apis.updatepassword+id,password);
  }
}
