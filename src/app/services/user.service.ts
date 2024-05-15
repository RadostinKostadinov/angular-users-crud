import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:3000/users';

type PaginationResponse = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: User[];
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${baseUrl}/${id}`);
  }

  getByPage(page: number, perPage: number): Observable<PaginationResponse> {
    return this.http.get<PaginationResponse>(
      `${baseUrl}?_page=${page}&_per_page=${perPage}`
    );
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(baseUrl, user);
  }

  update(userId: string, user: User): Observable<User> {
    return this.http.put<User>(`${baseUrl}/${userId}`, user);
  }

  delete(id: string): Observable<User> {
    return this.http.delete<User>(`${baseUrl}/${id}`);
  }
}
