import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Http, HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BearerAuthService } from './services/bearer-auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [BearerAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
