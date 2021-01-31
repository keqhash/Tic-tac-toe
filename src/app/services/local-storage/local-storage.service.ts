import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  isLocalStorageDefined(): boolean {
    return typeof localStorage !== 'undefined';
  }

  setItem(key: string, value: string) {
    if (this.isLocalStorageDefined()) {
      localStorage.setItem(key, value);
    }
  }

  removeItem(key: string) {
    if (this.isLocalStorageDefined()) {
      localStorage.removeItem(key);
    }
  }

  getItem(key: string): string {
    if (key && this.isLocalStorageDefined()) {
      return localStorage.getItem(key);
    }
  }

  getObjectItem(key: string): object {
    const item = this.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  }

  setObjectItem(key: string, obj: any) {
    this.setItem(key, JSON.stringify(obj));
  }

}
