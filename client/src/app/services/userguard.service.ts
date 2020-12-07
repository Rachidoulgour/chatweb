import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class UserguardService implements CanActivate{

  constructor(
    private router: Router,
    private userService: UserService
  ) { }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
    let identity = this.userService.getIdentity()
    if(identity && (identity['role']=="ROLE_USER" || identity['role']=="ROLE_ADMIN")){
      return true;
    }else{
      this.router.navigate(['/login'])
    }
  }
}
