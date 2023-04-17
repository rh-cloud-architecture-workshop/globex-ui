import { Injectable } from '@angular/core';
import { ChatMessageDto } from './models/chatMessageDto';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  public message$: BehaviorSubject<string> = new BehaviorSubject('');

  
  chatMessages: ChatMessageDto[] = [];
  socket = io();

  
  constructor() { }

 
  public sendMessage(message: string) {
    console.log('sendMessage: ', message)
    this.socket.emit('message', JSON.stringify(message));
  }

  public getMessage = () => {
    this.socket.on('message', (message) =>{
      this.message$.next(message);
    });
    
    return this.message$.asObservable();
  };

  
  public closeWebSocket() {
    this.socket.close;
  }
}
