package com.zuehlke.socialplaylist.domain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;

@Service
public class PlaylistService implements PlaylistProvider {

    private final StreamingProvider streamingProvider;
    private final String playlistId;

    @Autowired
    public PlaylistService(StreamingProvider streamingProvider,
                           @Value("${spotifyPlaylist.playlistId}") final String playlistId) {
        this.streamingProvider = streamingProvider;
        this.playlistId = playlistId;
    }

    @Override
    public URI getAuthorizationCodeUri() {
        return streamingProvider.getAuthorizationCodeUri();
    }

    @Override
    public void receiveToken(String code) {
        streamingProvider.receiveToken(code);
    }

    @Override
    public List<Track> getTracksForPlaylist() {
        return streamingProvider.getTracksOfPlaylist(playlistId);
    }

    @Override
    public List<Track> searchTracks(String query) {
        return streamingProvider.searchTracks(query);
    }

    @Override
    public void addTracksToPlaylist(String[] uris) {
        streamingProvider.addTracksToPlaylist(playlistId, uris);
    }
}

