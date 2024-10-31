import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResult } from '../../models/auth.model';
import { CompanyLoginDto } from '../../models/user-login.model';
import { CompanyRegisterDto } from '../../models/register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://appsystemrewards.somee.com/api/AuthCompany';

  constructor(private http: HttpClient) {}

  login(credentials: CompanyLoginDto): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.baseUrl}/login`, credentials);
  }

  register(userData: CompanyRegisterDto): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.baseUrl}/register`, userData);
  }

  // Guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
  }
}
