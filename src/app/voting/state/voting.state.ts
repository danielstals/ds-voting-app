import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { append, iif, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { ChartData } from 'chart.js';
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

  /**
   * Selector for retrieving chart data object for voting results chart. It makes use of the
   * votingResults selector shown above, it will emit a value when the votingResults selector
   * emits new values from state changes to the voting results.
   */
  public static votingChartData(): (votingResults: VotingResult[]) => ChartData<'bar'> {
    return createSelector([VotingState.votingResults], (votingResults: VotingResult[]) => {
      const labels: string[] = votingResults.map((vr: VotingResult) => this.truncate(vr.answerOption, 15));
      const chartData: ChartData<'bar'> = {
        labels: labels,
        datasets: [
          {
            label: 'Poll results',
            data: votingResults.map((vr) => vr.amountOfVotes),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
            ],
            borderWidth: 1,
          },
        ],
      };

      return chartData;
    });
  }

  @Action(EditQuestion)
  public editQuestion({ patchState }: StateContext<VotingStateModel>, { question }: EditQuestion) {
    patchState({ question });
  }

  @Action(AddAnswerOption)
  public addAnswerOption({ setState }: StateContext<VotingStateModel>, { answerOption }: AddAnswerOption) {
    setState(
      patch<VotingStateModel>({
        answerOptions: append<string>([answerOption]),
      })
    );
  }

  /**
   * Update an answer option at the given index, on both the votingResults and answerOptions state slices.
   */
  @Action(EditAnswerOption)
  public editAnswerOption(
    { setState, getState }: StateContext<VotingStateModel>,
    { answerOption, index }: EditAnswerOption
  ) {
    const state = getState();
    const existingAnswerOption = state.answerOptions[index];

    setState(
      patch<VotingStateModel>({
        votingResults: updateItem<VotingResult>(
          (v) => v!.answerOption === existingAnswerOption,
          patch<VotingResult>({
            answerOption: answerOption,
          })
        ),
        answerOptions: updateItem<string>(index, answerOption),
      })
    );
  }

  @Action(RemoveAnswerOption)
  public removeAnswerOption({ setState }: StateContext<VotingStateModel>, { index, answerOption }: RemoveAnswerOption) {
    setState(
      patch<VotingStateModel>({
        answerOptions: removeItem<string>(index),
        votingResults: removeItem<VotingResult>((vr) => vr?.answerOption === answerOption),
      })
    );
  }

  @Action(ResetCreatePollForm)
  public resetCreatePollForm({ dispatch }: StateContext<VotingStateModel>) {
    dispatch(new StateReset(VotingState));
  }

  /**
   * This state action processes a submitted vote. It will check if a vote already exists, and if so, will
   * add 1 to it's amountOfVotes property. Otherwise it will add a new voting result object to the
   * votingResults state slice and set it's amountOfVotes to 1.
   */
  @Action(SubmitVote)
  public submitVote({ setState, getState }: StateContext<VotingStateModel>, { answerOption }: SubmitVote) {
    const state = getState();
    const existingVotingResult: VotingResult | undefined = state.votingResults.find(
      (votingResult: VotingResult) => votingResult.answerOption === answerOption
    );
    const index: number | undefined = existingVotingResult
      ? state.votingResults.findIndex((vr: VotingResult) => vr.answerOption === answerOption)
      : undefined;

    setState(
      iif<VotingStateModel>(
        () => !!existingVotingResult,
        patch<VotingStateModel>({
          votingResults: updateItem<VotingResult>(
            index!,
            patch<VotingResult>({
              amountOfVotes: existingVotingResult ? existingVotingResult.amountOfVotes + 1 : 0,
            })
          ),
        }),
        patch<VotingStateModel>({
          votingResults: append<VotingResult>([{ amountOfVotes: 1, answerOption: answerOption }]),
        })
      )
    );
  }

  public static truncate(str: string, maxLength: number) {
    return str.length > maxLength ? str.slice(0, maxLength - 1) + '..' : str;
  }
}
