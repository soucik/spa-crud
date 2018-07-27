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

export enum CommPersonToDetail {
  create = 'CREATE',
  select = 'SELECT'
}

export enum CommDetailToPerson {
  created = 'CREATED',
  updated = 'UPDATED',
  deleted = 'DELETED',
  close = 'CLOSE'
}

export interface INotice {
  text: string;
  status: string;
}

export interface IActionNotice {
  action: string;
  notice?: INotice;
  person?: IPerson;
}
