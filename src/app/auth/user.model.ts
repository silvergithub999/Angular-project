export class User {
  constructor(
    public email: string,
    id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  /*
  LAHE ASI
   */
  get token() {
    if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
