import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap, first } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { AuthenticationService } from '../../core/auth/auth.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register, RegisterSuccess, RegisterFailure } from './authentication.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { UserProfileService } from 'src/app/core/services/user.service';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthenticationEffects {
  
  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private AuthfakeService: AuthfakeauthenticationService,
    private userService: UserProfileService,
    private router: Router) { }

  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, username, password }) => {
        if (environment.defaultauth === 'fakebackend') {
          return this.userService.register({ email, username, password }).pipe(
            map((user) => {
              this.router.navigate(['/auth/login']);
              return RegisterSuccess({ user })
            }),
            catchError((error) => of(RegisterFailure({ error })))
          );
        } else {
          // return this.AuthenticationService.register({ email, username, password }).pipe(
          //   map((user) => {
          //     this.router.navigate(['/auth/login']);
          //     return RegisterSuccess({ user })
          //   })
          // )
        }
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ usuario, password }) => {        
        return this.AuthenticationService.login(usuario, password).pipe(map((user) => {
          const claims = jwtDecode<any>(user.access_token);
          if(claims.usuario_tipo == "Funcionario")
            this.router.navigate(['/emprestimo/simular']);
          else
            this.router.navigate(['/']);
          return loginSuccess({ user, claims });
        }))
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );


}