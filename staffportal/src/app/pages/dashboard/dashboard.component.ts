import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/services/Models/project';
import { Balance } from 'src/app/services/Models/balance';
import { DatePipe, NumberFormatStyle, formatDate } from '@angular/common';
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
import { LabourRecordService } from 'src/app/services/labourrecord-service/labourrecord-service';
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
  private searchTimeout: any;
  user: User;
  response: User;
  numofusers: null;
  numofemployees: null;
  empres = [];
  fdate: string;
  tdate: string;
  frdate: string;
  trdate: string;
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
  labourrecorddetails = [];
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
  flattenedDatalRecord = [];
  rowData = [];
  rowDataProj = [];
  rowDataEmp = [];
  rowDatalRecord = [];
  myDefaultValue: number = 1;
  empselected: Number;
  temp = [];
  ballist = [];
  expemplist = [];
  empList = [];
  projList = [];
  lrecordList = [];
  expbtn = false;
  empbtn = false;
  projbtn = false;
  projbtn1 = false;
  allEmpBal = [];
  filteredEmployees : any[] = [];
  filteredEmployees1 : any[] = [];
  filteredEmployees2 : any[] = [];
  filteredProjects : any[] = [];
  filteredProjects1 : any[] = [];
  searchQuery: string = '';
  searchQuery1: string = '';
  searchQuery2: string = '';
  searchProject: string = '';
  searchProject1: string = '';
  showDropdown: boolean = false;
  showDropdown1: boolean = false;
  showDropdown2: boolean = false;
  showprojDropdown: boolean = false;
  showlRecordDropdown: boolean = false;
  sempId : Number;
  type: string;
  reqcount : Number;
  colNames = ['Group', 'Date', 'Project No', 'Expense Type','No Of Workers', 'Remarks','Status', 'Amount'];
  colNamesEmp = ['Group','Type', 'Date', 'Old Value', 'New Value'];
  colNamesProj = ['Group','Project No', 'Date', 'EmpName', 'Worktype', 'Slab', 'Pour', 'Expense Type','No Of Workers', 'Remarks', 'Amount'];
  colNamesBal = ['EmpName','Total Credit','Total Debit', 'Net Balance'];
  colNameslrecord = ['Group','Date','Project No','Slab','Pour','Worker Name', 'Worker Type','No Of Workers', 'In-Time','Out-Time'];
  colDefs: ColDef[] = [
    { headerName: "Date", field: "createdat", valueFormatter: this.dateFormatter },
    // { headerName: "EmpId", field: "empId" },
    { headerName: "ProjectNo", field: "projectnumber", },
    { headerName: "ExpenseType", field: "expensetype" },
    { headerName: "NoOfWorkers", field: "noofworkers" },
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
          const hasFile = params.data && params.data.attachmentcount; // Assuming `download` contains file information
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
    { headerName: "Date", field: "createdat", valueFormatter: this.dateFormatter },
    { headerName: "ProjectNo", field: "projectnumber" },
    { headerName: "EmpName", field: "empname" },
    { headerName: "WorkType", field: "worktype" },
    { headerName: "Slab", field: "floor" },
    { headerName: "Pour", field: "pour" },
    { headerName: "ExpenseType", field:"expensetype"},
    { headerName: "NoofWorkers", field: "noofworkers" },
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
  colDefslRecord: ColDef[] = [
    { headerName: "Date", field: "creationdate", valueFormatter: this.dateFormatter },
    { headerName: "ProjectNo", field: "projectnumber" },
    { headerName: "WorkType", field: "worktype" },
    { headerName: "Slab", field: "floor" },
    { headerName: "Pour", field: "pour" },
    { headerName: "WorkerName", field: "workername" },
    { headerName: "WorkerType", field: "workertype" },
    { headerName: "NoofWorkers", field: "noofworkers" },
    { headerName: "In-Time", field: "intime" },
    { headerName: "Out-Time", field: "outtime" },
    {
      headerName: "Download",
      cellRenderer: function (params) {
        if (params.node.group) {
          return null; // Hide the button for group rows
        } else {
          // Check if a file is available in the download column
          const hasFile = params.data && params.data.attachmentcount; // Assuming `download` contains file information
          const buttonClass = hasFile ? "btn-success" : "btn-secondary"; // Change class based on file availability
          const buttonText = hasFile ? "Download" : "No Attachment"; // Update button text accordingly
          return `<button class="btn ${buttonClass} btn-sm" data-action="download">${buttonText}</button>`;
        }
      },
      editable: false,
      colId: "download"
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

  getRowStyle(params) {

    if (params.node.id == "rowGroupFooter_ROOT_NODE_ID") {
      return { 'font-weight': 'bold', 'color': 'red' };
    }
    return null;
  }
  gridApi: GridApi<any>;
  gridApi1: GridApi<any>;
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
    private dataService: DataService, private queryService: QueryService, private labourrecordService: LabourRecordService) {
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
    this.trdate = `${year}-${month}-${day}`;

    tenday.setDate(today.getDate() - 30); // Subtract 30 days
    const tyear = tenday.getFullYear();
    const tmonth = String(tenday.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const tday = String(tenday.getDate()).padStart(2, '0');

    this.fdate = `${tyear}-${tmonth}-${tday}`;
    this.frdate = `${tyear}-${tmonth}-${tday}`;

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
        console.log(this.filteredEmployees1);
        this.filteredEmployees2 = this.empres;
      });
      this.projectService.getAllProjects().subscribe(res => {
        this.projectresponse = res;
        this.numofprojects = this.projectresponse.length;
        this.filteredProjects = this.projectresponse;
        this.filteredProjects1 = this.projectresponse;
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
      const balquery = `Select COALESCE(sum(amount), 0) totalBalance from balances b where operation = 'C'`;
      this.queryService.query(balquery).subscribe(res=>{
        this.tbalance = res.data[0].totalbalance;
      })
      this.onMonthChange(this.getCurrentMonth());
      const query = `select COALESCE(sum(amount), 0) totalExpense from expenses`;
      this.queryService.query(query).subscribe(res=>
        {
          this.texpense = res.data[0].totalexpense;
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
onGridReady1(params: GridReadyEvent) {
  this.gridApi1 = params.api;
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
    const query1 = `SELECT SUM(amount)
                    FROM balances
                    WHERE operation = 'C'
                    AND TO_CHAR(createdat, 'YYYY-MM') = '${month}'`;
    this.queryService.query(query1).subscribe(res=>{
      this.totalbalance = res.data[0].sum>0 ?res.data[0].sum:0;
    });
    // Add logic here to fetch and display the balance
  }
  oneMonthChange(month: string) {
    const query1 = `SELECT SUM(amount)
                    FROM expenses
                    WHERE TO_CHAR(createdat, 'YYYY-MM') = '${month}'`;
    this.queryService.query(query1).subscribe(res=>{
      this.totalexpense = res.data[0].sum>0 ?res.data[0].sum:0;
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
  const rawQuery = this[queryKey] || '';
  const query = rawQuery.toLowerCase().replace(/[^a-z0-9]/gi, '');

  this[filteredListKey] = this.empres.filter(emp => {
    const empText = `${emp.empno}${emp.firstname || emp.username || ''}`
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '');
    
    return empText.includes(query);
  });
}

filterProjectsGeneric(searchValue: string, target: 'filteredProjects' | 'filteredProjects1') {
  clearTimeout(this.searchTimeout);
  this.searchTimeout = setTimeout(() => {
    if (searchValue) {
      this[target] = this.projectresponse.filter(proj =>
        `${proj.projectnumber}: ${proj.projectname}`.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this[target] = this.projectresponse;
    }
  }, 200);
}
 
  selectEmployee(employeeId: NumberFormatStyle, employeeName:string, employeeNo: string, status: string, dropdownKey: string) {
    this.sempId = employeeId;
    this.expbtn = true;
    sessionStorage.setItem('expEmp', this.sempId.toString());
    sessionStorage.setItem('expName', employeeName);
    sessionStorage.setItem('expNo', employeeNo);
    this.rowData = [];
    if(employeeId && this.fdate && this.tdate && this.type)
    {
      const startDate = new Date(this.fdate).toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const endDate = new Date(this.tdate).toISOString().slice(0, 10);
      const query = `Select 
      id,
      projectnumber, 
      empid, 
      expensetype,
      noofworkers, 
      amount, 
      remarks, 
      createdat, 
      status, 
      attachmentcount
      FROM expenses
      Where empid= ${employeeId}
      AND status= '${this.type}'
      AND createdat >= '${startDate}'
      AND createdat <= '${endDate}';`;
      this.queryService.query(query).subscribe(res=>{
        this.totalexpofemp = 0;
        this.rowData = res.data;
        console.log(this.rowData);
        const groupedData = this.rowData.reduce((groups, item) => {
          const projectNumber = item.projectnumber;
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
  recordclick(){
    this.exporttoExcellRecord(this.flattenedDatalRecord, this.colNameslrecord)
  }
  allempbalclick() {
    this.balanceService.getallEmpBalance().subscribe(
      (res) => {
        console.log(res);
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
  hidelRecordDropdown() {
    setTimeout(() => this.showlRecordDropdown = false, 200); // Delay to allow click event
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
            this.expemplist.push(["", formatDate(data[i].createdat, "dd-MM-yyyy", "en"), data[i].projectnumber, data[i].expensetype, data[i].noofworkers, data[i].remarks, data[i].status, data[i].amount])
          totalamt = totalamt + data[i].amount;
          }
        }
        this.expemplist.push(['Total', null, null, null, null, null, null, totalamt]);
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
      let empNo = "";
      if (data.length > 0) {
        this.empList = [];
        for(var k=0;k<this.empres.length;k++)
        {
          if(this.empres[k].id == this.empselected)
          {
            empName = this.empres[k].firstname;
            empNo = this.empres[k].empno;
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
        this.fileName = 'Employee-Change-History--' + empNo +'-'+ empName + '-Dt-' + formatDate(new Date, 'dd-MM-yyyy', 'en');
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
        this.projList.push(['Project: '+ projName]);
        for (var i = 0; i < data.length; i++) {
          if(data[i].isGroupHeader)
          {
            this.projList.push(["WorkType: "+data[i].worktype])
          }
          else{
          this.projList.push(["",data[i].projectnumber, formatDate(data[i].createdat, "dd-MM-yyyy", "en"), data[i].empname, data[i].worktype, data[i].floor, data[i].pour, data[i].expensetype, data[i].noofworkers, data[i].remarks, data[i].amount])
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
  exporttoExcellRecord(data, columnNames){
    try {
      let projName = this.searchProject1;
      if (data.length > 0) {
        this.lrecordList = [];
        this.lrecordList.push(['Project: ' + projName]);
  
        let groupedByWorktype: any = {};
        let grandTotal = 0, grandContract = 0, grandOthers = 0;
  
        // First, group data by worktype and date
        for (const row of data) {
          if (row.isGroupHeader) {
            continue; // Skip header marker rows
          }
  
          const wt = row.worktype || 'Others';
          const date = formatDate(row.creationdate, "dd-MM-yyyy", "en");
  
          if (!groupedByWorktype[wt]) groupedByWorktype[wt] = {};
          if (!groupedByWorktype[wt][date]) groupedByWorktype[wt][date] = [];
  
          groupedByWorktype[wt][date].push(row);
        }
  
        // Loop over worktypes
        for (const wt in groupedByWorktype) {
          this.lrecordList.push(['WorkType: ' + wt]);
  
          const dateGroups = groupedByWorktype[wt];
  
          for (const date in dateGroups) {
            const rows = dateGroups[date];
            let dateTotalWorkers = 0, dateTotalContract = 0, dateTotalOthers = 0;
  
            for (const row of rows) {
              this.lrecordList.push([
                '', 
                formatDate(row.creationdate, "dd-MM-yyyy", "en"),
                row.projectnumber,
                row.floor,
                row.pour,
                row.workername,
                row.workertype,
                row.noofworkers,
                row.intime,
                row.outtime
              ]);
  
              dateTotalWorkers += Number(row.noofworkers || 0);
            }
  
            // Add date total row for this date
            this.lrecordList.push([
              'Date Total: ' + date, '', '', '', '','','',
              dateTotalWorkers,
            ]);
            // Add empty row for spacing
            this.lrecordList.push(['', '', '', '', '', '', '', '','','']);
            // Accumulate to grand totals
            grandTotal += dateTotalWorkers;
          }
        }
  
        // Add Grand Total row
        this.lrecordList.push([
          'Grand Total', '', '', '', '','','',
          grandTotal,
        ]);
  
        // Prepare export
        this.fileName = 'Labour-Record-Data--' + projName + '-Dt-' + formatDate(new Date(), 'dd-MM-yyyy', 'en');
        const wb = XLSX.utils.book_new();
        const header = columnNames.map(name => ({ v: name }));
        const wsData = [columnNames, ...this.lrecordList];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Labour Record Data');
        XLSX.writeFile(wb, this.fileName + '.xlsx');
      } else {
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
        this.empbalamt = res.net_amount;
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
  clearProject1(){
    this.searchProject1 = '';
    this.projbtn1 = false;
    this.rowDatalRecord = [];
    this.filteredProjects1 = [...this.projectresponse];
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
  
   const getbalquery = `Select * from balances Where operation='C' AND empid=${this.empselected}`;
    // Make both service calls
    const auditTrail$ = this.auditService.getEmployeeUpdates();
    const balances$ = this.queryService.query(getbalquery);
  
    // Use forkJoin to wait for both service calls to complete
    forkJoin([auditTrail$, balances$]).subscribe(
      ([auditTrailResponse, balanceResponse]) => {
        this.temp = auditTrailResponse;
        this.balance = balanceResponse.data;
  
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
            date: this.balance[k].createdat,
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

    const projquery = `
   SELECT 
  ex.id,
  ex.amount,
  ex.createdat,
  emp.id,
  emp.firstname AS empname,
  ex.projectnumber,
  ex.expensetype,
  ex.floor,
  ex.pour,
  ex.noofworkers,
  ex.worktype,
  ex.remarks
FROM 
  expenses ex
JOIN 
  employees emp ON ex.empid = emp.id
WHERE 
  ex.projectnumber = '${expProjNumber}'
  AND
  ex.status = 'Approved';`
    // Service call to fetch project data
    this.queryService.query(projquery).subscribe(
      (res) => {
        this.expensedetails = res.data; // Assign response to expensedetails
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

  onpChange(expprojectId: number, expProjNumber: string, expProjName: string) {
    this.projbtn1 = true; // Enable project button
    this.lrecordList = []; // Clear the project list
    //this.projtotalamt = 0; // Reset total amount
    this.rowDatalRecord = []; // Reset grid data
    if(expProjNumber && this.frdate && this.trdate)
    {
      const startDate = new Date(this.fdate).toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const endDate = new Date(this.tdate).toISOString().slice(0, 10);
      const query = `Select * from labourrecord
      Where projectnumber= '${expProjNumber}'
      AND creationdate >= '${startDate}'
      AND creationdate <= '${endDate}';`;
      this.queryService.query(query).subscribe(
    // Service call to fetch project data
      (res) => {
        this.labourrecorddetails = res.data; // Assign response 
        sessionStorage.setItem('expProject', expProjNumber); // Save project number in session storage
  
        // Process response data
        for (let i = 0; i < this.labourrecorddetails.length; i++) {
          this.rowDatalRecord.push(this.labourrecorddetails[i]); // Push data to grid array
        }
        console.log(this.rowDatalRecord);
        // Group and flatten data for display
        const groupedData = this.rowDatalRecord.reduce((groups, item) => {
          const worktype = item.worktype;
          const group = groups.find((group) => group.worktype === worktype);
          if (group) {
            group.items.push(item);
          } else {
            groups.push({ worktype, items: [item] });
          }
          return groups;
        }, []);
  
        this.flattenedDatalRecord = groupedData.flatMap((group) => [
          { worktype: group.worktype, isGroupHeader: true },
          ...group.items,
        ]);
  
        // Update AG Grid data
        this.gridApi1.setRowData(this.rowDatalRecord);
  
        //console.log(this.flattenedDataProj); // Log grouped and flattened data
      },
      (error) => {
        console.error('Error fetching project data:', error); // Handle errors
      }
    );
  }
    // Update the search project field and close dropdown
    this.searchProject1 = `${expProjNumber} : ${expProjName}`;
    this.showlRecordDropdown = false;
  }
  
  onCellClicked(params) {
    if (params.column.colId === "download" && params.event.target.dataset.action === "download") {
      this.attachmentService.getAttachmentByExpId(params.data.id,'expense').subscribe(res => {
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
            link.download = `Employee-${this.searchQuery}-${params.data.projectnumber}-${params.data.expensetype}-Dt-${formatDate(params.data.createdat, 'dd-MM-yyyy', 'en')}.${attachment.filename.split('.').pop()}`;
            link.click();
  
            window.URL.revokeObjectURL(url);
          }, error => {
            this.toastr.error("Error downloading attachment");
          });
        }
      });
    }
  }
  
  onrecordClicked(params) {

    if (params.column.colId === "download" && params.event.target.dataset.action === "download") {
      this.attachmentService.getAttachmentByRecordId(params.data.id,'labourrecord').subscribe(res => {
        if (!res || res.length === 0) {
          this.toastr.warning("No Attachment for this labourrecord");
          return;
        }
  
        for (let k = 0; k < res.length; k++) {
          const attachment = res[k];
  
          this.attachmentService.downloadAttachment(attachment.id).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
  
            link.href = url;
            link.download = `Labour-Record-Project-${this.searchProject1}-${params.data.worktype}-Dt-${formatDate(params.data.creationdate, 'dd-MM-yyyy', 'en')}.${attachment.filename.split('.').pop()}`;
            link.click();
  
            window.URL.revokeObjectURL(url);
          }, error => {
            this.toastr.error("Error downloading attachment");
          });
        }
      });
    }
  }
  getbalbyId(empId: Number,empName: String ,empNo:Number) {
    this.emplId = empId;
    this.empbalamt = 0;
    this.balanceService.getbalbyId(empId).subscribe(res => {
      console.log(res);
      if (res.net_amount != 0) {
        this.nobal = false;
        this.empbalamt = res.net_amount;
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
