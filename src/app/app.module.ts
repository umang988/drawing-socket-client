import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { Page1Component } from './page1/page1.component';
import { Page2Component } from './page2/page2.component';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.serverUrl, options: { transports: ['websocket', 'polling', 'flashsocket'] } };

@NgModule({
  declarations: [
    AppComponent,
    Page1Component,
    Page2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
