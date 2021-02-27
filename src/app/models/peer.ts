import { Instance } from 'simple-peer';

export interface PeerData {
    id: string;
    data: any;
}

export interface UserInfo {
    userName: string;
    connectionId: string;
}

export interface SignalInfo {
    user: string;
    signal: any;
}

export interface UserPeer {
    user: UserInfo;
    peer: Instance;
}

export interface Video {
    connectionId: string;
    src: any;
}


