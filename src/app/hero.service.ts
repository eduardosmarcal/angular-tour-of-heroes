import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private heroesUrl: string = 'api/heroes';  // URL to web API

  /**
   * Constructor.
   *
   * @param http HttpClient
   * @param messageService MessageService
   */
  constructor(private http: HttpClient, private messageService: MessageService) { }

  /**
   * Get all Heroes.
   *
   * @return Observable<Hero[]>
   */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  /**
   * Get Hero by ID. Return `undefined` when ID not found
   * GET
   *
   * @param id number
   * @return Observable<Hero>
   */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;

    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id = ${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id = ${id}`))
      );
  }

  /**
   * Get a single Hero given its ID.
   * Will 404 if ID not found.
   *
   * @param id number
   * @return Observable<Hero>
   */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id = ${id}`)),
        catchError(this.handleError<Hero>(`getHero id = ${id}`))
      );
  }

  /**
   * Log a HeroService message with the MessageService
   *
   * @param message string
   * @return void
   */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation string - name of the operation that failed
   * @param result T - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /**
   * Add a new hero to the server
   * POST
   *
   * @param hero Hero
   * @return Observable<Hero>
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`added hero with id = ${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  /**
   * Update the hero on the server.
   * PUT
   *
   * @param hero Hero
   * @return Observable<any>
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id = ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  /**
   * Delete the hero from the server
   * DELETE
   *
   * @param id number
   * @return Observable<Hero>
   */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id = ${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  /**
   * Get Heroes whose name contains search term.
   * GET
   *
   * @param term string
   * @return Observable<Hero[]>
   */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(x => x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
        ),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }
}
