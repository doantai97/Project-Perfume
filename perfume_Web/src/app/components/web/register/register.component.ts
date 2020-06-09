import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../service/authentication.service';
import {AlertService} from '../../../service/alert.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    formRegister: FormGroup;

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private alertService: AlertService) {
                this.initForm();
    }

    initForm() {
        this.formRegister = this.fb.group({
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            firstname: ['', [Validators.required]],
            lastname: ['', [Validators.required]],
            address: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
        });
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const password = group.get('password').value;
        const repeatPassword = group.get('confirmPassword').value;
        return password === repeatPassword ? true : {notSame: null};
    }


    ngOnInit(): void {
    }

    createAccount() {
        console.log(this.formRegister.value);
        this.authenticationService.register(this.formRegister.value).subscribe(res => {
            if (res.status === 200) {
                alert(res.body.msg);
            }
        });
    }

}
