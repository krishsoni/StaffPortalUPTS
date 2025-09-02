import { Component, OnInit, Output,Input, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Project } from 'src/app/services/Models/project';
import { ProjectService } from 'src/app/services/project-service/project-service';
import { LookupService } from 'src/app/services/lookup-service/lookup-service';
import { SelectedProject } from 'src/app/services/Models/models';
import { Expense } from 'src/app/services/Models/expense';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';
import { ToastrService } from 'ngx-toastr';
import { BalanceService } from 'src/app/services/balance-service/balance-service';
import { Balance } from 'src/app/services/Models/balance';
import { HttpClient } from '@angular/common/http';
import { AttachmentService } from 'src/app/services/attachment-service/attachment-service';
import { DataService } from 'src/app/data.service';
import { LabourRecordService } from 'src/app/services/labourrecord-service/labourrecord-service';
import { LabourRecord } from 'src/app/services/Models/labourrecord';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {
  test: Date = new Date();
  username: string;
  Projects = [];
  state: string;
  selectedcity : string;
  projectNumber : String;
  projectName : string;
  selectedProject = [];
  projectselected = false;
  empId : Number;
  numOfWorkers: Number;
  sprojectfloor: Number;
  sprojectpour: Number;
  sworktype: String;
  sworkertype: string;
  sexpensetype: String;
  sprojectNumber: String;
  pours = [];
  floors = [];
  worktypes = [];
  //workertype = ["Company Worker","Contract Worker","Others"];
  expenseTypes = [];
  workerTypes = [];
  stateslist = [];
  citylist = [];
  projectslists = [];
  selectedprojectname : string;
  submit = false;
  createrecord = true;
  submitrecorddetails = false;
  data: [string, number, number, string, File][] = [];
  expense: Expense;
  expnum = 0;
  addBalance : Balance;
  totalexpamt = 0;
  companyWorker:null;
  contractWorker:null;
  others:null;
  submitAttempted = false;
  recordDetailsList = [];
  workername = '';
  intime  = ''
  outime  = '';
  workerEntries: { name: string; type: string; count: number }[] = [];
  pour = {
    "lookupType":"Pour"
  };
  floor = {
    "lookupType":"Floor"
  };
  worktype = {
    "lookupType":"WorkType"
  };
  expenseType = {
    "lookupType":"ExpenseType"
  };
  workerType = {
    "lookupType":"WorkerType"
  }

  noofworkers = 0;
  amount: number;
  remarks: string;
  projectdata : SelectedProject[] = [];
  date: Date = new Date();
  fileName: string;
  file: File;
  files: File[] = [];
  fileDetails: any[] = [];
  recordId = 0;
  lrecord : LabourRecord;
  filteredProjects: any[] = []; // Filtered projects for the dropdown
  searchQuery: string = '';
  showDropdown: boolean = false;
  selectedFileName: string | null = null;
  maxFileSizeMB = 5;
  completerecord = false;
  constructor(private http: HttpClient, private router : Router, private projectService: ProjectService, private lookupService: LookupService, 
    private toastr: ToastrService,
    private attachmentService: AttachmentService, private labourrecordService: LabourRecordService
    )
     { }
  
  
  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    //this.username = this.dataservice.getUsername();
    this.empId = Number(sessionStorage.getItem('empId'));
    //this.empId = Number(this.dataservice.getEmpId());
    if(this.empId == 0)
    {
      this.toastr.warning("Session Expired - Please Login");
      this.router.navigate(['/login']);
    }
    else{
      console.log("EmpId is not null now "+ sessionStorage.getItem('empId'));
    }
    this.getallProjects();
  }
  backtoMenu() {
    if(sessionStorage.getItem('isadmin'))
    {
      this.router.navigate(['/dashboard']);
    }
    else
    this.router.navigate(['/home']);
  }

  recordlabour(){
     if(this.sworkertype!="undefined")
    {
      this.workerEntries.push({
        name: this.workername,
        type: this.sworkertype,
        count: this.noofworkers
      });
  
    this.lrecord = new LabourRecord(this.selectedProject['projectnumber'], 
    this.projectName, this.sprojectpour, 
    this.sprojectfloor, this.sworktype, this.sworkertype, this.noofworkers,this.username, this.intime, this.outime, this.workername);
    this.labourrecordService.createLabourRecord(this.lrecord).subscribe(
      res=>{
        console.log(res);
        this.recordDetailsList.push(res);
        this.getExpId(res.id);
        this.files = [];
        this.toastr.success("Labour Record Submitted Successfully!");
      });
      this.expnum = this.expnum+1;
      this.completerecord = true;
      console.log(this.sworkertype, this.noofworkers, this.intime, this.outime,this.workername, this.file);
        this.sworkertype = "undefined";
        this.noofworkers = 0;
        this.intime= '';
        this.outime= '';
        this.workername = '';
      this.file = undefined;
     //this.files = [];
      this.fileDetails = [];
  }
  else {
    this.toastr.warning("Select Worker Type");
  }
  }
  completeRecord()
  {
      this.submit = false;
      //this.toastr.success("Expenses Created Successfully");
      this.submitrecorddetails = true;
  }
  getExpId(id)
  {
    this.recordId = id;
    for(var i=0;i<this.files.length;i++)
    {
      this.readFileContents(this.files[i], this.recordId);
    }
    console.log(this.recordId);
  }
  
  getallProjects()
  {
    this.projectService.getAllProjects().subscribe(res =>{
      this.Projects = res;
      this.stateslist = [];
      for(var i=0;i<this.Projects.length;i++)
      {
        if(this.stateslist)
        {
          if(!this.stateslist.includes(this.Projects[i].state))
          {
            this.stateslist.push(this.Projects[i].state);
          }
        }
      }
    });
  }
  getlookupValues()
  {
    this.lookupService.getByLookupType(this.pour).subscribe(res=>
      {
        this.pours = [];
        if(this.selectedProject!= null)
        {
          //console.log(res);
          for(var i=0;i<res.length;i++)
          {
            
            if( res[i].value <= parseInt(this.selectedProject['pour']))
            {
              this.pours.push(res[i].value);
            }
          }
        }
      });
      this.lookupService.getByLookupType(this.floor).subscribe(res=>{
        this.floors = [];
        if(this.selectedProject!= null)
        {
          //console.log(res);
          for(var i=0;i<res.length;i++)
          {
            
            if( res[i].value <= parseInt(this.selectedProject['floor']))
            {
              this.floors.push(res[i].value);
            }
          }
        }
      });
      this.lookupService.getByLookupType(this.worktype).subscribe(res=>{
        this.worktypes = [];
        if(this.selectedProject!= null)
        {
          //  console.log(res);
          for(var i=0;i<res.length;i++)
          {
            this.worktypes.push(res[i].value);
          }
        }
      });
      
      this.lookupService.getByLookupType(this.workerType).subscribe(res=>{
            this.data = res.map(item => [item.value,1,null,""]);
            for(var i=0;i<res.length;i++)
          {
            this.workerTypes.push(res[i].value);
          }
            console.log("WorkerTypes:"+this.data);
      })
      this.lookupService.getByLookupType(this.expenseType).subscribe(res=>{
        this.data = res.map(item => [item.value,1,null,""]);
        for(var i=0;i<res.length;i++)
      {
        this.expenseTypes.push(res[i].value);
      }
        console.log(this.data);
  })
  }
  onstateChange()
  {
    console.log(this.citylist);
    this.selectedcity = undefined;
    this.projectName = undefined;
    this.projectselected = false;
    this.projectslists = [];
    this.citylist = [];
    for(var i=0;i<this.Projects.length;i++)
      {
        if(this.citylist && this.Projects[i].state == this.state)
        {
          if(!this.citylist.includes(this.Projects[i].city))
          {
            this.citylist.push(this.Projects[i].city);
          }
        }
      }
  }
  oncityChange()
  {
    this.selectedcity
    this.projectslists = [];
    for(var j=0;j<this.Projects.length;j++)
    {
        if(this.Projects[j].city == this.selectedcity && this.Projects[j].status== "InProgress")
        {
          this.projectslists.push(this.Projects[j]);
          //console.log(this.projectslists);
        }
        this.filteredProjects = this.projectslists;
    }
  }
  filterProjects() {
    if (this.searchQuery) {
      this.filteredProjects = this.projectslists.filter(project =>
        project.projectname.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredProjects = this.projectslists;
    }
  }
  selectProject(projectName: string) {
    this.projectselected = true;
    this.projectName = projectName;
    for(var k=0;k<this.projectslists.length;k++)
    {
      if(this.projectName == this.projectslists[k].projectname)
      this.selectedProject = this.projectslists[k];
    }
    this.getlookupValues();
    console.log(this.selectedProject);
    //this.projectName = projectName; // Set the selected project
    this.searchQuery = projectName; // Update the input field
    this.showDropdown = false; // Hide the dropdown
  }

  hideDropdown() {
    setTimeout(() => this.showDropdown = false, 200); // Delay to allow click event
  }
  fillrecord()
  {
    this.createrecord = false;
    this.submit = true;
    sessionStorage.setItem('selectedprojectname',this.projectName);
    //this.dataservice.setselectedProject(this.projectName);

  }
  onworkertypechange()
  {
    console.log("came Here"+this.sworkertype);
  }
  onfloorChange()
  {
    console.log(this.sprojectfloor);
  }
  onpourChange()
  {
    console.log(this.sprojectpour);
  }
  onworkChange()
  {
    console.log(this.sworktype);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const file: File = input.files[0];
    const fileSizeMB = file.size / (1024 * 1024);
  
    // ❌ Block if > 5 MB
    if (fileSizeMB > this.maxFileSizeMB) {
      this.toastr.error(`File "${file.name}" exceeds 5 MB and was not added.`);
      input.value = '';
      return;
    }
  
    // ✅ Replace with new file
    this.files = [file];
    this.fileDetails = [{ name: file.name, size: file.size }];
  
    input.value = ''; // Reset for reselecting same file
  }
  
  removeFile(index: number) {
    this.files = [];
    this.fileDetails = [];
  }
  
readFileContents(file: File, recordId:Number): void {
  const reader = new FileReader();
  reader.onload = () => {
    const base64Content: string = reader.result as string;
    const base64Data: string = base64Content.split(',')[1];
    console.log('File contents (Base64):', base64Data);
    this.uploadFile(base64Data, file.name, recordId);
};
reader.readAsDataURL(file);
}
uploadFile(base64Content: string, name: string, recordId: Number): void {
  // Send Base64-encoded file contents to server using HttpClient
  this.attachmentService.uploadAttachment(base64Content, name,'labourrecord', recordId).subscribe(res=>{
    if(res)
    {
      console.log("Uploaded Successfully");
    }
  });
  this.labourrecordService.updateattachCount(recordId, {attachmentcount:1}).subscribe(res=>{
    console.log("Attachment Count: "+res.attachmentcount);    
  });
}
}