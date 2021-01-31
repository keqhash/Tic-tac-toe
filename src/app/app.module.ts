import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { HomeFormComponent } from './components/home-form/home-form.component';
import { HomePageView } from './views/homepage/homepage.view';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { SiteInitializer } from './initializers/site.initializer';
import { CommonModule } from '@angular/common';
import { ResultBoardComponent } from './components/result-board/result-board.component';
import { TaskRequirementsPageView } from './views/task-requirements/task-requirements.view';


export function initSite(siteInitializer: SiteInitializer) {
	return () => siteInitializer.initialize();
}

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      FooterComponent,
      HomePageView,
      HomeFormComponent,
      BoardComponent,
      ResultBoardComponent,
      TaskRequirementsPageView
   ],
   imports: [
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      AppRoutingModule,
      CommonModule,
      BrowserAnimationsModule
   ],
   providers: [
      CookieService,
      LocalStorageService,
      {
			provide: APP_INITIALIZER,
			useFactory: initSite,
			deps: [SiteInitializer],
			multi: true
      },
      SiteInitializer,
   ],
   bootstrap: [
      AppComponent
   ]
})

export class AppModule { }
