import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { NgxSpinnerService } from 'ngx-spinner';
import { RoomService } from '../services/room.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-room-add',
  templateUrl: './room-add.component.html',
  styleUrls: ['./room-add.component.css'],
})
export class RoomAddComponent implements OnInit {
  errormsg: undefined;
  roomForm: FormGroup;
  roomDetails: any = {
    roomName: '',
    roomDetails: null,
  };
  constructor(
    private roomService: RoomService,
    private fb: FormBuilder,
    // private spinnerService: NgxSpinnerService,
    private router: Router,
    private location: Location
  ) {
    this.roomForm = this.fb.group({
      roomName: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  addRoom() {
    this.roomDetails.roomName = this.roomForm.value['roomName'];
    // this.spinnerService.show();
    this.roomService.addRoom(this.roomDetails).subscribe(
      (data: any) => {
        console.log(data);
        // this.spinnerService.hide();
        this.router.navigateByUrl('/admin', { replaceUrl: true });
      },
      (err) => {
        this.errormsg = err.error.msg;
        console.log('Error in adding room', err);
        // this.spinnerService.hide();
      }
    );
  }
  onFocus() {
    this.errormsg = undefined;
  }

  onCancel() {
    this.location.back();
  }
}
