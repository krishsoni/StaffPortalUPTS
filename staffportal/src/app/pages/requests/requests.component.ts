import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take, filter, startWith } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user-service/user-service';
import { User } from 'src/app/services/Models/user';
import { BalanceService } from 'src/app/services/balance-service/balance-service';
import { DatePipe, formatDate } from '@angular/common';
import { switchMap, tap } from 'rxjs/operators';
import { concat, interval, Subscription } from 'rxjs';

import "ag-grid-community";
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from "ag-grid-community";
import { Balance } from 'src/app/services/Models/balance';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';
import { QueryService } from 'src/app/services/query-service/query-service';
import { EmployeeService } from 'src/app/services/employee-service/employee-service';
import { Employee } from 'src/app/services/Models/employee';

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
})
export class RequestsComponent implements OnInit,OnDestroy {
  private subscription: Subscription = new Subscription();
  addBalance: Balance;
  colDefs: ColDef[] = [
    { headerName: "EmployeeNo", field: "empNo"},
    { headerName: "Name", field: "empName"},
    { headerName: "Amount", field: "Amount" },
    { headerName: "Date", field: "createdAt", valueFormatter: this.dateFormatter  },
    { headerName: "Status",field: "Status" },
    {
      headerName: "Action",
      minWidth: 150,
      cellRenderer: this.actionCellRenderer,
      editable: false,
      colId: "action"
    }
  ];
  colempDefs : ColDef[] = [
    { headerName: "EmployeeNo", field: "empNo"},
    { headerName: "Name", field: "empName"},
    { headerName: "ProjectNo", field: "projectNumber" },
    { headerName: "ExpType", field: "expenseType" },
    { headerName: "Amount", field: "amount" },
    { headerName: "Date", field: "createdAt", valueFormatter: this.dateFormatter  },
    { headerName: "Status",field: "status" },
    {
      headerName: "Action",
      minWidth: 150,
      cellRenderer: this.actionexpCellRenderer,
      editable: false,
      colId: "action"
    }
  ];
  public autoSizeStrategy:
  | SizeColumnsToFitGridStrategy
  | SizeColumnsToFitProvidedWidthStrategy
  | SizeColumnsToContentStrategy = {
  type: "fitGridWidth",
  defaultMinWidth: 100,
};
dateFormatter(params) {
  if (params.value) {
    const date = new Date(params.value);
    return formatDate(date, 'dd-MM-yyyy', 'en');
  } else {
    return '';
  }
}
getRowStyle = params => {
  if (params.data.Status === 'Completed') {
      return { background: '#2dce89', 'pointer-events': 'none'};
  }
};
    gridApi: GridApi<any>;
    username: string;
    empId : Number;
    test: Date = new Date();
    rowData = [];
    rowexpData = [];
    employeeDetails: Employee;
    manager : String;
    query : any;
    fdate: string;
    tdate: string;
    balancereq = false;
    isadmin: String;
    constructor(private activatedRoute: ActivatedRoute,
        private toastr: ToastrService, private router:Router, private userService:UserService, 
        private balanceService: BalanceService, private expenseService: ExpenseService, private queryService: QueryService, private employeeService: EmployeeService) { }

