export class Logger {

  private static _instance: Logger;

  public static get instance() {
    return Logger._instance || (Logger._instance = new Logger());
  }

  log(...data: any[]) {
    console.log(...data);
  }
}
