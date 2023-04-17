import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ChatMessageDto } from '../models/chatMessageDto';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  

  newMessage: string;
  messageList: string[] = [];
  constructor(public chatService: ChatService) { }

  ngOnInit(){
    
  }
  socketConnected = false;
  
  initChat(){
    this.chatService.getMessage().subscribe((message: string) => {
      this.messageList.push(message);
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
      this.chatService.sendMessage(JSON.stringify(chatMessageDto));
      this.newMessage = '';
    }
  }
  

  ngOnDestroy(): void {
    this.chatService.closeWebSocket();
  }

}

