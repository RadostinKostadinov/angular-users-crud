import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  previousUrl = signal('not-application-url');

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setPreviousUrl(this.router.url);
      }
    });
  }

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.set(previousUrl);
  }
}
