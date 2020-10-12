
export const setStorage = (cname, cvalue) => {
  let expires = 'expires=Thu, 18 Dec 2023 12:00:00 UTC';
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const removeStorage = (cname) => {
  let expires = 'expires=Thu, 18 Dec 2002 12:00:00 UTC';
  document.cookie = cname + "=" + '' + ";" + expires + ";path=/";
}

export const getStorage = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setStorage(cname, cvalue) {
    let expires = 'expires=Thu, 18 Dec 2023 12:00:00 UTC';
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  removeStorage(cname) {
    let expires = 'expires=Thu, 18 Dec 2002 12:00:00 UTC';
    document.cookie = cname + "=" + '' + ";" + expires + ";path=/";
  }

  getStorage(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
}*/

