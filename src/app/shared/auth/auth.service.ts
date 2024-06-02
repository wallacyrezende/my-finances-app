import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    apiURL = environment.apiUrl;
    

    constructor(
        private http: HttpClient,
        private router: Router,
        private tokenStorage: TokenStorageService
    ) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Authorization': 'Basic ' + btoa(environment.clientId + ":" + environment.clientSecret)
        }),
    };

    login(email: string, password: string): Observable<Token> {
        let params = this.factoryParams(email, password);
        return this.http
            .post<Token>(
                environment.apiUrl + '/auth-server/oauth/token',
                params,
                this.httpOptions
            )
            .pipe(catchError(this.handleError));
    }

    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user')!);
        const isLoggedIn = localStorage.getItem('isLoggedin')!;
        return (user !== null) && (isLoggedIn != null) ;
    }

    logout() {
        localStorage.clear();
        this.tokenStorage.signOut()                                                           
        this.router.navigate(['login']);
    }

    private factoryParams(username: string, password: string): URLSearchParams {
        let params = new URLSearchParams();
        params.append('username',username);
        params.append('password',password);    
        params.append('grant_type','password');
        // params.append('client_id','applicationAngular');
        return params;
    }

    private handleError(error: any) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = error.error;
        }
        console.log(errorMessage);
        return throwError(() => {
            return errorMessage;
        });
    }
}

interface Token {
    access_token: string;
    expires_in: number;
    scope: string;
}