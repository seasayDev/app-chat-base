import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

export type WebSocketEvent = "notif";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private ws: WebSocket | null = null;
  private retryTimeout: any;

  constructor() {}

  public connect(): Observable<WebSocketEvent> {
    this.ws = new WebSocket(`${environment.wsUrl}/notifications`);
    const events = new Subject<WebSocketEvent>();

    this.ws.onopen = () => {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    };

    this.ws.onmessage = () => events.next("notif");

    this.ws.onclose = () => {
      if (!this.retryTimeout) {
        this.retryTimeout = setTimeout(() => this.connect(), 2000);
      }
      events.complete();
    };

    this.ws.onerror = () => {
      events.error("error");
      if (!this.retryTimeout) {
        this.retryTimeout = setTimeout(() => this.connect(), 2000);
      }
    };

    return events.asObservable();
  }

  public disconnect() {
    clearTimeout(this.retryTimeout);
    this.ws?.close();
    this.ws = null;
  }
}
