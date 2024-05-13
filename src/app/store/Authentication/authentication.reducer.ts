import { ActionReducer, MetaReducer, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Register, RegisterFailure, RegisterSuccess, login, loginFailure, loginSuccess, logout } from './authentication.actions';
import { User } from './auth.models';
import { localStorageSync } from 'ngrx-store-localstorage';

export interface AuthenticationState {
    isLoggedIn: boolean;
    user: User | null;
    claims: any | null;
    error: string | null;
}

const initialState: AuthenticationState = {
    isLoggedIn: false,
    user: null,
    claims: null,
    error: null,
};

export const authenticationReducer = createReducer(
    initialState,
    on(Register, (state) => ({ ...state, error: null })),
    on(RegisterSuccess, (state, { user }) => ({ ...state, isLoggedIn: true, user, error: null, })),
    on(RegisterFailure, (state, { error }) => ({ ...state, error })),

    on(login, (state) => ({ ...state, error: null })),
    on(loginSuccess, (state, { user, claims }) => ({...state, isLoggedIn: true, user, error: null, claims})),
    on(loginFailure, (state, { error }) => ({ ...state, error })),
    on(logout, (state) => ({ ...state, user: null })),
);

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({
      keys: ['auth'],
      rehydrate: true,
    })(reducer)
}
  
  export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];