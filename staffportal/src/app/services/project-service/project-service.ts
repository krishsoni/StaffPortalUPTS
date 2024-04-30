import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { Project } from '../../services/Models/project';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { environment } from '../../../../environments/environment';

@Injectable()
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<any>
  {
    return this.http.get(environment.apis.getAllProjects);
  }
  getProjectByName(project : Project): Observable<any>
  {
    return this.http.post(environment.apis.getProjectByName, project);
  }

  createProject(project: Project): Observable<any>
  {
    return this.http.post(environment.apis.createproject, project);
  }

  updateProject(id: Number, project: Project): Observable<any>
  {
    return this.http.put(environment.apis.updateProject+id, project);
  }
}
