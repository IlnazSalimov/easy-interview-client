import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewComponent } from './components/interview/interview.component';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { HomeComponent } from './components/home/home.component';
import { CreateInterviewComponent } from './components/create-interview/create-interview.component';
import { LoginCallbackComponent } from './components/login-callback/login-callback.component';


const routes: Routes = [
    {
        path: '',
        component: FullComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'create-interview',
                component: CreateInterviewComponent,
                canActivate: [ AuthGuard ]
            },
            {
                path: 'login-callback',
                component: LoginCallbackComponent
            },
            {
                path: 'interview',
                component: InterviewComponent,
                canActivate: [ AuthGuard ]
            },
            {
                path: 'unauthorized',
                component: UnauthorizedComponent
            },
            {
                path: 'forbidden',
                component: ForbiddenComponent
            }
        ]
    },
    {
        path: 'login',
        component: BlankComponent,
        children: [
            {
                path: '',
                component: LoginComponent
            }
        ]
    }

];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {
}
