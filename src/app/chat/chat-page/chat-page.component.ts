import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { Message } from '../message.model';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css'],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  messages$ = this.messagesService.getMessages();
  username$ = this.loginService.getUsername();

  messageForm = this.fb.group({
    msg: '',
  });

  currentUsername: string | null = null;
  usernameSubscription: Subscription;

  messages: Message[] | null = null;

  constructor(
    private fb: FormBuilder,
    private messagesService: MessagesService,
    private loginService: LoginService
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.currentUsername = u;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  onSendMessage() {
    if (
      this.currentUsername &&
      this.messageForm.valid &&
      this.messageForm.value.msg
    ) {
      this.messagesService.postMessage({
        id: null,
        text: this.messageForm.value.msg,
        username: this.currentUsername,
        timestamp: Date.now(),
      });
    }
    this.messageForm.reset();
  }

  /** Afficher la date seulement si la date du message précédent est différente du message courant. */
  showDateHeader(messages: Message[] | null, i: number) {
    if (messages != null) {
      if (i === 0) {
        return true;
      } else {
        const prev = new Date(messages[i - 1].timestamp).setHours(0, 0, 0, 0);
        const curr = new Date(messages[i].timestamp).setHours(0, 0, 0, 0);
        return prev != curr;
      }
    }
    return false;
  }

  onQuit() {
    // A faire
  }
}
