import { Component } from '@angular/core';
import { FirebaseLoginService } from '../../firebase_LogIn/firebase-login.service';
import { GuestService } from '../../modules/guest.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Channel } from '../../modules/database.model';
import { DatabaseServiceService } from '../../database-service.service';
import { Router, RouterModule } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { CurrentUserService } from '../../modules/current-user.service';
import { Auth } from '@angular/fire/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserService } from '../../service/user.service/user.service';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
import { AnimatedHeaderComponent } from '../../animated-header/animated-header.component';
@Component({
  selector: 'app-startpage',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    RouterModule,
    FooterComponent,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AnimatedHeaderComponent,
  ],
  templateUrl: './startpage.component.html',
  styleUrl: './startpage.component.scss',
})
export class StartpageComponent {
  mail: string = '';
  password: string = '';
  displayWrongMailOrPasswordError: boolean = false;
  onlineUser: any = null;
  officeTeamChannel!: Channel;
  constructor(
    private fb: FormBuilder,
    private firebase: FirebaseLoginService,
    private guestService: GuestService,
    private databaseService: DatabaseServiceService,
    private router: Router,
    private userService: UserService,
    private firestore: Firestore,
    private auth: Auth,
    private currentUserService: CurrentUserService
  ) {}

  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]], //Email validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password validation
    });

    this.currentUserService.onlineUser$.subscribe(user => {
      this.onlineUser = user;
    });

    this.databaseService.officeTeam().subscribe(team => {
      this.officeTeamChannel = team;
    });
  }

  private googleProvider = new GoogleAuthProvider();

  /**
   * This function checks, if there is a account of the user. If yes the user will be logged in and will be send to the desktop-page
   */
  async login() {
    if (this.loginForm.invalid) {
      this.displayWrongMailOrPasswordErrorMessage();
      return;
    }

    try {
      const { mail, password } = this.loginForm.value;
      const userCredential = await signInWithEmailAndPassword(this.auth, mail, password);
      await this.createNewUserObject(userCredential);
      this.sendUserToDesktop(userCredential);
      await this.setVarOnlineToTrue(userCredential);
    } catch (error) {
      this.displayWrongMailOrPasswordErrorMessage();
      this.resetInputs();
    }
  }

  get mailError() {
    const control = this.loginForm.get('mail');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control?.hasError('required')) return 'E-Mail wird benötigt';
      if (control?.hasError('email')) return 'Ungültige E-Mail-Adresse';
    }
    return null;
  }

  get passwordError() {
    const control = this.loginForm.get('password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control?.hasError('required')) return 'Passwort wird benötigt';
      if (control?.hasError('minlength')) return 'Passwort muss mindestens 6 Zeichen lang sein';
    }
    return null;
  }

  /**
   * This function sets a user in the userService for other components to get the data
   * @param userCredential user data
   */
  async createNewUserObject(userCredential: any) {
    let userRef = this.firebase.getSingleUserRef('users', userCredential.user.uid);
    const userSnapshot = await getDoc(userRef);
    let user = userSnapshot.data();
    this.userService.setUser(user);
  }

  /**
   * This function sets the Var "online" in firebase to true
   * @param userCredential User - object
   */
  async setVarOnlineToTrue(userCredential: any) {
    await updateDoc(this.firebase.getSingleUserRef('users', userCredential.user.uid), {
      online: true,
    });
  }

  /**
   * This function resets all input-tags on the login-screen
   */
  resetInputs() {
    this.mail = '';
    this.password = '';
  }

  /**
   * This function changes the value for displayWrongMailOrPasswordError-Variable from false to true for 2 seconds, sothat an Error will be displayed for this time
   */
  displayWrongMailOrPasswordErrorMessage() {
    this.displayWrongMailOrPasswordError = true;
    setTimeout(() => {
      this.displayWrongMailOrPasswordError = false;
    }, 2000);
  }

  /**
   * This function sends the user to the desktop-Page
   * @param userCredential User - object
   */
  sendUserToDesktop(userCredential: any) {
    const user = userCredential.user;
    this.router.navigate(['/desktop', user.uid]);
  }

  /**
   * This function saves a user in the firebase authenticator after loggin in via google
   */
  async googleLogin() {
    try {
      const userCredential = await signInWithPopup(this.auth, this.googleProvider);
      await this.saveUserData(userCredential.user);
      this.sendUserToDesktop(userCredential);
    } catch (error) {
      console.error('Fehler bei der Google-Anmeldung:', error);
      this.displayWrongMailOrPasswordErrorMessage();
    }
  }

  /**
   * This function saves the user-data in the firebase database, after logging in via google
   * @param user user - data
   */
  async saveUserData(user: any) {
    const userRef = doc(this.firestore, 'users', user.uid);
    await setDoc(
      userRef,
      {
        name: user.displayName,
        email: user.email,
        id: user.uid,
        avatar: 'assets/img/profiles/google_avatar.svg', //user.photoURL
        online: true,
      },
      { merge: true }
    );
  }

  async createDefaultChannel() {
    let channelData = {
      channel_name: 'office-team',
      admin: 'unknown',
    };
    let defaultChannel = new Channel(channelData);
    let channelObject = defaultChannel.toObject();
    this.databaseService.addChannel(channelObject);
    return channelObject.channel_id;
  }

  async onGuestLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.guestService.guestData.email, this.guestService.guestData.password);
      await this.createNewUserObject(userCredential);
      this.sendUserToDesktop(userCredential);
      await this.setVarOnlineToTrue(userCredential);
    } catch (error) {
      this.displayWrongMailOrPasswordErrorMessage();
      this.resetInputs();
    }
  }
}
