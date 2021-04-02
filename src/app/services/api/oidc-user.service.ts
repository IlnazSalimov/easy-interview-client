import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService } from '../jwt.service';
import * as config from '../../../environments/environment'
import { OidcUserModel } from '../../models/oidc-user/oidc-user.model';

@Injectable({
    providedIn: 'root'
})
export class OidcUserService {

    private currentUserSubject = new BehaviorSubject<UserToken>({} as UserToken);
    public currentUser = this.currentUserSubject.asObservable();

    private socialIdentityClaimSubject$ = new BehaviorSubject<OidcUserModel>(null);
    public socialIdentityClaim$ = this.socialIdentityClaimSubject$.asObservable();

    constructor(private http: HttpClient, private jwtService: JwtService) {
    }

    // create(user: CreateOidcUserRequest) {
    //     this.http.post<CreateOidcUserResponse>('${config.environment.apiEndpoint}/api/v1/user', user)
    //         .subscribe(u => {
    //             this.users.pipe(map(users => {
    //                 users.push(u);
    //                 return users;
    //             }));
    //         });
    // }

    public auth(user: GoogleUserRequest) {
        return this.http
            .post<UserToken>(`${config.environment.apiEndpoint}/api/v1/auth`, user)
            .pipe(map(profile => {
                this.setAuth(profile);
                return profile;
            }));
    }

    private setAuth(user: UserToken) {
        this.jwtService.saveUser(user);
        this.currentUserSubject.next(user);
    }

    public setSocialIdentityClaim(user: OidcUserModel) {
        this.socialIdentityClaimSubject$.next(user);
    }
}

export interface GoogleUserRequest {
    idToken: string;
}

export interface UserToken {
    userId: string;
    expires: Date;
    email: string;
    token: string;
}
