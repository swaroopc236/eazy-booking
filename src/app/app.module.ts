import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminPageComponent } from './features/admin-page/admin-page.component';
import { MyEventsComponent } from './features/my-events/my-events.component';
import { EventEditComponent } from './features/event-edit/event-edit.component';
// import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserEditComponent } from './features/user-edit/user-edit.component';
import { SelectRoomDirective } from './directives/select-room.directive';
//import { EventComponent } from './features/events/services/event/event.component';

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
    MyEventsComponent,
    EventEditComponent,
    UserEditComponent,
    SelectRoomDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // NgxSpinnerModule,
    NgbModule,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
