import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site/site.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  themes = [
    {
      text: 'Light Mode',
      val: 0
    },
    {
      text: 'Dark Mode',
      val: 1
    }
  ];
  selectedThemeValue;

  constructor(private siteService: SiteService) { }

  ngOnInit() {
    this.siteService.isDarkThemeEnabled().subscribe((data) => {
      this.selectedThemeValue = data;
    })
  }
  onThemeChange(selectedThemeValue) {
    this.selectedThemeValue = selectedThemeValue;
    this.siteService.storeSelectedTheme(selectedThemeValue);
  }
}
