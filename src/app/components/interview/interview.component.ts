import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SignalrService } from '../../services/signalr/signalr.service';
import { Guid } from 'guid-typescript';
import { Observable, Subject, Subscription } from 'rxjs';
import { PeerData, SignalInfo, UserInfo, Video } from '../../models/peer';
import { PeerConnectionService } from '../../services/peer-connection/peer-connection.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-interview',
    templateUrl: './interview.component.html',
    styleUrls: [ './interview.component.scss' ]
})
export class InterviewComponent implements OnInit {

    public videosSources: Video[] = [];

    public subscriptions = new Subscription();

    private stream;

    public currentUser: string;

    public dataString: string;

    public userVideo: string;

    public users$: Observable<Array<UserInfo>>;

    // public messages: Array<ChatMessage>;

    public mediaError = (): void => {
        console.error(`Can't get user media`);
    }

    constructor(private signalrService: SignalrService,
                private peerConnectionService: PeerConnectionService) {

        signalrService.startConnection(Guid.create().toString());

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            this.stream = stream;
            peerConnectionService.connectToAllPeersInRoom(this.stream);
        });
    }

    ngOnInit(): void {
        this.subscriptions.add(this.signalrService.newPeer$.subscribe((user: UserInfo) => {
            this.peerConnectionService.newUser(user);
            this.signalrService.sayHello(this.currentUser, user.connectionId);
        }));

        this.subscriptions.add(this.signalrService.helloAnswer$.subscribe((user: UserInfo) => {
            this.peerConnectionService.newUser(user);
        }));

        this.subscriptions.add(this.signalrService.disconnectedPeer$.subscribe((user: string) => {
            const video = this.videosSources.find(v => v.connectionId === user);
            const index = this.videosSources.indexOf(video, 0);
            if (index > -1) {
                this.videosSources.splice(index, 1);
            }
            this.peerConnectionService.disconnectedUser(user);
        }));

        this.subscriptions.add(this.signalrService.signal$.subscribe((signalData: SignalInfo) => {
            this.peerConnectionService.signalPeer(signalData.user, signalData.signal, this.stream);
        }));

        this.subscriptions.add(this.peerConnectionService.onSignalToSend$.subscribe((data: PeerData) => {
            this.signalrService.sendSignalToUser(data.data, data.id);
        }));

        // this.subscriptions.add(this.peerConnectionService.onData$.subscribe((data: PeerData) => {
        //     this.messages = [...this.messages, { own: false, message: data.data }];
        //     console.log(`Data from user ${data.id}: ${data.data}`);
        // }));

        this.subscriptions.add(this.peerConnectionService.onStream$.subscribe((data: PeerData) => {
            // this.userVideo = data.id;
            // this.videoPlayer.nativeElement.srcObject = data.data;
            // this.videoPlayer.nativeElement.load();
            // this.videoPlayer.nativeElement.play();

            this.videosSources.push({connectionId: data.id, src: data.data});
        }));
    }

}
