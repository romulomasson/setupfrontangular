import { Injectable } from '@angular/core';
import { result } from 'lodash';
import { Observable, of } from 'rxjs';

@Injectable()
export class TokenStorage {
	/**
	 * Get access token
	 * @returns {Observable<string>}
	 */
	public getAccessToken(): Observable<string> {
		const token: string = <string>localStorage.getItem('accessToken');
		return of(token);
	}

	/**
	 * Get refresh token
	 * @returns {Observable<string>}
	 */
	public getRefreshToken(): Observable<string> {
		const token: string = <string>localStorage.getItem('refreshToken');
		return of(token);
	}

	/**
	 * Get user roles in JSON string
	 * @returns {Observable<any>}
	 */
	public getUserRoles(): Observable<any> {
		const roles: any = localStorage.getItem('userRoles');
		try {
			return of(JSON.parse(roles));
		} catch (e) {}
	}

	/**
	 * Set access token
	 * @returns {TokenStorage}
	 */
	public setAccessToken(token: string): TokenStorage {
		localStorage.setItem('accessToken', token);

		return this;
	}

	/**
	 * Set refresh token
	 * @returns {TokenStorage}
	 */
	public setRefreshToken(token: string): TokenStorage {
		localStorage.setItem('refreshToken', token);

		return this;
	}

	/**
	 * Set user roles
	 * @param roles
	 * @returns {TokenStorage}
	 */
	public setUserRoles(roles: any): any {
		var resultRoles = [];

		if (roles != null) {
			localStorage.setItem('userRoles', JSON.stringify(roles));
			resultRoles = roles;
		}

		localStorage.setItem('userRoles', JSON.stringify(["ADMIN"]));
		//localStorage.setItem('userRoles', JSON.stringify(["teste"]));
		return resultRoles; 
	}

	/**
	 * Set EmpresaID roles
	 * @param empresaId
	 * @returns {number}
	 */
	public setUserEmpresaId(empresaId: string): TokenStorage {
		if (empresaId != null) {
			localStorage.setItem('empresaId', empresaId);
		}
		return this;
	}
	
	public getUserEmpresaId(): string {
		const empresaId: string = localStorage.getItem('empresaId');
		return empresaId;
	}

	/**
	 * Remove tokens
	 */
	public clear() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userRoles');
	}
}