    ngOnInit() {
      const today = new Date();
      const tenday = new Date();
  
      // Format the date as yyyy-mm-dd (required for input type="date")
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const day = String(today.getDate()).padStart(2, '0');
      // Set the dateValue in yyyy-mm-dd format for the input field
      this.tdate = `${year}-${month}-${day}`;
  
      tenday.setDate(today.getDate() - 30); // Subtract 30 days
      const tyear = tenday.getFullYear();
      const tmonth = String(tenday.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const tday = String(tenday.getDate()).padStart(2, '0');
  
      this.fdate = `${tyear}-${tmonth}-${tday}`;
        this.username = sessionStorage.getItem('username');
        //this.username = this.dataService.getUsername();
        console.log(this.username);
        console.log("EmpId is not null: Requests Component "+ sessionStorage.getItem('empId'));
        this.empId = Number(sessionStorage.getItem('empId'));
        // this.employeeService.getEmpById(this.empId).subscribe(res=>{
        //   this.employeeDetails = res;
        //   this.manager = this.employeeDetails.manager;
        //   console.log(this.employeeDetails);
        // })
        this.isadmin = sessionStorage.getItem('isadmin');
        if(this.isadmin=="true")
        {
          this.balanceService.getsubbalanceRequests().subscribe(res=>{
            console.log(res);
            this.rowData = res;
            this.balancereq = true;
          });
        }
        this.query = {
          "collectionName": "employees",
          "pipeline": [
            {
              "$match": {
                "manager": this.username
              }
            },
            {
              "$lookup": {
                "from": "expenses",
                "localField": "_id",
                "foreignField": "empId",
                "as": "employee_expenses"
              }
            },
            {
              "$unwind": {
                "path": "$employee_expenses",
                "preserveNullAndEmptyArrays": true
              }
            },
            {
              "$match": {
                "employee_expenses.status": "UnApproved"
              }
            },
            {
              "$project": {
                "_id": 0,
                "empId": "$_id",
                "empNo": "$empNo",
                "empName": "$username",
                "expId": "$employee_expenses._id",
                "projectNumber": "$employee_expenses.projectNumber",
                "expenseType": "$employee_expenses.expenseType",
                "amount": "$employee_expenses.amount",
                "noofWorkers": "$employee_expenses.noofWorkers",
                "pour": "$employee_expenses.pour",
                "floor": "$employee_expenses.floor",
                "worktype": "$employee_expenses.worktype",
                "remarks": "$employee_expenses.remarks",
                "status": "$employee_expenses.status",
                "createdAt": "$employee_expenses.createdAt",
                "updatedAt": "$employee_expenses.updatedAt",
                "__v": "$employee_expenses.__v"
              }
            }
          ]
        }
    }
    actionCellRenderer(params) {
      if (params.data.Status === 'Completed') {
        return null; // Hide the buttons for completed rows
      }
      let eGui = document.createElement('div');
    
      eGui.innerHTML = `
          <button 
            class="btn btn-success btn-sm"
            data-action="approve">
              Approve
          </button>
          <button 
          class="btn btn-danger btn-sm"
          data-action="reject">
            Reject
        </button>
      `;
      return eGui;
    }
    
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      // Additional initialization code...
      // <button 
      //       class="btn btn-danger btn-sm"
      //       data-action="reject">
      //         Reject
      //     </button>
  }
  // onexpGridReady(params: GridReadyEvent){
  //   this.gridApi = params.api;
  //   this.queryService.query(this.query).subscribe(res=>{
  //     const rowData = Array.isArray(res) ? res : [];
  //     this.gridApi.setRowData(rowData);
  //     this.rowexpData = rowData;
  //     console.log(this.rowexpData);
  //    })
  // }
  onexpGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  
    // Set up an observable to execute the query on load and every 5 minutes
    this.subscription = interval(300000).pipe(
      startWith(0), // Emit an initial value immediately
      switchMap(() => this.queryService.query(this.query)),
      tap(res => {
        const rowData = Array.isArray(res) ? res : [];
        this.gridApi.setRowData(rowData);
        this.rowexpData = rowData;
        console.log(this.rowexpData);
        console.log(res.length);
      })
    ).subscribe();
  }
  actionexpCellRenderer(params) {
    let eGui = document.createElement('div');
  
    eGui.innerHTML = `
        <button 
          class="btn btn-success btn-sm"
          data-action="approve">
            Approve
        </button>
        <button 
          class="btn btn-danger btn-sm"
          data-action="reject">
            Reject
        </button>
    `;
    return eGui;
  }
  onCellClicked(params) {
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      const action = params.event.target.dataset.action;
      const rowIndex = params.node.rowIndex;
      const rowData = params.data;
  
      if (action === "approve") {
        // Logic for approve action
        this.approveRequest(rowIndex, rowData);
      }
  
      if (action === "reject") {
        // Logic for reject action
        this.rejectRequest(rowIndex, rowData);
      }
    }
  }
  approveRequest(rowIndex: number, rowData: any) {
    // Example logic for approve action
    //rowData.Status = 'Approved'; // Update the local data
    //this.gridApi.applyTransaction({ update: [rowData] });
    
    // make an API call to update the server

    this.balanceService.updatebalanceRequests(rowData._id, {Status:"Completed"}).subscribe(
      response => {
        console.log(response);
        this.toastr.success('Request Approved Successfully.');
      });
      this.addBalance = new Balance(rowData.empId,rowData.Amount,"C");
      this.addbalance();
  }

  addbalance() {
    this.balanceService.addBalance(this.addBalance).subscribe(res => {
      console.log(res);
      this.toastr.warning("Balance Updated Successfully");
        setTimeout(() => window.location.reload(), 700);
    });
  }
  
  rejectRequest(rowIndex: number, rowData: any) {
    this.balanceService.updatebalanceRequests(rowData._id, {Status:"Rejected"}).subscribe(
      response => {
        console.log(response);
        this.toastr.error('Request Rejected Successfully.');
        setTimeout(() => window.location.reload(), 700);
      });
  }

  onexpCellClicked(params){
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      const action = params.event.target.dataset.action;
      const rowIndex = params.node.rowIndex;
      const rowData = params.data;
  
      if (action === "approve") {
        // Logic for approve action
        this.approveexpRequest(rowIndex, rowData);
      }
  
      if (action === "reject") {
        // Logic for reject action
        this.rejectexpRequest(rowIndex, rowData);
      }
    }
  }
  approveexpRequest(rowIndex: number, rowData: any)
  {
    this.expenseService.updateExpenseStatusById(rowData.expId, {status:"Approved"}).subscribe(res=>{
      console.log(res);
      this.toastr.success('Request Approved Successfully.');
      setTimeout(() => window.location.reload(), 700);
    });
    this.addBalance = new Balance(rowData.empId,rowData.amount,"D");
    this.addbalance();
  }
  rejectexpRequest(rowIndex: number, rowData: any)
  { 
    this.expenseService.updateExpenseStatusById(rowData.expId, {status:"Rejected"}).subscribe(res=>{
      console.log(res);
      this.toastr.error('Request Rejected Successfully.');
      setTimeout(() => window.location.reload(), 700);
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
