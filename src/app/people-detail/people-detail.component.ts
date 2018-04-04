import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators     } from '@angular/forms';
import { Router } from '@angular/router';

import { IPerson } from '../common/interfaces';
import { PeopleService } from '../services/people.service';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.component.html'
})

export class PeopleDetailComponent implements OnInit, OnChanges {

  @Input() person: IPerson;
  private personDuplicate: IPerson;
  private updateForm: FormGroup;
  private editStateForm: boolean;
  @Output() personChanged = new EventEmitter<number>();

  constructor(private fb: FormBuilder, private peopleService: PeopleService, private router: Router) {
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.editStateForm = false;
    this.personDuplicate = Object.assign({}, changes.person.currentValue);
  }

  createForm() {
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  onUpdatePerson(idPerson: number, updatedPerson: IPerson) {
    let currentUser = this.peopleService.getCurrentUserFromStorage();
    if (currentUser && currentUser.email != null && currentUser.token != null) {

      let operationSuccess: boolean;
      this.peopleService.updatePerson(idPerson, updatedPerson, currentUser.token)
        .then(response => {
          this.person = this.personDuplicate;   // dummy way, should resolve after, within method
          this.personChanged.emit(idPerson);
          this.editStateForm = false;
          operationSuccess = response;
        });
    }
  }
}
