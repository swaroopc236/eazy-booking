import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleComponent } from './features/booking/schedule/schedule.component';
import { EventsComponent } from './features/events/events.component';
import { LoginComponent } from './features/login/login.component';
import { SigninComponent } from './features/signin/signin.component';
import { RoomAddComponent } from './features/room/room-add/room-add.component';
import { RoomEditComponent } from './features/room/room-edit/room-edit.component';
import { AdminPageComponent } from './features/admin-page/admin-page.component';
import { AuthGuard } from './features/services/auth.guard';
import { RoleGuard } from './features/services/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'schedule', pathMatch: 'full' },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'login', component: LoginComponent },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
  { path: 'room-add', component: RoomAddComponent },
  { path: 'room-edit', component: RoomEditComponent },
  { path: 'admin', component: AdminPageComponent, canActivate: [RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
