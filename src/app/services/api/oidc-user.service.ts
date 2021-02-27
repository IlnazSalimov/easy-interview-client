import { Injectable } from '@angular/core';
import { CreateOidcUserRequest } from './oidc-user/requests/create-oidc-user-request';
import { HttpClient } from '@angular/common/http';
import { CreateOidcUserResponse } from './oidc-user/responses/create-oidc-user-response';
import { Observable } from 'rxjs';
import { OidcUserModel } from '../../models/oidc-user/oidc-user.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class OidcUserService {

    users: Observable<OidcUserModel[]>;

    constructor(private http: HttpClient) {
    }

    create(user: CreateOidcUserRequest) {
        this.http.post<CreateOidcUserResponse>('http://localhost:60726/api/v1/user', user)
            .subscribe(u => {
                this.users.pipe(map(users => {
                    users.push(u);
                    return users;
                }));
            });
    }
}
