import GSAP from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis'

console.log ("hello There");

// Smooth Scrolling TEST
const lenis = new Lenis({
    orientation: 'horizontal',
    smoothWheel: true,
    gestureOrientation: 'both',
    direction: 'horizontal',
    duration: 1.5,
    smoothTouch: true,
    touchMultiplier: 5,
    autoResize: true,
});
lenis.on('scroll', ScrollTrigger.update, 'direction','progress' ) 
console.log(lenis)

GSAP.ticker.add((time) => {
    lenis.raf(time * 1000)
})

GSAP.ticker.lagSmoothing(0)

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  
  requestAnimationFrame(raf)

  // -----

  const slider = document.querySelector('.slider');
  const section = document.querySelectorAll('.slider section');

  console.log(section);