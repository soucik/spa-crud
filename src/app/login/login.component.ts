import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ICurrentUser, INotice } from '../common/interfaces';
import { BearerAuthService } from '../services/bearer-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [BearerAuthService]
})
export class LoginComponent {

  public loginForm: FormGroup;
  public currentUser: ICurrentUser = { email: '', password: '' };
  public notice: INotice = { text: 'No person logged in', status: 'warning' };

  constructor(
    private bearerAuthService: BearerAuthService,
    private fb: FormBuilder,
    private router: Router) {

    const currentLoggedUser: ICurrentUser = this.bearerAuthService.getCurrentUserFromStorage();
    if (currentLoggedUser) {
      this.currentUser = currentLoggedUser;
      this.router.navigate(['/people']);
    } else {
      this.createForm();
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(currentUser: ICurrentUser) {
    const promisedToken = this.bearerAuthService.getTokenFromServer(currentUser);
    promisedToken.then((token: string) => {
      if (token) {
        this.currentUser = currentUser;
        this.currentUser.token = token;
        this.bearerAuthService.saveCurrentUserToStorage(this.currentUser);
        this.router.navigate(['/people']);
      } else {
        this.notice = { text: 'Bad password, name or combination', status: 'error' };
      }
    }).catch((error) => {
      this.notice = { text: error, status: 'error' };
    });
  }
}
