import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InterviewComponent } from './components/interview/interview.component';
import { VideoChatComponent } from './components/interview/video-chat/video-chat.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CodeEditorComponent } from './components/interview/code-editor/code-editor.component';
import { FullComponent } from './layouts/full/full.component';
import { AppMaterialModule } from './app-material.module';
import { HeaderComponent } from './layouts/full/header/header.component';
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { MenuItems } from './shared/menu-items/menu-items';
import { AccordionDirective } from './shared/accordion/accordion.directive';
import { AccordionLinkDirective } from './shared/accordion/accordionlink.directive';
import { AccordionAnchorDirective } from './shared/accordion/accordionanchor.directive';
import { BlankComponent } from './layouts/blank/blank.component';
import { LoginComponent } from './components/login/login.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './components/home/home.component';
import { CreateInterviewComponent } from './components/create-interview/create-interview.component';
import { LoginCallbackComponent } from './components/login-callback/login-callback.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OidcUserService } from './services/api/oidc-user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth.interceptor';


@NgModule({
    declarations: [
        AppComponent,
        InterviewComponent,
        VideoChatComponent,
        CodeEditorComponent,
        FullComponent,
        HeaderComponent,
        SidebarComponent,
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        BlankComponent,
        LoginComponent,
        ForbiddenComponent,
        UnauthorizedComponent,
        HomeComponent,
        CreateInterviewComponent,
        LoginCallbackComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        AppMaterialModule,
        FontAwesomeModule,
        HttpClientModule,
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: ['http://localhost:60726/api'],
                sendAccessToken: true
            }
        }),
        ReactiveFormsModule
    ],
    providers: [
        MenuItems,
        OidcUserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
