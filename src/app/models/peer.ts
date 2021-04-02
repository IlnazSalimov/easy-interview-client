import { Instance } from 'simple-peer';

export interface PeerData {
    connectionId: string;
    data: any;
}

export interface SignalInfo {
    connectionId: string;
    signal: any;
}

export interface User {
    name: string;
    picture: string;
}

export interface UserInfo {
    name: string;
    picture: string;
    connectionId: string;
    peerInstance: Instance;
}

export interface Video {
    user: UserInfo;
    src: any;
}


