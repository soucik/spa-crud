import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers, RequestOptionsArgs, RequestOptions } from '@angular/http';

import { ICurrentUser, IPerson } from '../common/interfaces';

@Injectable()
export class PeopleService {

  private urlBase: string = 'http://sampleaspnetcorewebapi.azurewebsites.net';
  private commonHeader: any;
  private userRequest: RequestOptionsArgs = new Object();

  constructor(private http: Http) {
    this.commonHeader = { headers: new Headers({ 'Access-Control-Allow-Origin': '*' }) };
  }

  getTokenFromServer(currentUser): Promise<string> {
    this.userRequest.body = { 'email': currentUser.email, 'password': currentUser.password };

    return this.http.post(this.urlBase + '/token', '', this.userRequest).toPromise()
      .then(response => {
        let token = response.text();
        token = token.substr(1, token.length - 2);
        if (typeof token == "string")
          return token;
        else
          return null;
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

  getPeopleFromServer(token: string): Promise<IPerson[]> {
    let header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    let options: RequestOptionsArgs = { headers: header }

    let promisedPeople = this.http.get(this.urlBase + '/api/people', options).toPromise();
    return promisedPeople.then((response) => <IPerson[]>response.json());
  }
}
