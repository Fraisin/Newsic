import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { ActivatedRoute } from "@angular/router";
import { Artist } from "../../../../Artist";
import { Album } from "../../../../Album";
import { map } from "rxjs/operators";

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
  constructor(
    private SpotifyService: SpotifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.pipe(map(params => params["id"])).subscribe(id => {
      this.SpotifyService.getToken().subscribe(data => {
        this.SpotifyService.getArtist(id, data["access_token"]).subscribe(
          artist => {
            this.artist = artist;
          }
        );
      });
    });
  }
}
