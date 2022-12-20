import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AbstractControlHelper } from 'src/app/core/helpers/form.helper';
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

  /**
   * On component initialisation, create the reactive form which is used for the poll.
   */
  public ngOnInit(): void {
    this.form = this.fb.group({
      poll: ['', [Validators.required]],
    });
  }

  /**
   * Method which handles the click on the vote button. If the control is valid,
   * dispatch the state action SubmitVote.
   */
  public vote(): void {
    if (this.pollControl.invalid) {
      this.pollControl.markAsTouched();
      this.pollControl.markAsDirty();
      return;
    }

    this.store.dispatch(new SubmitVote(this.form.get('poll')?.value));
  }

  /**
   * Getter for ease of accessing the poll form control
   */
  public get pollControl(): FormControl {
    return this.form.get('poll') as FormControl;
  }
}
