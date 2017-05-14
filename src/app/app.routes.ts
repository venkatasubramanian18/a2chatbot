import { Routes, RouterModule } from '@angular/router';
import { ChatWindowComponent } from './chat-window/chat-window.component';

// Route Configuration
export const routes: Routes = [
  { path: 'chat-window', component: ChatWindowComponent },
];

export const routing = RouterModule.forRoot(routes);