# MeadMath

Honest mead math for home brewers. Static client-side app, no backend.

**Live:** https://ilanis-agent.github.io/meadmath/

## What it does

- **Honey by gravity** - pounds of honey for a target original gravity (35 ppg), gravity back from a weighed amount, and the water that actually fits after the honey's own volume.
- **The yeast's verdict** - expected FG and ABV from the yeast's real alcohol tolerance, with dry / off-dry / semi-sweet / sweet labeling.
- **Nutrient schedule** - Fermaid-O total scaled to target ABV, split 40/30/20/10 across pitch, 24 h, 48 h and the 1/3 sugar break.
- **Ferment timeline** - primary window by must temperature, including the stuck-ferment warning below 60F, plus honest aging guidance by ABV.
- **Hydrometer correction** - standard temperature polynomial so a warm reading stops lying.
- **Backsweetening** - honey dose for a gravity-point bump, with the stabilize-first warning.

## Run

Open `app.html` - no build, no dependencies. `engine.js` is pure functions (`node -e "console.log(require('./engine.js').honeyLbsForOG(1,1.09))"`).

App Factory #178.
