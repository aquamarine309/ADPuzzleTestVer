# Antimatter Dimensions Puzzled

  This is a mod of the famous incremental game [Antimatter Dimensions](https://ivark.github.io/AntimatterDimensions).

This mod changed some game mechanics to make the game full of puzzles (such as challenge combo). There is a new tab named "Logic". It will be unlocked when you reach Infinity.

### What does this mod change?

1. Use [break_eternity.js](https://www.npmjs.com/package/break_eternity.js) instead of [break_infinity.js](https://www.npmjs.com/package/break_infinity.js) (not Antimatter Dimensions Break Eternity Port).

2. This mod is based on ESModule grammar instead of npm build.

3. To support break_eternity.js, there is a function `BE.prototype.toNumberMax(maxValue)`. It can convert a BE (Decimal) to a number and has a maximum value to prevent the number becomes too large. For Example:

```
> new BE("1e1000").div(new BE(10)).toNumberMax(1)
< 1
```

### Current endgame

Reach 1e20,000 AM after Eternity.

### Known bugs
1. Not every notation supports break_eternity.js Decimal (But common notataions can work correctly).

2. LC3 mini-game may generate a wrong question (Such as 10 = 11 - 8 - 7).

3. Converting b_i to b_e has not finished yet. It still has many bugs.

### Something that need improve

1. I am a middle-school student from China. I am not good at English. So maybe you could see many mistakes in the grammar. Please understand.

2. There is little description about the new mechanics. It will be added in the future.

3. The balance of this game is average (Especially post-eternity).

### Developers

1. aquamarine (QQ: 2854608474)

2. WYXkk (QQ: 2068559520)



## Thank you so much for playing!