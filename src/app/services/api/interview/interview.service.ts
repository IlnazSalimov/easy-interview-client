import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateInterviewRequest } from './request/create-interview-request';
import { CreateInterviewResponse } from './responses/create-interview-response';
import * as config from '../../../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class InterviewService {

    constructor(private http: HttpClient) {
    }

    createInterview(requestModel: CreateInterviewRequest) {
        this.http.post<CreateInterviewResponse>(`${config.environment.apiEndpoint}/api/v1/interview`, requestModel)
            .subscribe(u => {
                console.log(u);
            }, error => console.log(error));
    }
}
