package com.zuehlke.socialplaylist.spotifyapi;

import com.zuehlke.socialplaylist.domain.Track;

import java.util.List;

public class TrackDto {

    private final String uri;
    private final String title;
    private final List<String> artists;

    @SuppressWarnings("WeakerAccess")
    public TrackDto(String uri, String title, List<String> artists) {
        this.uri = uri;
        this.title = title;
        this.artists = artists;
    }

    @SuppressWarnings("unused")
    public String getUri() {
        return uri;
    }

    @SuppressWarnings("unused")
    public String getTitle() {
        return title;
    }

    @SuppressWarnings("unused")
    public List<String> getArtists() {
        return artists;
    }

    public static TrackDto map(Track track) {
        return new TrackDto(track.getUri(), track.getTitle(), track.getArtists());
    }
}
