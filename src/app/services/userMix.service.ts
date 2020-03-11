import { Injectable } from "@angular/core";
import { StorageMap } from "@ngx-pwa/local-storage";

@Injectable()
export class UserMixService {
  // this array represents the 'mix' of a user.
  // it consists of genres or the IDs of artists and songs they would like to add
  userMix: any[] = [];
  constructor(private storage: StorageMap) {}
  // if there are existing items in the user mix, load them.
  loadUserMix() {
    //this.storage.delete("userMix").subscribe(() => {});
    this.storage.get("userMix").subscribe(userItems => {
      if (userItems) {
        this.userMix = <any[]>userItems;
      }
    });
  }
  //Returns true if array is empty, false if not.
  arrayIsEmpty() {
    return this.userMix.length == 0;
  }
  //Determines if array is maxed at 5 or not.
  arrayIsFull() {
    return this.userMix.length >= 5;
  }
  //Returns true if the track with the specified ID is already in the user mix.
  trackInUserMix(trackID: string) {}
  //Adds an object to the UserMix array.
  addObjectToArray(objectToAdd: any) {
    this.userMix.push(objectToAdd);
    this.saveArrayInStorage();
  }
  //Takes an id, locates the corresponding object in the user mix array and deletes it
  deleteEntity(type: string, id: string) {
    this.userMix = this.userMix.filter(entity => entity.id != id);
    this.saveArrayInStorage();
  }
  //Clears the entire user mix array if they press the 'Clear All' button.
  deleteAllEntities() {
    this.userMix.length = 0;
    this.saveArrayInStorage();
  }
  //Saves the user mix array in the local storage so it remains upon refresh.
  saveArrayInStorage() {
    this.storage.set("userMix", this.userMix).subscribe(() => {});
  }
}
