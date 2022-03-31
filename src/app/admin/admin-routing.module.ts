import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomAddComponent } from '../features/room/room-add/room-add.component';
import { RoomEditComponent } from '../features/room/room-edit/room-edit.component';
import { AdminComponent } from './admin.component';

const routes: Routes = [{ path: '', component: AdminComponent },
  { path: 'room-add', component: RoomAddComponent },
  { path: 'room-edit', component: RoomEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
