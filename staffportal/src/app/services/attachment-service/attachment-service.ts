import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { User } from '../../services/Models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../Models/employee';
import { Expense } from '../Models/expense';

@Injectable()
export class AttachmentService {

  constructor(private http: HttpClient) { }

  uploadAttachment(data:string, name:string, expenseId: Number):Observable<any>
  {
    return this.http.post(environment.apis.uploadAttachment, {data:data, name:name, expenseId:expenseId});
  }
  getAttachmentByExpId(expenseId: Number):Observable<any>
  {
    return this.http.post(environment.apis.getAttachment, {"expenseId":expenseId});
  }
}
