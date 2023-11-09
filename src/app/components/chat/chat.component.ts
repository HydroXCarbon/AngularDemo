import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import *  as sockjs from 'sockjs-client';
import { IChatMessage } from 'src/app/interface/i-chat-message';
import { ChatService } from 'src/app/services/chat.service';
import * as Stomp from 'stompjs';
import{ tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  private stopmpClient: any;
  
  private CHANNEL = "/topic/chat";
  private ENDPOINT = "http://localhost:8080/socket";

  messages: IChatMessage[] = []

  isConnected = false;

  chatFormGroup: FormGroup = new FormGroup({
    message: new FormControl('', Validators.required)
  });

  constructor( private chatService: ChatService) { 
  }

  ngOnInit(): void {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    let ws = new sockjs(this.ENDPOINT);
    this.stopmpClient = Stomp.over(ws);
    
    let that = this;

    this.stopmpClient.connect({}, function() {
      that.isConnected = true;
      that.subscribeToGlobalChat();
    });
  }

  private subscribeToGlobalChat() {
    let that = this;

    this.stopmpClient.subscribe(this.CHANNEL, function(message: any){
      let newMessage = JSON.parse(message.body) as IChatMessage;
      console.log(newMessage)
      that.messages.push(newMessage);
      });
  }


  onSubmit() {
    let message = this.chatFormGroup.controls['message'].value;

   // Is connected?
    if(!this.isConnected) {
      alert("You are not connected to the server");
      return;
    }

    // Validate
    this.chatService.postMessage(message).pipe(
      tap((response) => {
        console.log(response);
      }),
      catchError((error) => {
        console.log(error);
        throw error;
      })
    ).subscribe();
  }
}
