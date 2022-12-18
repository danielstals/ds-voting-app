import { VotingResult } from '../models/voting-result.model';

export interface VotingStateModel {
  question: string;
  answerOptions: string[];
  votingResults: VotingResult[];
}
