import {
  Component,
  Inject,
  ElementRef
} from '@angular/core';
import * as Redux from 'redux';

import { AppStore } from '../app.store';
import { User } from '../user/user.model';
import { Thread } from '../thread/thread.model';
import * as ThreadActions from '../thread/thread.actions';
import {
  AppState,
  getCurrentThread,
  getCurrentUser
} from '../app.reducer';
import { Router } from '@angular/router';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  currentThread: Thread;
  draftMessage: { text: string };
  currentUser: User;

  constructor(@Inject(AppStore) private store: Redux.Store<AppState>,
              private el: ElementRef, private rout:Router) {
    store.subscribe(() => this.updateState() );
    this.updateState();
    this.draftMessage = { text: '' };
  }

  updateState() {
    const state = this.store.getState();
    this.currentThread = getCurrentThread(state);
    this.currentUser = getCurrentUser(state);
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    const scrollPane: any = this.el
      .nativeElement.querySelector('.msg-container-base');
    if (scrollPane) {
      setTimeout(() => scrollPane.scrollTop = scrollPane.scrollHeight);
    }
  }

  sendMessage(): void {
    this.store.dispatch(ThreadActions.addMessage(
      this.currentThread,
      {
        author: this.currentUser,
        isRead: true,
        text: this.draftMessage.text
      }
    ));
    this.draftMessage = { text: '' };
  }

  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }
  show = true;
  onSet() {
    console.log("onSet1 : " + this.show);
    if (this.show == true)
    {
      this.show = false;
    }else
    {
      this.show = true;
    }
    console.log("onSet2 : " + this.show);
  } 
}
