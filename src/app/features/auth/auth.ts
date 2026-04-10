import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule,
    MatIcon, MatError, MatFormFieldModule, MatInputModule, MatButtonModule,MatProgressSpinnerModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);

  isLoginMode = true;
  isLoading = false;
  hidePassword = true;

  authForm: FormGroup = this.fb.group({
    name: [''], 
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    const n = this.authForm.get('name');
    this.isLoginMode ? n?.clearValidators() : n?.setValidators([Validators.required]);
    n?.updateValueAndValidity();
    this.authForm.reset();
  }

  async onSubmit() {
    if (this.authForm.invalid) return;
    this.isLoading = true;
    const { email, password, name } = this.authForm.value;

    try {
      if (this.isLoginMode) await this.authService.login(email, password);
      else await this.authService.signup(email, password, name);

      setTimeout(() => {
        this.zone.run(() => {
          this.authService.currentUserProfile$.subscribe(profile => {
            if (profile?.role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (profile?.role === 'user') {
              this.router.navigate(['/profiles']); 
            }
            this.isLoading = false;
          });
        });
      }, 500);
    } catch (error) {
      console.error(error);
      this.zone.run(() => this.isLoading = false);
    }
}
}