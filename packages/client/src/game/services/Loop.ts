import { Entity, Projectile, Tank } from '../entities';
import { LoopDelays, LoopIntervals } from '../typings';
import { EntityEvent } from './../typings';

export class Loop {
  loopTimeMs = 16;
  loopCount = 0;
  loopDelays: LoopDelays = {};
  loopIntervals: LoopIntervals = {};
  loopEntities: Set<Tank | Projectile> = new Set();
  active = false;
  lastTimestamp = 0;

  load() {
    this.start();
  }

  unload() {
    this.stop();
    this.reset();
  }

  reset() {
    this.clearLoopEntities();
    this.loopIntervals = {};
    this.clearLoopDelays();
  }

  start() {
    this.active = true;
    this.loop();
  }

  stop() {
    this.active = false;
  }

  add(entity: Entity) {
    this.registerTimerHandlers(entity);
    if (entity instanceof Tank) {
      this.loopEntities.add(entity);
    } else if (entity instanceof Projectile) {
      const tempLoopEntitiesArray = Array.from(this.loopEntities);
      tempLoopEntitiesArray.unshift(entity);
      this.loopEntities = new Set(tempLoopEntitiesArray);
    }
  }

  clearLoopEntities() {
    for (const entity of this.loopEntities) {
      entity.despawn();
    }
    this.loopEntities = new Set();
  }

  loop(timestamp = 0) {
    if (!this.active) {
      return;
    }

    if (timestamp) {
      const timeDifference = timestamp - this.lastTimestamp;
      if (timeDifference >= this.loopTimeMs) {
        ++this.loopCount;
        this.checkLoopDelays();
        this.checkLoopIntervals();
        for (const entity of this.loopEntities) {
          entity.update();
          if (entity.shouldBeDestroyed) {
            this.loopEntities.delete(entity);
          }
        }
        this.lastTimestamp = timestamp;
      }
    }

    requestAnimationFrame(this.loop.bind(this));
  }

  convertTimeToLoops(delay: number) {
    return Math.floor(delay / this.loopTimeMs);
  }

  /** Аналог setTimeout, который работает через игровой цикл. */
  setLoopDelay(callback: () => void, delay: number) {
    let loopMark = this.loopCount + this.convertTimeToLoops(delay);

    if (loopMark === this.loopCount) {
      ++loopMark; // реализация нулевой задержки
    }

    if (!this.loopDelays[loopMark]) {
      this.loopDelays[loopMark] = [];
    }

    this.loopDelays[loopMark].push(callback);
  }

  clearLoopDelays() {
    this.loopCount = 0;
    this.loopDelays = {};
  }

  /** Аналог setInterval, который работает через игровой цикл. */
  setLoopInterval(callback: () => void, delay: number, intervalName: string) {
    this.loopIntervals[intervalName] = {
      loopCounter: 0,
      targetLoop: this.convertTimeToLoops(delay),
      callback: callback,
    };

    return intervalName;
  }

  clearLoopInterval(intervalName: string) {
    if (intervalName in this.loopIntervals) {
      delete this.loopIntervals[intervalName];
    }
  }

  registerTimerHandlers(entity: Entity) {
    entity.on(EntityEvent.SET_LOOP_DELAY, this.setLoopDelay.bind(this));
    entity.on(EntityEvent.SET_LOOP_INTERVAL, this.setLoopInterval.bind(this));
    entity.on(EntityEvent.CLEAR_LOOP_INTERVAL, this.clearLoopInterval.bind(this));
  }

  checkLoopDelays() {
    if (this.loopDelays[this.loopCount]) {
      const delayedCallbacks = this.loopDelays[this.loopCount];
      for (const callback of delayedCallbacks) {
        callback();
      }
      delete this.loopDelays[this.loopCount];
    }
  }

  checkLoopIntervals() {
    Object.values(this.loopIntervals).forEach(interval => {
      if (interval.loopCounter === interval.targetLoop) {
        interval.callback();
        interval.loopCounter = 0;
        return;
      }
      interval.loopCounter++;
    });
  }
}
