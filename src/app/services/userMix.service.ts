import { Injectable } from "@angular/core";
import { StorageMap } from "@ngx-pwa/local-storage";

@Injectable()
export class UserMixService {
  //This array represents the mix of a user.
  //It consists of objects that represent genres, artists and tracks.
  userMix: any[] = [];
  constructor(private storage: StorageMap) {}
  //If there are existing items in the user mix, load them.
  loadUserMix() {
    this.storage.get("userMix").subscribe(userItems => {
      if (userItems) {
        this.userMix = <any[]>userItems;
      }
    });
  }
  //Returns true if array is empty.
  arrayIsEmpty() {
    return this.userMix.length == 0;
  }
  //Returns true if array is full.
  arrayIsFull() {
    return this.userMix.length >= 5;
  }
  //Adds an object of any kind to the array.
  addObjectToArray(objectToAdd: any) {
    this.userMix.push(objectToAdd);
    this.saveArrayInStorage();
  }
  //Takes in an ID from an artist or track and determines if it is already in the array.
  objectInArray(id: string) {
    for (var entity of this.userMix) {
      if (entity["type"] == "artist" || entity["type"] == "track") {
        if (entity["id"] == id) {
          return true;
        }
      }
    }
    return false;
  }
  //Takes an id, locates the corresponding object in the array and deletes it.
  deleteEntity(type: string, id: string) {
    this.userMix = this.userMix.filter(entity => entity.id != id);
    this.saveArrayInStorage();
  }
  //Clears the entire array.
  deleteAllEntities() {
    this.userMix.length = 0;
    this.saveArrayInStorage();
  }
  //Saves the user mix array in the local storage so it remains upon refresh or reroute.
  saveArrayInStorage() {
    this.storage.set("userMix", this.userMix).subscribe(() => {});
    console.log(this.userMix);
  }
}
