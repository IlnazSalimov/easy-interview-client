import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcUserService } from './services/api/oidc-user.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { googleAuthConfig } from './auth/auth-google.config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
    title = 'easy-interview';

    username;

    constructor(private oauthService: OAuthService, private router: Router, private oidcUserService: OidcUserService) {
        this.oauthService.configure(googleAuthConfig);
        this.oauthService.setStorage(sessionStorage);
        this.oauthService.loadDiscoveryDocumentAndTryLogin()
            // .then(() => {
            //     if (!this.oauthService.hasValidAccessToken()) {
            //         return this.oauthService.silentRefresh();
            //     }
            // })
            .then(() => {
                if (this.oauthService.getIdentityClaims()) {
                    this.username = this.oauthService.getIdentityClaims()['name'];
                }
            });
        this.oauthService.setupAutomaticSilentRefresh();
    }

    async login(event) {
        this.oauthService.initLoginFlow();
    }

    ngOnInit(): void {
        console.log(this.oauthService.getIdentityClaims());

        this.oauthService.events.subscribe(e => {
            // tslint:disable-next-line:no-console
            console.log('oauth/oidc event', e);
        });

        this.oauthService.events
            .pipe(filter(e => e.type === 'session_terminated'))
            .subscribe(e => {
                // tslint:disable-next-line:no-console
                console.log('Your session has been terminated!');
            });

        this.oauthService.events
            .pipe(filter(e => e.type === 'token_received'))
            .subscribe(_ => {
                console.log('state', this.oauthService.state);
                this.oauthService.loadUserProfile().then(profile => {
                    this.oidcUserService.create({
                        name: profile.name,
                        email: profile.name,
                        picture: profile.picture
                    });
                });
            });
    }
}
