import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignalrService } from '../../services/signalr/signalr.service';
import { Guid } from 'guid-typescript';
import { Observable, Subject, Subscription } from 'rxjs';
import { PeerData, SignalInfo, UserInfo, Video } from '../../models/peer';
import { PeerConnectionService } from '../../services/peer-connection/peer-connection.service';
import { filter, map, take, tap } from 'rxjs/operators';
import { OidcUserService, UserToken } from '../../services/api/oidc-user.service';
import { OidcUserModel } from '../../models/oidc-user/oidc-user.model';

@Component({
    selector: 'app-interview',
    templateUrl: './interview.component.html',
    styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {
    public videosSources: Video[] = [];
    public subscriptions = new Subscription();
    private stream;
    public currentUser: OidcUserModel;
    public dataString: string;

    public mediaError = (): void => {
        console.error(`Can't get user media`);
    };

    constructor(private signalrService: SignalrService,
                private peerConnectionService: PeerConnectionService,
                private oidcUserService: OidcUserService) {

        this.oidcUserService.socialIdentityClaim$
            .pipe(
                filter(u => !!u)
            )
            .subscribe(oidcUser => {
                this.currentUser = oidcUser;
                signalrService.startConnection({ name: oidcUser.name, picture: oidcUser.picture });
            });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                this.stream = stream;
                peerConnectionService.connectToAllPeersInRoom(this.stream);
            });
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.signalrService.newPeer$.subscribe((user: UserInfo) => {
                this.peerConnectionService.adduser(user);
                this.signalrService.sayHello({ name: this.currentUser.name, picture: this.currentUser.picture }, user.connectionId);
            }));

        this.subscriptions.add(
            this.signalrService.helloAnswer$.subscribe((user: UserInfo) => {
                this.peerConnectionService.adduser(user);
            }));

        this.subscriptions.add(
            this.signalrService.disconnectedPeer$
                .subscribe((connectionId: string) => {
                    const video = this.videosSources.find(v => v.user.connectionId === connectionId);
                    const index = this.videosSources.indexOf(video, 0);
                    if (index > -1) {
                        this.videosSources.splice(index, 1);
                    }
                    this.peerConnectionService.removeUser(connectionId);
                }));

        this.subscriptions.add(this.signalrService.signal$.subscribe((signalData: SignalInfo) => {
            this.peerConnectionService.signalPeer(signalData.connectionId, signalData.signal, this.stream);
        }));

        this.subscriptions.add(this.peerConnectionService.onSignalToSend$.subscribe((data: PeerData) => {
            this.signalrService.sendSignalToUser(data.data, data.connectionId);
        }));

        // this.subscriptions.add(this.peerConnectionService.onData$.subscribe((data: PeerData) => {
        //     this.messages = [...this.messages, { own: false, message: data.data }];
        //     console.log(`Data from user ${data.id}: ${data.data}`);
        // }));

        this.subscriptions.add(
            this.peerConnectionService.onStream$.subscribe((data: PeerData) => {
                const user = this.peerConnectionService.getUserByconnectionId(data.connectionId).subscribe(u => {
                    this.videosSources.push({ user: u, src: data.data });
                });
            }));
    }

}
