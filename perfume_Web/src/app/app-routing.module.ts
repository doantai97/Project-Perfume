import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthManagerGuard} from './comom/auth/authManager.guard';


const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthManagerGuard]
    },
    {
        path: '',
        loadChildren: () => import('./components/web/web.module').then(m => m.WebModule),
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
