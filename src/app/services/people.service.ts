import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs, RequestOptions } from '@angular/http';

import { IPerson } from '../common/interfaces';

@Injectable()
export class PeopleService {
  public urlBase = 'https://sampleaspnetcorewebapi.azurewebsites.net';

  constructor(private http: Http) {
  }

  createBearerHeader(token: string): Headers {
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + token);
    header.append('Content-Type', 'application/json');
    header.append('accept', 'application/json');
    return header;
  }

  getPeopleFromServer(token: string): Promise<IPerson[]> {

    const headerOptions = this.createBearerHeader(token);
    const promisedPeople = this.http.get(this.urlBase + '/api/people', { headers: headerOptions }).toPromise();
    return promisedPeople.then((response) => <IPerson[]>response.json());
  }

  updatePerson(id: any, personToUpdate: IPerson, token: string): Promise<any> {

    const requestOptEditPerson = { headers: this.createBearerHeader(token), body: personToUpdate };
    return this.http.put(this.urlBase + '/api/people/' + id, '', requestOptEditPerson).toPromise();
  }

  createPerson(personToCreate: IPerson, token: string): Promise<any> {

    const requestOptEditPerson = { headers: this.createBearerHeader(token), body: personToCreate };
    return this.http.post(this.urlBase + '/api/people/', '', requestOptEditPerson).toPromise();
  }

  deletePerson(id: number, token: string): Promise<any> {

    const requestOptEditPerson = { headers: this.createBearerHeader(token) };
    return this.http.delete(this.urlBase + '/api/people/' + id, requestOptEditPerson).toPromise();
  }
}
