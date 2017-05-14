import * as Redux from 'redux'
import {
  AppState,
  getAllMessages
} from '../app.reducer';
import { uuid } from '../util/uuid';
import * as moment from 'moment';
import { Thread } from '../thread/thread.model';
import * as ThreadActions from '../thread/thread.actions';
import { User } from '../user/user.model';
import * as UserActions from '../user/user.actions';

/**
 * ChatExampleData sets up the initial data for our chats as well as
 * configuring the "bots".
 */

// the person using the app is Juliet
const me: User = {
  id: uuid(),
  isClient: true, // <-- notice we're specifying the client as this User
  name: 'Juliet',
  avatarSrc: 'assets/images/avatars/male-avatar-1.png'
};

const echo: User = {
  id: uuid(),
  name: 'Echo Bot',
  avatarSrc: 'assets/images/avatars/female-avatar-2.png'
};

const tEcho: Thread = {
  id: 'tEcho',
  name: echo.name,
  avatarSrc: echo.avatarSrc,
  messages: []
};

export function ChatExampleData(store: Redux.Store<AppState>) {

  // set the current User
  store.dispatch(UserActions.setCurrentUser(me));

 
  // create a few more threads
  store.dispatch(ThreadActions.addThread(tEcho));
  store.dispatch(ThreadActions.addMessage(tEcho, {
    author: echo,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: 'I\'ll echo whatever you send me'
  }));

  // select the first thread
  store.dispatch(ThreadActions.selectThread(tEcho));

  // Now we set up the "bots". We do this by watching for new messages and
  // depending on which thread the message was sent to, the bot will respond
  // in kind.

  const handledMessages = {};

  store.subscribe( () => {
    getAllMessages(store.getState())
      // bots only respond to messages sent by the user, so
      // only keep messages sent by the current user
      .filter(message => message.author.id === me.id)
      .map(message => {

        // This is a bit of a hack and we're stretching the limits of a faux
        // chat app. Every time there is a new message, we only want to keep the
        // new ones. This is a case where some sort of queue would be a better
        // model
        if (handledMessages.hasOwnProperty(message.id)) {
          return;
        }
        handledMessages[message.id] = true;

        switch (message.thread.id) {
          case tEcho.id:
            // echo back the same message to the user
            store.dispatch(ThreadActions.addMessage(tEcho, {
              author: echo,
              text: message.text
            }));

            break;
          default:
            break;
        }
      });
  });
}
