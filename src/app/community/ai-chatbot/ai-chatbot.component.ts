import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-ai-chatbot',
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.css']
})
export class AiChatbotComponent {
  messages: { text: string, from: 'user' | 'bot' }[] = [];
  userMessage: string = '';

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ text: this.userMessage, from: 'user' });

    this.http.post('http://localhost:8080/api/community/ai', this.userMessage, { responseType: 'text' })
      .subscribe(response => {
        this.messages.push({ text: response, from: 'bot' });
      });

    this.userMessage = '';
  }
}
