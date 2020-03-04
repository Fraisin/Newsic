import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { ActivatedRoute } from "@angular/router";
import { Artist } from "../../../../Artist";
import { Album } from "../../../../Album";
import { map } from "rxjs/operators";
import * as $ from "jquery";

@Component({
  selector: "artist",
  templateUrl: "artist.component.html",
  styleUrls: ["./artist.component.css"],
  providers: [SpotifyService]
})
export class ArtistComponent implements OnInit {
  id: string;
  artist: Artist[];
  albums: Album[];
  topTracks: any;
  constructor(
    private SpotifyService: SpotifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the artist.
    this.route.params.pipe(map(params => params["id"])).subscribe(id => {
      this.SpotifyService.getToken().subscribe(data => {
        this.SpotifyService.getArtist(id, data["access_token"]).subscribe(
          artist => {
            this.artist = artist;
          }
        );
      });
    });
    // Get the artist's top 5 tracks.
    this.route.params.pipe(map(params => params["id"])).subscribe(id => {
      this.SpotifyService.getToken().subscribe(data => {
        this.SpotifyService.getTopTracks(id, data["access_token"]).subscribe(
          data => {
            this.topTracks = data["tracks"].slice(0, 5);
          }
        );
      });
    });

    // Get the artist's albums.
    this.route.params.pipe(map(params => params["id"])).subscribe(id => {
      this.SpotifyService.getToken().subscribe(data => {
        this.SpotifyService.getAlbumsOnly(id, data["access_token"]).subscribe(
          data => {
            this.albums = this.removeDuplicateAlbums(data["items"]);
          }
        );
      });
    });
  }
  // Increases the width of the progress bar for barID to the correct popularity value.
  displayTrack(barID: string, barWidth: number) {
    $(barID).width(barWidth + "%");
  }

  // Method that takes in an array of albums and removes duplicates.
  removeDuplicateAlbums(albums: any[]) {
    var filteredArray = [];
    var lookupObject = {};
    for (var i in albums) {
      lookupObject[albums[i]["name"]] = albums[i];
    }
    for (i in lookupObject) {
      filteredArray.push(lookupObject[i]);
    }
    return filteredArray;
  }
}
