import { Entity, Projectile, Tank } from '../entities';
import { LoopDelays, LoopIntervals } from '../typings';
import { EntityEvent } from './../typings';

export class Loop {
  loopProcess: ReturnType<typeof setTimeout> | null = null;
  loopTimeMs = 25;
  loopCount = 0;
  loopDelays: LoopDelays = {};
  loopIntervals: LoopIntervals = {};
  loopEntities: Set<Tank | Projectile> = new Set();

  load() {
    this.start();
  }

  unload() {
    this.clearLoopEntities();
    this.clearLoopDelays();
    this.stop();
  }

  reset() {
    this.clearLoopEntities();
    this.loopIntervals = {};
    this.clearLoopDelays();
  }

  start() {
    this.stop();
    this.loop();
  }

  stop() {
    if (this.loopProcess) {
      clearTimeout(this.loopProcess);
      this.loopProcess = null;
    }
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

  loop() {
    const cycleStartTime = performance.now();
    let nextCycleDelay = this.loopTimeMs;
    ++this.loopCount;
    this.checkLoopDelays();
    this.checkLoopIntervals();
    for (const entity of this.loopEntities) {
      entity.update();
      if (entity.shouldBeDestroyed) {
        this.loopEntities.delete(entity);
      }
    }
    nextCycleDelay -= cycleStartTime - performance.now();
    if (nextCycleDelay < 0) {
      nextCycleDelay = 0;
    }

    this.loopProcess = setTimeout(this.loop.bind(this), nextCycleDelay);
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
