import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user-service/user-service';
import { User } from 'src/app/services/Models/user';
import { DataService } from 'src/app/data.service';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  vegonly = false;
  orderId: string;
  menuItems = [];
  username: string;
  public isCollapsed = true;
  selectedItems: any = [];
  tableno: string;
  user: User;
  password: string;
  isadmin: boolean;
  response: User;
  empId: number;
  expenses: any[] = [];
  latestSixEntries: any[] = [];
  expenseByType: Record<string, number> = {};
  totalExpense: number = 0;
  highestExpense: any = {};
  objectKeys = Object.keys;
  test: Date = new Date();

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,
    private dataService: DataService,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.empId = Number(sessionStorage.getItem('empId'));

    this.expenseService.getExpensesByEmpId(this.empId).subscribe((res) => {
      this.expenses = res || [];
      console.log(this.expenses);
      // Get last 6 expenses sorted by date
      this.latestSixEntries = [...this.expenses]
        .sort((a, b) => new Date(b.createdat).getTime() - new Date(a.createdat).getTime())
        .slice(0, 6);
      console.log(this.latestSixEntries);
      // Compute metrics now that data is available
      this.expenseByType = this.getGroupSum('expensetype');
      this.totalExpense = this.expenses.reduce((sum, e) => sum + e.amount, 0);
      this.highestExpense = this.expenses.reduce((max, e) => e.amount > max.amount ? e : max, this.expenses[0]);
    });
  }

  getGroupSum(field: string): Record<string, number> {
    return this.expenses.reduce((acc, curr) => {
      const key = curr[field];
      acc[key] = (acc[key] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
  }

  click() {
    this.router.navigate(['/balance']);
  }

  click2() {
    this.router.navigate(['/expense']);
  }

  onValChange(value) {
    this.ngOnInit(); // Re-fetch on change
  }
}
