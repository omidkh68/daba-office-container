import {Directive, Input, OnInit} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Directive({
  selector: 'img[defaultImg]',
  host: {
    '[src]': 'src'
  }
})

export class ImagePreloadDirective implements OnInit {
  @Input() src: string;
  @Input() defaultImg: string;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getImage().then((src: string) => {
      this.src = src;
    });
  }

  getImage(): Promise<string> {
    return new Promise((resolve) => {
      const folderPath = this.defaultImg;
      const defaultPath = 'assets/profileImg/0.jpg';

      this.http
        .get(`${folderPath}`, {observe: 'response', responseType: 'blob'})
        .pipe(
          map(() => {
            return folderPath;
          }),
          catchError(() => {
            return of(defaultPath);
          })
        ).subscribe((src) => {
          resolve(src);
        }, () => {
          resolve(defaultPath);
        });
    });
  }
}
