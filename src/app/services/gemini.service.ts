import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  private apiKey = '***'; // Replace with your actual API key

  constructor(private http: HttpClient) {
  }

  generateContent(text?: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-goog-api-key': this.apiKey
    });

    const body = {
      contents: [
        {
          parts: [
            {text: `Summarize and design the following text in HTML and CSS with a beautiful and responsive layout: ${text}`}
          ]
        }
      ]
    };

    return this.http.post(this.apiUrl + '?key=' + this.apiKey, body, {headers});
  }
}
