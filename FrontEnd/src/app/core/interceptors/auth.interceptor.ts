import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const user = authService.getCurrentUser();

    if (user && user.email) {
        // In a real app, this would be a token. 
        // For this practice, we optimize by simulated header or just logging.
        const clonedReq = req.clone({
            setHeaders: {
                'X-User-Email': user.email
            }
        });
        return next(clonedReq);
    }

    return next(req);
};
