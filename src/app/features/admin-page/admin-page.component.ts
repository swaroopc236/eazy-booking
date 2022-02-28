import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoomService } from '../room/services/room.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  rooms: any = null;
  constructor(
    private roomService: RoomService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) {
    // this.getRooms();
  }

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms() {
    this.spinnerService.show();
    this.roomService.getRooms().subscribe(
      (data: any) => {
        console.log(data);
        this.rooms = data.data;
        this.spinnerService.hide();
      },
      (err) => {
        console.log('Error in getting rooms', err);
      }
    );
  }

  editRoom(room: any) {
    this.router.navigate(['/room-edit'], { state: { roomData: room } });
  }

  deleteRoom(room: any) {
    this.roomService.deleteRoom(room.roomId).subscribe(
      (data: any) => {
        console.log('Room deleted', data);
        this.getRooms();
      },
      (err) => {
        console.log('Error is deleting room', err);
      }
    );
  }
}
