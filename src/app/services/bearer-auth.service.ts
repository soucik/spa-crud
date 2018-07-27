import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import { ICurrentUser } from '../common/interfaces';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class BearerAuthService implements CanActivate {

  public urlBase = 'https://sampleaspnetcorewebapi.azurewebsites.net';
  public userRequest: RequestOptionsArgs = new Object();

  constructor(private http: Http, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  getTokenFromServer(currentUser): Promise<string> {
    this.userRequest.body = { 'email': currentUser.email, 'password': currentUser.password };
    return this.http.post(this.urlBase + '/token', '', this.userRequest).toPromise()
      .then(response => {
        let token = response.text();
        token = token.substr(1, token.length - 2);
        if (typeof token === 'string') {
          return token;
        } else {
          return null;
        }
      })
      .catch(error => { console.error(error); return null; });
  }

  saveCurrentUserToStorage(currentUser: ICurrentUser): boolean {
    try {
      localStorage.setItem('currentUser', JSON.stringify({ 'email': currentUser.email, 'token': currentUser.token }));
      return true;
    } catch {
      return false;
    }
  }

  getCurrentUserFromStorage(): ICurrentUser {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.email != null && currentUser.token != null) {
        return currentUser;
      }
    } catch {
      return null;
    }
  }

  destroySavedUser(currentUser: ICurrentUser): boolean {
    try {
      localStorage.setItem('currentUser', '');
      return true;
    } catch {
      return false;
    }
  }
}
