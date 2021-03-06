import {Injectable} from '@angular/core';

@Injectable(
  {providedIn: 'root'}
)
export class LocalStorageService {

  constructor() {
  }

  public store(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public storeSingleItem(key: string, data: any): void {
    localStorage.setItem(key, data);
  }

  public getItem(key: string): any {
    return localStorage.getItem(key);
  }

  public clear(key: string): any {
    localStorage.removeItem(key);
  }

  public clearAll(key: any): any {
    localStorage.clear();
  }
}
