import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { VotingStateModel } from './voting-state.model';
import {
  AddAnswerOption,
  EditAnswerOption,
  EditQuestion,
  RemoveAnswerOption,
  ResetCreatePollForm,
} from './voting.actions';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { StateReset } from 'ngxs-reset-plugin';

@State<VotingStateModel>({
  name: 'voting',
  defaults: {
    question: '',
    answerOptions: [],
  },
})
@Injectable()
export class VotingState {
  @Selector()
  public static answerOptions(state: VotingStateModel): string[] {
    return state.answerOptions;
  }

  @Action(EditQuestion)
  public editQuestion(
    { patchState }: StateContext<VotingStateModel>,
    { question }: EditQuestion
  ) {
    patchState({ question });
  }

  @Action(AddAnswerOption)
  public addAnswerOption(
    { setState }: StateContext<VotingStateModel>,
    { answerOption }: AddAnswerOption
  ) {
    setState(
      patch<VotingStateModel>({
        answerOptions: append<string>([answerOption]),
      })
    );
  }

  @Action(EditAnswerOption)
  public editAnswerOption(
    { setState }: StateContext<VotingStateModel>,
    { answerOption, index }: EditAnswerOption
  ) {
    setState(
      patch<VotingStateModel>({
        answerOptions: updateItem(index, answerOption),
      })
    );
  }

  @Action(RemoveAnswerOption)
  public removeAnswerOption(
    { setState }: StateContext<VotingStateModel>,
    { index }: RemoveAnswerOption
  ) {
    setState(
      patch<VotingStateModel>({
        answerOptions: removeItem<string>(index),
      })
    );
  }

  @Action(ResetCreatePollForm)
  public resetCreatePollForm({ dispatch }: StateContext<VotingStateModel>) {
    dispatch(new StateReset(VotingState));
  }
}
