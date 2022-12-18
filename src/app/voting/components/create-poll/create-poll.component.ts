import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'ds-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss'],
})
export class CreatePollComponent implements OnInit {
  form: FormGroup;
  maxNumberOfAnswers = 10;
  answerOptions = ['Example answer option'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();

    this.answerOptions.forEach((ao: string) => {
      this.answerOptionFormArray.push(this.fb.group({ answerOption: [ao] }));
    });
  }

  /**
   * Getters to quickly access form controls
   */
  get questionControl(): FormControl {
    return this.form.get('question') as FormControl;
  }

  get newAnswerOptionControl(): FormControl {
    return this.form.get('newAnswerOption') as FormControl;
  }

  get answerOptionFormArray(): FormArray {
    return this.form.controls['answerOptions'] as FormArray;
  }

  resetForm(): void {
    this.createForm();
  }

  removeAnswerOption(index: number): void {
    this.answerOptionFormArray.removeAt(index);
  }

  /**
   * If the control is invalid: Trigger error message by marking the form as touched and dirty.
   * If the control is valid: Push a new answer option control on the form array and clear the input.
   */
  addAnswerOption(): void {
    if (this.newAnswerOptionControl.invalid) {
      this.newAnswerOptionControl.markAsTouched();
      this.newAnswerOptionControl.markAsDirty();
      return;
    }

    this.answerOptionFormArray.push(
      this.fb.group({ answerOption: [this.newAnswerOptionControl.value] })
    );
    this.newAnswerOptionControl.reset();
  }

  getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'You must enter a value';
    } else if (control.hasError('maxlength')) {
      return 'This field has a maximum length of 80';
    }
    return '';
  }

  /**
   * Create the reactive form used for the "create poll" functionality
   */
  private createForm(): void {
    this.form = this.fb.group({
      question: ['', [Validators.required]],
      answerOptions: this.fb.array([]),
      newAnswerOption: ['', [Validators.required, Validators.maxLength(80)]],
    });
  }
}
