import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { ICurrentUser, IPerson } from '../common/interfaces';
import { BearerAuthService } from '../services/bearer-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [BearerAuthService]
})
export class LoginComponent {
  private loginForm: FormGroup;
  private currentUser: ICurrentUser = { email: '', password: '' };
  private people: IPerson[];

  constructor(private bearerAuth: BearerAuthService,
    private fb: FormBuilder,
    private router: Router) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(currentUser: ICurrentUser) {
    let promisedToken = this.bearerAuth.getTokenFromServer(currentUser);
    promisedToken
      .then((token: string) => {
        if (token == null)
          console.log('something went wrong');
        else {
          this.currentUser = currentUser;
          this.currentUser.token = token;
          this.bearerAuth.saveCurrentUserToStorage(this.currentUser);
          this.router.navigate(['/people']);
        }
      });
  }
}
