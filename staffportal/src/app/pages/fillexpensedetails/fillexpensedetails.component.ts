import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { ExpenseComponent } from '../expense/expense.component';

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
  constructor(private router : Router, private toastr: ToastrService,) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.projectName = sessionStorage.getItem('selectedprojectname');
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