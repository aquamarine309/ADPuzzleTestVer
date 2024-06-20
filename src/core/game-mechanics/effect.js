export class Effect {
  constructor(effect, cap, condition) {
    if (effect === undefined || this.isCustomEffect) {
      return;
    }
    const isFunction = v => typeof v === "function";
    const isNumber = v => typeof v === "number";
    const isBE = v => v instanceof BE;
    const isConstant = v => isNumber(v) || isBE(v);
    if (!isFunction(effect) && !isConstant(effect)) {
      throw new Error("Unknown effect value type.");
    }
    const createProperty = () => ({
      configurable: false
    });
    const addGetter = (property, v) => {
      if (isConstant(v)) {
        property.writable = false;
        property.value = v;
      } else if (isFunction(v)) {
        property.get = v;
      } else {
        throw new Error("Unknown getter type.");
      }
    };
    if (condition !== undefined) {
      if (!isFunction(condition)) {
        throw new Error("Effect condition must be a function.");
      }
      const conditionProperty = createProperty();
      conditionProperty.get = condition;
      Object.defineProperty(this, "isEffectConditionSatisfied", conditionProperty);
    }
    const uncappedEffectValueProperty = createProperty();
    addGetter(uncappedEffectValueProperty, effect);
    Object.defineProperty(this, "uncappedEffectValue", uncappedEffectValueProperty);
    if (cap !== undefined) {
      const capProperty = createProperty();
      addGetter(capProperty, cap);
      Object.defineProperty(this, "cap", capProperty);
    }
    const effectValueProperty = createProperty();
    addGetter(effectValueProperty, effect);
    if (isConstant(cap)) {
      if (isNumber(effect)) {
        effectValueProperty.get = () => Math.min(effect, this.cap);
      } else if (isBE(effect)) {
        effectValueProperty.get = () => BE.min(effect, this.cap);
      } else if (isFunction(effect)) {
        // Postpone effectValue specialization until the first call
        effectValueProperty.configurable = true;
        effectValueProperty.get = () => {
          const effectValue = effect();
          const specializedProperty = createProperty();
          if (isNumber(effectValue)) {
            specializedProperty.get = () => Math.min(effect(), this.cap);
          } else if (isBE(effectValue)) {
            specializedProperty.get = () => BE.min(effect(), this.cap);
          } else {
            throw new Error("Unknown effect value type.");
          }
          Object.defineProperty(this, "effectValue", specializedProperty);
          return specializedProperty.get();
        };
      }
    } else if (isFunction(cap)) {
      if (isNumber(effect)) {
        effectValueProperty.get = () => {
          const capValue = this.cap;
          return capValue === undefined ? effect : Math.min(effect, capValue);
        };
      } else if (isBE(effect)) {
        effectValueProperty.get = () => {
          const capValue = this.cap;
          return capValue === undefined ? effect : BE.min(effect, capValue);
        };
      } else if (isFunction(effect)) {
        // Postpone effectValue specialization until the first call
        effectValueProperty.configurable = true;
        effectValueProperty.get = () => {
          const effectValue = effect();
          const specializedProperty = createProperty();
          if (isNumber(effectValue)) {
            specializedProperty.get = () => {
              const capValue = this.cap;
              return capValue === undefined ? effect() : Math.min(effect(), capValue);
            };
          } else if (isBE(effectValue)) {
            specializedProperty.get = () => {
              const capValue = this.cap;
              return capValue === undefined ? effect() : BE.min(effect(), capValue);
            };
          } else {
            throw new Error("Unknown effect value type.");
          }
          Object.defineProperty(this, "effectValue", specializedProperty);
          return specializedProperty.get();
        };
      }
    }
    Object.defineProperty(this, "effectValue", effectValueProperty);
  }

  /**
   * @returns {number|BE}
   */
  get effectValue() {
    throw new Error("Effect is undefined.");
  }

  /**
   * @returns {number|BE}
   */
  get uncappedEffectValue() {
    throw new Error("Effect is undefined.");
  }

  /**
   * @returns {number|BE|undefined}
   */
  get cap() {
    throw new Error("Cap is undefined.");
  }

  get isEffectConditionSatisfied() {
    return true;
  }

  get isEffectActive() {
    return true;
  }

  get canBeApplied() {
    return this.isEffectActive && this.isEffectConditionSatisfied;
  }

  /**
   * @param {number|BE} defaultValue
   * @returns {number|BE}
   */
  effectOrDefault(defaultValue) {
    return this.canBeApplied ? this.effectValue : defaultValue;
  }

  applyEffect(applyFn) {
    if (this.canBeApplied) applyFn(this.effectValue);
  }

  get isCustomEffect() {
    return false;
  }
}
