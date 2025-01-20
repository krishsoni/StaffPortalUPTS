import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concat, interval, Subscription } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/services/Models/user';
import { switchMap, tap } from 'rxjs/operators';
import { BalanceService } from 'src/app/services/balance-service/balance-service';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';
import { QueryService } from 'src/app/services/query-service/query-service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/projects', title: 'Projects',  icon:'ni-bullet-list-67 text-red', class: '' },
    { path: '/employees', title: 'Employees',  icon:'ni-badge text-danger', class:''},
    { path: '/balance', title: 'Balance',icon:'', class:''},
    { path: '/expense', title: 'Expense',icon:'', class:''},
    { path: '/home', title: 'Home',icon:'', class:''},
    { path: '/requests', title: 'Requests',icon:'', class:''},

];

declare interface AdminRouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ADMINUSERROUTES : AdminRouteInfo [] = [
  { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
  { path: '/projects', title: 'Projects',  icon:'ni-bullet-list-67 text-red', class: '' },
  { path: '/employees', title: 'Employees',  icon:'ni-badge text-danger', class:''},
  { path: '/requests', title: 'Requests',icon:'fa fa-recycle text-warning', class:''},
  { path: '/home', title: 'Home',icon:'fa fa-home', class:''},

];

declare interface UserRouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const USERROUTES : UserRouteInfo [] = [
  { path: '/home', title: 'Home',icon:'fa fa-home', class:''},
  { path: '/balance', title: 'Balance',icon:'fa fa-coins', class:''},
  { path: '/expense', title: 'Expense',icon:'fa fa-rupee-sign', class:''},
  { path: '/requests', title: 'Requests',icon:'fa fa-recycle text-warning', class:''},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  submittedRequestCount: number = 0;
  unApprovedCount: number = 0;
  public menuItems: any[];
  public isCollapsed = true;
  username : string;
  isadmin: boolean;
  user: User;
  noadmin = false;
  query: any;
  constructor(private router: Router, private dataService:DataService, private balanceService: BalanceService, private expService: ExpenseService,
    private queryService: QueryService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    //this.username = this.dataService.getUsername();
    if(sessionStorage.isadmin == 'true')
    //if(this.dataService.getisAdmin() == true)
    {
      this.menuItems = ADMINUSERROUTES.filter(menuItem => menuItem);
      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
     });
    }
     else{
      this.menuItems = USERROUTES.filter(menuItem => menuItem);
      this.router.events.subscribe((event) => {
        this.isCollapsed = true;
     });
     this.noadmin = true;
    }
    // if(sessionStorage.isadmin == 'true')
    // {
    //  // Poll every 5 minutes (300,000 milliseconds)
    //  this.subscription = concat(
    //   this.balanceService.getsubmittedCount().pipe(
    //     tap(response => {
    //       this.submittedRequestCount = response.count;
    //     })
    //   ),
    //   interval(300000).pipe(
    //     switchMap(() => this.balanceService.getsubmittedCount()),
    //     tap(response => {
    //       this.submittedRequestCount = response.count;
    //     })
    //   )
    // ).subscribe();
    // this.subscription = concat(
    //   this.expService.getunApprovedCount().pipe(
    //     tap(response => {
    //       this.unApprovedCount = response.count;
    //     })
    //   ),
    //   interval(300000).pipe(
    //     switchMap(() => this.expService.getunApprovedCount()),
    //     tap(response => {
    //       this.unApprovedCount = response.count;
    //     })
    //   )
    // ).subscribe();
    // }
    // else{
    //   // If user is not admin (e.g., manager), fetch only the expense count
    //   this.subscription = concat(
    //     this.expService.getunApprovedCount().pipe(
    //       tap(response => {
    //         this.unApprovedCount = response.count;
    //       })
    //     ),
    //     interval(300000).pipe(
    //       switchMap(() => this.expService.getunApprovedCount()),
    //       tap(response => {
    //         this.unApprovedCount = response.count;
    //       })
    //     )
    //   ).subscribe();
    // }
    if(sessionStorage.isadmin == 'true')
    {
    this.balanceService.getsubmittedCount().subscribe(res=>
      {
        this.submittedRequestCount = res.count;
      });
    }
    this.query = {
      "collectionName": "employees",
      "pipeline": [
        {
          "$match": {
            "manager": this.username
          }
        },
        {
          "$lookup": {
            "from": "expenses",
            "localField": "_id",
            "foreignField": "empId",
            "as": "employee_expenses"
          }
        },
        {
          "$unwind": {
            "path": "$employee_expenses",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          "$match": {
            "employee_expenses.status": "UnApproved"
          }
        },
        {
          "$project": {
            "_id": 0,
            "empId": "$_id",
            "empNo": "$empNo",
            "empName": "$username",
            "expId": "$employee_expenses._id",
            "projectNumber": "$employee_expenses.projectNumber",
            "expenseType": "$employee_expenses.expenseType",
            "amount": "$employee_expenses.amount",
            "noofWorkers": "$employee_expenses.noofWorkers",
            "pour": "$employee_expenses.pour",
            "floor": "$employee_expenses.floor",
            "worktype": "$employee_expenses.worktype",
            "remarks": "$employee_expenses.remarks",
            "status": "$employee_expenses.status",
            "createdAt": "$employee_expenses.createdAt",
            "updatedAt": "$employee_expenses.updatedAt",
            "__v": "$employee_expenses.__v"
          }
        }
      ]
    }
    this.queryService.query(this.query).subscribe(res=>{
      this.unApprovedCount = res.length;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe(); // Clean up the subscription
  }
     logout() {
      // clear session
      sessionStorage.clear();
      //this.dataService.clear();
      this.router.navigate(['/login']);
    }

}
