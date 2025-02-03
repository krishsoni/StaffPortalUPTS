import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
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
import Swal from 'sweetalert2';
import { AgGridAngular } from 'ag-grid-angular';
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
import { AttachmentService } from 'src/app/services/attachment-service/attachment-service';

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
})
export class RequestsComponent implements OnInit,AfterViewInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular; 
  private subscription: Subscription = new Subscription();
  addBalance: Balance;
  isProcessingId: number | null = null;
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
    { headerName: "EmpNo", field: "empNo", minWidth: 70,},
    { headerName: "Name", field: "empName", minWidth: 80,},
    { headerName: "ProjectNo", field: "projectNumber", minWidth: 80, },
    { headerName: "ExpType", field: "expenseType", minWidth: 120, },
    { headerName: "Amount", field: "amount", minWidth: 80, },
    { headerName: "Date", field: "createdAt", valueFormatter: this.dateFormatter, minWidth: 100,  },
    { headerName: "Remarks",field: "remarks", minWidth: 150,},
    { headerName: "Status",field: "status", minWidth: 120, },
    // {
    //   headerName: "Download",
    //   field:"attachmentCount",
    //   cellRenderer: function (params) {
    //     if (params.node.group) {
    //       return null; // Hide the button for group rows
    //     } else {
    //       // Check if a file is available in the download column
    //       const hasFile = params.data && params.data.attachmentCount; // Assuming `download` contains file information
    //       const buttonClass = hasFile ? "btn-success" : "btn-danger"; // Change class based on file availability
    //       const buttonText = hasFile ? "Yes" : "No"; // Update button text accordingly
    //       return `<button class="btn ${buttonClass} btn-sm" data-action="download">${buttonText}</button>`;
    //     }
    //   },
    //   editable: false,
    //   colId: "download"
    // },
    {
      headerName: "Actions",
      field: "actions",
      minWidth: 80,
      cellRenderer: (params: any) => {
        const isDisabled = this.isProcessingId !== null && this.isProcessingId !== params.data.expId;
        const buttonId = `review-btn-${params.node.rowIndex}`;
  
        setTimeout(() => {
          const button = document.getElementById(buttonId);
          if (button) {
            button.addEventListener("click", () => this.openSwal(params.data));
          }
        });
  
        return `
          <button id="${buttonId}" class="btn btn-warning btn-sm" ${isDisabled ? "disabled" : ""}>
          <i class="fa fa-eye"></i>
          </button>
        `;
      },
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
gridOptions: GridOptions;
balgridOptions = {
  context: {
    componentParent: this // Allows access to Angular component in cell renderer
},
columnDefs: this.colDefs,
};
    gridApi: GridApi<any>;
    expGridApi: GridApi<any>;
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
    isProcessing: boolean = false; // Track if an action is in progress
    isbalProcessing: boolean = false;
    explength : Number;
    ballength : Number;
    constructor(private activatedRoute: ActivatedRoute,
        private toastr: ToastrService, private router:Router, private userService:UserService, 
        private balanceService: BalanceService, private expenseService: ExpenseService, private attachmentService: AttachmentService, private queryService: QueryService, private employeeService: EmployeeService) {
          this.gridOptions = {
            paginationPageSize: 50,
            pagination: true,
            suppressPaginationPanel: false,
            context: {
            componentParent: this // Allows access to Angular component in cell renderer
        },
        columnDefs: this.colempDefs,
        };
      }

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
        console.log(this.username);
        console.log("EmpId is not null: Requests Component "+ sessionStorage.getItem('empId'));
        this.empId = Number(sessionStorage.getItem('empId'));
        this.isadmin = sessionStorage.getItem('isadmin');
        if(this.isadmin=="true")
        {
          this.balanceService.getsubbalanceRequests().subscribe(res=>{
            console.log(res);
            this.ballength = res.length;
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
                "attachmentCount": "$employee_expenses.attachmentCount",
                "createdAt": "$employee_expenses.createdAt",
                "updatedAt": "$employee_expenses.updatedAt",
                "__v": "$employee_expenses.__v"
              }
            }
          ]
        }
    }
    ngAfterViewInit() {
      this.adjustGridColumns();
    }
     // Function to show only relevant columns on mobile screens
  adjustGridColumns() {
    if (this.agGrid?.api) {
      const isMobile = window.innerWidth <= 768;

      this.agGrid.api.setColumnVisible("empName", !isMobile);
      this.agGrid.api.setColumnVisible("expenseType", !isMobile);
      this.agGrid.api.setColumnVisible("createdAt", !isMobile);
      this.agGrid.api.setColumnVisible("remarks", !isMobile);
      this.agGrid.api.setColumnVisible("status", !isMobile);
      this.agGrid.api.setColumnVisible("download", !isMobile);
    }
  }
    actionCellRenderer(params) {
      if (params.data.Status === 'Completed') {
        return null; // Hide the buttons for completed rows
      }
      let eGui = document.createElement('div');
      let isbalProcessing = params.context.componentParent.isbalProcessing;
      let disabled = isbalProcessing ? 'disabled' : '';
    
      eGui.innerHTML = `
          <button 
            class="btn btn-success btn-sm"
            data-action="approve" ${disabled}>
              Approve
          </button>
          <button 
            class="btn btn-danger btn-sm"
            data-action="reject" ${disabled}>
              Reject
          </button>
      `;
      
      return eGui;
    }
    
    
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
  }

  onexpGridReady(params: GridReadyEvent) {
    this.expGridApi = params.api;

    // Update grid with initial data
    this.subscription = interval(300000).pipe(
      startWith(0),
      switchMap(() => this.queryService.query(this.query)),
      tap(res => {
        const rowData = Array.isArray(res) ? res : [];
        this.expGridApi.setRowData(rowData);
        this.rowexpData = rowData;
        this.explength = this.rowexpData.length;
        console.log(this.rowexpData);
      })
    ).subscribe();
}

