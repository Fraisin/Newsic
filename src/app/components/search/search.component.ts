import { Component, OnInit } from "@angular/core";
import { SpotifyService } from "../../services/spotify.service";
import { FormControl } from "@angular/forms";
import { Artist } from "../../../../Artist";

@Component({
  selector: "search",
  templateUrl: "search.component.html",
  styleUrls: ["./search.component.css"],
  providers: [SpotifyService]
})
export class SearchComponent {
  searchString: FormControl = new FormControl();
  searchResults: Artist[];
  constructor(private SpotifyService: SpotifyService) {}
  ngOnInit() {
    this.searchString.valueChanges.subscribe(searchString =>
      this.SpotifyService.getToken().subscribe(data => {
        //if the search string is empty or is only whitespace, do not make a request
        if (searchString === "" || !/\S/.test(searchString)) return;
        this.SpotifyService.searchForArtists(
          searchString,
          data["access_token"]
        ).subscribe(data => {
          this.searchResults = data["artists"]["items"];
        });
      })
    );
  }
}
