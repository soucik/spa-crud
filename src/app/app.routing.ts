import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { PeopleComponent } from './people/people.component';
import { BearerAuthService } from './services/bearer-auth.service';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'people', component: PeopleComponent, canActivate: [BearerAuthService] },
    { path: '**', redirectTo: '/people' }
];

export const routing = RouterModule.forRoot(appRoutes);
