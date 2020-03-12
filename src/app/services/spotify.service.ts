import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Headers, URLSearchParams } from "@angular/http";
import { query } from "@angular/animations";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  private searchUrl: string;

  //these are two strings used to obtain a Spotify API token
  private clientID: string = "951947e2c72746cd9bd5f4df3294dd14";
  private clientSecret: string = "9165a4aa51f940d7878de3cce158de07";
  constructor(private httpClient: HttpClient) {}

  //headers for the getToken request
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: "Basic " + btoa(this.clientID + ":" + this.clientSecret),
      "Content-Type": "application/x-www-form-urlencoded"
    })
  };
  //method to get the Spotify API Access Token
  getToken = () => {
    let params: URLSearchParams = new URLSearchParams();
    params.set("grant_type", "client_credentials");
    let body = params.toString();
    return this.httpClient.post(
      "https://accounts.spotify.com/api/token",
      body,
      this.httpOptions
    );
  };
  //retrieves artists given a searchString from the front page searchbar
  searchForArtists(searchString: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl =
      "https://api.spotify.com/v1/search?query=" +
      searchString +
      "&offset=0&limit=20&type=artist" +
      "&market=US";
    return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //retrieves the data of an artist given their Spotify ID
  getArtist(artistID: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl = "https://api.spotify.com/v1/artists/" + artistID;
    return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //retrieves the data of an album given its Spotify ID
  getAlbum(albumID: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl = "https://api.spotify.com/v1/albums/" + albumID;
    return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //retrieves an artist's most 'popular' songs
  getTopTracks(artistID: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl =
      "https://api.spotify.com/v1/artists/" +
      artistID +
      "/top-tracks?country=us";
    return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //retrieves the artist's albums (excluding singles & compilations)
  getAlbumsOnly(artistID: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl =
      "https://api.spotify.com/v1/artists/" +
      artistID +
      "/albums?&country=us&album_type=album";
    https: return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //retrieves the related artists of the artist
  getRelatedArtists(artistID: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl =
      "https://api.spotify.com/v1/artists/" + artistID + "/related-artists";
    https: return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //gets the tracks of an album given its ID
  getAlbumTracks(albumID: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl =
      "https://api.spotify.com/v1/albums/" + albumID + "/tracks?limit=50";
    https: return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //gets a track given its ID
  getTrack(trackID: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl = "https://api.spotify.com/v1/tracks/" + trackID;
    https: return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //gets all the basic information (artist, popularity, etc.) of a list of tracks
  getTracks(tracksString: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl = "https://api.spotify.com/v1/tracks/?ids=" + tracksString;
    console.log(this.searchUrl);
    https: return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //gets all the audio features of a list of tracks
  getTracksFeatures(tracksString: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl =
      "https://api.spotify.com/v1/audio-features/?ids=" + tracksString;
    https: return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //gets the current available genres
  getAllGenres(token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl =
      "https://api.spotify.com/v1/recommendations/available-genre-seeds";
    https: return this.httpClient.get(this.searchUrl, httpSearch);
  }
  //gets the user's recommendation playlist object after they submit their mix
  getUserMix(queryString: string, token: string) {
    const httpSearch = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + token
      })
    };
    this.searchUrl =
      "https://api.spotify.com/v1/recommendations?market=US" + queryString;
    https: return this.httpClient.get(this.searchUrl, httpSearch);
  }
}
