/**
 * Minimalist Top Navigation Controller (z-index: 40)
 * - At scroll = 0 (Hero): ONLY top-right Bag [ 00 ] is visible (zero duplicate brand text, zero bottom chips/%)
 * - Once scrolled past Hero: bare borderless 14px procedural Gemini Spark appears top-left to return to top
 */

import { subscribeBag, toggleBagDrawer, IS_SCREENSHOT_MODE, prefersReducedMotion } from '../state/store.js';
import { createSparkSvgElement } from './proceduralSparkSvg.js';

export function initHud({ createOdometer, onScrollToTop }) {
  const hudEl = document.getElementById('gs-hud');
  const brandBtn = document.getElementById('hud-brand-btn');
  const sparkSlot = document.getElementById('hud-spark-slot');
  const bagBtn = document.getElementById('hud-bag-btn');
  const bagCountEl = document.getElementById('hud-bag-count');

  if (sparkSlot) {
    sparkSlot.innerHTML = '';
    sparkSlot.appendChild(createSparkSvgElement(15, 0.64));
  }

  const countOdometer = bagCountEl && createOdometer ? createOdometer(bagCountEl, '00') : null;
  let initializedBag = false;

  const unsubBag = subscribeBag((snapshot) => {
    if (countOdometer) {
      countOdometer.setValue(snapshot.countPadded, !initializedBag);
    } else if (bagCountEl) {
      bagCountEl.textContent = snapshot.countPadded;
    }
    if (bagBtn) {
      bagBtn.setAttribute(
        'aria-label',
        `Open shopping bag, ${snapshot.count} ${snapshot.count === 1 ? 'item' : 'items'}`
      );
    }
    initializedBag = true;
  });

  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      onScrollToTop?.();
    });
  }

  if (bagBtn) {
    bagBtn.addEventListener('click', () => {
      toggleBagDrawer(IS_SCREENSHOT_MODE || prefersReducedMotion());
    });
  }

  function setPastHero(pastHero) {
    if (!hudEl) return;
    hudEl.classList.toggle('is-past-hero', Boolean(pastHero));
  }

  return {
    setPastHero,
    destroy() {
      unsubBag();
    },
  };
}
