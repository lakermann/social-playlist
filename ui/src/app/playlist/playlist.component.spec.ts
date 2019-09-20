import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlaylistComponent} from './playlist.component';
import {SpotifyService} from '../spotify.service';
import {Observable, of} from 'rxjs';
import {Track} from '../track';
import {MatTableModule} from '@angular/material';

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;
  let spotifyService: SpotifyService;

  class MockSpotifyService {
    public getTracksForPlaylist(): Observable<Track[]> {
      return of([
        {uri: 'uriA', title: 'titleA', artists: ['artistA']},
        {uri: 'uriB', title: 'titleB', artists: ['artistB', 'artistC']}
      ]);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlaylistComponent],
      imports: [MatTableModule],
      providers: [
        PlaylistComponent,
        {provide: SpotifyService, useClass: MockSpotifyService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
    spotifyService = TestBed.get(SpotifyService);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have tracks message after construction', () => {
    expect(component.tracks).toBeUndefined();
  });

  it('should have tracks after Angular calls ngOnInit', () => {
    component.ngOnInit();
    spotifyService.getTracksForPlaylist().subscribe(
      tracks => expect(component.tracks).toEqual(tracks),
      fail
    );
  });

  it('should render title in a h1 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Playlist');
  });

  it('should render title and artist', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    const trs = compiled.querySelectorAll('tbody tr');
    expect(trs.length).toBe(2);
    expect(trs[0].children[0].textContent).toBe('titleA');
    expect(trs[0].children[1].textContent).toBe('artistA');
    expect(trs[1].children[0].textContent).toBe('titleB');
    expect(trs[1].children[1].textContent).toBe('artistB,artistC');
  });

});
