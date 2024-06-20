import { BEC } from "../constants.js";

class AchievementTimer {
  constructor(isRealTime) {
    this.time = BEC.D0;
    this.realTime = isRealTime;
  }

  reset() {
    this.time = BEC.D0;
  }

  advance() {
    const addedTime = this.realTime
      ? Time.unscaledDeltaTime.totalSeconds
      : Time.deltaTime;
    this.time = this.time.plus(addedTime);
  }

  check(condition, duration) {
    if (!condition) {
      this.reset();
      return false;
    }
    this.advance();
    return this.time.gte(duration);
  }
}

export const AchievementTimers = {
  marathon1: new AchievementTimer(false),
  marathon2: new AchievementTimer(false),
  pain: new AchievementTimer(true),
  stats: new AchievementTimer(true)
};
