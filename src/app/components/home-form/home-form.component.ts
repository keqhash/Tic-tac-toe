import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'home-form',
  templateUrl: './home-form.component.html',
  styleUrls: ['./home-form.component.css']
})
export class HomeFormComponent implements OnInit {

  @Input() isDarkTheme: boolean;
  borderSizes: Array<any>;
  CellsToWin: Array<number>;
  selectedBoardSize: number;
  selectedCellsToWin: number;
  formData: any;
  errorMsg: string;
  errorMsgs = {
    firstName: 'Please enter player 1 name.',
    secondName: 'Please enter player 2 name.',
    nameMatch: 'Please add different names.'
  };
  @Output() done = new EventEmitter<boolean>();

  constructor(private cookieService: CookieService) { }

  ngOnInit() {
    this.formData = {};
    this.initBorderSizes();
    this.initCellsToWin();
  }

  initBorderSizes() {
    this.borderSizes = [];
    for (let i = 3; i < 11; i++) {
      this.borderSizes.push({
        value: i,
        text: `${i}x${i}`
      });
      this.formData.selectedBoardSize = this.borderSizes[0].value;
    }
  }
  initCellsToWin() {
    this.CellsToWin = [];
    for (let i = 3; i <= this.formData.selectedBoardSize; i++) {
      this.CellsToWin.push(i);
    }
    this.formData.selectedCellsToWin = this.CellsToWin[0];
  }
  checkValidation() {
    if (this.formData.againstComputer && !(this.formData.secondName || '').trim()) {
      this.formData.secondName = 'PC';
    }
    const data = this.formData;
    this.errorMsg = '';
    if (!(data.firstName || '').trim()) {
      this.errorMsg = this.errorMsgs.firstName;
      return false;
    }
    else if (!(data.secondName || '').trim()) {
      this.errorMsg = this.errorMsgs.secondName;
      return false;
    } else if (data.firstName.trim() == data.secondName.trim()) {
      this.errorMsg = this.errorMsgs.nameMatch;
      return false;
    }
    return true;
  }
  submit() {
    const valid = this.checkValidation();
    if (valid) {
      this.formData.ready = true;
      this.cookieService.set('game-settings', JSON.stringify(this.formData), undefined, '', '', false, "Lax");
      this.done.emit(true);
    }
  }
}
