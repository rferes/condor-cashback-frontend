import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

function sliceBeforeQuestionMark(url: string): string {
  const questionMarkIndex = url.indexOf('?');
  if (questionMarkIndex !== -1) {
    return url.slice(0, questionMarkIndex);
  }
  return url; // Return the original URL if '?' is not found
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('accessToken');
    // const refreshToken = localStorage.getItem('refreshToken');
    const type = (localStorage.getItem('type') || '').toLowerCase();
    // Assuming state.url is the URL you want to clean

    // Example usage
    const url = state.url;
    const queryString = sliceBeforeQuestionMark(url);

    if (!token) {
      // If the user is not authenticated, redirect to the login page
      if (
        queryString === '/' ||
        queryString === '/login' ||
        queryString === '/register' ||
        queryString === '/search' ||
        queryString === '/forgot-password' ||
        queryString.includes('redeem/')
      ) {
        return true;
      }
    } else if (queryString !== '/login' && type === '"incomplete email"') {
      return true;
    } else {
      // If the user is authenticated and not trying to access the login, register, or forgot password page, redirect to the dashboard
      if (
        queryString === '/' ||
        queryString === '/login' ||
        queryString === '/register' ||
        queryString === '/forgot-password'
      ) {
        this.router.navigate(['/dashboard']);
        return true;
      }
    }
    // If the user is authenticated and not trying to access the login, register, or forgot password page, allow access to the route
    return true;
  }
}
