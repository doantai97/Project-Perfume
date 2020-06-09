import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {counterReducer} from './counter.reducer';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {fakeBackendProvider} from './interceptor/fake-backend';
import {ErrorInterceptor} from './interceptor/error.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './interceptor/jwt.interceptor';
import {Ng5SliderModule} from 'ng5-slider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {AlertService} from './service/alert.service';
import {AlertComponent} from './components/alert/alert.component';


@NgModule({
    declarations: [
        AppComponent,
        // AlertComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({count: counterReducer}),
        HttpClientModule,
        AppRoutingModule,

    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

        // provider used to create fake backend
        // fakeBackendProvider
    ],
    bootstrap: [AppComponent],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AppModule {
}
