import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { FormControl } from "@angular/forms";
import * as $ from "jquery";

@Component({
  selector: "search",
  templateUrl: "search.component.html",
  styleUrls: ["./search.component.css"],
  providers: [SpotifyService]
})
export class SearchComponent {
  searchString: FormControl = new FormControl();
  searchResults: any;
  emptySearch: boolean = true;
  minFollowerCount: number = 1000; //minimum number of followers needed to be displayed
  maxGenres: number = 6; //the maximum number of genres to display for each artist
  constructor(private SpotifyService: SpotifyService) {}
  ngOnInit() {
    this.searchString.valueChanges.subscribe(searchString =>
      this.SpotifyService.getToken().subscribe(data => {
        //If the search string is empty or is only whitespace, do not make a request.
        if (searchString === "" || !/\S/.test(searchString)) {
          this.emptySearch = true;
          return;
        }
        this.emptySearch = false;
        //Search is not empty, so make request with user's search string.
        this.SpotifyService.searchForArtists(
          searchString,
          data["access_token"]
        ).subscribe(data => {
          this.searchResults = data["artists"]["items"];
        });
      })
    );
  }
  //This is a boolean function that determines if there are any
  //artists with over the minFollowerCount given the search string.
  noSearchResults(searchResults: any[]) {
    if (searchResults === undefined || searchResults.length == 0) return true;
    for (let res of searchResults) {
      if (res["followers"]["total"] > this.minFollowerCount) {
        return false;
      }
    }
    return true;
  }
  //Method to take in an array of genres and cut it to length 6 if necessary.
  cutGenres(genres: any[]) {
    if (genres.length <= this.maxGenres) return genres;
    return genres.slice(0, this.maxGenres);
  }
  //Method to dynamically change the donut status bar for an artist's popularity.
  //Inspired from peavy's work @ https://codepen.io/peavy/pen/NzYVjw
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
