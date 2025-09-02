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
  isbalProcessingId: number | null = null;
  colDefs: ColDef[] = [
    { headerName: "EmployeeNo", field: "empno", minWidth: 80,},
    { headerName: "Name", field: "empname", minWidth: 80,},
    { headerName: "Amount", field: "amount", minWidth: 80, },
    // { headerName: "Date", field: "createdAt", valueFormatter: this.dateFormatter, minWidth: 100,  },
    // { headerName: "Status",field: "Status", minWidth: 100, },
    {
      headerName: "Action",
      field: "action",
      minWidth: 80,
      cellRenderer: (params: any) => {
        const isDisabled = this.isbalProcessingId !== null && this.isbalProcessingId !== params.data.id;
        const buttonId = `reviewbal-btn-${params.node.rowIndex}`;
  
        setTimeout(() => {
          const button = document.getElementById(buttonId);
          if (button) {
            button.addEventListener("click", () => this.openbalSwal(params.data));
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
  colempDefs : ColDef[] = [
    { headerName: "EmpNo", field: "empno", minWidth: 70,},
    { headerName: "Name", field: "firstname", minWidth: 80,},
    { headerName: "ProjectNo", field: "projectnumber", minWidth: 80, },
    { headerName: "ExpType", field: "expensetype", minWidth: 120, },
    { headerName: "Amount", field: "amount", minWidth: 80, },
    { headerName: "Date", field: "createdat", valueFormatter: this.dateFormatter, minWidth: 100,  },
    { headerName: "Remarks",field: "remarks", minWidth: 150,},
    { headerName: "Status",field: "status", minWidth: 120, },
    {
      headerName: "Action",
      field: "actions",
      minWidth: 80,
      cellRenderer: (params: any) => {
        const isDisabled = this.isProcessingId !== null && this.isProcessingId !== params.data.id;
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
gridOptions: GridOptions;
balgridOptions : GridOptions;
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
        this.balgridOptions = {
            paginationPageSize: 50,
            pagination: true,
            suppressPaginationPanel: false,
            context: {
            componentParent: this // Allows access to Angular component in cell renderer
        },
        columnDefs: this.colDefs,
        }
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
        this.query = `SELECT
        e.id as empid,
        e.empno,
        e.firstname,
        ex.id,
        ex.projectnumber,
        ex.expensetype,
        ex.amount,
        ex.noofworkers,
        ex.pour,
        ex.floor,
        ex.worktype,
        ex.remarks,
        ex.status,
        ex.attachmentcount,
        ex.createdat,
        ex.updatedat
      FROM employees e
      JOIN expenses ex ON e.id = ex.empid
      WHERE e.manager = '${this.username}'
      AND ex.status = 'UnApproved';
      `;
    }
    ngAfterViewInit() {
      this.adjustexpGridColumns();
      this.adjustbalGridColumns();
    }
     // Function to show only relevant columns on mobile screens
  adjustexpGridColumns() {
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
  adjustbalGridColumns() {
    if (this.agGrid?.api) {
      const isMobile = window.innerWidth <= 768;

      this.agGrid.api.setColumnVisible("createdAt", !isMobile);
      this.agGrid.api.setColumnVisible("Status", !isMobile);
    }
  } 
  //   onGridReady(params: GridReadyEvent) {
  //     this.gridApi = params.api;
  //      // Update grid with initial data
  //      this.isadmin = sessionStorage.getItem('isadmin');
  //      if(this.isadmin=="true")
  //      {
  //        this.balanceService.getsubbalanceRequests().subscribe(res=>{
  //          console.log(res);
  //          this.ballength = res.length;
  //          this.rowData = res;
  //          this.balancereq = true;
  //        });
  //      }
  // }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.isadmin = sessionStorage.getItem('isadmin');
  
    if (this.isadmin === "true") {
      this.subscription = interval(300000).pipe(
        startWith(0),
        switchMap(() => this.balanceService.getsubbalanceRequests()),
        tap(res => {
          const rowData = Array.isArray(res) ? res : [];
          this.gridApi.setRowData(rowData);
          this.rowData = rowData;
          this.ballength = rowData.length;
          this.balancereq = true;
          console.log(this.rowData);
        })
      ).subscribe();
    }
  }

  onexpGridReady(params: GridReadyEvent) {
    this.expGridApi = params.api;

    // Update grid with initial data
    this.subscription = interval(300000).pipe(
      startWith(0),
      switchMap(() => this.queryService.query(this.query)),
      tap(res => {
        const rowData = Array.isArray(res.data) ? res.data : [];
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
      <td style="text-align:left; padding:5px;">${rowData.empno}</td>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Name:</td>
      <td style="text-align:left; padding:5px;">${rowData.firstname}</td>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Project No:</td>
      <td style="text-align:left; padding:5px;">${rowData.projectnumber}</td>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Expense Type:</td>
      <td style="text-align:left; padding:5px;">${rowData.expensetype}</td>
    </tr>
    <tr>
    <td style="text-align:left; font-weight:bold; padding:5px;">No of Workers:</td>
    <td style="text-align:left; padding:5px;">${rowData.noofworkers}</td>
  </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Amount:</td>
      <td style="text-align:left; padding:5px;">${rowData.amount}</td>
    </tr>
    <tr>
      <td style="text-align:left; font-weight:bold; padding:5px;">Date:</td>
      <td style="text-align:left; padding:5px;">${new Date(rowData.createdat).toLocaleDateString()}</td>
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
    ${rowData.attachmentcount ? `
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
      if (rowData.attachmentcount) {
        document.getElementById("downloadAttachment").addEventListener("click", () => {
          this.attachmentService.getAttachmentByExpId(rowData.id,'expense').subscribe(res => {
            if (!res || res.length === 0) {
              this.toastr.warning("No Attachment for this expense");
              return;
            }
      
            for (let k = 0; k < res.length; k++) {
              const attachment = res[k];
      
              this.attachmentService.downloadAttachment(attachment.id).subscribe(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
      
                link.href = url;
                link.download = 'Expense' + '-' + rowData.empno + '-' + rowData.firstname + '-' + rowData.projectnumber + '-' + rowData.expensetype + '-' + 'Dt' + '-' + formatDate(rowData.createdat, 'dd-MM-yyyy', 'en')+'.'+res[k].filename.substring(res[k].filename.indexOf(".") + 1);
                link.click();
      
                window.URL.revokeObjectURL(url);
              }, error => {
                this.toastr.error("Error downloading attachment");
              });
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
      this.openbalSwal(params.data);
    }
  }
  openbalSwal(rowData) {
    if (this.isbalProcessingId !== null) return;
    Swal.fire({
      title: 'Balance Request Details',
      html: `
      <table class="table align-items-center table-flush">
      <tr>
        <td style="text-align:left; font-weight:bold; padding:5px;">Employee No:</td>
        <td style="text-align:left; padding:5px;">${rowData.empno}</td>
      </tr>
      <tr>
        <td style="text-align:left; font-weight:bold; padding:5px;">Name:</td>
        <td style="text-align:left; padding:5px;">${rowData.empname}</td>
      </tr>
      <tr>
        <td style="text-align:left; font-weight:bold; padding:5px;">Amount:</td>
        <td style="text-align:left; padding:5px;">${rowData.amount}</td>
      </tr>
      <tr>
        <td style="text-align:left; font-weight:bold; padding:5px;">Date:</td>
        <td style="text-align:left; padding:5px;">${new Date(rowData.createdat).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="text-align:left; font-weight:bold; padding:5px;">Status:</td>
        <td style="text-align:left; padding:5px;">${rowData.status}</td>
      </tr>
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
      preConfirm: () => {
        return 'approve'; // Identify the action
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveRequest(rowData);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.rejectRequest(rowData);
      }
    });
  }
  approveRequest(rowData: any) {
    this.isbalProcessingId = rowData.id; // Disable other buttons
    this.gridApi.refreshCells({ force: true }); // Refresh grid to update button state

    this.balanceService.updatebalanceRequests(rowData.id, {status:"Completed"}).subscribe(
      response => {
        console.log(response);
        this.toastr.success('Request Approved Successfully.');
        setTimeout(() => {
          this.addBalance = new Balance(rowData.empid, rowData.amount, "C");
          this.addbalance();
          // Remove the approved/rejected row
          this.rowData = this.rowData.filter(item => item.id !== rowData.id);
          this.gridApi.setRowData([...this.rowData]); // Update grid data
          this.isbalProcessingId = null;
        }, 1000);
      });
  }

  addbalance() {
    this.balanceService.addBalance(this.addBalance).subscribe(res => {
      console.log(res);
      this.toastr.warning("Balance Updated Successfully");
    });
  }
  
  rejectRequest(rowData: any) {
    this.isbalProcessingId = rowData.id; // Disable other buttons
    this.gridApi.refreshCells({ force: true }); // Refresh grid to update button state
    
    this.balanceService.updatebalanceRequests(rowData.id, {status:"Rejected"}).subscribe(
      response => {
        console.log(response);
        this.toastr.error('Request Rejected Successfully.');
      setTimeout(() => {
         // Remove the approved/rejected row
         this.rowData = this.rowData.filter(item => item.id !== rowData.id);
         this.gridApi.setRowData([...this.rowData]); // Update grid data
         this.isbalProcessingId = null;
    }, 1000);
  },
    (error) => {
      this.isbalProcessingId = null; // Unlock buttons on error
      this.gridApi.refreshCells({ force: true });
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
      this.attachmentService.getAttachmentByExpId(params.data.id,'expense').subscribe(res => {
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
          link.download = 'Expense:' + '-' + params.data.empno + '-' + params.data.firstname + '-' + params.data.projectnumber + '-' + params.data.expensetype + '-' + 'Dt' + '-' + formatDate(params.data.createdat, 'dd-MM-yyyy', 'en')+'.'+res[k].name.substring(res[k].filename.indexOf(".") + 1);
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
  this.isProcessingId = rowData.id;
  this.expGridApi.refreshCells({ force: true });

  this.expenseService.approveExpenseWithBalance(rowData.id, rowData.empid, rowData.amount)
    .subscribe(res => {
      this.toastr.success('Request Approved and Balance Updated Successfully.');

      this.rowexpData = this.rowexpData.filter(item => item.id !== rowData.id);
      this.expGridApi.setRowData([...this.rowexpData]);
      this.isProcessingId = null; // ✅ move this here
    }, error => {
      this.toastr.error('Approval failed. Please try again.');
      this.isProcessingId = null; // ✅ and here
    });
}
  
  rejectexpRequest(rowData: any) {
    this.isProcessingId = rowData.id;
    this.expGridApi.refreshCells({ force: true }); // Refresh grid to update button state
  
    this.expenseService.updateExpenseStatusById(rowData.id, { status: "Rejected" }).subscribe(res => {
      console.log(res);
      this.toastr.error('Request Rejected Successfully.');
  
      setTimeout(() => {
        // Remove the approved/rejected row
        this.rowexpData = this.rowexpData.filter(item => item.id !== rowData.id);
        this.expGridApi.setRowData([...this.rowexpData]); // Update grid data
        this.isProcessingId = null; // Re-enable buttons // Unlock the buttons
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
