import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/services/Models/project';
import { Balance } from 'src/app/services/Models/balance';
import { DatePipe, formatDate } from '@angular/common';
import { UserService } from 'src/app/services/user-service/user-service';
import { BalanceService } from 'src/app/services/balance-service/balance-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from 'src/app/services/Models/user';
import { Employee } from 'src/app/services/Models/employee';
import { EmployeeService } from 'src/app/services/employee-service/employee-service';
import { ProjectService } from 'src/app/services/project-service/project-service';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';
import * as XLSX from 'xlsx';
import "ag-grid-community";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  UseGroupFooter,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  createGrid,
} from "ag-grid-community";
import { AttachmentService } from 'src/app/services/attachment-service/attachment-service';
import { AuditTrailService } from 'src/app/services/audittrail-service/audittrail-service';
import { ClientSideRowModelModule } from "ag-grid-community";
import { CsvExportModule } from "ag-grid-community";
import { DataService } from 'src/app/data.service';
import { QueryService } from 'src/app/services/query-service/query-service';
import { forkJoin } from 'rxjs';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
]);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  user: User;
  response: User;
  numofusers: null;
  numofemployees: null;
  empres = [];
  fdate: string;
  tdate: string;
  emonth: string;
  bmonth: string; // Selected month in 'YYYY-MM' format
  minMonth: string; // Minimum month selectable
  maxMonth: string; // Maximum month selectable
  transactions: any[] = []; // Store all transactions
  etransactions: any[] = []; // Store all transactions
  filteredTransactions: any[] = []; // Store transactions for the selected month
  numofprojects: number;
  progresscount: number;
  completedcount: number;
  statecount: number;
  project: Project;
  Projects = [];
  projectName: string;
  selectedProject = [];
  projectresponse = [];
  balance = [];
  totalbalance = 0;
  tbalance = 0;
  texpense = 0;
  expense = [];
  expensedetails = [];
  totalexpense = 0;
  projectselected = false;
  test: Date = new Date();
  addBalance: Balance;
  projectNumber: String;
  employeeName: string;
  employee: Employee;
  empId: Number;
  emplId: Number;
  expId: Number;
  balempId: Balance;
  balanceamt = 0;
  gratuityamt: String;
  bonusamt: String;
  fname: String;
  selectedEmployee = [];
  empbalamt = 0;
  nobal = false;
  isadmin: Boolean;
  expenseList = [];
  totalexpofemp: Number;
  projtotalamt: Number;
  fileName: string;
  expprojectId: Number;
  expprojlist = [];
  flattenedData = [];
  flattenedDataProj = [];
  flattenedDataEmp = [];
  rowData = [];
  rowDataProj = [];
  rowDataEmp = [];
  myDefaultValue: number = 1;
  empselected: Number;
  temp = [];
  ballist = [];
  expemplist = [];
  empList = [];
  projList = [];
  expbtn = false;
  empbtn = false;
  projbtn = false;
  allEmpBal = [];
  filteredEmployees : any[] = [];
  filteredEmployees1 : any[] = [];
  filteredEmployees2 : any[] = [];
  filteredProjects : any[] = [];
  searchQuery: string = '';
  searchQuery1: string = '';
  searchQuery2: string = '';
  searchProject: string = '';
  showDropdown: boolean = false;
  showDropdown1: boolean = false;
  showDropdown2: boolean = false;
  showprojDropdown: boolean = false;
  sempId : Number;
  type: string;
  reqcount : Number;
  colNames = ['Group', 'Date', 'Project No', 'Expense Type', 'Remarks','Status', 'Amount'];
  colNamesEmp = ['Group','Type', 'Date', 'Old Value', 'New Value'];
  colNamesProj = ['Group','Project No', 'Date', 'EmpName', 'Worktype', 'Slab', 'Pour', 'Expense Type','No Of Workers', 'Remarks', 'Amount'];
  colNamesBal = ['EmpName','Total Credit','Total Debit', 'Net Balance']
  colDefs: ColDef[] = [
    { headerName: "Date", field: "createdAt", valueFormatter: this.dateFormatter },
    // { headerName: "EmpId", field: "empId" },
    { headerName: "ProjectNo", field: "projectNumber", },
    { headerName: "ExpenseType", field: "expenseType" },
    { headerName: "Remarks", field: "remarks" },
    {
      headerName: "Amount", field: "amount",
      valueParser: "Number(newValue)"
    },
    { headerName: "Status", field: "status"},
    {
      headerName: "Download",
      cellRenderer: function (params) {
        if (params.node.group) {
          return null; // Hide the button for group rows
        } else {
          // Check if a file is available in the download column
          const hasFile = params.data && params.data.attachmentCount; // Assuming `download` contains file information
          const buttonClass = hasFile ? "btn-success" : "btn-secondary"; // Change class based on file availability
          const buttonText = hasFile ? "Download" : "No Attachment"; // Update button text accordingly
          return `<button class="btn ${buttonClass} btn-sm" data-action="download">${buttonText}</button>`;
        }
      },
      editable: false,
      colId: "download"
    }
  ];
  colDefsProj: ColDef[] = [
    { headerName: "Date", field: "createdAt", valueFormatter: this.dateFormatter },
    { headerName: "ProjectNo", field: "projectNumber" },
    { headerName: "EmpName", field: "empName" },
    { headerName: "WorkType", field: "worktype" },
    { headerName: "Slab", field: "floor" },
    { headerName: "Pour", field: "pour" },
    { headerName: "ExpenseType", field:"expenseType"},
    { headerName: "NoofWorkers", field: "noofWorkers" },
    { headerName: "Remarks", field: "remarks" },
    {
      headerName: "Amount", field: "amount",
      valueParser: "Number(newValue)"
    }
  ];
  colDefsEmp: ColDef[] = [
    { headerName: "Type", field: "field", cellStyle: { textTransform: 'capitalize' } },
    { headerName: "Date", field: "date", valueFormatter: this.dateFormatter },
    { headerName: "OldValue", field: "oldValue" },
    { headerName: "NewValue", field: "newValue" },
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

  getRowStyle(params) {

    if (params.node.id == "rowGroupFooter_ROOT_NODE_ID") {
      return { 'font-weight': 'bold', 'color': 'red' };
    }
    return null;
  }
  gridApi: GridApi<any>;
  gridOptions: GridOptions = {
    getRowStyle: this.getRowStyle,
    groupIncludeTotalFooter: true,
    groupIncludeFooter: true,
    suppressAggFuncInHeader: true,
    autoGroupColumnDef: {
      headerName: 'ProjectNo'
    },
    groupRowRenderer: 'groupRowRenderer',
    groupRowRendererParams: {
      suppressCount: true // Hide group count
    }
  }
  groupRowRenderer(params) {
    const rowGroupHeader = document.createElement('div');
    rowGroupHeader.classList.add('ag-row-group');
    rowGroupHeader.textContent = 'Project Number: ' + params.node.key;

    return rowGroupHeader;
  }

  gridOptionsProj: GridOptions = {
    getRowStyle: this.getRowStyle,
    groupIncludeTotalFooter: true,
    groupIncludeFooter: true,
    suppressAggFuncInHeader: true,
    autoGroupColumnDef: {
      headerName: 'WorkType'
    },
  }

  gridOptionsEmp: GridOptions = {
    autoGroupColumnDef: {
      headerName: 'Type'
    }
  }
  

  constructor(private userService: UserService, private router: Router, private employeeService: EmployeeService,
    private projectService: ProjectService, private expenseService: ExpenseService, private attachmentService: AttachmentService,
    private balanceService: BalanceService, private auditService: AuditTrailService, private toastr: ToastrService,
    private dataService: DataService, private queryService: QueryService) {
      const today = new Date();
    
      // Define the current month and the range
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
  
      const minDate = new Date(currentYear, currentMonth - 6, 1); // 6 months ago
      const maxDate = new Date(currentYear, currentMonth, 1);     // Current month
  
      // Format min and max dates as 'YYYY-MM'
      this.minMonth = this.formatMonth(minDate);
      this.maxMonth = this.formatMonth(maxDate);
  
      // Set default value to the current month
      this.bmonth = this.formatMonth(maxDate);
      this.emonth = this.formatMonth(maxDate);

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
    if (sessionStorage.getItem('isadmin') == 'true') {
     //if (this.dataService.getisAdmin() == true) {
      this.router.navigate(['/dashboard']);
      this.userService.getAllUsers().subscribe(res => {
        this.response = res;
        this.numofusers = res.length;
      });
      this.employeeService.getAllEmployees().subscribe(res => {
        this.empres = res;
        this.numofemployees = res.length;
        this.filteredEmployees = this.empres;
        this.filteredEmployees1 = this.empres;
        this.filteredEmployees2 = this.empres;
      });
      this.projectService.getAllProjects().subscribe(res => {
        this.projectresponse = res;
        this.numofprojects = this.projectresponse.length;
        this.filteredProjects = this.projectresponse;
            this.progresscount = 0;
            this.completedcount = 0;
            this.statecount = 0;
        for (var i = 0; i < this.projectresponse.length; i++) {
            if (this.projectresponse[i].status == "InProgress") {
              this.progresscount = this.progresscount + 1;
            }
            else{
              this.completedcount = this.completedcount + 1;
            }
            if(this.projectresponse[i].state)
            {
              const uniqueStates = new Set(this.projectresponse.map(project => project.state));
              this.statecount = uniqueStates.size;
            }
          }
      });
      const balquery = {
        "collectionName": "balances",
        "filter": { "operation": "C"},
        "pipeline": [
          {
            "$group": {
              "_id": null,
              "totalBalance": { "$sum": "$amount" }
            }
          }
        ]
      }
      this.queryService.query(balquery).subscribe(res=>{
        this.tbalance = res[0].totalBalance;
      })
      this.onMonthChange(this.getCurrentMonth());
      const query = {
        "collectionName": "expenses",
        "filter": { },
        "pipeline": [
          {
            "$group": {
              "_id": null,
              "totalExpense": { "$sum": "$amount" }
            }
          }
        ]
      }
      this.queryService.query(query).subscribe(res=>
        {
          this.texpense = res[0].totalExpense;
        });
        this.oneMonthChange(this.getCurrentMonth());      

        const bcount = Number(sessionStorage.getItem('submittedRequestCount'));
        const ecount = Number(sessionStorage.getItem('unApprovedCount'));
        this.reqcount = bcount +  ecount;
        // this.expenseService.getExpenseDetails().subscribe(res => {
        //   this.expensedetails = res;
        // });
    }
    else {
      this.router.navigate(['/home']);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // Additional initialization code...
}
  // Get current month in 'YYYY-MM' format
  private getCurrentMonth(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
  onMonthChange(month: string) {
    const query1 = {
      "collectionName": "balances",
      "filter": {
        "operation": "C"
      },
      "pipeline": [
        {
          "$addFields": {
            "monthYear": { "$dateToString": { "format": "%Y-%m", "date": "$createdAt" } }
          }
        },
        {
          "$match": {
            "monthYear": month
          }
        },
        {
          "$group": {
            "_id": null,
            "totalBalance": { "$sum": "$amount" }
          }
        }
      ]
    };
    this.queryService.query(query1).subscribe(res=>{
      this.totalbalance = res.length>0 ?res[0].totalBalance:0;
    });
    // Add logic here to fetch and display the balance
  }
  oneMonthChange(month: string) {
    const query1 = {
      "collectionName": "expenses",
      "pipeline": [
        {
          "$addFields": {
            "monthYear": { "$dateToString": { "format": "%Y-%m", "date": "$createdAt" } }
          }
        },
        {
          "$match": {
            "monthYear": month
          }
        },
        {
          "$group": {
            "_id": null,
            "totalExpense": { "$sum": "$amount" }
          }
        }
      ]
    };
    this.queryService.query(query1).subscribe(res=>{
      this.totalexpense = res.length>0 ?res[0].totalExpense:0;
    });
    // Add logic here to fetch and display the balance
  }

  private formatMonth(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure two digits
    return `${year}-${month}`;
  }

getexpenses()
{
  let exemp = sessionStorage.getItem('expEmp');
  let exName = sessionStorage.getItem('expName');
  let exNo = sessionStorage.getItem('expNo');
  this.selectEmployee(Number(exemp), exName, exNo,this.type,'false');
}
  filterEmployees(queryKey: string, filteredListKey: string) {
    const query = this[queryKey].toLowerCase();
    this[filteredListKey] = this.empres.filter(emp =>
      `${emp.empNo}: ${emp.username}`.toLowerCase().includes(query)
    );
  }
  filterProjects() { 
    if (this.searchProject) {
      this.filteredProjects = this.projectresponse.filter(proj =>
        `${proj.projectNumber}: ${proj.projectName}`.toLowerCase().includes(this.searchProject.toLowerCase())
      );
    } else {
      this.filteredProjects = this.projectresponse;
    }
  }
 
  selectEmployee(employeeId: Number, employeeName:string, employeeNo: string, status: string, dropdownKey: string) {
    this.sempId = employeeId;
    this.expbtn = true;
    sessionStorage.setItem('expEmp', this.sempId.toString());
    sessionStorage.setItem('expName', employeeName);
    sessionStorage.setItem('expNo', employeeNo);
    this.rowData = [];
    if(employeeId && this.fdate && this.tdate && this.type)
    {
      const query = {
        "collectionName": "expenses",
        "pipeline": [
          {
            "$addFields": {
              "createdDateStr": {
                "$dateToString": {
                  "format": "%Y-%m-%d",
                  "date": "$createdAt"
                }
              }
            }
          },
          {
            "$match": {
              "empId": employeeId,
              "status": this.type,
              "createdDateStr": {
                "$gte": this.fdate,
                "$lte":  this.tdate
              }
            }
          },
          // {
          //   "$lookup": {
          //     "from": "attachments",
          //     "localField": "_id",
          //     "foreignField": "expenseId",
          //     "as": "attachments"
          //   }
          // },
          {
            "$project": {
              "projectNumber": 1,
              "empId": 1,
              "expenseType": 1,
              "amount": 1,
              "remarks": 1,
              "createdAt": 1,
              "status":1,
              "attachmentCount": 1
            }
          }
        ]
      }
      this.queryService.query(query).subscribe(res=>{
        this.totalexpofemp = 0;
        this.rowData = res;
        console.log(this.rowData);
        const groupedData = this.rowData.reduce((groups, item) => {
          const projectNumber = item.projectNumber;
          const group = groups.find(group => group.projectNumber === projectNumber);
          if (group) {
            group.items.push(item);
          } else {
            groups.push({ projectNumber, items: [item] });
          }
          return groups;
        }, []);
        this.flattenedData = [];
        this.flattenedData = groupedData.flatMap(group => [{ projectNumber: group.projectNumber, isGroupHeader: true }, ...group.items]);
        console.log(this.flattenedData);
      });
    }
    this.searchQuery = employeeNo+ " : " + employeeName; // Update the input field
    this[dropdownKey] = false; // Hide the dropdown
  }
  ontypeChange()
  {
    console.log(this.type);
  }
  expclick() {
    this.exporttoExcel(this.flattenedData, this.colNames, this.searchQuery)
  }
  empclick() {
    this.exporttoExcelEmp(this.flattenedDataEmp, this.colNamesEmp)
  }
  projclick() {
    this.exporttoExcelProj(this.flattenedDataProj, this.colNamesProj)
  }
  allempbalclick() {
    this.balanceService.getallEmpBalance().subscribe(
      (res) => {
        this.allEmpBal = res.map((item) => [
          item.firstName,
          item.totalCredit,
          item.totalDebit,
          item.netBalance,
        ]);
        
        // Proceed with exporting to Excel only after data is ready
        this.exporttoExcelAllEmpBal(this.allEmpBal, this.colNamesBal);
      },
      (error) => {
        console.error('Error fetching employee balances:', error);
      }
    );
  }
  
  hideDropdown(dropdownKey: string) {
    setTimeout(() => {
      this[dropdownKey] = false;
    }, 200); // Delay to allow click event
  }
  hideProjDropdown() {
    setTimeout(() => this.showprojDropdown = false, 200); // Delay to allow click event
  }
  exporttoExcel(data, columnNames, employeeName) {
    try {
      let empName = "";
      empName = employeeName;
      if (data.length > 0) {
        this.expemplist = [];
        this.expemplist.push(['Employee Name:'+ empName]);
        let totalamt = 0;
        for (var i = 0; i < data.length; i++) {
          if(data[i].isGroupHeader)
          {
            this.expemplist.push(["ProjectNumber: "+data[i].projectNumber])
          }
          else{
            this.expemplist.push(["", formatDate(data[i].createdAt, "dd-MM-yyyy", "en"), data[i].projectNumber, data[i].expenseType, data[i].remarks, data[i].status, data[i].amount])
          totalamt = totalamt + data[i].amount;
          }
        }
        this.expemplist.push(['Total', null, null, null, null, null, totalamt]);
        this.fileName = "";
        this.fileName = 'Employee-Expense-Data--'+ empName + '-Dt-' + formatDate(new Date, 'dd-MM-yyyy', 'en');
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Add a header row with custom column names
        const header = columnNames.map(name => ({ v: name }));
        const wsData = [header, ...this.expemplist];

        // Convert data to worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Expense Data');

        // Save workbook to Excel file
        XLSX.writeFile(wb, this.fileName + '.xlsx');
      }
      else {
        this.toastr.warning("No Data to Export");
      }
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
    }
  }

  exporttoExcelEmp(data, columnNames) {
    try {
      let empName = "";
      if (data.length > 0) {
        this.empList = [];
        for(var k=0;k<this.empres.length;k++)
        {
          if(this.empres[k]._id == this.empselected)
          {
            empName = this.empres[k].firstname;
          }
        }
        this.empList.push(['Employee Name:'+ empName]);
        for (var i = 0; i < data.length; i++) {
          if(data[i].isGroupHeader)
          {
            this.empList.push(["Type: "+data[i].Type.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase())])
          }
          else{
          this.empList.push(["",data[i].field.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase()), formatDate(data[i].date, "dd-MM-yyyy", "en"), data[i].oldValue, data[i].newValue])
        }
      }
        this.fileName = "";
        this.fileName = 'Employee-Change-History--' + empName + '-Dt-' + formatDate(new Date, 'dd-MM-yyyy', 'en');
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Add a header row with custom column names
        const header = columnNames.map(name => ({ v: name }));
        const wsData = [header, ...this.empList];

        // Convert data to worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Employee Data');

        // Save workbook to Excel file
        XLSX.writeFile(wb, this.fileName + '.xlsx');
      }
      else {
        this.toastr.warning("No Data to Export");
      }
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
    }
  }

  exporttoExcelProj(data, columnNames) {
    try {
      let projName = this.searchProject;
      let totalamt = 0;
      if (data.length > 0) {
        this.projList = [];
        // for(var k=0;k<this.projectresponse.length;k++)
        // {
        //   if(this.projectresponse[k].projectNumber == this.expprojectId)
        //   {
        //     projName = this.projectresponse[k].projectName;
        //   }
        // }
        this.projList.push(['Project: '+ projName]);
        for (var i = 0; i < data.length; i++) {
          if(data[i].isGroupHeader)
          {
            this.projList.push(["WorkType: "+data[i].worktype])
          }
          else{
          this.projList.push(["",data[i].projectNumber, formatDate(data[i].createdAt, "dd-MM-yyyy", "en"), data[i].empName, data[i].worktype, data[i].floor, data[i].pour, data[i].expenseType, data[i].noofWorkers, data[i].remarks, data[i].amount])
          totalamt = totalamt + data[i].amount;
        }
      }
      this.projList.push(['Total', null,null,null, null, null, null, null,null,null, totalamt]);
       this.fileName = "";
       this.fileName = 'Project-Expense-Data--' + projName + '-Dt-' + formatDate(new Date, 'dd-MM-yyyy', 'en');;
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Add a header row with custom column names
        const header = columnNames.map(name => ({ v: name }));
        const wsData = [header, ...this.projList];

        // Convert data to worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Project Expense Data');

        // Save workbook to Excel file
        XLSX.writeFile(wb, this.fileName + '.xlsx');
      }
      else {
        this.toastr.warning("No Data to Export");
      }
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
    }
  }
  exporttoExcelAllEmpBal(data, columnNames) {
    try {
      if (data.length > 0) {
       this.fileName = "";
       this.fileName = 'All-Employee-Balance--' + '-Dt-' + formatDate(new Date, 'dd-MM-yyyy', 'en');;
        // Create a new workbook
        const wb = XLSX.utils.book_new();

        // Add a header row with custom column names
        const header = columnNames.map(name => ({ v: name }));
        const wsData = [header, ...this.allEmpBal];

        // Convert data to worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, 'All Employee Balance');

        // Save workbook to Excel file
        XLSX.writeFile(wb, this.fileName + '.xlsx');
      }
      else {
        this.toastr.warning("No Data to Export");
      }
    } catch (error) {
      console.error('Error exporting data to Excel:', error);
    }
  }

  addbalance() {
    this.addBalance = new Balance(this.emplId, this.balanceamt, "C")
    this.balanceService.addBalance(this.addBalance).subscribe(res => {
      console.log(res);
      this.toastr.success("Balance Updated Successfully");
      this.balanceService.getbalbyId(this.emplId).subscribe(res=>{
        console.log(res);
        this.empbalamt = res[0].netAmount;
      });
      // this.router.navigate(['/dashboard']).then(() => {
      //   setTimeout(() => window.location.reload(), 700);
      // });
      //this.router.navigate(['/dashboard']);
      this.balanceamt = null;
    });
  }
  clearSearch() {
      this.searchQuery = '';
      this.expbtn = false;
      this.type = undefined;
      // this.fdate = null;
      // this.tdate = null;
      this.rowData = [];
      this.filteredEmployees = [...this.empres];
  }
  clearSearch1(){
    this.searchQuery1 = ''; // Clear the search query
    this.empbalamt = null;
    this.filteredEmployees1 = [...this.empres]; // Reset the filtered list (assuming employees is the original list)  
  }
  clearSearch2(){
    this.searchQuery2 = '';
    this.empbtn = false;
    this.rowDataEmp = [];
    this.filteredEmployees2 = [...this.empres];
  }
  clearProject(){
    this.searchProject = '';
    this.projbtn = false;
    this.rowDataProj = [];
    this.filteredProjects = [...this.projectresponse];
  }
  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  onprojectvalueChange() {
    console.log(this.projectNumber);
  }
  onempvalueChange() {
    console.log(this.empId);
  }
  onempChange(empid: number, empName: string, empNo: string) {
    this.empselected = empid;
    this.empbtn = true;
    sessionStorage.setItem('empch', this.empselected.toString());
  
    const getbalquery = {
      collectionName: 'balances',
      pipeline: [
        {
          $match: {
            operation: 'C', // Filter documents where operation is "C"
            empId: this.empselected,
          },
        },
      ],
    };
  
    // Make both service calls
    const auditTrail$ = this.auditService.getEmployeeUpdates();
    const balances$ = this.queryService.query(getbalquery);
  
    // Use forkJoin to wait for both service calls to complete
    forkJoin([auditTrail$, balances$]).subscribe(
      ([auditTrailResponse, balanceResponse]) => {
        this.temp = auditTrailResponse;
        this.balance = balanceResponse;
  
        // Process audit trail data
        this.rowDataEmp = [];
        for (let i = 0; i < this.temp.length; i++) {
          if (
            this.empselected === this.temp[i]._id &&
            (this.temp[i].field === 'gratuity' || this.temp[i].field === 'bonus')
          ) {
            this.rowDataEmp.push(this.temp[i]);
          }
        }
  
        // Process balance data
        for (let k = 0; k < this.balance.length; k++) {
          this.rowDataEmp.push({
            field: 'Balance',
            date: this.balance[k].createdAt,
            oldValue: 0,
            newValue: this.balance[k].amount,
          });
        }
  
        // Group and flatten data
        const groupedData = this.rowDataEmp.reduce((groups, item) => {
          const field = item.field;
          const group = groups.find((group) => group.field === field);
          if (group) {
            group.items.push(item);
          } else {
            groups.push({ field, items: [item] });
          }
          return groups;
        }, []);
        this.flattenedDataEmp = groupedData.flatMap((group) => [
          { Type: group.field, isGroupHeader: true },
          ...group.items,
        ]);
  
        console.log(this.flattenedDataEmp);
      },
      (error) => {
        console.error('Error during service calls:', error);
      }
    );
  
    // Update search query
    this.searchQuery2 = `${empNo} : ${empName}`;
  }
  
  onemplvalueChange() {
    console.log(this.emplId);
    if (this.emplId) {
      for (var i = 0; i < this.empres.length; i++) {
        if (this.empres[i]._id == this.emplId) {
          this.fname = this.empres[i].firstname;
        }
      }
      //this.getbalbyId(this.emplId);
    }
    else
      this.fname = "Select Employee";
  }

  onprojChange(expprojectId: number, expProjNumber: string, expProjName: string) {
    this.projbtn = true; // Enable project button
    this.expprojlist = []; // Clear the project list
    this.projtotalamt = 0; // Reset total amount
    this.rowDataProj = []; // Reset grid data
  
    const projquery = {
      collectionName: 'expenses',
      pipeline: [
        {
          $match: {
            projectNumber: expProjNumber,
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'empId',
            foreignField: '_id',
            as: 'employee',
          },
        },
        {
          $unwind: '$employee',
        },
        {
          $project: {
            _id: 0, // Exclude _id field
            expenseId: '$_id',
            amount: 1, // Include fields from expenses collection
            createdAt: 1,
            employeeId: '$employee._id',
            empName: '$employee.firstname', // Include fields from employees collection
            projectNumber: 1,
            expenseType: 1,
            floor: 1,
            pour: 1,
            noofWorkers: 1,
            worktype: 1,
            remarks: 1,
          },
        },
      ],
    };
  
    // Service call to fetch project data
    this.queryService.query(projquery).subscribe(
      (res) => {
        this.expensedetails = res; // Assign response to expensedetails
        sessionStorage.setItem('expProject', expProjNumber); // Save project number in session storage
  
        // Process response data
        for (let i = 0; i < this.expensedetails.length; i++) {
          this.projtotalamt += this.expensedetails[i].amount; // Calculate total amount
          this.rowDataProj.push(this.expensedetails[i]); // Push data to grid array
        }
  
        // Group and flatten data for display
        const groupedData = this.rowDataProj.reduce((groups, item) => {
          const worktype = item.worktype;
          const group = groups.find((group) => group.worktype === worktype);
          if (group) {
            group.items.push(item);
          } else {
            groups.push({ worktype, items: [item] });
          }
          return groups;
        }, []);
  
        this.flattenedDataProj = groupedData.flatMap((group) => [
          { worktype: group.worktype, isGroupHeader: true },
          ...group.items,
        ]);
  
        // Update AG Grid data
        this.gridApi.setRowData(this.rowDataProj);
  
        //console.log(this.flattenedDataProj); // Log grouped and flattened data
      },
      (error) => {
        console.error('Error fetching project data:', error); // Handle errors
      }
    );
  
    // Update the search project field and close dropdown
    this.searchProject = `${expProjNumber} : ${expProjName}`;
    this.showprojDropdown = false;
  }
  
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === "download" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "download") {
        this.attachmentService.getAttachmentByExpId(params.data._id).subscribe(res => {
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
            link.download = 'Employee' + '-' + this.searchQuery + '-' + params.data.projectNumber + '-' + params.data.expenseType + '-' + 'Dt' + '-' + formatDate(params.data.createdAt, 'dd-MM-yyyy', 'en')+'.'+res[k].name.substring(res[k].name.indexOf(".") + 1);
            link.click();

            window.URL.revokeObjectURL(url);
          }
          }
        })
      }
    }
  }
  getbalbyId(empId: Number,empName: String ,empNo:Number) {
    this.emplId = empId;
    this.empbalamt = 0;
    this.balanceService.getbalbyId(empId).subscribe(res => {
      console.log(res);
      if (res.length != 0) {
        this.nobal = false;
        this.empbalamt = res[0].netAmount;
      }
      else {
        this.nobal = true;
      }
    });
    this.searchQuery1 = empNo+ " : " + empName; // Update the input field
  }
  projects() {
    this.router.navigate(['/projects']);
  }
  employees() {
    this.router.navigate(['/employees']);
  }
}
