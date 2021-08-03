import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];

  constructor() { }

  /**
   * Add a message to the list of messages.
   *
   * @param message
   * @return void
   */
  add(message: string): void {
    this.messages.push(message);
  }

  /**
   * Clear the list of messages.
   *
   * @return void
   */
  clear(): void {
    this.messages = [];
  }
}
