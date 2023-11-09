import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginResponse } from '../interface/i-login-response';
import { Observable } from 'rxjs';
import { IRegisterResponse } from '../interface/i-register-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private Http: HttpClient) { 
    
  }

  login(email: string ,password: string): Observable<ILoginResponse>{
    let url = 'http://localhost:8080/user/login';
    let body = {
      email: email,
      password: password
    }
    return this.Http.post<ILoginResponse>(url, body);
  }

  register(email: string ,password: string, name: string): Observable<IRegisterResponse>{
    let url = 'http://localhost:8080/user/register';
    let body = {
      name: name,
      email: email,
      password: password
    }
    return this.Http.post<IRegisterResponse>(url, body);
  }
}
