import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { ActivatedRoute } from "@angular/router";
import { Artist } from "../../../../Artist";
import { Album } from "../../../../Album";
import { map } from "rxjs/operators";
import { OwlOptions } from "ngx-owl-carousel-o";
import * as $ from "jquery";

@Component({
  selector: "album",
  templateUrl: "album.component.html",
  styleUrls: ["./album.component.css"],
  providers: [SpotifyService]
})
export class AlbumComponent implements OnInit {
  id: string;
  artistID: string;
  artistPhoto: string;
  album: Album[];
  tracks: any;
  trackIDs = new Array();

  constructor(
    private SpotifyService: SpotifyService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    // Get the album.
    this.route.params.pipe(map(params => params["id"])).subscribe(id => {
      this.SpotifyService.getToken().subscribe(data => {
        this.SpotifyService.getAlbum(id, data["access_token"]).subscribe(
          album => {
            this.album = album;
            // Get the artist ID of this album's artist.
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
    });
    // Get the album's tracks
    this.route.params.pipe(map(params => params["id"])).subscribe(id => {
      this.SpotifyService.getToken().subscribe(data => {
        this.SpotifyService.getAlbumTracks(id, data["access_token"]).subscribe(
          data => {
            this.tracks = data["items"];
            for (var i in this.tracks) {
              this.trackIDs.push(this.tracks[i]["id"]);
            }
            for (var i in this.trackIDs) {
              console.log("THE ID IS " + this.trackIDs[i]);
            }
          }
        );
      });
    });
  }
  // Convert the millisecond duration into the traditional mm:ss form.
  msToSongTime(ms: any) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
  }
  updateDonutChart(chartID: any, percent: number) {
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
}
