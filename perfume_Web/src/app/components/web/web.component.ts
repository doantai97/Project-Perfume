import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-web',
    templateUrl: './web.component.html',
    styleUrls: [
        './web.component.scss'
    ],
})
export class WebComponent implements OnInit {

    constructor(private http: HttpClient) {
    }

    ngOnInit(): void {
        // test call api
        // this.http
        //     .get<any>('http://dummy.restapiexample.com/api/v1/employees', {observe: 'response'}).subscribe(res => {
        //     console.log(res);
        // });
    }

}
