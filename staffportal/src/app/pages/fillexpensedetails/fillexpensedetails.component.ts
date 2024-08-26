import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { ExpenseComponent } from '../expense/expense.component';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-fillexpensedetails',
  templateUrl: './fillexpensedetails.component.html',
  styleUrls: ['./fillexpensedetails.component.scss']
})
export class FillExpenseDetailsComponent implements OnInit {
  @ViewChild(ExpenseComponent) project !: ExpenseComponent;
  date: Date = new Date();
  username: string;
  projectName: string;
  submit = true;
  submitexpensesdetails = false;
  constructor(private router : Router, private toastr: ToastrService, private dataService: DataService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    //this.username = this.dataService.getUsername();
    this.projectName = sessionStorage.getItem('selectedprojectname');
    //this.projectName = this.dataService.getselectedProject();
  }
  backtoMenu() {
    this.router.navigate(['/expense']);
  }
  submitexpenses()
  {
    this.submit = false;
    this.toastr.success("Expenses Raised Successfully");
    this.submitexpensesdetails = true;
  }

}