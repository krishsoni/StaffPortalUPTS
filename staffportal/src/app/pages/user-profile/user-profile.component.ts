import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/services/Models/employee';
import { EmployeeService } from 'src/app/services/employee-service/employee-service';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {
  username: String;
  empId : Number;
  employeeDetails : Employee;
  city:String;
  phonenumber: Number;
  empNo : String;
  manager: String;
  totalexpofemp: number;
  expenseList: any;
  explength: any;
  expData = [];
  projectNumber: String;
  projExp: Number;
  projAmt: Number;
  projectCount: Number;
  constructor(private employeeService : EmployeeService, private expenseService: ExpenseService) { }

  ngOnInit() {
    this.empId = Number(sessionStorage.getItem('empId'));
    this.employeeService.getEmpById(this.empId).subscribe(res=>{
       this.employeeDetails = res;
       this.empNo = this.employeeDetails.empNo;
       this.username = this.employeeDetails.username;
        this.city = this.employeeDetails.city;
        this.manager = this.employeeDetails.manager;
        this.phonenumber = this.employeeDetails.mobilenumber;
    });
    this.expenseService.getExpenseByEmpId(this.empId).subscribe(res => {
      this.totalexpofemp = 0;
      this.expenseList = res;
      console.log(this.expenseList);
      for (var i = 0; i < this.expenseList.length; i++) {
        this.explength = this.expenseList.length;
        this.totalexpofemp = this.totalexpofemp + this.expenseList[i].amount;
      }
      const projectStats = this.expenseList.reduce((stats, expense) => {
        const projectNumber = expense.projectNumber;
        const amount = expense.amount;
      
        // If project number already exists in stats, update the total amount and increment the count,
        // otherwise initialize it
        if (stats.hasOwnProperty(projectNumber)) {
          stats[projectNumber].totalAmount += amount;
          stats[projectNumber].count++;
        } else {
          stats[projectNumber] = { projectNumber: projectNumber, totalAmount: amount, count: 1 };
        }
      
        return stats;
      }, {});
      const uniqueProjects = new Set(this.expenseList.map(expense => expense.projectNumber));
      this.projectCount = uniqueProjects.size;      
      this.expData = Object.values(projectStats);
      console.log(this.expData);
  });
  }
}
