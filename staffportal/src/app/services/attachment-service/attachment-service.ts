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

  uploadAttachment(data:string, name:string, type:string, refid: Number):Observable<any>
  {
    return this.http.post(environment.apis.uploadAttachment, {data:data, name:name, type:type, refid:refid});
  }
  getAttachmentByExpId(expenseId: Number, type: string):Observable<any>
  {
    return this.http.post(environment.apis.getAttachment, {"id":expenseId, type:type});
  }
  getAttachmentByRecordId(recordId: Number, type: string):Observable<any>
  {
    return this.http.post(environment.apis.getAttachment, {"id":recordId, type:type});
  }
  downloadAttachment(id: number): Observable<Blob> {
    return this.http.get(environment.apis.downloadAttachment+id, {
      responseType: 'blob'
    });
  }
}
