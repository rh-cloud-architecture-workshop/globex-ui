import { Injectable, OnInit } from '@angular/core';
import { ChatMessageDto } from './models/chatMessageDto';
import { BehaviorSubject } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnInit{
  
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  
  chatMessages: ChatMessageDto[] = [];
  socket = io({
    'reconnection': true,
    'reconnectionDelay': 500,
    'reconnectionAttempts': 10
  });
  
  createRoom = true;

  
  constructor() { }
  
  ngOnInit(){
    

    this.socket.on('error', function(){
      console.log("socket cant connect")
      this.socket.socket.connect();
    });
  }

 
  public sendMessage(message: ChatMessageDto, sessionid: string) {
    if(this.createRoom) {
      this.socket.emit('switchRoom', sessionid);
      console.log("Room with " + sessionid + " created")
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
    this.socket.on("agentresponse", (message) =>{      
      console.log("getMessage() message", message)
      this.message$.next(message);
      
    });
    
    return this.message$.asObservable();
  };

  
  public closeWebSocket(sessionId) {
    this.socket.emit('deleteroom', sessionId);
    this.socket.close;
  }
}
