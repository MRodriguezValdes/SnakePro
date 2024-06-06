'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Snake pro web documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' : 'data-bs-target="#xs-components-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' :
                                            'id="xs-components-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErrorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GameOverComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GameOverComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PauseComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PauseComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScoreItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScoreItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScoreboardsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScoreboardsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' : 'data-bs-target="#xs-directives-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' :
                                        'id="xs-directives-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' }>
                                        <li class="link">
                                            <a href="directives/BodyClassDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BodyClassDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' : 'data-bs-target="#xs-injectables-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' :
                                        'id="xs-injectables-links-module-AppModule-aecbbdf2601724620adfe34fe7fbe53e6a7870e0d9609cf4aa82b04bfbb8e2704ab08ec634da9aa2affae4517dd76c6218b8a353d47c8d9bebf8fd38f393db98"' }>
                                        <li class="link">
                                            <a href="injectables/SnakeCommunicationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SnakeCommunicationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppServerModule.html" data-type="entity-link" >AppServerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppServerModule-f9bd8a2e383e1fdb89b720482f275daf4d52b1791e7f4a876525a64e6683f175d787e6648760b5c33b83cc499537f1610a22f454735802bee0d2d5888220fb91"' : 'data-bs-target="#xs-components-links-module-AppServerModule-f9bd8a2e383e1fdb89b720482f275daf4d52b1791e7f4a876525a64e6683f175d787e6648760b5c33b83cc499537f1610a22f454735802bee0d2d5888220fb91"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppServerModule-f9bd8a2e383e1fdb89b720482f275daf4d52b1791e7f4a876525a64e6683f175d787e6648760b5c33b83cc499537f1610a22f454735802bee0d2d5888220fb91"' :
                                            'id="xs-components-links-module-AppServerModule-f9bd8a2e383e1fdb89b720482f275daf4d52b1791e7f4a876525a64e6683f175d787e6648760b5c33b83cc499537f1610a22f454735802bee0d2d5888220fb91"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ContactService.html" data-type="entity-link" >ContactService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SnakeCommunicationsService.html" data-type="entity-link" >SnakeCommunicationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/LoginGuardian.html" data-type="entity-link" >LoginGuardian</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});