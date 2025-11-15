import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'RedAds';
  isLayoutVisible = false;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const urlObject = new URL(
          event.urlAfterRedirects || event.url,
          environment.apiUrl
        );

        let urlWithoutParams = urlObject.pathname;
        let urlSegments = urlObject.pathname.split('/');
        let lastSegment = urlSegments[urlSegments.length - 1];
        let isUuid =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
            lastSegment
          );

        if (isUuid) {
          urlWithoutParams = urlObject.pathname.replace(lastSegment, ':id');
        }
        if (lastSegment === 'new') {
          urlWithoutParams = urlObject.pathname.replace(lastSegment, ':id');
        }

        if (urlWithoutParams.includes('/redeem/')) {
          urlWithoutParams = '/redeem/:id';
        }
        const routesToRemove = [
          '/',
          '/login',
          '/register',
          '/forgot-password',
          '/redeem/:id',
          '/search',
        ];
        const knownRoutes = this.router.config.map((route) => '/' + route.path);
        const filteredRoutes = knownRoutes.filter(
          (route) => !routesToRemove.includes(route as string)
        );
        this.isLayoutVisible = filteredRoutes.includes(urlWithoutParams);
      }
    });
  }
}
