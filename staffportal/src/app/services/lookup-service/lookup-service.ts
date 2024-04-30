import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { User } from '../../services/Models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../Models/employee';
//import { environment } from '../../../../environments/environment';

@Injectable()
export class LookupService {

  constructor(private http: HttpClient) { }

     getByLookupType(lookup : any) : Observable<any>
     {
        return this.http.post(environment.apis.getByLookupType, lookup);
     }
}
