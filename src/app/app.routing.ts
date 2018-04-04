import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PeopleComponent } from './people/people.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'people', component: PeopleComponent },
    { path: '**', redirectTo: '/login' }
];

export const routing = RouterModule.forRoot(appRoutes);
