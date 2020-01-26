import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Headers, URLSearchParams } from "@angular/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  private searchUrl: string;

  //these are two strings used to obtain a Spotify API token
  private clientID: string = "951947e2c72746cd9bd5f4df3294dd14";
  private clientSecret: string = "2004bfee2dff499ab4e61cf5a13dd47d";
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

  //method to search for artists with the front page searchbar
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
}
