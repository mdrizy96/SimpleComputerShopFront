import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseService} from './base.service';
import {environment} from '../../../environments/environment';
import {IConfigurationCost, ILaptopBrand, ILaptopConfigurationItem} from '../models/shop.model';
import {catchError} from 'rxjs/operators';

@Injectable(
  {providedIn: 'root'}
)
export class ShopService extends BaseService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
  };

  constructor(private httpClient: HttpClient) {
    super();
  }

  getAllLaptopBrands(): any {
    return this.httpClient
      .get<ILaptopBrand[]>(`${environment.apiUrl}/api/shop/laptops/brands`)
      .pipe(catchError(this.handleError));
  }

  getLaptopConfigurationItems(): any {
    return this.httpClient
      .get<ILaptopConfigurationItem[]>(`${environment.apiUrl}/api/shop/laptops/config_options`)
      .pipe(catchError(this.handleError));
  }

  getConfigurationCostsOfItem(configurationItemId: number): any {
    return this.httpClient
      .get<IConfigurationCost[]>(`${environment.apiUrl}/api/shop/laptops/config_options/${configurationItemId}/costs`)
      .pipe(catchError(this.handleError));
  }
}
