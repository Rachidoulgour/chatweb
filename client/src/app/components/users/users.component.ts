import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  identity: any;
  token: string;
  page;
  next_page;
  prev_page;
  status: string;
  total;
  pages;
  users: User[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  ngOnInit() {
    this.actualPage();
  }
  actualPage() {
    this.route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;
      if (!params['page']) {
        page = 1
      }
      if (!page) {
        page = 1
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;
        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      this.getUsers(page);
    });
  }

  getUsers(page) {
    this.userService.getUsers(page).subscribe(
      (res: any) => {
        if (!res) {
          this.status = 'error';
        } else {
          this.total = res['total'];
          
          this.users = res['users'];
          
          this.pages = res['pages'];
          if (page > this.pages) {
            this.router.navigate(['/gente', 1]);
          }
        }
      },
      err => {
        const errorMessage = err;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error'
        }
      }
    )
  }

}
