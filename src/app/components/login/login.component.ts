import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { tap, catchError } from 'rxjs/operators';
import { AppCookieService } from 'src/app/services/app-cookie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private userService: UserService,
    private appCookieService : AppCookieService,
    private router : Router
    ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if(this.loginFormGroup.invalid){
      return;
    }

    let email = this.loginFormGroup.controls['email'].value;
    let password = this.loginFormGroup.controls['password'].value;

    this.userService.login(email, password).pipe(
      tap((response) => {
        this.appCookieService.setAccessToken(response.token);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        alert(error.error.error);
        throw error;
      })
    ).subscribe();
  }
}
