import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:3000/api/auth';
    private currentUserKey = 'currentUser';

    private currentUserSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        console.log('AuthService initialized, current user:', this.currentUserSubject.value);
    }

    private getUserFromStorage(): any {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                if (response.user) {
                    localStorage.setItem(this.currentUserKey, JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.currentUserKey);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }
}
