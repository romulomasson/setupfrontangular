import { BehaviorSubject, Observable, Subject, from, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';

import { AfterViewInit, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from 'ngx-auth';

import { TokenStorage } from './token-storage.service';
import { UtilsService } from '../services/utils.service';
import { AccessData } from './access-data';
import { Credential } from './credential';

import { environment } from "../../../environments/environment";
import { BaseService } from '../services/base.service';
import { AppModule } from "../../app.module";
import { AppConfigService } from '../services/app.config.service';
import { User } from 'src/app/store/Authentication/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends BaseService implements AuthService {
	API_URL =  '';
	API_ENDPOINT_LOGIN = 'connect/token';
	API_ENDPOINT_REFRESH = 'refresh';
	API_ENDPOINT_REGISTER = 'register';
    public credential: Credential;
	public onCredentialUpdated$: Subject<AccessData>;
    private currentUserSubject: BehaviorSubject<User>;

	constructor(
		private http: HttpClient,
		private tokenStorage: TokenStorage,
		private util: UtilsService
	) {
		super('/');
		this.onCredentialUpdated$ = new Subject();
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
	}

	/**
	 * Check, if user already authorized.
	 * @description Should return Observable with true or false values
	 * @returns {Observable<boolean>}
	 * @memberOf AuthService
	 */
	public isAuthorized(): Observable<boolean> {
		return this.tokenStorage.getAccessToken().pipe(map(token => !!token));
	}

	/**
	 * Get access token
	 * @description Should return access token in Observable from e.g. localStorage
	 * @returns {Observable<string>}
	 */
	public getAccessToken(): Observable<string> {
		return this.tokenStorage.getAccessToken();
	}

	/**
	 * Get user roles
	 * @returns {Observable<any>}
	 */
	public getUserRoles(): Observable<any> {
		return this.tokenStorage.getUserRoles();
	}

	public async isAdmin(): Promise<boolean>{
		var roles = await this.getUserRoles().toPromise();
		return roles.includes('Administrador');
	}

	/**
	 * Function, that should perform refresh token verifyTokenRequest
	 * @description Should be successfully completed so interceptor
	 * can execute pending requests or retry original one
	 * @returns {Observable<any>}
	 */
	public refreshToken(): Observable<AccessData> {
		return this.tokenStorage.getRefreshToken().pipe(
			switchMap((refreshToken: string) => {
				return this.http.get<AccessData>(this._config.baseUrl + this.API_ENDPOINT_REFRESH + '?' + this.util.urlParam(refreshToken));
			}),
			tap(this.saveAccessData.bind(this)),
			catchError(err => {
				this.logout();
				return throwError(err);
			})
		);
	}

	/**
	 * Function, checks response of failed request to determine,
	 * whether token be refreshed or not.
	 * @description Essentialy checks status
	 * @param {Response} response
	 * @returns {boolean}
	 */
	public refreshShouldHappen(response: HttpErrorResponse): boolean {
		return response.status === 401;
	}

	/**
	 * Verify that outgoing request is refresh-token,
	 * so interceptor won't intercept this request
	 * @param {string} url
	 * @returns {boolean}
	 */
	public verifyTokenRequest(url: string): boolean {
		return url.endsWith(this.API_ENDPOINT_REFRESH);
	}

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
   
	 /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
	public login(usuario: string, password: string): Observable<any> {
        this.model.username = usuario;
        this.model.password = password;
        this.credential = this.model;
        this._http = AppModule.injector.get(HttpClient);
		// this._router = AppModule.injector.get(Router);
		this._config = AppModule.injector.get(AppConfigService);
		// Expecting response from API
		// {"id":1,"username":"admin","password":"demo","email":"admin@demo.com","accessToken":"access-token-0.022563452858263444","refreshToken":"access-token-0.9348573301432961","roles":["ADMIN"],"pic":"./assets/app/media/img/users/user4.jpg","fullname":"Mark Andre"}

		const httpOptions = {
			headers: new HttpHeaders({
			  'Content-Type':  'application/x-www-form-urlencoded'
			})
		  };
          return this.http.post<AccessData>(this._config.baseUrl  +'/'+ this.API_ENDPOINT_LOGIN , this.util.urlParam(this.credential), httpOptions)
          .pipe(map((user: any) => {
				if (user instanceof Array) {
					return user.pop();
				}
                this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
                localStorage.setItem('currentUser', JSON.stringify(user));
				return user;
			}),
			tap(
				this.saveAccessData.bind(this)
			),
			catchError(
				this.handleError('login', [])
			)
		);
	}

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T>(operation = 'operation', result?: any) {
		return (error: any): Observable<any> => {
			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// Let the app keep running by returning an empty result.
			return from(result);
		};
	}

	/**
	 * Logout
	 */
	public logout(refresh?: boolean): void {
		this.tokenStorage.clear();
		if (refresh) {
			location.reload();
		}
	}

	/**
	 * Save access data in the storage
	 * @private
	 * @param {AccessData} data
	 */
	private saveAccessData(accessData: AccessData) {
		if (typeof accessData !== 'undefined') {
			this.tokenStorage
			    .setUserEmpresaId(accessData.empresaId)
				.setAccessToken(accessData.access_token)
				.setRefreshToken(accessData.refresh_token)
				.setUserRoles(accessData.roles);
				//.setUserEmpresaId(accessData.empresaId);

			this.onCredentialUpdated$.next(accessData);
		}
	}

	/**
	 * Submit registration request
	 * @param {Credential} credential
	 * @returns {Observable<any>}
	 */
	public register(credential: Credential): Observable<any> {
		// dummy token creation
		credential = Object.assign({}, credential, {
			accessToken: 'access-token-' + Math.random(),
			refreshToken: 'access-token-' + Math.random(),
			roles: ['USER'],
		});
		return this.http.post(this._config.baseUrl + this.API_ENDPOINT_REGISTER, credential)
			.pipe(catchError(this.handleError('register', []))
		);
	}

	/**
	 * Submit forgot password request
	 * @param {Credential} credential
	 * @returns {Observable<any>}
	 */
	public requestPassword(credential: Credential): Observable<any> {
		return this.http.get(this._config.baseUrl + this.API_ENDPOINT_LOGIN + '?' + this.util.urlParam(credential))
			.pipe(catchError(this.handleError('forgot-password', []))
		);
	}

}
