import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  message: string
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.minLength(8), Validators.maxLength(40)],
      }),
      email: new FormControl(null, {
        validators: [
          Validators.email,
          Validators.required
        ]
      }),
      password: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$/)
        ]
      }),
      conditions: new FormControl(false, {
        validators: [
          Validators.required
        ]
      })
    })
  }

  signUp() {
    if (this.form.status === "VALID") {
      this.userService.signUp(this.form.value).subscribe(
        res => {
          localStorage.setItem('token', res['token']);
          localStorage.setItem('user', JSON.stringify(res['user']))
          this.router.navigate(['/validate'])
          this.message = "success"
        },
        err => {
          console.log(err)
        }
      )
    }
  }
}
