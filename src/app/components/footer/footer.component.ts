import { Component } from '@angular/core';
import { UrlService } from '../../services/url.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  showFooter = true;

  constructor(private UrlService: UrlService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/edit/')) {
          this.showFooter = false;
        } else {
          this.showFooter = true;
        }
      }
    });
  }
}