openSwal(rowData) {
  if (this.isProcessingId !== null) return;
  Swal.fire({
    title: 'Expense Request Details',
    html: `
    <table class="table align-items-center table-flush">
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Employee No:</td>
      <td style="text-align:left; padding:5px;">${rowData.empNo}</td>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Name:</td>
      <td style="text-align:left; padding:5px;">${rowData.empName}</td>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Project No:</td>
      <td style="text-align:left; padding:5px;">${rowData.projectNumber}</td>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Expense Type:</td>
      <td style="text-align:left; padding:5px;">${rowData.expenseType}</td>
    </tr>
    <tr>
    <td style="text-align:left; font-weight:bold; padding:5px;">No of Workers:</td>
    <td style="text-align:left; padding:5px;">${rowData.noofWorkers}</td>
  </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Amount:</td>
      <td style="text-align:left; padding:5px;">${rowData.amount}</td>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Date:</td>
      <td style="text-align:left; padding:5px;">${new Date(rowData.createdAt).toLocaleDateString()}</td>
    </tr>
    ${rowData.remarks ? `
        <tr>
          <td style="text-align:left; font-weight:bold; padding:5px;">Remarks:</td>
          <td style="text-align:left; padding:5px;">
          ${rowData.remarks}
          </td>
        </tr>` : `<tr>
        <td style="text-align:left; font-weight:bold; padding:5px;">Remarks:</td>
        <td style="text-align:left; padding:5px;">No Remarks</td>
      </tr>`}
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Status:</td>
      <td style="text-align:left; padding:5px;">${rowData.status}</td>
    </tr>
    ${rowData.attachmentCount ? `
        <tr>
          <td style="text-align:left; font-weight:bold; padding:5px;">Attachment:</td>
          <td style="text-align:left; padding:5px;">
            <button id="downloadAttachment" style="background-color:#007bff; color:white; padding:5px 10px; border:none; border-radius:5px; cursor:pointer;">
              Download
            </button>
          </td>
        </tr>` : `<tr>
        <td style="text-align:left; font-weight:bold; padding:5px;">Attachment:</td>
        <td style="text-align:left; padding:5px;">No Attachment</td>
      </tr>`}
  </table>
    `,
    showCancelButton: true,
    confirmButtonText: "Approve",
    cancelButtonText: "Reject",
    showCloseButton: true,
    icon: "info",
    customClass: {
      confirmButton: "btn-success",
      cancelButton: "btn-danger"
    },
    didOpen: () => {
      if (rowData.attachmentCount) {
        document.getElementById("downloadAttachment").addEventListener("click", () => {
        this.attachmentService.getAttachmentByExpId(rowData.expId).subscribe(res => {
          console.log(res);
          if (res.length == 0) {
            this.toastr.warning("No Attachment for this expense");
          }
          else {
            for(var k=0;k<res.length;k++)
            {
            var byteCharacters = atob(res[k].data);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: 'application/octet-stream' });
            var url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = 'Expense' + '-' + rowData.empNo + '-' + rowData.empName + '-' + rowData.projectNumber + '-' + rowData.expenseType + '-' + 'Dt' + '-' + formatDate(rowData.createdAt, 'dd-MM-yyyy', 'en')+'.'+res[k].name.substring(res[k].name.indexOf(".") + 1);
            link.click();
  
            window.URL.revokeObjectURL(url);
          }
          }
        });
      });
      }
    },
    preConfirm: () => {
      return 'approve'; // Identify the action
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.approveexpRequest(rowData);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      this.rejectexpRequest(rowData);
    }
  });
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
    this.isbalProcessing = true; // Disable other buttons
    this.gridApi.refreshCells({ force: true }); // Refresh grid to update button state

    this.balanceService.updatebalanceRequests(rowData._id, {Status:"Completed"}).subscribe(
      response => {
        console.log(response);
        this.toastr.success('Request Approved Successfully.');
        setTimeout(() => {
          this.addBalance = new Balance(rowData.empId, rowData.amount, "C");
          this.addbalance();
          this.isbalProcessing = false; // Re-enable buttons
          this.gridApi.refreshCells({ force: true }); // Refresh grid
        }, 2000);
      });
  }

  addbalance() {
    this.balanceService.addBalance(this.addBalance).subscribe(res => {
      console.log(res);
      this.toastr.warning("Balance Updated Successfully");
      setTimeout(() => window.location.reload(), 700);
    });
  }
  
  rejectRequest(rowIndex: number, rowData: any) {
    this.isbalProcessing = true; // Disable other buttons
    this.gridApi.refreshCells({ force: true }); // Refresh grid to update button state
    
    this.balanceService.updatebalanceRequests(rowData._id, {Status:"Rejected"}).subscribe(
      response => {
        console.log(response);
        this.toastr.error('Request Rejected Successfully.');
        // Delay re-enabling the buttons by 2 seconds
    setTimeout(() => {
      this.isbalProcessing = false; // Re-enable buttons
      this.gridApi.refreshCells({ force: true }); // Refresh grid
      window.location.reload();
    }, 2000);
    });
  }


  onexpCellClicked(params) {
    if (params.column.colId === "download" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "download")
    // if (event.event.target.classList.contains("btn-warning")) {
    //   this.openSwal(event.data); // Now correctly calls the function
    // }
    // if(event.data.attachmentCount)
    {
      this.attachmentService.getAttachmentByExpId(params.data.expId).subscribe(res => {
        console.log(res);
        if (res.length == 0) {
          this.toastr.warning("No Attachment for this expense");
        }
        else {
          for(var k=0;k<res.length;k++)
          {
          var byteCharacters = atob(res[k].data);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var blob = new Blob([byteArray], { type: 'application/octet-stream' });
          var url = window.URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = url;
          link.download = 'Expense:' + '-' + params.data.empNo + '-' + params.data.empName + '-' + params.data.projectNumber + '-' + params.data.expenseType + '-' + 'Dt' + '-' + formatDate(params.data.createdAt, 'dd-MM-yyyy', 'en')+'.'+res[k].name.substring(res[k].name.indexOf(".") + 1);
          link.click();

          window.URL.revokeObjectURL(url);
        }
        }
      })
    }
  }
  else if(params.column.colId === "actions")
  {
    this.openSwal(params.data); // Now correctly calls the function
  }
}

  approveexpRequest(rowData: any) {
    this.isProcessingId = rowData.expId;
    this.expGridApi.refreshCells({ force: true }); // Refresh grid to update button state
  
    this.expenseService.updateExpenseStatusById(rowData.expId, { status: "Approved" }).subscribe(res => {
      console.log(res);
      this.toastr.success('Request Approved Successfully.');
      setTimeout(() => {
        this.addBalance = new Balance(rowData.empId, rowData.amount, "D");
        this.addbalance();
        this.isProcessingId = null; // Unlock the buttons
        this.expGridApi.refreshCells({ force: true });
      }, 1000);
    },
    (error) => {
      this.isProcessingId = null; // Unlock the buttons on error
      this.expGridApi.refreshCells({ force: true });
    }
  );
  }
  
  rejectexpRequest(rowData: any) {
    this.isProcessingId = rowData.expId;
    this.expGridApi.refreshCells({ force: true }); // Refresh grid to update button state
  
    this.expenseService.updateExpenseStatusById(rowData.expId, { status: "Rejected" }).subscribe(res => {
      console.log(res);
      this.toastr.error('Request Rejected Successfully.');
  
      setTimeout(() => {
        this.isProcessingId = null; // Unlock buttons
        this.expGridApi.refreshCells({ force: true });
        window.location.reload();
      }, 1000);
    },
    (error) => {
      this.isProcessingId = null; // Unlock buttons on error
      this.expGridApi.refreshCells({ force: true });
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
