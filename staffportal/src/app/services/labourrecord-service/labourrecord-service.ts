import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LabourRecord } from '../Models/labourrecord';

@Injectable()
export class LabourRecordService {

  constructor(private http: HttpClient) { }

  getLabourRecordByProject(projectno: string): Observable<any> {
    return this.http.get(`${environment.apis.getLabourRecordByProject}?projectnumber=${encodeURIComponent(projectno)}`);
  }  
  
  createLabourRecord(record: LabourRecord):Observable<any>
  {
    return this.http.post(environment.apis.createLabourRecord, record);
  }
  updateattachCount(recordId:Number, body: any): Observable<any>
  {
    return this.http.put(environment.apis.updaterecordattachCount+recordId, body);
  }
}
