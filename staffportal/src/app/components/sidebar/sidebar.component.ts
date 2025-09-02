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
    { path: '/labourrecord', title: 'Labour Record',icon:'fa fa-microphone text-warning', class:''},


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
  { path: '/labourrecord', title: 'Labour Record',icon:'fa fa-microphone text-warning', class:''},
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
  { path: '/labourrecord', title: 'Labour Record',icon:'fa fa-microphone text-warning', class:''},
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
  totalreqcount: number = 0;
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
        console.log(this.submittedRequestCount);
        sessionStorage.setItem('submittedRequestCount', this.submittedRequestCount.toString());
      });
    }
    const query = `
    SELECT COUNT(*)::INTEGER
    FROM employees e
    JOIN expenses ex ON e.id = ex.empid
    WHERE e.manager = '${this.username}' AND ex.status = 'UnApproved';
    `;
      this.queryService.query(query).subscribe(res=>{
      this.unApprovedCount = res.data[0].count;
      console.log(this.unApprovedCount);
      sessionStorage.setItem('unApprovedCount', this.unApprovedCount.toString());
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
