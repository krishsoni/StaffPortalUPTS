import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BalanceService } from 'src/app/services/balance-service/balance-service';
import { Employee } from 'src/app/services/Models/employee';
import { EmployeeService } from 'src/app/services/employee-service/employee-service';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';
import { Project } from 'src/app/services/Models/project';
import { Balance } from 'src/app/services/Models/balance';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  username: string;
  employee : Employee;
  balance : Balance;
  fname : string;
  selectedEmployee = [];
  empId : Number;
  empbalamt = 0;
  empgratuity = 0;
  empbonus = 0;
  constructor(private router : Router, private balanceService: BalanceService, private employeeService : EmployeeService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.empId = Number(sessionStorage.getItem('empId'));
    this.balanceService.getbalbyId(this.empId).subscribe(res=>{
      if(res[0]!==undefined)
      this.empbalamt = res[0].netAmount;
    else
      this.empbalamt = 0;
    });
    this.employeeService.getEmpById(this.empId).subscribe(res=>{
      if(res.gratuity>0)
      {
        this.empgratuity = res.gratuity;
      }
      else
      this.empgratuity = 0;
      if(res.bonus>0)
      {
        this.empbonus = res.bonus;
      }
      else
      this.empbonus = 0;    
    });
  }
  backtoMenu() {
    this.router.navigate(['/home']);
  }


}
