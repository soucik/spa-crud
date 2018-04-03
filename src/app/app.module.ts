import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Http, HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PeopleComponent } from './people/people.component';
import { PeopleDetailComponent } from './people-detail/people-detail.component';
import { BearerAuthService } from './services/bearer-auth.service';
import { PeopleService } from './services/people.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PeopleComponent,
    PeopleDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    routing,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    BearerAuthService,
    PeopleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
