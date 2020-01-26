import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./components/about/about.component";
import { SearchComponent } from "./components/search/search.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ArtistComponent } from "./components/artist/artist.component";

const routes: Routes = [
  { path: "", component: SearchComponent },
  { path: "about", component: AboutComponent },
  { path: "artist/:id", component: ArtistComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
