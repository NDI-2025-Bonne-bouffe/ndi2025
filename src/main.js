import gsap from 'gsap';
import './css/globals.css';

console.log('GSAP loaded:', gsap.version);

gsap.to('h1', { 
  rotation: 360, 
  duration: 2, 
  ease: 'bounce.out' 
});
