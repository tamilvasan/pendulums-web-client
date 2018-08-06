import { Component, OnInit }                        from '@angular/core';
import { AuthenticationService }            from '../../core/services/authentication.service';
import { Router }                           from '@angular/router';
import { Store }                            from '@ngrx/store';
import { AppState }                         from '../../shared/state/appState';
import { StatusActions }                    from '../../shared/state/status/status.actions';
import { SyncService }                      from '../../core/services/sync.service';

const EMAIL_REGEX = /^(?=.{8,64}$)[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.sass']
})

export class SignInComponent implements OnInit {
  errorMessage: string;
  authUser = {email: null, password: null};
  submitted = false;
  // this field is used just to handle coming soon text
  // todo: please delete this field and its usages and its css after google sign in implemented
  comingSoon = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private statusActions: StatusActions,
    private store: Store<AppState>,
    private syncService: SyncService
  ) {}

  ngOnInit() {
    const node = document.createElement('script');
    node.src = 'https://www.google.com/recaptcha/api.js';
    node.type = 'text/javascript';
    node.async = true;
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  signIn() {
    this.comingSoon = false;
    const gRecaptchaResponse = window['grecaptcha'].getResponse();
    if (!this.submitted) {
      this.submitted = true;
      this.errorMessage = null;
      if (this.validation(this.authUser)) {
        this.authUser.email = this.authUser.email.toLowerCase();
        this.authService.signIn(gRecaptchaResponse, this.authUser)
          .then(() => {
            this.removeRecaptchaFromDom();
            this.store.dispatch(this.statusActions.updateIsLogin(true));
            this.syncService.init();
            this.router.navigate(['dashboard']);
            this.submitted = false;
          })
          .catch(error => {
            this.submitted = false;
            window['grecaptcha'].reset();
            console.log('error is: ', error);
            if (error.status === 400) {
              if (JSON.parse(error.error).type === 1) {
                this.errorMessage = 'Please verify your email (the sent email may be in your spam folder).';
              } else if (JSON.parse(error.error).type === 0) {
                this.errorMessage = 'Email or password mismatch';
              } else if (JSON.parse(error.error).type === 3) {
                this.errorMessage = 'Please fill(Refill) reCpatcha';
              }
            } else {
              this.errorMessage = 'Server communication error';
            }
          });
      } else {
        this.submitted = false;
        window['grecaptcha'].reset();
      }
    }
  };

  signInWithGoogle() {
    // todo: please clear this code section after google sign in implemented
    this.errorMessage = null;
    this.comingSoon = true;
    console.log('coming soon.');
  }

  validation(authUser): boolean {
    if (!EMAIL_REGEX.test(authUser.email)) {
      this.errorMessage = 'please enter valid email address';
      return false;
    }
    if (!authUser.password
      || authUser.password.length < 6
      || authUser.password.length > 32) {
      this.errorMessage = 'please choose password with 6 to 32 characters ';
      return false;
    }
    return true;
  }

  removeRecaptchaFromDom() {
    const tags = document.getElementsByTagName('script');
    for (const tag of [].slice.call(tags)) {
      if (tag && tag.getAttribute('src') !== null &&
        tag.getAttribute('src').indexOf('recaptcha') !== -1) {
          tag.parentNode.removeChild(tag);
      }
    }
  }
}
