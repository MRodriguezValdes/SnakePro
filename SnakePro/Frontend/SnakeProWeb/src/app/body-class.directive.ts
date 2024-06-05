import { Directive, Renderer2, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appBodyClass]'
})
export class BodyClassDirective implements OnInit, OnDestroy {
  private routerSubscription: Subscription | undefined;

  constructor(private renderer: Renderer2, private router: Router, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBodyClass(event.urlAfterRedirects);
      }
    });
  }

  updateBodyClass(url: string) {
    this.renderer.removeClass(this.document.body, 'login-page');
    this.renderer.removeClass(this.document.body, 'home-page');
    if (url.includes('login')) {
      this.renderer.addClass(this.document.body, 'login-page');
    } else if (url.includes('home')) {
      this.renderer.addClass(this.document.body, 'home-page');
    }else if (url.includes('scoreboards')) {
      this.renderer.addClass(this.document.body, 'scoreboard-page');
    }else if (url.includes('contact')) {
      this.renderer.addClass(this.document.body, 'home-page');}
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
