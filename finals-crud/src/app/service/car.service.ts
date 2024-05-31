import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './Book';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  REST_API: string = 'http://localhost:8000/api'; // Your backend API URL

  constructor(private http: HttpClient) { }

  getCars(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.REST_API}/cars`);
  }
}
