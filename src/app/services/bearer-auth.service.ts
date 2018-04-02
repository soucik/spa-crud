import { Injectable } from '@angular/core';
import { Http, HttpModule, RequestOptionsArgs } from '@angular/http';
import { ICurrentUser } from '../common/interfaces';

@Injectable()
export class BearerAuthService {

  private urlBase: string = 'http://sampleaspnetcorewebapi.azurewebsites.net';
  private userRequest: RequestOptionsArgs = new Object();

  constructor(private http: Http) {

  }

  getTokenFromServer(currentUser): Promise<string> {
    this.userRequest.body = { 'email': currentUser.email, 'password': currentUser.password };

    return this.http.post(this.urlBase + '/token', '', this.userRequest).toPromise()
      .then(response => {
        let token = response.text();
        token = token.substr(1, token.length - 2);
        console.log(token);
        if (typeof token == "string") {
          return token;
        } else {
          return null;
        }
      })
      .catch(error => { return null });
  }

  saveCurrentUserToStorage(currentUser: ICurrentUser): boolean {
    try {
      localStorage.setItem('currentUser', JSON.stringify({ 'email': currentUser.email, 'token': currentUser.token }));
      return true;
    }
    catch{
      return false;
    }
  }

  getCurrentUserFromStorage(): ICurrentUser {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}