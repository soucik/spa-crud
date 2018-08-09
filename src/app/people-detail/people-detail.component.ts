import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BearerAuthService } from '../services/bearer-auth.service';
import { IPerson, IActionNotice } from '../common/interfaces';
import { CommPersonToDetail, CommDetailToPerson, TextNotice, StateNotice } from '../common/enums';
import { PeopleService } from '../services/people.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.component.html'
})

export class PeopleDetailComponent implements OnInit {

  public personDuplicate: IPerson;
  public updateForm: FormGroup;
  public detailFormEdit: boolean;
  public isCreateState: boolean;
  public personDetail: IPerson;

  @Output() detailFinished = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    public el: ElementRef,
    private bearerAuthService: BearerAuthService) {

    this.detailFormEdit = false;
  }

  ngOnInit() {
    this.createForm();
    this.personDetail = {
      firstName: '',
      lastName: '',
      email: ''
    };
  }

  closeDetail() {
    this.detailFinished.emit(<IActionNotice>{ action: CommDetailToPerson.close });
  }

  onActionCommand(detailState) {
    switch (detailState.action) {

      case CommPersonToDetail.select:
        this.detailFormEdit = false;
        this.isCreateState = false;
        this.personDetail = Object.assign({}, detailState.person);
        break;

      case CommPersonToDetail.create:
        this.detailFormEdit = true;
        this.isCreateState = true;
        this.personDetail = detailState.person;
        break;

      default:
        console.warn('What should I do?');
        break;
    }
  }

  createForm() {
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email]
    });
  }

  onUpdatePerson(updatedPerson: IPerson, idPerson?: number) {
    const currentUser = this.bearerAuthService.getCurrentUserFromStorage();
    if (!idPerson) {
      this.onCreatePerson(updatedPerson);
      return;
    }
    this.peopleService.updatePerson(idPerson, updatedPerson, currentUser.token)
      .then(response => {
        this.detailFinished.emit(
          <IActionNotice>{ action: CommDetailToPerson.updated, notice: { text: TextNotice.updateOk, status: StateNotice.success } }
        );
        this.detailFormEdit = false;
      }).catch(error => this.detailFinished.emit(
        <IActionNotice>{ action: CommDetailToPerson.updated, notice: { text: error, status: StateNotice.error } }
      ));
  }

  onCreatePerson(personToCreate: IPerson) {
    const currentUser = this.bearerAuthService.getCurrentUserFromStorage();
    this.peopleService.createPerson(personToCreate, currentUser.token)
      .then(response => {
        this.detailFinished.emit(
          <IActionNotice>{ action: CommDetailToPerson.created, notice: { text: TextNotice.createOk, status: StateNotice.success } }
        );
      })
      .catch(error => this.detailFinished.emit(
        <IActionNotice>{ action: CommDetailToPerson.close, notice: { text: error, status: StateNotice.error } }
      ));
  }

  onDeletePerson(idPerson: number) {
    const currentUser = this.bearerAuthService.getCurrentUserFromStorage();
    this.peopleService.deletePerson(idPerson, currentUser.token)
      .then(response => {
        this.detailFinished.emit(
          <IActionNotice>{ action: CommDetailToPerson.deleted, notice: { text: TextNotice.deleteOk, status: StateNotice.success } }
        );
      }).catch(error => this.detailFinished.emit(
        <IActionNotice>{ action: CommDetailToPerson.deleted, notice: { text: error, status: StateNotice.error } }
      ));
  }
}
