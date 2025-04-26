import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage: string = '';
  botReply: string = '';

  constructor(private http: HttpClient) {}

  send() {
    this.http.post<any>('http://localhost:8080/api/community/chat', { message: this.userMessage })
      .subscribe(res => {
        this.botReply = res.reply;
      });
  }
}