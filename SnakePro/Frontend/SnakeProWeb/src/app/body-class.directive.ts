import { Directive, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appBodyClass]'
})
export class BodyClassDirective implements OnInit, OnDestroy {
  private routerSubscription: Subscription | undefined;

  constructor(private renderer: Renderer2, private router: Router) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBodyClass(event.urlAfterRedirects);
      }
    });
  }

  updateBodyClass(url: string) {
      this.renderer.removeClass(document.body, 'login-page');
      this.renderer.removeClass(document.body, 'home-page');
    // Luego, aplicamos la clase correspondiente según la URL
    if (url.includes('login')) {
      this.renderer.addClass(document.body, 'login-page');
    } else if (url.includes('home')) {
      this.renderer.addClass(document.body, 'home-page');
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
