import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/components/header/header.component';
import { VotingState } from './voting/state/voting.state';
import { VotingModule } from './voting/voting.module';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([VotingState], {
      developmentMode: !environment.production,
    }),
    NgxsResetPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: 'voting',
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    VotingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
