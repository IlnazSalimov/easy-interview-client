import { Component, OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public faGoogle = faGoogle;

    constructor(private oauthService: OAuthService) {

    }

    async login(event: Event) {
        event.preventDefault();
        this.oauthService.initImplicitFlow();
    }

    ngOnInit(): void {

    }
}
