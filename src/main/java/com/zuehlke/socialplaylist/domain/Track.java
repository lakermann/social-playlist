package com.zuehlke.socialplaylist.domain;

import java.util.List;

public class Track {

    private final String uri;
    private final String title;
    private final List<String> artists;

    public Track(String uri, String title, List<String> artists) {
        this.uri = uri;
        this.title = title;
        this.artists = artists;
    }

    public String getUri() {
        return uri;
    }

    public String getTitle() {
        return title;
    }

    public List<String> getArtists() {
        return artists;
    }
}
