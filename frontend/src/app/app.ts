
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';

interface ServiceRequest {
  name: string;
  room: number;
  service: string;
  details: string;
}

interface ApiResponse {
  message?: string;
  id?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  name = '';
  room: number | null = null;
  service = 'Room Cleaning';
  details = '';
  message = '';
  loading = false;

  constructor(private http: HttpClient) {}

  submitRequest(): void {
    if (this.loading) return;

    if (
      !this.name.trim() ||
      this.room === null ||
      !Number.isFinite(Number(this.room)) ||
      Number(this.room) <= 0
    ) {
      this.message = 'Please enter your name and a valid room number.';
      return;
    }

    const requestData: ServiceRequest = {
      name: this.name.trim(),
      room: Number(this.room),
      service: this.service,
      details: this.details.trim()
    };

    this.loading = true;
    this.message = 'Submitting your request...';

    this.http.post<ApiResponse>(
      'http://localhost:3000/api/services',
      requestData
    ).pipe(
      timeout(10000)
    ).subscribe({
      next: (response) => {
        this.message =
          response.message ?? 'Service request submitted successfully!';

        this.name = '';
        this.room = null;
        this.service = 'Room Cleaning';
        this.details = '';
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Service request error:', error);

        this.message =
          error instanceof Error && error.name === 'TimeoutError'
            ? 'Response timed out. Check whether your request was saved.'
            : 'Request failed. Check the browser console.';

        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
