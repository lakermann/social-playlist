import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddTracksComponent} from './add-tracks.component';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatInputModule, MatTableModule} from '@angular/material';
import {PlaylistComponent} from '../playlist/playlist.component';
import {SpotifyService} from '../spotify.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AddTracksComponent', () => {
  let component: AddTracksComponent;
  let fixture: ComponentFixture<AddTracksComponent>;

  class MockSpotifyService {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatTableModule,
      ],
      declarations: [AddTracksComponent],
      providers: [
        PlaylistComponent,
        {provide: SpotifyService, useClass: MockSpotifyService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
