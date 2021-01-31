import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'result-board',
  templateUrl: './result-board.component.html',
  styleUrls: ['./result-board.component.css']
})
export class ResultBoardComponent {

  @Input() isDarkTheme: boolean;
  @Input() firstName: string;
  @Input() secondName: string;
  finalScores = [0, 0];

  private _boardDetails: any;
  @Input() set boardDetails(value: any) {
    this._boardDetails = value;
  }
  get boardDetails(): any {
    if (this._boardDetails) {
      this.finalScores[0] = this._boardDetails.player1Scores.reduce((a, b) => a + b, 0);
      this.finalScores[1] = this._boardDetails.player2Scores.reduce((a, b) => a + b, 0);
    }
    return this._boardDetails;
  }
  constructor() { }
}
