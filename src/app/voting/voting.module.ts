import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './components/chart/chart.component';
import { CreatePollComponent } from './components/create-poll/create-poll.component';
import { PollComponent } from './components/poll/poll.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreatePollComponent, PollComponent, ChartComponent],
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatButtonModule],
  exports: [CreatePollComponent, PollComponent, ChartComponent],
})
export class VotingModule {}
