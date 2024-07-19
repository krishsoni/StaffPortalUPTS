import { Component, OnInit } from '@angular/core';
import { IdleService } from './services/idle-service/idle-service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { NavigationStart, Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'argon-dashboard-angular';
  isUserIdle: boolean = false;
//   constructor(private idle: Idle, private keepalive: Keepalive,private router: Router) {
//     // Set idle timeout to 30 minutes
//     this.idle.setIdle(10);

//     // Set timeout to 5 minutes of inactivity
//     this.idle.setTimeout(10);

//     // Set keepalive interval to 5 minutes
//     this.keepalive.interval(10);

//     // Listen for idle events
// idle.onIdleEnd.subscribe(() => console.log('User resumed'));
//     this.idle.onTimeout.subscribe(() => console.log('User timed out'));
//   }

//   ngOnInit() {
//     // Start watching for idle events
//     //this.idle.watch();
//     this.idle.onTimeout.subscribe(() => {
//       // Perform logout actions here
//       console.log('Logging out due to inactivity');
//       this.router.navigate(['/login']); // Redirect to login page
//     });
//     this.idle.watch(); 
    
//   }
constructor(private idleService: IdleService) {}

ngOnInit(): void {
  // Initialize the IdleService
  this.idleService.userInactive.subscribe(isIdle => this.isUserIdle = isIdle);
}

reset() {
  console.log('Reset idle timer');
  this.isUserIdle = false;
  this.idleService.reset();

}
}
