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
