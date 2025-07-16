import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  harshify(length: number, limits: | 'all'
    | 'letters'
    | 'numbers'
    | 'letters&&numbers'
    | 'symbols'
    | 'letters&&symbols'
    | 'numbers&&symbols' = 'all'): string {
    const allChars = {
      letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+[]{}|;:,.<>? -/=´¨¡¿°'
    };
    let result = '';
    let characters: string;
    switch (limits) {
      case 'all':
        characters = allChars.letters + allChars.numbers + allChars.symbols;
        break;
      case 'letters':
        characters = allChars.letters;
        break;
      case 'numbers':
        characters = allChars.numbers;
        break;
      case 'letters&&numbers':
        characters = allChars.letters + allChars.numbers;
        break;
      case 'symbols':
        characters = allChars.symbols;
        break;
      case 'letters&&symbols':
        characters = allChars.letters + allChars.symbols;
        break;
      case 'numbers&&symbols':
        characters = allChars.numbers + allChars.symbols;
        break;
      default:
        characters = '';
        break;
    }

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;

  }
}
