import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/data.service';
import { Employee } from 'src/app/services/Models/employee';
import { EmployeeService } from 'src/app/services/employee-service/employee-service';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  username!: String;
  empId!: number;
  employeeDetails!: Employee;
  city!: String;
  phonenumber!: Number;
  empNo!: String;
  manager!: String;

  // Expense-related
  floorSummary: any[] = [];
  worktypeSummary: any[] = [];
  expensetypeSummary: any[] = [];
  pourSummary: any[] = [];
  expData: any[] = [];
  expenseList: any[] = [];
  totalexpofemp = 0;
  explength = 0;
  projectCount = 0;

  // Project Chart
  public projectChartData: ChartDataset<'bar'>[] = [];
  public projectChartLabels: string[] = [];
  public projectChartType: 'bar' = 'bar';

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  // Floor chart
  floorChartLabels: string[] = [];
  floorChartData: ChartDataset<'bar'>[] = [];  // <-- Corrected type

  constructor(
    private employeeService: EmployeeService,
    private expenseService: ExpenseService,
    private dataService: DataService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.empId = Number(sessionStorage.getItem('empId'));
    if (this.empId === 0 || !this.empId) {
      this.toastr.warning('Session Expired - Please Login');
      this.router.navigate(['/login']);
      return;
    }

    this.employeeService.getEmpById(this.empId).subscribe(res => {
      this.employeeDetails = res;
      this.empNo = this.employeeDetails.empno;
      this.username = this.employeeDetails.username;
      this.city = this.employeeDetails.city;
      this.manager = this.employeeDetails.manager;
      this.phonenumber = this.employeeDetails.mobilenumber;
    });

    this.expenseService.getExpenseByEmpId(this.empId).subscribe(res => {
      this.expenseList = res || [];

      // Total expense and count
      this.totalexpofemp = this.expenseList.reduce((sum, e) => sum + e.amount, 0);
      this.explength = this.expenseList.length;

      // Project-wise summary
      const projectStats: { [key: string]: any } = this.expenseList.reduce((stats, expense) => {
        const key = expense.projectnumber;
        if (!stats[key]) {
          stats[key] = { projectNumber: key, totalAmount: 0, count: 0 };
        }
        stats[key].totalAmount += expense.amount;
        stats[key].count += 1;
        return stats;
      }, {});

      this.expData = Object.values(projectStats);
      this.projectChartLabels = this.expData.map((p: any) => p.projectNumber);
      this.projectChartData = [{ data: this.expData.map((p: any) => p.totalAmount), label: 'Amount' }];
      this.projectCount = this.expData.length;

      // Group-by helper function
      const groupByField = (data: any[], field: string) => {
        const grouped = data.reduce((acc, item) => {
          const key = item[field];
          if (!acc[key]) {
            acc[key] = { [field]: key, count: 0, totalAmount: 0 };
          }
          acc[key].count += 1;
          acc[key].totalAmount += item.amount;
          return acc;
        }, {} as { [key: string]: any });
        return Object.values(grouped);
      };

      // Groupings
      this.floorSummary = groupByField(this.expenseList, 'floor');
      this.worktypeSummary = groupByField(this.expenseList, 'worktype');
      this.expensetypeSummary = groupByField(this.expenseList, 'expensetype');
      this.pourSummary = groupByField(this.expenseList, 'pour');

      // Floor Chart
      this.floorChartLabels = this.floorSummary.map(f => `Floor ${f.floor}`);
      this.floorChartData = [{ data: this.floorSummary.map(f => f.totalAmount), label: 'Amount' }];

      setTimeout(() => this.chart?.update(), 0);

      // Debug logs
      console.log('Project Expense Data:', this.expData);
      console.log('Floor Summary:', this.floorSummary);
      console.log('Worktype Summary:', this.worktypeSummary);
      console.log('Expensetype Summary:', this.expensetypeSummary);
    });
  }
}
