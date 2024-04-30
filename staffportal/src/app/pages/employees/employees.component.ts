import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeService } from 'src/app/services/employee-service/employee-service';
import { Employee } from 'src/app/services/Models/employee';
import { NewUser } from 'src/app/services/Models/newuser';
import { UserService } from 'src/app/services/user-service/user-service';
//import 'ag-grid-enterprise';
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
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  editvalue: boolean = false;
  rowData = [];
  colDefs: ColDef[] = [
    { headerName: "EmpNo", field: "empNo", editable: false  },
    { headerName: "EmpName", field: "firstname", editable: true },
    { headerName: "MobileNo", field: "mobilenumber", editable: true  },
    { headerName: "Username", field: "username", editable: true  },
    { headerName: "City", field: "city", editable: true },
    { headerName: "Project Coordinator",field: "manager", editable: true  },
    { headerName: "Gratuity",field: "gratuity", editable: true  },
    { headerName: "Bonus",field: "bonus", editable: true },
    {
      field:"id", hide: true
    },
    {
      headerName: "Action",
      minWidth: 150,
      cellRenderer: this.actionCellRenderer,
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
gridApi: GridApi<Employee>;
gridOptions: GridOptions<Employee> = {
  defaultColDef: {
    editable: true
  },
  suppressClickEdit: true,
  editType: "fullRow",
  onCellValueChanged :this.cellValueChanged.bind(this)
}

  constructor(private http: HttpClient, private employeeservice: EmployeeService, private toastr: ToastrService, private newuserservice: UserService) { }
  firstname: String;
  lastname: String;
  mobilenumber : Number;
  address: String;
  city: String;
  country: String;
  postalcode: String;
  createdby : String;
  attribute1 : String;
  attribute2 : String;
  attribute3 : String;
  username : String ;
  manager : String;
  employee: Employee;
  Employees = [];
  addbtn = true;
  addemployee = false;
  newUser: NewUser;
  empId: Number;
  empNo: String;
  gratuity: Number;
  bonus: Number;
  ngOnInit() {
    // interval(15000)
    // .pipe(
    //   startWith(0)).subscribe(
    //     res=>{
    //       this.getallEmployees();
    //     }
    //   );
    this.getallEmployees();
//    this.getallTables();
  }

  getallEmployees()
  {
    this.employeeservice.getAllEmployees().subscribe(res =>{
      this.Employees = res;
      this.rowData = [];
      for(var i=0;i<res.length;i++)
      {
        this.rowData.push(res[i]);
        // this.rowData.push(
        //   { EmpNo: res[i].empNo, EmpName: res[i].firstname, MobileNo: res[i].mobilenumber, 
        //     Username:res[i].username, City:res[i].city, Supervisor: res[i].manager,
        //     Gratuity: res[i].gratuity, Bonus: res[i].bonus },
        // );
      }
      console.log(this.Employees);
    });
  }
  addEmployeeBtn()
  {
    this.addemployee = true;
    this.addbtn = false;
  }

  back()
  {
    this.addbtn = true;
    this.getallEmployees();
    this.addemployee = false;
  }
  addEmployee()
  {
    this.employee = new Employee(this.empNo,this.firstname, "lastname", this.mobilenumber, "", this.city, "India", "", "admin", this.gratuity,this.bonus,"", this.username, this.manager)
    this.employeeservice.createEmployee(this.employee).subscribe(res=>{
      console.log(res._id);
      this.addbtn = true;
      this.addemployee = false;
      this.empId = res._id;
      this.newUser = new NewUser(this.firstname, "lastname", this.mobilenumber, "", this.city, "India", "", "admin", "Welcome123",false,"", this.username, this.manager,this.empId)
      this.newuserservice.createNewUser(this.newUser).subscribe(res=>{
        console.log("User Created" +res);
      })
      this.getallEmployees();
      this.toastr.success("Employee Created Successfully");
    });
  }

  actionCellRenderer(params) {
    let eGui = document.createElement('div');
  
    let editingCells = params.api.getEditingCells();
    // checks if the rowIndex matches in at least one of the editing cells
    let isCurrentRowEditing = editingCells.some((cell) => {
      return cell.rowIndex === params.node.rowIndex;
    });
  
    if (isCurrentRowEditing) {
      eGui.innerHTML = `
          <button  
            class="btn btn-success btn-sm"
            data-action="update">
                 Update  
          </button>
          <button  
            class="btn btn-danger btn-sm"
            data-action="cancel">
                 Cancel
          </button>
          `;
    } else {
      eGui.innerHTML = `
          <button 
            class="btn btn-warning btn-sm"  
            data-action="edit">
               Edit 
            </button>
          <button 
            class="btn btn-danger btn-sm"
            data-action="cancel">
               Cancel
          </button>
          `;
    }
  
    return eGui;
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // Additional initialization code...
}
cellValueChanged(event)
  {
      // This event is triggered when a cell value is changed
      console.log('Cell value changed:', event.data);
      if (event.newValue !== event.oldValue) {
         this.editvalue = true;
    }
  }
  onCellClicked(params) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.api.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "update") {
        params.api.stopEditing(false);
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  }

  onRowEditingStarted(params) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
  onRowEditingStopped(params) {
    if(this.editvalue)
    {
    this.employeeservice.updateEmployee(params.data._id, params.data).subscribe(res=>{
      this.toastr.success("Employee Updated Successfully");
    });
    }
    else
    this.toastr.warning("Edit Cancelled");
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
}
