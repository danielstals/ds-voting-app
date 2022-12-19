import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AbstractControlHelper } from 'src/app/shared/helpers/form.helper';
import { VotingResult } from '../../models/voting-result.model';
import { SubmitVote } from '../../state/voting.actions';
import { VotingState } from '../../state/voting.state';

@Component({
  selector: 'ds-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
  public form: FormGroup;
  public favoriteSeason: Event;
  public abstractControlHelper = AbstractControlHelper;

  @Select(VotingState.votingResults)
  public votingResults$: Observable<VotingResult[]>;

  @Select(VotingState.question)
  public question$: Observable<string>;

  @Select(VotingState.answerOptions)
  public answerOptions$: Observable<string[]>;

  constructor(private fb: FormBuilder, private store: Store) {}

  public ngOnInit(): void {
    this.form = this.fb.group({
      poll: ['', [Validators.required]],
    });
  }

  public vote(): void {
    if (this.pollControl.invalid) {
      this.pollControl.markAsTouched();
      this.pollControl.markAsDirty();
      return;
    }

    this.store.dispatch(new SubmitVote(this.form.get('poll')?.value));
  }

  public get pollControl(): FormControl {
    return this.form.get('poll') as FormControl;
  }
}
