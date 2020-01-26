import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { FormControl } from "@angular/forms";
import { Artist } from "../../../../Artist";
import * as $ from "jquery";

@Component({
  selector: "search",
  templateUrl: "search.component.html",
  styleUrls: ["./search.component.css"],
  providers: [SpotifyService]
})
export class SearchComponent {
  searchString: FormControl = new FormControl();
  searchResults: Artist[];
  emptySearch: boolean = true;
  minFollowerCount: number = 1000; //minimum number of followers needed to be displayed
  constructor(private SpotifyService: SpotifyService) {}
  ngOnInit() {
    this.searchString.valueChanges.subscribe(searchString =>
      this.SpotifyService.getToken().subscribe(data => {
        //if the search string is empty or is only whitespace, do not make a request
        if (searchString === "" || !/\S/.test(searchString)) {
          this.emptySearch = true;
          return;
        } else {
          this.emptySearch = false;
        }
        this.SpotifyService.searchForArtists(
          searchString,
          data["access_token"]
        ).subscribe(data => {
          this.searchResults = data["artists"]["items"];
        });
      })
    );
  }
  //this is a boolean function that determines if there are any
  //artists with over the minFollowerCount given the search string
  noSearchResults(searchResults: any[]) {
    if (searchResults === undefined || searchResults.length == 0) return true;
    for (let res of searchResults) {
      if (res["followers"]["total"] > this.minFollowerCount) {
        return false;
      }
    }
    return true;
  }
  //Method to dynamically change the donut status bar for an artist's popularity
  //Inspired from peavy's work @ https://codepen.io/peavy/pen/NzYVjw
  updateDonutChart(el: any, percent: number) {
    console.log(el);
    percent = Math.round(percent);
    if (percent > 100) {
      percent = 100;
    } else if (percent < 0) {
      percent = 0;
    }
    var deg = Math.round(360 * (percent / 100));
    if (percent > 50) {
      $(el + " .pie").css("clip", "rect(auto, auto, auto, auto)");
      $(el + " .right-side").css("transform", "rotate(180deg)");
    } else {
      $(el + " .pie").css("clip", "rect(0, 1em, 1em, 0.5em)");
      $(el + " .right-side").css("transform", "rotate(0deg)");
    }
    $(el + " .right-side").css("border-width", "0.1em");
    $(el + " .left-side").css("border-width", "0.1em");
    $(el + " .shadow").css("border-width", "0.1em");
    $(el + " .num").text(percent);
    $(el + " .left-side").css("transform", "rotate(" + deg + "deg)");
  }
}
