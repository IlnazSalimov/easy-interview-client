import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { OidcUserService } from '../../../services/api/oidc-user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(public oidcUserService: OidcUserService) {
    }

    ngOnInit(): void {
        this.oidcUserService.socialIdentityClaim$.subscribe(c=>{
            console.log(c);
        })
    }

}
