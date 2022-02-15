import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleComponent } from './features/booking/schedule/schedule.component';
import { EventsComponent } from './features/events/events.component';
import { LoginComponent } from './features/login/login.component';
import { SigninComponent } from './features/signin/signin.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'login', component: LoginComponent },
  { path: 'schedule',component:ScheduleComponent},
  { path: 'events',component: EventsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
