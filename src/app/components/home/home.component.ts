import { Component, OnInit, HostListener } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { OwlOptions } from "ngx-owl-carousel-o";
import * as $ from "jquery";

@Component({
  selector: "home",
  templateUrl: "home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [SpotifyService]
})
export class HomeComponent {
  showGenreSearch: boolean = false;
  singleSelect: any = [];
  // this array represents the 'mix' of a user.
  // it consists of genres or the IDs of artists and songs they would like to add
  userMix: any[] = [
    {
      type: "artist",
      id: "3TVXtAsR1Inumwj472S9r4",
      image: "test",
      name: "Drake"
    },
    { type: "genre", id: "hip-hop" },
    {
      type: "track",
      id: "0V1PzAbvRjbsbY2WklR65c",
      image: "blegh",
      name: "Some Song"
    },
    { type: "genre", id: "indie" },
    { type: "genre", id: "country" }
  ];
  config = {
    displayKey: "name", // if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 150,
    height: "125px"
  };
  options: any = [];

  constructor(
    private SpotifyService: SpotifyService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    //Get the artist's top 5 tracks.
    this.route.params.pipe(map(params => params["id"])).subscribe(id => {
      this.SpotifyService.getToken().subscribe(data => {
        this.SpotifyService.getAllGenres(data["access_token"]).subscribe(
          data => {
            this.options = data["genres"];
          }
        );
      });
    });
  }
  //Function that takes in an artist ID and returns an array of two strings,
  //first one being a link to their photo and second being their name
  getArtistInfo(artistID: string) {
    this.route.params.pipe(map(params => params["id"])).subscribe(id => {
      this.SpotifyService.getToken().subscribe(data => {
        this.SpotifyService.getAllGenres(data["access_token"]).subscribe(
          data => {
            console.log(data);
          }
        );
      });
    });
  }

  //Function that takes in a track  ID and returns an array of two strings,
  //first one being a link to its album cover and second being its name
  hideGenreSearchbar() {
    this.showGenreSearch = false;
  }
  toggleGenreSearchbar() {
    this.showGenreSearch = this.showGenreSearch ? false : true;
  }
}
