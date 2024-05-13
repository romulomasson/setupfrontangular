import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Auth Services
import { AuthenticationService } from '../auth/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';
import { MENU } from 'src/app/layouts/sidebar/menu';
import { MenuItem } from 'src/app/layouts/sidebar/menu.model';
import { Store } from '@ngrx/store';
import { AuthenticationState } from 'src/app/store/Authentication/authentication.reducer';
import { getUserClaims, getisLoggedIn } from 'src/app/store/Authentication/authentication-selector';
import { combineLatest, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService,
        private store: Store<{ auth: AuthenticationState }>
    ) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let roles = this.getRolesByLink(state.url, MENU);
        return combineLatest([
            this.store.select(getUserClaims),
            this.store.select(getisLoggedIn)])
            .pipe(map(([claims, isLoggedIn]) => 
            {
                if(!isLoggedIn){
                    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
                    return false;
                } 
                
                if (isLoggedIn && (roles.length == 0 || !roles.includes(claims.usuario_tipo)) && claims.usuario_tipo != "Administrador"){
                    this.router.navigate(['/**']);
                    return false;
                }
                
                return true;
            }));


        // if (environment.defaultauth === 'firebase') {
        //     return true;
        // } else {
        //     const currentUser = this.authFackservice.currentUserValue;
        //     if (currentUser) {
        //         return true;
        //     }
        //     if (localStorage.getItem('currentUser')) {
        //         return true;
        //     }
        // }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    getRolesByLink(link: string, menuItems: MenuItem[]): string[] {
        for (const item of menuItems) {
            // Verifica se o item atual é o item procurado
            if (item.link === link) {
                return item.roles;
            }
            // Se o item atual tiver subitens, faz uma busca recursiva nos subitens
            if (item.subItems && item.subItems.length > 0) {
                const roles = this.getRolesByLink(link, item.subItems);
                if (roles.length > 0) {
                    return roles;
                }
            }
        }
        // Retorna um array vazio se não encontrar o link
        return [];
    }
}
