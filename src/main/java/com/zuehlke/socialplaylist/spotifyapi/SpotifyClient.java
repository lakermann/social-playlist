package com.zuehlke.socialplaylist.spotifyapi;

import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.SpotifyHttpManager;
import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.exceptions.detailed.UnauthorizedException;
import com.wrapper.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import com.wrapper.spotify.model_objects.specification.ArtistSimplified;
import com.wrapper.spotify.model_objects.specification.Paging;
import com.wrapper.spotify.model_objects.specification.PlaylistTrack;
import com.wrapper.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import com.wrapper.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import com.wrapper.spotify.requests.data.playlists.AddTracksToPlaylistRequest;
import com.wrapper.spotify.requests.data.playlists.GetPlaylistsTracksRequest;
import com.wrapper.spotify.requests.data.search.simplified.SearchTracksRequest;
import com.zuehlke.socialplaylist.domain.NotLoggedInException;
import com.zuehlke.socialplaylist.domain.StreamingProvider;
import com.zuehlke.socialplaylist.domain.Track;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

@Component
public class SpotifyClient implements StreamingProvider {

    private final SpotifyApi spotifyApi;

    public SpotifyClient(@Value("${spotifyPlaylist.clientId}") final String clientId,
                         @Value("${spotifyPlaylist.clientSecret}") final String clientSecret,
                         @Value("${spotifyPlaylist.redirectUrl}") final String redirectUrl) {

        URI uri = SpotifyHttpManager.makeUri(redirectUrl);
        spotifyApi = new SpotifyApi.Builder()
                .setClientId(clientId)
                .setClientSecret(clientSecret)
                .setRedirectUri(uri)
                .build();
    }

    private static Track map(com.wrapper.spotify.model_objects.specification.Track track) {
        return new Track(track.getUri(), track.getName(), Arrays.stream(track.getArtists())
                .map(ArtistSimplified::getName)
                .collect(Collectors.toList()));
    }

    public URI getAuthorizationCodeUri() {
        AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
                .scope("playlist-modify")
                .build();

        return authorizationCodeUriRequest.execute();
    }

    public void receiveToken(String code) {
        try {
            AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
                    .build();

            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());
        } catch (IOException | SpotifyWebApiException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    @Override
    public List<Track> getTracksOfPlaylist(String playlistId) {
        GetPlaylistsTracksRequest getPlaylistRequest = spotifyApi.getPlaylistsTracks(playlistId).build();

        try {
            Paging<PlaylistTrack> paging = getPlaylistRequest.execute();
            return Arrays.stream(paging.getItems())
                    .map(PlaylistTrack::getTrack)
                    .map(SpotifyClient::map)
                    .collect(toList());
        } catch (UnauthorizedException e) {
            throw new NotLoggedInException(e);
        } catch (IOException | SpotifyWebApiException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return emptyList();
    }

    @Override
    public List<Track> searchTracks(String query) {
        SearchTracksRequest searchTracksRequest = spotifyApi.searchTracks(query).limit(10).build();

        try {
            Paging<com.wrapper.spotify.model_objects.specification.Track> paging = searchTracksRequest.execute();
            return Arrays.stream(paging.getItems())
                    .map(SpotifyClient::map)
                    .collect(toList());
        } catch (UnauthorizedException e) {
            throw new NotLoggedInException(e);
        } catch (IOException | SpotifyWebApiException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return emptyList();
    }

    @Override
    public void addTracksToPlaylist(String playlistId, String[] uris) {
        AddTracksToPlaylistRequest addTracksToPlaylistRequest = spotifyApi.addTracksToPlaylist(playlistId, uris).build();

        try {
            addTracksToPlaylistRequest.execute();
        } catch (UnauthorizedException e) {
            throw new NotLoggedInException(e);
        } catch (IOException | SpotifyWebApiException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }

}
