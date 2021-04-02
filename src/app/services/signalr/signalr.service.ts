import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { User, SignalInfo, UserInfo } from '../../models/peer';
import * as config from '../../../environments/environment';
import { UserToken } from '../api/oidc-user.service';

@Injectable({
    providedIn: 'root'
})
export class SignalrService {

    private hubConnection: signalR.HubConnection;

    private newPeer = new Subject<UserInfo>();
    public newPeer$ = this.newPeer.asObservable();

    private helloAnswer = new Subject<UserInfo>();
    public helloAnswer$ = this.helloAnswer.asObservable();

    private disconnectedPeer = new Subject<string>();
    public disconnectedPeer$ = this.disconnectedPeer.asObservable();

    private signal = new Subject<SignalInfo>();
    public signal$ = this.signal.asObservable();

    constructor() {
    }

    public async startConnection(newUser: User): Promise<void> {

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${ config.environment.apiEndpoint }/signalrtc`)
            .build();

        await this.hubConnection.start();
        console.log('Connection started');

        this.hubConnection.on('NewUserArrived', (data) => {
            console.log('-> [SOCKET] on NewUserArrived <-');
            this.newPeer.next(JSON.parse(data));
        });

        this.hubConnection.on('UserSaidHello', (data) => {
            console.log('-> [SOCKET] on UserSaidHello <-');
            this.helloAnswer.next(JSON.parse(data));
        });

        this.hubConnection.on('UserDisconnect', (data) => {
            console.log('-> [SOCKET] on UserDisconnect <-');
            this.disconnectedPeer.next(data);
        });

        this.hubConnection.on('SendSignal', (connectionId, signal) => {
            console.log('-> [SOCKET] on SendSignal <-');
            this.signal.next({ connectionId, signal });
        });

        await this.hubConnection.invoke('NewUser', newUser);
        console.log('<- [SOCKET] NewUser ->');
    }

    public sendSignalToUser(signal: string, user: string) {
        console.log('<- [SOCKET] SendSignal ->');
        this.hubConnection.invoke('SendSignal', signal, user);
    }

    public sayHello(user: User, recipientConnectionId: string): void {
        console.log('<- [SOCKET] HelloUser');
        this.hubConnection.invoke('HelloUser', user, recipientConnectionId);
    }
}
