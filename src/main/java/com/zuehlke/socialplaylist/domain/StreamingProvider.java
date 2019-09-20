package com.zuehlke.socialplaylist.domain;

import java.net.URI;
import java.util.List;

public interface StreamingProvider {

    URI getAuthorizationCodeUri();

    void receiveToken(String code);

    List<Track> getTracksOfPlaylist(String playlistId);

    List<Track> searchTracks(String query);

    void addTracksToPlaylist(String playlistId, String[] uris);

}
