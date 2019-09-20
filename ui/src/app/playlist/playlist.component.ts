import {Component, OnInit} from '@angular/core';
import {Track} from '../track';
import {SpotifyService} from '../spotify.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  tracks: Track[];
  displayedColumns: string[] = ['title', 'artists'];

  constructor(private spotifyService: SpotifyService) {
  }

  ngOnInit() {
    this.spotifyService.getTracksForPlaylist().subscribe(tracks => {
      this.tracks = tracks;
    });
  }
}
