import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private ROOMS_URL = 'https://eazy-booking-staging.herokuapp.com/rooms';
  // private ROOMS_URL = 'http://localhost:5000/rooms';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getRooms() {
    return this.http.get(`${this.ROOMS_URL}`);
  }

  addRoom(roomDetails: any) {
    return this.http.post(`${this.ROOMS_URL}`, roomDetails, {
      withCredentials: true,
    });
  }

  editRoom(roomDetails: any) {
    return this.http.put(
      `${this.ROOMS_URL}/${roomDetails.roomId}`,
      roomDetails,
      {
        withCredentials: true,
      }
    );
  }

  deleteRoom(roomId: string) {
    return this.http.delete(`${this.ROOMS_URL}/${roomId}`, {
      withCredentials: true,
    });
  }
}
