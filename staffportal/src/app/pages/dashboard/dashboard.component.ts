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
  numofprojects: number;
  project: Project;
  Projects = [];
  projectName: string;
  selectedProject = [];
  projectresponse = [];
  balance = [];
  totalbalance = 0;
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
  colNames = ['Group', 'Date', 'Project No', 'Expense Type', 'Remarks', 'Amount'];
  colNamesEmp = ['Group','Type', 'Date', 'Old Value', 'New Value'];
  colNamesProj = ['Group','Project No', 'Date', 'EmpName', 'Worktype', 'Slab', 'Pour', 'Expense Type','No Of Workers', 'Remarks', 'Amount'];
  colDefs: ColDef[] = [
    { headerName: "Date", field: "createdAt", valueFormatter: this.dateFormatter },
    // { headerName: "EmpId", field: "empId" },
    { headerName: "ProjectNo", field: "projectNumber", },
    { headerName: "ExpenseType", field: "expenseType" },
    { headerName: "Remarks", field: "remarks" },
    {
      headerName: "Amount", field: "amount",
      valueParser: "Number(newValue)"
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
    },
    {
      headerName: "Download",
      cellRenderer: function (params) {
        if (params.node.group) {
          return null; // Hide the button for group rows
        } else {
          return '<button class="btn btn-success btn-sm" data-action="download">Download</button>';
        }
      },
      editable: false,
      colId: "download"
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


  // getDynamicFileName(): string {
  //   const dynamicId = sessionStorage.getItem('expEmp'); // Set your dynamic ID here
  //   // Generate dynamic file name based on your logic
  //   return 'Employee-Expense-Data-EmpId-' + dynamicId + '-Dt-' + formatDate(new Date, 'dd-MM-yyyy', 'en');
  // }
  // getProjFileName(): string {
  //   const dynamicProjId = sessionStorage.getItem('expProject'); // Set your dynamic ID here
  //   // Generate dynamic file name based on your logic
  //   return 'Project-Expense-Data-ProjNo-' + dynamicProjId + '-Dt-' + formatDate(new Date, 'dd-MM-yyyy', 'en');
  // }
  // getEmpFileName(): string {
  //   const dynamicProjId = sessionStorage.getItem('empch'); // Set your dynamic ID here
  //   // Generate dynamic file name based on your logic
  //   return 'Employee-Change-History' + dynamicProjId + '-Dt-' + formatDate(new Date, 'dd-MM-yyyy', 'en');
  // }

  constructor(private userService: UserService, private router: Router, private employeeService: EmployeeService,
    private projectService: ProjectService, private expenseService: ExpenseService, private attachmentService: AttachmentService,
    private balanceService: BalanceService, private auditService: AuditTrailService, private toastr: ToastrService,
    private dataService: DataService) {
  }

  ngOnInit() {

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
      });
      this.projectService.getAllProjects().subscribe(res => {
        this.projectresponse = res;
        this.numofprojects = this.projectresponse.length;
      });
      this.balanceService.getBalance().subscribe(res => {
        this.balance = res;
        for (var i = 0; i < this.balance.length; i++) {
          if (this.balance[i].operation == "C") {
            this.totalbalance = this.totalbalance + this.balance[i].amount;
          }
        }
      });
      this.expenseService.getExpense().subscribe(res => {
        this.expense = res;
        for (var i = 0; i < this.expense.length; i++) {
          this.totalexpense = this.totalexpense + this.expense[i].amount;
        }
      });
      this.expenseService.getExpenseDetails().subscribe(res => {
        this.expensedetails = res;
      });
    }
    else {
      this.router.navigate(['/home']);
    }
  }

  expclick() {
    this.exporttoExcel(this.flattenedData, this.colNames)
  }
  empclick() {
    this.exporttoExcelEmp(this.flattenedDataEmp, this.colNamesEmp)
  }
  projclick() {
    this.exporttoExcelProj(this.flattenedDataProj, this.colNamesProj)
  }
  exporttoExcel(data, columnNames) {
    try {
      let empName = "";
      if (data.length > 0) {
        this.expemplist = [];
        for(var k=0;k<this.empres.length;k++)
        {
          if(this.empres[k]._id == this.expId)
          {
            empName = this.empres[k].firstname;
          }
        }
        this.expemplist.push(['Employee Name:'+ empName]);
        let totalamt = 0;
        for (var i = 0; i < data.length; i++) {
          if(data[i].isGroupHeader)
          {
            this.expemplist.push(["ProjectNumber: "+data[i].projectNumber])
          }
          else{
            this.expemplist.push(["", formatDate(data[i].createdAt, "dd-MM-yyyy", "en"), data[i].projectNumber, data[i].expenseType, data[i].remarks, data[i].amount])
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
      let projName = "";
      if (data.length > 0) {
        this.projList = [];
        for(var k=0;k<this.projectresponse.length;k++)
        {
          if(this.projectresponse[k].projectNumber == this.expprojectId)
          {
            projName = this.projectresponse[k].projectName;
          }
        }
        this.projList.push(['Project: '+ projName]);
        for (var i = 0; i < data.length; i++) {
          if(data[i].isGroupHeader)
          {
            this.projList.push(["WorkType: "+data[i].worktype])
          }
          else{
          this.projList.push(["",data[i].projectNumber, formatDate(data[i].createdAt, "dd-MM-yyyy", "en"), data[i].empName, data[i].worktype, data[i].floor, data[i].pour, data[i].expenseType, data[i].noofWorkers, data[i].remarks, data[i].amount])
        }
      }
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

  addbalance() {
    this.addBalance = new Balance(this.emplId, this.balanceamt, "C")
    this.balanceService.addBalance(this.addBalance).subscribe(res => {
      console.log(res);
      this.toastr.success("Balance Updated Successfully");
      this.router.navigate(['/dashboard']).then(() => {
        setTimeout(() => window.location.reload(), 700);
      });
      //this.router.navigate(['/dashboard']);
    });
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
  onempChange() {
    this.empbtn = true;
    sessionStorage.setItem('empch', this.empselected.toString());
    //this.dataService.setempch(this.empselected.toString());
    //console.log(sessionStorage.getItem('empch'))
    this.auditService.getEmployeeUpdates().subscribe(res => {
      this.temp = res;
      this.rowDataEmp = [];
      for (var i = 0; i < this.temp.length; i++) {
        if (this.empselected == this.temp[i]._id && (this.temp[i].field !== "createdAt" && this.temp[i].field !== "updatedAt")) {
          this.rowDataEmp.push(this.temp[i]);
        }
      }
      for (var k = 0; k < this.balance.length; k++) {
        if (this.empselected == this.balance[k].empId && this.balance[k].operation == "C") {
          this.rowDataEmp.push({ field: "Balance", date: this.balance[k].createdAt, oldValue: 0, newValue: this.balance[k].amount });
        }
      }
      console.log(this.rowDataEmp);
      const groupedData = this.rowDataEmp.reduce((groups, item) => {
        const field = item.field;
        const group = groups.find(group => group.field === field);
        if (group) {
          group.items.push(item);
        } else {
          groups.push({ field, items: [item] });
        }
        return groups;
      }, []);
      this.flattenedDataEmp = [];
      this.flattenedDataEmp = groupedData.flatMap(group => [{ Type: group.field, isGroupHeader: true }, ...group.items]);
      console.log(this.flattenedDataEmp);
    });
  }
  onexpvalueChange() {
    console.log(this.expId);
    this.expbtn = true;
    sessionStorage.setItem('expEmp', this.expId.toString());
    //this.dataService.setexpEmp(this.expId.toString());
    //console.log(sessionStorage.getItem('expEmp'));
    this.expenseService.getExpenseByEmpId(this.expId).subscribe(res => {
      this.totalexpofemp = 0;
      this.expenseList = res;
      console.log(this.expenseList);
      this.rowData = [];
      for (var i = 0; i < this.expenseList.length; i++) {
        this.totalexpofemp = this.totalexpofemp + this.expenseList[i].amount;
        // this.rowData.push(
        //   { EmployeeId: this.expenseList[i].empId, ProjectNo: this.expenseList[i].projectNumber, ExpenseType: this.expenseList[i].expenseType, Remarks:this.expenseList[i].remarks, Amount: this.expenseList[i].amount },
        // );
        this.rowData.push(res[i]);
      }
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
  onemplvalueChange() {
    console.log(this.emplId);
    if (this.emplId) {
      for (var i = 0; i < this.empres.length; i++) {
        if (this.empres[i]._id == this.emplId) {
          this.fname = this.empres[i].firstname;
        }
      }
      this.getbalbyId(this.emplId);
    }
    else
      this.fname = "Select Employee";
  }

  onprojvalueChange() {
    console.log(this.expprojectId);
    this.projbtn = true;
    this.expprojlist = [];
    this.projtotalamt = 0;
    this.rowDataProj = [];
    for (var i = 0; i < this.expensedetails.length; i++) {
      if (this.expprojectId == this.expensedetails[i].projectNumber) {
        sessionStorage.setItem('expProject', this.expensedetails[i].projectNumber);
        //this.dataService.setexpProject(this.expensedetails[i].projectNumber);
        //console.log(sessionStorage.getItem('expProject'));
        //this.expprojlist.push(this.expense[i]);
        this.projtotalamt = this.projtotalamt + this.expensedetails[i].amount;
        // this.rowDataProj.push(
        //   {  ProjectNo: this.expense[i].projectNumber, EmpId: this.expense[i].empId, ExpenseType: this.expense[i].expenseType, Floor: this.expense[i].floor, Pour: this.expense[i].pour,
        //     NoofWorkers: this.expense[i].noofWorkers, Remarks:this.expense[i].remarks, Amount: this.expense[i].amount },
        // );
        this.rowDataProj.push(this.expensedetails[i]);
      }
    }
    console.log(this.rowDataProj);
    const groupedData = this.rowDataProj.reduce((groups, item) => {
      const worktype = item.worktype;
      const group = groups.find(group => group.worktype === worktype);
      if (group) {
        group.items.push(item);
      } else {
        groups.push({ worktype, items: [item] });
      }
      return groups;
    }, []);
    this.flattenedDataProj = [];
    this.flattenedDataProj = groupedData.flatMap(group => [{ worktype: group.worktype, isGroupHeader: true }, ...group.items]);
    console.log(this.flattenedDataProj);
    //console.log(this.expprojlist);
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
            var byteCharacters = atob(res[0].data);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: 'application/octet-stream' });
            var url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = 'Proj' + '-' + params.data.projectNumber + '-' + params.data.worktype + '-' + 'Dt' + '-' + formatDate(params.data.createdAt, 'dd-MM-yyyy', 'en')+'.'+res[0].name.substring(res[0].name.indexOf(".") + 1);
            link.click();

            window.URL.revokeObjectURL(url);
          }
        })
      }
    }
  }
  getbalbyId(empId: Number) {
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
  }
  projects() {
    this.router.navigate(['/projects']);
  }
  employees() {
    this.router.navigate(['/employees']);
  }
}
