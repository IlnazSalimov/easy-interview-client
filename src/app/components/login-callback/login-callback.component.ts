import { Component, OnInit } from '@angular/core';
import { OidcUserService } from '../../services/api/oidc-user.service';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
    selector: 'app-login-callback',
    templateUrl: './login-callback.component.html',
    styleUrls: [ './login-callback.component.scss' ]
})
export class LoginCallbackComponent implements OnInit {

    constructor(private oauthService: OAuthService,
                private oidcUserService: OidcUserService,
                private router: Router) {
        // if (this.oauthService.hasValidIdToken()) {
        //     this.oidcUserService.create({
        //         name
        //     })
        // }

    }

    ngOnInit(): void {
    }

}
