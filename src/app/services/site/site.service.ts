import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  private isDarkTheme: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private localStorageService: LocalStorageService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  initSite(): Observable<void> {
    return new Observable<void>(o => {
      this.getThemeAppliedFromStorage();
      this.isDarkThemeEnabled().subscribe(value => {
        if (value) {
          this.document.body.classList.remove('light-theme');
          this.document.body.classList.add('dark-theme');
        } else {
          this.document.body.classList.add('light-theme');
          this.document.body.classList.remove('dark-theme');
        }
      });
      o.complete();
    });
  }
  getThemeAppliedFromStorage() {
    let storedValue = parseInt(this.localStorageService.getItem('darkTheme'));
    if (isNaN(storedValue)) {
      storedValue = 0;
    }
    this.isDarkTheme.next(storedValue);
  }

  isDarkThemeEnabled() {
    return this.isDarkTheme;
  }
  storeSelectedTheme(selectedTheme: number) {
    this.isDarkTheme.next(selectedTheme);
    this.localStorageService.setItem('darkTheme', `${selectedTheme}`);
  }
}
