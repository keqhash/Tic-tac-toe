import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskRequirementsPageView } from './views/task-requirements/task-requirements.view';
import { HomePageView } from './views/homepage/homepage.view';

const routes: Routes = [
  { path: '', component: HomePageView },
  { path: 'task-requirements', component: TaskRequirementsPageView },
  { path: '**', component: HomePageView },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
