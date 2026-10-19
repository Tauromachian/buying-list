export class BadRequest extends Error {
  constructor(msg: string) {
    msg ??= "Bad Request";

    super(msg);
  }
}

export class GeneralResNotOk extends Error {
  constructor(res: Response) {
    const msg = `HTTP ERROR::: Status:${res.status} Text:${res.statusText}`;

    super(msg);
  }
}
