import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './pages/auth/auth.guard';
import { AuthComponent } from './pages/auth/auth.component';
import { DecksComponent } from './pages/decks/decks.component';
import { PracticeComponent } from './pages/practice/practice.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DeckEditorComponent } from './pages/deck-editor/deck-editor.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  { path: 'auth', component: AuthComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'practice/:id', component: PracticeComponent, canActivate: [AuthGuard] },
  { path: 'decks', component: DecksComponent, canActivate: [AuthGuard] },
  { path: 'deck/:id', component: DeckEditorComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/' },
];
