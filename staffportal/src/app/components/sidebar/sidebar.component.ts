import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/Models/user';

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
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  username : string;
  isadmin: boolean;
  user: User;
  noadmin = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    if(this.username == 'admin')
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
  }
     logout() {
      // clear session
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }

}
