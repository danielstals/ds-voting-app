import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { map, merge, Observable, Subject, take, takeUntil } from 'rxjs';
import { AbstractControlHelper } from 'src/app/shared/helpers/form.helper';
import { SubscriptionComponent } from 'src/app/shared/helpers/subscription.helper';
import {
  AddAnswerOption,
  EditAnswerOption,
  EditQuestion,
  RemoveAnswerOption,
  ResetCreatePollForm,
} from '../../state/voting.actions';
import { VotingState } from '../../state/voting.state';

@Component({
  selector: 'ds-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss'],
})
export class CreatePollComponent
  extends SubscriptionComponent
  implements OnInit
{
  public form: FormGroup;
  public maxNumberOfAnswers = 10;
  public changesUnsubscribe$ = new Subject();
  public resetUnsubscribe$ = new Subject();
  public abstractControlHelper = AbstractControlHelper;

  @Select(VotingState.question)
  public question$: Observable<string>;

  @Select(VotingState.answerOptions)
  public answerOptions$: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private actions$: Actions
  ) {
    super();
  }

  public ngOnInit(): void {
    this.createForm();
    this.registerSubscriptions();
  }

  /**
   * Getters to quickly access form controls
   */
  public get questionControl(): FormControl {
    return this.form.get('question') as FormControl;
  }

  public get newAnswerOptionControl(): FormControl {
    return this.form.get('newAnswerOption') as FormControl;
  }

  public get answerOptionFormArray(): FormArray {
    return this.form.controls['answerOptions'] as FormArray;
  }

  public resetForm(): void {
    this.store.dispatch(new ResetCreatePollForm());
  }

  public removeAnswerOption(index: number, answerOption: string): void {
    this.store.dispatch(new RemoveAnswerOption(index, answerOption));
  }

  /**
   * If the control is invalid: Trigger error message by marking the form as touched and dirty.
   * If the control is valid: Push a new answer option control on the form array and clear the input.
   */
  public addAnswerOption(): void {
    if (this.newAnswerOptionControl.invalid) {
      this.newAnswerOptionControl.markAsTouched();
      this.newAnswerOptionControl.markAsDirty();
      return;
    }

    this.store.dispatch(new AddAnswerOption(this.newAnswerOptionControl.value));

    this.answerOptionFormArray.push(
      this.fb.group({ answerOption: [this.newAnswerOptionControl.value] })
    );
    this.newAnswerOptionControl.reset();
  }

  private registerSubscriptions(): void {
    this.addSub(
      this.actions$
        .pipe(ofActionSuccessful(ResetCreatePollForm))
        .subscribe(() => {
          this.createForm();
          this.watchForChanges();
        })
    );

    this.addSub(
      this.actions$
        .pipe(ofActionSuccessful(RemoveAnswerOption))
        .subscribe(({ index }) => {
          this.answerOptionFormArray.removeAt(index);
        })
    );

    this.addSub(
      this.question$.pipe(take(1)).subscribe((question: string) => {
        this.form.get('question')?.setValue(question);
      })
    );

    this.addSub(
      this.answerOptions$.pipe(take(1)).subscribe((answerOptions: string[]) => {
        answerOptions.forEach((ao: string) => {
          this.answerOptionFormArray.push(
            this.fb.group({ answerOption: [ao] })
          );
        });
        this.watchForChanges();
      })
    );
  }

  /**
   * Create the reactive form used for the "create poll" functionality
   */
  private createForm(): void {
    this.resetUnsubscribe$.next(undefined);

    this.form = this.fb.group({
      question: ['', [Validators.required]],
      answerOptions: this.fb.array([]),
      newAnswerOption: ['', [Validators.required, Validators.maxLength(80)]],
    });

    this.addSub(
      this.answerOptionFormArray.valueChanges
        .pipe(takeUntil(this.resetUnsubscribe$))
        .subscribe(() => {
          this.watchForChanges();
        })
    );

    this.addSub(
      this.form.controls['question'].valueChanges
        .pipe(takeUntil(this.resetUnsubscribe$))
        .subscribe((value: string) => {
          this.store.dispatch(new EditQuestion(value));
        })
    );
  }

  private watchForChanges(): void {
    // cleanup any prior subscriptions before re-establishing new ones
    this.changesUnsubscribe$.next(undefined);

    this.addSub(
      merge(
        ...this.answerOptionFormArray.controls.map(
          (control: AbstractControl, index: number) =>
            control.valueChanges.pipe(
              takeUntil(this.changesUnsubscribe$),
              map((value) => ({
                rowIndex: index,
                control: control,
                data: value,
              }))
            )
        )
      ).subscribe((changes) => {
        this.store.dispatch(
          new EditAnswerOption(changes.data.answerOption, changes.rowIndex)
        );
      })
    );
  }
}
