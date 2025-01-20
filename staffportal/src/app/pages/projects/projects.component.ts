import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ProjectService } from 'src/app/services/project-service/project-service';
import { ActivatedRoute, Router } from "@angular/router";
import { Project } from 'src/app/services/Models/project';
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
import { QueryService } from 'src/app/services/query-service/query-service';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  editvalue: boolean = false;
  rowData = [];
  colDefs: ColDef[] = [
    { headerName: "ProjectNo", field: "projectNumber", editable: false  },
    { headerName: "ProjectName", field: "projectName", editable: true },
    { headerName: "State", field: "state", editable: true  },
    { headerName: "City", field: "city", editable: true  },
    { headerName: "Project Coordinator", field: "supervisor", editable: true },
    { headerName: "Slabs",field: "floor", editable: true  },
    { headerName: "Pours",field: "pour", editable: true  },
    { headerName: "WorkType",field: "workType", editable: true },
    { headerName: "Status",field: "status", editable: true, cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['InProgress', 'Completed']
    } },
    { headerName: "Remarks", field: "remarks", editable: true },
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
getRowStyle = params => {
  if (params.data.status === 'Completed') {
      return { background: '#CC333344', 'pointer-events': 'none'};
  }
};
gridApi: GridApi<Project>;
gridOptions: GridOptions<Project> = {
  defaultColDef: {
    editable: true
  },
  suppressClickEdit: true,
  editType: "fullRow",
  onCellValueChanged :this.cellValueChanged.bind(this)
  
    // Log the updated row data
    // You can compare the updated row data with the original data here
    // and perform further actions as needed
}

  constructor(private http: HttpClient, private projectService: ProjectService, private toastr: ToastrService, private router : Router, private queryService: QueryService) { }
  state: String;	
  city:String;		
  projectNumber:String;	
  projectName:String;		
  floor:String;		
  pour:String;		
  workType:String;
  remarks:String;
  supervisor:String;
  addproject = false;
  addbtn = true;
  Projects = [];
  project : Project;
  updateproject : Project;
  projectexists = false;
  ngOnInit() {
    this.getallProjects();
  }
  
  getallProjects()
  {
    this.projectService.getAllProjects().subscribe(res =>{
      this.Projects = res;
      this.rowData = [];
      for(var i=0;i<res.length;i++)
      {
        this.rowData.push(res[i]);
      }
      
      console.log(this.Projects);
    });
  }

  addProject()
  {
    this.addproject = true;
    this.addbtn = false;
  }

  back()
  {
    this.addbtn = true;
    this.getallProjects();
    this.addproject = false;
  }

  submitproject()
  {
    this.project = new Project(this.state,this.city, this.projectNumber.trim(), this.projectName, this.floor, this.pour, this.workType, this.remarks, this.supervisor, "InProgress");
    const query = {
      "collectionName": "projects",
      "filter": { "projectNumber": this.projectNumber.trim()},      
    }
    this.queryService.query(query).subscribe(res=>{
      console.log(res);
      if(res.length = 0)
      {
      this.projectexists = true;    
      }
      else
      this.toastr.error("Project "+this.projectNumber+" already exists.")
    })
    if(this.projectexists)
    {
      this.projectService.createProject(this.project).subscribe(res =>{
        this.addbtn = true;
        this.addproject = false;
        this.getallProjects();      
        this.toastr.success("Project Added Successfully");
      });  
    }
  }
  onFilterTextBoxChanged() {
    this.gridApi!.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }
  actionCellRenderer(params) {
    if (params.data.status === 'Completed') {
      return null; // Hide the button for group rows
    } 
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
      this.projectService.updateProject(params.data._id, params.data).subscribe(res=>{
        this.toastr.success("Project Updated Successfully");
        this.editvalue = false;
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
