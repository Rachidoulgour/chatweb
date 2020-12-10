import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private URL ="http://localhost:4000/api"

  constructor(private http: HttpClient) { }

  sendMessage(senderId, receiverId, receiverName, message): Observable<any>{
    return this.http.post(this.URL+'/chat-messages/'+senderId+ '/' + '/' + receiverId, {
      receiverId,
      receiverName,
      message
    })
  }
}
