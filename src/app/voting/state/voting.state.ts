import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  append,
  iif,
  patch,
  removeItem,
  updateItem,
} from '@ngxs/store/operators';
import { StateReset } from 'ngxs-reset-plugin';
import { VotingResult } from '../models/voting-result.model';
import { VotingStateModel } from './voting-state.model';
import {
  AddAnswerOption,
  EditAnswerOption,
  EditQuestion,
  RemoveAnswerOption,
  ResetCreatePollForm,
  SubmitVote,
} from './voting.actions';

@State<VotingStateModel>({
  name: 'voting',
  defaults: {
    question: '',
    answerOptions: [],
    votingResults: [],
  },
})
@Injectable()
export class VotingState {
  @Selector()
  public static question(state: VotingStateModel): string {
    return state.question;
  }

  @Selector()
  public static answerOptions(state: VotingStateModel): string[] {
    return state.answerOptions;
  }

  @Selector()
  public static votingResults(state: VotingStateModel): VotingResult[] {
    return state.votingResults;
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

  @Action(SubmitVote)
  public submitVote(
    { setState, getState }: StateContext<VotingStateModel>,
    { answerOption }: SubmitVote
  ) {
    const state = getState();
    const existingVotingResult: VotingResult | undefined =
      state.votingResults.find(
        (votingResult: VotingResult) =>
          votingResult.answerOption === answerOption
      );
    const index: number | undefined = existingVotingResult
      ? state.votingResults.findIndex(
          (vr: VotingResult) => vr.answerOption === answerOption
        )
      : undefined;

    setState(
      iif<VotingStateModel>(
        () => !!existingVotingResult,
        patch<VotingStateModel>({
          votingResults: updateItem<VotingResult>(
            index!,
            patch<VotingResult>({
              amountOfVotes: existingVotingResult
                ? existingVotingResult.amountOfVotes + 1
                : 0,
            })
          ),
        }),
        patch<VotingStateModel>({
          votingResults: append<VotingResult>([
            { amountOfVotes: 1, answerOption: answerOption },
          ]),
        })
      )
    );
  }
}
