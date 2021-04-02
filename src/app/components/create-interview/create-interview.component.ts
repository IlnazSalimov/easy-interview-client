import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../services/api/interview/interview.service';
import { FormControl, Validators } from '@angular/forms';


// export const MY_FORMATS = {
//     parse: {
//         dateInput: 'LL',
//     },
//     display: {
//         dateInput: 'YYYY-MM-DD',
//         monthYearLabel: 'YYYY',
//         dateA11yLabel: 'LL',
//         monthYearA11yLabel: 'YYYY',
//     },
// };

@Component({
    selector: 'app-create-interview',
    templateUrl: './create-interview.component.html',
    styleUrls: ['./create-interview.component.scss']
})
export class CreateInterviewComponent implements OnInit {
    bookedDate = new FormControl('', Validators.required);

    constructor(private interviewService: InterviewService) {
    }

    ngOnInit(): void {
    }

    create() {
        if (this.bookedDate.valid) {
            this.interviewService.createInterview({ bookedDate: this.bookedDate.value });
        }
    }
}
