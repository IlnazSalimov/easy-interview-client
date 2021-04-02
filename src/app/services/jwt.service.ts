import { Injectable } from '@angular/core';
import { UserToken } from './api/oidc-user.service';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

private static TOKEN_KEY = 'user';

    getUser(): UserToken {
        const user = sessionStorage.getItem(JwtService.TOKEN_KEY);
        if (user) {
            return JSON.parse(user);
        }
        else {
            return null;
        }
    }

    saveUser(user: UserToken) {
        sessionStorage.setItem(JwtService.TOKEN_KEY, JSON.stringify(user));
    }

    destroyUser() {
        sessionStorage.removeItem(JwtService.TOKEN_KEY);
    }

    getToken(): string {
        const user = this.getUser();
        if (user) {
            return user.token;
        }
        else {
            return null;
        }
    }

    isLoggedIn() {
        const user = this.getUser();
        console.log('user?.expires', new Date(user?.expires));
        console.log('new Date()', new Date());
        console.log('user?.expires > new Date()', user?.expires > new Date());
        return new Date(user?.expires) > new Date();
    }
}
