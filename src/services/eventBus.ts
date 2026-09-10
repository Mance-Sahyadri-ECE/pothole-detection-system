import { AppEvent, EventType } from '../types';

type EventCallback = (event: AppEvent) => void;

class EventBus {
  private listeners: Map<EventType | '*', Set<EventCallback>> = new Map();

  subscribe(type: EventType | '*', callback: EventCallback): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return un-subscribe function
    return () => {
      this.listeners.get(type)?.delete(callback);
    };
  }

  emit(type: EventType, payload: any) {
    const event: AppEvent = {
      type,
      payload,
      timestamp: new Date().toISOString()
    };

    // Notify specific type listeners
    if (this.listeners.has(type)) {
      this.listeners.get(type)!.forEach(cb => {
        try {
          cb(event);
        } catch (err) {
          console.error(`Error in event listener for ${type}:`, err);
        }
      });
    }

    // Notify wildcard listeners
    if (this.listeners.has('*')) {
      this.listeners.get('*')!.forEach(cb => {
        try {
          cb(event);
        } catch (err) {
          console.error(`Error in wildcard event listener:`, err);
        }
      });
    }
  }
}

export const eventBus = new EventBus();

export function subscribeToPotholeUpdates(callback: (event: AppEvent) => void): () => void {
  return eventBus.subscribe('*', callback);
}
