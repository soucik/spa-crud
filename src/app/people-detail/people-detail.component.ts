import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators     } from '@angular/forms';
import { Router } from '@angular/router';

import { IPerson, INotice } from '../common/interfaces';
import { PeopleService } from '../services/people.service';
import { ElementRef, Renderer } from '@angular/core';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.component.html'
})

export class PeopleDetailComponent implements OnInit, OnChanges {
  @Input() formStatus: String;
  @Input() person: IPerson;
  private personDuplicate: IPerson;
  private updateForm: FormGroup;
  private editStateForm: boolean;
  private notice: INotice;

  @Output() personChanged = new EventEmitter<string>();

  constructor(private fb: FormBuilder, private peopleService: PeopleService, private router: Router, public el: ElementRef, public renderer: Renderer) {
    // listen for click event on document to hide notice
    renderer.listenGlobal('document', 'click', (event) => {
      if(this.notice && this.notice.text) this.notice.text = "";
    });
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
      this.peopleService.updatePerson(idPerson, updatedPerson, currentUser.token)
        .then(response => {
          if(response.status === 200 ){
          this.person = this.personDuplicate;   // dummy way, should resolve after, within method
          this.personChanged.emit('update');
          this.editStateForm = false;
          this.notice = { text: "Update successful", status: "success"};
        }
        else{
          this.notice = { text: "Something went wrong", status: "error"};
        }
        });
    }
  }

  onCreatePerson(creatingPerson: IPerson) {
    let currentUser = this.peopleService.getCurrentUserFromStorage();
    if (currentUser && currentUser.email != null && currentUser.token != null) {
      this.peopleService.createPerson(creatingPerson, currentUser.token)
        .then(response => {
          if(response.status === 201 ){
            this.editStateForm = false;
            this.personChanged.emit('create');
          this.notice = { text: "Create successful", status: "success"};
          
        }
        else{
          this.notice = { text: "Something went wrong", status: "error"};
        }
        });
    }
  }

  deletePerson(idPerson: number){
    let currentUser = this.peopleService.getCurrentUserFromStorage();
    if (currentUser && currentUser.email != null && currentUser.token != null) {

    this.peopleService.deletePerson(idPerson, currentUser.token)
    .then(response => {
       if(response.status === 200){
         this.notice = { text: "Delete successful", status: "success"};
        //  debugger;
        //  this.formStatus = "deleted";
         this.personChanged.emit('delete');
       }
       if(response.status === 403) this.notice = { text: "Forbiden", status: "warning"};
       //...other statuses
      })
    .catch(error => {
       {this.notice = { text: "Something went wrong", status: "error"} };
    });
  }
}
}
