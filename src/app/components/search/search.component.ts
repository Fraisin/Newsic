import { Component } from "@angular/core";

@Component({
  selector: "search",
  templateUrl: "search.component.html",
  styleUrls: ["./search.component.css"]
})
export class SearchComponent {
  searchString: string;
  searchMusic() {
    console.log("Hello!");
  }
}
