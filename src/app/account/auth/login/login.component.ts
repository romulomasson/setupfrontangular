import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/auth/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { login } from 'src/app/store/Authentication/authentication.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  returnUrl: string;
  fieldTextType!: boolean;
  // set the currenr year
  year: number = new Date().getFullYear();

  public model: any =
		{
			username: '',
			password: '',
			email: '',
			scope: 'portal offline_access',
			client_id: 'CrediteiApi',
			client_secret: '4532a3f2b670e434344345718aa8c14977',
			grant_type: 'password'
		};

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private store: Store,
    private authFackservice: AuthfakeauthenticationService) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/']);
    }
    // form validation
    this.loginForm = this.formBuilder.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {   

    const usuario = this.f['usuario'].value;
    const password = this.f['password'].value;
    this.store.dispatch(login({ usuario: usuario, password: password }));
  }

  /**
 * Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
