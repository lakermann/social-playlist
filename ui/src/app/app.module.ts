import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatInputModule, MatTableModule, MatToolbarModule} from '@angular/material';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {UnauthorizedInterceptor} from './unauthorized-interceptor';
import {HeaderComponent} from './header/header.component';
import {AddTracksComponent} from './add-tracks/add-tracks.component';
import {FormsModule} from '@angular/forms';
import {TestComponent} from './test/test.component';

@NgModule({
  declarations: [
    AddTracksComponent,
    AppComponent,
    HeaderComponent,
    PlaylistComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
