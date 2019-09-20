package com.zuehlke.socialplaylist.api;

import com.zuehlke.socialplaylist.domain.PlaylistProvider;
import com.zuehlke.socialplaylist.spotifyapi.TrackDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class PlaylistController {

    private final PlaylistProvider playlistProvider;
    private final String clientRedirectUrl;

    @Autowired
    public PlaylistController(PlaylistProvider playlistProvider,
                              @Value("${spotifyPlaylist.clientRedirectUrl}") final String redirectUrl) {
        this.playlistProvider = playlistProvider;
        this.clientRedirectUrl = redirectUrl;
    }

    @GetMapping("/login")
    public RedirectView login() {
        URI uri = playlistProvider.getAuthorizationCodeUri();

        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(uri.toString());
        return redirectView;
    }

    @GetMapping("/spotify-redirect")
    public RedirectView redirect(@RequestParam String code) {
        playlistProvider.receiveToken(code);

        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(clientRedirectUrl);
        return redirectView;
    }

    @GetMapping("/playlists/tracks")
    public List<TrackDto> getTracksForPlaylist() {
        return playlistProvider.getTracksForPlaylist().stream()
                .map(TrackDto::map)
                .collect(Collectors.toList());
    }

    @PostMapping("/playlists/tracks")
    public void addTracksToPlaylist(@RequestBody String[] uris) {
        playlistProvider.addTracksToPlaylist(uris);
    }

    @GetMapping("/tracks")
    public List<TrackDto> searchTracks(@RequestParam String query) {
        return playlistProvider.searchTracks(query).stream()
                .map(TrackDto::map)
                .collect(Collectors.toList());
    }

}
