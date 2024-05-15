import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AccessOnlyFromHomepage } from './utils/route-guards/access-only-from-homepage.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'add',
    component: AddUserComponent,
    canActivate: [AccessOnlyFromHomepage],
  },
  {
    path: 'edit/:id',
    component: EditUserComponent,
    canActivate: [AccessOnlyFromHomepage],
    data: {
      showFooter: false,
    },
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
