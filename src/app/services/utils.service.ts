import {Injectable} from "@angular/core";
@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor() {
    }

    pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
}
