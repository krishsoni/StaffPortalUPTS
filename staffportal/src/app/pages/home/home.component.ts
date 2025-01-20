import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators'
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
    selectedItems:any = [];
    tableno: string;
    user:User;
    password:string;
    isadmin:boolean;
    response : User;
    empId : Number;
    expenseList = [];
    latestSixEntries = [];
    test: Date = new Date();
    constructor(private activatedRoute: ActivatedRoute,
        private toastr: ToastrService, private router:Router, private userService:UserService, private dataService: DataService,
        private expenseService: ExpenseService) { }

    ngOnInit() {
        this.username = sessionStorage.getItem('username');
        //this.username = this.dataService.getUsername();
        console.log(this.username);
        console.log("EmpId is not null: Home Component "+ sessionStorage.getItem('empId'));
        this.empId = Number(sessionStorage.getItem('empId'));
        this.expenseService.getExpensesByEmpId(this.empId).subscribe(res=>{
          this.latestSixEntries = [];
          this.latestSixEntries = res;
          console.log(this.latestSixEntries);   
        });
    }

    onValChange(value){
        console.log(value);
        this.ngOnInit();
   }

      click(){
        this.router.navigate(['/balance']);
      }
      click2(){
        this.router.navigate(['/expense']);
      }
}
