import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {

    public identityClaim: any;

    constructor(private oauthService: OAuthService) {
    }

    ngOnInit(): void {
        this.identityClaim = this.oauthService.getIdentityClaims();
    }

}
