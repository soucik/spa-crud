import { Component, Input } from '@angular/core';
import { IPerson } from '../common/interfaces';

@Component({
  selector: 'app-people-detail',
  templateUrl: './people-detail.component.html'
})
export class PeopleDetailComponent {
  @Input() person: IPerson;
  constructor() { }

}
