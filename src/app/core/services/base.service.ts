import {throwError} from 'rxjs';

export abstract class BaseService {

  protected constructor() {
  }

  protected handleError(error: any): any {

    const applicationError = error.headers.get('Application-Error');

    // either application-error in header or model error in body
    if (applicationError) {
      return throwError(applicationError);
    }
    // console.log(error);

    let appError = error.error;

    // either app-error in header or model error in body
    if (Array.isArray(appError) && appError.length > 0) {
      return throwError(JSON.stringify(appError));
    }

    appError = error.error.Message || error.error.message;

    // either app-error in header or model error in body
    if (appError) {
      return throwError(appError.toString());
    }

    const message = error.message ? error.message : error.toString();
    console.log('From Error Handler', message);
    // throw error;
    return throwError(message);
  }
}
