import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { MessageComponent } from './components/message/message.component';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';
import { UserguardService } from './services/userguard.service';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    MessageComponent,
    ChatComponent,
    NavigationComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    UserguardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
