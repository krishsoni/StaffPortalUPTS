import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { User } from '../../services/Models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../Models/employee';
import { Expense } from '../Models/expense';

@Injectable()
export class ExpenseService {

  constructor(private http: HttpClient) { }

  getExpense(): Observable<any>
  {
    return this.http.get(environment.apis.getExpense);
  }
  getExpenseByEmpId(empId: Number): Observable<any>
  {
    return this.http.get(environment.apis.getExpenseByEmpId+empId);
  }
  getExpensesByEmpId(empId: Number): Observable<any>
  {
    return this.http.get(environment.apis.getExpensesByEmpId+empId);
  }
  createExpense(expense: Expense):Observable<any>
  {
    return this.http.post(environment.apis.createExpense, expense);
  }
  getExpenseDetails(): Observable<any>
  {
    return this.http.get(environment.apis.getExpenseDetails);
  }
  updateExpenseStatusById(expId:Number, body: any): Observable<any>
  {
    return this.http.put(environment.apis.updateexprequest+expId, body);
  }
  approveExpenseWithBalance(expenseId: number, empid: number, amount: number): Observable<any> {
    return this.http.post(`${environment.apis.approveWithBalance}`, {
      expenseId,
      empid,
      amount
    });
  }
  getunApprovedCount() : Observable<any>
  {
    return this.http.get(environment.apis.getunApprovedcount);
  }
  updateexpenseattachCount(expId:Number, body: any): Observable<any>
  {
    return this.http.put(environment.apis.updateattachCount+expId, body);
  }
  // uploadAttachment(data:string, name:string, expenseId: Number):Observable<any>
  // {
  //   return this.http.post(environment.apis.uploadAttachment, {data:data, name:name, expenseId:expenseId});
  // }
//   createEmployee(employee: Employee): Observable<any>
//   {
//     return this.http.post(environment.apis.createemployee, employee);
//   }
}
