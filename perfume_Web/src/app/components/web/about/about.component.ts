import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../../model/user';
import {UserService} from '../../../service/user.service';
import {AuthenticationService} from '../../../service/authentication.service';
import {first} from 'rxjs/internal/operators/first';
import {DisplayStaticService} from '../../../service/display-static.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    currentUser: User;
    users = [];

    displayStaticType = '';
    content = '';

    constructor(private authenticationService: AuthenticationService,
                private userService: UserService,
                private displayStaticService: DisplayStaticService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit(): void {
        this.displayStaticService.find('about').subscribe(res => {
            this.content = res.body.content;
        });
    }

}
