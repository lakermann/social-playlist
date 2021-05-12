# Consuming the REST API

With our Angular application up and running, let’s now extend the application to consume the REST controller API.^[<https://www.baeldung.com/spring-boot-angular-web>]

## Track model

1. Since our Angular application will fetch `Track` entities, implement a simple domain model with TypeScript.

    ```bash
    ng generate interface track
    ```

2. Angular CLI will generate an empty `track.ts`. Populate fields to the `Track` class.

    ```typescript
    export interface Track {
      title: string;
      uri: string;
      artists: string[];
    }
    ```

## Spotify Service

Implement a service class that performs GET requests to the `/api/playlists/tracks` endpoint.

This will allow us to encapsulate access to the REST controller in a single class, which we can reuse throughout the entire application.

1. Open a console terminal and issue the following command.

    ```bash
    ng generate service spotify
    ```

2. Open the `spotify.service.ts` file that Angular CLI just created and add some functionality:

    ```typescript
    import {Injectable} from '@angular/core';
    import {HttpClient} from '@angular/common/http';
    import {Observable} from 'rxjs';
    import {Track} from './track';

    @Injectable({
      providedIn: 'root'
    })

    export class SpotifyService {

      private apiUrl: string;

      constructor(private http: HttpClient) {
        this.apiUrl = '/api';
      }

      public getTracksForPlaylist(): Observable<Track[]> {
        return this.http.get<Track[]>(`${this.apiUrl}/playlists/tracks`);
      }
    }
    ```

3. Add the api call to `spotify.service.spec.ts`.

    ```typescript
    import {TestBed} from '@angular/core/testing';
    import {SpotifyService} from './spotify.service';
    import {Track} from './track';
    import {of} from 'rxjs';
    import {HttpClient} from '@angular/common/http';

    describe('SpotifyService', () => {
      let httpClientSpy: { get: jasmine.Spy };
      let spotifyService: SpotifyService;

      beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        TestBed.configureTestingModule({
          providers: [
            {provide: HttpClient, useValue: httpClientSpy}
          ]
        });
        spotifyService = new SpotifyService(httpClientSpy as any);
      });

      it('should be created', () => {
        const service: SpotifyService = TestBed.get(SpotifyService);
        expect(service).toBeTruthy();
      });

      it('should return expected tracks (HttpClient called once)', () => {
        const expectedTracks: Track[] =
          [
            {uri: 'uriA', title: 'titleA', artists: ['artistA']},
            {uri: 'uriB', title: 'titleB', artists: ['artistB', 'artistC']}
          ];

        httpClientSpy.get.and.returnValue(of(expectedTracks));

        spotifyService.getTracksForPlaylist().subscribe(
          tracks => expect(tracks).toEqual(expectedTracks, 'expected tracks'),
          fail
        );
        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
      });
    });
    ```

4. Run tests.

    ```bash
    ng test
    ```

## Angular Material

1. Install Angular Material, Angular CDK and Angular Animations.

    ```bash
    npm install @angular/material @angular/cdk @angular/animations
    ```

2. Import BrowserAnimationsModule into your application to enable animations support in `app.module.ts`.

    ```typescript{1,6}
    import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

    @NgModule({
      ...
      imports: [
        BrowserAnimationsModule,
        ...
      ],
      ...
    })
    export class AppModule { }
    ```

3. Import the NgModule for each component you want to use in `app.module.ts`.

    ```typescript{1,6}
    import {MatTableModule} from '@angular/material';

      @NgModule({
        ...
        imports: [
          MatTableModule
          ..
        ],
        ...
      })
      export class AppModule { }
    ```

4. To get started with a prebuilt theme, include one of Angular Material's prebuilt themes globally in your application. You can add this to your `styles.css`.

    ```css
    @import "~@angular/material/prebuilt-themes/indigo-pink.css";
    ```

## Playlist Component

1. Open a terminal console and generate a playlist component:

    ```bash
    ng generate component playlist
    ```

2. Implement the class so that it can take a `SpotifyService` instance in the constructor and uses the `SpotifyService getTracksForPlaylist()` method to fetch all tracks.

    ```typescript
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
    ```

3. Additionally, we need to edit the component’s HTML file, `playlist.component.html`, to create the table that displays the list of entities.

    ```html
    <h1 class="mat-h1">Playlist</h1>

    <table mat-table [dataSource]="tracks">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Title</th>
        <td mat-cell *matCellDef="let element">{{element.title}}</td>
      </ng-container>

      <ng-container matColumnDef="artists">
        <th mat-header-cell *matHeaderCellDef>Artists</th>
        <td mat-cell *matCellDef="let element">{{element.artists}}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    ```

4. Add Tests to `playlist.component.spec.ts`.

    ```typescript
    import {async, ComponentFixture, TestBed} from '@angular/core/testing';

    import {PlaylistComponent} from './playlist.component';
    import {Observable, of} from 'rxjs';
    import {Track} from '../track';
    import {SpotifyService} from '../spotify.service';
    import {MatTableModule} from '@angular/material';

    describe('PlaylistComponent', () => {
      let component: PlaylistComponent;
      let fixture: ComponentFixture<PlaylistComponent>;
      let spotifyService: SpotifyService;

      class MockSpotifyService {
        public getTracksForPlaylist(): Observable<Track[]> {
          return of([
            {uri: 'uriA', title: 'titleA', artists: ['artistA']},
            {uri: 'uriB', title: 'titleB', artists: ['artistB', 'artistC']}
          ]);
        }
      }

      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [PlaylistComponent],
          imports: [MatTableModule],
          providers: [
            PlaylistComponent,
            {provide: SpotifyService, useClass: MockSpotifyService}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PlaylistComponent);
        component = fixture.componentInstance;
        spotifyService = TestBed.get(SpotifyService);
      }));

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should not have tracks message after construction', () => {
        expect(component.tracks).toBeUndefined();
      });

      it('should have tracks after Angular calls ngOnInit', () => {
        component.ngOnInit();
        spotifyService.getTracksForPlaylist().subscribe(
          tracks => expect(component.tracks).toEqual(tracks),
          fail
        );
      });

      it('should render title in a h1 tag', () => {
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Playlist');
      });

      it('should render title and artist', () => {
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;

        let trs = compiled.querySelectorAll('tbody tr');
        expect(trs.length).toBe(2);
        expect(trs[0].children[0].textContent).toBe('titleA');
        expect(trs[0].children[1].textContent).toBe('artistA');
        expect(trs[1].children[0].textContent).toBe('titleB');
        expect(trs[1].children[1].textContent).toBe('artistB,artistC');
      });
    });

5. Run tests.

    ```bash
    ng test
    ```

## Application Component HTML

The `app.component.html` file allows us to define the root component’s HTML template. Replace content with:

```html
<app-playlist></app-playlist>
```

## Application Module

1. Next, we need to edit the `app.module.ts` file, so Angular can import all the required modules, components, and services.

    ```typescript{16-17}
    import {BrowserModule} from '@angular/platform-browser';
    import {NgModule} from '@angular/core';
    import {MatTableModule} from '@angular/material';

    import {AppComponent} from './app.component';
    import {PlaylistComponent} from './playlist/playlist.component';
    import {HttpClientModule} from '@angular/common/http';

    @NgModule({
      declarations: [
        AppComponent,
        PlaylistComponent
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        MatTableModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

2. Add PlaylistComponent and HttpClientTestingModule to `app.component.spec.ts`.

    ```typescript{5,8-9}
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
            AppComponent,
            PlaylistComponent
          ],
          imports: [
            HttpClientTestingModule,
            MatTableModule
          ]
        }).compileComponents();
      }));
    ```

3. Run tests.

    ```bash
    ng test
    ```

## Proxy Configuration

Using the proxying support in webpack's dev server we can redirect the `/api` calls for local development.

1. We create a file next to our project's `package.json` called `proxy.conf.json` with the content.

    ```json
    {
      "/api/*": {
        "target": "http://localhost:8080",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true
      }
    }
    ```

2. We then add the `proxyConfig` option to the serve target in `angular.json`.

    ```json{5}
    "serve": {
      ...
      "options": {
        "browserTarget": "ui:build",
        "proxyConfig": "./proxy.conf.json"
    },
    ```

::: tip EXERCISE

* Push your changes to Heroku and test the application.
* Create new component for header.
* Create new component in order to search tracks and to add them to the playlist.
  * Angular User Inputs: <https://angular.io/guide/user-input>
  * Angular Material: <https://material.angular.io/>

:::

::: warning

* In order to login you have to call `/api/login` manually in the browser.

:::
