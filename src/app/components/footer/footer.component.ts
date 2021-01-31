import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site/site.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  selectedThemeValue;
  currentYear;

  constructor(private siteService: SiteService) { }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.siteService.isDarkThemeEnabled().subscribe((data) => {
      this.selectedThemeValue = data;
    })
  }
}
