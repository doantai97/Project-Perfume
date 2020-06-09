import {Component} from '@angular/core';
import {UserService} from '../../../service/user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'register.component.html'
})
export class RegisterComponent{

    constructor(private userService: UserService) {

    }

}
