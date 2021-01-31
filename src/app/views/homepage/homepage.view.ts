import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SiteService } from 'src/app/services/site/site.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'home-page',
  templateUrl: './homepage.view.html',
  styleUrls: ['./homepage.view.css'],
  animations: [
    trigger('fadeIn', [
      state('enter',
        style({
          opacity: 1,
          height: 'auto',
          overflow: 'auto'
        }),
      ),
      state('leave',
        style({
          opacity: 0,
          height: 0,
          overflow: 'hidden'
        })
      ),
      transition('enter => leave', [
        animate('1s')
      ]),
      transition('leave => enter', [
        animate('0.9s ease-in', style({ height: 'auto', overflow: 'auto' })),
        animate('2s')
      ]),
    ])
  ]
})
export class HomePageView implements OnInit {

  isDarkTheme: boolean;
  gameReady: boolean;
  constructor(private siteService: SiteService,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.siteService.isDarkThemeEnabled().subscribe((data) => {
      this.isDarkTheme = Boolean(data);
    });
    const gameData = this.cookieService.get('game-settings');
    if (gameData && JSON.parse(gameData).ready) {
      this.gameReady = true;
    }
  }
  setGameReady(isReady) {
    this.gameReady = isReady;
  }
}
