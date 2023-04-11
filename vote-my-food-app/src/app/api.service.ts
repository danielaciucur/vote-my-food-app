import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiData } from './api-data.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://amperoid.tenants.foodji.io/machines/4bf115ee-303a-4089-a3ea-f6e7aae0ab94';
  refreshItems = false;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ApiData> {
    return this.http.get<ApiData>(this.apiUrl);
  }

  setRefreshItems(val: boolean) {
    this.refreshItems = val;
  }
}
