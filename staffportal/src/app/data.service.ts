import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private empId = 0;
  private isadmin = false;
  private token ='';
  private selectedprojectname ='';
  private username ='';
  private _id = '';
  private expProject = 0;
  private expEmp = '';
  private empch = '';

  constructor() { }

  getEmpId(): number {
    return this.empId;
  }

  setEmpId(value: number): void {
    this.empId = value;
  }

  getisAdmin():boolean {
    return this.isadmin;
  }

  setisAdmin(value: boolean): void {
    this.isadmin = value;
  }

  getToken(): string {
    return this.token;
  }

  setToken(value: string):void{
    this.token = value;
  }

  getselectedProject(): string {
    return this.selectedprojectname;
  }

  setselectedProject(value:string):void{
    this.selectedprojectname = value;
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(value: string):void{
    this.username = value;
  }

  getId(): string {
    return this._id;
  }

  setId(value: string):void{
    this._id = value;
  }

  getexpProject(): number {
    return this.expProject;
  }
  
  setexpProject(value: number): void {
    this.expProject = value;
  }

  getexpEmp(): string {
    return this.expEmp;
  }

  setexpEmp(value:string):void{
    this.expEmp = value;
  }

  getempch():string {
    return this.empch;
  }

  setempch(value: string):void{
    this.empch = value;
  }

  clear(){
    this.empId = 0;
    this.isadmin = false;
    this.token ='';
    this.selectedprojectname ='';
    this.username ='';
    this._id = '';
    this.expProject = 0;
    this.expEmp = '';
    this.empch = '';
  }

}
