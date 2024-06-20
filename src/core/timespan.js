window.TimeSpan = class TimeSpan {
  /**
   * @param {BE} value
   * @returns {TimeSpan}
   */
  static fromYears(value) {
    return new TimeSpan(new BE(value).times(31536e6));
  }

  /**
   * @param {BE} value
   * @returns {TimeSpan}
   */
  static fromDays(value) {
    return new TimeSpan(new BE(value).times(864e5));
  }

  /**
   * @param {BE} value
   * @returns {TimeSpan}
   */
  static fromHours(value) {
    return new TimeSpan(new BE(value).times(36e5));
  }

  /**
   * @param {BE} value
   * @returns {TimeSpan}
   */
  static fromMinutes(value) {
    return new TimeSpan(new BE(value).times(6e4));
  }

  /**
   * @param {BE} value
   * @returns {TimeSpan}
   */
  static fromSeconds(value) {
    return new TimeSpan(new BE(value).times(1e3));
  }

  /**
   * @param {BE} value
   * @returns {TimeSpan}
   */
  static fromMilliseconds(value) {
    return new TimeSpan(new BE(value));
  }

  /**
   * @param {BE} ms
   */
  constructor(ms) {
    Guard.isBE(ms, "Value 'ms' must be a BE");
    this._ms = ms;
  }

  /**
   * @param {TimeSpan} other
   */
  copyFrom(other) {
    Guard.isTimeSpan(other);
    this._ms = other._ms;
  }

  /**
   * @param {BE} ms
   */
  setFrom(ms) {
    this._ms = BE.fromBE(ms);
  }

  /**
   * @returns {BE}
   */
  get years() {
    return BE.floor(this.totalYears);
  }

  /**
   * @returns {BE}
   */
  get days() {
    return BE.floor(this.totalDays.sub(this.totalDays.div(365).floor().times(365)));
  }

  /**
   * @returns {BE}
   */
  get hours() {
    return BE.floor(this.totalHours.sub(this.totalHours.div(24).floor().times(24)));
  }

  /**
   * @returns {BE}
   */
  get minutes() {
    return BE.floor(this.totalMinutes.sub(this.totalMinutes.div(60).floor().times(60)));
  }

  /**
   * @returns {BE}
   */
  get seconds() {
    return BE.floor(this.totalSeconds.sub(this.totalSeconds.div(60).floor().times(60)));
  }

  /**
   * @returns {BE}
   */
  get milliseconds() {
    return BE.floor(this.totalMilliseconds.sub(this.totalMilliseconds.div(1e3).floor().times(1e3)));
  }

  /**
   * @returns {BE}
   */
  get totalYears() {
    return this._ms.div(31536e6);
  }

  /**
   * @returns {BE}
   */
  get totalDays() {
    return this._ms.div(864e5);
  }

  /**
   * @returns {BE}
   */
  get totalHours() {
    return this._ms.div(36e5);
  }

  /**
   * @returns {BE}
   */
  get totalMinutes() {
    return this._ms.div(6e4);
  }

  /**
   * @returns {BE}
   */
  get totalSeconds() {
    return this._ms.div(1e3);
  }

  /**
   * @returns {BE}
   */
  get totalMilliseconds() {
    return this._ms;
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  plus(other) {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms.add(other._ms));
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  minus(other) {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms.sub(other._ms));
  }

  /**
   * @param {BE} other
   * @returns {TimeSpan}
   */
  times(other) {
    Guard.isBE(other);
    return new TimeSpan(this._ms.times(other));
  }

  /**
   * @param {BE} other
   * @returns {TimeSpan}
   */
  dividedBy(other) {
    Guard.isBE(other);
    return new TimeSpan(this._ms.div(other));
  }

  /**
   * @returns {String}
   */
  toString() {
    if (this.years.gt(1e6)) {
      return `${format(this.totalYears, 3, 0)} years`;
    }
    if (this.totalSeconds.gte(10)) {
      return this.toStringNoBEs();
    }
    return this.toStringShort();
  }

  /**
   * @returns {String}
   */
  toStringNoBEs() {
    const parts = [];
    function addCheckedComponent(value, name) {
      if (value.eq(0)) {
        return;
      }
      addComponent(value, name);
    }
    function addComponent(value, name) {
      parts.push(value.eq(1) ? `${formatInt(value)} ${name}` : `${formatInt(value)} ${name}s`);
    }
    addCheckedComponent(this.years, "year");
    addCheckedComponent(this.days, "day");
    addCheckedComponent(this.hours, "hour");
    addCheckedComponent(this.minutes, "minute");
    addCheckedComponent(this.seconds, "second");
    // Join with commas and 'and' in the end.
    if (parts.length === 0) return `${formatInt(0)} seconds`;
    return [parts.slice(0, -1).join(", "), parts.slice(-1)[0]].join(parts.length < 2 ? "" : " and ");
  }

  /**
   * Note: For speedruns, we give 3 digits of hours on HMS formatting, a BE point on seconds, and
   *  suppress END formatting on the speedrun record tabs
   * @param {boolean} useHMS If true, will display times as HH:MM:SS in between a minute and 100 hours.
   * @returns {String}
   */
  toStringShort(useHMS = true, isSpeedrun = false) {
    // Probably not worth the trouble of importing the isEND function from formatting since this accomplishes the same
    // thing; we do however need this to prevent strings like "02:32" from showing up though
    if (format(0) === "END" && !isSpeedrun) return "END";

    const totalSeconds = this.totalSeconds;
    if (totalSeconds.gt(5e-7) && totalSeconds.lt(1e-3)) {
      // This conditional happens when when the time is less than 1 millisecond
      // but big enough not to round to 0 with 3 BE places (so showing BE places
      // won't just show 0 and waste space).
      return `${format(totalSeconds.times(1000), 0, 3)} ms`;
    }
    if (totalSeconds.lt(1)) {
      // This catches all the cases when totalSeconds is less than 1 but not
      // between 5e-7 and 1e-3. This includes two types of cases:
      // (1) those less than or equal to 5e-7, which most notations will format as 0
      // (the most notable case of this kind is 0 itself).
      // (2) those greater than or equal to 1e-3, which will be formatted with default settings
      // (for most notations, rounding to the nearest integer number of milliseconds)
      return `${format(totalSeconds.times(1000))} ms`;
    }
    if (totalSeconds.lt(10)) {
      return `${format(totalSeconds, 0, 3)} seconds`;
    }
    if (totalSeconds.lt(60)) {
      return `${format(totalSeconds, 0, 2)} seconds`;
    }
    if (this.totalHours.lt(100) || (isSpeedrun && this.totalHours.lt(1000))) {
      if (useHMS && !Notations.current.isPainful) {
        const sec = seconds(this.seconds, this.milliseconds);
        if (BE.floor(this.totalHours).eq(0)) return `${formatHMS(this.minutes)}:${sec}`;
        return `${formatHMS(BE.floor(this.totalHours))}:${formatHMS(this.minutes)}:${sec}`;
      }
      if (this.totalMinutes.lt(60)) {
        return `${format(this.totalMinutes, 0, 2)} minutes`;
      }
      if (this.totalHours.lt(24)) {
        return `${format(this.totalHours, 0, 2)} hours`;
      }
    }
    if (this.totalDays.lt(500)) {
      return `${isSpeedrun ? this.totalDays.toFixed(2) : format(this.totalDays, 0, 2)} days`;
    }
    return `${isSpeedrun ? this.totalYears.toFixed(3) : format(this.totalYears, 3, 2)} years`;

    function formatHMS(value) {
      const s = value.toString();
      return s.length === 1 ? `0${s}` : s;
    }

    function seconds(s, ms) {
      const sec = formatHMS(s);
      return isSpeedrun ? `${sec}.${Math.floor(ms.div(100))}` : sec;
    }
  }

  toTimeEstimate() {
    const seconds = this.totalSeconds;
    if (seconds.lt(1)) return `< ${formatInt(1)} second`;
    if (seconds.gt(86400 * 365.25)) return `> ${formatInt(1)} year`;
    return this.toStringShort();
  }

  static get zero() {
    return new TimeSpan(BE.dZero);
  }

  static get maxValue() {
    return new TimeSpan(BE.MAX_VALUE);
  }

  static get minValue() {
    return new TimeSpan(new BE(1).div(BE.MAX_VALUE));
  }
};

const Guard = {
  isDefined(value, message) {
    if (value !== undefined) return;
    if (message) throw message;
    throw "Value is defined";
  },
  isBE(value, message) {
    if (value instanceof BE) return;
    if (message) throw message;
    console.log("[TimeSpan Error]", value);
    throw "Value is not a BE";
  },
  isTimeSpan(value, message) {
    if (value instanceof TimeSpan) return;
    if (message) throw message;
    throw "Value is not a TimeSpan";
  }
};
