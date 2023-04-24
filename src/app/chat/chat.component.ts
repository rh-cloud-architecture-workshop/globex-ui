import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ChatMessageDto } from '../models/chatMessageDto';
import * as uuid from 'uuid';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  

  newMessage: string;
  messageList: any[] = [];
  sessionid :string;

  constructor(public chatService: ChatService) { 
    this.sessionid =  uuid.v4();    
    console.log("this.sessionid", this.sessionid)
  }

  ngOnInit(){
    
  }
  socketConnected = false;
  
  initChat(){
    this.chatService.getMessage(this.sessionid).subscribe((message: any) => {
      console.log("chatService.getMessage");
      console.log(message);
      if(message!=null && message!='') {
        this.messageList.push(message);
      }
    })
    this.socketConnected = true;
  }

  sendMessage(sendForm) {
    if(!this.socketConnected)  {
      this.initChat();
    }
    if(sendForm.value.message && sendForm.value.message!=null) {
      const chatMessageDto = new ChatMessageDto(sendForm.value.user, sendForm.value.message);
      sendForm.controls.message.reset();
      this.chatService.sendMessage(chatMessageDto, this.sessionid);
      this.newMessage = '';
    }
  }
  

  ngOnDestroy(): void {
    this.chatService.closeWebSocket();
  }

}

