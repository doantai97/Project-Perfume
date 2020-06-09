import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../service/authentication.service';
import {AlertService} from '../../../service/alert.service';
import {first} from 'rxjs/internal/operators/first';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    resetPasswordForm: FormGroup;

    tokenResetPassword: string = null;

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
    }

    ngOnInit() {
        this.tokenResetPassword = null;
        this.resetPasswordForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required]],
        });
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }


    resetPassword(modal) {
        this.tokenResetPassword = null;
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            })
            .result.then(result => {
            if (result === 'save') {
                this.authenticationService.resetPassword(this.resetPasswordForm.value).subscribe(res => {
                    if (res.status) {
                        if (res.body.status === 200) {
                            this.tokenResetPassword = res.body.data.confirmationToken;
                        } else {
                            alert(res.body.msg);
                        }
                    } else {
                        alert('lỗi hệ thống');
                    }

                });
            }
        });
    }
}
