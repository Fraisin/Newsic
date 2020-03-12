import { Component, Input, OnInit, HostListener } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { UserMixService } from "../../services/userMix.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map } from "rxjs/operators";

@Component({
  selector: "home",
  templateUrl: "home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [SpotifyService]
})
export class HomeComponent {
  showGenreSearch: boolean = false;
  singleSelect: any;
  //config for the dropdown select search
  config = {
    search: true,
    limitTo: 150,
    height: "200px",
    placeholder: "Select",
    noResultsFound: "No genres found.",
    clearOnSelection: true
  };
  //options for the select search
  options: any = [];
  constructor(
    private SpotifyService: SpotifyService,
    private UserMixService: UserMixService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    //Load the global array if it has existing data.
    this.UserMixService.loadUserMix();
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
  //Gets the global usermix array
  getMixArray() {
    return this.UserMixService.userMix;
  }
  getParams() {
    var artistString = "";
    var genreString = "";
    var trackString = "";
    var mix = this.getMixArray();
    for (var entity of mix) {
      if (entity.type == "artist") {
        artistString =
          artistString === "" ? entity.id : artistString + "," + entity.id;
      }
      if (entity.type == "genre") {
        genreString =
          genreString === "" ? entity.name : genreString + "," + entity.name;
      }
      if (entity.type == "track") {
        trackString =
          trackString === "" ? entity.id : trackString + "," + entity.id;
      }
    }
    var queryParams = [artistString, genreString, trackString];
    return queryParams;
  }
  navToPlaylist() {
    this.router.navigate(["/playlist"], {
      queryParams: {
        seed_artists: this.getParams()[0],
        seed_genres: this.getParams()[1],
        seed_tracks: this.getParams()[2]
      }
    });
  }
  //Takes in a genreName and adds a corresponding genre object to the array
  addGenre(genreName: string) {
    if (genreName) {
      var randomID = Math.random()
        .toString(36)
        .slice(2);
      var genreObject = {
        type: "genre",
        name: genreName,
        id: randomID
      };
      this.hideGenreSearchbar();
      this.UserMixService.addObjectToArray(genreObject);
    }
  }
  //Takes an id, locates the corresponding object in the user mix array and deletes it
  deleteEntity(type: string, id: string) {
    this.UserMixService.deleteEntity(type, id);
  }
  //Clears the entire user mix array if they press the 'Clear All' button.
  deleteAllEntities() {
    this.UserMixService.deleteAllEntities();
  }
  arrayEmpty() {
    return this.UserMixService.arrayIsEmpty();
  }
  arrayFull() {
    return this.UserMixService.arrayIsFull();
  }
  hideGenreSearchbar() {
    this.showGenreSearch = false;
  }
  toggleGenreSearchbar() {
    this.showGenreSearch = this.showGenreSearch ? false : true;
  }
}
