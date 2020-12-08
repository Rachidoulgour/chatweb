import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UsersComponent } from './components/users/users.component';


const routes: Routes = [
  {
    path: 'signup',
    component: SignupComponent
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'chat/:user',
  component: ChatComponent
},
{
  path: 'users',
  component: UsersComponent
},
{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
