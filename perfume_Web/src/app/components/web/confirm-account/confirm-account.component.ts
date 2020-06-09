import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../service/authentication.service';
import {AlertService} from '../../../service/alert.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-account',
    templateUrl: './confirm-account.component.html',
    styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {

    password: string = null;
    msg: string = null;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private modalService: NgbModal,
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }

        this.route.queryParams.subscribe(params => {
            const token = params.token;
            this.authenticationService.confirmAccount(token).subscribe(res => {
                if (res.status === 200) {
                    if (res.body.status === 200) {
                        this.msg = null;
                        this.password = res.body.data;
                    } else {
                        this.msg = res.body.msg;
                        this.password = null;
                    }
                } else {
                    alert('lỗi hệ thống');
                }
            });
        });
    }

    ngOnInit(): void {
        this.password = null;
        this.msg = null;
    }

}
