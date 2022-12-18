export class EditQuestion {
  public static readonly type = '[Voting] Edit poll question';
  constructor(public question: string) {}
}

export class AddAnswerOption {
  public static readonly type = '[Voting] Add answer option';
  constructor(public answerOption: string) {}
}

export class EditAnswerOption {
  public static readonly type = '[Voting] Edit answer option';
  constructor(public answerOption: string, public index: number) {}
}

export class RemoveAnswerOption {
  public static readonly type = '[Voting] Remove answer option';
  constructor(public index: number) {}
}

export class ResetCreatePollForm {
  public static readonly type = '[Voting] Reset the "Create poll" form';
}

export class SubmitVote {
  public static readonly type = '[Voting] Submit vote';
  constructor(public answerOption: string) {}
}
