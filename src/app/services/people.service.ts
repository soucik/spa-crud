import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers, RequestOptionsArgs, RequestOptions } from '@angular/http';

import { ICurrentUser, IPerson } from '../common/interfaces';

@Injectable()
export class PeopleService {

  private urlBase = 'http://sampleaspnetcorewebapi.azurewebsites.net';

  constructor(private http: Http) {
  }

  getTokenFromServer(currentUser): Promise<string> {
    const userRequest: RequestOptionsArgs = new Object();
    userRequest.body = { 'email': currentUser.email, 'password': currentUser.password };

    return this.http.post(this.urlBase + '/token', '', userRequest).toPromise()
      .then(response => {
        let token = response.text();
        token = token.substr(1, token.length - 2);
        if (typeof token === 'string') {
          return token;
        } else {
          return null;
        }
      })
      .catch(error => { return null; });
  }

  saveCurrentUserToStorage(currentUser: ICurrentUser): boolean {
    try {
      localStorage.setItem('currentUser', JSON.stringify({ 'email': currentUser.email, 'token': currentUser.token }));
      return true;
    } catch {
      return false;
    }
  }

  destroySavedUser(currentUser: ICurrentUser): boolean {
    try {
      console.log('triing to logout '+ currentUser);
      localStorage.setItem('currentUser', '');
      return true;
    } catch {
      return false;
    }
  }

  getCurrentUserFromStorage(): ICurrentUser {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  createBearerHeader(token): Headers {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    header.append('accept', 'application/json');
    return header;
  }

  getPeopleFromServer(token: string): Promise<IPerson[]> {
    const headerOptions = this.createBearerHeader(token);

    let promisedPeople = this.http.get(this.urlBase + '/api/people', { headers: headerOptions }).toPromise();
    return promisedPeople.then((response) => <IPerson[]>response.json());
  }

  updatePerson(id: any, personToUpdate: IPerson, token: string): Promise<any> {

    let requestOptEditPerson = { headers: this.createBearerHeader(token), body: personToUpdate };
    return this.http.put(this.urlBase + '/api/people/' + id, '', requestOptEditPerson).toPromise()
      .then(response => { 
        return response; 
      })
      .catch(reject => {
        return reject;
      });
  }

   createPerson(personToCreate: IPerson, token: string): Promise<any> {

    let requestOptEditPerson = { headers: this.createBearerHeader(token), body: personToCreate };
    return this.http.post(this.urlBase + '/api/people/', '', requestOptEditPerson).toPromise()
      .then(response => { 
        return response; 
      })
      .catch(reject => {
        return reject;
      });
  }

  deletePerson(id: any, token: string): Promise<any> {

    let requestOptEditPerson = { headers: this.createBearerHeader(token) };
    return this.http.delete(this.urlBase + '/api/people/' + id,  requestOptEditPerson).toPromise()
      .then(response => { 
        return response; 
      })
      .catch(reject => {
        return reject;
      });
  }
}
