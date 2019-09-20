import {TestBed} from '@angular/core/testing';

import {SpotifyService} from './spotify.service';
import {HttpClient} from '@angular/common/http';
import {Track} from './track';
import {of} from 'rxjs';

describe('SpotifyService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let spotifyService: SpotifyService;

  beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      TestBed.configureTestingModule({
        providers: [
          {provide: HttpClient, useValue: httpClientSpy}
        ]
      });
      spotifyService = new SpotifyService(httpClientSpy as any);
    }
  );

  it('should be created', () => {
    const service: SpotifyService = TestBed.get(SpotifyService);
    expect(service).toBeTruthy();
  });

  it('should return expected tracks (HttpClient called once)', () => {
    const expectedTracks: Track[] =
      [
        {uri: 'uriA', title: 'titleA', artists: ['artistA']},
        {uri: 'uriB', title: 'titleB', artists: ['artistB', 'artistC']}
      ];

    httpClientSpy.get.and.returnValue(of(expectedTracks));

    spotifyService.getTracksForPlaylist().subscribe(
      tracks => expect(tracks).toEqual(expectedTracks, 'expected tracks'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});
