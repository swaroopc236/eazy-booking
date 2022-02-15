import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { SigninComponent } from './features/signin/signin.component';
import { RoomAddComponent } from './features/room/room-add/room-add.component';
import { RoomEditComponent } from './features/room/room-edit/room-edit.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'login', component: LoginComponent },
  { path: 'room-add', component: RoomAddComponent },
  { path: 'room-edit', component: RoomEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
