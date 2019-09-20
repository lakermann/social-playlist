package com.zuehlke.socialplaylist.domain;

import com.wrapper.spotify.exceptions.detailed.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class NotLoggedInException extends RuntimeException {
    public NotLoggedInException(UnauthorizedException e) {
        super("Unauthorized", e);
    }
}
