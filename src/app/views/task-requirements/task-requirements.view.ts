import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site/site.service';

@Component({
  selector: 'task-req-page',
  templateUrl: './task-requirements.view.html',
  styleUrls: ['./task-requirements.view.css'],
})
export class TaskRequirementsPageView implements OnInit {

  isDarkTheme: boolean;

  constructor(private siteService: SiteService) { }

  ngOnInit() {
    this.siteService.isDarkThemeEnabled().subscribe((data) => {
      this.isDarkTheme = Boolean(data);
    });
  }
}
