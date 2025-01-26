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

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
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
  sprojectfloor: Number;
  sprojectpour: Number;
  sworktype: String;
  sexpensetype: String;
  sprojectNumber: String;
  pours = [];
  floors = [];
  worktypes = [];
  expenseTypes = [];
  stateslist = [];
  citylist = [];
  projectslists = [];
  selectedprojectname : string;
  submit = false;
  createexpense = true;
  submitexpensesdetails = false;
  data: [string, number, number, string, File][] = [];
  expense: Expense;
  expnum = 0;
  addBalance : Balance;
  totalexpamt = 0;
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
  }
  expenseflag = false;
  exptype = "undefined";
  noofworkers = 0;
  amount: number;
  remarks: string;
  projectdata : SelectedProject[] = [];
  date: Date = new Date();
  fileName: string;
  file: File;
  files: File[] = [];
  fileDetails: any[] = [];
  expenseId = 0;
  expId: any;
  expenseDetails = [];
  expenseDetailsList = [];
  completeexp = false;
  filteredProjects: any[] = []; // Filtered projects for the dropdown
  searchQuery: string = '';
  showDropdown: boolean = false;
  constructor(private http: HttpClient, private router : Router, private projectService: ProjectService, private lookupService: LookupService, 
    private expenseService: ExpenseService, private toastr: ToastrService,private balanceService: BalanceService, private elRef: ElementRef,
    private attachmentService: AttachmentService, private dataservice: DataService
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
    this.router.navigate(['/home']);
  }
  fillexpenses()
  {
    this.createexpense = false;
    this.submit = true;
    sessionStorage.setItem('selectedprojectname',this.projectName);
    //this.dataservice.setselectedProject(this.projectName);

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
      
      this.lookupService.getByLookupType(this.expenseType).subscribe(res=>{
            this.data = res.map(item => [item.value,1,null,""]);
            for(var i=0;i<res.length;i++)
          {
            this.expenseTypes.push(res[i].value);
          }
            console.log(this.data);
      })
  }
  submitExp()
  {
      this.expenseflag = false;
      if(this.exptype!="undefined")
      {
        if(this.amount>0)
        {
          this.expense = new Expense(this.selectedProject['projectNumber'], this.empId,this.exptype,this.noofworkers,this.sprojectpour,this.sprojectfloor,this.sworktype,this.amount, this.remarks);
          this.expenseService.createExpense(this.expense).subscribe(res=>{
            console.log("Expense created" + res);
            this.expenseDetails = res;
            console.log(this.expenseDetails);
            this.expenseDetailsList.push(res);
            this.getExpId(res._id);
            this.totalexpamt = this.totalexpamt + res.amount;
            //this.addbalance(res.amount);
            this.files = [];
            this.toastr.success("Expense Added Successfully");
          });
          this.expnum = this.expnum+1;
          this.expenseflag = true;
          this.completeexp = true;
        console.log(this.exptype, this.noofworkers, this.amount, this.remarks, this.file);
        this.exptype = "undefined";
        this.noofworkers = 0;
        this.amount= 0;
        this.remarks="";
        this.file = undefined;
        //this.files = [];
        this.fileDetails = [];
        }
      if(!this.expenseflag)
        {
          this.toastr.warning("Expense Amount cannot be 0");
        }
      }
      else
      this.toastr.warning("Select Expense Type");

  }

  completeExp()
  {
    if(this.expenseflag)
    {
      this.submit = false;
      //this.toastr.success("Expenses Created Successfully");
      this.submitexpensesdetails = true;
    }
  }

  addbalance(amt)
  {
    this.addBalance = new Balance(this.empId,amt,"D")
    this.balanceService.addBalance(this.addBalance).subscribe(res=>{
      console.log(res);
    });
      //location.reload();
  }
  getExpId(id)
  {
    this.expenseId = id;
    for(var i=0;i<this.files.length;i++)
    {
      this.readFileContents(this.files[i], this.expenseId);
    }
    console.log(this.expenseId);
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
    // Filter the projects based on the search query
    // this.filteredProjects = this.projectslists.filter(project => 
    //   project.projectName.toLowerCase().includes(this.searchQuery.toLowerCase())
    // );
    if (this.searchQuery) {
      this.filteredProjects = this.projectslists.filter(project =>
        project.projectName.toLowerCase().includes(this.searchQuery.toLowerCase())
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
      if(this.projectName == this.projectslists[k].projectName)
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
  // onvalueChange()
  // {
  //   this.projectselected = true;
  //   for(var k=0;k<this.projectslists.length;k++)
  //   {
  //     if(this.projectName == this.projectslists[k].projectName)
  //     this.selectedProject = this.projectslists[k];
  //   }
  //   this.getlookupValues();
    
  //   //this.getProjectByName();
  //   console.log(this.selectedProject);
  // }
  onworktypechange()
  {
    console.log("came Here"+this.exptype);

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

onFileSelected(event) {

    const selectedFiles: FileList = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
        const file: File = selectedFiles[i];
        if (!this.files.some(existingFile => existingFile.name === file.name)) {
          this.files.push(file);
          this.fileDetails.push({ name: file.name, size: file.size });
        }
    }
}
readFileContents(file: File, expenseId:Number): void {
  const reader = new FileReader();
  reader.onload = () => {
    const base64Content: string = reader.result as string;
    const base64Data: string = base64Content.split(',')[1];
    console.log('File contents (Base64):', base64Data);
    this.uploadFile(base64Data, file.name, expenseId);
};
reader.readAsDataURL(file);
}
uploadFile(base64Content: string, name: string, expenseId: Number): void {
  // Send Base64-encoded file contents to server using HttpClient
  this.attachmentService.uploadAttachment(base64Content, name, expenseId).subscribe(res=>{
    if(res)
    {
      console.log("Uploaded Successfully");
    }
  });
  this.expenseService.updateexpenseattachCount(expenseId, {attachmentCount:1}).subscribe(res=>{
    console.log("Attachment Count: "+res);    
  });
}
}