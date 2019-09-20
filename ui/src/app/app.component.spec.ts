import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {PlaylistComponent} from './playlist/playlist.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatButtonModule, MatInputModule, MatTableModule, MatToolbarModule} from '@angular/material';
import {HeaderComponent} from './header/header.component';
import {AddTracksComponent} from './add-tracks/add-tracks.component';
import {FormsModule} from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddTracksComponent,
        AppComponent,
        HeaderComponent,
        PlaylistComponent,
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
