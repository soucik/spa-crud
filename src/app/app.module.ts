import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Http, HttpModule } from '@angular/http';
import { routing }        from './app.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BearerAuthService } from './services/bearer-auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    routing,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [BearerAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
