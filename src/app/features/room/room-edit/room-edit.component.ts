import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css'],
})
export class RoomEditComponent implements OnInit {
  roomForm: FormGroup;
  roomData: any;
  errormsg: undefined;
  roomDetails: any = {
    roomId: '',
    roomName: '',
    roomDetails: null,
  };
  constructor(
    private roomService: RoomService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.roomData = this.router.getCurrentNavigation()?.extras.state;
    this.roomDetails.roomId = this.roomData.roomData.roomId;
    this.roomDetails.roomName = this.roomData.roomData.roomName;
    this.roomDetails.roomDetails = this.roomData.roomData.roomDetails;
    this.roomForm = this.fb.group({
      roomName: [this.roomDetails.roomName, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  editRoom() {
    this.roomDetails.roomName = this.roomForm.value['roomName'];
    this.roomService.editRoom(this.roomDetails).subscribe(
      (data: any) => {
        console.log(data);
        this.router.navigateByUrl('/admin');
      },
      (err: any) => {
        this.errormsg=err.error.msg;
        console.log('Error while registering',this.errormsg);
      }
    );
  }

  onFocus(){
    this.errormsg=undefined;
  }
  
}
