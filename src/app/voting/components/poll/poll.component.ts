import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { VotingResult } from '../../models/voting-result.model';
import { SubmitVote } from '../../state/voting.actions';
import { VotingState } from '../../state/voting.state';

@Component({
  selector: 'ds-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
  form: FormGroup;
  favoriteSeason: Event;

  @Select(VotingState.votingResults)
  public votingResults$: Observable<VotingResult[]>;

  @Select(VotingState.question)
  public question$: Observable<string>;

  @Select(VotingState.answerOptions)
  public answerOptions$: Observable<string[]>;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      poll: [''],
    });
  }

  vote(): void {
    this.store.dispatch(new SubmitVote(this.form.get('poll')?.value));
  }
}
