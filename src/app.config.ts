import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInterceptor } from '@/interceptors/auth-interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StoreSettingsService } from '@/store-settings/store-settings.service';

const brandPrimary = {
    50: '#fdf4ed',
    100: '#fbe8d9',
    200: '#f5cbae',
    300: '#eea87c',
    400: '#e0793f',
    500: '#c2410c',
    600: '#9a3412',
    700: '#7c2d12',
    800: '#6c2e0f',
    900: '#57230a',
    950: '#2e1104'
};

const AppThemePreset = definePreset(Aura, {
    semantic: {
        primary: brandPrimary,
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.600}',
                    activeColor: '{primary.700}'
                }
            },
            dark: {
                primary: {
                    color: '{primary.400}',
                    contrastColor: '{primary.950}',
                    hoverColor: '{primary.300}',
                    activeColor: '{primary.200}'
                }
            }
        }
    }
});

export const appConfig: ApplicationConfig = {
    providers: [
    provideAnimations(),
    ConfirmationService,
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withInterceptors([authInterceptor])),
        MessageService,
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: AppThemePreset, options: { darkModeSelector: '.app-dark' } } }),
        provideAppInitializer(() => inject(StoreSettingsService).load())
    ]
};
