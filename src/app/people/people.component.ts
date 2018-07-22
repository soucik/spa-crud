import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { ICurrentUser, IPerson } from '../common/interfaces';
import { PeopleService } from '../services/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  providers: [PeopleService]
})
export class PeopleComponent implements OnInit {
  private currentUser: ICurrentUser;
  private people: IPerson[];
  private selectedPerson: IPerson;
  @Output() formStatus: String;

  constructor(
    private peopleService: PeopleService,
    private router: Router) {
      this.formStatus = 'closed';
  }

  ngOnInit() {
    let currentUser = this.peopleService.getCurrentUserFromStorage();
    if (currentUser && currentUser.email != null && currentUser.token != null) {
      this.currentUser = currentUser;
      this.loadPeople(currentUser.token);
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadPeople(token: string): void {
    let promisedPeople = this.peopleService.getPeopleFromServer(this.currentUser.token);
    promisedPeople.then(people => this.people = people);
  }

  onSelect(person: IPerson): void {
    this.formStatus = 'closed';
    this.selectedPerson = person;
  }

  creatingPerson(): void {
    this.formStatus = 'open';
    this.selectedPerson = {
      firstName: '',
      lastName:'',
      email: ''
    };
  }


  childChangedPerson(action: String) {
    this.loadPeople(this.currentUser.token);
    switch(action){
      case 'delete':
        this.selectedPerson = null;
      break;

    }
  }

  logOut(){
    if(this.peopleService.destroySavedUser(this.currentUser)){
      this.router.navigateByUrl('login');
    }
  }
}
