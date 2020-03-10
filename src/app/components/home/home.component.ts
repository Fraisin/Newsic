import { Component, Input, OnInit, HostListener } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { StorageMap } from "@ngx-pwa/local-storage";
import { SimpleChanges } from "@angular/core";

/*
    {
      type: "artist",
      id: "3TVXtAsR1Inumwj472S9r4",
      image: "test",
      name: "Drake"
    },
    { type: "genre", name: "hip-hop", id: "231jjfl2k" },
    {
      type: "track",
      id: "0V1PzAbvRjbsbY2WklR65c",
      image: "blegh",
      name: "Some Song"
    }
    */
@Component({
  selector: "home",
  templateUrl: "home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [SpotifyService]
})
export class HomeComponent {
  showGenreSearch: boolean = false;
  singleSelect: any;
  // this array represents the 'mix' of a user.
  // it consists of genres or the IDs of artists and songs they would like to add
  userMix: any[] = [];
  config = {
    search: true,
    limitTo: 150,
    height: "200px",
    placeholder: "Select",
    noResultsFound: "No genres found.",
    clearOnSelection: true
  };
  options: any = [];
  constructor(
    private SpotifyService: SpotifyService,
    private route: ActivatedRoute,
    private storage: StorageMap
  ) {}
  ngOnInit() {
    //this.storage.delete("userMix").subscribe(() => {});
    this.storage.get("userMix").subscribe(userItems => {
      // if there is existing data, set our local array to it
      if (userItems) {
        this.userMix = <any[]>userItems;
      }
    });
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
      this.userMix.push(genreObject);
      this.saveArrayInStorage();
    }
  }
  hideGenreSearchbar() {
    this.showGenreSearch = false;
  }
  toggleGenreSearchbar() {
    this.showGenreSearch = this.showGenreSearch ? false : true;
  }
  //Takes an id, locates the corresponding object in the user mix array and deletes it
  deleteEntity(type: string, id: string) {
    this.userMix = this.userMix.filter(entity => entity.id != id);
    this.saveArrayInStorage();
  }
  deleteGenre(genreID: string) {}
  //Saves the user mix array in the local storage so it remains upon refresh.
  saveArrayInStorage() {
    this.storage.set("userMix", this.userMix).subscribe(() => {});
  }
}
