import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators'
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user-service/user-service';
import { User } from 'src/app/services/Models/user';

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
    constructor(private activatedRoute: ActivatedRoute,
        private toastr: ToastrService, private router:Router, private userService:UserService) { }

    ngOnInit() {
        this.username = sessionStorage.getItem('username');
        console.log(this.username);

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
