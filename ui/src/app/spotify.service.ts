import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Track} from './track';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private readonly apiUrl: string;
  private tracks: BehaviorSubject<Track[]> = new BehaviorSubject<Track[]>([]);

  constructor(private http: HttpClient) {
    this.apiUrl = '/api';
  }

  public getTracksForPlaylist() {
    this.http.get<Track[]>(`${this.apiUrl}/playlists/tracks`).subscribe((tracks) => {
      this.tracks.next(tracks);
    });
    return this.tracks;
  }

  public findTracks(query: string) {
    return this.http.get<Track[]>(`${this.apiUrl}/tracks?query=${query}`);
  }

  public addTrackToPlayList(uris: string[]) {
    return this.http.post(`${this.apiUrl}/playlists/tracks`, uris).pipe(
      tap(() => this.getTracksForPlaylist())
    );
  }

}
