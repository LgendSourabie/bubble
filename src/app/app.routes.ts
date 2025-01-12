import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { NewPassword2Component } from './new-password2/new-password2.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { MainComponentComponent } from './main-component/main-component.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'sign-up', component: SignInComponent },
  { path: 'avatar/:id', component: ChooseAvatarComponent },
  { path: 'reset-password', component: NewPasswordComponent },
  { path: 'reset-password-link', component: NewPassword2Component },
  { path: 'desktop/:id', component: MainComponentComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacypolicyComponent },
];
