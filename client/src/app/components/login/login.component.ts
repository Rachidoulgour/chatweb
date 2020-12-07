import { Component, OnInit } from '@angular/core';
import { UserService} from '../../services/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error404;
  user={
    email: "",
    password: ""
  }

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }
  login(){
    
    this.userService.login(this.user).subscribe(
      res=>{
        console.log(res)
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/perfil'])
      },
      err=>{
        console.log(err)
        if(err.status === 404){
          this.error404=err.status
        }
      }
    )
  }

}
