import { Injectable } from '@angular/core';
import { ChatMessageDto } from './models/chatMessageDto';
import { BehaviorSubject } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  
  chatMessages: ChatMessageDto[] = [];
  socket = io();
  createRoom = true;

  
  constructor() { }

 
  public sendMessage(message: ChatMessageDto, sessionid: string) {
    console.log('sendMessage: ', message)
    if(this.createRoom) {
      this.socket.emit('switchRoom', sessionid);
      console.log("Room `$sessionid` created")
      this.createRoom = false;
    }

    this.socket.emit('message', 
    {
      "user":message.getUser() + " (You)",
      "text":message.getMessage(),
      "sessionid": sessionid
  }
  );
  }

  public getMessage = (sessionid) => {
    this.socket.on("message", (message) =>{      
      console.log("getMessage() message", message)
      this.message$.next(message);
      
    });
    
    return this.message$.asObservable();
  };

  
  public closeWebSocket() {
    this.socket.close;
  }
}
