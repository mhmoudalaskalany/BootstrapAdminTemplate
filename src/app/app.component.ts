import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { Shell } from 'base/components/shell';
import { TranslationService } from 'core/services/localization/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'demo1';

  showSidebar = true;
  showNavbar = true;
  showFooter = true;
  isLoading: boolean;

  constructor(private router: Router, public inj: Injector, public translateService: TranslationService, public titleService: Title) {
    Shell.Injector = inj;
    this.translateService.setDefaultLanguage();
    this.setTitle();

    // Removing Sidebar, Navbar, Footer for Documentation, Error and Auth pages
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if ((event['url'] === '/user-pages/login') ||
          (event['url'] === '/user-pages/register') ||
          (event['url'] === '/error-pages/404') || (event['url'] === '/error-pages/500')) {
          this.showSidebar = false;
          this.showNavbar = false;
          this.showFooter = false;
          document.querySelector('.main-panel').classList.add('w-100');
          document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
          document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg',);
          document.querySelector('.content-wrapper').classList.remove('auth', 'lock-full-bg');
          if ((event['url'] === '/error-pages/404') || (event['url'] === '/error-pages/500')) {
            document.querySelector('.content-wrapper').classList.add('p-0');
          }
        } else {
          this.showSidebar = true;
          this.showNavbar = true;
          this.showFooter = true;
          document.querySelector('.main-panel').classList.remove('w-100');
          document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
          document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg');
          document.querySelector('.content-wrapper').classList.remove('p-0');
        }
      }
    });

    // Spinner for lazyload modules
    router.events.forEach((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });
  }



  ngOnInit(): void {
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  setTitle(): void {
    const lang = this.translateService.getCurrentLanguage();
    if (lang === 'ar') {
      this.titleService.setTitle('ادارة المخازن');
    } else {
      this.titleService.setTitle('Stock Management System');
    }
  }
}
