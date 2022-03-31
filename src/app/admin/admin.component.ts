import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RoomService } from '../features/room/services/room.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  rooms: any = null;
  constructor(
    private roomService: RoomService,
    private loader: NgxUiLoaderService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getRooms();
  }

  getRooms() {
    this.loader.start();
    this.roomService.getRooms().subscribe(
      (data: any) => {
        this.rooms = data.data;
        this.loader.stop();
      },
      (err) => {
        console.log('Error in getting rooms', err);
      }
    );
  }

  editRoom(room: any) {
    this.router.navigate(['/admin/room-edit'], { state: { roomData: room } });
  }

  deleteRoom(room: any) {
    this.roomService.deleteRoom(room.roomId).subscribe(
      (data: any) => {
        this.getRooms();
      },
      (err) => {
        console.log('Error is deleting room', err);
      }
    );
  }

}
