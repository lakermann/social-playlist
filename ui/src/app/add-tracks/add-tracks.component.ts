import {Component} from '@angular/core';
import {Subject} from 'rxjs';
import {Track} from '../track';
import {SpotifyService} from '../spotify.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-add-tracks',
  templateUrl: './add-tracks.component.html',
  styleUrls: ['./add-tracks.component.css']
})
export class AddTracksComponent {
  displayedColumns: string[] = ['title', 'artists', 'actions'];
  tracks: Track[] = [];
  query = '';
  querySearchUpdate = new Subject<string>();

  constructor(private spotifyService: SpotifyService) {
    this.querySearchUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(() => {
        this.findTracks();
      });
  }

  addTrack(uid: string) {
    this.spotifyService.addTrackToPlayList([uid]).subscribe(() => {
      this.query = '';
      this.tracks = [];
    });
  }

  findTracks() {
    this.spotifyService.findTracks(this.query).subscribe(tracks => {
      this.tracks = tracks;
    });
  }

}
