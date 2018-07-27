import { Component, OnInit, Output, ViewChild, Renderer, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ICurrentUser, IPerson, INotice, IActionNotice, CommPersonToDetail, CommDetailToPerson } from '../common/interfaces';
import { PeopleService } from '../services/people.service';
import { BearerAuthService } from '../services/bearer-auth.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  providers: [PeopleService]
})

export class PeopleComponent implements OnInit {
  public currentUser: ICurrentUser;
  public people: IPerson[];
  public showDetail: boolean;
  public notice: INotice;
  public currentPersonId: number;
  @Output() detailState: IActionNotice;
  @ViewChild('childPeopleDetail') PeopleDetailComponent;

  constructor(
    private bearerAuthService: BearerAuthService,
    private peopleService: PeopleService,
    private router: Router,
    public renderer: Renderer,
    private el: ElementRef) {
    // listen for click event on document to hide notice
    renderer.listenGlobal('document', 'click', (event) => {
      this.notice = { text: '', status: '' };
    });
  }

  ngOnInit() {
    const currentUser = this.bearerAuthService.getCurrentUserFromStorage();
    if (currentUser) {
      this.currentUser = currentUser;
      this.notice = { text: 'Loading', status: 'warning' };
      this.loadPeople()
        .then((actualPeople) => {
          this.people = actualPeople;
          this.notice = { text: 'Logged in', status: 'success' };
        })
        .catch(error => {
          this.notice = { text: 'Something went wrong', status: 'error' };
        });
    }
  }

  loadPeople() {
    return this.peopleService.getPeopleFromServer(this.currentUser.token);
  }

  onSelectPerson(person: IPerson) {
    this.detailState = { action: CommPersonToDetail.select, person: person };
    this.showDetail = true;
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', 'black');
    this.PeopleDetailComponent.onActionCommand(this.detailState);
    this.currentPersonId = person.id;
  }

  prepareCreatePerson() {
    this.detailState = {
      action: CommPersonToDetail.create,
      person: {
        firstName: '',
        lastName: '',
        email: ''
      }
    };
    this.showDetail = !this.showDetail;
    this.PeopleDetailComponent.onActionCommand(this.detailState);
    this.currentPersonId = null;
  }

  detailFinished(commPD: IActionNotice) {
    switch (commPD.action) {
      case CommDetailToPerson.close:
        this.showDetail = false;
        this.currentPersonId = null;
        if (commPD.notice && commPD.notice.text && commPD.notice.status) {
          this.notice = commPD.notice;
        }
        break;
      case CommDetailToPerson.updated:
        this.loadPeople()
          .then((actualPeople) => {
            this.people = actualPeople;
            this.notice = commPD.notice;
          })
          .catch(error => {
            this.notice = { text: 'Load people error', status: 'error' };
          });
        break;
      case CommDetailToPerson.created:
        this.loadPeople()
          .then((actualPeople) => {
            this.people = actualPeople;
            this.onSelectPerson(this.people[this.people.length - 1]);
            this.notice = commPD.notice;
            this.currentPersonId = this.people[this.people.length - 1].id;
          })
          .catch(error => {
            this.notice = { text: 'Load people error', status: 'error' };
          });
        break;
      case CommDetailToPerson.deleted:
        if (commPD.notice.status !== 'error') {
          this.loadPeople()
            .then((actualPeople) => {
              this.people = actualPeople;
              this.currentPersonId = null;
            })
            .catch(error => {
              this.notice = { text: 'Load people error', status: 'error' };
            });
          this.showDetail = false;
        }
        this.notice = commPD.notice;
        break;
    }
  }

  logOut() {
    if (this.bearerAuthService.destroySavedUser(this.currentUser)) {
      this.router.navigateByUrl('login');
    }
  }
}
