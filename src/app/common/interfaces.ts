import { TextNotice, StateNotice } from './enums';

export interface ICurrentUser {
  email: string;
  password?: string;
  token?: string;
}

export interface IPerson {
  firstName: string;
  lastName: string;
  email: string;
  id?: number;
  ownerId?: number;
}


export interface INotice {
  text: TextNotice;
  status: StateNotice;
}

export interface IActionNotice {
  action: string;
  notice?: INotice;
  person?: IPerson;
}
