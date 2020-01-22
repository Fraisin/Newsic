import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SpotifyService {
  constructor(private httpClient: HttpClient) {}
  public searchMusic(searchstring: string) {}
}
