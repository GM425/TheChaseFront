import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from '../models/room';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = 'http://localhost:3000/rooms';
  
  constructor(private http: HttpClient) {}

  getRoomsOpen(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }
}
