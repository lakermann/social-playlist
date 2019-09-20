package com.zuehlke.socialplaylist.domain;

import java.net.URI;
import java.util.List;

public interface PlaylistProvider {

    URI getAuthorizationCodeUri();

    void receiveToken(String code);

    List<Track> getTracksForPlaylist();

    List<Track> searchTracks(String query);

    void addTracksToPlaylist(String[] uris);

}
