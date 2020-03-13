import { Component } from "@angular/core";
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
  //Configuration for the genre dropdown search.
  config = {
    search: true,
    limitTo: 150,
    height: "200px",
    placeholder: "Select",
    noResultsFound: "No genres found.",
    clearOnSelection: true
  };
  //All the options for the genre dropdown search, populated in ngOnInit().
  options: any = [];
  constructor(
    private SpotifyService: SpotifyService,
    private UserMixService: UserMixService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    //Load the global array from local storage if it has existing data.
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
  //Returns an array of 3 elements, with each one representing a comma-separated string
  //of id values for artists, genres and tracks the user puts in their user mix.
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
  //Routes to the album component with the seeds as get parameters.
  navToPlaylist() {
    this.router.navigate(["/playlist"], {
      queryParams: {
        seed_artists: this.getParams()[0],
        seed_genres: this.getParams()[1],
        seed_tracks: this.getParams()[2]
      }
    });
  }
  //Takes in the name of a genre and adds a corresponding genre object to the array.
  addGenre(genreName: string) {
    if (genreName) {
      //If a user adds multiple genres of the same type, we want to delete the one that's in
      //the right location. Hence, also add a random ID string to this genre object.
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
  //Returns the global user mix array from UserMixService.
  getMixArray() {
    return this.UserMixService.userMix;
  }
  //Takes an id, locates the corresponding object in the user mix array and deletes it.
  deleteEntity(type: string, id: string) {
    this.UserMixService.deleteEntity(type, id);
  }
  //Clears the entire user mix array if they press the 'Clear All' button.
  deleteAllEntities() {
    this.UserMixService.deleteAllEntities();
  }
  //Returns true if the user's mix is empty.
  arrayEmpty() {
    return this.UserMixService.arrayIsEmpty();
  }
  //Returns true if the user's mix is full.
  arrayFull() {
    return this.UserMixService.arrayIsFull();
  }
  //Called when the user presses cancel or 'Genre' with the search select open.
  hideGenreSearchbar() {
    this.showGenreSearch = false;
  }
  //Toggles the value of showGenreSearch boolean.
  toggleGenreSearchbar() {
    this.showGenreSearch = this.showGenreSearch ? false : true;
  }
}
