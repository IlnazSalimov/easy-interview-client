import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PeerData, UserInfo, UserPeer } from '../../models/peer';
import { Instance } from 'simple-peer';
import { tap } from 'rxjs/operators';

declare var SimplePeer: any;

@Injectable({
    providedIn: 'root'
})
export class PeerConnectionService {
    private users: Array<UserInfo> = [];
    // public users$: Observable<Array<UserInfo>>;

    private onSignalToSend = new Subject<PeerData>();
    public onSignalToSend$ = this.onSignalToSend.asObservable();

    private onStream = new Subject<PeerData>();
    public onStream$ = this.onStream.asObservable();

    private onConnect = new Subject<PeerData>();
    public onConnect$ = this.onConnect.asObservable();

    private onData = new Subject<PeerData>();
    public onData$ = this.onData.asObservable();

    private peers: UserPeer[] = [];

    constructor() {
        // this.users = new BehaviorSubject([]);
        // this.users$ = this.users.asObservable();
    }

    public newUser(user: UserInfo): void {
        this.users.push(user);
    }

    public newPeer(peer: UserPeer) {
        this.peers.push(peer);
    }

    public disconnectedUser(connectionId: string): void {
        console.log(`disconnectedUser(${ connectionId })`);
        const itemToRemove = this.users.find(x => x.connectionId !== connectionId);
        const index = this.users.indexOf(itemToRemove, 0);
        if (index > -1) {
            this.users.splice(index, 1);
        }
    }

    public createPeer(stream, userId: string, initiator: boolean): Instance {
        const peer = new SimplePeer({ initiator, stream });

        peer.on('signal', data => {
            console.log('-> [PEER] on signal <-', data);
            const stringData = JSON.stringify(data);
            this.onSignalToSend.next({ id: userId, data: stringData });
        });

        peer.on('stream', data => {
            console.log('-> [PEER] on stream <-', data);
            this.onStream.next({ id: userId, data });
        });

        peer.on('connect', () => {
            console.log('-> [PEER] on connect <-');
            this.onConnect.next({ id: userId, data: null });
        });

        peer.on('data', data => {
            this.onData.next({ id: userId, data });
        });

        return peer;
    }

    public signalPeer(userId: string, signal: string, stream: any) {
        const signalObject = JSON.parse(signal);
        console.log(userId);
        console.log(this.peers);
        const peer = this.peers.find(p => p.user.connectionId === userId);
        if (peer) {
            console.log('<- [PEER] signal ->', signalObject);
            peer.peer.signal(signalObject);
        } else {
            const newPeer = this.createPeer(stream, userId, false);
            this.newPeer({ peer: newPeer, user: { userName: '', connectionId: userId } });
            newPeer.signal(signalObject);
            console.log('<- [PEER] signal ->', signalObject);
        }
    }

    public connectToAllPeersInRoom(stream: MediaStream) {
        this.users.forEach(u => {
            console.log(u);
            const peer = this.createPeer(stream, u.connectionId, true);
            this.newPeer({ peer, user: u });
        });
    }

    // public sendMessage(message: string) {
    //     this.currentPeer.send(message);
    // }
}
