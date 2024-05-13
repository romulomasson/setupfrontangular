import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Register, login } from 'src/app/store/Authentication/authentication.actions';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { AuthenticationService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-funcionario-login',
  templateUrl: './funcionario-login.component.html',
  styleUrls: ['./funcionario-login.component.scss']
})
export class FuncionarioLoginComponent implements OnInit {

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
  constructor(private formBuilder: UntypedFormBuilder,
    private router: Router, 
    private authenticationService: AuthenticationService, 
    private store: Store) { }

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
   

    const usuario = this.f['usuario'].value; // Get the username from the form
    const password = this.f['password'].value; // Get the password from the form
   
    this.authenticationService.login(usuario, password)
    .subscribe({
      next: response => {
        if (typeof response !== 'undefined') {
          this.submitted = true;
          this.store.dispatch(login({ usuario: usuario, password: password }));
        } else {
          // this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'error');
        }
      },
      error: error => {
        // this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'error');

        // this.cdr.detectChanges();
      },
      complete: () => {
        // lógica para conclusão
      }
    });
  }

  /**
 * Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
