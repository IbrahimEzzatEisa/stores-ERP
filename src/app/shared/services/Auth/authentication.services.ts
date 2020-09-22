import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

declare var require;
var jwtDecode = require("jwt-decode");

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private loggedIn;
    private expirationTimeout;

    constructor(
        private router: Router, private route: ActivatedRoute
        ) { 
        this.refreshLoginStatus();
    }

    private setSessionExpirationNotification(remainingTimeMs) {
        if(this.expirationTimeout) {
            clearTimeout(this.expirationTimeout);
        }
        this.expirationTimeout = setTimeout(() => {
            this.redirectToLogin(this.route.snapshot['_routerState'].url, 'انتهت صلاحية الجلسة قم بتسجيل الدخول للمتابعة');
        }, remainingTimeMs);
    }

    public getLoginStatus() {
        if(!localStorage.getItem('token'))
            return false;
        try {
            let token = localStorage.getItem('token');
            let decodedToken = jwtDecode(token);
            let expDate = Number.parseInt(decodedToken.exp)*1000;
            let today = new Date().valueOf();
            if(expDate > today) {
                this.setSessionExpirationNotification(expDate - today);
                return true;
            }
        } catch (err) {
            return false;
        }
        return false;
    } 

    public refreshLoginStatus() {
        if(!this.loggedIn) {
            this.loggedIn = new BehaviorSubject(this.getLoginStatus());
        } else {
            this.loggedIn.next(this.getLoginStatus());
        }
    }

    public isLoggedIn() {
        this.refreshLoginStatus();
        return this.loggedIn.asObservable();
    }

    public getStoredUserId() {
        if(!localStorage.getItem('token'))
            return null;
        try {
            let token = localStorage.getItem('token');
            let decodedToken = jwtDecode(token);
            return decodedToken.nameid;
        } catch (err) {
            return null;
        }
    }

    public getLoggedUserName() {
        if(!localStorage.getItem('token'))
            return null;
        try {
            let token = localStorage.getItem('token');
            let decodedToken = jwtDecode(token);
            return decodedToken.unique_name;
        } catch (err) {
            return null;
        }
    }
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('session_items_year'); 
        this.router.navigate(['/login']);
    }

    public redirectToLogin(path, msg) {
        this.router.navigate(['/login'], {
            queryParams: {
                redirect: path,
                redirectMessage: msg
            }
        })
    }

}