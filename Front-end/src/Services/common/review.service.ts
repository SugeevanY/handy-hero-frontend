import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { map,Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private reviewUrl =  "https://localhost:7279/api/Review";

  constructor(private http: HttpClient) { }

  submitReview( ReviewerId: number, Email: string, ReviewText: string,TimeStamp: string,RatingValue: string): Observable<any> {
    const body = {  Email, ReviewerId,ReviewText ,TimeStamp,RatingValue};
    return this.http.post(`${this.reviewUrl}`, body);
  }


getAllReviews(): Observable<HttpResponse<any>> {
  return this.http.get<any[]>(`${this.reviewUrl}`, { observe: 'response' })
  .pipe(
    map(response => new HttpResponse({
      body: response.body,
      headers: response.headers,
      status: response.status,
      statusText: response.statusText
    }))
  );
}



}

@Injectable({
  providedIn: 'root'
})
export class FieldWorkerService {


}
