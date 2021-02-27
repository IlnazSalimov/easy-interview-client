import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserInfo } from '../../../models/peer';
import { Observable } from 'rxjs';
import { PeerConnectionService } from '../../../services/peer-connection/peer-connection.service';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss']
})
export class VideoChatComponent implements OnInit {
    constructor() { }

    ngOnInit() {
    }

}
