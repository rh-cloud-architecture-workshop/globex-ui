import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../chat.service';
import { ChatMessageDto } from '../models/chatMessageDto';
import * as uuid from 'uuid';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {


  newMessage: string;
  messageList: any[] = [];
  sessionid: string;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  user:any;

  constructor(public chatService: ChatService, public loginService: LoginService) {
    this.sessionid = uuid.v4();
    console.log("this.sessionid", this.sessionid)
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ngOnInit() {

    if (this.loginService.getAuthenticatedUser() != '') {
      this.user = this.loginService.getAuthenticatedUser();
      
      console.log("user", this.user);

    }
    this.scrollToBottom();
  }
  socketConnected = false;

  initChat() {
    this.chatService.getMessage(this.sessionid).subscribe((message: any) => {
      console.log("chatService.getMessage");
      console.log(message);
      if (message != null && message != '') {
        this.messageList.push(message);
      }
    })
    this.socketConnected = true;
  }

  sendMessage(sendForm) {
    if (!this.socketConnected) {
      this.initChat();
    }
    if (sendForm.value.message && sendForm.value.message != null) {
      const chatMessageDto = new ChatMessageDto(this.user, sendForm.value.message);
      sendForm.controls.message.reset();
      this.chatService.sendMessage(chatMessageDto, this.sessionid);
      if (chatMessageDto != null && chatMessageDto.message != '') {
        let message = {
          "user":chatMessageDto.getUser() + " (You)",
          "text":chatMessageDto.getMessage(),
          "sessionid": this.sessionid
      }
        this.messageList.push(message);
      }
      this.newMessage = '';
    }
  }


  ngOnDestroy(): void {
    this.chatService.closeWebSocket(this.sessionid);
  }

}

