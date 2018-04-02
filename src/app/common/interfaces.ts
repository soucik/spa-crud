export interface ICurrentUser {
    email: string,
    password?: string,
    token?: string
  }
  
  export interface IPerson {
    id: number,
    ownerId: number,
    firstName: string,
    lastName: string,
    email: string
  }