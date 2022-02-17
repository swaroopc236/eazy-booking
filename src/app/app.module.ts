import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CreateBookingComponent } from './features/booking/create-booking/create-booking.component';
import { ScheduleComponent } from './features/booking/schedule/schedule.component';
import { LoginComponent } from './features/login/login.component';
import { SigninComponent } from './features/signin/signin.component';
import { EventsComponent } from './features/events/events.component';
import { RoomAddComponent } from './features/room/room-add/room-add.component';
import { RoomEditComponent } from './features/room/room-edit/room-edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminPageComponent } from './features/admin-page/admin-page.component';

// register FullCalendar plugins
FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  timeGridPlugin,
]);

@NgModule({
  declarations: [
    AppComponent,
    CreateBookingComponent,
    ScheduleComponent,
    LoginComponent,
    SigninComponent,
    EventsComponent,
    RoomAddComponent,
    RoomEditComponent,
    AdminPageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FullCalendarModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
