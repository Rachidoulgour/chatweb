import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  message: string;
  user;
  receiver: string;
  receiverData;
  constructor(private tokenservice: TokenService, 
    private messageService: MessageService, 
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.getIdentity();
    this.route.params.subscribe(params =>{
      this.receiver = params.id
      this.getUserById(this.receiver)
    })
  }

  getUserById(id){
    this.userService.getUser(this.receiver).subscribe(res =>{
      this.receiverData = res
    })
  }
  sendMessage(){
    this.messageService.sendMessage(this.user._id, this.receiverData._id, this.receiverData.name, this.message).subscribe(res=>{
      console.log(res)
    })
  }
}
