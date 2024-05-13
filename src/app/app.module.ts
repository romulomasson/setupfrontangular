import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// bootstrap component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ToastrModule } from 'ngx-toastr';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from './cyptolanding/shared/shared.module';

// Store
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
// Page Route
import { ExtrapagesModule } from './extrapages/extrapages.module';
import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initFirebaseBackend } from './authUtils';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Auth
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { rootReducer } from './store';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { AuthenticationModule } from './core/auth/authentication.module';
import { UtilsService } from './core/services/utils.service';
import { AppConfigService } from './core/services/app.config.service';
import { AppConfig } from './core/models/app.config';

import { FuncionarioService } from './core/services/funcionario.service';
import { FuncionarioCreditoService } from './core/services/funcionariocredito.service';
import { EmprestimoService } from './core/services/emprestimo.service';
import { metaReducers } from './store/Authentication/authentication.reducer';

if (environment.defaultauth === 'firebase') {
  initFirebaseBackend(environment.firebaseConfig);
} else {
  // tslint:disable-next-line: no-unused-expression
  FakeBackendInterceptor;
}

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export function initializerFn(jsonAppConfigService: AppConfigService) {
	return () => {
		return jsonAppConfigService.load();
	};
}

export function initializeApp(injector: Injector) {
  return () => {
    AppModule.injector = injector;
    // Coloque qualquer código de inicialização adicional aqui
    return Promise.resolve();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    CyptolandingComponent,
  ],
  imports: [
    AuthenticationModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    LayoutsModule,
    AppRoutingModule,
    ExtrapagesModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    SharedModule,
    ScrollToModule.forRoot(),
    SlickCarouselModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(rootReducer, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      AuthenticationEffects,
    ]),
  ],
  bootstrap: [AppComponent],
  providers: [
    FuncionarioService,
    FuncionarioCreditoService,
    EmprestimoService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [Injector]
    },
    AppConfigService,
		{
			provide: AppConfig,
			deps: [HttpClient],
			useExisting: AppConfigService
		},
    {
			provide: APP_INITIALIZER,
			deps: [AppConfigService],
			multi: true,
			useFactory: initializerFn
		},
    UtilsService
  ],
  
})



export class AppModule {
	static injector: Injector;
	constructor(injector: Injector) {
		AppModule.injector = injector;
	}
}