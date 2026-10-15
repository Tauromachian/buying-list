export class BadRequest extends Error {
  constructor(msg: string) {
    msg ??= "Bad Request";

    super(msg);
  }
}
