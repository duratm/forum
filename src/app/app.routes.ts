import {inject, Injectable, NgModule} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes} from '@angular/router';
import { ThreadListComponent } from './components/thread-list/thread-list.component';
import { ThreadDetailComponent } from './components/thread-detail/thread-detail.component';
import { ThreadCreateComponent } from './components/thread-create/thread-create.component';
import {RegisterComponent} from "./components/register/register.component";
import {LoginComponent} from "./components/signin/signin.component";
import {PocketbaseService} from "./services/pocketbase.service";

export const AuthGuard = () => {
  const auth = inject(PocketbaseService);
  const router = inject(Router);

  if(!auth.isAuthenticated()) {
    router.navigateByUrl('')
    return false
  }
  return true
}

export const routes: Routes = [
  { path: 'threads', component: ThreadListComponent, canActivate: [AuthGuard]},
  { path: 'register', component: RegisterComponent },
  { path: '', component: LoginComponent },
  { path: 'thread/:id', component: ThreadDetailComponent, canActivate: [AuthGuard] },
  { path: 'create-thread', component: ThreadCreateComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
