export interface IUser {
  objectId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  sessionToken: string;
  session: ISession;
  pin: string;
  backupPin: string;
  __type?: string;
  className?: string;
}

export interface ISession {
  objectId: string;
  sessionToken: string;
  user: IUser;
}

export class User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  objectId: string;
  sessionToken: string;
  session: ISession;
  pin: string;
  backupPin: string;

  constructor(user: IUser) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.username = user.username;
    this.email = user.email;
    this.objectId = user.objectId;
    this.sessionToken = user.sessionToken;
    this.session = user.session;
    this.pin = user.pin;
    this.backupPin = user.backupPin;
  }

  get isLoggedIn(): boolean {
    return !!this.sessionToken;
  }
}
