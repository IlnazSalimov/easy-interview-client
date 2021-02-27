import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { SignalInfo, UserInfo } from '../../models/peer';

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

    public async startConnection(currentUser: string): Promise<void> {

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://192.168.0.14:5001/signalrtc')
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

        this.hubConnection.on('SendSignal', (user, signal) => {
            console.log('-> [SOCKET] on SendSignal <-');
            this.signal.next({user, signal});
        });

        await this.hubConnection.invoke('NewUser', currentUser);
        console.log('<- [SOCKET] NewUser ->');
    }

    public sendSignalToUser(signal: string, user: string) {
        console.log('<- [SOCKET] SendSignal ->');
        this.hubConnection.invoke('SendSignal', signal, user);
    }

    public sayHello(userName: string, user: string): void {
        console.log('<- [SOCKET] HelloUser');
        this.hubConnection.invoke('HelloUser', userName, user);
    }
}
