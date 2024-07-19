import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/data.service';


export enum IdleUserTimes {
  IdleTime = 540000,
  CountdownTime = 60000
}

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private timeoutId: any;
  private countdownId: any;
  private countdownValue: number;

  userInactive: Subject<boolean> = new Subject();

  constructor(private router:Router, private toastr:ToastrService, private dataService: DataService) {
    this.reset();
    this.initListener();
  }

  initListener() {
    window.addEventListener('mousemove', () => this.reset());
    window.addEventListener('click', () => this.reset());
    window.addEventListener('keypress', () => this.reset());
    window.addEventListener('DOMMouseScroll', () => this.reset());
    window.addEventListener('mousewheel', () => this.reset());
    window.addEventListener('touchmove', () => this.reset());
    window.addEventListener('MSPointerMove', () => this.reset());
  }

  reset() {
    clearTimeout(this.timeoutId);
    clearTimeout(this.countdownId);
    this.startIdleTimer();
  }

  startIdleTimer() {
    this.timeoutId = setTimeout(() => {
      console.log('Inactivity detected');
      this.startCountdown();
    }, IdleUserTimes.IdleTime);
  }

  startCountdown() {
    this.countdownValue = IdleUserTimes.CountdownTime / 1000;
    this.countdownId = setInterval(() => {
      this.countdownValue--;
      console.log('You will logout in:', this.countdownValue, 'seconds');
      if (this.countdownValue <= 0) {
        clearInterval(this.countdownId);
        console.log('User idle');
        this.userInactive.next(true);
        this.toastr.warning("Due to inactivity, You've been Logged Out. Please Login again!")
        this.dataService.clear();
        //sessionStorage.clear();
        this.router.navigate(['/login']); // Redirect to login page
      }
    }, 1000);
  }
}