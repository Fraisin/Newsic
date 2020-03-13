import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { UserMixService } from "../../services/userMix.service";
import { ActivatedRoute } from "@angular/router";
import * as $ from "jquery";

@Component({
  selector: "album",
  templateUrl: "album.component.html",
  styleUrls: ["./album.component.css"],
  providers: [SpotifyService]
})

/*This component can be loaded in two different ways. One way is from
clicking on an album on an artist page and the other is by generating
a playlist from a mix. To differentiate the two, the album component
uses a route parameter while the playlist version of the component uses
query parameters in the search URL.*/
export class AlbumComponent implements OnInit {
  //Variables for album, artist and tracks.
  id: string;
  album: any;
  albumDuration: string;
  allAlbumTracksInfo: any[] = [];
  allAlbumTracksAudioFeatures: any[] = [];
  displayAlbumTracks: boolean = false;
  artistID: string;
  artistPhoto: string;
  tracks: any;
  trackIDs = new Array();
  //Variables for playlist.
  playlist: any;
  playlistTrackIDs = new Array();
  allPlaylistTracksInfo: any[] = [];
  allPlaylistTracksAudioFeatures: any[] = [];
  seedArtists: any;
  seedGenres: any;
  seedTracks: any;
  displayPlaylistTracks: boolean = false;

