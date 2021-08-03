import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];

  /**
   * Constructor.
   *
   * @param heroService HeroService
   */
  constructor(private heroService: HeroService) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  /**
   * Get the list of Heroes from the HeroService.
   *
   * @return void
   */
  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  /**
   * Add a new Hero.
   *
   * @param name string
   * @return void
   */
  add(name: string): void {
    name = name.trim();

    if (!name) {
      return;
    }

    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => this.heroes.push(hero));
  }

  /**
   * Delete a Hero.
   *
   * @param hero Hero
   * @return void
   */
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
