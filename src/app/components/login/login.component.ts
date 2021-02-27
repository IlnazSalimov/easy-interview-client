import { Component, OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { OAuthService } from 'angular-oauth2-oidc';
import { googleAuthConfig } from '../../auth/auth-google.config';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
    public faGoogle = faGoogle;

    constructor(private oauthService: OAuthService) {

    }

    async login(event: Event) {
        event.preventDefault();
        this.oauthService.configure(googleAuthConfig);
        this.oauthService.setStorage(localStorage);
        await this.oauthService.loadDiscoveryDocumentAndTryLogin();
        this.oauthService.setupAutomaticSilentRefresh();

        await this.oauthService.loadDiscoveryDocument();
        sessionStorage.setItem('flow', 'implicit');

        this.oauthService.initLoginFlow();

    }

    ngOnInit(): void {

    }
}
