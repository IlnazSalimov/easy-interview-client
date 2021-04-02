import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PeerData, UserInfo } from '../../models/peer';
import { Instance } from 'simple-peer';
import { OidcUserService } from '../api/oidc-user.service';
import { map, take } from 'rxjs/operators';

declare var SimplePeer: any;

@Injectable({
    providedIn: 'root'
})
export class PeerConnectionService {
    private onSignalToSend = new Subject<PeerData>();
    public onSignalToSend$ = this.onSignalToSend.asObservable();

    private onStream = new Subject<PeerData>();
    public onStream$ = this.onStream.asObservable();

    private onConnect = new Subject<PeerData>();
    public onConnect$ = this.onConnect.asObservable();

    private onData = new Subject<PeerData>();
    public onData$ = this.onData.asObservable();

    private users: BehaviorSubject<UserInfo[]> = new BehaviorSubject<UserInfo[]>([]);
    public users$ = this.users.asObservable();

    constructor(private oidcUserService: OidcUserService) {
    }

    public createPeer(stream, connectionId: string, initiator: boolean): Instance {
        const peer = new SimplePeer({ initiator, stream });

        peer.on('signal', data => {
            console.log('-> [PEER] on signal <-', data);
            const stringData = JSON.stringify(data);
            this.onSignalToSend.next({ connectionId, data: stringData });
        });

        peer.on('stream', data => {
            console.log('-> [PEER] on stream <-', data);
            this.onStream.next({ connectionId, data });
        });

        peer.on('connect', () => {
            console.log('-> [PEER] on connect <-');
            this.onConnect.next({ connectionId, data: null });
        });

        peer.on('data', data => {
            this.onData.next({ connectionId, data });
        });

        return peer;
    }

    public signalPeer(connectionId: string, signal: string, stream: any) {
        const signalObject = JSON.parse(signal);
        console.log(connectionId);

        const nonObservableUsers = this.users.getValue();
        const u = nonObservableUsers.find(u => u.connectionId == connectionId);

        if (u.peerInstance) {
            console.log('<- [PEER] signal ->', signalObject);
            u.peerInstance.signal(signalObject);
        } else {
            u.peerInstance = this.createPeer(stream, connectionId, false);
            u.peerInstance.signal(signalObject);
            this.users.next(nonObservableUsers);
            console.log('<- [PEER] signal ->', signalObject);
        }

        // this.users.pipe(
        //     map(users => users.find(u => u.connectionId == connectionId)),
        // ).subscribe(user => {
        //     if (user.peerInstance) {
        //         console.log('<- [PEER] signal ->', signalObject);
        //         user.peerInstance.signal(signalObject);
        //     } else {
        //         user.peerInstance = this.createPeer(stream, connectionId, false);
        //         user.peerInstance.signal(signalObject);
        //         console.log('<- [PEER] signal ->', signalObject);
        //     }
        // });
    }

    public connectToAllPeersInRoom(stream: MediaStream) {
        const users = this.users.getValue();
        users.forEach(u => {
            u.peerInstance = this.createPeer(stream, u.connectionId, true);
        });
        this.users.next(users);
    }

    public adduser(user: UserInfo): void {
        const users = this.users.getValue();
        users.push(user);
        this.users.next(users);
    }

    public removeUser(connectionId: string): void {
        console.log(`disconnectedUser(${ connectionId })`);
        const users = this.users.getValue();
        const itemToRemove = users.find(x => x.connectionId !== connectionId);
        const index = users.indexOf(itemToRemove, 0);
        if (index > -1) {
            users.splice(index, 1);
        }
        this.users.next(users);
    }

    public getUserByconnectionId(connectionId: string): Observable<UserInfo> {
        return this.users$
            .pipe(
                take(1),
                map(users => users.find(u => u.connectionId == connectionId))
            );
    }
}