  //The desired audio feature headings.
  featureHeadings = [
    "Danceability",
    "Energy",
    "Speechiness",
    "Acousticness",
    "Liveness",
    "Valence"
  ];
  //The keys to delete from the audio feature response object.
  keysToDelete = [
    "key",
    "loudness",
    "mode",
    "instrumentalness",
    "loudness",
    "tempo",
    "id",
    "uri",
    "track_href",
    "analysis_url",
    "duration_ms",
    "time_signature",
    "type"
  ];
  constructor(
    private SpotifyService: SpotifyService,
    private UserMixService: UserMixService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    //Loads the user mix array so that it doesn't clear upon router change.
    this.UserMixService.loadUserMix();
    //"Album" version of the component that uses route parameters.
    this.route.params.subscribe(params => {
      if (params["id"]) {
        this.displayAlbumTracks = true;
        this.displayPlaylistTracks = false;
        this.id = params["id"];
        this.SpotifyService.getToken().subscribe(data => {
          this.SpotifyService.getAlbum(this.id, data["access_token"]).subscribe(
            album => {
              this.album = album;
              //Get the artist ID of this album's artist.
              this.artistID = album["artists"][0]["id"];
              {
                this.SpotifyService.getArtist(
                  this.artistID,
                  data["access_token"]
                ).subscribe(artist => {
                  this.artistPhoto = artist["images"][0]["url"];
                });
              }
            }
          );
        });
        //Get the individual tracks of the this album.
        this.SpotifyService.getToken().subscribe(data => {
          this.SpotifyService.getAlbumTracks(
            this.id,
            data["access_token"]
          ).subscribe(tracks => {
            this.tracks = tracks["items"];
            //Push each track id into an array so we can use it to fetch multiple tracks at once.
            //At the same time, sum up the duration of each track to get the album duration.
            var albumDuration = 0;
            for (var i in this.tracks) {
              this.trackIDs.push(this.tracks[i]["id"]);
              albumDuration =
                albumDuration + Number(this.tracks[i]["duration_ms"]);
            }
            this.albumDuration = this.msToSongTime(
              albumDuration
            ).toLocaleString();
            {
              //Get basic information about the tracks (artist, popularity, etc.).
              this.SpotifyService.getTracks(
                this.getTracksString(this.trackIDs),
                data["access_token"]
              ).subscribe(trackinfo => {
                this.allAlbumTracksInfo = trackinfo["tracks"];
                //Get more advanced audio features (danceability, energy, etc.).
                this.SpotifyService.getTracksFeatures(
                  this.getTracksString(this.trackIDs),
                  data["access_token"]
                ).subscribe(trackfeatures => {
                  this.allAlbumTracksAudioFeatures =
                    trackfeatures["audio_features"];
                  //Delete unwanted properties of the object.
                  for (var audioFeatureObject of this
                    .allAlbumTracksAudioFeatures) {
                    for (var keyToDelete of this.keysToDelete) {
                      delete audioFeatureObject[keyToDelete];
                    }
                  }
                });
              });
            }
          });
        });
      }
    });
    //"Playlist" version of the component that uses query parameters.
    this.route.queryParams.subscribe(params => {
      //Retrieve the query parameters from the search URL.
      if (params["seed_artists"]) this.seedArtists = params["seed_artists"];
      if (params["seed_genres"]) this.seedGenres = params["seed_genres"];
      if (params["seed_tracks"]) this.seedTracks = params["seed_tracks"];
      if (this.seedArtists || this.seedGenres || this.seedTracks) {
        this.displayAlbumTracks = false;
        this.displayPlaylistTracks = true;
        //Constructs the query string to send to Spotify API.
        var queryString = this.getQueryString(
          this.seedArtists,
          this.seedGenres,
          this.seedTracks
        );
        //Get the user's mix based off of their query string.
        this.SpotifyService.getToken().subscribe(data => {
          this.SpotifyService.getUserMix(
            queryString,
            data["access_token"]
          ).subscribe(playlistTracks => {
            this.playlist = playlistTracks["tracks"];
            //Push each playlist rack ID into an array so we can use it to fetch multiple tracks at once.
            for (var i in this.playlist) {
              this.playlistTrackIDs.push(this.playlist[i]["id"]);
            }
            {
              //Get basic information about the tracks (artist, popularity, etc.).
              this.SpotifyService.getTracks(
                this.getTracksString(this.playlistTrackIDs),
                data["access_token"]
              ).subscribe(playlistTrackinfo => {
                this.allPlaylistTracksInfo = playlistTrackinfo["tracks"];
                //Get more advanced audio features (danceability, energy, etc.).
                this.SpotifyService.getTracksFeatures(
                  this.getTracksString(this.playlistTrackIDs),
                  data["access_token"]
                ).subscribe(playlistTrackfeatures => {
                  this.allPlaylistTracksAudioFeatures =
                    playlistTrackfeatures["audio_features"];
                  //Delete unwanted properties of the object.
                  for (var audioFeatureObject of this
                    .allPlaylistTracksAudioFeatures) {
                    for (var keyToDelete of this.keysToDelete) {
                      delete audioFeatureObject[keyToDelete];
                    }
                  }
                });
              });
            }
          });
        });
      }
    });
  }
  //Constructs the query string to pass to Spotify API based off the URL.
  getQueryString(artists: String, genres: String, tracks: String) {
    var seedArtists = "&seed_artists=" + artists;
    var seedGenres = "&seed_genres=" + genres;
    var seedTracks = "&seed_tracks=" + tracks;
    var queryString = "";
    //If any of the seeds are undefined, don't include them in the query string.
    if (typeof artists !== "undefined") queryString = queryString + seedArtists;
    if (typeof genres !== "undefined") queryString = queryString + seedGenres;
    if (typeof tracks !== "undefined") queryString = queryString + seedTracks;
    return queryString;
  }
  //Takes in an array of trackIDs and appends them to a comma-separated string.
  getTracksString(trackIDs: any[]) {
    var tracksString = ""; //comma separated list of all the trackIDs
    var numOfTracks = trackIDs.length;
    for (var i = 0; i < numOfTracks; i++) {
      //Don't append a comma if it's the last element.
      if (i == numOfTracks - 1) tracksString = tracksString + trackIDs[i];
      else tracksString = tracksString + trackIDs[i] + ",";
    }
    return tracksString;
  }
  //Adds this track to the user mix so it's displayed on the homepage.
  addTrackToUserMix(trackID: string, trackName: string, trackImage: string) {
    var trackObject = {
      type: "track",
      id: trackID,
      image: trackImage,
      name: trackName
    };
    this.UserMixService.addObjectToArray(trackObject);
  }
  //Determines if the given track is already in the user's mix.
  trackInMix(trackID: string) {
    return this.UserMixService.objectInArray(trackID);
  }
  //Convert the millisecond duration into the traditional mm:ss form.
  msToSongTime(ms: any) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return Number(seconds) == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
  }
  updateDonutChart(chartID: any, percent: number, type: string) {
    //Fix to the audio feature circles not displaying correctly in production.
    if (type === "audioFeature") {
      $(chartID + " .right-side").addClass(
        "circle" + chartID.slice(chartID.length - 1)
      );
      $(chartID + " .left-side").addClass(
        "circle" + chartID.slice(chartID.length - 1)
      );
    }
    percent = Math.round(percent);
    if (percent > 100) {
      percent = 100;
    } else if (percent < 0) {
      percent = 0;
    }
    var deg = Math.round(360 * (percent / 100));
    if (percent > 50) {
      $(chartID + " .pie").css("clip", "rect(auto, auto, auto, auto)");
      $(chartID + " .right-side").css("transform", "rotate(180deg)");
    } else {
      $(chartID + " .pie").css("clip", "rect(0, 1em, 1em, 0.5em)");
      $(chartID + " .right-side").css("transform", "rotate(0deg)");
    }
    $(chartID + " .right-side").css("border-width", "0.1em");
    $(chartID + " .left-side").css("border-width", "0.1em");
    $(chartID + " .shadow").css("border-width", "0.1em");
    $(chartID + " .num").text(percent);
    $(chartID + " .left-side").css("transform", "rotate(" + deg + "deg)");
  }
  arrayFull() {
    return this.UserMixService.arrayIsFull();
  }
}
