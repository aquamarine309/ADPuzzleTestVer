import { BEC } from "../constants.js";

export const Effects = {
  /**
   * @param effectSources
   * @return {Number}
   */
  sum(...effectSources) {
    let result = BEC.D0;
    applyEffectsOf(effectSources, v => result = result.plus(v));
    return result;
  },
  /**
   * @param effectSources
   * @return {Number}
   */
  product(...effectSources) {
    let result = BEC.D1;
    applyEffectsOf(effectSources, v => result = result.times(v));
    return result;
  },
  /**
   * @param {Number} defaultValue
   * @param effectSources
   * @return {Number}
   */
  last(defaultValue, ...effectSources) {
    let result = defaultValue;
    let foundLast = false;
    const reversedSources = effectSources
      .filter(s => s !== null && s !== undefined)
      .reverse();
    const reducer = v => {
      result = v;
      foundLast = true;
    };
    for (const effectSource of reversedSources) {
      effectSource.applyEffect(reducer);
      if (foundLast) break;
    }
    return result;
  },
  /**
   * @param {Number} defaultValue
   * @param effectSources
   * @return {Number}
   */
  max(defaultValue, ...effectSources) {
    let result = new BE(defaultValue);
    applyEffectsOf(effectSources, v => result = BE.max(result, v));
    return result;
  },
  /**
   * @param {Number} defaultValue
   * @param effectSources
   * @return {Number}
   */
  min(defaultValue, ...effectSources) {
    let result = new BE(defaultValue);
    applyEffectsOf(effectSources, v => result = BE.min(result, v));
    return result;
  }
};

/**
 * @returns {BE}
 */
BE.prototype.plusEffectOf = function(effectSource) {
  // eslint-disable-next-line consistent-this
  let result = this;
  effectSource.applyEffect(v => result = result.plus(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.plusEffectsOf = function(...effectSources) {
  // eslint-disable-next-line consistent-this
  let result = this;
  applyEffectsOf(effectSources, v => result = result.plus(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.minusEffectOf = function(effectSource) {
  // eslint-disable-next-line consistent-this
  let result = this;
  effectSource.applyEffect(v => result = result.minus(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.minusEffectsOf = function(...effectSources) {
  // eslint-disable-next-line consistent-this
  let result = this;
  applyEffectsOf(effectSources, v => result = result.minus(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.timesEffectOf = function(effectSource) {
  // eslint-disable-next-line consistent-this
  let result = this;
  effectSource.applyEffect(v => result = result.times(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.timesEffectsOf = function(...effectSources) {
  // Normalize is expensive; when we multiply many things together, it's faster
  // to get a big mantissa and then fix it at the end.
  let result = this;
  applyEffectsOf(effectSources, v => result = result.times(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.dividedByEffectOf = function(effectSource) {
  // eslint-disable-next-line consistent-this
  let result = this;
  effectSource.applyEffect(v => result = result.dividedBy(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.dividedByEffectsOf = function(...effectSources) {
  // eslint-disable-next-line consistent-this
  let result = this;
  applyEffectsOf(effectSources, v => result = result.dividedBy(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.powEffectOf = function(effectSource) {
  // eslint-disable-next-line consistent-this
  let result = this;
  effectSource.applyEffect(v => result = result.pow(v));
  return result;
};

/**
 * @returns {BE}
 */
BE.prototype.powEffectsOf = function(...effectSources) {
  // eslint-disable-next-line consistent-this
  let result = this;
  applyEffectsOf(effectSources, v => result = result.pow(v));
  return result;
};

function applyEffectsOf(effectSources, applyFn) {
  for (const effectSource of effectSources) {
    if (effectSource !== null && effectSource !== undefined) effectSource.applyEffect(applyFn);
  }
}
