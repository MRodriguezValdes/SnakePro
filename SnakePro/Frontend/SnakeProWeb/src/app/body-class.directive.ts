import { Directive, Renderer2, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appBodyClass]'
})
export class BodyClassDirective implements OnInit, OnDestroy {
  /**
   * routerSubscription is a Subscription instance that represents the subscription to the router events.
   */
  private routerSubscription: Subscription | undefined;

  /**
   * The constructor for the BodyClassDirective class.
   * It injects the Renderer2, Router, and DOCUMENT services.
   * @param {Renderer2} renderer - The service for rendering operations.
   * @param {Router} router - The Angular router service.
   * @param {Document} document - The global document object.
   */
  constructor(private renderer: Renderer2, private router: Router, @Inject(DOCUMENT) private document: Document) {}

  /**
   * The ngOnInit method is a lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * In this method, it subscribes to the router events and calls the updateBodyClass method when a NavigationEnd event occurs.
   */
  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBodyClass(event.urlAfterRedirects);
      }
    });
  }

  /**
   * The updateBodyClass method updates the class of the body element based on the current route.
   * It removes the 'login-page' and 'home-page' classes, then it adds the appropriate class based on the current route.
   * @param {string} url - The URL of the current route.
   */
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

  /**
   * The ngOnDestroy method is a lifecycle hook that is called just before Angular destroys the directive.
   * In this method, it unsubscribes from the router events.
   */
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
