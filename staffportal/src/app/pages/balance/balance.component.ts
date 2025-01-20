import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { BalanceService } from 'src/app/services/balance-service/balance-service';
import { Employee } from 'src/app/services/Models/employee';
import { EmployeeService } from 'src/app/services/employee-service/employee-service';
import { ExpenseService } from 'src/app/services/expense-service/expense-service';
import { Project } from 'src/app/services/Models/project';
import { Balance } from 'src/app/services/Models/balance';
import { DataService } from 'src/app/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  username: String;
  employee : Employee;
  balance : Balance;
  fname : string;
  selectedEmployee = [];
  empId : Number;
  empNo : String;
  empbalamt = 0;
  empgratuity = 0;
  empbonus = 0;
  balanceamt = 0;
  employeeDetails : Employee;
  lastbalrequests = [];
  count = 0;
  constructor(private router : Router, private balanceService: BalanceService, private employeeService : EmployeeService, private dataService:DataService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    //this.username = this.dataService.getUsername();
    this.empId = Number(sessionStorage.getItem('empId'));
    //this.empId = this.dataService.getEmpId();
    this.employeeService.getEmpById(this.empId).subscribe(res=>{
      this.employeeDetails = res;
      this.empNo = this.employeeDetails.empNo;
      this.username = this.employeeDetails.username;
   });
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
    this.balanceService.getlastbalRequest(this.empId).subscribe(res=>{
      console.log(res);
      this.lastbalrequests = res;
    });
  }
  backtoMenu() {
    this.router.navigate(['/home']);
  }
  addbalance()
  {
    console.log(this.balanceamt);
    const body = {
        "empId": this.empId,
        "empNo": this.empNo,
        "empName":this.username,
        "Amount": this.balanceamt
    }
    if(this.balanceamt>0)
    {
      this.balanceService.createbalanceRequests(body).subscribe(res=>{
        console.log(res);
        this.toastrService.success("Balance Request Created Successfully");
        this.router.navigate(['/home']);
      })
      const whatsappUrl = `https://wa.me/919372365225?text=Hello%20Sir%2C%20Request%20to%20add%20balance%20for%3A%20${this.empNo+' - '+this.username}%20of%20Amount%3A%20${this.balanceamt}`;
      window.open(whatsappUrl, '_blank');
    }
    else
    this.toastrService.error("Request Amount Cannot be 0");
  }
  redirectToWhatsApp(bal)
  {
    const buttonClickKey = `whatsappClicks_${bal.Amount}_${bal.createdAt}`;
    const currentDate = new Date().toDateString(); // Track for the current day
    let storedData = JSON.parse(localStorage.getItem(buttonClickKey) || '{}');
  
    // If the stored date matches today's date, use the click count; otherwise, reset it
    if (storedData.date !== currentDate) {
      storedData = { date: currentDate, clicks: 0 }; // Reset for a new day
    }
    console.log('Stored Data:', storedData);
  
    if (storedData.clicks >= 2) {
      this.toastrService.error('You can only click this button twice a day','', {
        timeOut: 3000,
      });
      return;
    }
  
    // Increment the click count and update localStorage
    storedData.clicks += 1;
    localStorage.setItem(buttonClickKey, JSON.stringify(storedData));

    console.log('Stored Data:', storedData);
    // Format the date
    const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(bal.createdAt));
    
    // Construct the message
    const message = `Hello, I have a query regarding the balance request Submitted for ${this.empNo+' - '+this.username} with Amount: ${bal.Amount} raised on ${formattedDate}.`;
    
    // Construct the WhatsApp URL
    const whatsappUrl = `https://wa.me/919372365225?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  }

}
