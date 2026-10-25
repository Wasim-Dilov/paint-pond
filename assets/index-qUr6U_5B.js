(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={crayon:{type:`bandpass`,freq:1700,q:.7,gain:.5,pre:[`lowpass`,4200]},pencil:{type:`bandpass`,freq:5200,q:.9,gain:.34,pre:[`highpass`,2400]},marker:{type:`bandpass`,freq:950,q:2.8,gain:.42},paint:{type:`lowpass`,freq:1300,q:.8,gain:.45},watercolour:{type:`lowpass`,freq:650,q:.6,gain:.5},spray:{type:`highpass`,freq:2600,q:.5,gain:.22,idle:.16},glitter:{type:`bandpass`,freq:6400,q:1.2,gain:.25},rainbow:{type:`bandpass`,freq:1400,q:2.2,gain:.38},glow:{type:`lowpass`,freq:520,q:.7,gain:.32},smudge:{type:`lowpass`,freq:380,q:.8,gain:.55},eraser:{type:`bandpass`,freq:1150,q:1.4,gain:.45}},t=new class{enabled=!0;ctx;master;noise;voice;lastSparkle=0;unlock(){try{if(!this.ctx){let e=window.AudioContext??window.webkitAudioContext;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.9,this.master.connect(this.ctx.destination);let t=this.ctx.sampleRate*2;this.noise=this.ctx.createBuffer(1,t,this.ctx.sampleRate);let n=this.noise.getChannelData(0);for(let e=0;e<t;e++)n[e]=(Math.random()*2-1)*(Math.random()<.04?1:.55)}this.ctx.state===`suspended`&&this.ctx.resume()}catch{this.ctx=void 0}}get ready(){return this.enabled&&this.ctx&&this.master&&this.noise?this.ctx:void 0}startBrush(t){this.stopBrush();let n=this.ready,r=e[t];if(!n||!r)return;let i=n.createBufferSource();i.buffer=this.noise,i.loop=!0,i.loopStart=Math.random(),i.playbackRate.value=.9+Math.random()*.2;let a=n.createBiquadFilter();a.type=r.type,a.frequency.value=r.freq,a.Q.value=r.q;let o=n.createGain();o.gain.value=0;let s=i;if(r.pre){let e=n.createBiquadFilter();e.type=r.pre[0],e.frequency.value=r.pre[1],s.connect(e),s=e}s.connect(a).connect(o).connect(this.master),i.start(0,Math.random()*1.5);let c={src:i,gain:o,filter:a,base:r.gain,tool:t};if(t===`glow`){let e=n.createOscillator();e.type=`sine`,e.frequency.value=330;let t=n.createGain();t.gain.value=.05,e.connect(t).connect(o),e.start(),c.extra=e}r.idle&&o.gain.setTargetAtTime(r.idle,n.currentTime,.04),this.voice=c}brushSpeed(t){let n=this.voice,r=this.ready;if(!n||!r)return;let i=e[n.tool],a=Math.min(1,t/1400)**.7,o=Math.max(i.idle??0,n.base*a);n.gain.gain.setTargetAtTime(o,r.currentTime,.03),n.filter.frequency.setTargetAtTime(i.freq*(.85+.35*a),r.currentTime,.05),n.tool===`glitter`&&a>.2&&r.currentTime-this.lastSparkle>.09&&Math.random()<.5&&(this.lastSparkle=r.currentTime,this.tone(2200+Math.random()*2600,.08,.05,`sine`))}stopBrush(){let e=this.voice;if(this.voice=void 0,!e||!this.ctx)return;let t=this.ctx.currentTime;e.gain.gain.cancelScheduledValues(t),e.gain.gain.setTargetAtTime(0,t,.04),e.src.stop(t+.3),e.extra?.stop(t+.3)}tone(e,t,n,r=`sine`,i,a=0){let o=this.ready;if(!o)return;let s=o.currentTime+a,c=o.createOscillator();c.type=r,c.frequency.setValueAtTime(e,s),i&&c.frequency.exponentialRampToValueAtTime(i,s+t);let l=o.createGain();l.gain.setValueAtTime(0,s),l.gain.linearRampToValueAtTime(n,s+.01),l.gain.exponentialRampToValueAtTime(1e-4,s+t),c.connect(l).connect(this.master),c.start(s),c.stop(s+t+.02)}burst(e,t,n,r,i,a=0){let o=this.ready;if(!o)return;let s=o.currentTime+a,c=o.createBufferSource();c.buffer=this.noise;let l=o.createBiquadFilter();l.type=n,l.Q.value=1.2,l.frequency.setValueAtTime(r,s),l.frequency.exponentialRampToValueAtTime(i,s+e);let u=o.createGain();u.gain.setValueAtTime(0,s),u.gain.linearRampToValueAtTime(t,s+.015),u.gain.exponentialRampToValueAtTime(1e-4,s+e),c.connect(l).connect(u).connect(this.master),c.start(s,Math.random()),c.stop(s+e+.05)}fill(){this.tone(520,.22,.32,`sine`,160),this.burst(.35,.22,`bandpass`,2400,500,.03)}sticker(){this.tone(660,.09,.3,`triangle`,990),this.tone(1320,.12,.12,`sine`,void 0,.05)}tap(){this.tone(880,.06,.16,`triangle`,700)}pick(){this.tone(700,.08,.2,`sine`,1050)}undo(){this.burst(.22,.2,`bandpass`,3e3,600)}redo(){this.burst(.22,.2,`bandpass`,600,3e3)}play(e,t=1){let n=this.ready;if(!n)return;let r=n.createBufferSource();r.buffer=e;let i=n.createGain();i.gain.value=t,r.connect(i).connect(this.master),r.start()}get context(){return this.ctx}lights(e){this.burst(.18,.12,`bandpass`,2400,2400),e?(this.tone(520,.5,.16,`sine`,180),[1568,2093,2637].forEach((e,t)=>this.tone(e,.25,.07,`sine`,void 0,.35+t*.12))):this.tone(220,.35,.16,`sine`,660)}cheer(){[523,659,784,1047].forEach((e,t)=>this.tone(e,.35,.22,`triangle`,void 0,t*.11));for(let e=0;e<6;e++)this.tone(1800+Math.random()*2400,.12,.06,`sine`,void 0,.45+e*.07)}},n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(-25 20)">
      <!-- tail -->
      <path stroke-width="14" d="M 706 891 C 800 900 885 860 885 750 C 885 690 868 650 845 630 A 25 25 0 0 0 802 652 C 826 688 838 718 836 755 C 832 812 790 806 727 799"/>
      <!-- body -->
      <path stroke-width="14" d="M 384 546 C 300 610 262 740 275 850 Q 280 905 340 905 L 660 905 Q 720 905 725 850 C 738 740 700 610 616 546"/>
      <!-- belly -->
      <ellipse cx="500" cy="730" rx="85" ry="100"/>
      <!-- paws -->
      <path stroke-width="12" d="M 335 905 C 326 798 484 798 475 905"/>
      <path stroke-width="12" d="M 525 905 C 516 798 674 798 665 905"/>
      <path d="M 383 905 L 383 876 M 428 905 L 428 876 M 572 905 L 572 876 M 617 905 L 617 876"/>
      <!-- head -->
      <path stroke-width="14" d="M 500 565 C 355 565 258 492 258 375 C 258 320 270 285 285 260 L 272 88 Q 270 62 294 72 L 440 168 C 475 158 525 158 560 168 L 706 72 Q 730 62 728 88 L 715 260 C 730 285 742 320 742 375 C 742 492 645 565 500 565 Z"/>
      <!-- inner ears -->
      <path d="M 308 212 Q 296 160 302 120 Q 350 138 386 168 Q 338 180 308 212 Z"/>
      <path d="M 692 212 Q 704 160 698 120 Q 650 138 614 168 Q 662 180 692 212 Z"/>
      <!-- eyes -->
      <circle cx="408" cy="365" r="58"/>
      <circle cx="592" cy="365" r="58"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 381 371 a 32 32 0 1 0 64 0 a 32 32 0 1 0 -64 0 Z M 389 356 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0 Z"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 565 371 a 32 32 0 1 0 64 0 a 32 32 0 1 0 -64 0 Z M 573 356 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0 Z"/>
      <!-- nose and mouth -->
      <path fill="#111" d="M 474 445 Q 500 438 526 445 Q 522 463 500 474 Q 478 463 474 445 Z"/>
      <path d="M 500 474 L 500 488 M 500 488 Q 492 512 467 508 Q 450 505 444 490 M 500 488 Q 508 512 533 508 Q 550 505 556 490"/>
      <!-- whiskers -->
      <path stroke-width="8" d="M 372 462 L 215 445 M 374 488 L 222 505 M 628 462 L 785 445 M 626 488 L 778 505"/>
    </g>
  </g>
</svg>
`,r=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="cow-flower">
      <path d="M 30 0 Q 54 31 15 26 Q 0 62 -15 26 Q -54 31 -30 0 Q -54 -31 -15 -26 Q 0 -62 15 -26 Q 54 -31 30 0 Z"/>
      <circle cx="0" cy="0" r="13"/>
      <path d="M 0 44 L 0 112"/>
      <path d="M 0 92 Q 14 52 62 62 Q 46 106 0 92 Z"/>
    </g>
  </defs>
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- sky: sun and clouds -->
    <circle stroke-width="9" cx="140" cy="140" r="58"/>
    <path d="M 212 170 L 234 179 M 170 212 L 179 234 M 110 212 L 101 234 M 68 170 L 46 179 M 68 110 L 46 101 M 110 68 L 101 46 M 170 68 L 179 46 M 212 110 L 234 101"/>
    <circle fill="#111" stroke="none" cx="121" cy="130" r="7"/>
    <circle fill="#111" stroke="none" cx="159" cy="130" r="7"/>
    <path d="M 118 152 Q 140 172 162 152"/>
    <path stroke-width="9" d="M 350 150 Q 322 150 325 125 Q 330 100 360 104 Q 368 68 410 72 Q 440 50 470 78 Q 505 72 510 105 Q 538 112 530 135 Q 524 150 505 150 Z"/>
    <path stroke-width="9" d="M 780 140 Q 752 140 755 115 Q 760 90 790 94 Q 798 58 840 62 Q 870 40 900 68 Q 935 62 940 95 Q 968 102 960 125 Q 954 140 935 140 Z"/>
    <!-- hills -->
    <path stroke-width="10" d="M -10 615 Q 110 575 211 600"/>
    <path stroke-width="10" d="M 782 520 Q 900 470 1010 500"/>
    <!-- flowers and grass -->
    <use href="#cow-flower" x="95" y="745"/>
    <use href="#cow-flower" x="895" y="610"/>
    <use href="#cow-flower" x="860" y="815"/>
    <path d="M 248 862 L 238 840 M 256 862 L 258 834 M 264 862 L 274 842 M 498 862 L 488 840 M 506 862 L 508 834 M 514 862 L 524 842 M 706 862 L 696 840 M 714 862 L 716 834 M 722 862 L 732 842"/>
    <!-- tail -->
    <path d="M 242 451 C 195 470 165 520 168 580 C 170 610 168 630 165 648"/>
    <path d="M 165 648 C 144 660 136 690 142 718 Q 152 706 160 726 Q 168 708 178 724 Q 182 708 190 714 C 194 686 186 660 165 648 Z"/>
    <!-- legs and hooves -->
    <path stroke-width="10" d="M 280 690 L 283 850 Q 310 861 337 850 L 340 690 M 352 690 L 355 850 Q 382 861 409 850 L 412 690 M 545 690 L 548 850 Q 575 861 602 850 L 605 690 M 617 690 L 620 850 Q 647 861 674 850 L 677 690"/>
    <path d="M 282 818 Q 310 827 338 818 M 354 818 Q 382 827 410 818 M 547 818 Q 575 827 603 818 M 619 818 Q 647 827 675 818"/>
    <!-- udder -->
    <path stroke-width="8" d="M 428 690 C 426 735 450 748 470 748 C 490 748 514 735 512 690"/>
    <path d="M 445 740 Q 443 774 455 774 Q 467 774 465 748 M 475 748 Q 473 774 485 774 Q 497 774 495 740"/>
    <!-- body -->
    <path stroke-width="10" d="M 582 430 C 500 418 330 415 270 435 C 215 452 205 520 210 580 C 213 640 228 682 275 690 L 680 690 C 705 670 718 600 715 537"/>
    <!-- spots -->
    <path d="M 300 428 C 290 480 330 522 370 507 C 405 494 420 462 400 421"/>
    <path d="M 450 520 C 470 488 540 490 560 520 C 580 552 545 600 500 596 C 455 592 430 552 450 520 Z"/>
    <path d="M 290 600 C 295 570 345 565 362 590 C 378 615 352 645 322 642 C 296 640 286 622 290 600 Z"/>
    <!-- ears -->
    <path stroke-width="10" d="M 600 296 C 560 262 490 262 458 300 C 490 352 555 362 585 354"/>
    <path d="M 490 304 C 515 290 552 296 568 316 C 552 332 515 330 490 304 Z"/>
    <path stroke-width="10" d="M 800 296 C 840 262 910 262 942 300 C 910 352 845 362 815 354"/>
    <path d="M 910 304 C 885 290 848 296 832 316 C 848 332 885 330 910 304 Z"/>
    <!-- horns and tuft -->
    <path stroke-width="10" d="M 620 269 C 596 245 590 212 602 188 C 625 200 640 222 644 251"/>
    <path stroke-width="10" d="M 780 269 C 804 245 810 212 798 188 C 775 200 760 222 756 251"/>
    <path d="M 672 241 Q 664 208 692 212 Q 704 188 722 210 Q 744 210 728 241"/>
    <!-- head -->
    <path stroke-width="10" d="M 590 420 C 570 330 600 240 700 238 C 800 240 830 330 810 420"/>
    <circle cx="652" cy="325" r="34"/>
    <circle cx="748" cy="325" r="34"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 634 329 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 Z M 640 319 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 726 329 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 Z M 732 319 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0 Z"/>
    <!-- muzzle -->
    <ellipse stroke-width="10" cx="700" cy="460" rx="128" ry="78"/>
    <ellipse fill="#111" stroke="none" cx="656" cy="458" rx="13" ry="18"/>
    <ellipse fill="#111" stroke="none" cx="744" cy="458" rx="13" ry="18"/>
    <path d="M 652 500 Q 700 526 748 500"/>
  </g>
</svg>
`,i=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(-12 10)">
      <!-- water -->
      <path stroke-width="12" d="M -65 790 Q 5 770 75 790 T 215 790 T 355 790 T 495 790 T 635 790 T 775 790 T 915 790 T 1055 790"/>
      <path d="M 70 880 Q 120 897 170 880 M 830 872 Q 880 889 930 872 M 420 920 Q 490 937 560 920"/>
      <!-- body and head -->
      <path stroke-width="14" d="M 215 790 C 140 765 95 660 102 565 C 105 520 100 490 96 466 Q 94 446 114 456 C 175 505 255 540 340 540 C 420 540 496 431 464 363 A 150 150 0 1 1 739 244 A 150 150 0 0 1 730 375 C 708 414 725 455 765 490 C 830 555 835 720 775 790"/>
      <!-- tuft -->
      <path d="M 588 152 Q 568 110 592 85 M 610 151 Q 618 105 655 96"/>
      <!-- wing -->
      <path d="M 610 585 C 665 610 670 690 612 722 Q 582 750 542 732 Q 507 755 470 728 Q 432 744 402 712 Q 360 700 340 630 C 410 595 510 568 610 585 Z"/>
      <!-- bill -->
      <path stroke-width="12" d="M 739 244 C 790 228 860 236 893 262 C 912 278 905 300 880 302 Q 815 318 750 300"/>
      <path stroke-width="12" d="M 864 305 C 860 340 800 358 743 346"/>
      <!-- eye -->
      <circle cx="640" cy="270" r="40"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 622 276 a 24 24 0 1 0 48 0 a 24 24 0 1 0 -48 0 Z M 629 264 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0 Z"/>
    </g>
  </g>
</svg>
`,a=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="farm-flower">
      <path d="M 0 -26 Q 31 -42 25 -8 Q 49 16 15 21 Q 0 52 -15 21 Q -49 16 -25 -8 Q -31 -42 0 -26 Z"/>
      <circle cx="0" cy="0" r="12"/>
    </g>
  </defs>
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- sun -->
    <circle cx="870" cy="125" r="50"/>
    <path stroke-width="6" d="M 931 150 L 955 160 M 895 186 L 905 210 M 845 186 L 835 210 M 809 150 L 785 160 M 809 100 L 785 90 M 845 64 L 835 40 M 895 64 L 905 40 M 931 100 L 955 90"/>
    <circle fill="#111" stroke="none" cx="853" cy="115" r="6"/>
    <circle fill="#111" stroke="none" cx="887" cy="115" r="6"/>
    <path stroke-width="5" d="M 851 136 Q 870 152 889 136"/>
    <!-- clouds -->
    <path d="M 190 140 Q 165 140 168 118 Q 172 98 198 101 Q 205 70 240 73 Q 266 55 292 78 Q 322 74 326 102 Q 348 110 341 128 Q 336 140 320 140 Z"/>
    <path d="M 590 160 Q 565 160 568 138 Q 572 118 598 121 Q 605 90 640 93 Q 666 75 692 98 Q 722 94 726 122 Q 748 130 741 148 Q 736 160 720 160 Z"/>
    <!-- hills -->
    <path d="M -10 455 Q 10 450 30 452"/>
    <path d="M 429 456 Q 462 442 495 436"/>
    <path d="M 725 393 C 800 375 900 378 1010 395"/>
    <!-- silo -->
    <path d="M 30 190 Q 30 118 85 116 Q 140 118 140 190 M 30 190 L 30 700 M 140 190 L 140 357 M 30 190 L 140 190"/>
    <path stroke-width="5" d="M 30 330 Q 85 342 140 330 M 30 470 Q 85 482 141 470 M 30 600 Q 85 612 141 600"/>
    <!-- barn -->
    <path d="M 118 420 L 160 300 L 285 210 L 410 300 L 452 420 M 141 420 L 179 314 L 285 237 L 391 314 L 429 420 M 118 420 L 452 420 M 141 420 L 141 700 M 429 420 L 429 700 M 30 700 L 429 700"/>
    <path d="M 255 290 L 315 290 L 315 372 L 255 372 Z"/>
    <path stroke-width="5" d="M 255 290 L 315 372 M 315 290 L 255 372"/>
    <path d="M 205 700 L 205 515 L 365 515 L 365 700"/>
    <path stroke-width="6" d="M 221 700 L 221 531 L 349 531 L 349 700 M 285 531 L 285 700"/>
    <path stroke-width="5" d="M 221 531 L 285 700 M 285 531 L 221 700 M 285 531 L 349 700 M 349 531 L 285 700"/>
    <path stroke-width="6" d="M 155 556 L 191 556 L 191 600 L 155 600 Z M 379 556 L 415 556 L 415 600 L 379 600 Z"/>
    <path stroke-width="5" d="M 173 556 L 173 600 M 155 578 L 191 578 M 397 556 L 397 600 M 379 578 L 415 578"/>
    <!-- fence -->
    <path d="M 462 655 L 462 510 L 475 497 L 488 510 L 488 655 Z M 540 655 L 540 510 L 553 497 L 566 510 L 566 655 Z"/>
    <path d="M 429 525 L 462 525 M 429 545 L 462 545 M 488 525 L 540 525 M 488 545 L 540 545 M 566 525 L 615 525 M 566 545 L 618 545"/>
    <path d="M 429 585 L 462 585 M 429 605 L 462 605 M 488 585 L 540 585 M 488 605 L 540 605 M 566 585 L 624 585 M 566 605 L 627 605"/>
    <!-- horse -->
    <g transform="translate(-15 0)">
      <path d="M 914 491 C 955 480 980 520 975 590 C 970 650 980 720 960 780 C 950 740 948 690 952 640 C 956 590 958 552 926 538"/>
      <path d="M 686 702 L 688 872 Q 708 882 728 872 L 730 710 M 738 711 L 740 872 Q 760 882 780 872 L 782 713 M 806 712 L 808 872 Q 828 882 848 872 L 850 708 M 852 707 L 854 872 Q 873 882 892 872 L 894 696"/>
      <path stroke-width="5" d="M 687 842 Q 708 849 729 842 M 739 842 Q 760 849 781 842 M 807 842 Q 828 849 849 842 M 853 842 Q 873 849 893 842"/>
      <path d="M 532 452 C 557 470 602 465 617 440 C 627 490 630 540 640 590 C 646 640 655 680 680 700 C 740 718 840 718 895 695 C 935 672 940 520 905 475 C 875 455 800 455 732 455 C 705 430 682 360 662 315 C 632 300 572 320 542 345 C 522 360 507 385 507 410 C 507 440 517 452 532 452 Z"/>
      <path d="M 608 313 C 602 295 602 278 612 264 C 626 280 634 297 635 310 M 646 310 C 643 293 643 278 652 266 C 664 282 668 300 662 315"/>
      <path stroke-width="5" d="M 615 302 Q 612 290 615 277 M 653 302 Q 651 291 654 281"/>
      <path d="M 576 325 C 560 310 560 292 572 285 C 582 298 592 305 596 317"/>
      <path d="M 668 329 Q 712 318 727 338 Q 714 352 705 368 Q 742 360 747 384 Q 735 398 727 413 Q 762 405 770 424 Q 758 432 750 437 Q 790 425 805 438 Q 798 450 784 455"/>
      <path stroke-width="6" d="M 531 355 C 552 380 558 430 549 460"/>
      <ellipse fill="#111" stroke="none" cx="518" cy="404" rx="6" ry="10"/>
      <path stroke-width="5" d="M 523 438 Q 532 446 542 440"/>
      <circle stroke-width="6" cx="596" cy="368" r="24"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 579 370 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 Z M 581 364 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    </g>
    <!-- path to the barn -->
    <path d="M 205 700 C 190 800 120 900 70 1010 M 365 700 C 350 790 320 900 290 1010"/>
    <ellipse stroke-width="5" cx="262" cy="800" rx="17" ry="10"/>
    <ellipse stroke-width="5" cx="235" cy="890" rx="21" ry="12"/>
    <ellipse stroke-width="5" cx="190" cy="958" rx="16" ry="9"/>
    <!-- chicken -->
    <g transform="translate(-25 0)">
      <path d="M 434 778 A 38 38 0 0 1 505 776 C 525 795 555 805 590 795 C 585 760 600 735 625 732 C 655 730 672 765 668 800 C 665 830 650 850 630 862 C 610 905 560 935 510 932 C 465 930 440 905 440 870 C 440 840 430 818 434 803 Z"/>
      <path stroke-width="6" d="M 590 795 C 595 820 610 845 630 862 M 597 817 L 648 739 M 609 838 L 667 774"/>
      <path stroke-width="6" d="M 495 835 C 540 818 590 832 598 858 Q 590 878 570 874 Q 560 895 538 888 Q 520 902 503 886 C 483 870 482 845 495 835 Z"/>
      <path stroke-width="6" d="M 454 756 Q 440 728 458 722 Q 462 702 478 712 Q 492 700 498 720 Q 510 735 489 757"/>
      <path stroke-width="6" d="M 434 780 L 395 795 L 434 801"/>
      <path stroke-width="6" d="M 434 806 C 412 815 414 845 432 846 C 444 846 445 835 434 824"/>
      <circle stroke-width="5" cx="462" cy="784" r="15"/>
      <circle fill="#111" stroke="none" cx="457" cy="786" r="9"/>
      <path stroke-width="6" d="M 505 932 L 502 958 M 484 962 L 502 958 L 494 968 M 502 958 L 514 965 M 550 928 L 548 958 M 530 962 L 548 958 L 540 968 M 548 958 L 560 965"/>
    </g>
    <!-- grass, flowers -->
    <use href="#farm-flower" x="80" y="800"/>
    <use href="#farm-flower" x="760" y="935"/>
    <use href="#farm-flower" x="915" y="925"/>
    <path stroke-width="5" d="M 60 900 L 52 880 M 68 900 L 70 874 M 76 900 L 86 882 M 625 960 L 617 940 M 633 960 L 635 934 M 641 960 L 651 942 M 960 470 L 952 452 M 968 470 L 970 446 M 976 470 L 986 454 M 510 700 L 502 680 M 518 700 L 520 674 M 526 700 L 536 682"/>
  </g>
</svg>
`,o=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <path id="pig-drop" d="M 0 34 C -10 22 -15 12 -15 0 A 15 15 0 0 1 15 0 C 15 12 10 22 0 34 Z"/>
  </defs>
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- sun and cloud -->
    <circle stroke-width="9" cx="130" cy="130" r="56"/>
    <path d="M 200 159 L 222 168 M 159 200 L 168 222 M 101 200 L 92 222 M 60 159 L 38 168 M 60 101 L 38 92 M 101 60 L 92 38 M 159 60 L 168 38 M 200 101 L 222 92"/>
    <circle fill="#111" stroke="none" cx="112" cy="120" r="7"/>
    <circle fill="#111" stroke="none" cx="148" cy="120" r="7"/>
    <path d="M 110 142 Q 130 160 150 142"/>
    <path stroke-width="9" d="M 790 150 Q 762 150 765 125 Q 770 100 800 104 Q 808 68 850 72 Q 880 50 910 78 Q 945 72 950 105 Q 975 115 966 138 Q 960 150 945 150 Z"/>
    <!-- grass line -->
    <path stroke-width="10" d="M -10 590 Q 140 575 275 600"/>
    <path stroke-width="10" d="M 725 600 Q 860 575 1010 590"/>
    <path d="M 60 600 L 52 580 M 68 600 L 70 574 M 76 600 L 86 582 M 930 602 L 922 582 M 938 602 L 940 576 M 946 602 L 956 584"/>
    <!-- mud puddle, drops and tail -->
    <path stroke-width="10" d="M 283 690 C 200 690 110 720 100 790 C 90 860 170 930 300 935 C 420 945 580 945 700 935 C 830 930 910 860 900 790 C 890 720 800 690 717 690"/>
    <use href="#pig-drop" transform="translate(150 640) rotate(-35)"/>
    <use href="#pig-drop" transform="translate(75 675) rotate(-60)"/>
    <use href="#pig-drop" transform="translate(225 640) rotate(-15)"/>
    <use href="#pig-drop" transform="translate(850 640) rotate(35)"/>
    <use href="#pig-drop" transform="translate(925 675) rotate(60)"/>
    <use href="#pig-drop" transform="translate(775 640) rotate(15)"/>
    <use href="#pig-drop" transform="translate(125 350) rotate(-30)"/>
    <use href="#pig-drop" transform="translate(875 350) rotate(30)"/>
    <path d="M 160 880 Q 200 895 240 880 M 760 880 Q 800 895 840 880 M 470 910 Q 500 920 530 910"/>
    <!-- raised front legs -->
    <path stroke-width="10" d="M 277 575 L 176 479 A 34 34 0 0 1 224 431 L 294 505"/>
    <path d="M 194 498 L 243 449 M 176 431 L 193 448"/>
    <path stroke-width="10" d="M 723 575 L 824 479 A 34 34 0 0 0 776 431 L 706 505"/>
    <path d="M 806 498 L 757 449 M 824 431 L 807 448"/>
    <!-- body -->
    <path stroke-width="10" d="M 336 442 C 285 490 268 570 278 650 C 284 700 292 750 304 791 M 418 815 Q 500 840 582 815 M 696 791 C 708 750 716 700 722 650 C 732 570 715 490 664 442"/>
    <ellipse cx="500" cy="690" rx="115" ry="100"/>
    <path d="M 312 650 C 310 628 340 618 360 628 C 378 638 374 668 350 674 C 328 680 314 668 312 650 Z"/>
    <path d="M 636 556 C 640 538 670 534 684 548 C 696 562 682 582 662 582 C 644 582 634 570 636 556 Z"/>
    <!-- hind feet -->
    <ellipse stroke-width="10" cx="350" cy="835" rx="72" ry="58"/>
    <ellipse cx="350" cy="842" rx="34" ry="25"/>
    <path d="M 350 867 L 350 846"/>
    <ellipse stroke-width="10" cx="650" cy="835" rx="72" ry="58"/>
    <ellipse cx="650" cy="842" rx="34" ry="25"/>
    <path d="M 650 867 L 650 846"/>
    <!-- ears -->
    <path stroke-width="10" d="M 327 260 C 310 215 298 170 296 140 Q 296 124 312 128 C 355 140 400 160 425 187"/>
    <path d="M 340 219 Q 330 192 328 167 Q 356 174 380 190 Q 356 198 340 219 Z"/>
    <path stroke-width="10" d="M 673 260 C 690 215 702 170 704 140 Q 704 124 688 128 C 645 140 600 160 575 187"/>
    <path d="M 660 219 Q 670 192 672 167 Q 644 174 620 190 Q 644 198 660 219 Z"/>
    <!-- head -->
    <ellipse stroke-width="10" cx="500" cy="345" rx="200" ry="170"/>
    <circle cx="425" cy="290" r="32"/>
    <circle cx="575" cy="290" r="32"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 408 294 a 19 19 0 1 0 38 0 a 19 19 0 1 0 -38 0 Z M 412 285 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 558 294 a 19 19 0 1 0 38 0 a 19 19 0 1 0 -38 0 Z M 562 285 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
    <ellipse cx="380" cy="418" rx="28" ry="18"/>
    <ellipse cx="620" cy="418" rx="28" ry="18"/>
    <ellipse stroke-width="9" cx="500" cy="395" rx="74" ry="52"/>
    <ellipse fill="#111" stroke="none" cx="475" cy="395" rx="12" ry="19"/>
    <ellipse fill="#111" stroke="none" cx="525" cy="395" rx="12" ry="19"/>
    <path d="M 458 468 Q 500 498 542 468"/>
  </g>
</svg>
`,s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(-30 10)">
      <!-- wagging tail and wag lines -->
      <path stroke-width="14" d="M 712 739 C 770 720 810 680 830 610 A 24 24 0 0 1 876 624 C 860 720 800 790 716 795"/>
      <path stroke-width="9" d="M 868 560 Q 900 575 910 610 M 892 525 Q 940 550 948 610"/>
      <!-- body -->
      <path stroke-width="14" d="M 390 522 C 310 590 275 730 285 850 Q 290 905 345 905 L 655 905 Q 710 905 715 850 C 725 730 690 590 610 522"/>
      <!-- collar and tag -->
      <path stroke-width="12" d="M 351 565 Q 500 625 649 565"/>
      <path d="M 500 595 L 500 616"/>
      <circle cx="500" cy="646" r="30"/>
      <!-- spots -->
      <path d="M 360 712 C 360 680 400 670 425 682 C 448 694 446 736 420 748 C 390 760 360 742 360 712 Z"/>
      <path d="M 585 740 C 580 712 615 700 635 712 C 655 726 650 760 625 766 C 602 772 588 760 585 740 Z"/>
      <!-- paws -->
      <path stroke-width="12" d="M 330 905 C 320 795 490 795 480 905"/>
      <path stroke-width="12" d="M 520 905 C 510 795 680 795 670 905"/>
      <path d="M 380 905 L 380 876 M 430 905 L 430 876 M 570 905 L 570 876 M 620 905 L 620 876"/>
      <!-- floppy ears (behind the head) -->
      <path stroke-width="14" d="M 392 177 C 310 150 225 200 205 300 C 188 390 200 500 245 540 C 290 578 318 500 292 402"/>
      <path stroke-width="14" d="M 608 177 C 690 150 775 200 795 300 C 812 390 800 500 755 540 C 710 578 682 500 708 402"/>
      <!-- head -->
      <ellipse stroke-width="14" cx="500" cy="350" rx="215" ry="200"/>
      <!-- eyes -->
      <circle cx="410" cy="275" r="46"/>
      <circle cx="590" cy="275" r="46"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 387 280 a 27 27 0 1 0 54 0 a 27 27 0 1 0 -54 0 Z M 395 267 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0 Z"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 567 280 a 27 27 0 1 0 54 0 a 27 27 0 1 0 -54 0 Z M 575 267 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0 Z"/>
      <!-- muzzle, nose, mouth, tongue -->
      <ellipse cx="500" cy="425" rx="110" ry="98"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 462 372 a 38 26 0 1 0 76 0 a 38 26 0 1 0 -76 0 Z M 474 362 a 12 7 0 1 0 24 0 a 12 7 0 1 0 -24 0 Z"/>
      <path d="M 500 396 L 500 420 M 446 412 Q 474 444 500 420 Q 526 444 554 412"/>
      <path d="M 471 430 C 460 505 540 505 529 430"/>
      <path stroke-width="8" d="M 500 442 L 500 468"/>
    </g>
  </g>
</svg>
`,c=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- sun and cloud -->
    <circle stroke-width="9" cx="110" cy="110" r="48"/>
    <path d="M 168 110 L 184 110 M 151 151 L 162 162 M 110 168 L 110 184 M 69 151 L 58 162 M 52 110 L 36 110 M 69 69 L 58 58 M 110 52 L 110 36 M 151 69 L 162 58"/>
    <circle fill="#111" stroke="none" cx="94" cy="101" r="6"/>
    <circle fill="#111" stroke="none" cx="126" cy="101" r="6"/>
    <path d="M 92 122 Q 110 138 128 122"/>
    <path stroke-width="9" d="M 800 130 Q 775 130 778 108 Q 782 88 808 91 Q 815 60 850 63 Q 876 45 902 68 Q 932 64 936 92 Q 958 100 951 118 Q 946 130 930 130 Z"/>
    <!-- flight path -->
    <path stroke-width="6" stroke-dasharray="18 20" d="M 45 560 C 105 470 170 620 225 525 C 245 490 255 462 266 448"/>
    <!-- ground -->
    <path stroke-width="10" d="M -10 850 Q 250 830 500 848 T 1010 840"/>
    <path d="M 340 925 L 332 905 M 348 925 L 350 899 M 356 925 L 366 907 M 640 935 L 632 915 M 648 935 L 650 909 M 656 935 L 666 917 M 70 920 L 62 900 M 78 920 L 80 894 M 86 920 L 96 902"/>
    <!-- flowers -->
    <g transform="translate(210 700) scale(1.2)">
      <path stroke-width="6" d="M 0 32 L 0 216"/>
      <path stroke-width="6" d="M 0 95 C -20 60 -55 50 -75 55 C -65 85 -35 100 0 95 Z"/>
      <path stroke-width="8" d="M 0 -32 Q 37 -64 28 -16 Q 74 0 28 16 Q 37 64 0 32 Q -37 64 -28 16 Q -74 0 -28 -16 Q -37 -64 0 -32 Z"/>
      <circle stroke-width="6" cx="0" cy="0" r="15"/>
    </g>
    <g transform="translate(500 700) scale(1.2)">
      <path stroke-width="6" d="M 0 45 L 0 216"/>
      <path stroke-width="6" d="M 0 95 C 20 62 52 52 72 57 C 62 85 34 100 0 95 Z"/>
      <path stroke-width="8" d="M -40 -40 C -40 20 -22 45 0 45 C 22 45 40 20 40 -40 L 20 -18 L 0 -45 L -20 -18 Z"/>
    </g>
    <g transform="translate(790 690) scale(1.2)">
      <path stroke-width="6" d="M 0 40 L 0 225"/>
      <path stroke-width="6" d="M 0 100 C 20 65 55 55 75 60 C 65 90 35 105 0 100 Z"/>
      <path stroke-width="8" d="M 0 -40 Q 32 -78 28 -28 Q 78 -32 40 0 Q 78 32 28 28 Q 32 78 0 40 Q -32 78 -28 28 Q -78 32 -40 0 Q -78 -32 -28 -28 Q -32 -78 0 -40 Z"/>
      <circle stroke-width="6" cx="0" cy="0" r="20"/>
    </g>
    <!-- bee: wings, legs, stinger -->
    <path stroke-width="9" d="M 400 334 C 360 290 340 200 385 180 C 430 160 470 240 465 318"/>
    <path stroke-width="9" d="M 478 318 C 475 240 520 170 565 180 C 610 190 600 280 540 327"/>
    <path stroke-width="6" d="M 425 300 Q 400 250 392 210 M 505 300 Q 525 240 555 205"/>
    <path stroke-width="8" d="M 420 533 Q 412 560 398 568 M 470 541 Q 466 568 452 578 M 520 536 Q 520 562 508 574"/>
    <path stroke-width="9" d="M 326 412 L 285 432 L 328 452"/>
    <!-- bee: body and stripes -->
    <path stroke-width="10" d="M 564 336 A 155 112 0 1 0 626 467"/>
    <path d="M 395 336 Q 378 430 395 524 M 458 320 Q 440 430 458 540 M 520 323 Q 502 430 520 538"/>
    <!-- bee: head -->
    <path stroke-width="8" d="M 662 295 Q 668 250 688 222 M 698 312 Q 725 270 752 248"/>
    <circle stroke-width="8" cx="696" cy="208" r="16"/>
    <circle stroke-width="8" cx="764" cy="238" r="16"/>
    <circle stroke-width="10" cx="640" cy="380" r="88"/>
    <circle cx="622" cy="365" r="24"/>
    <circle cx="680" cy="365" r="24"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 611 368 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 Z M 613 361 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 669 368 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 Z M 671 361 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path d="M 625 412 Q 651 436 677 412"/>
  </g>
</svg>
`,l=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- sky -->
    <circle stroke-width="9" cx="900" cy="100" r="38"/>
    <path d="M 950 100 L 964 100 M 935 135 L 945 145 M 900 150 L 900 164 M 865 135 L 855 145 M 850 100 L 836 100 M 865 65 L 855 55 M 900 50 L 900 36 M 935 65 L 945 55"/>
    <circle fill="#111" stroke="none" cx="887" cy="93" r="5"/>
    <circle fill="#111" stroke="none" cx="913" cy="93" r="5"/>
    <path d="M 886 110 Q 900 122 914 110"/>
    <path stroke-width="9" d="M 62 104 Q 40 104 42 84 Q 46 64 70 68 Q 77 42 108 46 Q 131 30 152 54 Q 180 52 182 78 Q 200 84 194 98 Q 190 104 176 104 Z"/>
    <!-- ground -->
    <path stroke-width="10" d="M -10 840 Q 125 815 250 835 T 500 835 T 750 835 T 1010 830"/>
    <!-- tulip -->
    <path d="M 130 800 L 130 975"/>
    <path d="M 130 905 C 150 870 185 860 205 865 C 195 895 165 910 130 905 Z"/>
    <path stroke-width="9" d="M 95 730 C 95 780 110 800 130 800 C 150 800 165 780 165 730 L 148 750 L 130 725 L 112 750 Z"/>
    <!-- daisy -->
    <path d="M 865 794 L 865 975"/>
    <path d="M 865 905 C 845 870 810 860 790 866 C 800 895 830 910 865 905 Z"/>
    <path stroke-width="9" d="M 865 726 Q 904 692 894 743 Q 943 760 894 777 Q 904 828 865 794 Q 826 828 836 777 Q 787 760 836 743 Q 826 692 865 726 Z"/>
    <circle cx="865" cy="760" r="16"/>
    <!-- little flower -->
    <path d="M 500 938 L 500 972"/>
    <path d="M 500 965 C 520 942 545 937 562 942 C 552 965 528 972 500 965 Z"/>
    <path stroke-width="9" d="M 500 874 Q 533 855 525 892 Q 553 917 515 921 Q 500 956 485 921 Q 447 917 475 892 Q 467 855 500 874 Z"/>
    <circle cx="500" cy="900" r="12"/>
    <path d="M 115 975 L 107 955 M 123 975 L 125 949 M 131 975 L 141 957 M 850 975 L 842 955 M 858 975 L 860 949 M 866 975 L 876 957 M 300 900 L 292 880 M 308 900 L 310 874 M 316 900 L 326 882 M 680 920 L 672 900 M 688 920 L 690 894 M 696 920 L 706 902"/>
    <!-- butterfly: wings -->
    <path stroke-width="10" d="M 461 395 C 425 300 370 150 260 150 C 170 150 125 200 135 275 C 145 360 230 430 330 458 C 390 474 440 480 465 480"/>
    <path stroke-width="10" d="M 467 500 C 420 500 320 495 255 540 C 200 580 215 690 290 715 C 360 738 440 680 482 590"/>
    <path stroke-width="10" d="M 539 395 C 575 300 630 150 740 150 C 830 150 875 200 865 275 C 855 360 770 430 670 458 C 610 474 560 480 535 480"/>
    <path stroke-width="10" d="M 533 500 C 580 500 680 495 745 540 C 800 580 785 690 710 715 C 640 738 560 680 518 590"/>
    <path d="M 430 395 C 410 300 350 200 270 198 C 205 196 178 235 185 285 C 193 345 260 400 330 420 C 385 436 438 430 430 395 Z"/>
    <path d="M 570 395 C 590 300 650 200 730 198 C 795 196 822 235 815 285 C 807 345 740 400 670 420 C 615 436 562 430 570 395 Z"/>
    <circle cx="290" cy="300" r="40"/>
    <circle cx="710" cy="300" r="40"/>
    <path d="M 450 590 C 400 640 320 680 285 660 C 250 640 255 570 300 550 C 350 530 420 545 450 590 Z"/>
    <path d="M 550 590 C 600 640 680 680 715 660 C 750 640 745 570 700 550 C 650 530 580 545 550 590 Z"/>
    <!-- butterfly: body -->
    <path stroke-width="10" d="M 465 316 C 455 400 463 560 500 645 C 537 560 545 400 535 316"/>
    <path d="M 461 420 Q 500 432 539 420 M 466 490 Q 500 502 534 490 M 476 560 Q 500 570 524 560"/>
    <!-- antennae -->
    <path stroke-width="8" d="M 476 189 Q 455 120 410 113 M 524 189 Q 545 120 590 113"/>
    <circle stroke-width="8" cx="395" cy="108" r="16"/>
    <circle stroke-width="8" cx="605" cy="108" r="16"/>
    <!-- butterfly: head -->
    <circle stroke-width="10" cx="500" cy="255" r="70"/>
    <circle cx="473" cy="245" r="24"/>
    <circle cx="527" cy="245" r="24"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 461 247 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z M 463 241 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 515 247 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z M 517 241 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path d="M 476 286 Q 500 304 524 286"/>
  </g>
</svg>
`,u=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- sun and cloud -->
    <circle stroke-width="9" cx="875" cy="110" r="46"/>
    <path d="M 933 110 L 947 110 M 916 151 L 926 161 M 875 168 L 875 182 M 834 151 L 824 161 M 817 110 L 803 110 M 834 69 L 824 59 M 875 52 L 875 38 M 916 69 L 926 59"/>
    <circle fill="#111" stroke="none" cx="860" cy="102" r="6"/>
    <circle fill="#111" stroke="none" cx="890" cy="102" r="6"/>
    <path d="M 858 122 Q 875 136 892 122"/>
    <path stroke-width="9" d="M 80 140 Q 55 140 58 118 Q 62 98 88 101 Q 95 70 130 73 Q 156 55 182 78 Q 212 74 216 102 Q 238 110 231 128 Q 226 140 210 140 Z"/>
    <!-- ground -->
    <path stroke-width="10" d="M -10 905 Q 250 885 500 903 T 1010 895"/>
    <path d="M 120 960 L 112 940 M 128 960 L 130 934 M 136 960 L 146 942 M 480 965 L 472 945 M 488 965 L 490 939 M 496 965 L 506 947 M 840 955 L 832 935 M 848 955 L 850 929 M 856 955 L 866 937"/>
    <!-- leaf -->
    <path stroke-width="10" d="M 110 600 C 75 680 70 800 88 902"/>
    <path stroke-width="10" d="M 110 600 C 225 389 497 307 678 336 M 815 400 C 856 439 888 493 910 560 M 110 600 C 250 800 520 880 700 830 C 800 800 870 690 910 560"/>
    <path stroke-width="8" d="M 110 600 C 330 650 640 650 910 560"/>
    <circle fill="#111" stroke="none" cx="116" cy="604" r="9"/>
    <path d="M 193 616 L 265 747 M 290 628 L 416 818 M 401 633 L 541 842 M 575 627 L 709 827 M 727 607 L 820 743 M 193 616 L 345 389 M 290 628 L 333.5 562.8 M 406.3 454.9 L 480.6 343.7 M 401 633 L 463.8 539.9 M 525.4 448.6 L 604.1 330.4 M 575 627 L 642.3 527.8 M 727 607 L 845 433"/>
    <!-- caterpillar -->
    <path stroke-width="9" d="M 364.6 481.7 A 48 48 0 1 0 370.5 540.8"/>
    <path stroke-width="9" d="M 446.2 469.7 A 52 52 0 1 0 455.1 532.9"/>
    <path stroke-width="9" d="M 539.5 462.7 A 55 55 0 1 0 535.5 532.3"/>
    <path stroke-width="9" d="M 614.2 456.9 A 55 55 0 1 0 630.8 521.1"/>
    <path stroke-width="9" d="M 661.3 423.1 A 55 55 0 1 0 719.5 470.5"/>
    <circle cx="318" cy="500" r="13"/>
    <circle cx="398" cy="492" r="13"/>
    <circle cx="483" cy="480" r="13"/>
    <circle cx="568" cy="485" r="13"/>
    <circle cx="650" cy="463" r="13"/>
    <path stroke-width="8" d="M 714 315 Q 700 280 696 246 M 756 315 Q 772 280 778 249"/>
    <circle stroke-width="8" cx="690" cy="232" r="15"/>
    <circle stroke-width="8" cx="785" cy="236" r="15"/>
    <circle stroke-width="10" cx="735" cy="392" r="80"/>
    <circle cx="707" cy="385" r="23"/>
    <circle cx="763" cy="385" r="23"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 696 388 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z M 699 382 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 752 388 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z M 755 382 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path d="M 713 425 Q 735 446 757 425"/>
  </g>
</svg>
`,d=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <!-- sun and clouds -->
    <circle stroke-width="7" cx="880" cy="122" r="50"/>
    <path stroke-width="6" d="M 944 122 L 962 122 M 925.3 167.3 L 938 180 M 880 186 L 880 204 M 834.7 167.3 L 822 180 M 816 122 L 798 122 M 834.7 76.7 L 822 64 M 880 58 L 880 40 M 925.3 76.7 L 938 64"/>
    <circle fill="#111" stroke="none" cx="864" cy="112" r="6"/>
    <circle fill="#111" stroke="none" cx="896" cy="112" r="6"/>
    <path d="M 861 133 Q 880 149 899 133"/>
    <path d="M 350 140 Q 322 140 325 115 Q 330 90 360 94 Q 368 58 410 62 Q 440 40 470 68 Q 505 62 510 95 Q 538 102 530 125 Q 524 140 505 140 Z"/>
    <path d="M 62 112 Q 42 112 44 94 Q 48 77 70 80 Q 76 56 104 59 Q 124 44 144 63 Q 170 60 173 83 Q 190 90 184 104 Q 180 112 168 112 Z"/>
    <!-- hill -->
    <path d="M -10 537 C -1 535 26 530 44 528 C 62 525 80 522 98 520 C 117 517 135 516 153 515 C 171 513 189 513 207 513 C 225 513 243 514 261 515 C 279 517 297 519 315 521 C 333 524 352 527 370 530 C 388 533 406 536 424 539 C 442 542 460 545 478 548 C 496 550 514 552 532 554 C 550 555 568 557 587 557 C 605 557 623 557 641 556 C 659 555 686 552 695 551 M 715 549 C 723 547 748 544 764 541 C 780 538 797 535 813 533 C 829 530 854 526 862 525 M 878 522 C 885 521 907 518 922 517 C 937 516 951 514 966 514 C 981 513 1003 513 1010 513"/>
    <!-- grass -->
    <path d="M -10 955 L 15 925 L 40 955 L 65 925 L 90 955 L 115 925 L 140 955 L 165 925 L 190 955 L 215 925 L 240 955 L 265 925 L 290 955 L 315 925 L 340 955 L 365 925 L 390 955 L 415 925 L 440 955 L 465 925 L 490 955 L 515 925 L 540 955 L 565 925 L 590 955 L 615 925 L 640 955 L 665 925 L 690 955 L 715 925 L 740 955 L 765 925 L 790 955 L 815 925 L 840 955 L 865 925 L 890 955 L 915 925 L 940 955 L 965 925 L 990 955 L 1015 925 L 1040 955"/>
    <!-- sunflower -->
    <path d="M 695 384.7 L 695 949 M 715 384.7 L 715 925"/>
    <path d="M 695 680 C 655 685 585 655 575 610 C 605 615 665 625 695 640"/>
    <path stroke-width="5" d="M 695 660 Q 630 650 608.6 624"/>
    <path d="M 715 760 C 755 765 825 735 835 690 C 805 695 745 705 715 720"/>
    <path stroke-width="5" d="M 715 740 Q 780 730 801.4 704"/>
    <path d="M 775 300 Q 830.6 333.6 765.6 335 Q 796.9 391.9 740 360.6 Q 738.6 425.6 705 370 Q 671.4 425.6 670 360.6 Q 613.1 391.9 644.4 335 Q 579.4 333.6 635 300 Q 579.4 266.4 644.4 265 Q 613.1 208.1 670 239.4 Q 671.4 174.4 705 230 Q 738.6 174.4 740 239.4 Q 796.9 208.1 765.6 265 Q 830.6 266.4 775 300 Z"/>
    <path stroke-width="5" d="M 775 300 L 761 300 M 765.6 335 L 753.5 328 M 740 360.6 L 733 348.5 M 705 370 L 705 356 M 670 360.6 L 677 348.5 M 644.4 335 L 656.5 328 M 635 300 L 649 300 M 644.4 265 L 656.5 272 M 670 239.4 L 677 251.5 M 705 230 L 705 244 M 740 239.4 L 733 251.5 M 765.6 265 L 753.5 272"/>
    <circle cx="705" cy="300" r="56"/>
    <ellipse fill="#111" stroke="none" cx="686" cy="288" rx="8" ry="11"/>
    <ellipse fill="#111" stroke="none" cx="724" cy="288" rx="8" ry="11"/>
    <path stroke-width="6" d="M 682 318 Q 705 338 728 318"/>
    <!-- sunflower -->
    <path d="M 862 493.9 L 862 928.6 M 878 493.9 L 878 940.6"/>
    <path d="M 878 650 C 918 655 935 630 945 585 C 915 590 908 595 878 610"/>
    <path stroke-width="5" d="M 878 630 Q 916.5 620 926.2 597.6"/>
    <path d="M 922 430 Q 964.7 455.4 915 456 Q 939.3 499.3 896 475 Q 895.4 524.7 870 482 Q 844.6 524.7 844 475 Q 800.7 499.3 825 456 Q 775.3 455.4 818 430 Q 775.3 404.6 825 404 Q 800.7 360.7 844 385 Q 844.6 335.3 870 378 Q 895.4 335.3 896 385 Q 939.3 360.7 915 404 Q 964.7 404.6 922 430 Z"/>
    <path stroke-width="5" d="M 922 430 L 910 430 M 915 456 L 904.6 450 M 896 475 L 890 464.6 M 870 482 L 870 470 M 844 475 L 850 464.6 M 825 456 L 835.4 450 M 818 430 L 830 430 M 825 404 L 835.4 410 M 844 385 L 850 395.4 M 870 378 L 870 390 M 896 385 L 890 395.4 M 915 404 L 904.6 410"/>
    <circle cx="870" cy="430" r="40"/>
    <circle stroke-width="5" cx="870" cy="430" r="22"/>
    <circle fill="#111" stroke="none" cx="899.2" cy="442.1" r="3.5"/>
    <circle fill="#111" stroke="none" cx="882.1" cy="459.2" r="3.5"/>
    <circle fill="#111" stroke="none" cx="857.9" cy="459.2" r="3.5"/>
    <circle fill="#111" stroke="none" cx="840.8" cy="442.1" r="3.5"/>
    <circle fill="#111" stroke="none" cx="840.8" cy="417.9" r="3.5"/>
    <circle fill="#111" stroke="none" cx="857.9" cy="400.8" r="3.5"/>
    <circle fill="#111" stroke="none" cx="882.1" cy="400.8" r="3.5"/>
    <circle fill="#111" stroke="none" cx="899.2" cy="417.9" r="3.5"/>
    <!-- tulip -->
    <path d="M 92 715.7 L 92 952.6 M 108 715.7 L 108 933.4"/>
    <path d="M 92 845 C 37 820 37 795 45 735 C 57 770 82 805 92 780"/>
    <path d="M 60 620 C 60 690 78 717 100 717 C 122 717 140 690 140 620 L 120 645 L 100 615 L 80 645 L 60 620 Z"/>
    <path stroke-width="5" d="M 80 645 Q 82 685 86.9 713.4 M 120 645 Q 118 685 113.1 713.4"/>
    <!-- tulip -->
    <path d="M 192 675.7 L 192 952.6 M 208 675.7 L 208 933.4"/>
    <path d="M 208 845 C 263 820 263 805 255 745 C 243 780 218 805 208 780"/>
    <path d="M 160 580 C 160 650 178 677 200 677 C 222 677 240 650 240 580 L 220 605 L 200 575 L 180 605 L 160 580 Z"/>
    <path stroke-width="5" d="M 180 605 Q 182 645 186.9 673.4 M 220 605 Q 218 645 213.1 673.4"/>
    <!-- tulip -->
    <path d="M 292 720.7 L 292 952.6 M 308 720.7 L 308 933.4"/>
    <path d="M 308 860 C 363 835 366 820 358 760 C 346 795 318 825 308 800"/>
    <path d="M 260 625 C 260 695 278 722 300 722 C 322 722 340 695 340 625 L 320 650 L 300 620 L 280 650 L 260 625 Z"/>
    <path stroke-width="5" d="M 280 650 Q 282 690 286.9 718.4 M 320 650 Q 318 690 313.1 718.4"/>
    <path d="M 630 850 Q 655 828.7 649.1 861 Q 680 872 649.1 883 Q 655 915.3 630 894 Q 605 915.3 610.9 883 Q 580 872 610.9 861 Q 605 828.7 630 850 Z"/>
    <circle stroke-width="5" cx="630" cy="872" r="11"/>
    <path d="M 375 853 Q 400 831.7 394.1 864 Q 425 875 394.1 886 Q 400 918.3 375 897 Q 350 918.3 355.9 886 Q 325 875 355.9 864 Q 350 831.7 375 853 Z"/>
    <circle stroke-width="5" cx="375" cy="875" r="11"/>
    <!-- ladybird -->
    <path stroke-width="5" d="M 497 746 L 487 726 M 513 746 L 523 726"/>
    <circle fill="#111" stroke="none" cx="485" cy="721" r="5.5"/>
    <circle fill="#111" stroke="none" cx="525" cy="721" r="5.5"/>
    <path stroke-width="5" d="M 452 808 L 436 798 M 449 830 L 431 832 M 454 853 L 438 865 M 558 808 L 574 798 M 561 830 L 579 832 M 556 853 L 572 865"/>
    <path d="M 477.9 779 A 28 28 0 1 1 532.1 779"/>
    <circle cx="505" cy="828" r="56"/>
    <path d="M 505 772 L 505 884"/>
    <circle stroke-width="5" cx="481" cy="810" r="11"/>
    <circle stroke-width="5" cx="482" cy="848" r="11"/>
    <circle stroke-width="5" cx="529" cy="810" r="11"/>
    <circle stroke-width="5" cx="528" cy="848" r="11"/>
    <circle fill="#111" stroke="none" cx="496" cy="760" r="4.5"/>
    <circle fill="#111" stroke="none" cx="514" cy="760" r="4.5"/>
    <!-- bee -->
    <g transform="translate(470 380) scale(0.42) translate(-530 -375)" stroke-width="16">
      <path d="M 400 334 C 360 290 340 200 385 180 C 430 160 470 240 465 318"/>
      <path d="M 478 318 C 475 240 520 170 565 180 C 610 190 600 280 540 327"/>
      <path stroke-width="12" d="M 425 300 Q 400 250 392 210 M 505 300 Q 525 240 555 205"/>
      <path stroke-width="13" d="M 420 533 Q 412 560 398 568 M 470 541 Q 466 568 452 578 M 520 536 Q 520 562 508 574"/>
      <path fill="#111" d="M 326 412 L 285 432 L 328 452 Z"/>
      <path stroke-width="17" d="M 564 336 A 155 112 0 1 0 626 467"/>
      <path stroke-width="12" d="M 395 336 Q 378 430 395 524 M 458 320 Q 440 430 458 540 M 520 323 Q 502 430 520 538"/>
      <path stroke-width="13" d="M 662 295 Q 668 250 688 222 M 698 312 Q 725 270 752 248"/>
      <circle fill="#111" stroke="none" cx="696" cy="208" r="20"/>
      <circle fill="#111" stroke="none" cx="764" cy="238" r="20"/>
      <circle stroke-width="17" cx="640" cy="380" r="88"/>
      <circle fill="#111" stroke="none" cx="620" cy="365" r="17"/>
      <circle fill="#111" stroke="none" cx="672" cy="365" r="17"/>
      <path stroke-width="12" d="M 620 410 Q 646 436 672 410"/>
    </g>
    <!-- butterfly -->
    <g transform="translate(215 320) scale(0.4) translate(-500 -430)" stroke-width="13">
      <path stroke-width="17" d="M 465 316 C 425 255 370 150 260 150 C 170 150 125 200 135 275 C 145 360 230 430 330 458 C 390 474 440 480 465 480"/>
      <path stroke-width="17" d="M 467 500 C 420 500 320 495 255 540 C 200 580 215 690 290 715 C 360 738 440 680 482 590"/>
      <path stroke-width="17" d="M 535 316 C 575 255 630 150 740 150 C 830 150 875 200 865 275 C 855 360 770 430 670 458 C 610 474 560 480 535 480"/>
      <path stroke-width="17" d="M 533 500 C 580 500 680 495 745 540 C 800 580 785 690 710 715 C 640 738 560 680 518 590"/>
      <path d="M 430 395 C 410 300 350 200 270 198 C 205 196 178 235 185 285 C 193 345 260 400 330 420 C 385 436 438 430 430 395 Z"/>
      <path d="M 570 395 C 590 300 650 200 730 198 C 795 196 822 235 815 285 C 807 345 740 400 670 420 C 615 436 562 430 570 395 Z"/>
      <circle cx="290" cy="300" r="40"/>
      <circle cx="710" cy="300" r="40"/>
      <path d="M 445 592 C 400 640 320 675 288 657 C 256 638 262 575 303 556 C 350 538 418 552 445 592 Z"/>
      <path d="M 555 592 C 600 640 680 675 712 657 C 744 638 738 575 697 556 C 650 538 582 552 555 592 Z"/>
      <path stroke-width="17" d="M 465 316 C 455 400 463 560 500 645 C 537 560 545 400 535 316"/>
      <path d="M 461 420 Q 500 432 539 420 M 466 500 Q 500 512 534 500"/>
      <path d="M 476 189 Q 455 120 410 113 M 524 189 Q 545 120 590 113"/>
      <circle fill="#111" stroke="none" cx="397" cy="110" r="20"/>
      <circle fill="#111" stroke="none" cx="603" cy="110" r="20"/>
      <circle stroke-width="17" cx="500" cy="255" r="70"/>
      <circle fill="#111" stroke="none" cx="475" cy="245" r="15"/>
      <circle fill="#111" stroke="none" cx="525" cy="245" r="15"/>
      <path d="M 476 286 Q 500 306 524 286"/>
    </g>
  </g>
</svg>
`,f=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(0 15)">
      <!-- legs -->
      <path stroke-width="13" d="M 233 480 L 172 452 M 210 600 L 145 606 M 243 720 L 185 762 M 767 480 L 828 452 M 790 600 L 855 606 M 757 720 L 815 762"/>
      <!-- antennae -->
      <path stroke-width="10" d="M 441 173 Q 425 132 389 117 M 559 173 Q 575 132 611 117"/>
      <circle stroke-width="12" cx="365" cy="100" r="28"/>
      <circle stroke-width="12" cx="635" cy="100" r="28"/>
      <!-- shell -->
      <path stroke-width="14" d="M 366 342 A 290 280 0 1 0 634 342"/>
      <path stroke-width="12" d="M 500 440 L 500 870"/>
      <circle cx="358" cy="522" r="54"/>
      <circle cx="318" cy="682" r="48"/>
      <circle cx="423" cy="772" r="48"/>
      <circle cx="642" cy="522" r="54"/>
      <circle cx="682" cy="682" r="48"/>
      <circle cx="577" cy="772" r="48"/>
      <!-- head and face -->
      <circle stroke-width="14" cx="500" cy="300" r="140"/>
      <circle cx="445" cy="285" r="38"/>
      <circle cx="555" cy="285" r="38"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 426 291 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0 Z M 431 280 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 536 291 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0 Z M 541 280 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
      <path d="M 455 355 Q 500 392 545 355"/>
    </g>
  </g>
</svg>
`,p=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(0 40)">
      <!-- ground -->
      <path stroke-width="14" d="M -10 770 L 1010 770"/>
      <!-- body -->
      <path stroke-width="14" d="M 222 570 C 205 680 160 745 85 768 M 790 770 C 830 760 850 720 855 680 C 860 630 862 580 860 520 C 860 470 840 400 790 395 C 745 392 715 425 712 470 C 710 500 680 530 646 549"/>
      <!-- eye stalks -->
      <path stroke-width="12" d="M 770 398 L 744 289 M 815 402 L 847 308"/>
      <circle stroke-width="12" cx="735" cy="250" r="40"/>
      <circle stroke-width="12" cx="860" cy="270" r="40"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 715 254 a 24 24 0 1 0 48 0 a 24 24 0 1 0 -48 0 Z M 723 242 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 840 274 a 24 24 0 1 0 48 0 a 24 24 0 1 0 -48 0 Z M 848 262 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
      <!-- smile -->
      <path d="M 778 476 Q 810 506 840 480"/>
      <!-- shell -->
      <circle stroke-width="14" cx="430" cy="470" r="230"/>
      <path stroke-width="12" d="M 414 468 C 414 466 415 457 418 452 C 422 447 427 442 433 439 C 439 437 448 435 455 436 C 463 437 472 440 478 446 C 485 451 492 459 495 468 C 498 477 500 489 498 499 C 496 509 491 521 483 529 C 475 538 464 546 453 549 C 441 553 426 554 413 551 C 401 548 386 541 376 532 C 366 522 356 508 352 493 C 348 479 347 461 351 446 C 355 430 364 413 376 401 C 387 389 405 378 422 374 C 439 369 460 369 478 373 C 496 378 516 389 530 403 C 543 417 556 437 561 457 C 566 477 566 501 560 522 C 555 542 542 565 526 580 C 510 596 487 609 464 615 C 442 621 414 621 391 614 C 367 607 342 593 325 575 C 308 556 293 530 287 505 C 280 480 281 449 288 423 C 296 397 318 368 333 350"/>
    </g>
  </g>
</svg>
`,m=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="12" d="M 328 522 C 352 502 398 504 410 528 C 420 548 416 576 414 598 C 412 622 388 626 384 604 C 382 596 380 590 380 590 C 378 600 378 604 376 610 C 370 628 346 626 348 604 C 348 598 348 592 348 592 C 344 606 340 614 336 616 C 322 622 318 610 320 596 C 320 572 314 540 328 522 Z"/>
    <path stroke-width="12" d="M 652.0 522 C 628.0 502 582.0 504 570.0 528 C 560.0 548 564.0 576 566.0 598 C 568.0 622 592.0 626 596.0 604 C 598.0 596 600.0 590 600.0 590 C 602.0 600 602.0 604 604.0 610 C 610.0 628 634.0 626 632.0 604 C 632.0 598 632.0 592 632.0 592 C 636.0 606 640.0 614 644.0 616 C 658.0 622 662.0 610 660.0 596 C 660.0 572 666.0 540 652.0 522 Z"/>
    <path stroke-width="15" d="M 321.5 535.2 L 300.0 512.0 L 255.0 560.0 C 245.0 760.0 360.0 908.0 500.0 908.0 C 640.0 908.0 755.0 760.0 745.0 560.0 L 700.0 512.0 L 661.2 553.9 M 564.0 550.9 L 550.0 566.0 L 500.0 512.0 L 450.0 566.0 L 400.0 512.0 L 397.2 515.0"/>
    <path stroke-width="14" d="M 404 236 C 400 160 450 104 520 102 C 588 100 632 150 636 210 L 604 192 L 572 222 L 540 196 L 506 230 L 474 204 L 440 238 Z"/>
    <path stroke-width="14" d="M 418.0 531.4 L 418.0 380.0 C 408.3 297.9 437.3 240.9 486.2 213.9 M 538.7 197.3 C 539.5 197.2 540.4 197.1 541.2 197.0 M 597.6 198.0 C 605.7 198.9 613.5 200.1 621.1 201.6 M 635.6 204.9 C 696.8 220.8 737.1 257.4 740.0 310.0 C 744.0 372.0 704.0 404.0 642.0 408.0 C 600.0 411.0 574.0 418.0 566.0 444.0 L 566.0 539.0"/>
    <path stroke-width="12" d="M 422.0 300.1 L 422.0 300.0 L 372.0 318.0 L 412.0 352.0 L 417.9 321.1"/>
    <path stroke-width="12" d="M 412.0 368.0 L 364.0 392.0 L 412.0 420.0 L 412.0 368.0 Z"/>
    <path stroke-width="12" d="M 412.0 440.0 L 366.0 462.0 L 414.0 492.0 L 412.0 440.0 Z"/>
    <path stroke-width="10" d="M 308.1 711.6 A 34.0 26.0 -20 1 0 371.9 688.4 A 34.0 26.0 -20 1 0 308.1 711.6 Z"/>
    <path stroke-width="10" d="M 460.0 800.0 A 40.0 30.0 0 0 0 540.0 800.0 A 40.0 30.0 0 0 0 460.0 800.0 Z"/>
    <path stroke-width="10" d="M 621.0 682.2 A 30.0 24.0 15 0 0 679.0 697.8 A 30.0 24.0 15 0 0 621.0 682.2 Z"/>
    <path stroke-width="10" d="M 472.4 154.9 A 28 20 -10 1 0 527.6 145.1 A 28 20 -10 1 0 472.4 154.9 Z"/>
    <circle cx="598" cy="284" r="46" stroke-width="12"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 579 291 A 27 27 0 1 0 633 291 A 27 27 0 1 0 579 291 Z M 606 280 A 10 10 0 1 0 626 280 A 10 10 0 1 0 606 280 Z"/>
    <circle cx="700" cy="258" r="8" fill="#111" stroke="none"/>
    <path stroke-width="12" d="M 734 336 C 704 372 660 378 630 366"/>
    <path stroke-width="10" d="M 630 366 C 620 362 614 354 616 344"/>
    <circle cx="556" cy="366" r="20" stroke-width="10"/>
  </g>
</svg>
`,h=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="728" cy="204" r="27" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 712.8 204.5 A 15.7 15.7 0 1 0 744.2 204.5 A 15.7 15.7 0 1 0 712.8 204.5 Z M 726.3 200.1 A 6.5 6.5 0 1 0 739.3 200.1 A 6.5 6.5 0 1 0 726.3 200.1 Z"/>
    <circle cx="796.0" cy="196.0" r="6" fill="#111" stroke="none"/>
    <path stroke-width="8" d="M 806 232 C 782 246 748 248 726 236"/>
    <path stroke-width="7" d="M 726 236 C 718 232 714 224 716 216"/>
    <path stroke-width="10" d="M 640 222 C 640 180 676 158 708 162 C 724 146 756 146 768 166 C 800 172 820 196 816 222 C 812 252 770 262 720 260 C 670 258 640 252 640 222 Z"/>
    <path stroke-width="10" d="M 605.8 582.3 C 610.2 573.0 614.4 563.3 618.1 554.1 C 624.2 539.2 628.9 524.3 633.4 509.6 C 638.0 494.9 641.6 480.3 645.2 465.9 C 648.7 451.4 651.7 437.1 654.7 422.9 C 657.6 408.7 660.2 394.7 662.9 380.9 C 665.6 367.0 668.1 353.1 670.8 340.0 C 673.5 326.9 676.1 313.4 679.1 302.1 C 682.1 290.8 683.3 281.1 688.9 272.1 C 692.4 266.6 702.0 263.8 708.1 259.4 M 640.9 210.7 C 636.3 216.0 632.1 221.8 628.2 226.5 C 617.4 239.4 609.5 258.0 602.5 272.8 C 595.5 287.7 591.3 301.8 586.3 315.7 C 581.2 329.6 576.8 343.0 572.1 356.3 C 567.5 369.7 563.1 382.9 558.4 395.8 C 553.7 408.7 549.1 421.5 544.1 433.9 C 539.2 446.3 534.1 458.4 528.7 470.0 C 523.2 481.6 517.6 493.0 511.5 503.5 C 509.5 507.0 507.6 510.3 505.6 513.6"/>
    <path stroke-width="10" d="M 502.4 744.4 C 503.8 796.9 505.1 844.3 504.0 862.0 C 504.0 874.0 510.0 880.0 522.0 880.0 L 578.0 880.0 C 590.0 880.0 596.0 874.0 596.0 862.0 C 594.3 835.6 598.1 742.4 599.5 665.7"/>
    <path stroke-width="10" d="M 231.5 740.0 C 233.1 793.1 235.3 840.6 234.0 862.0 C 234.0 874.0 240.0 880.0 252.0 880.0 L 314.0 880.0 C 326.0 880.0 332.0 874.0 332.0 862.0 C 330.9 845.1 332.1 811.9 333.5 772.6"/>
    <path stroke-width="10" d="M 205.3 716.1 A 215.0 128.0 -10 0 0 231.4 740.1 M 333.5 772.6 A 215.0 128.0 -10 0 0 502.4 744.4 M 599.6 665.7 A 215.0 128.0 -10 0 0 611.7 602.7 A 215.0 128.0 -10 0 0 605.8 582.3 M 505.6 513.6 A 215.0 128.0 -10 0 0 255.4 558.7 M 251.5 561.4 A 215.0 128.0 -10 0 0 221.4 586.9"/>
    <path stroke-width="10" d="M 255.5 558.7 C 254.1 559.0 252.8 560.0 251.5 561.4 M 221.4 586.9 C 218.1 588.6 214.8 590.4 211.5 592.1 C 202.9 596.7 194.4 601.5 186.0 606.5 C 177.7 611.4 169.5 616.5 161.5 621.7 C 153.5 626.9 145.6 632.3 137.9 637.7 C 130.2 643.2 122.6 648.8 115.1 654.5 C 107.7 660.2 100.4 666.0 93.2 671.9 C 86.0 677.8 79.0 683.8 72.1 689.9 C 65.2 695.9 58.4 702.1 51.7 708.3 C 45.1 714.6 36.6 722.5 32.2 727.2 C 27.8 731.9 26.3 733.0 25.4 736.4 C 24.6 739.9 25.3 744.8 27.2 747.8 C 29.0 750.8 33.0 753.7 36.4 754.6 C 39.9 755.4 41.7 754.5 47.8 752.8 C 53.9 751.2 64.6 747.2 73.0 744.6 C 81.4 742.0 89.7 739.5 98.1 737.2 C 106.4 734.9 114.8 732.7 123.2 730.7 C 131.5 728.7 139.9 726.8 148.2 725.1 C 156.5 723.4 164.9 721.9 173.2 720.5 C 181.5 719.2 189.8 718.0 198.0 716.9 C 200.4 716.6 202.9 716.3 205.3 716.1"/>
    <path stroke-width="10" d="M 331.6 847.8 C 334.3 849.3 337.8 850.0 342.0 850.0 L 378.0 850.0 C 390.0 850.0 396.0 844.0 396.0 832.0 C 394.9 814.3 396.2 797.2 397.7 772.0"/>
    <path stroke-width="10" d="M 426.9 767.7 C 428.1 794.9 429.0 816.7 428.0 832.0 C 428.0 844.0 434.0 850.0 446.0 850.0 L 504.4 850.0"/>
    <path stroke-width="7" d="M 245 880 V 858 A 13 13 0 0 1 271 858 V 880 M 275 880 V 858 A 13 13 0 0 1 301 858 V 880 M 305 880 V 858 A 13 13 0 0 1 331 858 V 880 M 513 880 V 858 A 13 13 0 0 1 539 858 V 880 M 543 880 V 858 A 13 13 0 0 1 569 858 V 880 M 573 880 V 858 A 13 13 0 0 1 599 858 V 880"/>
    <path stroke-width="7" d="M 360.6 596.9 A 40.0 28.0 -10 1 0 439.4 583.1 A 40.0 28.0 -10 1 0 360.6 596.9 Z"/>
    <path stroke-width="7" d="M 272.4 634.9 A 28.0 22.0 -10 1 0 327.6 625.1 A 28.0 22.0 -10 1 0 272.4 634.9 Z"/>
    <path stroke-width="7" d="M 454.0 640.0 A 26.0 20.0 0 0 0 506.0 640.0 A 26.0 20.0 0 0 0 454.0 640.0 Z"/>
    <path stroke-width="7" d="M 584.0 470.0 A 16.0 16.0 0 0 0 616.0 470.0 A 16.0 16.0 0 0 0 584.0 470.0 Z"/>
    <path stroke-width="7" d="M 612.0 380.0 A 13.0 13.0 0 0 0 638.0 380.0 A 13.0 13.0 0 0 0 612.0 380.0 Z"/>
    <path stroke-width="7" d="M 358.0 690.0 A 22.0 16.0 0 0 0 402.0 690.0 A 22.0 16.0 0 0 0 358.0 690.0 Z"/>
    <path stroke-width="10" d="M 822.0 379.0 C 821.9 379.9 821.9 381.0 821.8 382.0 M 817.6 389.2 C 815.8 388.5 813.6 386.8 811.2 385.1 M 805.2 380.7 C 804.2 380.1 803.3 379.6 802.5 379.4 C 798.1 378.3 794.6 379.5 792.8 382.7 C 791.0 385.9 794.8 397.2 791.8 398.7 C 788.8 400.2 778.9 391.8 774.7 391.5 C 770.4 391.2 767.6 393.5 766.3 396.9 C 765.0 400.4 769.3 410.3 766.8 412.4 C 764.3 414.4 754.9 408.7 751.1 409.4 C 747.4 410.0 745.4 412.9 744.3 416.2 C 743.2 419.6 746.7 427.2 744.7 429.6 C 742.6 432.1 735.0 429.5 732.0 431.1 C 728.9 432.6 727.6 435.8 726.5 438.9 C 725.3 442.0 726.8 447.0 725.2 449.7 C 723.5 452.4 718.8 452.8 716.6 455.1 C 714.4 457.4 713.6 460.7 712.1 463.5 C 710.7 466.3 708.3 469.2 707.9 472.0 C 707.6 474.7 708.3 478.4 710.0 480.0 C 711.7 481.6 715.3 482.1 718.0 481.8 C 720.6 481.4 723.3 479.1 726.0 477.9 C 728.6 476.7 731.6 476.3 733.9 474.5 C 736.2 472.7 737.1 468.1 739.7 467.1 C 742.3 466.1 746.7 468.8 749.6 468.6 C 752.5 468.5 755.2 468.4 757.2 466.1 C 759.3 463.9 759.2 456.0 761.7 455.2 C 764.2 454.5 769.2 461.0 772.2 461.7 C 775.2 462.4 777.6 462.4 779.5 459.6 C 781.4 456.9 781.4 446.0 783.8 445.4 C 786.2 444.7 790.9 454.2 793.8 455.6 C 796.6 456.9 798.8 456.6 800.8 453.4 C 802.9 450.3 803.8 437.5 806.2 436.7 C 808.6 435.9 812.3 447.1 815.0 448.6 C 817.7 450.2 819.8 449.2 822.2 445.9 C 824.6 442.5 827.0 429.6 829.5 428.5 C 832.0 427.4 834.6 438.2 837.2 439.4 C 839.7 440.6 842.2 438.8 845.0 435.6 C 845.4 435.2 845.7 434.7 846.1 434.2"/>
    <path stroke-width="7" d="M 847.6 403.8 C 807.0 411.1 770.8 427.5 738.9 453.1"/>
    <path stroke-width="10" d="M 859.6 335.2 C 858.3 333.5 856.5 333.0 854.5 333.8 C 854.1 333.9 853.6 334.3 853.1 334.7 M 847.6 341.2 C 845.9 343.2 844.4 344.6 843.5 344.2 C 841.2 343.2 842.4 330.7 840.7 327.6 C 839.1 324.5 836.3 324.1 833.6 325.6 C 830.8 327.1 826.4 337.0 824.0 336.6 C 821.6 336.2 821.1 325.7 819.0 323.4 C 817.0 321.2 814.3 321.7 811.8 323.2 C 809.2 324.8 806.3 332.5 803.9 332.7 C 801.5 332.8 799.6 325.5 797.4 324.3 C 795.1 323.1 792.6 324.3 790.3 325.5 C 788.0 326.8 785.9 331.2 783.6 331.8 C 781.3 332.3 778.9 329.0 776.6 328.9 C 774.3 328.7 772.1 330.2 769.9 331.0 C 767.7 331.7 764.9 331.8 763.3 333.3 C 761.6 334.8 760.2 337.7 760.0 340.0 C 759.8 342.3 760.6 345.4 761.8 347.2 C 763.0 349.0 765.4 349.6 767.1 350.8 C 768.8 352.0 770.2 353.9 772.1 354.5 C 774.1 355.0 777.4 352.7 778.9 354.0 C 780.4 355.3 780.2 360.1 781.3 362.1 C 782.4 364.1 783.3 365.9 785.5 365.9 C 787.7 365.9 793.0 360.7 794.3 361.9 C 795.7 363.1 792.9 370.8 793.3 373.3 C 793.8 375.8 794.5 377.3 797.1 376.8 C 799.6 376.3 807.4 369.3 808.6 370.4 C 809.9 371.5 804.6 380.7 804.5 383.4 C 804.5 386.1 805.3 387.2 808.3 386.5 C 811.3 385.7 821.2 378.1 822.6 379.1 C 823.9 380.0 816.7 389.4 816.5 392.0 C 816.2 394.6 817.6 395.2 821.0 394.5 C 824.4 393.8 835.3 387.2 837.0 388.0 C 838.8 388.7 831.2 396.9 831.2 399.1 C 831.2 401.3 833.5 401.6 837.1 401.3 C 839.4 401.1 842.6 400.1 846.2 399.1"/>
    <path stroke-width="7" d="M 856.3 377.4 C 836.0 361.2 813.2 350.2 787.8 344.3"/>
    <path stroke-width="10" d="M 918.5 348.1 C 918.3 348.0 918.2 347.9 918.1 347.8 C 917.2 347.1 914.3 346.4 911.4 345.7 M 908.5 341.4 C 912.4 340.3 918.1 339.1 919.8 338.0 C 920.0 337.9 920.1 337.8 920.3 337.7 M 921.7 335.5 C 921.7 334.7 921.2 333.9 920.2 333.0 C 918.3 331.2 907.9 328.6 908.0 326.9 C 908.0 325.2 918.5 324.5 920.6 322.9 C 922.8 321.4 922.2 319.8 920.7 317.7 C 919.2 315.6 911.8 312.3 911.8 310.5 C 911.8 308.6 919.3 308.3 920.8 306.7 C 922.4 305.2 921.7 303.2 921.0 301.0 C 920.4 298.8 916.7 295.6 916.9 293.6 C 917.0 291.6 921.0 290.8 922.0 289.0 C 922.9 287.2 922.5 284.8 922.8 282.7 C 923.1 280.6 924.4 278.5 923.9 276.3 C 923.4 274.2 921.8 271.4 920.0 270.0 C 918.2 268.6 915.1 267.6 912.8 267.8 C 910.6 267.9 908.6 269.9 906.6 271.0 C 904.5 272.2 901.9 272.7 900.4 274.5 C 898.9 276.3 899.6 280.4 897.6 281.6 C 895.6 282.9 890.8 281.4 888.3 282.3 C 885.8 283.1 883.3 284.2 882.6 286.6 C 881.9 289.1 885.9 295.5 884.1 297.2 C 882.3 298.8 874.7 295.7 871.8 296.4 C 868.9 297.2 866.7 298.9 866.9 301.9 C 867.1 305.0 874.3 312.7 872.9 314.7 C 871.5 316.7 861.3 313.1 858.3 314.1 C 855.3 315.1 853.7 317.4 854.8 320.7 C 855.9 324.1 865.8 331.9 864.9 334.3 C 864.1 336.7 852.5 333.7 849.7 335.1 C 846.9 336.5 846.4 339.4 848.3 342.8 C 850.1 346.2 861.1 353.0 861.0 355.7 C 860.9 358.4 849.8 356.9 847.8 358.9 C 845.8 360.8 846.6 363.9 849.0 367.2 C 850.8 369.7 854.7 372.7 858.7 375.7"/>
    <path stroke-width="7" d="M 879.8 370.0 C 881.7 342.6 889.7 317.1 903.7 293.4"/>
    <path stroke-width="10" d="M 931.5 402.6 C 932.9 403.5 934.0 404.2 934.8 404.5 C 937.9 405.7 939.0 405.4 938.8 402.9 C 938.6 400.4 932.3 390.3 933.5 389.7 C 934.7 389.0 943.4 397.8 946.1 399.0 C 948.8 400.2 949.5 399.3 949.5 396.7 C 949.5 394.1 945.0 384.4 946.1 383.5 C 947.2 382.6 953.8 390.6 956.1 391.5 C 958.3 392.4 958.9 391.0 959.4 388.6 C 959.9 386.3 957.7 378.4 958.9 377.4 C 960.1 376.3 964.6 382.2 966.5 382.5 C 968.3 382.8 969.2 381.1 970.3 379.3 C 971.3 377.5 971.3 372.7 972.7 371.6 C 974.1 370.6 976.8 373.3 978.5 373.0 C 980.3 372.7 981.5 370.9 983.1 369.9 C 984.6 368.9 986.8 368.6 987.9 366.9 C 989.1 365.3 990.0 362.3 990.0 360.0 C 990.0 357.7 989.3 354.6 988.1 352.9 C 986.8 351.3 984.5 350.9 982.6 349.9 C 980.8 348.9 979.1 347.2 977.1 347.0 C 975.1 346.9 972.6 349.9 970.6 349.1 C 968.7 348.2 967.3 343.5 965.5 342.0 C 963.6 340.4 961.5 339.0 959.4 339.8 C 957.3 340.7 954.9 347.7 952.8 347.2 C 950.7 346.7 948.9 338.7 946.9 336.8 C 944.8 334.9 942.4 334.0 940.4 335.9 C 938.4 337.9 936.9 348.2 934.7 348.2 C 932.5 348.2 929.6 337.8 927.2 335.9 C 924.9 334.0 922.4 334.0 920.7 336.8 C 918.9 339.6 918.9 352.0 916.7 352.7 C 914.6 353.3 910.3 342.2 907.7 340.7 C 905.2 339.2 902.9 340.3 901.5 343.7 C 900.2 347.1 901.6 359.8 899.7 361.2 C 897.8 362.6 892.5 352.7 890.0 352.1 C 887.5 351.5 885.8 353.8 884.9 357.5 C 884.2 360.4 884.3 365.3 884.5 370.2"/>
    <path stroke-width="7" d="M 907.0 380.2 C 925.0 369.8 944.5 363.4 965.4 361.0"/>
    <path stroke-width="10" d="M 893.9 446.7 C 894.6 448.0 895.5 448.6 896.9 448.4 C 897.4 448.3 898.2 447.7 899.0 446.9 M 906.8 443.9 C 906.4 448.3 904.8 455.3 905.2 457.8 C 905.7 461.4 906.8 462.7 909.4 461.9 C 911.9 461.1 919.3 451.8 920.7 453.0 C 922.1 454.2 917.6 466.0 917.9 469.2 C 918.2 472.5 919.6 473.2 922.3 472.6 C 925.0 471.9 932.7 464.5 934.2 465.5 C 935.8 466.6 931.2 476.2 931.6 479.0 C 931.9 481.7 933.7 482.2 936.4 482.2 C 939.1 482.1 945.8 477.6 947.5 478.7 C 949.2 479.8 945.7 486.6 946.4 488.9 C 947.1 491.2 949.3 491.8 951.6 492.5 C 953.9 493.2 958.6 491.9 960.3 493.2 C 962.1 494.5 960.9 498.5 962.0 500.5 C 963.2 502.4 965.5 503.4 967.3 504.9 C 969.0 506.5 970.3 508.9 972.4 509.7 C 974.5 510.6 977.8 510.9 980.0 510.0 C 982.2 509.1 984.5 506.8 985.4 504.6 C 986.4 502.4 985.6 499.5 985.6 496.9 C 985.6 494.4 986.3 491.7 985.5 489.3 C 984.6 486.9 980.7 485.3 980.5 482.7 C 980.3 480.1 983.9 476.6 984.3 473.9 C 984.8 471.1 985.1 468.2 983.2 466.2 C 981.3 464.1 973.7 464.1 973.0 461.6 C 972.4 459.0 978.9 453.9 979.6 450.9 C 980.3 447.8 979.9 444.9 977.0 443.4 C 974.2 441.8 963.7 444.0 962.6 441.6 C 961.4 439.2 969.6 432.2 970.1 428.9 C 970.7 425.7 969.4 423.0 965.8 422.1 C 962.2 421.2 950.3 425.5 948.6 423.4 C 946.8 421.3 955.1 412.8 955.1 409.5 C 955.2 406.3 952.9 404.2 948.8 404.0 C 944.8 403.7 933.2 409.6 930.8 408.0 C 928.3 406.5 935.0 397.5 934.3 394.7 C 933.5 391.9 930.2 390.8 926.0 391.1 C 922.9 391.3 918.6 392.9 913.9 394.6"/>
    <path stroke-width="7" d="M 904.6 414.0 C 931.0 431.4 951.8 453.9 967.0 481.6"/>
    <path stroke-width="10" d="M 903.9 414.5 A 34.0 26.0 0 0 0 914.0 396.0 A 34.0 26.0 0 0 0 846.0 396.0 A 34.0 26.0 0 0 0 852.5 411.3 M 877.5 421.9 A 34.0 26.0 0 0 0 882.0 422.0"/>
    <path stroke-width="7" d="M 844.0 426.0 A 17.0 17.0 0 0 0 878.0 426.0 A 17.0 17.0 0 0 0 844.0 426.0 Z"/>
    <path stroke-width="7" d="M 880.0 430.0 A 17.0 17.0 0 0 0 914.0 430.0 A 17.0 17.0 0 0 0 880.0 430.0 Z"/>
    <path stroke-width="10" d="M 856.9 442.5 C 856.7 444.4 856.5 446.2 856.2 447.9 C 853.5 464.8 851.2 481.9 849.1 498.9 C 847.1 516.0 845.4 533.1 844.0 550.2 C 842.7 567.3 841.7 584.5 841.0 601.6 C 840.3 618.8 840.0 636.0 840.0 653.2 C 840.0 670.4 840.4 687.6 841.1 704.8 C 841.8 722.0 842.8 739.2 844.2 756.3 C 845.6 773.5 847.3 790.6 849.3 807.7 C 851.4 824.8 853.8 842.0 856.4 858.9 C 859.1 875.9 856.4 902.4 865.4 909.4 C 874.4 916.3 904.8 910.3 910.6 900.6 C 916.4 890.9 903.3 867.7 900.2 851.3 C 897.0 834.8 894.2 818.5 891.7 802.0 C 889.2 785.5 887.0 769.0 885.2 752.4 C 883.3 735.8 881.8 719.2 880.6 702.6 C 879.4 685.9 878.5 669.3 878.0 652.6 C 877.5 635.9 877.3 619.2 877.4 602.5 C 877.5 585.8 878.0 569.1 878.8 552.4 C 879.6 535.7 880.7 519.0 882.2 502.3 C 883.6 485.7 885.4 469.1 887.5 452.4 C 887.8 450.0 888.2 447.5 888.8 444.9"/>
    <path stroke-width="7" d="M 895.4 825.2 C 881.4 829.3 867.1 831.5 852.4 831.7"/>
    <path stroke-width="7" d="M 884.5 746.1 C 871.0 749.1 857.4 750.2 843.7 749.7"/>
    <path stroke-width="7" d="M 878.5 666.5 C 865.7 668.3 852.9 668.6 840.1 667.4"/>
    <path stroke-width="7" d="M 877.6 586.5 C 865.6 587.3 853.7 586.8 841.8 585.0"/>
    <path stroke-width="7" d="M 881.8 506.5 C 870.6 506.5 859.6 505.3 848.6 503.0"/>
    <path stroke-width="10" d="M 92.5 396.4 C 93.3 399.6 94.0 402.8 92.5 403.4 C 91.1 404.0 87.9 402.4 84.5 400.6 M 78.7 397.6 C 77.3 396.9 76.0 396.5 75.1 396.4 C 71.0 396.0 68.2 397.6 67.6 400.9 C 66.9 404.2 73.4 414.2 71.2 416.0 C 68.9 417.8 57.9 411.4 54.1 411.7 C 50.3 412.0 48.5 414.5 48.3 417.9 C 48.1 421.2 54.8 429.7 53.1 432.0 C 51.4 434.2 41.5 430.2 38.3 431.3 C 35.1 432.4 34.1 435.3 34.1 438.5 C 34.1 441.7 39.4 448.0 38.3 450.5 C 37.2 453.0 29.5 451.7 27.2 453.5 C 24.9 455.2 24.6 458.2 24.4 461.1 C 24.3 464.0 27.1 468.2 26.4 470.8 C 25.6 473.4 21.4 474.4 20.0 476.7 C 18.7 479.0 18.8 481.9 18.3 484.6 C 17.7 487.2 16.3 490.0 16.8 492.5 C 17.2 494.9 19.0 497.8 21.0 499.0 C 23.0 500.2 26.3 500.4 28.6 499.9 C 30.9 499.4 32.8 497.1 34.8 495.8 C 36.9 494.5 39.4 493.8 41.0 492.0 C 42.6 490.2 42.2 485.9 44.2 484.8 C 46.3 483.7 50.7 485.8 53.2 485.4 C 55.7 485.0 58.1 484.7 59.2 482.5 C 60.4 480.2 58.4 472.8 60.3 472.0 C 62.3 471.1 68.2 476.7 70.9 477.1 C 73.6 477.6 75.5 477.3 76.5 474.6 C 77.5 471.9 74.8 461.5 76.6 460.7 C 78.4 459.8 84.7 468.5 87.4 469.5 C 90.0 470.5 91.7 470.0 92.6 466.8 C 93.6 463.5 91.4 451.1 93.2 450.1 C 94.9 449.1 100.5 459.5 103.0 460.7 C 105.5 461.9 107.0 460.8 108.2 457.2 C 109.4 453.7 108.6 440.8 110.4 439.4 C 112.2 438.1 116.5 448.3 118.8 449.1 C 120.6 449.7 121.9 448.7 123.2 446.6"/>
    <path stroke-width="7" d="M 117.3 414.0 C 86.7 427.0 60.9 446.3 39.9 472.0"/>
    <path stroke-width="10" d="M 120.1 346.9 C 120.0 344.7 119.8 342.8 119.4 341.6 M 111.8 337.5 C 108.8 339.2 103.8 349.3 101.4 348.4 C 98.9 347.5 98.9 334.8 96.9 331.8 C 94.8 328.7 91.9 328.5 89.1 330.1 C 86.2 331.7 82.5 341.9 79.9 341.6 C 77.3 341.4 75.8 330.8 73.4 328.7 C 71.0 326.6 68.2 327.2 65.6 328.9 C 63.0 330.6 60.5 338.4 57.9 338.8 C 55.4 339.1 52.8 331.9 50.3 330.8 C 47.7 329.8 45.2 331.1 42.8 332.5 C 40.4 333.8 38.4 338.4 36.0 339.1 C 33.5 339.9 30.7 336.7 28.2 336.7 C 25.7 336.7 23.4 338.4 21.1 339.3 C 18.8 340.2 15.8 340.4 14.1 342.0 C 12.4 343.7 11.1 346.7 11.0 349.0 C 10.9 351.3 12.3 354.3 13.8 356.0 C 15.2 357.7 17.9 358.1 19.9 359.2 C 21.9 360.3 23.5 362.2 25.7 362.6 C 27.9 363.0 31.2 360.5 33.0 361.6 C 34.8 362.8 35.1 367.7 36.6 369.6 C 38.0 371.5 39.2 373.3 41.6 373.2 C 43.9 373.0 49.1 367.5 50.7 368.6 C 52.2 369.8 50.2 377.7 51.1 380.2 C 51.9 382.7 52.9 384.2 55.6 383.6 C 58.3 383.0 65.7 375.4 67.1 376.5 C 68.6 377.5 64.2 387.3 64.5 390.0 C 64.9 392.8 66.0 393.8 69.1 393.0 C 72.2 392.1 81.6 383.8 83.2 384.7 C 84.8 385.6 78.5 395.7 78.6 398.3 C 78.7 401.0 80.3 401.6 83.8 400.8 C 87.3 399.9 97.9 392.6 99.8 393.3 C 101.7 394.0 95.0 402.9 95.3 405.2 C 95.6 407.5 98.0 407.7 101.8 407.2 C 104.4 406.8 108.2 405.4 112.4 404.0"/>
    <path stroke-width="7" d="M 120.4 382.9 C 96.6 366.3 70.3 355.8 41.5 351.4"/>
    <path stroke-width="10" d="M 168.5 360.2 C 168.7 360.1 168.8 360.0 169.0 359.9 M 170.2 344.4 C 167.5 344.3 165.4 344.0 165.2 343.1 C 164.9 341.0 176.0 335.2 177.8 332.4 C 179.6 329.6 178.7 327.5 176.1 326.1 C 173.4 324.7 162.8 326.0 162.0 324.0 C 161.2 322.0 170.3 316.6 171.4 314.0 C 172.5 311.3 171.0 309.5 168.6 308.1 C 166.1 306.7 158.0 307.4 156.9 305.6 C 155.8 303.7 161.8 299.1 162.1 296.8 C 162.4 294.4 160.5 292.8 158.6 291.3 C 156.6 289.7 151.7 289.4 150.5 287.6 C 149.2 285.9 151.6 282.6 151.1 280.6 C 150.5 278.5 148.5 277.0 147.2 275.3 C 145.9 273.6 145.2 271.2 143.3 270.1 C 141.4 269.1 138.3 268.6 136.0 269.0 C 133.7 269.4 130.9 270.9 129.5 272.5 C 128.1 274.0 128.2 276.5 127.5 278.5 C 126.8 280.5 125.3 282.4 125.4 284.4 C 125.5 286.5 128.7 288.8 128.0 290.8 C 127.3 292.8 122.7 294.3 121.2 296.2 C 119.7 298.0 118.3 299.8 119.2 302.0 C 120.0 304.1 126.9 307.0 126.3 309.0 C 125.7 310.9 117.6 311.8 115.5 313.5 C 113.4 315.2 112.3 317.0 113.9 319.3 C 115.5 321.5 125.4 325.2 125.0 327.1 C 124.6 329.0 113.9 329.3 111.5 330.9 C 109.1 332.5 108.6 334.3 110.8 336.7 C 113.0 339.1 124.7 343.4 124.7 345.3 C 124.6 347.3 112.7 347.0 110.4 348.6 C 108.1 350.1 108.3 352.1 110.9 354.7 C 113.4 357.2 125.4 361.9 125.8 364.0 C 126.2 366.1 115.0 365.6 113.3 367.3 C 111.6 368.9 112.7 371.1 115.4 373.8 C 117.2 375.7 120.5 377.8 124.1 380.1"/>
    <path stroke-width="7" d="M 146.1 374.0 C 145.6 347.8 143.7 321.8 140.2 295.8"/>
    <path stroke-width="10" d="M 211.2 396.0 C 209.6 392.0 205.8 385.7 207.0 385.0 C 208.1 384.3 214.0 389.0 218.0 391.6 M 225.0 388.0 C 224.0 384.2 221.2 377.7 222.3 376.8 C 223.7 375.8 231.2 383.3 233.8 383.9 C 236.4 384.5 237.3 383.0 238.0 380.5 C 238.8 378.0 236.6 370.2 238.1 369.0 C 239.6 367.8 244.7 373.3 247.0 373.4 C 249.3 373.6 250.4 371.8 251.8 369.8 C 253.1 367.9 253.3 363.1 255.0 361.9 C 256.7 360.7 260.0 363.2 262.1 362.7 C 264.2 362.3 265.7 360.4 267.6 359.3 C 269.5 358.2 272.1 357.8 273.5 356.1 C 274.9 354.3 276.1 351.3 276.0 349.0 C 275.9 346.7 274.6 343.7 272.9 342.1 C 271.3 340.5 268.4 340.2 266.1 339.4 C 263.9 338.5 261.6 336.9 259.2 336.9 C 256.8 336.9 254.1 340.1 251.7 339.4 C 249.4 338.7 247.4 334.1 245.1 332.8 C 242.7 331.4 240.2 330.1 237.8 331.2 C 235.3 332.3 232.9 339.5 230.4 339.2 C 227.9 338.9 225.4 331.0 222.8 329.4 C 220.3 327.7 217.5 327.1 215.3 329.2 C 213.0 331.3 211.7 341.9 209.1 342.1 C 206.6 342.4 202.8 332.3 200.0 330.7 C 197.2 329.0 194.4 329.3 192.4 332.4 C 190.5 335.4 190.8 348.0 188.3 348.9 C 185.9 349.9 180.6 339.1 177.7 337.9 C 174.8 336.8 172.2 338.2 170.7 341.9 C 169.2 345.6 171.0 358.3 168.8 360.1 C 166.6 361.8 160.5 352.4 157.7 352.1 C 154.9 351.9 152.9 354.6 151.9 358.5 C 150.9 362.2 151.3 368.2 151.5 374.3"/>
    <path stroke-width="7" d="M 171.3 382.6 C 193.9 366.6 219.0 356.3 246.5 351.7"/>
    <path stroke-width="10" d="M 178.4 441.1 C 178.6 441.3 178.7 441.4 178.8 441.6 C 181.5 445.0 183.8 446.9 186.4 445.9 C 189.1 444.8 192.3 434.2 194.8 435.5 C 197.2 436.7 198.8 449.7 201.0 453.2 C 203.2 456.7 205.3 457.8 208.0 456.4 C 210.8 455.0 215.2 444.1 217.5 445.0 C 219.8 446.0 220.0 458.8 221.9 462.0 C 223.7 465.3 225.9 465.8 228.8 464.6 C 231.7 463.4 237.0 454.2 239.4 455.0 C 241.7 455.8 241.1 466.7 242.8 469.5 C 244.6 472.4 247.0 472.6 250.0 472.0 C 253.0 471.4 258.4 465.3 260.8 466.2 C 263.3 467.1 262.8 475.0 264.6 477.3 C 266.5 479.7 269.2 479.9 272.1 480.3 C 275.1 480.6 279.5 478.2 282.1 479.4 C 284.6 480.5 285.3 485.1 287.4 487.0 C 289.6 489.0 292.6 489.6 295.2 491.0 C 297.8 492.3 300.3 494.8 302.9 495.3 C 305.6 495.8 309.2 495.5 311.0 494.0 C 312.8 492.5 313.7 488.9 313.5 486.1 C 313.4 483.4 311.1 480.3 309.9 477.4 C 308.6 474.5 307.9 471.2 305.9 468.8 C 303.9 466.4 299.1 465.7 297.6 462.9 C 296.2 460.1 298.0 455.1 297.0 452.0 C 296.1 448.8 294.9 445.5 292.0 443.8 C 289.0 442.1 281.3 444.2 279.4 441.7 C 277.5 439.1 281.4 431.7 280.6 428.3 C 279.7 424.9 277.8 421.9 274.1 421.0 C 270.4 420.2 260.7 425.3 258.3 423.1 C 255.9 420.9 260.8 411.3 259.7 407.7 C 258.6 404.2 255.9 401.8 251.7 401.8 C 247.4 401.9 237.1 409.6 234.2 408.0 C 231.2 406.3 235.7 395.3 234.1 391.9 C 232.5 388.6 229.1 387.2 224.6 388.1 C 220.1 389.0 210.5 398.1 207.1 397.2 C 203.7 396.3 206.5 385.5 204.2 382.9 C 201.9 380.4 197.9 380.3 193.4 381.8 C 189.1 383.1 183.8 387.4 178.0 391.3"/>
    <path stroke-width="7" d="M 177.6 409.6 C 217.9 419.3 253.3 437.9 283.8 465.4"/>
    <path stroke-width="10" d="M 169.9 418.5 A 34.0 26.0 0 0 0 180.0 400.0 A 34.0 26.0 0 0 0 112.0 400.0 A 34.0 26.0 0 0 0 118.5 415.3 M 143.5 425.9 A 34.0 26.0 0 0 0 148.0 426.0"/>
    <path stroke-width="7" d="M 110.0 430.0 A 17.0 17.0 0 0 0 144.0 430.0 A 17.0 17.0 0 0 0 110.0 430.0 Z"/>
    <path stroke-width="7" d="M 146.0 434.0 A 17.0 17.0 0 0 0 180.0 434.0 A 17.0 17.0 0 0 0 146.0 434.0 Z"/>
    <path stroke-width="10" d="M 122.3 730.9 C 122.0 733.5 121.6 736.1 121.2 738.7 C 118.9 754.5 116.3 770.1 113.5 785.7 C 110.7 801.4 107.6 816.9 104.3 832.5 C 100.9 848.0 87.8 869.8 93.5 879.2 C 99.2 888.6 129.4 895.2 138.5 888.8 C 147.6 882.4 145.0 857.0 147.8 841.0 C 150.7 825.0 153.4 808.8 155.7 792.6 C 158.1 776.5 160.2 760.3 162.0 744.1 C 162.9 736.7 163.7 729.4 164.4 722.0 M 171.0 615.6 C 171.1 609.6 171.3 603.5 171.4 597.5 C 171.6 581.2 171.5 564.9 171.2 548.6 C 170.9 532.3 170.3 516.0 169.4 499.8 C 168.5 483.5 167.4 467.2 166.0 451.0 C 166.0 450.9 166.0 450.8 166.0 450.7 M 133.7 445.6 C 134.0 448.3 134.3 450.8 134.4 453.2 C 135.3 469.2 135.9 485.1 136.2 501.0 C 136.5 516.9 136.6 532.8 136.4 548.7 C 136.2 564.6 135.7 580.6 135.0 596.4 C 134.2 611.6 133.3 626.7 132.2 641.8"/>
    <path stroke-width="7" d="M 152.2 815.5 C 137.6 814.9 123.3 812.4 109.3 807.9"/>
    <path stroke-width="7" d="M 171.5 581.9 C 159.5 583.1 147.6 582.9 135.6 581.4"/>
    <path stroke-width="7" d="M 169.6 503.9 C 158.6 505.5 147.4 505.9 136.3 505.1"/>
    <path stroke-width="10" d="M 578.5 945.9 C 576.3 944.6 573.2 944.1 569.9 943.9 C 565.6 943.7 556.4 948.1 554.4 945.8 C 552.4 943.5 557.8 934.3 557.8 930.0 C 557.9 925.6 556.9 922.0 554.7 919.9 C 552.6 917.7 548.7 917.3 544.9 917.0 C 541.1 916.8 534.2 920.6 531.9 918.6 C 529.6 916.6 532.3 908.8 531.3 905.3 C 530.4 901.7 528.6 898.9 526.3 897.1 C 523.9 895.3 520.4 895.0 517.0 894.7 C 513.7 894.3 508.8 896.5 506.3 895.0 C 503.8 893.4 503.9 887.9 502.0 885.4 C 500.1 883.0 497.6 881.4 494.9 880.1 C 492.2 878.9 489.0 878.7 486.0 878.1 C 483.0 877.6 479.6 876.4 477.0 876.7 C 474.3 877.0 471.5 878.2 470.0 880.0 C 468.5 881.8 467.9 884.7 467.9 887.3 C 467.9 890.0 469.4 892.9 470.1 895.7 C 470.9 898.4 471.1 901.3 472.3 903.7 C 473.5 906.1 474.9 908.2 477.2 909.9 C 479.5 911.5 484.9 911.5 486.0 913.8 C 487.2 916.0 484.4 920.5 484.1 923.5 C 483.9 926.5 483.3 929.4 484.4 931.7 C 485.5 933.9 487.5 935.5 490.6 936.9 C 493.6 938.3 501.7 937.7 502.7 939.9 C 503.7 942.1 497.8 947.2 496.4 950.3 C 495.0 953.4 493.7 956.3 494.5 958.6 C 495.4 960.8 497.9 962.4 501.6 963.8 C 505.2 965.2 515.8 964.8 516.6 967.1 C 517.3 969.3 508.5 974.3 506.1 977.3 C 503.7 980.4 501.6 983.2 502.2 985.4 C 502.9 987.7 505.8 989.4 510.0 991.1 C 514.2 992.8 519.8 994.0 527.6 995.6 C 535.3 997.2 549.0 1004.0 556.7 1000.8 C 564.3 997.6 569.6 983.3 573.7 976.3 C 576.4 971.8 578.3 967.9 579.6 964.3"/>
    <path stroke-width="7" d="M 556.7 1000.8 C 542.4 963.3 521.4 930.3 493.8 902.0"/>
    <path stroke-width="10" d="M 603.2 1000.2 C 611.0 1003.1 624.5 995.6 632.3 993.5 C 640.0 991.5 645.6 990.0 649.8 988.0 C 654.0 986.0 657.0 984.1 657.6 981.7 C 658.2 979.2 656.0 976.4 653.6 973.3 C 651.2 970.2 642.3 965.4 643.0 963.0 C 643.8 960.6 654.4 960.5 658.1 958.8 C 661.8 957.1 664.3 955.4 665.2 953.0 C 666.0 950.6 664.6 947.6 663.3 944.4 C 661.9 941.2 655.9 936.3 656.8 933.9 C 657.8 931.5 666.0 931.7 669.1 930.1 C 672.2 928.5 674.3 926.7 675.3 924.3 C 676.4 921.9 675.9 918.8 675.6 915.7 C 675.3 912.7 672.5 908.2 673.7 905.8 C 674.9 903.3 680.4 903.1 682.7 901.2 C 685.0 899.4 686.5 897.1 687.7 894.6 C 688.9 892.1 689.1 889.0 689.9 886.1 C 690.6 883.3 692.2 880.1 692.2 877.4 C 692.2 874.8 691.6 871.7 690.0 870.0 C 688.4 868.3 685.5 867.3 682.7 867.1 C 680.0 867.0 676.5 868.4 673.4 869.2 C 670.4 870.0 667.0 870.4 664.3 871.8 C 661.6 873.2 659.0 875.0 657.1 877.7 C 655.2 880.3 655.4 885.9 652.8 887.7 C 650.2 889.4 645.2 887.5 641.8 888.1 C 638.4 888.7 634.8 889.2 632.3 891.2 C 629.9 893.1 628.2 896.1 627.3 899.8 C 626.4 903.6 629.2 911.4 626.9 913.6 C 624.6 915.7 617.5 912.4 613.6 912.8 C 609.7 913.3 605.8 914.0 603.7 916.4 C 601.5 918.7 600.6 922.5 600.7 926.9 C 600.9 931.4 606.4 940.5 604.4 943.0 C 602.4 945.6 593.1 941.5 588.7 942.1 C 584.3 942.6 580.1 943.6 578.2 946.3 C 576.4 949.0 576.3 953.3 577.6 958.3 C 578.8 963.2 581.2 968.9 585.5 975.8 C 589.8 982.8 595.4 997.2 603.2 1000.2 Z"/>
    <path stroke-width="7" d="M 603.2 1000.2 C 616.9 960.2 637.7 924.8 665.7 894.0"/>
    <path stroke-width="10" d="M -10.0 820.0 C 29.0 816.7 68.4 814.9 108.1 814.1 M 152.5 813.7 C 179.5 813.6 206.6 813.9 233.9 814.4 M 395.6 817.7 C 406.5 817.9 417.5 818.1 428.4 818.2 M 595.9 815.0 C 610.6 814.2 625.3 813.2 640.0 812.0 C 725.2 805.4 792.5 805.9 849.3 807.5 M 892.8 808.8 C 936.4 810.2 974.0 811.2 1010.0 808.0"/>
    <path stroke-width="10" d="M 92.0 120.0 A 48.0 48.0 0 0 0 188.0 120.0 A 48.0 48.0 0 0 0 92.0 120.0 Z"/>
    <path stroke-width="8" d="M 202.0 120.0 L 226.0 120.0 M 183.8 163.8 L 200.8 180.8 M 140.0 182.0 L 140.0 206.0 M 96.2 163.8 L 79.2 180.8 M 78.0 120.0 L 54.0 120.0 M 96.2 76.2 L 79.2 59.2 M 140.0 58.0 L 140.0 34.0 M 183.8 76.2 L 200.8 59.2"/>
    <path stroke-width="10" d="M 344.0 162.0 C 308.0 162.0 308.0 118.0 344.0 120.4 C 344.0 86.0 392.0 82.0 400.0 102.0 C 412.0 66.0 472.0 70.0 472.0 110.0 C 508.0 102.0 528.0 162.0 492.0 162.0 Z"/>
  </g>
</svg>
`,g=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="7" d="M 640 884 C 640 960 700 978 770 978 C 840 978 900 960 900 884 C 860 904 680 904 640 884 Z"/>
    <path stroke-width="7" d="M 794.9 898.7 A 36.0 48.0 0 0 0 806.0 864.0 A 36.0 48.0 0 0 0 734.0 864.0 A 36.0 48.0 0 0 0 745.1 898.7"/>
    <path stroke-width="7" d="M 735.5 850.2 A 34.0 44.1 -12 0 0 676.7 883.1 A 34.0 44.1 -12 0 0 680.1 893.8 M 741.3 898.5 A 34.0 44.1 -12 0 0 742.5 895.0"/>
    <path stroke-width="7" d="M 797.5 895.0 A 34.0 44.1 12 0 0 798.7 898.5 M 859.9 893.8 A 34.0 44.1 12 0 0 863.3 883.1 A 34.0 44.1 12 0 0 804.5 850.2"/>
    <path stroke-width="5" d="M 686 862 A 12 12 0 1 0 710 862 A 12 12 0 1 0 686 862 Z"/>
    <path stroke-width="5" d="M 753 842 A 13 13 0 1 0 779 842 A 13 13 0 1 0 753 842 Z"/>
    <path stroke-width="5" d="M 769 884 A 11 11 0 1 0 791 884 A 11 11 0 1 0 769 884 Z"/>
    <path stroke-width="5" d="M 830 862 A 12 12 0 1 0 854 862 A 12 12 0 1 0 830 862 Z"/>
    <path stroke-width="5" d="M 700.0 956.0 C 740.0 962.0 790.0 962.0 830.0 956.0"/>
    <path stroke-width="5" d="M 672.0 916.0 C 700.0 928.0 734.0 932.0 760.0 932.0"/>
    <path stroke-width="7" d="M 944.3 963.8 C 952.4 963.5 961.6 950.7 967.7 945.8 C 973.8 940.8 978.1 937.7 981.1 934.3 C 984.1 931.0 985.9 928.0 985.5 925.6 C 985.2 923.2 982.2 921.5 978.7 919.9 C 975.3 918.3 965.3 918.2 965.0 915.8 C 964.6 913.4 974.0 908.5 976.6 905.4 C 979.1 902.3 980.7 899.5 980.4 897.1 C 980.0 894.7 977.5 892.8 974.6 890.9 C 971.7 889.0 963.5 888.1 963.2 885.7 C 962.9 883.3 970.7 879.2 972.8 876.3 C 974.9 873.4 976.0 870.7 975.8 868.3 C 975.5 865.8 973.4 863.7 971.1 861.6 C 968.9 859.5 962.7 858.0 962.4 855.5 C 962.1 853.1 968.0 849.6 969.6 846.9 C 971.1 844.2 971.7 841.6 971.5 839.1 C 971.2 836.7 969.5 834.4 968.0 832.1 C 966.5 829.8 962.6 827.7 962.3 825.3 C 962.0 822.8 965.6 819.8 966.3 817.2 C 967.0 814.6 966.9 812.2 966.5 809.7 C 966.2 807.2 964.9 804.8 964.0 802.3 C 963.1 799.9 962.7 797.0 961.2 794.9 C 959.7 792.9 957.3 790.4 955.0 790.0 C 952.7 789.6 949.5 791.1 947.4 792.6 C 945.3 794.1 944.0 796.8 942.4 798.9 C 940.8 801.1 938.8 803.1 937.7 805.4 C 936.6 807.8 935.7 810.3 935.7 813.1 C 935.6 815.8 938.3 819.7 937.4 822.1 C 936.5 824.6 932.2 825.7 930.1 827.7 C 928.0 829.7 925.8 831.7 925.0 834.2 C 924.2 836.7 924.3 839.6 925.2 842.7 C 926.1 845.8 931.2 850.3 930.5 852.8 C 929.8 855.4 923.4 855.9 920.8 857.8 C 918.2 859.8 915.8 861.8 915.1 864.3 C 914.5 866.9 915.2 869.9 916.9 873.2 C 918.6 876.5 925.9 881.4 925.4 884.0 C 924.8 886.6 916.5 886.9 913.5 888.8 C 910.4 890.7 907.7 892.7 907.2 895.3 C 906.7 897.9 908.0 901.1 910.5 904.5 C 912.9 907.9 922.2 913.0 921.7 915.6 C 921.3 918.3 911.3 918.5 907.8 920.4 C 904.4 922.3 901.3 924.3 901.0 927.0 C 900.6 929.7 902.5 932.9 905.6 936.4 C 908.7 939.8 913.1 943.0 919.5 947.5 C 926.0 952.1 936.3 964.1 944.3 963.8 Z"/>
    <path stroke-width="5" d="M 944.3 963.8 C 942.0 917.9 943.7 872.2 949.4 826.8"/>
    <path stroke-width="7" d="M 587.5 934.5 C 584.0 933.7 577.8 934.1 577.0 932.0 C 576.0 929.6 581.9 924.0 582.8 920.6 C 583.8 917.3 583.9 914.3 582.8 912.0 C 581.7 909.7 579.0 908.2 576.3 906.9 C 573.5 905.6 567.6 906.3 566.4 904.1 C 565.2 902.0 568.8 896.8 568.9 893.8 C 569.0 890.7 568.4 888.1 567.0 886.0 C 565.7 883.9 563.2 882.6 560.8 881.2 C 558.4 879.9 554.3 880.0 552.8 878.0 C 551.3 876.0 552.6 871.9 551.8 869.4 C 551.0 867.0 549.5 864.9 547.8 863.2 C 546.1 861.4 543.8 860.2 541.7 858.7 C 539.6 857.3 537.6 855.1 535.3 854.7 C 533.0 854.2 530.0 854.9 528.0 856.0 C 526.0 857.1 523.9 859.4 523.1 861.5 C 522.2 863.6 522.9 866.3 522.9 868.6 C 522.8 871.0 522.4 873.4 522.7 875.6 C 523.1 877.8 523.7 879.9 525.0 881.9 C 526.3 883.9 530.2 885.5 530.6 887.7 C 530.9 889.8 528.0 892.5 527.2 894.8 C 526.3 897.1 525.3 899.4 525.7 901.5 C 526.0 903.6 527.1 905.6 529.0 907.6 C 531.0 909.6 537.0 911.3 537.2 913.4 C 537.5 915.5 532.1 918.0 530.5 920.2 C 528.9 922.4 527.3 924.4 527.5 926.5 C 527.7 928.6 529.1 930.6 531.5 932.7 C 533.9 934.9 541.6 937.3 541.7 939.4 C 541.7 941.4 534.4 943.3 532.0 945.2 C 529.7 947.2 527.6 949.0 527.6 951.1 C 527.6 953.1 529.4 955.3 532.1 957.7 C 534.7 960.1 538.2 962.5 543.8 965.6 C 549.4 968.8 558.7 977.5 565.5 976.7 C 571.7 976.1 578.5 967.6 583.2 962.7"/>
    <path stroke-width="5" d="M 565.5 976.7 C 562.8 942.9 554.5 910.8 540.6 880.3"/>
    <path stroke-width="7" d="M 604.4 978.3 C 610.9 978.9 619.6 971.2 624.8 968.4 C 630.0 965.7 633.1 963.7 635.5 961.6 C 637.9 959.5 639.5 957.7 639.4 956.0 C 639.3 954.3 637.3 952.9 635.0 951.4 C 632.7 949.9 625.7 948.7 625.7 947.0 C 625.6 945.3 632.7 943.0 634.8 941.2 C 636.8 939.3 638.1 937.6 638.1 935.9 C 638.1 934.2 636.5 932.6 634.8 930.8 C 633.2 929.1 628.0 927.3 628.1 925.6 C 628.1 923.8 633.6 922.1 635.2 920.4 C 636.8 918.7 637.7 917.1 637.8 915.3 C 637.9 913.5 636.7 911.8 635.7 909.9 C 634.8 908.0 631.7 905.9 631.8 904.2 C 632.0 902.4 635.4 900.9 636.4 899.2 C 637.4 897.5 637.7 895.7 637.8 893.9 C 637.8 892.1 637.1 890.1 636.8 888.2 C 636.4 886.3 636.8 884.0 635.7 882.3 C 634.6 880.6 632.1 879.0 630.0 878.0 C 627.9 877.0 625.0 876.2 622.9 876.6 C 620.9 876.9 619.4 878.8 617.7 880.0 C 616.0 881.2 614.0 882.3 612.7 883.8 C 611.3 885.3 610.2 887.0 609.7 889.1 C 609.2 891.2 610.8 894.6 609.7 896.3 C 608.5 897.9 604.7 897.8 602.7 898.9 C 600.7 900.0 598.5 901.1 597.5 902.9 C 596.4 904.6 596.0 906.8 596.4 909.4 C 596.7 911.9 600.5 916.3 599.5 918.1 C 598.6 919.9 593.1 919.2 590.7 920.3 C 588.3 921.3 585.9 922.5 585.0 924.4 C 584.2 926.3 584.5 928.8 585.5 931.6 C 586.6 934.3 592.3 939.1 591.6 941.1 C 590.8 943.0 583.7 942.1 581.0 943.2 C 578.2 944.3 575.6 945.6 575.0 947.6 C 574.3 949.6 575.2 952.3 577.0 955.2 C 578.8 958.1 581.2 961.2 585.8 965.0 C 590.3 968.9 597.8 977.7 604.4 978.3 Z"/>
    <path stroke-width="5" d="M 604.3 978.3 C 606.1 950.8 611.8 924.2 621.4 898.6"/>
    <path stroke-width="7" d="M 514.0 748.0 A 34.0 20.0 0 0 0 582.0 748.0 A 34.0 20.0 0 0 0 514.0 748.0 Z"/>
    <path stroke-width="7" d="M 574.1 760.8 A 24.0 15.0 0 0 0 574.0 762.0 A 24.0 15.0 0 0 0 622.0 762.0 A 24.0 15.0 0 0 0 581.6 751.0"/>
    <path stroke-width="7" d="M 526.2 732.6 A 20.0 13.0 0 0 0 488.0 738.0 A 20.0 13.0 0 0 0 514.2 750.4"/>
    <path stroke-width="5" d="M 458.0 980.0 L 450.0 965.0 M 470.0 980.0 L 470.0 960.0 M 482.0 980.0 L 490.0 965.0"/>
    <path stroke-width="5" d="M 678.0 790.0 L 670.0 775.0 M 690.0 790.0 L 690.0 770.0 M 702.0 790.0 L 710.0 775.0"/>
    <path stroke-width="5" d="M 288.0 640.0 L 280.0 625.0 M 300.0 640.0 L 300.0 620.0 M 312.0 640.0 L 320.0 625.0"/>
    <path stroke-width="5" d="M 108.0 670.0 L 100.0 655.0 M 120.0 670.0 L 120.0 650.0 M 132.0 670.0 L 140.0 655.0"/>
    <path stroke-width="5" d="M 408.0 860.0 L 400.0 845.0 M 420.0 860.0 L 420.0 840.0 M 432.0 860.0 L 440.0 845.0"/>
    <path stroke-width="7" d="M 686.0 592.1 A 245.0 78.0 0 0 0 497.0 668.0 A 245.0 78.0 0 0 0 987.0 668.0 A 245.0 78.0 0 0 0 815.3 593.6"/>
    <path stroke-width="5" d="M 540.0 700.0 C 560.0 692.0 588.0 692.0 608.0 700.0"/>
    <path stroke-width="5" d="M 640.0 726.0 C 643.4 724.9 646.9 723.9 650.4 723.0 M 718.3 721.0 C 723.1 721.9 727.9 723.0 732.5 724.3"/>
    <path stroke-width="5" d="M 850.0 712.0 C 872.0 704.0 900.0 704.0 920.0 712.0"/>
    <path stroke-width="7" d="M 938.1 591.8 C 939.5 593.1 941.3 594.6 943.8 596.2 C 948.3 599.1 955.9 606.3 961.8 606.2 C 967.8 606.1 975.1 598.7 979.4 595.7 C 983.8 592.8 986.0 590.7 987.9 588.7 C 989.7 586.6 990.9 584.7 990.6 583.2 C 990.3 581.6 988.4 580.5 986.3 579.4 C 984.1 578.3 978.1 578.0 977.8 576.4 C 977.5 574.9 983.2 572.0 984.7 570.1 C 986.2 568.2 987.1 566.4 986.8 564.9 C 986.6 563.3 985.0 562.1 983.3 560.8 C 981.6 559.5 977.0 558.7 976.7 557.1 C 976.5 555.5 980.8 553.2 981.9 551.4 C 983.0 549.6 983.4 547.9 983.2 546.4 C 982.9 544.8 981.6 543.4 980.5 541.9 C 979.3 540.5 976.4 539.3 976.1 537.7 C 975.9 536.1 978.5 534.1 978.9 532.4 C 979.4 530.8 979.3 529.2 979.0 527.6 C 978.6 526.0 977.6 524.5 976.9 522.9 C 976.2 521.4 976.2 519.4 974.7 518.2 C 973.2 517.1 970.3 516.4 968.0 516.0 C 965.7 515.6 962.7 515.4 960.9 516.0 C 959.1 516.7 958.5 518.7 957.3 520.1 C 956.2 521.4 954.8 522.7 954.0 524.2 C 953.2 525.7 952.7 527.3 952.7 529.2 C 952.7 531.0 954.7 533.6 954.1 535.2 C 953.4 536.7 950.3 537.4 948.8 538.7 C 947.3 539.9 945.7 541.2 945.2 542.8 C 944.6 544.4 944.7 546.3 945.4 548.4 C 946.2 550.4 950.0 553.5 949.5 555.2 C 949.0 556.8 944.3 557.1 942.4 558.3 C 940.6 559.5 938.8 560.8 938.3 562.5 C 937.9 564.1 938.5 566.2 939.8 568.3 C 940.4 569.2 941.6 570.4 942.9 571.5"/>
    <path stroke-width="5" d="M 961.8 606.2 C 961.2 582.4 962.4 558.7 965.3 535.1"/>
    <path stroke-width="7" d="M 923.8 604.6 C 929.9 603.1 935.8 594.1 939.6 590.1 C 943.4 586.1 945.1 583.2 946.4 580.4 C 947.7 577.7 948.1 575.3 947.3 573.8 C 946.4 572.2 943.9 571.6 941.3 571.2 C 938.7 570.7 932.4 572.7 931.4 571.3 C 930.5 569.8 935.1 564.8 935.8 562.2 C 936.5 559.7 936.4 557.5 935.4 556.1 C 934.4 554.7 932.2 554.1 929.9 553.7 C 927.6 553.3 922.7 554.9 921.7 553.5 C 920.6 552.2 923.5 547.8 923.5 545.6 C 923.6 543.4 923.0 541.6 921.9 540.4 C 920.7 539.1 918.7 538.6 916.7 538.0 C 914.8 537.5 911.5 538.3 910.3 537.1 C 909.0 535.9 910.1 532.7 909.5 531.0 C 908.8 529.4 907.6 528.1 906.3 527.1 C 904.9 526.1 903.1 525.6 901.4 524.9 C 899.8 524.2 898.3 522.8 896.4 523.0 C 894.5 523.2 892.0 524.7 890.0 526.0 C 888.0 527.3 885.7 529.1 884.7 530.7 C 883.8 532.3 884.4 534.0 884.3 535.7 C 884.1 537.3 883.6 539.0 883.9 540.5 C 884.1 542.0 884.5 543.4 885.6 544.7 C 886.6 545.9 889.9 546.6 890.2 548.0 C 890.4 549.5 887.9 551.6 887.1 553.3 C 886.4 555.0 885.5 556.6 885.8 558.0 C 886.0 559.4 887.0 560.6 888.6 561.8 C 890.3 563.0 895.4 563.5 895.7 564.9 C 895.9 566.3 891.3 568.5 890.0 570.2 C 888.6 571.8 887.3 573.3 887.5 574.7 C 887.7 576.1 889.0 577.3 891.1 578.5 C 893.2 579.7 899.9 580.6 900.1 581.9 C 900.2 583.3 893.9 585.2 892.0 586.8 C 890.1 588.3 888.3 589.7 888.4 591.1 C 888.5 592.4 890.2 593.7 892.6 595.0 C 895.1 596.4 898.1 597.6 903.3 599.2 C 908.5 600.8 917.8 606.1 923.8 604.6 Z"/>
    <path stroke-width="5" d="M 923.8 604.6 C 918.9 582.3 910.8 561.4 899.7 541.7"/>
    <path stroke-width="7" d="M 510.0 552.8 C 509.0 552.2 507.6 551.7 506.3 551.3 C 504.0 550.6 499.0 551.7 498.2 550.3 C 497.3 548.9 500.6 544.9 500.9 542.7 C 501.2 540.6 500.8 538.7 499.8 537.4 C 498.9 536.0 496.9 535.3 495.1 534.6 C 493.2 533.8 489.8 534.3 488.7 533.0 C 487.7 531.7 489.1 528.6 488.7 526.9 C 488.2 525.2 487.2 523.9 486.0 522.7 C 484.8 521.6 483.0 520.9 481.4 520.1 C 479.9 519.3 478.6 517.7 476.7 517.7 C 474.8 517.7 472.1 518.9 470.0 520.0 C 467.9 521.1 465.4 522.6 464.2 524.0 C 463.1 525.5 463.5 527.3 463.2 528.9 C 462.8 530.5 462.2 532.1 462.2 533.6 C 462.2 535.1 462.5 536.5 463.4 537.8 C 464.3 539.1 467.5 540.1 467.6 541.6 C 467.6 543.0 464.8 544.9 463.9 546.4 C 463.0 548.0 461.9 549.5 462.0 550.9 C 462.1 552.3 462.9 553.6 464.4 554.9 C 465.9 556.2 471.0 557.3 471.0 558.7 C 471.1 560.1 466.3 561.8 464.8 563.2 C 463.2 564.7 461.7 566.0 461.8 567.4 C 461.8 568.8 463.0 570.1 464.9 571.5 C 466.9 572.9 473.4 574.4 473.4 575.8 C 473.4 577.2 467.0 578.4 464.9 579.6 C 462.8 580.9 460.9 582.1 460.8 583.4 C 460.8 584.8 462.2 586.2 464.6 587.8 C 466.9 589.3 469.7 590.8 474.7 593.0 C 479.7 595.1 488.3 601.4 494.5 600.6 C 497.2 600.2 500.0 598.4 502.7 596.3"/>
    <path stroke-width="5" d="M 494.5 600.6 C 494.0 595.8 493.3 591.0 492.5 586.2 M 489.1 570.3 C 486.3 558.7 482.5 547.4 477.8 536.4"/>
    <path stroke-width="7" d="M 510.7 600.9 C 516.9 602.1 525.8 596.5 530.9 594.8 C 535.9 593.0 538.8 591.8 541.2 590.5 C 543.6 589.2 545.1 588.0 545.1 586.8 C 545.1 585.6 543.3 584.5 541.3 583.2 C 539.2 581.9 532.8 580.4 532.9 579.2 C 532.9 578.0 539.6 577.0 541.6 575.9 C 543.6 574.7 544.8 573.7 544.9 572.5 C 545.0 571.2 543.6 569.9 542.2 568.5 C 540.7 567.0 536.1 565.1 536.2 563.8 C 536.3 562.6 541.4 562.0 543.0 561.0 C 544.5 559.9 545.4 558.8 545.6 557.6 C 545.8 556.3 544.8 554.8 544.0 553.3 C 543.2 551.8 540.5 549.8 540.7 548.5 C 540.9 547.1 544.1 546.6 545.1 545.5 C 546.1 544.3 546.4 543.1 546.6 541.7 C 546.7 540.3 546.2 538.7 546.0 537.2 C 545.8 535.7 546.3 534.1 545.3 532.6 C 544.3 531.0 541.9 529.3 540.0 528.0 C 538.1 526.7 535.6 525.1 533.7 524.8 C 531.9 524.5 530.5 525.8 528.9 526.4 C 527.3 527.0 525.5 527.3 524.2 528.3 C 522.9 529.2 521.8 530.3 521.2 531.9 C 520.6 533.5 521.7 536.6 520.5 537.7 C 519.4 538.8 516.1 537.9 514.2 538.4 C 512.3 538.8 510.3 539.3 509.2 540.5 C 508.2 541.7 507.7 543.4 507.8 545.5 C 507.9 547.6 510.9 551.8 509.9 553.0 C 508.9 554.3 504.1 552.7 501.8 553.1 C 499.6 553.5 497.3 554.1 496.4 555.4 C 495.5 556.8 495.6 558.9 496.3 561.3 C 497.1 563.6 501.9 568.4 501.1 569.8 C 500.3 571.2 493.9 569.4 491.3 569.8 C 488.7 570.3 486.2 570.9 485.5 572.4 C 484.7 573.9 485.3 576.3 486.7 578.8 C 488.2 581.4 490.1 584.1 494.1 587.8 C 498.1 591.5 504.6 599.8 510.7 600.9 Z"/>
    <path stroke-width="5" d="M 510.7 600.9 C 514.1 580.1 520.8 560.6 531.0 542.4"/>
    <path stroke-width="7" d="M -10.0 600.0 C 3.9 599.1 17.7 598.5 31.5 597.9"/>
    <path stroke-width="5" d="M 225.1 278.5 C 230.2 305.0 214.7 331.2 228.0 352.0 C 240.0 368.0 254.0 344.0 256.0 322.0 C 262.0 346.0 276.0 362.0 288.0 346.0 C 299.4 327.0 289.1 302.5 296.7 277.8"/>
    <path stroke-width="5" d="M 214.0 270.0 A 46.0 13.0 0 0 0 306.0 270.0 A 46.0 13.0 0 0 0 214.0 270.0 Z"/>
    <path stroke-width="7" d="M 489.3 600.0 L 30.0 600.0 C 110.0 490.0 186.0 340.0 214.0 272.0 C 238.0 260.0 282.0 260.0 306.0 272.0 C 331.0 332.7 394.3 458.8 464.5 563.5 M 472.0 574.6 C 472.4 575.1 472.8 575.7 473.2 576.2"/>
    <path stroke-width="5" d="M 120.0 520.0 C 140.0 500.0 150.0 480.0 160.0 460.0"/>
    <path stroke-width="5" d="M 400.0 520.0 C 380.0 500.0 372.0 480.0 360.0 456.0"/>
    <path stroke-width="5" d="M 200.0 560.0 C 214.0 540.0 220.0 520.0 232.0 500.0"/>
    <path stroke-width="7" d="M 548.9 620.0 L 430.0 620.0 C 435.6 612.8 441.3 606.2 447.3 600.0 M 546.3 543.2 C 593.1 533.2 642.9 541.9 690.0 566.0 C 719.5 541.7 754.5 526.3 792.9 519.0 M 833.6 514.3 C 871.4 512.6 911.7 517.7 952.7 528.8 M 976.7 535.9 C 987.8 539.5 998.9 543.6 1010.0 548.0 L 1010.0 620.0 L 935.1 620.0"/>
    <path stroke-width="7" d="M 235.8 240.4 C 219.6 240.4 219.6 220.6 235.8 221.7 C 235.8 206.2 257.4 204.4 261.0 213.4 C 266.4 197.2 293.4 199.0 293.4 217.0 C 309.6 213.4 318.6 240.4 302.4 240.4 L 235.8 240.4 Z"/>
    <path stroke-width="7" d="M 258.5 190.0 C 236.0 190.0 236.0 162.5 258.5 164.0 C 258.5 142.5 288.5 140.0 293.5 152.5 C 301.0 130.0 338.5 132.5 338.5 157.5 C 361.0 152.5 373.5 190.0 351.0 190.0 L 258.5 190.0 Z"/>
    <path stroke-width="7" d="M 299.3 130.4 C 269.6 130.4 269.6 94.1 299.3 96.1 C 299.3 67.7 338.9 64.4 345.5 80.9 C 355.4 51.2 404.9 54.5 404.9 87.5 C 434.6 80.9 451.1 130.4 421.4 130.4 L 299.3 130.4 Z"/>
    <path stroke-width="7" d="M 698.0 154.0 C 728.0 152.0 762.0 162.0 784.0 176.0 C 760.0 190.0 728.0 196.0 700.0 190.0 Z"/>
    <path stroke-width="7" d="M 701.7 153.8 A 24.0 24.0 0 0 0 662.0 172.0 A 24.0 24.0 0 0 0 701.5 190.3"/>
    <circle cx="690.0" cy="166.0" r="9.0" fill="#111" stroke="none"/>
    <path stroke-width="5" d="M 710.0 173.0 C 732.0 177.0 752.0 177.0 768.0 174.0"/>
    <path stroke-width="7" d="M 676.9 149.8 C 664.6 127.1 643.0 113.8 612.0 106.0 C 628.0 128.0 644.0 146.0 660.0 162.0 L 666.1 158.6"/>
    <path stroke-width="7" d="M 580.9 208.3 A 40.0 22.0 -12 1 0 659.1 191.7 A 40.0 22.0 -12 1 0 580.9 208.3 Z"/>
    <path stroke-width="7" d="M 615.5 177.6 C 578.0 142.4 531.8 115.1 470.0 108.0 C 486.0 128.0 494.0 144.0 502.0 158.0 C 522.0 152.0 538.0 156.0 550.0 170.0 C 565.5 164.2 580.9 171.5 591.0 188.2"/>
    <path stroke-width="7" d="M 618.9 177.0 C 625.0 164.1 631.9 151.9 639.7 140.5 M 652.8 123.2 C 671.0 101.0 693.2 82.1 720.0 66.0 C 716.0 92.0 716.0 112.0 720.0 128.0 C 709.3 132.6 700.9 140.7 694.8 149.7 M 662.0 171.5 C 656.3 173.8 650.3 176.0 644.3 178.1"/>
    <path stroke-width="5" d="M 603.9 223.5 L 600.0 234.0 M 621.6 222.9 L 620.0 236.0"/>
    <path stroke-width="7" d="M 753.7 280.9 C 728.2 279.2 699.3 287.7 680.6 299.6 C 701.0 311.5 728.2 316.6 752.0 311.5 Z"/>
    <path stroke-width="7" d="M 750.6 280.7 A 20.4 20.4 -0 0 1 784.3 296.2 A 20.4 20.4 -0 0 1 750.7 311.8"/>
    <circle cx="760.5" cy="291.1" r="7.8" fill="#111" stroke="none"/>
    <path stroke-width="5" d="M 743.5 297.1 C 724.8 300.4 707.8 300.4 694.2 297.9"/>
    <path stroke-width="7" d="M 771.7 277.3 C 782.1 258.1 800.4 246.7 826.8 240.1 C 813.2 258.8 799.6 274.1 786.0 287.7 L 780.8 284.8"/>
    <path stroke-width="7" d="M 853.2 327.1 A 34.0 18.7 12 1 1 786.8 312.9 A 34.0 18.7 12 1 1 853.2 327.1 Z"/>
    <path stroke-width="7" d="M 824.1 300.7 C 855.9 270.9 895.1 247.8 947.5 241.8 C 933.9 258.8 927.1 272.4 920.3 284.3 C 903.3 279.2 889.7 282.6 879.5 294.5 C 866.4 289.6 853.4 295.7 844.8 309.7"/>
    <path stroke-width="7" d="M 820.8 300.1 C 815.6 289.2 809.8 279.0 803.2 269.4 M 792.2 254.7 C 776.7 235.9 757.8 219.8 735.0 206.1 C 738.4 228.2 738.4 245.2 735.0 258.8 C 744.1 262.7 751.3 269.6 756.4 277.2 M 784.3 295.8 C 789.0 297.7 793.9 299.5 798.9 301.3"/>
    <path stroke-width="5" d="M 833.8 340.3 L 837.0 348.9 M 818.6 339.8 L 820.0 350.6"/>
    <path stroke-width="7" d="M 598.5 345.5 C 621.0 344.0 646.5 351.5 663.0 362.0 C 645.0 372.5 621.0 377.0 600.0 372.5 Z"/>
    <path stroke-width="7" d="M 601.2 345.4 A 18.0 18.0 0 0 0 571.5 359.0 A 18.0 18.0 0 0 0 601.1 372.7"/>
    <circle cx="592.5" cy="354.5" r="7.0" fill="#111" stroke="none"/>
    <path stroke-width="5" d="M 607.5 359.8 C 624.0 362.8 639.0 362.8 651.0 360.5"/>
    <path stroke-width="7" d="M 582.6 342.4 C 573.5 325.4 557.3 315.3 534.0 309.5 C 546.0 326.0 558.0 339.5 570.0 351.5 L 574.6 349.0"/>
    <path stroke-width="7" d="M 510.7 386.2 A 30.0 16.5 -12 1 0 569.3 373.8 A 30.0 16.5 -12 1 0 510.7 386.2 Z"/>
    <path stroke-width="7" d="M 536.3 362.9 C 508.3 336.7 473.7 316.3 427.5 311.0 C 439.5 326.0 445.5 338.0 451.5 348.5 C 466.5 344.0 478.5 347.0 487.5 357.5 C 499.0 353.2 510.5 358.5 518.1 370.9"/>
    <path stroke-width="7" d="M 539.4 362.4 C 543.9 352.8 549.0 343.8 554.8 335.4 M 564.6 322.4 C 578.2 305.8 594.9 291.6 615.0 279.5 C 612.0 299.0 612.0 314.0 615.0 326.0 C 606.9 329.5 600.7 335.6 596.1 342.3 M 571.5 358.6 C 567.4 360.3 563.1 361.9 558.7 363.4"/>
    <path stroke-width="5" d="M 527.8 398.0 L 525.0 405.5 M 541.2 397.5 L 540.0 407.0"/>
    <path stroke-width="7" d="M 854.0 110.0 A 46.0 46.0 0 0 0 946.0 110.0 A 46.0 46.0 0 0 0 854.0 110.0 Z"/>
    <path stroke-width="5" d="M 958.0 110.0 L 980.0 110.0 M 941.0 151.0 L 956.6 166.6 M 900.0 168.0 L 900.0 190.0 M 859.0 151.0 L 843.4 166.6 M 842.0 110.0 L 820.0 110.0 M 859.0 69.0 L 843.4 53.4 M 900.0 52.0 L 900.0 30.0 M 941.0 69.0 L 956.6 53.4"/>
    <g transform="translate(552 371) scale(0.42)">
      <circle cx="728" cy="204" r="32" stroke-width="12.904761904761905"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 709.8 204.4 A 18.6 18.6 0 1 0 747.0 204.4 A 18.6 18.6 0 1 0 709.8 204.4 Z M 713.8 204.0 A 15 15 0 1 0 743.8 204.0 A 15 15 0 1 0 713.8 204.0 Z"/>
      <circle cx="796.0" cy="196.0" r="6" fill="#111" stroke="none"/>
      <path stroke-width="12.904761904761905" d="M 806.0 232.0 C 782.0 246.0 748.0 248.0 726.0 236.0"/>
      <path stroke-width="11.904761904761905" d="M 726.0 236.0 C 718.0 232.0 714.0 224.0 716.0 216.0"/>
      <path stroke-width="16.666666666666668" d="M 640.0 222.0 C 640.0 180.0 676.0 158.0 708.0 162.0 C 724.0 146.0 756.0 146.0 768.0 166.0 C 800.0 172.0 820.0 196.0 816.0 222.0 C 812.0 252.0 770.0 262.0 720.0 260.0 C 670.0 258.0 640.0 252.0 640.0 222.0 Z"/>
      <path stroke-width="16.666666666666668" d="M 605.8 582.3 C 610.2 573.0 614.4 563.3 618.1 554.1 C 624.2 539.2 628.9 524.3 633.4 509.6 C 638.0 494.9 641.6 480.3 645.2 465.9 C 648.7 451.4 651.7 437.1 654.7 422.9 C 657.6 408.7 660.2 394.7 662.9 380.9 C 665.6 367.0 668.1 353.1 670.8 340.0 C 673.5 326.9 676.1 313.4 679.1 302.1 C 682.1 290.8 683.3 281.1 688.9 272.1 C 692.4 266.6 702.0 263.8 708.1 259.4 M 640.9 210.7 C 636.3 216.0 632.1 221.8 628.2 226.5 C 617.4 239.4 609.5 258.0 602.5 272.8 C 595.5 287.7 591.3 301.8 586.3 315.7 C 581.2 329.6 576.8 343.0 572.1 356.3 C 567.5 369.7 563.1 382.9 558.4 395.8 C 553.7 408.7 549.1 421.5 544.1 433.9 C 539.2 446.3 534.1 458.4 528.7 470.0 C 523.2 481.6 517.6 493.0 511.5 503.5 C 509.5 507.0 507.6 510.3 505.6 513.6"/>
      <path stroke-width="16.666666666666668" d="M 600.4 664.3 A 215.0 128.0 -10 0 0 611.7 602.7 A 215.0 128.0 -10 0 0 605.8 582.3 M 505.6 513.6 A 215.0 128.0 -10 0 0 255.4 558.7 M 251.5 561.4 A 215.0 128.0 -10 0 0 221.4 586.9"/>
      <path stroke-width="16.666666666666668" d="M 255.5 558.7 C 254.1 559.0 252.8 560.0 251.5 561.4 M 221.4 586.9 C 218.1 588.6 214.8 590.4 211.5 592.1 C 202.9 596.7 194.4 601.5 186.0 606.5 C 177.7 611.4 169.5 616.5 161.5 621.7 C 153.5 626.9 145.6 632.3 137.9 637.7 C 130.2 643.2 122.6 648.8 115.1 654.5 C 110.9 657.7 106.7 661.0 102.6 664.3"/>
      <path stroke-width="11.904761904761905" d="M 360.6 596.9 A 40.0 28.0 -10 1 0 439.4 583.1 A 40.0 28.0 -10 1 0 360.6 596.9 Z"/>
      <path stroke-width="11.904761904761905" d="M 272.4 634.9 A 28.0 22.0 -10 1 0 327.6 625.1 A 28.0 22.0 -10 1 0 272.4 634.9 Z"/>
      <path stroke-width="11.904761904761905" d="M 454.0 640.0 A 26.0 20.0 0 0 0 506.0 640.0 A 26.0 20.0 0 0 0 454.0 640.0 Z"/>
      <path stroke-width="11.904761904761905" d="M 545.0 484.0 A 27.0 27.0 0 0 0 599.0 484.0 A 27.0 27.0 0 0 0 545.0 484.0 Z"/>
      <path stroke-width="11.904761904761905" d="M 582.0 392.0 A 22.0 22.0 0 0 0 626.0 392.0 A 22.0 22.0 0 0 0 582.0 392.0 Z"/>
      <path stroke-width="11.9" d="M 186.8 664.8 C 257.9 668.1 328.9 670.9 400.0 664.3 C 465.6 658.2 531.2 660.1 601.0 663.0"/>
      <path stroke-width="11.9" d="M 106.3 661.4 C 133.1 662.3 159.9 663.6 186.8 664.8"/>
    </g>
    <g transform="translate(-20 482.5) scale(0.55)">
      <circle cx="758" cy="446" r="36" stroke-width="10.09090909090909"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 738.1 447.0 A 20.9 20.9 0 1 0 779.9 447.0 A 20.9 20.9 0 1 0 738.1 447.0 Z M 749.5 443.6 A 13 13 0 1 0 775.5 443.6 A 13 13 0 1 0 749.5 443.6 Z"/>
      <circle cx="872.0" cy="480.0" r="7" fill="#111" stroke="none"/>
      <path stroke-width="10.09090909090909" d="M 882 520 C 846 538 792 534 768 516"/>
      <path stroke-width="9.09090909090909" d="M 768 516 C 758 512 752 504 754 494"/>
      <path stroke-width="9.09090909090909" d="M 872.0 452.0 C 852.0 476.0 846.0 508.0 858.0 534.0"/>
      <path stroke-width="12.727272727272727" d="M 851.9 428.3 C 860.2 416.2 869.5 408.4 884.0 402.0 C 880.5 419.7 878.5 435.9 873.9 451.9"/>
      <path stroke-width="12.727272727272727" d="M 746.4 370.1 C 774.8 326.9 817.1 293.5 866.0 270.0 C 838.1 301.6 810.2 338.4 787.2 380.4"/>
      <path stroke-width="12.727272727272727" d="M 671.5 385.5 C 683.8 345.1 702.8 311.1 730.0 282.0 C 722.4 310.9 717.1 341.1 713.2 371.4"/>
      <path stroke-width="12.727272727272727" d="M 873.9 451.9 C 884.5 465.3 892.9 479.9 898.0 496.0 C 904.0 516.0 888.0 532.0 870.0 532.0 C 830.0 546.0 772.0 560.0 722.0 556.0 C 682.0 552.0 640.0 520.0 640.0 470.0 C 640.0 440.0 642.0 420.0 646.0 404.0 C 653.7 396.6 662.4 390.5 671.5 385.5 M 713.2 371.4 C 724.3 369.7 735.5 369.2 746.4 370.1 M 787.2 380.4 C 793.2 383.1 798.8 386.3 804.0 390.0 C 821.1 402.2 837.5 414.7 851.9 428.3"/>
      <path stroke-width="12.727272727272727" d="M 686.4 545.0 A 48.7 48.7 0 0 1 682.1 543.9 A 48.7 48.7 0 0 1 610.1 541.6 A 48.7 48.7 0 0 1 550.7 500.7 A 48.7 48.7 0 0 1 522.8 434.2 A 48.7 48.7 0 0 1 535.3 363.2 A 48.7 48.7 0 0 1 584.2 310.2 A 48.7 48.7 0 0 1 654.1 292.1 A 48.7 48.7 0 0 1 713.7 301.2 M 722.5 314.4 A 48.7 48.7 0 0 1 722.6 314.6 A 48.7 48.7 0 0 1 765.2 345.2"/>
      <path stroke-width="9.09090909090909" d="M 686.4 346.5 A 82.0 82.0 0 0 0 568.0 420.0 A 82.0 82.0 0 0 0 646.3 501.9 M 715.8 371.1 A 82.0 82.0 0 0 0 713.6 368.3"/>
      <path stroke-width="9.09090909090909" d="M 543.1 472.5 A 16.0 16.0 0 0 0 575.1 472.5 A 16.0 16.0 0 0 0 543.1 472.5 Z"/>
      <path stroke-width="9.09090909090909" d="M 532.6 392.8 A 16.0 16.0 0 0 0 564.6 392.8 A 16.0 16.0 0 0 0 532.6 392.8 Z"/>
      <path stroke-width="9.09090909090909" d="M 581.5 329.1 A 16.0 16.0 0 0 0 613.5 329.1 A 16.0 16.0 0 0 0 581.5 329.1 Z"/>
      <path stroke-width="9.09090909090909" d="M 661.2 318.6 A 16.0 16.0 0 0 0 693.2 318.6 A 16.0 16.0 0 0 0 661.2 318.6 Z"/>
      <path stroke-width="12.727272727272727" d="M 582.5 736.2 C 583.9 778.5 585.1 814.9 584.0 832.0 C 584.0 844.0 590.0 850.0 602.0 850.0 L 670.0 850.0 C 682.0 850.0 688.0 844.0 688.0 832.0 C 686.0 800.0 692.0 700.0 692.0 620.0 L 691.0 620.0"/>
      <path stroke-width="12.727272727272727" d="M 227.4 700.8 C 229.0 757.5 231.4 810.3 230.0 832.0 C 230.0 844.0 236.0 850.0 248.0 850.0 L 320.0 850.0 C 332.0 850.0 338.0 844.0 338.0 832.0 C 337.0 815.4 338.1 780.7 339.4 739.9"/>
      <path stroke-width="12.727272727272727" d="M 691.0 620.0 C 692.7 600.2 692.7 579.6 692.0 560.0 C 692.0 555.8 691.9 551.6 691.6 547.6 M 516.7 384.8 C 493.0 380.3 467.3 378.0 440.0 378.0 C 318.8 378.0 236.7 425.0 199.1 490.6 M 202.6 670.2 C 209.6 681.9 217.9 692.3 227.4 700.8 M 339.4 739.9 C 415.4 751.2 510.6 749.9 582.5 736.2"/>
      <path stroke-width="12.727272727272727" d="M 199.2 490.6 C 148.7 539.2 96.6 598.4 52.0 650.0 C 42.0 664.0 54.0 676.0 68.0 670.0 C 114.9 654.9 164.1 651.2 202.6 670.2"/>
      <path stroke-width="12.727272727272727" d="M 337.9 829.9 C 338.6 830.0 339.3 830.0 340.0 830.0 L 392.0 830.0 C 404.0 830.0 410.0 824.0 410.0 812.0 C 408.9 794.4 410.2 774.4 411.6 746.6"/>
      <path stroke-width="12.727272727272727" d="M 502.3 745.9 C 503.8 774.0 505.1 794.2 504.0 812.0 C 504.0 824.0 510.0 830.0 522.0 830.0 L 582.0 830.0 C 582.7 830.0 583.4 830.0 584.1 829.9"/>
      <path stroke-width="9.09090909090909" d="M 252 850 V 826 A 16 16 0 0 1 284 826 V 850 M 288 850 V 826 A 16 16 0 0 1 320 826 V 850 M 602 850 V 826 A 16 16 0 0 1 634 826 V 850 M 638 850 V 826 A 16 16 0 0 1 670 826 V 850"/>
      <path stroke-width="9.09090909090909" d="M 398.4 455.8 A 42.0 30.0 -8 1 0 481.6 444.2 A 42.0 30.0 -8 1 0 398.4 455.8 Z"/>
      <path stroke-width="9.09090909090909" d="M 300.5 464.8 A 30.0 24.0 10 1 0 359.5 475.2 A 30.0 24.0 10 1 0 300.5 464.8 Z"/>
      <path stroke-width="9.09090909090909" d="M 518.3 456.1 A 28.0 22.0 0 0 0 512.0 470.0 A 28.0 22.0 0 0 0 535.1 491.7"/>
      <path stroke-width="9.09090909090909" d="M 364.0 560.0 A 26.0 20.0 0 0 0 416.0 560.0 A 26.0 20.0 0 0 0 364.0 560.0 Z"/>
      <path stroke-width="9.09090909090909" d="M 228.0 560.0 A 22.0 18.0 0 0 0 272.0 560.0 A 22.0 18.0 0 0 0 228.0 560.0 Z"/>
      <path stroke-width="9.09090909090909" d="M 482.0 620.0 A 18.0 18.0 0 0 0 518.0 620.0 A 18.0 18.0 0 0 0 482.0 620.0 Z"/>
    </g>
  </g>
</svg>
`,_=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="866" cy="660" r="28" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 850.4 660.6 A 16.2 16.2 0 1 0 882.8000000000001 660.6 A 16.2 16.2 0 1 0 850.4 660.6 Z M 864.8 655.8 A 6.5 6.5 0 1 0 877.8 655.8 A 6.5 6.5 0 1 0 864.8 655.8 Z"/>
    <circle cx="936.0" cy="668.0" r="6" fill="#111" stroke="none"/>
    <path stroke-width="8" d="M 928 704 C 904 720 870 722 846 706"/>
    <path stroke-width="7" d="M 846 706 C 838 702 834 694 836 686"/>
    <path stroke-width="10" d="M 774.0 657.3 A 90.0 60.0 12 1 0 950.0 694.7 A 90.0 60.0 12 1 0 774.0 657.3 Z"/>
    <path stroke-width="10" d="M 703.3 653.8 C 709.9 656.2 716.5 659.0 723.1 661.8 C 730.0 664.7 736.9 667.9 743.9 671.2 C 750.9 674.4 757.9 677.9 765.2 681.4 C 769.2 683.4 773.3 685.4 777.5 687.4 M 825.3 614.9 C 821.1 611.6 817.0 608.3 812.6 604.9 C 806.2 600.0 799.8 594.9 793.1 589.9 C 786.4 584.9 779.6 579.8 772.5 574.8 C 765.4 569.9 758.2 564.9 750.6 560.1 C 743.1 555.3 735.3 550.6 727.3 546.1 C 719.3 541.7 710.7 537.3 702.5 533.4 C 695.1 529.9 689.7 509.4 681.0 519.6"/>
    <path stroke-width="10" d="M 562.1 739.4 C 563.6 783.5 565.2 821.3 564.0 840.0 C 564.0 852.0 570.0 858.0 582.0 858.0 L 640.0 858.0 C 652.0 858.0 658.0 852.0 658.0 840.0 C 656.5 815.5 659.6 758.1 661.2 696.6"/>
    <path stroke-width="10" d="M 270.7 690.5 C 272.2 754.2 275.6 814.7 274.0 840.0 C 274.0 852.0 280.0 858.0 292.0 858.0 L 368.0 858.0 C 380.0 858.0 386.0 852.0 386.0 840.0 C 384.9 821.6 386.3 784.8 387.8 741.6"/>
    <path stroke-width="10" d="M 257.7 679.2 A 250.0 150.0 0 0 0 270.6 690.5 M 387.8 741.7 A 250.0 150.0 0 0 0 562.1 739.4 M 661.2 696.6 A 250.0 150.0 0 0 0 703.4 653.8 M 681.0 519.6 A 250.0 150.0 0 0 0 222.2 580.2"/>
    <path stroke-width="10" d="M 222.2 580.2 C 222.2 580.2 222.1 580.2 222.0 580.2 C 214.5 581.3 206.8 582.0 199.1 582.4 C 191.3 582.8 183.5 582.8 175.7 582.4 C 167.8 582.0 159.9 581.3 152.0 580.1 C 144.1 578.9 136.2 577.4 128.3 575.4 C 120.4 573.4 112.5 571.1 104.7 568.3 C 96.9 565.5 89.2 562.4 81.5 558.8 C 73.8 555.1 64.3 549.1 58.3 546.5 C 52.3 543.9 49.7 542.6 45.7 543.2 C 41.7 543.7 36.9 546.5 34.5 549.7 C 32.0 552.9 30.6 558.3 31.2 562.3 C 31.7 566.3 33.4 568.3 37.7 573.5 C 42.0 578.8 50.3 587.2 57.2 593.8 C 64.2 600.3 71.7 606.8 79.5 612.8 C 87.2 618.9 95.4 624.6 103.8 630.0 C 112.2 635.3 121.0 640.3 130.1 644.9 C 139.1 649.5 148.5 653.7 158.0 657.4 C 167.6 661.1 177.4 664.4 187.4 667.2 C 197.4 670.0 207.6 672.4 217.9 674.3 C 228.2 676.2 238.7 677.6 249.2 678.5 C 252.0 678.8 254.8 679.0 257.7 679.2"/>
    <path stroke-width="10" d="M 385.9 837.4 C 387.7 837.8 389.7 838.0 392.0 838.0 L 428.0 838.0 C 440.0 838.0 446.0 832.0 446.0 820.0 C 444.9 802.3 446.2 779.6 447.7 749.4"/>
    <path stroke-width="10" d="M 502.3 748.7 C 503.7 779.3 505.1 802.1 504.0 820.0 C 504.0 832.0 510.0 838.0 522.0 838.0 L 558.0 838.0 C 560.3 838.0 562.3 837.8 564.1 837.4"/>
    <path stroke-width="7" d="M 285 858 V 836 A 13 13 0 0 1 311 836 V 858 M 317 858 V 836 A 13 13 0 0 1 343 836 V 858 M 349 858 V 836 A 13 13 0 0 1 375 836 V 858 M 574 858 V 836 A 12 12 0 0 1 598 836 V 858 M 602 858 V 836 A 12 12 0 0 1 626 836 V 858 M 630 858 V 836 A 12 12 0 0 1 654 836 V 858"/>
    <path stroke-width="10" d="M 230.7 556.7 C 202.5 531.8 193.7 502.8 199.9 485.8 C 211.1 480.2 228.7 480.9 247.9 490.2"/>
    <path stroke-width="10" d="M 262.1 516.7 C 230.9 467.8 233.5 429.4 248.2 409.0 C 266.0 407.2 288.8 415.2 310.1 438.6"/>
    <path stroke-width="10" d="M 319.9 480.1 C 297.9 414.7 312.4 375.0 334.2 356.2 C 354.5 359.6 377.2 374.2 394.0 406.9"/>
    <path stroke-width="10" d="M 395.1 456.9 C 386.1 381.7 409.7 344.2 436.2 329.1 C 458.1 338.1 479.9 360.7 488.8 405.8"/>
    <path stroke-width="10" d="M 480.2 450.1 C 486.2 383.4 514.6 353.2 541.3 344.9 C 561.0 357.7 577.6 385.7 575.2 433.2"/>
    <path stroke-width="10" d="M 563.1 460.8 C 580.6 409.4 610.8 388.0 634.8 386.6 C 649.9 401.4 658.4 430.8 646.3 471.8"/>
    <path stroke-width="10" d="M 633.5 486.6 C 655.3 456.9 682.7 445.7 699.9 449.9 C 708.9 464.0 707.8 490.8 690.2 519.1"/>
    <path stroke-width="10" d="M 172.8 582.2 C 182.0 570.0 188.5 554.7 191.4 539.2 C 167.9 544.4 144.8 558.2 133.2 576.6"/>
    <path stroke-width="10" d="M 125.4 574.7 C 136.6 565.0 145.3 550.7 149.9 535.3 C 125.6 535.2 100.9 544.9 89.4 562.3"/>
    <path stroke-width="7" d="M 430 540 A 40 28 0 1 0 510 540 A 40 28 0 1 0 430 540 Z"/>
    <path stroke-width="7" d="M 330.5 564.8 A 30 22 10 1 0 389.5 575.2 A 30 22 10 1 0 330.5 564.8 Z"/>
    <path stroke-width="7" d="M 552.4 564.9 A 28 22 -10 1 0 607.6 555.1 A 28 22 -10 1 0 552.4 564.9 Z"/>
    <path stroke-width="7" d="M 402 640 A 18 18 0 1 0 438 640 A 18 18 0 1 0 402 640 Z"/>
    <path stroke-width="7" d="M 514 650 A 16 16 0 1 0 546 650 A 16 16 0 1 0 514 650 Z"/>
    <path stroke-width="10" d="M 61.0 997.0 C 70.2 997.3 81.5 983.7 89.4 978.2 C 97.2 972.8 104.1 968.5 108.3 964.2 C 112.5 960.0 115.1 955.8 114.5 952.6 C 113.9 949.4 109.6 947.0 104.8 945.0 C 100.0 943.0 86.3 943.7 85.5 940.6 C 84.8 937.4 97.3 930.5 100.5 926.1 C 103.6 921.8 105.3 917.8 104.4 914.7 C 103.6 911.6 99.6 909.5 95.3 907.7 C 91.0 905.9 79.6 907.0 78.6 904.0 C 77.6 901.0 87.2 893.9 89.3 889.7 C 91.3 885.5 92.1 881.6 90.9 878.7 C 89.8 875.8 86.2 873.9 82.4 872.2 C 78.6 870.5 69.7 871.4 68.4 868.5 C 67.1 865.7 73.8 859.1 74.7 855.1 C 75.6 851.2 75.4 847.7 73.9 845.0 C 72.5 842.3 69.2 840.4 66.1 838.7 C 62.9 836.9 56.6 837.1 55.0 834.4 C 53.4 831.8 56.8 826.3 56.4 822.9 C 56.1 819.6 54.7 816.7 52.9 814.2 C 51.1 811.8 48.1 810.1 45.5 808.1 C 43.0 806.1 40.2 803.8 37.6 802.4 C 35.0 801.1 31.9 799.3 30.0 800.0 C 28.1 800.7 27.1 804.2 26.0 806.8 C 25.0 809.5 24.4 812.9 23.7 815.9 C 22.9 818.9 21.6 821.9 21.6 824.8 C 21.6 827.6 22.2 830.4 23.8 833.2 C 25.5 835.9 31.3 838.5 31.4 841.4 C 31.5 844.2 26.0 847.2 24.2 850.0 C 22.3 852.9 20.3 855.6 20.4 858.4 C 20.4 861.1 21.8 863.8 24.3 866.6 C 26.8 869.5 35.6 872.6 35.6 875.3 C 35.5 878.0 26.9 880.5 24.1 883.0 C 21.2 885.6 18.5 888.0 18.4 890.7 C 18.3 893.4 20.2 896.1 23.4 899.2 C 26.6 902.2 37.8 906.3 37.6 909.0 C 37.4 911.7 26.1 913.0 22.3 915.2 C 18.5 917.4 15.1 919.4 14.9 922.0 C 14.6 924.7 17.0 927.6 20.7 931.1 C 24.5 934.5 37.7 940.0 37.3 942.6 C 37.0 945.2 23.3 945.1 18.6 946.8 C 14.0 948.5 10.0 950.1 9.6 952.7 C 9.2 955.3 11.9 958.6 16.1 962.5 C 20.2 966.4 27.1 970.4 34.6 976.1 C 42.1 981.9 51.9 996.6 61.0 997.0 Z"/>
    <path stroke-width="7" d="M 61.0 997.0 C 65.0 937.8 57.6 880.3 38.9 824.4"/>
    <path stroke-width="10" d="M 153.0 999.3 C 160.5 1001.8 173.0 993.0 180.7 990.7 C 188.5 988.4 195.0 987.3 199.4 985.5 C 203.9 983.7 207.0 982.0 207.5 979.9 C 207.9 977.7 205.2 975.3 202.1 972.7 C 198.9 970.0 188.1 965.9 188.6 963.8 C 189.1 961.6 201.2 961.4 205.2 959.9 C 209.2 958.4 212.0 956.9 212.6 954.8 C 213.2 952.7 211.1 950.1 208.8 947.3 C 206.5 944.4 198.0 939.8 198.7 937.7 C 199.4 935.6 209.4 936.0 212.9 934.7 C 216.4 933.3 218.7 931.9 219.5 929.8 C 220.3 927.7 218.9 925.0 217.5 922.1 C 216.1 919.2 210.1 914.5 210.9 912.4 C 211.8 910.3 219.7 910.8 222.5 909.5 C 225.4 908.2 227.4 906.6 228.3 904.5 C 229.2 902.4 228.6 899.6 228.1 896.8 C 227.6 894.0 224.3 889.8 225.3 887.7 C 226.3 885.6 231.7 885.6 233.9 884.0 C 236.1 882.4 237.5 880.5 238.5 878.3 C 239.5 876.1 239.5 873.4 239.9 870.8 C 240.4 868.3 241.2 865.5 241.2 863.0 C 241.2 860.5 241.4 857.4 240.0 856.0 C 238.6 854.6 235.5 854.6 232.9 854.7 C 230.4 854.8 227.5 855.7 224.8 856.4 C 222.2 857.0 219.2 857.3 217.0 858.6 C 214.7 859.9 212.7 861.7 211.2 864.2 C 209.8 866.7 210.6 872.1 208.4 873.6 C 206.3 875.1 201.4 872.9 198.4 873.2 C 195.3 873.5 192.1 873.8 190.1 875.5 C 188.0 877.1 186.7 879.8 186.1 883.2 C 185.5 886.5 188.5 893.9 186.5 895.7 C 184.6 897.5 177.9 893.9 174.4 894.0 C 170.9 894.1 167.4 894.5 165.5 896.4 C 163.7 898.3 163.0 901.6 163.3 905.6 C 163.5 909.5 168.8 918.1 167.1 920.2 C 165.3 922.2 156.7 917.8 152.7 917.9 C 148.8 917.9 145.0 918.4 143.3 920.6 C 141.6 922.7 141.6 926.5 142.8 930.9 C 143.9 935.3 151.6 944.6 150.0 946.9 C 148.5 949.2 137.9 944.4 133.4 944.6 C 129.0 944.7 124.9 945.4 123.4 947.8 C 122.0 950.1 122.7 954.2 124.7 958.9 C 126.7 963.6 130.8 969.0 135.5 975.7 C 140.2 982.5 145.4 996.8 153.0 999.3 Z"/>
    <path stroke-width="7" d="M 153.0 999.3 C 167.2 951.2 191.1 908.7 224.6 871.8"/>
    <path stroke-width="10" d="M 790.0 900.0 A 90.0 52.0 0 0 0 970.0 900.0 A 90.0 52.0 0 0 0 790.0 900.0 Z"/>
    <path stroke-width="10" d="M 790.0 900.7 A 50.0 32.0 0 0 0 720.0 930.0 A 50.0 32.0 0 0 0 818.4 937.9"/>
    <path stroke-width="7" d="M 502.5 930 A 17.5 17.5 0 1 0 537.5 930 A 17.5 17.5 0 1 0 502.5 930 Z"/>
    <path stroke-width="7" d="M 524.3 913.0 A 21.0 11.2 -90 0 0 520.0 872.6 A 21.0 11.2 -90 0 0 515.7 913.0"/>
    <path stroke-width="7" d="M 537.5 928.9 A 21.0 11.2 -18 0 0 574.6 912.3 A 21.0 11.2 -18 0 0 534.8 920.7"/>
    <path stroke-width="7" d="M 526.2 946.4 A 21.0 11.2 54 0 0 553.7 976.4 A 21.0 11.2 54 0 0 533.7 940.9"/>
    <path stroke-width="7" d="M 506.3 940.9 A 21.0 11.2 126 0 0 486.3 976.4 A 21.0 11.2 126 0 0 513.8 946.4"/>
    <path stroke-width="7" d="M 505.2 920.7 A 21.0 11.2 198 0 0 465.4 912.3 A 21.0 11.2 198 0 0 502.5 928.9"/>
    <path stroke-width="10" d="M -10.0 790.0 C 82.9 782.0 177.7 783.1 273.7 785.2 M 445.9 788.3 C 465.3 788.4 484.7 788.3 504.1 788.1 M 658.5 780.7 C 826.9 769.2 923.1 785.7 1010.0 778.0"/>
    <path stroke-width="10" d="M 808 130 A 52 52 0 1 0 912 130 A 52 52 0 1 0 808 130 Z"/>
    <path stroke-width="8" d="M 926.0 130.0 L 952.0 130.0 M 906.7 176.7 L 925.1 195.1 M 860.0 196.0 L 860.0 222.0 M 813.3 176.7 L 794.9 195.1 M 794.0 130.0 L 768.0 130.0 M 813.3 83.3 L 794.9 64.9 M 860.0 64.0 L 860.0 38.0 M 906.7 83.3 L 925.1 64.9"/>
    <path stroke-width="10" d="M 89.2 184.0 C 51.0 184.0 51.0 137.2 89.2 139.8 C 89.2 103.2 140.2 99.0 148.8 120.2 C 161.5 82.0 225.2 86.2 225.2 128.8 C 263.5 120.2 284.8 184.0 246.5 184.0 Z"/>
    <path stroke-width="10" d="M 453.5 138.0 C 422.0 138.0 422.0 99.5 453.5 101.6 C 453.5 71.5 495.5 68.0 502.5 85.5 C 513.0 54.0 565.5 57.5 565.5 92.5 C 597.0 85.5 614.5 138.0 583.0 138.0 Z"/>
  </g>
</svg>
`,v=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="12" d="M 675.6 533.6 C 679.1 534.2 682.8 534.8 686.7 535.0 C 692.8 535.3 699.9 535.9 706.5 534.3 C 713.1 532.8 720.5 529.7 726.2 525.8 C 731.9 521.9 737.0 516.1 740.7 511.0 C 744.4 505.9 746.9 499.8 748.3 495.1 C 749.7 490.5 750.4 486.5 749.2 482.9 C 748.0 479.3 744.5 475.4 741.1 473.7 C 737.8 472.0 732.5 471.6 728.9 472.8 C 725.3 474.0 722.2 477.7 719.7 480.9 C 717.2 484.0 716.1 488.8 714.1 491.5 C 712.0 494.3 709.9 496.0 707.5 497.4 C 705.1 498.8 702.8 499.7 699.9 500.0 C 696.9 500.3 693.7 499.8 690.0 499.2 C 686.3 498.6 681.9 497.4 677.4 496.3 C 672.9 495.3 668.1 493.9 663.2 492.7 C 661.2 492.1 659.0 491.6 656.9 491.1"/>
    <path stroke-width="14" d="M 405 640 C 405 560 470 530 532 540 C 602 552 628 612 604 684 L 590 800 C 622 800 654 810 656 836 C 658 860 634 868 604 868 L 492 868 C 466 868 454 852 457 830 L 462 742 C 424 724 405 690 405 640 Z"/>
    <path stroke-width="14" d="M 331.2 742.1 C 331.1 779.9 333.0 808.6 336.0 834.0 C 338.0 854.0 352.0 866.0 374.0 866.0 L 477.6 866.0"/>
    <path stroke-width="15" d="M 461.1 758.4 C 433.7 757.8 406.2 754.3 380.0 748.0 C 300.0 728.0 200.0 762.0 84.0 800.0 C 64.0 806.0 62.0 782.0 84.0 770.0 C 200.0 700.0 255.0 640.0 292.0 560.0 C 325.0 480.0 375.0 420.0 436.0 390.0 C 476.0 370.0 495.0 322.0 500.0 250.0 C 515.0 160.0 598.0 126.0 690.0 126.0 C 802.0 126.0 876.0 170.0 876.0 248.0 C 876.0 320.0 834.0 350.0 770.0 350.0 C 712.0 350.0 668.0 354.0 646.0 374.0 C 622.0 396.0 626.0 436.0 650.0 480.0 C 690.0 540.0 700.0 620.0 650.0 690.0 C 637.0 707.2 619.2 721.0 598.3 731.6"/>
    <path stroke-width="10" d="M 700.0 351.0 C 640.0 362.0 590.0 392.0 582.0 440.0 C 575.2 478.9 575.0 517.8 577.8 558.6"/>
    <path stroke-width="10" d="M 527 866 V 844 A 13 13 0 0 1 553 844 V 866 M 559 866 V 844 A 13 13 0 0 1 585 844 V 866 M 591 866 V 844 A 13 13 0 0 1 617 844 V 866"/>
    <circle cx="690" cy="218" r="42" stroke-width="12"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 672 223 A 25 25 0 1 0 722 223 A 25 25 0 1 0 672 223 Z M 697 213 A 9 9 0 1 0 715 213 A 9 9 0 1 0 697 213 Z"/>
    <circle cx="840" cy="206" r="9" fill="#111" stroke="none"/>
    <path stroke-width="12" d="M 866 292 C 822 326 760 326 718 302"/>
    <path stroke-width="10" d="M 718 302 C 708 298 702 290 704 280"/>
    <path stroke-width="10" d="M 400 470 A 30 30 0 1 0 460 470 A 30 30 0 1 0 400 470 Z"/>
    <path stroke-width="10" d="M 321 575 A 24 24 0 1 0 369 575 A 24 24 0 1 0 321 575 Z"/>
    <path stroke-width="10" d="M 222 675 A 18 18 0 1 0 258 675 A 18 18 0 1 0 222 675 Z"/>
  </g>
</svg>
`,y=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="758" cy="446" r="31" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 740.8 446.8 A 18.0 18.0 0 1 0 776.8 446.8 A 18.0 18.0 0 1 0 740.8 446.8 Z M 758.3 440.8 A 6.5 6.5 0 1 0 771.3 440.8 A 6.5 6.5 0 1 0 758.3 440.8 Z"/>
    <circle cx="872.0" cy="480.0" r="7" fill="#111" stroke="none"/>
    <path stroke-width="8" d="M 882 520 C 846 538 792 534 768 516"/>
    <path stroke-width="7" d="M 768 516 C 758 512 752 504 754 494"/>
    <path stroke-width="7" d="M 872.0 452.0 C 852.0 476.0 846.0 508.0 858.0 534.0"/>
    <path stroke-width="10" d="M 851.9 428.3 C 860.2 416.2 869.5 408.4 884.0 402.0 C 880.5 419.7 878.5 435.9 873.9 451.9"/>
    <path stroke-width="10" d="M 746.4 370.1 C 774.8 326.9 817.1 293.5 866.0 270.0 C 838.1 301.6 810.2 338.4 787.2 380.4"/>
    <path stroke-width="10" d="M 687.8 378.1 C 703.7 338.3 726.7 303.7 760.0 276.0 C 747.0 306.9 735.3 337.9 727.0 369.9"/>
    <path stroke-width="10" d="M 873.9 451.9 C 884.5 465.3 892.9 479.9 898.0 496.0 C 904.0 516.0 888.0 532.0 870.0 532.0 C 830.0 546.0 772.0 560.0 722.0 556.0 C 682.0 552.0 640.0 520.0 640.0 470.0 C 640.0 440.0 642.0 420.0 646.0 404.0 C 658.2 392.4 672.5 383.8 687.8 378.1 M 727.0 369.9 C 733.6 369.5 740.0 369.6 746.4 370.1 M 787.2 380.4 C 793.2 383.1 798.8 386.3 804.0 390.0 C 821.1 402.2 837.5 414.7 851.9 428.3"/>
    <path stroke-width="10" d="M 686.4 545.0 A 48.7 48.7 0 0 1 682.1 543.9 A 48.7 48.7 0 0 1 610.1 541.6 A 48.7 48.7 0 0 1 550.7 500.7 A 48.7 48.7 0 0 1 522.8 434.2 A 48.7 48.7 0 0 1 535.3 363.2 A 48.7 48.7 0 0 1 584.2 310.2 A 48.7 48.7 0 0 1 654.1 292.1 A 48.7 48.7 0 0 1 722.6 314.6 A 48.7 48.7 0 0 1 723.1 314.6 M 742.6 320.1 A 48.7 48.7 0 0 1 765.2 345.2"/>
    <path stroke-width="7" d="M 698.6 354.0 A 82.0 82.0 0 0 0 568.0 420.0 A 82.0 82.0 0 0 0 646.3 501.9"/>
    <path stroke-width="7" d="M 548.1 472.5 A 11.0 11.0 0 0 0 570.1 472.5 A 11.0 11.0 0 0 0 548.1 472.5 Z"/>
    <path stroke-width="7" d="M 537.6 392.8 A 11.0 11.0 0 0 0 559.6 392.8 A 11.0 11.0 0 0 0 537.6 392.8 Z"/>
    <path stroke-width="7" d="M 586.5 329.1 A 11.0 11.0 0 0 0 608.5 329.1 A 11.0 11.0 0 0 0 586.5 329.1 Z"/>
    <path stroke-width="7" d="M 666.2 318.6 A 11.0 11.0 0 0 0 688.2 318.6 A 11.0 11.0 0 0 0 666.2 318.6 Z"/>
    <path stroke-width="10" d="M 582.5 736.2 C 583.9 778.5 585.1 814.9 584.0 832.0 C 584.0 844.0 590.0 850.0 602.0 850.0 L 670.0 850.0 C 682.0 850.0 688.0 844.0 688.0 832.0 C 686.0 800.0 692.0 700.0 692.0 620.0 L 691.0 620.0"/>
    <path stroke-width="10" d="M 227.4 700.8 C 229.0 757.5 231.4 810.3 230.0 832.0 C 230.0 844.0 236.0 850.0 248.0 850.0 L 320.0 850.0 C 332.0 850.0 338.0 844.0 338.0 832.0 C 337.0 815.4 338.1 780.7 339.4 739.9"/>
    <path stroke-width="10" d="M 691.0 620.0 C 692.7 600.2 692.7 579.6 692.0 560.0 C 692.0 555.8 691.9 551.6 691.6 547.6 M 516.7 384.8 C 493.0 380.3 467.3 378.0 440.0 378.0 C 318.8 378.0 236.7 425.0 199.1 490.6 M 202.6 670.2 C 209.6 681.9 217.9 692.3 227.4 700.8 M 339.4 739.9 C 415.4 751.2 510.6 749.9 582.5 736.2"/>
    <path stroke-width="10" d="M 199.2 490.6 C 148.7 539.2 96.6 598.4 52.0 650.0 C 42.0 664.0 54.0 676.0 68.0 670.0 C 114.9 654.9 164.1 651.2 202.6 670.2"/>
    <path stroke-width="10" d="M 337.9 829.9 C 338.6 830.0 339.3 830.0 340.0 830.0 L 392.0 830.0 C 404.0 830.0 410.0 824.0 410.0 812.0 C 408.9 794.4 410.2 774.4 411.6 746.6"/>
    <path stroke-width="10" d="M 502.3 745.9 C 503.8 774.0 505.1 794.2 504.0 812.0 C 504.0 824.0 510.0 830.0 522.0 830.0 L 582.0 830.0 C 582.7 830.0 583.4 830.0 584.1 829.9"/>
    <path stroke-width="7" d="M 239 850 V 828 A 13 13 0 0 1 265 828 V 850 M 271 850 V 828 A 13 13 0 0 1 297 828 V 850 M 303 850 V 828 A 13 13 0 0 1 329 828 V 850 M 591 850 V 828 A 13 13 0 0 1 617 828 V 850 M 623 850 V 828 A 13 13 0 0 1 649 828 V 850 M 655 850 V 828 A 13 13 0 0 1 681 828 V 850"/>
    <path stroke-width="7" d="M 398.4 455.8 A 42.0 30.0 -8 1 0 481.6 444.2 A 42.0 30.0 -8 1 0 398.4 455.8 Z"/>
    <path stroke-width="7" d="M 300.5 464.8 A 30.0 24.0 10 1 0 359.5 475.2 A 30.0 24.0 10 1 0 300.5 464.8 Z"/>
    <path stroke-width="7" d="M 518.3 456.1 A 28.0 22.0 0 0 0 512.0 470.0 A 28.0 22.0 0 0 0 535.1 491.7"/>
    <path stroke-width="7" d="M 364.0 560.0 A 26.0 20.0 0 0 0 416.0 560.0 A 26.0 20.0 0 0 0 364.0 560.0 Z"/>
    <path stroke-width="7" d="M 228.0 560.0 A 22.0 18.0 0 0 0 272.0 560.0 A 22.0 18.0 0 0 0 228.0 560.0 Z"/>
    <path stroke-width="7" d="M 482.0 620.0 A 18.0 18.0 0 0 0 518.0 620.0 A 18.0 18.0 0 0 0 482.0 620.0 Z"/>
    <path stroke-width="10" d="M 61.8 996.5 C 70.9 997.3 82.9 983.9 91.1 978.7 C 99.2 973.5 106.4 969.5 110.8 965.3 C 115.2 961.1 117.9 957.0 117.5 953.6 C 117.1 950.3 113.0 947.5 108.3 945.2 C 103.6 942.8 89.8 942.7 89.3 939.4 C 88.7 936.1 101.6 929.7 104.9 925.4 C 108.3 921.1 110.1 917.0 109.4 913.8 C 108.7 910.5 104.9 908.1 100.7 906.0 C 96.4 903.8 85.0 904.2 84.1 901.0 C 83.3 897.8 93.2 891.1 95.5 886.9 C 97.8 882.7 98.7 878.8 97.7 875.7 C 96.7 872.6 93.1 870.3 89.5 868.3 C 85.8 866.3 76.8 866.6 75.6 863.6 C 74.5 860.6 81.4 854.2 82.5 850.2 C 83.6 846.2 83.6 842.6 82.2 839.6 C 80.9 836.7 77.7 834.6 74.6 832.6 C 71.5 830.5 65.2 830.2 63.7 827.4 C 62.2 824.6 65.8 819.1 65.6 815.6 C 65.4 812.1 64.2 809.1 62.5 806.4 C 60.7 803.7 57.8 801.7 55.3 799.5 C 52.8 797.3 50.1 794.7 47.6 793.1 C 45.0 791.5 42.0 789.4 40.0 790.0 C 38.0 790.6 36.9 794.2 35.8 796.9 C 34.6 799.6 33.9 803.1 33.1 806.2 C 32.2 809.3 30.7 812.3 30.7 815.3 C 30.6 818.3 31.0 821.2 32.5 824.2 C 34.1 827.1 39.8 830.2 39.8 833.1 C 39.7 836.0 34.2 838.9 32.2 841.8 C 30.2 844.6 28.1 847.4 28.0 850.3 C 27.9 853.1 29.2 856.0 31.6 859.1 C 34.0 862.2 42.7 865.8 42.5 868.7 C 42.3 871.5 33.6 873.6 30.7 876.2 C 27.7 878.7 24.9 881.1 24.6 883.9 C 24.4 886.7 26.2 889.7 29.3 893.0 C 32.3 896.4 43.3 901.2 43.0 903.9 C 42.7 906.7 31.3 907.6 27.4 909.7 C 23.5 911.8 20.0 913.8 19.6 916.5 C 19.2 919.3 21.5 922.5 25.0 926.2 C 28.6 929.9 41.5 936.2 41.0 938.9 C 40.5 941.7 26.8 941.0 22.1 942.6 C 17.4 944.2 13.4 945.7 12.8 948.4 C 12.2 951.1 14.8 954.6 18.7 958.9 C 22.7 963.1 29.3 967.5 36.5 973.8 C 43.7 980.1 52.7 995.7 61.8 996.5 Z"/>
    <path stroke-width="7" d="M 61.8 996.5 C 69.0 935.2 64.4 875.0 48.0 815.9"/>
    <path stroke-width="10" d="M 232.2 842.3 C 231.1 843.3 230.1 844.4 229.3 845.7 C 227.5 848.4 227.8 854.4 225.3 856.1 C 222.8 857.7 217.7 855.4 214.3 855.8 C 210.9 856.2 207.3 856.7 205.0 858.5 C 202.6 860.4 200.8 863.3 199.9 867.1 C 199.0 870.8 201.6 878.8 199.3 880.8 C 197.0 882.9 190.0 879.0 186.2 879.2 C 182.3 879.4 178.5 879.9 176.3 882.0 C 174.1 884.2 173.1 887.8 173.0 892.2 C 173.0 896.6 178.0 906.1 175.9 908.4 C 173.8 910.7 164.9 906.0 160.6 906.1 C 156.3 906.2 152.1 906.8 150.2 909.2 C 148.2 911.7 147.9 915.9 148.8 920.8 C 149.6 925.7 157.1 936.0 155.2 938.6 C 153.4 941.2 142.4 936.0 137.6 936.2 C 132.9 936.4 128.4 937.2 126.7 939.9 C 124.9 942.6 125.4 947.2 127.2 952.4 C 129.0 957.6 132.9 963.7 137.4 971.3 C 141.8 978.8 146.3 994.9 154.0 997.8 C 161.7 1000.7 175.3 991.2 183.6 988.8 C 191.9 986.4 198.9 985.4 203.7 983.4 C 208.5 981.4 212.0 979.6 212.7 977.1 C 213.3 974.6 210.8 971.7 207.7 968.5 C 204.7 965.3 193.7 960.2 194.4 957.8 C 195.2 955.3 208.0 955.4 212.3 953.7 C 216.7 952.1 219.8 950.4 220.7 947.9 C 221.5 945.5 219.6 942.5 217.5 939.1 C 215.4 935.8 206.9 930.4 207.8 928.0 C 208.8 925.5 219.4 926.1 223.3 924.7 C 227.1 923.2 229.8 921.5 230.9 919.1 C 231.9 916.7 230.8 913.6 229.6 910.3 C 228.4 907.0 222.6 901.6 223.7 899.2 C 224.9 896.8 233.2 897.4 236.5 896.0 C 239.8 894.5 242.1 892.7 243.3 890.3 C 244.5 887.9 244.2 884.8 244.0 881.6 C 243.8 878.5 240.8 873.7 242.1 871.3 C 243.4 868.9 249.3 868.9 251.9 867.2 C 254.4 865.4 256.1 863.3 257.5 860.8 C 258.8 858.3 259.2 855.2 260.0 852.4 C 260.2 851.6 260.5 850.8 260.7 850.0"/>
    <path stroke-width="7" d="M 154.0 997.8 C 172.8 942.7 202.6 894.6 243.4 853.6"/>
    <path stroke-width="10" d="M 938.5 996.5 C 947.6 995.8 957.0 980.4 964.3 974.3 C 971.6 968.2 978.4 963.9 982.4 959.7 C 986.5 955.6 989.1 952.1 988.6 949.4 C 988.1 946.6 984.0 945.0 979.4 943.3 C 974.7 941.6 961.0 942.0 960.6 939.2 C 960.2 936.5 973.2 930.5 976.9 926.9 C 980.5 923.2 982.8 920.0 982.5 917.3 C 982.1 914.5 978.7 912.4 974.9 910.2 C 971.0 908.0 959.7 906.9 959.4 904.1 C 959.2 901.3 970.2 896.8 973.4 893.5 C 976.5 890.2 978.4 887.3 978.2 884.4 C 978.0 881.6 975.3 879.2 972.3 876.6 C 969.4 873.9 960.8 871.7 960.7 868.8 C 960.6 865.9 969.3 862.4 971.8 859.4 C 974.3 856.4 975.6 853.5 975.6 850.7 C 975.5 847.8 973.5 845.0 971.6 842.0 C 969.7 839.1 964.2 836.1 964.2 833.2 C 964.2 830.2 970.1 827.3 971.7 824.4 C 973.2 821.5 973.8 818.6 973.8 815.6 C 973.7 812.6 972.3 809.5 971.6 806.4 C 970.8 803.3 970.2 799.7 969.1 797.0 C 968.0 794.3 967.0 790.7 965.0 790.0 C 963.0 789.3 960.0 791.4 957.4 792.9 C 954.8 794.5 952.0 797.0 949.5 799.2 C 947.0 801.4 943.9 803.3 942.2 805.9 C 940.4 808.6 939.1 811.6 938.8 815.1 C 938.5 818.6 942.0 824.1 940.4 827.0 C 938.9 829.8 932.5 829.9 929.4 831.9 C 926.3 833.9 923.0 835.9 921.6 838.8 C 920.2 841.7 920.1 845.3 921.1 849.4 C 922.1 853.4 928.9 859.9 927.7 863.0 C 926.4 866.0 917.5 865.4 913.7 867.4 C 910.0 869.3 906.4 871.5 905.3 874.6 C 904.3 877.6 905.1 881.6 907.3 885.9 C 909.4 890.2 919.3 897.1 918.3 900.2 C 917.4 903.4 906.0 902.8 901.7 904.8 C 897.4 906.9 893.5 909.3 892.7 912.5 C 892.0 915.7 893.7 919.9 897.0 924.2 C 900.3 928.6 913.0 935.3 912.3 938.6 C 911.7 941.9 897.9 941.7 893.2 944.0 C 888.4 946.3 884.2 948.9 883.7 952.3 C 883.3 955.6 885.9 959.8 890.2 964.1 C 894.6 968.4 901.6 972.6 909.6 978.0 C 917.7 983.4 929.4 997.1 938.5 996.5 Z"/>
    <path stroke-width="7" d="M 938.5 996.5 C 932.7 934.9 938.6 874.7 956.4 815.8"/>
    <path stroke-width="10" d="M 846.2 998.2 C 853.9 995.3 858.4 979.6 862.9 972.1 C 867.4 964.7 871.4 958.7 873.2 953.5 C 875.1 948.4 875.6 943.9 873.9 941.3 C 872.2 938.7 867.8 938.0 863.1 937.9 C 858.3 937.8 847.4 943.1 845.6 940.6 C 843.8 938.1 851.3 927.8 852.2 923.0 C 853.1 918.2 852.9 914.1 850.9 911.8 C 849.0 909.4 844.9 908.9 840.7 908.9 C 836.5 908.8 827.5 913.7 825.5 911.5 C 823.5 909.2 828.6 899.9 828.6 895.5 C 828.5 891.2 827.6 887.7 825.5 885.6 C 823.3 883.5 819.6 883.1 815.8 883.0 C 812.0 882.9 805.1 886.8 802.9 884.9 C 800.6 882.9 803.3 875.0 802.4 871.3 C 801.6 867.7 799.9 864.8 797.6 863.1 C 795.3 861.3 791.8 860.9 788.5 860.6 C 785.1 860.3 780.0 862.7 777.6 861.0 C 775.2 859.4 775.6 853.6 773.8 850.9 C 772.1 848.2 769.8 846.3 767.2 844.9 C 764.7 843.5 761.4 843.2 758.5 842.6 C 755.5 841.9 752.3 840.9 749.5 840.8 C 746.8 840.7 743.3 840.5 742.0 842.0 C 740.7 843.5 741.2 846.9 741.5 849.5 C 741.8 852.2 742.9 855.3 743.6 858.0 C 744.4 860.8 744.6 863.8 745.9 866.2 C 747.2 868.6 748.8 870.7 751.3 872.4 C 753.8 874.0 759.6 874.0 760.8 876.3 C 762.1 878.6 759.0 883.3 758.8 886.4 C 758.5 889.4 758.0 892.5 759.2 894.8 C 760.4 897.1 762.6 898.8 765.8 900.2 C 769.0 901.6 777.3 900.9 778.4 903.2 C 779.5 905.5 773.6 910.8 772.3 914.1 C 771.1 917.3 769.9 920.3 770.9 922.7 C 771.9 925.0 774.5 926.5 778.3 927.9 C 782.1 929.3 792.7 928.7 793.6 931.0 C 794.5 933.3 785.9 938.6 783.8 941.9 C 781.6 945.1 779.6 948.1 780.4 950.4 C 781.3 952.8 784.3 954.4 788.6 955.9 C 792.9 957.5 805.7 957.4 806.4 959.7 C 807.1 962.1 796.0 967.0 792.9 970.1 C 789.9 973.3 787.2 976.1 787.9 978.4 C 788.5 980.8 791.9 982.6 796.7 984.5 C 801.5 986.4 808.5 987.3 816.7 989.6 C 825.0 991.9 838.5 1001.1 846.2 998.2 Z"/>
    <path stroke-width="7" d="M 846.2 998.2 C 828.0 945.0 799.2 898.6 759.9 859.0"/>
    <path stroke-width="10" d="M -10.0 780.0 C 68.7 773.3 148.7 773.0 229.7 774.3 M 410.1 777.9 C 441.3 778.4 472.6 778.5 503.9 778.1 M 688.5 768.9 C 838.6 761.1 928.4 775.3 1010.0 768.0"/>
    <path stroke-width="10" d="M 88 130 A 52 52 0 1 0 192 130 A 52 52 0 1 0 88 130 Z"/>
    <path stroke-width="8" d="M 206.0 130.0 L 232.0 130.0 M 186.7 176.7 L 205.1 195.1 M 140.0 196.0 L 140.0 222.0 M 93.3 176.7 L 74.9 195.1 M 74.0 130.0 L 48.0 130.0 M 93.3 83.3 L 74.9 64.9 M 140.0 64.0 L 140.0 38.0 M 186.7 83.3 L 205.1 64.9"/>
    <path stroke-width="10" d="M 399.2 194.0 C 361.0 194.0 361.0 147.2 399.2 149.8 C 399.2 113.2 450.2 109.0 458.8 130.2 C 471.5 92.0 535.2 96.2 535.2 138.8 C 573.5 130.2 594.8 194.0 556.5 194.0 Z"/>
    <path stroke-width="10" d="M 793.5 178.0 C 762.0 178.0 762.0 139.5 793.5 141.6 C 793.5 111.5 835.5 108.0 842.5 125.5 C 853.0 94.0 905.5 97.5 905.5 132.5 C 937.0 125.5 954.5 178.0 923.0 178.0 Z"/>
  </g>
</svg>
`,b=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- bunting -->
    <path stroke-width="7" d="M -10.0 40.0 L 20.0 46.9 L 106.0 64.2 L 156.0 72.7 L 242.0 84.6 L 292.0 90.0 L 378.0 96.6 L 428.0 98.8 L 514.0 100.0 L 564.0 99.1 L 650.0 94.8 L 700.0 90.8 L 786.0 81.1 L 836.0 74.0 L 922.0 58.9 L 1010.0 40.0"/>
    <path stroke-width="8" d="M 20.0 46.9 L 63.0 135.5 L 106.0 64.2 Z M 156.0 72.7 L 199.0 158.7 L 242.0 84.6 Z M 292.0 90.0 L 335.0 173.3 L 378.0 96.6 Z M 428.0 98.8 L 471.0 179.4 L 514.0 100.0 Z M 564.0 99.1 L 607.0 176.9 L 650.0 94.8 Z M 700.0 90.8 L 743.0 166.0 L 786.0 81.1 Z M 836.0 74.0 L 879.0 146.4 L 922.0 58.9 Z"/>
    <!-- balloons -->
    <ellipse cx="125" cy="355" rx="62" ry="78" stroke-width="9"/>
    <path fill="#111" stroke-width="6" d="M 125 433 L 110 454 L 140 454 Z"/>
    <path stroke-width="6" d="M 125 452 C 105 490 150 520 128 560 C 110 595 140 615 132 640"/>
    <path stroke-width="7" d="M 95 320 Q 100 300 118 293"/>
    <ellipse cx="878" cy="330" rx="62" ry="78" stroke-width="9"/>
    <path fill="#111" stroke-width="6" d="M 878 408 L 863 429 L 893 429 Z"/>
    <path stroke-width="6" d="M 878 427 C 898 465 853 495 875 535 C 893 570 863 590 871 615"/>
    <path stroke-width="7" d="M 848 295 Q 853 275 871 268"/>
    <!-- confetti stars -->
    <path stroke-width="7" d="M 255.2 192.5 L 260.1 212.3 L 279.7 217.8 L 262.4 228.6 L 263.2 249.0 L 247.6 235.8 L 228.4 242.8 L 236.1 223.9 L 223.5 207.9 L 243.9 209.4 Z M 741.8 182.7 L 753.7 199.2 L 774.0 197.0 L 761.9 213.5 L 770.3 232.1 L 750.9 225.7 L 735.8 239.4 L 735.9 219.0 L 718.2 208.9 L 737.6 202.6 Z M 62.0 738.0 L 69.3 754.9 L 87.7 756.7 L 73.9 768.9 L 77.9 786.8 L 62.0 777.5 L 46.1 786.8 L 50.1 768.9 L 36.3 756.7 L 54.7 754.9 Z M 947.0 663.9 L 949.7 682.1 L 967.0 688.6 L 950.5 696.8 L 949.7 715.2 L 936.8 702.1 L 919.0 707.0 L 927.5 690.7 L 917.4 675.3 L 935.5 678.3 Z"/>
    <g fill="#111" stroke="none"><circle cx="330" cy="285" r="6"/><circle cx="690" cy="300" r="6"/><circle cx="220" cy="560" r="5"/><circle cx="800" cy="520" r="5"/><circle cx="60" cy="560" r="5"/><circle cx="950" cy="480" r="5"/></g>
    <!-- cake stand -->
    <path stroke-width="10" d="M 250 794.1 A 330 55 0 0 0 170 830 A 330 55 0 0 0 830 830 A 330 55 0 0 0 750 794.1"/>
    <path stroke-width="9" d="M 440 884 L 425 930 M 560 884 L 575 930"/>
    <path stroke-width="9" d="M 425 930 Q 380 932 380 945 Q 380 958 425 958 L 575 958 Q 620 958 620 945 Q 620 932 575 930 Z"/>
    <!-- bottom tier -->
    <path stroke-width="10" d="M 250 620 L 250 820 A 250 35 0 0 0 750 820 L 750 620"/>
    <path stroke-width="10" d="M 250 620 A 250 40 0 0 1 330 590.7 M 670 590.7 A 250 40 0 0 1 750 620"/>
    <path stroke-width="8" d="M 250 652 C 253.0 658.3 261.0 682.0 268.0 690.0 C 275.0 698.0 284.7 702.3 292.0 700.0 C 299.3 697.7 304.3 681.3 312.0 676.0 C 319.7 670.7 329.7 665.0 338.0 668.0 C 346.3 671.0 355.0 684.0 362.0 694.0 C 369.0 704.0 373.0 722.0 380.0 728.0 C 387.0 734.0 397.3 734.7 404.0 730.0 C 410.7 725.3 412.7 708.0 420.0 700.0 C 427.3 692.0 438.3 683.7 448.0 682.0 C 457.7 680.3 469.3 684.3 478.0 690.0 C 486.7 695.7 492.7 716.0 500.0 716.0 C 507.3 716.0 513.3 695.7 522.0 690.0 C 530.7 684.3 542.3 680.3 552.0 682.0 C 561.7 683.7 572.7 692.0 580.0 700.0 C 587.3 708.0 589.3 725.3 596.0 730.0 C 602.7 734.7 613.0 734.0 620.0 728.0 C 627.0 722.0 631.0 704.0 638.0 694.0 C 645.0 684.0 653.7 671.0 662.0 668.0 C 670.3 665.0 680.3 670.7 688.0 676.0 C 695.7 681.3 700.7 697.7 708.0 700.0 C 715.3 702.3 725.0 698.0 732.0 690.0 C 739.0 682.0 747.0 658.3 750.0 652.0"/>
    <!-- top tier -->
    <path stroke-width="10" d="M 330 420 L 330 600 A 170 28 0 0 0 670 600 L 670 420 M 670 420.0 A 170 30 0 0 0 622 399.1 M 588 394.3 A 170 30 0 0 0 552 391.4 M 518 390.2 A 170 30 0 0 0 482 390.2 M 448 391.4 A 170 30 0 0 0 412 394.3 M 378 399.1 A 170 30 0 0 0 330 420.0"/>
    <path stroke-width="8" d="M 330 447 C 333.7 450.8 345.0 469.2 352.0 470.0 C 359.0 470.8 364.8 452.3 372.0 452.0 C 379.2 451.7 388.7 460.0 395.0 468.0 C 401.3 476.0 404.5 493.7 410.0 500.0 C 415.5 506.3 422.7 509.7 428.0 506.0 C 433.3 502.3 436.3 485.3 442.0 478.0 C 447.7 470.7 454.0 462.3 462.0 462.0 C 470.0 461.7 482.3 467.7 490.0 476.0 C 497.7 484.3 501.7 505.3 508.0 512.0 C 514.3 518.7 521.8 520.7 528.0 516.0 C 534.2 511.3 538.7 493.0 545.0 484.0 C 551.3 475.0 558.5 464.3 566.0 462.0 C 573.5 459.7 583.3 464.0 590.0 470.0 C 596.7 476.0 600.3 492.7 606.0 498.0 C 611.7 503.3 618.7 506.0 624.0 502.0 C 629.3 498.0 632.8 481.7 638.0 474.0 C 643.2 466.3 649.7 460.5 655.0 456.0 C 660.3 451.5 667.5 448.5 670.0 447.0"/>
    <g stroke-width="7">
      <circle cx="372" cy="560" r="15"/><circle cx="436" cy="574" r="15"/><circle cx="500" cy="580" r="15"/><circle cx="564" cy="574" r="15"/><circle cx="628" cy="560" r="15"/>
    </g>
    <!-- candles -->
    <path stroke-width="8" d="M 378 429.6 L 378 341.6 Q 378 334.6 385 334.6 L 405 334.6 Q 412 334.6 412 341.6 L 412 429.6 Q 395 437.6 378 429.6 Z M 448 435.4 L 448 347.4 Q 448 340.4 455 340.4 L 475 340.4 Q 482 340.4 482 347.4 L 482 435.4 Q 465 443.4 448 435.4 Z M 518 435.4 L 518 347.4 Q 518 340.4 525 340.4 L 545 340.4 Q 552 340.4 552 347.4 L 552 435.4 Q 535 443.4 518 435.4 Z M 588 429.6 L 588 341.6 Q 588 334.6 595 334.6 L 615 334.6 Q 622 334.6 622 341.6 L 622 429.6 Q 605 437.6 588 429.6 Z "/>
    <path stroke-width="6" d="M 378 366.6 L 412 366.6 M 378 397.6 L 412 397.6 M 448 372.4 L 482 372.4 M 448 403.4 L 482 403.4 M 518 372.4 L 552 372.4 M 518 403.4 L 552 403.4 M 588 366.6 L 622 366.6 M 588 397.6 L 622 397.6 "/>
    <path stroke-width="8" d="M 395 322.6 C 371 308.6 380 282.6 395 262.6 C 410 282.6 419 308.6 395 322.6 Z M 395 334.6 L 395 322.6 M 465 328.4 C 441 314.4 450 288.4 465 268.4 C 480 288.4 489 314.4 465 328.4 Z M 465 340.4 L 465 328.4 M 535 328.4 C 511 314.4 520 288.4 535 268.4 C 550 288.4 559 314.4 535 328.4 Z M 535 340.4 L 535 328.4 M 605 322.6 C 581 308.6 590 282.6 605 262.6 C 620 282.6 629 308.6 605 322.6 Z M 605 334.6 L 605 322.6 "/>
    <!-- face and hearts -->
    <circle cx="440" cy="772" r="26" stroke-width="8"/>
    <circle cx="560" cy="772" r="26" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 428 775 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z M 442 768 a 4.5 4.5 0 1 0 9 0 a 4.5 4.5 0 1 0 -9 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 548 775 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z M 562 768 a 4.5 4.5 0 1 0 9 0 a 4.5 4.5 0 1 0 -9 0 Z"/>
    <path stroke-width="9" d="M 472 812 Q 500 836 528 812"/>
    <ellipse cx="402" cy="812" rx="16" ry="10" stroke-width="7"/>
    <ellipse cx="598" cy="812" rx="16" ry="10" stroke-width="7"/>
    <path stroke-width="7" d="M 305 791.6 C 273.8 772.4 283.4 748.4 305 761.6 C 326.6 748.4 336.2 772.4 305 791.6 Z M 695 791.6 C 663.8 772.4 673.4 748.4 695 761.6 C 716.6 748.4 726.2 772.4 695 791.6 Z"/>
  </g>
</svg>
`,x=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- wrapper -->
    <path stroke-width="14" d="M 300 614.3 L 345 880 Q 349 905 375 905 L 625 905 Q 651 905 655 880 L 700 614.3"/>
    <path stroke-width="10" d="M 363.8 585 L 405 905 M 636.2 585 L 595 905"/>
    <!-- frosting, lower layer -->
    <path stroke-width="14" d="M 318.46 431.17 A 270 120 0 0 0 273 585 A 45.4 32 0 0 0 363.8 585 A 45.4 32 0 0 0 454.6 585 A 45.4 32 0 0 0 545.4 585 A 45.4 32 0 0 0 636.2 585 A 45.4 32 0 0 0 727 585 A 270 120 0 0 0 681.54 431.17"/>
    <!-- frosting, upper layer -->
    <path stroke-width="14" d="M 318.46 431.17 A 185 110 0 0 0 345 470 A 38.75 28 0 0 0 422.5 470 A 38.75 28 0 0 0 500 470 A 38.75 28 0 0 0 577.5 470 A 38.75 28 0 0 0 655 470 A 185 110 0 0 0 681.54 431.17 A 185 110 0 0 0 535.92 302.09 M 464.08 302.09 A 185 110 0 0 0 318.46 431.17"/>
    <!-- sprinkles -->
    <g fill="#111" stroke="none">
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(275 520) rotate(-30)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(355 548) rotate(20)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(500 540) rotate(-15)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(645 548) rotate(35)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(725 518) rotate(-25)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(400 400) rotate(25)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(600 398) rotate(-30)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(455 445) rotate(-10)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(548 450) rotate(15)"/>
      <rect x="-13" y="-4.5" width="26" height="9" rx="4.5" transform="translate(500 370) rotate(80)"/>
    </g>
    <!-- cherry -->
    <circle cx="500" cy="275" r="45" stroke-width="14"/>
    <path stroke-width="8" d="M 476 270 Q 479 253 493 247"/>
    <path stroke-width="12" d="M 505 230 Q 512 190 545 162"/>
    <path stroke-width="10" d="M 545 162 Q 585 133 618 158 Q 582 186 545 162 Z"/>
    <!-- face -->
    <circle cx="455" cy="695" r="30"/>
    <circle cx="545" cy="695" r="30"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 441 698 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0 Z M 458 690 a 5.5 5.5 0 1 0 11 0 a 5.5 5.5 0 1 0 -11 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 531 698 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0 Z M 548 690 a 5.5 5.5 0 1 0 11 0 a 5.5 5.5 0 1 0 -11 0 Z"/>
    <path stroke-width="10" d="M 465 768 Q 500 800 535 768"/>
    <ellipse cx="420" cy="755" rx="17" ry="11" stroke-width="8"/>
    <ellipse cx="580" cy="755" rx="17" ry="11" stroke-width="8"/>
  </g>
</svg>
`,S=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="10" d="M 40 40 L 230 40 L 230 200 L 40 200 Z"/>
    <path stroke-width="8" d="M 135 40 L 135 200"/>
    <path stroke-width="8" d="M 40 120 L 230 120"/>
    <path stroke-width="10" d="M -10 700 L 233 700 M 767 700 L 1010 700"/>
    <path stroke-width="10" d="M -10 905 L 1010 905"/>
    <path stroke-width="10" d="M 664.7 533.2 L 703.5 536.9 L 738.3 541.3 L 769.5 546.5 L 794.5 552.1 L 814.3 558.4 L 821.3 561.4 L 827.3 564.8 L 831.3 567.9 L 834 571.3 L 835 574.8 L 834.2 578.2 M 165.8 578.3 L 165 575.5 L 165.3 573 L 166.6 570.4 L 169 567.6 L 176.8 562.4 L 188.7 557.3 L 204.5 552.4 L 224 547.8 L 246.9 543.6 L 274.1 539.6"/>
    <path stroke-width="8" d="M 700.3 254.9 L 702.4 235.1 L 703.8 228.9 L 706.7 220.8"/>
    <path stroke-width="7" d="M 759.3 199.3 L 759.1 202.5 L 757.7 205.1 L 755.2 207.8 L 751.8 210.4 L 742.6 215.1 L 730 218.9 L 718.3 220.3 L 708.1 219.7 L 703 218.4 L 699.9 216.8 L 697.8 214.9 L 696.7 212.7 L 696.9 209.5 L 698.3 206.9 L 700.8 204.2 L 704.2 201.6 L 713.4 196.9 L 726 193.1 L 737.7 191.7 L 747.9 192.3 L 753 193.6 L 756.1 195.2 L 758.2 197.1 Z"/>
    <path stroke-width="8" d="M 609.9 305.9 L 607.6 300.4 L 606.3 294.5 L 606 288.5 L 607.2 281.1 L 609.3 275.4 L 613.2 269.1 L 617.3 264.7 L 623.4 260.3 L 630.4 257.4 L 636.2 256.2 L 642.3 256.1 L 649.6 257.4 L 655.2 259.6 L 660.3 262.8 L 664.8 266.8 L 669.3 272.8"/>
    <path stroke-width="8" d="M 669.9 305.9 L 667.6 300.4 L 666.3 294.5 L 666 288.5 L 667.2 281.1 L 669.3 275.4 L 673.2 269.1 L 677.3 264.7 L 683.4 260.3 L 690.4 257.4 L 696.2 256.2 L 702.3 256.1 L 709.6 257.4 L 715.2 259.6 L 720.3 262.8 L 724.8 266.8 L 729.3 272.8"/>
    <path stroke-width="8" d="M 729.9 305.9 L 726.8 297.5 L 726 288.5 L 727.6 279.6 L 730.7 272.8 L 736.2 265.7 L 742.1 261.1 L 750.4 257.4 L 759.2 256 L 766.7 256.7 L 775.2 259.6 L 782.7 264.7 L 788.5 271.5 L 792.4 279.6 L 794 288.5 L 793.2 297.5 L 790.1 305.9"/>
    <path stroke-width="8" d="M 577.2 331.1 L 579.3 325.4 L 581.5 321.5 L 587.3 314.7 L 590.9 311.9 L 596.1 309 L 600.4 307.4 L 606.2 306.2 L 612.3 306.1 L 616.7 306.7 L 625.2 309.6 L 632.7 314.7 L 636.8 319.1 L 639.3 322.8"/>
    <path stroke-width="8" d="M 639.9 355.9 L 637.6 350.4 L 636.3 344.5 L 636 338.5 L 637.2 331.1 L 639.3 325.4 L 643.2 319.1 L 647.3 314.7 L 653.4 310.3 L 660.4 307.4 L 666.2 306.2 L 672.3 306.1 L 679.6 307.4 L 685.2 309.6 L 690.3 312.8 L 694.8 316.8 L 699.3 322.8"/>
    <path stroke-width="8" d="M 699.9 355.9 L 697.6 350.4 L 696.3 344.5 L 696 338.5 L 697.2 331.1 L 699.3 325.4 L 703.2 319.1 L 707.3 314.7 L 713.4 310.3 L 720.4 307.4 L 726.2 306.2 L 732.3 306.1 L 739.6 307.4 L 745.2 309.6 L 750.3 312.8 L 754.8 316.8 L 759.3 322.8"/>
    <path stroke-width="8" d="M 759.9 355.9 L 757.6 350.4 L 756.3 344.5 L 756 338.5 L 756.5 334 L 757.6 329.6 L 759.9 324.1 L 763.2 319.1 L 766.2 315.7 L 770.9 311.9 L 774.8 309.6 L 780.4 307.4 L 786.2 306.2 L 792.3 306.1 L 796.7 306.7 L 802.5 308.4 L 806.6 310.3 L 810.3 312.8 L 814.8 316.8 L 818.5 321.5 L 821.3 326.8 L 823.2 332.5 L 824 338.5 L 823.9 343 L 822.8 348.9 L 820.7 354.6 L 817.7 359.7 L 813.8 364.3 L 810.3 367.2 L 805.2 370.4 L 801.1 372.1 L 796.7 373.3 L 790.8 374"/>
    <path stroke-width="8" d="M 639.2 424 L 633.3 423.3 L 626.1 421 L 620.9 418.1 L 616.2 414.3 L 612.3 409.7 L 609.3 404.6 L 607.2 398.9 L 606 391.5 M 617.3 364.7 L 623.4 360.3 L 630.4 357.4 L 637.7 356.1 L 645.2 356.4 L 652.5 358.4 L 659.1 361.9 L 664.8 366.8 L 669.3 372.8"/>
    <path stroke-width="8" d="M 669.9 405.9 L 667.6 400.4 L 666.3 394.5 L 666 388.5 L 667.2 381.1 L 669.3 375.4 L 673.2 369.1 L 677.3 364.7 L 683.4 360.3 L 690.4 357.4 L 696.2 356.2 L 702.3 356.1 L 709.6 357.4 L 715.2 359.6 L 720.3 362.8 L 724.8 366.8 L 729.3 372.8"/>
    <path stroke-width="8" d="M 729.9 405.9 L 727.6 400.4 L 726.3 394.5 L 726 388.5 L 726.5 384 L 727.6 379.6 L 729.9 374.1 L 733.2 369.1 L 736.2 365.7 L 740.9 361.9 L 744.8 359.6 L 750.4 357.4 L 756.2 356.2 L 762.3 356.1 L 766.7 356.7 L 772.5 358.4 L 776.6 360.3 L 780.3 362.8 L 784.8 366.8 L 788.5 371.5 L 791.3 376.8 L 793.2 382.5 L 794 388.5 L 793.9 393 L 792.8 398.9 L 790.7 404.6 L 787.7 409.7 L 783.8 414.3 L 780.3 417.2 L 775.2 420.4 L 771.1 422.1 L 766.7 423.3 L 760.8 424"/>
    <path stroke-width="8" d="M 699.3 457.2 L 696.8 460.9 L 692.7 465.3 L 687.9 468.9 L 682.5 471.6 L 676.7 473.3 L 672.3 473.9 L 666.2 473.8 L 660.4 472.6 L 656.1 471 L 650.9 468.1 L 646.2 464.3 L 643.2 460.9 L 639.9 455.9 L 637.6 450.4 L 636.3 444.5 L 636 440 L 636.5 434 L 637.6 429.6 L 639.9 424.1 L 643.2 419.1 L 646.2 415.7 L 650.9 411.9 L 654.8 409.6 L 660.4 407.4 L 666.2 406.2 L 672.3 406.1 L 676.7 406.7 L 682.5 408.4 L 687.9 411.1 L 692.7 414.7 L 696.8 419.1 L 699.3 422.8"/>
    <path stroke-width="8" d="M 764 440 L 763.5 446 L 761.3 453.2 L 758.5 458.5 L 753.8 464.3 L 749.1 468.1 L 743.9 471 L 736.7 473.3 L 730.8 474 L 723.3 473.3 L 717.5 471.6 L 710.9 468.1 L 706.2 464.3 L 701.5 458.5 L 698.7 453.2 L 696.5 446 L 696 440 L 696.5 434 L 698.7 426.8 L 701.5 421.5 L 706.2 415.7 L 710.9 411.9 L 717.5 408.4 L 723.3 406.7 L 729.2 406 L 736.7 406.7 L 742.5 408.4 L 747.9 411.1 L 753.8 415.7 L 757.7 420.3 L 761.3 426.8 L 763.5 434 Z"/>
    <path stroke-width="8" d="M 522.9 246.6 L 525.6 229.5 L 529.8 218.5"/>
    <path stroke-width="10" d="M 599.2 426.7 L 601.5 418.9 L 603.2 411.1 L 604.5 402.1 L 605 393.5 M 600.1 366.7 L 594 352.4 L 590 345 L 587.1 340.9 L 581.3 335.5 L 566 324.9 L 561.8 320.5 L 559.3 316.8 L 556.9 311.3 L 555.1 305.2 L 550.8 284.5 L 548.9 277.5 L 543.4 264.9 L 538.5 256.6 L 534 251.5 L 529.1 248.5 L 522.5 246.9 L 515.7 247.4 L 512.7 248.4 L 509.1 250.7 L 506.9 253.5 L 504.9 257 L 496.7 279.8 L 489.7 305.5 L 486.9 312.8 L 484 318 L 481.1 321.5 L 477.8 324.6 L 462.1 334.9 L 456 339.9 L 452 345 L 446.4 355.1 L 440.8 368.2 L 437 382.4 L 436 393.5 L 437.1 408.4"/>
    <path stroke-width="7" d="M 576.4 196.1 L 576.6 198.7 L 575.9 200.9 L 573.8 204 L 571.5 206.4 L 565.1 211 L 555.8 215.3 L 545.8 218 L 536.8 218.6 L 533.7 218.1 L 530.3 216.9 L 528.6 215.6 L 527.6 213.9 L 527.4 211.3 L 528.1 209.1 L 530.2 206 L 532.5 203.6 L 538.9 199 L 548.2 194.7 L 558.2 192 L 566 191.4 L 570.3 191.9 L 572.9 192.7 L 574.9 194 Z"/>
    <path stroke-width="10" d="M 264 264 L 256.7 269.7 L 248.3 279 L 241.6 288.9 L 235.5 301.2 L 229.9 317 L 225.7 333.8 L 222.9 351.4 L 222 367 L 222.8 381.8 L 225 396.7 L 228.6 411.5 L 233.6 426.1 L 239.3 438.6 L 246.5 451.2 L 255.1 463.5 L 264.8 475.4 M 304.1 411.6 L 299.3 399.2 L 296 387.6 L 293.8 375.4 L 292.4 361.4 L 291.9 343 L 292.3 325.1 L 294.2 313.3 L 299.9 289.4 L 300.8 281.4 L 300.5 276.9 L 299.4 273.6 L 297.8 270.9 L 294.5 267.3"/>
    <path stroke-width="7" d="M 282 290 L 271.6 318.7 L 266.7 333.7 L 263.5 347.2 L 262 360 L 262.7 379.1 L 265.7 398.9 L 270.5 416.8 L 273.7 425.4 L 277.3 433.7"/>
    <path stroke-width="8" d="M 268 268 L 266.3 266.3 L 264.9 264 L 262.2 255.8 L 261.1 244.6 L 261.3 239.7 L 262 236 L 264.6 231.6 L 267.3 228.9 L 270.5 226.8 L 275.7 224.9 L 279 224.8 L 280.6 225.2 L 282.8 226.6 L 286.3 230.5 L 290.3 236.2 L 294.2 243 L 299.3 254.8 L 300.2 258.9 L 300 262 L 298.8 263.9 L 295.3 266.3 L 286.5 269.1 L 280.5 269.8 L 274.9 269.8 L 270.2 269 Z"/>
    <path stroke-width="8" d="M 376.6 424 L 378.7 406.6 L 382.2 393.6"/>
    <path stroke-width="10" d="M 462.9 566.7 L 457.4 575.5 L 452.5 582.1 L 447.6 587.5 L 442.4 591.9 L 435.5 596.3 L 428.3 599.8 L 421 602.4 L 412.6 604.5 L 406.8 605.3 L 402.1 605 L 395.9 603.6 L 382.5 599.1 L 375 598 L 367.5 599.1 L 349.5 604.7 L 341.6 605.2 L 334.6 603.9 L 327.6 601.9 L 315.9 597.1 L 308.9 592.9 L 303.7 588.7 L 299.2 584.1 L 294.2 577.8 L 289.4 570.6 L 284.2 561.2 L 279.4 551.1 L 275.8 542.1 L 270.6 524.3 L 266.9 502.6 L 265.6 481.8 L 265.9 471.4 L 266.8 463.3 L 269.9 450.5 L 274.3 439.9 L 280.9 429.3 L 288.8 420.6 L 295.7 415.6 L 304.2 411.9 L 315.4 409.2 L 328.4 407.8 L 340 408 L 346.3 409.6 L 352.2 412.6 L 366.9 422.7 L 370.9 424.4 L 375 425 L 379.1 424.4 L 383.1 422.7 L 399.3 411.8 L 403.7 409.6 L 408.4 408.2 L 417 407.7 L 426.4 408.1 L 436.3 409.5 L 444.3 411.5 L 451.6 414.3 L 456.8 417.2 L 461.2 420.6 L 466.3 425.8 L 470.9 431.7 L 475 438.5 L 478.4 445.8 L 481.1 453.7"/>
    <path stroke-width="7" d="M 433.3 370.4 L 433.6 373 L 432.6 376 L 430.5 379.1 L 428.2 381.5 L 420.8 386.8 L 411.5 391.1 L 401.5 393.9 L 392.3 394.8 L 385.2 393.6 L 382.4 392 L 380.8 389.9 L 380.4 387.3 L 380.9 385.1 L 382 382.9 L 384.6 379.7 L 391.4 374.3 L 401.8 369.1 L 413.2 365.9 L 422.3 365.2 L 426.6 365.8 L 429.2 366.6 L 431.8 368.2 Z"/>
    <path stroke-width="10" d="M 521.5 622.7 L 513.2 619 L 505.3 614.7 L 497.9 609.6 L 490.8 604 L 484.3 597.8 L 478.3 591 L 473 583.8 L 468.3 576.1 L 464.2 568 L 460.9 559.7 L 458.3 551 L 456.4 542.2 L 455.3 533.3 L 455 524.2 L 455.5 515.2 L 456.7 506.3 L 458.7 497.5 L 461.4 488.9 L 464.8 480.6 L 469 472.6 L 473.8 465 L 479.3 457.8 L 485.4 451.2 L 492 445 L 499.1 439.5 L 506.6 434.6 L 514.6 430.3 L 522.9 426.8 L 531.4 424 L 540.2 421.9 L 549.1 420.6 L 558.1 420 L 567.1 420.2 L 576.1 421.2 L 584.9 423 L 593.6 425.5 L 602 428.8 L 610.1 432.7 L 617.8 437.4 L 625.1 442.6 L 632 448.5 L 638.2 455 L 644 462 L 649.1 469.4 L 653.5 477.2 L 657.3 485.4 L 660.3 493.9 L 662.6 502.6 L 664.1 511.5 L 664.8 519 L 665 528 L 664.3 537 L 662.9 545.9 L 660.7 554.6 L 657.8 563.2 L 654.2 571.4 L 649.8 579.3 L 644.9 586.8 L 639.2 593.9 L 633 600.4 L 626.3 606.4 L 619.1 611.8 L 611.4 616.6 L 603.4 620.6"/>
    <path stroke-width="8" d="M 566 421 L 567.6 406.6 L 571.1 396.5"/>
    <path stroke-width="7" d="M 625.2 369.3 L 625.7 371.7 L 625 374.6 L 623.3 377.7 L 620.5 381 L 612.4 387.6 L 602 393.3 L 591 397.2 L 581.1 398.7 L 574.6 397.8 L 572.1 396.4 L 570.7 394.4 L 570.4 391.9 L 571.2 389 L 575.1 383.4 L 583 376.8 L 593.3 371 L 603 367.3 L 613.2 365.4 L 617.5 365.4 L 621 366.1 L 623.6 367.4 Z"/>
    <path stroke-width="10" d="M 425.2 769.2 L 414 802 L 424 815 L 576 815 L 586 802 L 574.8 769.2"/>
    <path stroke-width="10" d="M 835 575 L 834.6 577.3 L 833.5 579.5 L 831.7 581.8 L 828 584.7 L 820.2 589.1 L 809.5 593.4 L 796.1 597.5 L 777.1 602 L 758.1 605.6 L 736.9 608.9 L 713.5 612 L 683.9 615.1 L 628.2 619.3 L 562.8 622.1 L 500 623 L 437.2 622.1 L 371.8 619.3 L 316.1 615.1 L 286.5 612 L 263.1 608.9 L 241.9 605.6 L 222.9 602 L 203.9 597.5 L 190.5 593.4 L 179.8 589.1 L 172 584.7 L 168.3 581.8 L 166.5 579.5 L 165.4 577.3 L 165 575 L 166.5 582.3 L 170.8 610.4 L 174.5 627 L 177.1 635.4 L 180.4 643.6 L 187 655.8 L 191.5 661.9 L 198.5 669.8 L 206.5 677.8 L 215.4 685.7 L 236.6 702.4 L 259.5 717.8 L 282.3 731 L 301.2 740.2 L 322.9 748.2 L 346.5 754.7 L 377.3 761.1 L 415.7 767.2 L 443.1 769.4 L 477.5 770 L 531.5 770 L 553.9 769.5 L 578.1 767.9 L 600 765 L 640.2 757.7 L 656.5 754 L 671.3 750 L 684.4 745.7 L 697.4 740.8 L 708.6 735.7 L 720.3 729.6 L 733.7 721.9 L 747.3 713.4 L 760.7 704.3 L 773.6 694.6 L 785.7 684.8 L 795.6 675.8 L 804.3 666.8 L 811 658.6 L 814.9 652.9 L 818.9 645.2 L 822.3 637 L 825 628.7 L 828.9 612 L 833.5 582.3 Z"/>
    <path stroke-width="10" d="M 879.9 752.7 L 887.9 754.1 M 906 760.3 L 912 764 L 917.7 769.1 L 923.6 776.5 L 927.6 783.4 L 930.4 790.9 L 931.9 798.5 L 931.9 805.3 L 930.7 812.4 L 927.6 822.9 L 922.4 834.8 L 916 846 L 906.7 859.5 L 897.7 870.7 L 890.5 877.6 L 883.5 882.4 L 878 884 L 873.4 883.3 L 867.6 880.2 L 861.8 875.3 L 856 869 L 848.5 859.3 L 838.6 844.9 L 833.1 835.3 L 828.3 825 L 825 816.3 L 822.7 807.9 L 821.6 800.6 L 821.3 793.8 L 822 785.4 L 823.3 779.1 L 826 771.9 L 829.1 767.1 M 848.3 755.3 L 856.5 753.3"/>
    <path stroke-width="7" d="M 828 770 L 838 744 L 852 760 L 868 738 L 884 760 L 900 744 L 910 772 L 868 786 Z"/>
    <path stroke-width="8" d="M 98.8 814.4 L 109.7 792.3 L 114.2 784.9 L 118 780 L 122.8 775.5 L 128.5 771.2 L 145.5 760.8"/>
    <path stroke-width="8" d="M 186 822 L 178 798.5 L 172.7 786.3 L 166.3 776.6 L 155.3 763.9"/>
    <path stroke-width="10" d="M 128 848 L 127.5 854 L 125.3 861.1 L 122.4 866.4 L 118.6 871.1 L 114 875 L 108.8 878 L 103.2 880 L 95.8 881 L 89.8 880.6 L 82.5 878.6 L 77.2 875.8 L 71.4 871.1 L 67.6 866.4 L 64.7 861.1 L 62.9 855.4 L 62 848 L 62.9 840.6 L 64.7 834.9 L 67.6 829.6 L 71.4 824.9 L 76 821 L 81.2 818 L 86.8 816 L 94.2 815 L 100.2 815.4 L 107.5 817.4 L 112.8 820.2 L 118.6 824.9 L 122.4 829.6 L 125.3 834.9 L 127.5 842 Z"/>
    <path stroke-width="10" d="M 218 855 L 217.5 861 L 215.3 868.1 L 212.4 873.4 L 208.6 878.1 L 204 882 L 198.8 885 L 193.2 887 L 185.8 888 L 179.8 887.6 L 172.5 885.6 L 167.2 882.8 L 161.4 878.1 L 157.6 873.4 L 154.7 868.1 L 152.5 861 L 152 855 L 152.5 849 L 154.2 843.2 L 157.6 836.6 L 161.4 831.9 L 166 828 L 171.2 825 L 176.8 823 L 184.2 822 L 190.2 822.4 L 197.5 824.4 L 202.8 827.2 L 208.6 831.9 L 212.4 836.6 L 215.3 841.9 L 217.5 849 Z"/>
    <path stroke-width="7" d="M 193.6 747.5 L 193.5 749.4 L 192.3 752.1 L 190.4 754.2 L 187 756.8 L 178.6 760.6 L 169.9 762.8 L 159.6 763.7 L 151.8 763 L 148.6 762.1 L 145.2 760.4 L 143.5 758.9 L 142.4 756.5 L 142.5 754.6 L 143.7 751.9 L 145.6 749.8 L 149 747.2 L 157.4 743.4 L 166.1 741.2 L 176.4 740.3 L 185.3 741.3 L 189.2 742.7 L 191.4 744.1 L 192.9 745.7 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 299 505 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 312 499 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 375 505 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 388 499 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path stroke-width="8" d="M 335 531 Q 352 547 369 531"/>
    <ellipse cx="300" cy="535" rx="15" ry="9" stroke-width="6"/>
    <ellipse cx="404" cy="535" rx="15" ry="9" stroke-width="6"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 502 530 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 515 524 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 578 530 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 591 524 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path stroke-width="8" d="M 538 556 Q 555 572 572 556"/>
    <ellipse cx="503" cy="560" rx="15" ry="9" stroke-width="6"/>
    <ellipse cx="607" cy="560" rx="15" ry="9" stroke-width="6"/>
    <g fill="#111" stroke="none"><circle cx="632" cy="470" r="4"/><circle cx="512" cy="460" r="4"/><circle cx="640" cy="575" r="4"/><circle cx="485" cy="580" r="4"/><path d="M 850 800 l 4 9 l -8 0 Z M 890 795 l 4 9 l -8 0 Z M 870 825 l 4 9 l -8 0 Z M 905 825 l 4 9 l -8 0 Z M 845 840 l 4 9 l -8 0 Z M 880 855 l 4 9 l -8 0 Z"/></g>
    <g stroke-width="7"><circle cx="270" cy="690" r="17"/><circle cx="385" cy="722" r="17"/><circle cx="500" cy="732" r="17"/><circle cx="615" cy="722" r="17"/><circle cx="730" cy="690" r="17"/></g>
  </g>
</svg>
`,C=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- cone with waffle lines -->
    <path stroke-width="14" d="M 359.2 582.8 L 492 910 Q 500 930 508 910 L 641 582.4"/>
    <path stroke-width="9" d="M 439.2 619.2 L 572.1 752.1 M 560.1 619.9 L 427.9 752.1 M 374.5 624.5 L 552 802 M 625.5 624.5 L 448 802"/>
    <path fill="#111" stroke="none" d="M 377.3 627.3 L 392 663 L 408 658 Z M 622.7 627.3 L 608 663 L 592 658 Z"/>
    <!-- lower scoop with drips -->
    <path stroke-width="14" d="M 366.6 321 A 200 200 0 0 0 312.7 540 C 313.6 546.0 313.3 566.5 318.0 576.0 C 322.7 585.5 333.7 596.3 341.0 597.0 C 348.3 597.7 355.5 585.8 362.0 580.0 C 368.5 574.2 373.3 560.7 380.0 562.0 C 386.7 563.3 394.3 578.3 402.0 588.0 C 409.7 597.7 417.7 616.3 426.0 620.0 C 434.3 623.7 445.0 617.3 452.0 610.0 C 459.0 602.7 460.8 583.0 468.0 576.0 C 475.2 569.0 486.0 568.0 495.0 568.0 C 504.0 568.0 513.5 570.0 522.0 576.0 C 530.5 582.0 537.8 595.7 546.0 604.0 C 554.2 612.3 562.7 626.3 571.0 626.0 C 579.3 625.7 589.0 611.7 596.0 602.0 C 603.0 592.3 605.7 571.3 613.0 568.0 C 620.3 564.7 631.5 578.3 640.0 582.0 C 648.5 585.7 656.8 592.3 664.0 590.0 C 671.2 587.7 679.1 576.3 683.0 568.0 C 686.9 559.7 686.6 544.7 687.3 540 A 200 200 0 0 0 633.4 321"/>
    <!-- top scoop with drips -->
    <path stroke-width="14" d="M 633.4 321 C 632.2 328.5 631.6 354.2 626.0 366.0 C 620.4 377.8 608.7 390.7 600.0 392.0 C 591.3 393.3 582.3 371.3 574.0 374.0 C 565.7 376.7 558.7 399.3 550.0 408.0 C 541.3 416.7 531.0 426.7 522.0 426.0 C 513.0 425.3 504.3 411.3 496.0 404.0 C 487.7 396.7 480.0 382.0 472.0 382.0 C 464.0 382.0 456.5 399.0 448.0 404.0 C 439.5 409.0 429.2 415.7 421.0 412.0 C 412.8 408.3 406.2 390.3 399.0 382.0 C 391.8 373.7 383.4 372.2 378.0 362.0 C 372.6 351.8 368.5 327.8 366.6 321 A 135 135 0 0 1 467.1 169.1 M 532.9 169.1 A 135 135 0 0 1 633.4 321"/>
    <!-- cherry -->
    <circle cx="500" cy="150" r="38" stroke-width="14"/>
    <path stroke-width="12" d="M 503 112 Q 508 80 540 56"/>
    <path stroke-width="8" d="M 480 142 Q 483 129 495 125"/>
    <!-- face -->
    <circle cx="455" cy="268" r="28"/>
    <circle cx="545" cy="268" r="28"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 443 271 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 Z M 458 263 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 533 271 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 Z M 548 263 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 Z"/>
    <path stroke-width="10" d="M 472 318 Q 500 342 528 318"/>
    <ellipse cx="410" cy="314" rx="20" ry="12" stroke-width="8"/>
    <ellipse cx="590" cy="314" rx="20" ry="12" stroke-width="8"/>
  </g>
</svg>
`,ee=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
   <g stroke-width="7">
    <path stroke-width="7" d="M 907 135 L 905.8 147 L 902.4 158.5 L 896.8 169.1 L 889.2 178.4 L 880 186.2 L 869.5 192 L 858.1 195.6 L 846.1 197 L 834.2 196 L 822.6 192.8 L 811.9 187.4 L 805.8 183 L 801.3 179 L 793.6 169.7 L 787.9 159.2 L 784.3 147.7 L 783 135.8 L 784 123.8 L 785.8 116.5 L 787.9 110.8 L 793.6 100.3 L 801.3 91 L 810.6 83.4 L 821.2 77.8 L 832.7 74.2 L 844.6 73 L 856.6 74.1 L 868.1 77.5 L 878.8 83 L 888.2 90.5 L 895.9 99.7 L 901.8 110.1 L 903.9 115.8 L 905.8 123 Z"/>
    <path stroke-width="6" d="M 920.3 155.2 L 941.6 160.9"/>
    <path stroke-width="6" d="M 900.2 190.2 L 915.7 205.7"/>
    <path stroke-width="6" d="M 865.2 210.3 L 870.9 231.6"/>
    <path stroke-width="6" d="M 824.8 210.3 L 819.1 231.6"/>
    <path stroke-width="6" d="M 789.8 190.2 L 774.3 205.7"/>
    <path stroke-width="6" d="M 769.7 155.2 L 748.4 160.9"/>
    <path stroke-width="6" d="M 769.7 114.8 L 748.4 109.1"/>
    <path stroke-width="6" d="M 789.8 79.8 L 774.3 64.3"/>
    <path stroke-width="6" d="M 824.8 59.7 L 819.1 38.4"/>
    <path stroke-width="6" d="M 865.2 59.7 L 870.9 38.4"/>
    <path stroke-width="6" d="M 900.2 79.8 L 915.7 64.3"/>
    <path stroke-width="6" d="M 920.3 114.8 L 941.6 109.1"/>
    <path stroke-width="6" d="M 812 128 Q 822 116 832 128 M 858 128 Q 868 116 878 128 M 825 152 Q 845 170 865 152"/>
    <ellipse cx="808" cy="155" rx="13" ry="8" stroke-width="5"/><ellipse cx="882" cy="155" rx="13" ry="8" stroke-width="5"/>
    <path stroke-width="7" d="M -85 30 A 30 30 0 0 1 -62 -12 A 42 42 0 0 1 6 -38 A 36 36 0 0 1 66 -8 A 28 28 0 0 1 85 30 Z" transform="translate(480 112)"/>
    <path stroke-width="9" d="M -85 30 A 30 30 0 0 1 -62 -12 A 42 42 0 0 1 6 -38 A 36 36 0 0 1 66 -8 A 28 28 0 0 1 85 30 Z" transform="translate(655 228) scale(0.75)"/>
    <path stroke-width="6" d="M 560 160 Q 572 148 584 160 Q 596 148 608 160 M 395 215 Q 405 205 415 215 Q 425 205 435 215"/>
    <path stroke-width="7" d="M -10 470 L 62.8 448.4 L 84.7 442.7 L 103.6 438.4 L 122.3 434.9 L 140.5 432.6 L 155.7 431.8 L 171.5 432.4 M 224.6 440.6 L 265.5 449 L 291.5 453.1 L 316.1 455 L 337.2 454.6 L 355.9 452.3 L 377.7 448.1 L 398.1 442.9 L 448.1 429.2 L 474.9 423 L 500.4 419.1 L 512.4 418.2 L 522.9 418 L 545 419.3 L 569.1 422.7 L 596.6 428.2 L 672.2 445.8 L 695.3 449.8 L 714.6 451.8 L 726.7 452.1 L 738.2 451.7 L 762.3 449.3 L 787.1 444.8 L 846.9 431.7 L 865 429 L 880 428 L 904 428.7 L 930.4 431.6 L 957.4 435.9 L 1010 446"/>
    <path stroke-width="5" d="M 48 560 L 47.2 550.9 L 46 546 L 43.1 541.5 L 38 536"/>
    <path stroke-width="5" d="M 60 560 L 60 542 L 62 528"/>
    <path stroke-width="5" d="M 72 560 L 72.8 550.9 L 74 546 L 76.9 541.5 L 82 536"/>
    <path stroke-width="5" d="M 438 520 L 437.2 510.9 L 436 506 L 433.1 501.5 L 428 496"/>
    <path stroke-width="5" d="M 450 520 L 450 502 L 452 488"/>
    <path stroke-width="5" d="M 462 520 L 462.8 510.9 L 464 506 L 466.9 501.5 L 472 496"/>
    <path stroke-width="5" d="M 628 560 L 627.2 550.9 L 626 546 L 623.1 541.5 L 618 536"/>
    <path stroke-width="5" d="M 640 560 L 640 542 L 642 528"/>
    <path stroke-width="5" d="M 652 560 L 652.8 550.9 L 654 546 L 656.9 541.5 L 662 536"/>
    <path stroke-width="5" d="M 928 560 L 927.2 550.9 L 926 546 L 923.1 541.5 L 918 536"/>
    <path stroke-width="5" d="M 940 560 L 940 542 L 942 528"/>
    <path stroke-width="5" d="M 952 560 L 952.8 550.9 L 954 546 L 956.9 541.5 L 962 536"/>
    <path stroke-width="5" d="M 108 700 L 107.2 690.9 L 106 686 L 103.1 681.5 L 98 676"/>
    <path stroke-width="5" d="M 120 700 L 120 682 L 122 668"/>
    <path stroke-width="5" d="M 132 700 L 132.8 690.9 L 134 686 L 136.9 681.5 L 142 676"/>
    <path stroke-width="5" d="M 948 800 L 947.2 790.9 L 946 786 L 943.1 781.5 L 938 776"/>
    <path stroke-width="5" d="M 960 800 L 960 782 L 962 768"/>
    <path stroke-width="5" d="M 972 800 L 972.8 790.9 L 974 786 L 976.9 781.5 L 982 776"/>
    <path stroke-width="7" d="M 225 406.2 L 221.7 528.7 L 223.1 558.4 L 224.3 570 L 225.7 578.7 L 227.6 585.5 L 230.4 591.9 L 234 598 L 237.9 601.9 L 241.4 603.9 L 247.6 606.1 L 266.3 609.8 L 268.1 610.4 L 268.7 611.1 L 267 612.5 L 262.2 614.2 L 245.5 617.6 L 222.1 620.6 L 201.1 622 L 186.6 621.6 L 168.4 620 L 149 617.3 L 133.9 614.2 L 128 612 L 127.2 611.1 L 127.8 610.4 L 148.4 605.6 L 154.3 603.1 L 158.9 599.5 L 162.6 593.6 L 165.1 588.3 L 167 582.3 L 168.4 576.1 L 170.8 556.1 L 172.5 527.4 L 171.8 428.4 L 172.4 392.2"/>
    <path stroke-width="6" d="M 212 520 L 211.3 525.9 L 209.5 531.3 L 206.5 535.5 L 204.7 537 L 201.8 538.5 L 197.7 538.9 L 193.7 537.4 L 190.3 534.1 L 187.7 529.4 L 186.5 525.2 L 186 520.8 L 186.3 516.2 L 187.2 512 L 188.9 508.1 L 191.1 504.9 L 193.7 502.6 L 195.7 501.6 L 198.7 501 L 201.8 501.5 L 203.8 502.3 L 206.5 504.5 L 208.8 507.5 L 210.5 511.3 L 211.6 515.5 Z"/>
    <path stroke-width="7" d="M 382 248 L 385.1 259.3 L 385.8 270.9 L 384.4 282.3 L 380.8 293.4 L 375.1 303.7 L 368.7 311.8 L 360.9 318.9 L 356.3 321.9 L 352.6 323.5 L 352.1 325 L 352 328.6 L 351.1 333.7 L 347.6 343.2 L 341.5 353.5 L 333.7 362.5 L 328.4 367.1 L 321.2 372.1 L 313.4 376.3 L 306.7 379 L 298 381.5 L 290.8 382.7 L 283.3 383.1 L 277.3 382.4 L 275.9 383.3 L 270.9 388.7 L 265.1 393 L 258.9 396.5 L 250.7 400.1 L 243.8 402.3 L 234.9 404.1 L 225.9 405 L 216.8 404.8 L 204.3 402.8 L 193.9 399.6 L 184.1 394.7 L 181.1 392.6 L 178.3 389.9 L 176.5 389.9 L 170.8 391.4 L 165.2 391.9 L 152.4 391.3 L 139.9 388.7 L 133.1 386.4 L 126.6 383.4 L 119 378.9 L 113.4 374.7 L 108.3 370 L 103.6 364.9 L 99.6 359.4 L 96.2 353.4 L 93.8 346.9 L 93.2 343.2 L 91.8 342.3 L 84.6 339.7 L 78.4 336 L 72.7 331.7 L 66.4 325.8 L 61 319.1 L 56.5 312 L 52.4 302.8 L 50.3 294.8 L 49.1 284.9 L 49.6 275 L 51.5 266.7 L 52.8 263.5 L 54.7 260.2 L 54.2 258.7 L 50.1 252.7 L 46.4 243.2 L 44.5 233.4 L 44.4 221.8 L 45.6 213.7 L 47.4 207.3 L 49.9 201.1 L 53.1 195.2 L 59 186.8 L 65 180.5 L 72.1 175 L 77.4 172.5 L 77.9 171 L 78.2 165.6 L 79.4 160.6 L 81 155.9 L 83.9 149.7 L 87.5 143.9 L 91.6 138.5 L 96.3 133.5 L 101.6 128.9 L 107.3 124.8 L 113.4 121.3 L 119.9 118.3 L 126.7 115.9 L 133.8 114.1 L 141.1 113.1 L 148.6 112.9 L 152.7 113.6 L 154.1 112.7 L 159.1 107.3 L 164.9 103 L 172.7 98.7 L 181 95.3 L 188 93.2 L 196.9 91.6 L 204.1 91 L 213.2 91.2 L 225.7 93.2 L 236.1 96.4 L 245.9 101.3 L 248.9 103.4 L 251.7 106.1 L 253.5 106.1 L 261 104.4 L 270.3 104.1 L 279.4 104.9 L 290.1 107.3 L 298.5 110.3 L 306.5 114.3 L 313.8 119.1 L 319.2 123.6 L 326.4 131.1 L 331.3 138.1 L 335.1 145.8 L 336.2 149.1 L 336.8 152.8 L 338.2 153.7 L 343.7 155.5 L 348.6 158.1 L 358.6 165.4 L 367 174.1 L 371 179.7 L 374.3 185.5 L 377.6 193.2 L 379.4 199.6 L 380.5 206.1 L 380.9 212.7 L 380.6 219.4 L 379.4 226 L 377.2 232.5 L 375.3 235.8 L 375.8 237.3 L 379.1 241.8 Z"/>
    <path stroke-width="6" d="M 167 195 L 165.9 200.9 L 162.9 206.1 L 160.8 208.2 L 156.9 210.5 L 151.1 212 L 145.2 211.3 L 142.4 210.2 L 138.7 207.7 L 135 203 L 133.4 198.7 L 133 195.8 L 133.8 189.8 L 135 187 L 137.6 183.4 L 142.4 179.8 L 145.2 178.7 L 149.6 178 L 152.6 178.2 L 156.9 179.5 L 161.9 182.8 L 164.7 186.4 L 165.9 189.1 Z"/>
    <path stroke-width="6" d="M 279 165 L 278.7 168 L 277.4 172.3 L 273.9 177.2 L 268.9 180.5 L 263.1 182 L 257.2 181.3 L 254.4 180.2 L 250.7 177.7 L 247 173 L 245.4 168.7 L 245 165.8 L 245.8 159.8 L 247 157 L 249.6 153.4 L 254.4 149.8 L 258.6 148.3 L 261.6 148 L 264.6 148.2 L 268.9 149.5 L 273.9 152.8 L 277.4 157.7 L 278.7 162 Z"/>
    <path stroke-width="6" d="M 322 280 L 321.7 283 L 320.4 287.3 L 316.9 292.2 L 311.9 295.5 L 307.6 296.8 L 304.6 297 L 298.8 295.8 L 293.7 292.7 L 290 288 L 288.8 285.2 L 288 280.8 L 288.8 274.8 L 290 272 L 292.6 268.4 L 297.4 264.8 L 301.6 263.3 L 304.6 263 L 307.6 263.2 L 311.9 264.5 L 316.9 267.8 L 320.4 272.7 L 321.7 277 Z"/>
    <path stroke-width="6" d="M 137 300 L 135.9 305.9 L 134.7 308.6 L 131.9 312.2 L 126.9 315.5 L 122.6 316.8 L 119.6 317 L 113.8 315.8 L 108.7 312.7 L 105 308 L 103.8 305.2 L 103 300.8 L 103.8 294.8 L 105 292 L 107.6 288.4 L 112.4 284.8 L 116.6 283.3 L 119.6 283 L 125.5 283.9 L 128.3 285.2 L 131.9 287.8 L 134.7 291.4 L 135.9 294.1 Z"/>
    <path stroke-width="6" d="M 242 330 L 240.9 335.9 L 239.7 338.6 L 236.9 342.2 L 231.9 345.5 L 227.6 346.8 L 224.6 347 L 218.8 345.8 L 213.7 342.7 L 210 338 L 208.4 333.7 L 208 330.8 L 208.8 324.8 L 210 322 L 212.6 318.4 L 217.4 314.8 L 221.6 313.3 L 224.6 313 L 230.5 313.9 L 233.3 315.2 L 236.9 317.8 L 239.7 321.4 L 240.9 324.1 Z"/>
    <path stroke-width="6" d="M 217 240 L 215.9 245.9 L 214.7 248.6 L 211.9 252.2 L 206.9 255.5 L 202.6 256.8 L 199.6 257 L 193.8 255.8 L 188.7 252.7 L 185 248 L 183.4 243.7 L 183 240.8 L 183.8 234.8 L 185 232 L 187.6 228.4 L 192.4 224.8 L 195.2 223.7 L 199.6 223 L 202.6 223.2 L 206.9 224.5 L 211.9 227.8 L 214.7 231.4 L 215.9 234.1 Z"/>
    <path stroke-width="7" d="M 339.5 630 L 450.5 630 M 479 630 L 747.5 630 M 892.6 756.9 L 965 950 L 210 950 L 288.6 748.8"/>
    <path stroke-width="6" d="M 420 630 L 410.8 664.9 M 366.1 835.1 L 355.3 875.8 M 341.6 928.2 L 335.8 950"/>
    <path stroke-width="6" d="M 505 630 L 500 667.2 M 465.9 918.7 L 461.7 950"/>
    <path stroke-width="6" d="M 590 630 L 589.7 672.1 M 589.6 675.1 L 589.2 730.7 M 587.7 926 L 587.5 950"/>
    <path stroke-width="6" d="M 675 630 L 713.3 950"/>
    <path stroke-width="6" d="M 809.9 831.6 L 839.2 950"/>
    <path stroke-width="6" d="M 528 678 L 549.1 678 M 582.1 678 L 742.8 678"/>
    <path stroke-width="6" d="M 504.4 712 L 735.9 712"/>
    <path stroke-width="6" d="M 268.6 800 L 292.6 800 M 672.8 800 L 725.4 800 M 877.2 800 L 908.8 800"/>
    <path stroke-width="6" d="M 240.5 872 L 297.5 872 M 353.1 872 L 432.7 872 M 666.9 872 L 733 872 M 788.6 872 L 935.8 872"/>
    <path stroke-width="7" d="M 309.4 666.1 L 309.4 645.4 L 310.2 636.6 L 311.6 628.2 L 313.4 621.8 L 315.8 616 L 318.7 610.9 L 322.8 605.4 L 331 596.2 L 339.4 588.1 L 350.1 579.4 L 360 572.6 L 370.2 566.9 L 378.8 563.2 L 387.1 560.8 L 395 560 L 402.9 560.8 L 411.2 563.2 L 419.8 566.9 L 430 572.6 L 439.9 579.4 L 450.6 588.1 L 459 596.2 L 467.2 605.4 L 471.3 610.9 L 474.2 616 L 476.6 621.8 L 478.4 628.2 L 479.8 636.6 L 480.6 645.4 L 480.6 666.1 M 456.4 666.1 L 455.9 650.2 L 454 638.3 L 450.7 629.3 L 444.3 619.5 L 438 611.7 L 432 605.4 L 425.6 599.4 L 418.8 594 L 411.9 589.5 L 406.5 586.8 L 400 584.6 L 395 584 L 390 584.6 L 383.5 586.8 L 378.1 589.5 L 371.2 594 L 364.4 599.4 L 358 605.4 L 352 611.7 L 345.7 619.5 L 339.3 629.3 L 336 638.3 L 334.1 650.2 L 333.6 666.1"/>
    <path stroke-width="7" d="M 504.4 707.6 L 502.6 730.3 M 423.5 834 L 314 834 L 302.4 832.4 L 299.2 831 L 298 830 L 296.6 827.6 L 295.6 824.4 L 294 812 L 285.6 707.6"/>
    <path stroke-width="6" d="M 289.6 745 L 459.8 745"/>
    <path stroke-width="6" d="M 292.6 790 L 420.6 790"/>
    <path stroke-width="6" d="M 335 709 L 335 745"/>
    <path stroke-width="6" d="M 335 790 L 335 833.9"/>
    <path stroke-width="6" d="M 395 733 L 395 745"/>
    <path stroke-width="6" d="M 395 790 L 395 833.9"/>
    <path stroke-width="6" d="M 455 709 L 455 745"/>
    <path stroke-width="6" d="M 365 745 L 365 790"/>
    <path stroke-width="6" d="M 425 745 L 425 787"/>
    <path stroke-width="7" d="M 374.6 708.7 L 331 708.1 L 297 707 L 275.6 705.3 L 266.5 703.4 L 261.5 701 L 260.3 699.6 L 259.7 698.2 L 260.3 695.2 L 267.1 686.4 L 268 684 L 266.7 681.3 L 260 674.6 L 259.7 673.4 L 260.2 672.3 L 261.7 671.2 L 264.5 670.3 L 268.6 669.4 L 289.3 667.6 L 332.6 666.4 L 395 666 L 457.4 666.4 L 500.7 667.6 L 521.4 669.4 L 525.5 670.3 L 528.3 671.2 L 529.8 672.3 L 530.3 673.4 L 530 674.6 L 523.3 681.3 L 522 684 L 522.9 686.4 L 529.7 695.2 L 530.3 698.2 L 529.7 699.6 L 528.5 701 L 523.5 703.4 L 514.4 705.3 L 493 707 L 459 708.1 L 415.4 708.7"/>
    <path stroke-width="6" d="M 395 668 L 395 696.9"/>
    <path stroke-width="6" d="M 380 700 L 382 699 L 386.2 697.9 L 395 697.2 L 403.8 697.9 L 408 699 L 410 700 L 412.6 703.5 L 413.6 706.7 L 413.9 710.4 L 413.8 714.1 L 413 719.3 L 412 722 L 410.4 724.4 L 408.2 726.6 L 403.9 729.4 L 399.3 731.3 L 396.4 731.9 L 393.6 731.9 L 389.1 730.8 L 384.6 728.6 L 381.8 726.6 L 379.6 724.4 L 378 722 L 376.7 717.7 L 376.2 714.1 L 376.2 708.5 L 376.8 705 L 378.1 702.1 Z"/>
    <path stroke-width="7" d="M 672.5 877.7 L 678.5 881.6 L 682.9 886 L 684.8 890.1 L 684.7 894.3 L 682.6 898.4 L 678.5 902.4 L 672.5 906.3 L 663.9 910.3 L 654.2 913.6 L 641.8 916.9 L 629 919.6 L 615.1 921.8 L 584.5 924.9 L 550.4 926 L 517.7 925 L 485.6 921.9 L 471.6 919.7 L 458.7 917.1 L 447.3 914.1 L 436.5 910.4 L 428.5 906.8 L 421.7 902.6 L 417.5 898.6 L 415.3 894.1 L 415.3 889.9 L 417.5 885.4 L 421.7 881.4 L 427.8 877.5"/>
    <path stroke-width="7" d="M 676.4 857.2 L 677.5 858.6 L 677 860.2 L 675.3 861.8 L 667.7 866.9 L 665.9 868.5 L 665 870 L 665.4 871.4 L 666.6 872.9 L 672.1 877.5 L 674.2 880.5 L 673.7 881.9 L 671.9 883.1 L 668.4 884.3 L 655 886 L 633.7 887 L 550 888 L 466.3 887 L 445 886 L 431.6 884.3 L 428.1 883.1 L 426.3 881.9 L 425.8 880.5 L 427.9 877.5 L 433.4 872.9 L 434.6 871.4 L 435 870 L 434.1 868.5 L 432.3 866.9 L 424.7 861.8 L 423 860.2 L 422.5 858.6 L 423.6 857.2"/>
    <path stroke-width="6" d="M 672 832 L 675 832 L 675 858 L 483 858 L 469 876 L 455 858 L 425 858 L 425 832 L 428 832"/>
    <path stroke-width="6" d="M 672 800.8 L 669.3 804.1 L 662.4 810.9 L 661 814 L 662.4 817.1 L 669.3 823.9 L 672 827.2 L 672.7 828.8 L 672.6 830.3 L 671.5 831.7 L 669.4 833 L 666.1 834.2 L 661.3 835.2 L 647.9 836.6 L 603.9 838.2 L 542.5 838.7 L 484.8 838 L 446.6 836.2 L 433.9 834.2 L 430.6 833 L 428.5 831.7 L 427.4 830.3 L 427.3 828.8 L 429.2 825.5 L 437.6 817.1"/>
    <path stroke-width="6" d="M 428.9 786.9 L 422.5 789 L 419.3 791.6 L 418.2 794.7 L 418.8 798.1 L 421.9 803.4 L 426.8 808.4 L 433.5 813.8 L 438.1 816.3 L 441.8 815 L 452.9 805.5 L 457 804 L 459.7 804.6 L 462.3 806.1 L 473 814.8 L 477 816 L 481 814.8 L 491.7 806.1 L 494.3 804.6 L 497 804 L 499.7 804.6 L 502.3 806.1 L 513 814.8 L 517 816 L 521 814.8 L 531.7 806.1 L 534.3 804.6 L 537 804 L 541 805.2 L 551.7 813.9 L 555.7 815.8 L 558.3 815.8 L 561 814.8 L 571.7 806.1 L 574.3 804.6 L 577 804 L 579.7 804.6 L 582.3 806.1 L 593 814.8 L 595.7 815.8 L 598.3 815.8 L 602.3 813.9 L 613 805.2 L 617 804 L 618.3 804.2 L 620.7 805.5 L 627.7 812.8 L 630.4 814.9 L 633.4 816.1 L 635.1 816.3 L 642.4 814.3 L 656.5 808.7 L 667 803.4 L 675 798 L 676.9 795.9 L 677.9 794 L 677.7 792.2 L 677.2 791.4 L 673.2 789.3 L 665.5 787.3"/>
    <path stroke-width="7" d="M 485 732 L 559.2 731.3 L 629.9 732.4 L 630.4 732.5 L 630.7 735 L 631.5 736.3 L 640.1 746.3 L 650.7 760.7 L 657.1 770.6 L 661 778 L 663.1 780.8 L 666.2 782.8 L 671.6 785.5 L 672.1 786.3 L 663.7 787.4 L 638 788.5 L 549.1 789.2 L 460.8 788.5 L 436.3 787.4 L 427.9 786.3 L 428.4 785.5 L 433.8 782.8 L 436.9 780.8 L 439 778 L 444.5 768 L 452.4 756.3 L 460.9 745 L 468.5 736.3 L 469.3 735 L 469.6 732.5 Z"/>
    <path stroke-width="6" d="M 497 746 L 564.7 745.5 L 612.6 746.4 L 610.7 748.3 L 612 750 L 629 763.4 L 637 771 L 640.3 773.1 L 646.1 775.1 L 642.7 775.6 L 620.2 776.2 L 550 776.6 L 479.8 776.2 L 457.3 775.6 L 453.9 775.1 L 459.7 773.1 L 463 771 L 471 763.4 L 488 750 L 489.3 748.3 L 487.4 746.4 Z"/>
    <path stroke-width="5" d="M 550 760 L 550 690.3"/>
    <path stroke-width="6" d="M 550 660 L 592 674 L 550 689 Z"/>
    <path stroke-width="7" d="M 872.4 651.2 L 888.4 649.4 L 900.8 649.4 L 910.1 651 L 913.9 652.4 L 917.2 654.5 L 920.5 657.2 L 924.5 661.7 L 928.3 667 L 931.6 672.8 L 936.7 685.4 L 939.6 697.6 L 940 703 L 939.7 707.4 L 938.9 711.8 L 937.1 717.9 L 934.5 723.9 L 931.3 729.6 L 923.5 740 L 916 747 L 909.3 750.8 L 899.2 754.2 L 886.6 756.7 M 886.2 726.8 L 902.1 718.1 L 905.2 715.8 L 908.7 711.9 L 911.3 707.5 L 912.3 703.1 L 912.2 698.6 L 911.2 692.9 L 909.3 686.9 L 906.9 682.6 L 903.2 678.9 L 900 677 L 892.3 675.3 L 874.8 674.9"/>
    <path stroke-width="7" d="M 734.3 754.6 L 734.1 733.6 L 736.3 713.6 L 746.5 662.5 L 748.1 656.3 L 752 645.4 L 752.6 640.9 L 752 637 L 750 632.8 L 745.1 626.7 L 733.3 614.4 L 731.8 611.9 L 732 611 L 733.8 610.9 L 738 612.2 L 756.3 620.3 L 765.2 623.7 L 771.5 625.3 L 780.2 626.6 L 793.4 627.2 L 812.8 626.9 L 843 622 L 854.3 620.9 L 859.7 621.2 L 863.1 622.1 L 866 623.7 L 867.8 625.4 L 869.5 628.5 L 870.8 633.5 L 871 655.2 L 871.7 663 L 882.9 712.4 L 884.8 723.3 L 885.9 733.6 L 886.1 749.7 L 884.8 765.8 L 882.2 780.8 L 878.9 792.6 L 873 807.1 L 868.5 814.8 L 865.7 818.1 L 862.4 821 L 855.3 825.1 L 845.5 828.1 L 831.3 830.1 L 812.6 831 L 793.6 830.5"/>
    <path stroke-width="6" d="M 753.6 641.8 L 784.5 644.4 L 801.5 645 L 816.2 644.3 L 850.5 641.4 L 870.8 641"/>
    <path stroke-width="6" d="M 738.6 708.3 L 751.4 714.1 L 758.6 715.9 L 761.4 715.9 L 765.7 715 L 781.4 708 L 788.6 706.1 L 791.4 706.1 L 795.7 707 L 807.1 712.1 M 874.7 715.1 L 882.6 716.1"/>
    <path stroke-width="6" d="M 806 739.8 L 804.5 734 L 804 726.5 L 804.8 720.5 L 806.5 714.7 L 809.2 709.4 L 813.8 703.4 L 818.2 699.3 L 823.3 696.1 L 830.3 693.3 L 836.2 692.2 L 842.3 692.1 L 848.2 693 L 855.3 695.4 L 860.5 698.4 L 865.2 702.3 L 870 708.1 L 872.9 713.4 L 874.9 719 L 875.9 725 L 875.7 732.5 L 874.5 738.4 L 872.2 744 L 868.2 750.4 L 864.1 754.8 L 859.3 758.4 L 852.5 761.7 L 846.7 763.4 L 840.8 764 L 833.3 763.4 L 827.5 761.7 L 820.7 758.4 L 815.9 754.8"/>
    <path stroke-width="5" d="M 808 709.5 L 872 746.5"/>
    <path stroke-width="5" d="M 840 691 L 840 765"/>
    <path stroke-width="5" d="M 872 709.5 L 811.9 744.2"/>
    <path stroke-width="7" d="M 795.7 784.9 L 795.4 798.6 L 794.3 813.3 L 788.3 867.2 L 787.4 882.9 L 784.5 881.7 L 776.2 882.9 L 766.4 883.4 L 750.4 883.2 L 737.5 881.7 L 734.6 882.9 L 733.8 868.2 L 728.7 824.5 L 726.6 798.6 L 726.4 778.6 L 727.2 770.3 L 728.3 764.5 L 730 760 L 733.7 755.2 L 737.5 752.2 L 743.6 749.2 L 748.8 747.6 L 756.2 746.5 L 763.9 746.3 L 771.4 747.2"/>
    <path stroke-width="6" d="M 727.5 788.1 L 738 785.7 L 745.5 785 L 748.9 785.7 L 757 790.8 L 761 792 L 765 790.8 L 773.1 785.7 L 776.5 785 L 784 785.7 L 794.5 788.1"/>
    <path stroke-width="6" d="M 816 760 L 815.6 764.5 L 814.3 768.8 L 812.3 772.9 L 809.5 776.4 L 806.1 779.4 L 802.2 781.7 L 796.5 783.6 L 792 784 L 787.5 783.6 L 783.2 782.3 L 779.1 780.3 L 775.6 777.5 L 772.6 774.1 L 770.3 770.2 L 768.4 764.5 L 768 760 L 768.4 755.5 L 769.7 751.2 L 771.7 747.1 L 774.5 743.6 L 777.9 740.6 L 781.8 738.3 L 787.5 736.4 L 792 736 L 796.5 736.4 L 800.8 737.7 L 804.9 739.7 L 808.4 742.5 L 811.4 745.9 L 813.7 749.8 L 815.6 755.5 Z"/>
    <path stroke-width="5" d="M 792 760 L 792 785"/>
    <path stroke-width="5" d="M 792 760 L 770.3 747.5"/>
    <path stroke-width="5" d="M 792 760 L 813.7 747.5"/>
    <path stroke-width="6" d="M 325.6 870.9 L 327 864 L 328.6 860.8 L 332 856"/>
    <path stroke-width="7" d="M 325 872 L 329.8 870.9 L 340.9 866 L 345 866 L 348.6 868.1 L 353 872.9 L 356.5 879 L 358 884 L 358.5 889.7 L 357.8 898 L 356 906.3 L 354 912 L 350.8 917.7 L 345.4 924.1 L 339.9 928.8 L 336.2 930.6 L 332.9 930.1 L 328.2 927.8 L 325 927 L 321.8 927.8 L 315.5 930.6 L 313.8 930.6 L 310.1 928.8 L 303.4 922.9 L 298.3 916.3 L 294.9 909.3 L 292.8 901.4 L 291.5 891.3 L 292 884 L 292.9 880.7 L 295.1 875.8 L 298 871.5 L 300.3 869.1 L 303.8 866.5 L 307.7 865.7 L 312.2 867.1 L 320.2 870.9 Z"/>
    <path stroke-width="6" d="M 81.3 836.3 L 83.6 856.7 L 83.9 869.8 M 83.5 874.9 L 80 905"/>
    <path stroke-width="5" d="M 111.9 859 L 112.4 862.1 L 110.9 865.9 L 107.6 869.8 L 101.7 874.1 L 96.3 876.5 L 91.2 877.5 L 87 877.1 L 84.3 875.3 L 83.6 872.3 L 84 870.5 L 85.5 867.6 L 88.9 863.7 L 93.7 860.3 L 99 857.7 L 104.2 856.5 L 108.6 856.7 L 110.9 857.8 Z"/>
    <path stroke-width="6" d="M 69.2 799.4 L 69.3 791.9 L 71.5 785.2 L 73.6 782.2 L 75.3 780.6 L 77.1 779.6 L 80 779 L 82.9 779.6 L 84.7 780.6 L 86.4 782.2 L 88.5 785.2 L 90.7 791.9 L 90.8 799.4"/>
    <path stroke-width="6" d="M 84.8 804.8 L 90.2 800.6 L 94.3 798.8 L 98.7 797.7 L 103 797.4 L 106.9 798 L 110.3 799.3 L 112.8 801.3 L 114.2 803.9 L 114.6 806.8 L 113.7 809.9 L 111.8 812.9 L 106.6 817.3 L 102.5 819.2 L 98.2 820.4"/>
    <path stroke-width="6" d="M 91.1 816.4 L 94.6 818.4 L 97.9 821.3 L 100.7 824.8 L 102.8 828.7 L 104.1 832.8 L 104.5 836.6 L 104.3 839 L 103.1 841.9 L 101.9 843.5 L 99.4 845 L 96.4 845.6 L 93 845 L 89.4 843.5 L 86 841 L 83 837.7 L 80.5 834"/>
    <path stroke-width="6" d="M 82.1 826 L 81.3 830 L 79.5 834 L 77 837.7 L 74 841 L 70.6 843.5 L 67 845 L 63.6 845.6 L 61.5 845.3 L 58.8 844.1 L 56.9 841.9 L 55.7 839 L 55.5 835.4 L 57.2 828.7 L 59.3 824.8 L 62.1 821.3"/>
    <path stroke-width="6" d="M 70.2 820.4 L 66.1 820.8 L 60.3 820.1 L 56.1 818.7 L 52.2 816.5 L 49.1 813.9 L 46.8 810.9 L 45.6 807.8 L 45.8 803.9 L 47.9 800.6 L 50.7 798.8 L 54.3 797.7 L 58.4 797.4 L 62.8 798 L 68.5 799.9 L 72.2 802.1 L 75.2 804.8"/>
    <path stroke-width="6" d="M 91 815 L 90.5 818.4 L 88.2 822.4 L 84.5 825 L 80 826 L 76.6 825.5 L 72.6 823.2 L 70 819.5 L 69 815 L 69.5 811.6 L 71.8 807.6 L 75.5 805 L 80 804 L 83.4 804.5 L 87.4 806.8 L 90 810.5 Z"/>
    <path stroke-width="6" d="M 151.1 920.7 L 153.3 940.3 L 154 950 L 153.3 955.2 L 152.6 956.8 L 150 960"/>
    <path stroke-width="5" d="M 181.9 944 L 182.4 945.4 L 182.2 948 L 180.2 951.9 L 176.5 955.7 L 171.7 959.1 L 165 961.9 L 160 962.6 L 156.2 961.8 L 154 959.7 L 153.7 956.5 L 156.2 951.6 L 160 947.8 L 165 944.5 L 170.4 942.3 L 175.4 941.4 L 179.4 942 Z"/>
    <path stroke-width="6" d="M 139.2 884.4 L 139.3 876.9 L 141.5 870.2 L 143.6 867.2 L 145.3 865.6 L 147.1 864.6 L 150 864 L 152.9 864.6 L 154.7 865.6 L 156.4 867.2 L 158.5 870.2 L 160.7 876.9 L 160.8 884.4"/>
    <path stroke-width="6" d="M 154.8 889.8 L 157.8 887.1 L 161.5 884.9 L 168.7 882.7 L 173 882.4 L 176.9 883 L 180.3 884.3 L 182.8 886.3 L 184.2 888.9 L 184.6 891.8 L 183.7 894.9 L 181.8 897.9 L 176.6 902.3 L 172.5 904.2 L 168.2 905.4"/>
    <path stroke-width="6" d="M 161.1 901.4 L 164.6 903.4 L 167.9 906.3 L 170.7 909.8 L 172.8 913.7 L 174.1 917.8 L 174.5 921.6 L 174.3 924 L 173.1 926.9 L 171.9 928.5 L 169.4 930 L 166.4 930.6 L 163 930 L 159.4 928.5 L 156 926 L 153 922.7 L 150.5 919"/>
    <path stroke-width="6" d="M 152.1 911 L 151.3 915 L 149.5 919 L 147 922.7 L 144 926 L 140.6 928.5 L 137 930 L 133.6 930.6 L 131.5 930.3 L 129.7 929.6 L 127.4 927.8 L 126 925 L 125.5 921.6 L 125.9 917.8 L 127.2 913.7 L 129.3 909.8 L 132.1 906.3"/>
    <path stroke-width="6" d="M 140.2 905.4 L 136.1 905.8 L 130.3 905.1 L 126.1 903.7 L 122.2 901.5 L 119.1 898.9 L 116.8 895.9 L 115.6 892.8 L 115.8 888.9 L 117.9 885.6 L 120.7 883.8 L 124.3 882.7 L 128.4 882.4 L 132.8 883 L 138.5 884.9 L 142.2 887.1 L 145.2 889.8"/>
    <path stroke-width="6" d="M 161 900 L 160.5 903.4 L 158.2 907.4 L 154.5 910 L 150 911 L 146.6 910.5 L 142.6 908.2 L 140 904.5 L 139 900 L 139.5 896.6 L 141.8 892.6 L 145.5 890 L 150 889 L 153.4 889.5 L 157.4 891.8 L 160 895.5 Z"/>
    <path stroke-width="6" d="M 929.1 618.4 L 931.3 637.6 L 932 648 L 931.2 656.1 L 928 668"/>
    <path stroke-width="5" d="M 959.9 642 L 960.4 644.2 L 960.2 646 L 958.2 649.9 L 954.5 653.7 L 949.7 657.1 L 943 659.9 L 938 660.6 L 934.2 659.8 L 932 657.7 L 931.7 654.5 L 933.5 650.6 L 936.9 646.7 L 943 642.5 L 948.4 640.3 L 953.4 639.4 L 957.4 640 Z"/>
    <path stroke-width="6" d="M 917.2 582.4 L 917.3 574.9 L 919.5 568.2 L 921.6 565.2 L 923.3 563.6 L 925.1 562.6 L 928 562 L 930.9 562.6 L 932.7 563.6 L 934.4 565.2 L 936.5 568.2 L 938.7 574.9 L 938.8 582.4"/>
    <path stroke-width="6" d="M 932.8 587.8 L 935.8 585.1 L 939.5 582.9 L 946.7 580.7 L 951 580.4 L 954.9 581 L 958.3 582.3 L 960.8 584.3 L 962.2 586.9 L 962.6 589.8 L 961.7 592.9 L 959.8 595.9 L 956.9 598.7 L 953.3 601 L 946.2 603.4"/>
    <path stroke-width="6" d="M 939.1 599.4 L 942.6 601.4 L 945.9 604.3 L 948.7 607.8 L 950.8 611.7 L 952.1 615.8 L 952.5 619.6 L 952.3 622 L 951.1 624.9 L 949.2 627.1 L 946.5 628.3 L 944.4 628.6 L 941 628 L 937.4 626.5 L 934 624 L 931 620.7 L 928.5 617"/>
    <path stroke-width="6" d="M 930.1 609 L 929.3 613 L 927.5 617 L 925 620.7 L 922 624 L 918.6 626.5 L 915 628 L 911.6 628.6 L 909.5 628.3 L 906.8 627.1 L 904.9 624.9 L 903.7 622 L 903.5 619.6 L 903.9 615.8 L 905.2 611.7 L 907.3 607.8 L 910.1 604.3"/>
    <path stroke-width="6" d="M 918.2 603.4 L 914.1 603.8 L 908.3 603.1 L 904.1 601.7 L 900.2 599.5 L 896.2 595.9 L 894.3 592.9 L 893.4 589.8 L 893.8 586.9 L 895.9 583.6 L 898.7 581.8 L 902.3 580.7 L 906.4 580.4 L 910.8 581 L 916.5 582.9 L 920.2 585.1 L 923.2 587.8"/>
    <path stroke-width="6" d="M 939 598 L 938.5 601.4 L 936.2 605.4 L 932.5 608 L 928 609 L 924.6 608.5 L 920.6 606.2 L 918 602.5 L 917 598 L 917.5 594.6 L 919.8 590.6 L 923.5 588 L 928 587 L 931.4 587.5 L 935.4 589.8 L 938 593.5 Z"/>
    <path stroke-width="6" d="M 61.1 660.7 L 63.3 680.3 L 64 690 L 63.3 695.2 L 62.6 696.8 L 60 700"/>
    <path stroke-width="5" d="M 91.9 684 L 92.4 687.1 L 90.9 690.9 L 87.6 694.8 L 81.7 699.1 L 76.3 701.5 L 71.2 702.5 L 67 702.1 L 64.3 700.3 L 63.6 697.3 L 64.3 694.6 L 65.5 692.6 L 68.9 688.7 L 73.7 685.3 L 79 682.7 L 84.2 681.5 L 88.6 681.7 L 90.9 682.8 Z"/>
    <path stroke-width="6" d="M 49.2 624.4 L 49.3 616.9 L 51.5 610.2 L 53.6 607.2 L 55.3 605.6 L 57.1 604.6 L 60 604 L 62.9 604.6 L 64.7 605.6 L 66.4 607.2 L 68.5 610.2 L 70.7 616.9 L 70.8 624.4"/>
    <path stroke-width="6" d="M 64.8 629.8 L 70.2 625.6 L 74.3 623.8 L 78.7 622.7 L 83 622.4 L 86.9 623 L 90.3 624.3 L 92.8 626.3 L 94.2 628.9 L 94.6 631.8 L 93.7 634.9 L 91.8 637.9 L 86.6 642.3 L 82.5 644.2 L 78.2 645.4"/>
    <path stroke-width="6" d="M 71.1 641.4 L 74.6 643.4 L 77.9 646.3 L 80.7 649.8 L 82.8 653.7 L 84.1 657.8 L 84.5 661.6 L 84.3 664 L 83.1 666.9 L 81.9 668.5 L 79.4 670 L 76.4 670.6 L 73 670 L 69.4 668.5 L 66 666 L 63 662.7 L 60.5 659"/>
    <path stroke-width="6" d="M 62.1 651 L 61.3 655 L 59.5 659 L 57 662.7 L 54 666 L 50.6 668.5 L 47 670 L 43.6 670.6 L 41.5 670.3 L 38.8 669.1 L 36.9 666.9 L 35.7 664 L 35.5 660.4 L 37.2 653.7 L 39.3 649.8 L 42.1 646.3"/>
    <path stroke-width="6" d="M 50.2 645.4 L 46.1 645.8 L 40.3 645.1 L 36.1 643.7 L 32.2 641.5 L 29.1 638.9 L 26.8 635.9 L 25.6 632.8 L 25.8 628.9 L 27.9 625.6 L 30.7 623.8 L 34.3 622.7 L 38.4 622.4 L 42.8 623 L 48.5 624.9 L 52.2 627.1 L 55.2 629.8"/>
    <path stroke-width="6" d="M 71 640 L 70.5 643.4 L 68.2 647.4 L 64.5 650 L 60 651 L 56.6 650.5 L 52.6 648.2 L 50 644.5 L 49 640 L 50 635.5 L 52.6 631.8 L 56.6 629.5 L 60 629 L 63.4 629.5 L 67.4 631.8 L 70 635.5 Z"/>
    <path stroke-width="6" d="M 561.4 361.7 L 559.4 363.2 L 555.9 364.6 L 550.4 365.1 L 544.7 363.9 L 539.4 361.1 L 535 357.1 L 532.1 352.4 L 531.3 349.8 L 530.9 346.1 L 532.1 341.5"/>
    <path stroke-width="6" d="M 592.1 342 L 593.1 346.7 L 592.9 349.2 L 591.6 353 L 588.5 357.7 L 584 361.5 L 578.6 364.1 L 575.7 364.8 L 571.5 365.1 L 568.8 364.7 L 565.1 363.5 L 561.4 360.4"/>
    <path stroke-width="6" d="M 552 337.6 L 545.1 340.5 L 539.5 341.6 L 534 341.4 L 528 339.5 L 524.3 336.7 L 521.3 332 L 520.4 326.2 L 521.2 321.3 L 524.3 315.3 L 528 310.9 L 534 306.4 L 539.5 303.9 L 545.1 302.6 L 552 302.6 L 556.9 304 L 561.7 307.3"/>
    <path stroke-width="6" d="M 560.2 310 L 564 305.8 L 568.3 303.5 L 574.7 302.3 L 581.7 303.1 L 588.7 305.7 L 593.7 308.9 L 598.9 314.1 L 601.8 318.9 L 603.5 325 L 603.1 330.9 L 601.2 335 L 597 338.9 L 591.3 341.2 L 584.5 341.6 L 578.9 340.5 L 572 337.6"/>
    <path stroke-width="6" d="M 571 335 L 570.2 345.3 L 568 353.7 L 566.7 356.4 L 564.7 358.9 L 563.1 359.8 L 560.9 359.8 L 558.3 357.8 L 556 353.7 L 554.6 349.2 L 553.4 342.4 L 553 335 L 553.4 327.6 L 554.6 320.8 L 556 316.3 L 558.3 312.2 L 560.4 310.4 L 563.1 310.2 L 565.7 312.2 L 568 316.3 L 569.4 320.8 L 570.6 327.6 Z"/>
    <path stroke-width="5" d="M 558 312 L 554.5 299.9 L 552 294 L 548.1 289.9 L 542 286"/>
    <path stroke-width="5" d="M 566 312 L 569.5 299.9 L 572 294 L 575.9 289.9 L 582 286"/>
   </g>
  </g>
</svg>
`,w=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="pizza-pepperoni">
      <circle r="50" stroke-width="8"/>
      <g fill="#111" stroke="none"><circle cx="-18" cy="-12" r="6"/><circle cx="15" cy="-18" r="5"/><circle cx="6" cy="18" r="6"/><circle cx="-14" cy="20" r="4"/></g>
    </g>
    <path id="pizza-mushroom" stroke-width="7" d="M -36 4 C -36 -42 36 -42 36 4 Z M -15 4 L -15 26 Q -15 38 0 38 Q 15 38 15 26 L 15 4"/>
    <g id="pizza-olive">
      <circle r="24" stroke-width="7"/>
      <circle r="9" fill="#111" stroke="none"/>
    </g>
    <path id="pizza-leaf" stroke-width="7" d="M -40 0 Q -5 -34 40 0 Q -5 34 -40 0 Z"/>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- checked tablecloth -->
    <path stroke-width="8" d="M 115.0 -10.0 L 115.0 340.6 M 115.0 619.3 L 115.0 1010.0 M 365.0 -10.0 L 365.0 99.9 M 365.0 860.1 L 365.0 1010.0 M 615.0 -10.0 L 615.0 99.9 M 615.0 860.1 L 615.0 1010.0 M 865.0 -10.0 L 865.0 340.6 M 865.0 619.3 L 865.0 791.2 M 865.0 906.5 L 865.0 1010.0 M -10.0 105.0 L 350.6 105.0 M 629.3 105.0 L 1010.0 105.0 M -10.0 355.0 L 109.8 355.0 M 870.0 355.0 L 1010.0 355.0 M -10.0 605.0 L 109.8 605.0 M 870.0 605.0 L 1010.0 605.0 M -10.0 855.0 L 350.6 855.0 M 629.3 855.0 L 801.2 855.0 M 916.4 855.0 L 1010.0 855.0"/>
    <!-- wooden board -->
    <circle cx="490" cy="480" r="400" stroke-width="11"/>
    <path stroke-width="11" d="M 802.9 729.2 L 903.7 830.0 A 45 45 0 0 1 840.0 893.7 L 739.2 792.9"/>
    <circle cx="871.8" cy="861.8" r="16" stroke-width="8"/>
    <!-- pizza -->
    <circle cx="490" cy="480" r="350" stroke-width="11"/>
    <path stroke-width="8" d="M 790.0 480.0 L 794.0 488.0 L 796.9 496.1 L 797.9 504.2 L 796.9 512.3 L 793.7 520.0 L 789.1 527.4 L 783.6 534.4 L 778.3 541.3 L 773.9 548.2 L 771.1 555.3 L 770.0 562.9 L 770.3 571.1 L 771.5 579.7 L 772.7 588.5 L 773.0 597.2 L 771.9 605.5 L 768.8 613.0 L 763.8 619.5 L 757.2 625.1 L 749.8 630.0 L 742.3 634.6 L 735.5 639.4 L 729.9 644.9 L 725.8 651.3 L 723.0 658.8 L 721.0 667.0 L 719.2 675.7 L 716.9 684.3 L 713.4 692.0 L 708.5 698.5 L 702.0 703.4 L 694.3 706.9 L 685.7 709.2 L 677.0 711.0 L 668.8 713.0 L 661.3 715.8 L 654.9 719.9 L 649.4 725.5 L 644.6 732.3 L 640.0 739.8 L 635.1 747.2 L 629.5 753.8 L 623.0 758.8 L 615.5 761.9 L 607.2 763.0 L 598.5 762.7 L 589.7 761.5 L 581.1 760.3 L 572.9 760.0 L 565.3 761.1 L 558.2 763.9 L 551.3 768.3 L 544.4 773.6 L 537.4 779.1 L 530.0 783.7 L 522.3 786.9 L 514.2 787.9 L 506.1 786.9 L 498.0 784.0 L 490.0 780.0 L 482.3 775.8 L 474.7 772.3 L 467.2 770.2 L 459.5 769.8 L 451.7 771.1 L 443.5 773.6 L 435.1 776.4 L 426.5 778.6 L 418.1 779.5 L 410.0 778.5 L 402.5 775.3 L 395.7 770.3 L 389.4 764.1 L 383.5 757.5 L 377.6 751.3 L 371.5 746.2 L 364.7 742.8 L 357.1 740.8 L 348.8 740.1 L 340.0 739.8 L 331.1 739.3 L 322.6 737.7 L 315.0 734.6 L 308.6 729.6 L 303.5 723.1 L 299.5 715.3 L 296.1 707.1 L 292.8 699.0 L 289.0 691.8 L 284.2 685.8 L 278.2 681.0 L 271.0 677.2 L 262.9 673.9 L 254.7 670.5 L 246.9 666.5 L 240.4 661.4 L 235.4 655.0 L 232.3 647.4 L 230.7 638.9 L 230.2 630.0 L 229.9 621.2 L 229.2 612.9 L 227.2 605.3 L 223.8 598.5 L 218.7 592.4 L 212.5 586.5 L 205.9 580.6 L 199.7 574.3 L 194.7 567.5 L 191.5 560.0 L 190.5 551.9 L 191.4 543.5 L 193.6 534.9 L 196.4 526.5 L 198.9 518.3 L 200.2 510.5 L 199.8 502.8 L 197.7 495.3 L 194.2 487.7 L 190.0 480.0 L 186.0 472.0 L 183.1 463.9 L 182.1 455.8 L 183.1 447.7 L 186.3 440.0 L 190.9 432.6 L 196.4 425.6 L 201.7 418.7 L 206.1 411.8 L 208.9 404.7 L 210.0 397.1 L 209.7 388.9 L 208.5 380.3 L 207.3 371.5 L 207.0 362.8 L 208.1 354.5 L 211.2 347.0 L 216.2 340.5 L 222.8 334.9 L 230.2 330.0 L 237.7 325.4 L 244.5 320.6 L 250.1 315.1 L 254.2 308.7 L 257.0 301.2 L 259.0 293.0 L 260.8 284.3 L 263.1 275.7 L 266.6 268.0 L 271.5 261.5 L 278.0 256.6 L 285.7 253.1 L 294.3 250.8 L 303.0 249.0 L 311.2 247.0 L 318.7 244.2 L 325.1 240.1 L 330.6 234.5 L 335.4 227.7 L 340.0 220.2 L 344.9 212.8 L 350.5 206.2 L 357.0 201.2 L 364.5 198.1 L 372.8 197.0 L 381.5 197.3 L 390.3 198.5 L 398.9 199.7 L 407.1 200.0 L 414.7 198.9 L 421.8 196.1 L 428.7 191.7 L 435.6 186.4 L 442.6 180.9 L 450.0 176.3 L 457.7 173.1 L 465.8 172.1 L 473.9 173.1 L 482.0 176.0 L 490.0 180.0 L 497.7 184.2 L 505.3 187.7 L 512.8 189.8 L 520.5 190.2 L 528.3 188.9 L 536.5 186.4 L 544.9 183.6 L 553.5 181.4 L 561.9 180.5 L 570.0 181.5 L 577.5 184.7 L 584.3 189.7 L 590.6 195.9 L 596.5 202.5 L 602.4 208.7 L 608.5 213.8 L 615.3 217.2 L 622.9 219.2 L 631.2 219.9 L 640.0 220.2 L 648.9 220.7 L 657.4 222.3 L 665.0 225.4 L 671.4 230.4 L 676.5 236.9 L 680.5 244.7 L 683.9 252.9 L 687.2 261.0 L 691.0 268.2 L 695.8 274.2 L 701.8 279.0 L 709.0 282.8 L 717.1 286.1 L 725.3 289.5 L 733.1 293.5 L 739.6 298.6 L 744.6 305.0 L 747.7 312.6 L 749.3 321.1 L 749.8 330.0 L 750.1 338.8 L 750.8 347.1 L 752.8 354.7 L 756.2 361.5 L 761.3 367.6 L 767.5 373.5 L 774.1 379.4 L 780.3 385.7 L 785.3 392.5 L 788.5 400.0 L 789.5 408.1 L 788.6 416.5 L 786.4 425.1 L 783.6 433.5 L 781.1 441.7 L 779.8 449.5 L 780.2 457.2 L 782.3 464.7 L 785.8 472.3 Z"/>
    <path stroke-width="9" d="M 490.0 830.0 L 490.0 130.0 M 793.1 655.0 L 186.9 305.0 M 186.9 655.0 L 793.1 305.0"/>
    <!-- toppings -->
    <use href="#pizza-pepperoni" x="570.0" y="618.6"/>
    <use href="#pizza-mushroom" transform="translate(550.0 720.6) rotate(150)"/>
    <use href="#pizza-olive" x="668.4" y="652.3"/>
    <use href="#pizza-pepperoni" x="410.0" y="618.6"/>
    <use href="#pizza-olive" x="311.6" y="652.3"/>
    <use href="#pizza-leaf" transform="translate(430.0 720.6) rotate(240)"/>
    <use href="#pizza-pepperoni" x="330.0" y="480.0"/>
    <use href="#pizza-mushroom" transform="translate(251.6 411.6) rotate(270)"/>
    <use href="#pizza-olive" x="251.6" y="548.4"/>
    <use href="#pizza-pepperoni" x="410.0" y="341.4"/>
    <use href="#pizza-olive" x="430.0" y="239.4"/>
    <use href="#pizza-leaf" transform="translate(311.6 307.7) rotate(360)"/>
    <use href="#pizza-pepperoni" x="570.0" y="341.4"/>
    <use href="#pizza-mushroom" transform="translate(668.4 307.7) rotate(390)"/>
    <use href="#pizza-olive" x="550.0" y="239.4"/>
    <use href="#pizza-pepperoni" x="650.0" y="480.0"/>
    <use href="#pizza-olive" x="728.4" y="548.4"/>
    <use href="#pizza-leaf" transform="translate(728.4 411.6) rotate(480)"/>
  </g>
</svg>
`,T=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="7" d="M148 98l-.9 8.9-2.7 8.6-4.4 7.8-5.2 6.1-7 5.6-7 3.7-7.6 2.3-9 1-7.9-.7-8.6-2.4-8-4.2-6.9-5.7-5.6-6.9-3.8-7.1-2.4-7.6-1-8.9 .6-7.9 2.4-8.7 4.2-8 5.6-6.9 6.9-5.7 8-4.2 8.6-2.4 7.9-.7 9 1 7.6 2.3 7 3.7 7 5.6 5.2 6.1 4.4 7.8 2.7 8.6zM228 122.6l .1-6 1.3-4.8 2.8-5.3 3.3-3.7 3.2-2.5 3.5-1.8 3.8-1.3 5.7-1 2.3-5.5 2.7-4.2 3.4-3.7 4.7-3.6 7.3-3.4 4.9-1 3.9-.3 5 .3 5.8 1.5 4.6 2 4.9 3.4 6.6-2.4 6.9-.6 6.9 1.2 7.2 3.4 4.6 3.8 3.6 4.8 2.5 5.5 1.5 6.7 5 3.3 3.2 3.8 2.1 4.5 .7 4.9 0 2zM778 110.6l .1-6 1.3-4.8 2.8-5.3 3.3-3.7 3.2-2.5 3.5-1.8 3.8-1.3 5.7-1 2.3-5.5 2.7-4.2 3.4-3.7 4.7-3.6 7.3-3.4 4.9-1 3.9-.3 5 .3 5.8 1.5 4.6 2 4.9 3.4 6.6-2.4 6.9-.6 6.9 1.2 7.2 3.4 4.6 3.8 3.6 4.8 2.5 5.5 1.5 6.7 5 3.3 3.2 3.8 2.1 4.5 .7 4.9 0 2zM595 163.5l .1-4 .9-3.8 1.8-3.6 2.6-3 5-3.2 6.7-1.4 1.5-3.7 2.2-3.4 2.6-2.9 3.2-2.4 6.4-2.8 5.9-.7 3.9 .4 3.9 1 6 3.5 .8 .1 5.7-1.8 4-.2 5.8 1.2 4.4 2.3 3 2.6 3 4 1.6 3.7 1.1 4.7 3.3 2.2 2.6 3 1.6 3.6 .4 3-.4 1.6zM597.8 368.2l 82.2-139.6 5.4-5.9 6-3.4 5.9-1.2 6 0 3 .4 3.8 1.3 4.3 2.5 4.4 4.1 3 3.9 129 202.5M-9.1 515.9l 55.7-81.8M63.4 409.3l 105.9-155.2 5-4.9 6-3.6 6.8-1.5 7.9 .2 4.8 1.4 4.4 2.5 4.4 4 3 4 123.9 197.2M-29 620l-51 0 50.1-73.5M830.6 474.3l 78.4-161.9 2.5-4.4 3.1-3.9 3-2.6 3.5-2 3.8-1.2 4-.3 6 .3 4.7 1.5 3.4 2 4.9 5 3.7 5.9 158.2 307.3-79.9 0M348 451.3l 53.6-115 4.4-5.4 3.2-2.4 2.7-1.3 2.8-.8 4-.4 7.9 .7M-30 604l 0-83.9 .9-.3 17.6-3.5 17.8-2.9 17.8-2.2 17.9-1.7 18-1 20-.5 37.9 .9 20 1.4 19.8 2 19.8 2.7 19.8 3.2 20.5 4.1 20.5 4.7 15.5 4.1 16.1 5.2M774.8 533.8l 20.8-3.3 21.8-2.3 54.9-3.8 47.9-2.4 34-.9 30 .1 26 1 19.8 1.9-.1 95.9M794 604l 236 0 0 420-1060 0 0-420 281 0M281.2 562.3l-6.2-3.2-2.8-2.8-1.6-2.6-1.3-3.7-.7-4 0-5 .8-5.9-4.3-4.1-3.2-3.8-2.4-4.4-1.1-3.8 .1-5 1.5-4.7 3.3-5 5.6-5.7-1-5.9-.1-6 1-4.9 1.6-3.6 3.3-3.8 4.2-2.6 6.6-2.1 7-.8 3.7-7 2.9-4.1 3.6-3.4 4.4-2.4 4.8-1 6 .6 5.6 1.9 6.2 3.4 .8-.1 6.1-3.5 4.6-1.8 3.9-.8 4-.1 5.8 1.6 4.8 3.4 4.5 5.4 3.8 6.9 6 .4 5.8 1.4 4.6 2.1 3.8 3.2 2.6 4.2 1.3 4.8 .3 6-.8 6.9 4.3 4.1 3.2 3.8 2.4 4.4 1.1 3.8-.1 5-1.5 4.7-3.3 5-5.6 5.7 1 5.9 .1 6-1 4.9-1.6 3.6-3.3 3.8-4.2 2.6-6.6 2.1-7 .8-4.8 8.7M681.4 456.6l 5.1-4.7 3.6-1.9 2.9-.7 3.9-.3 5 .8 4.6 1.7 6.2 3.4 .8-.1 6.1-3.5 4.6-1.8 4.9-.9 5 .3 4.6 1.7 4.8 3.7 3.7 4.7 3.8 6.9 7 .6 6.7 1.9 5 3.1 3.2 3.9 1.6 3.7 .9 4.9 0 5-.8 5.9 6.3 6.3 3.2 5 1.6 5.8-.4 4.9-1.3 3.8-2.1 3.4-2.5 3.1-4.3 4.2 1 5.9 .1 6-1 4.9-2.2 4.4-3.5 3.6-4.3 2.4-5.7 1.7-7 .8-3.1 6.2-2.8 4.1M682 435l 0 129M487.7 413.9l 24.3-45.9 142 0 39.9 68-205.9 0M488 267l 0 297M426 564l 0-297M424 254l 33-149.9 32.9 149.9zM338.3 578.3l 24-6.8 26.6-5 20.8-2.5 26 0M477.7 564l 212 0 4 .6M750.4 583l 7.8 4.6 7.4 5M801.1 634l 6.4 14.7 4.5 15.3-576 0 4.8-11 5.9-10.4 7.1-9.7 7.9-9.1M324.2 635.8l-3.8 .2-4.5 5.4-4.7 3.7-3.6 1.6-4 .6-3.9-.4-3.7-1.5-4.3-2.6-4.5-3.9-7.8 .8-5-.4-4.7-1.7-3.1-2.4-2.4-3.2-1.2-2.7-2.2-10.6-4-3.1-3.4-3.6-2-3.5-1.1-3.8 .1-4 1.2-3.8 2.5-4.3 3.9-4.6-.3-8.9 1.5-5.8 2.8-4.1 4.1-2.8 5.7-1.8 7.8-.6 4.5-5.4 4.7-3.7 5.6-2.1 4.9 .1 2.9 .8 3.6 1.8 7 5.6 5.8-.7 5 0 4.9 1.1 3.4 2 2.8 2.8 2.3 4.4 2.2 10.6 4 3.1 2.8 2.9M386.6 628.7l 0 6-.8 3.9-1.8 3.6-2.8 2.8-2.6 1.4-2.9 .8-8 .2-5.3 4.5-4.4 2.2-4 .7-2.9-.4-5.3-2.7-5.5-5.8-9.5-2.4-3.4-2.2-1.9-2.2-1.3-2.7-.7-3 0-3.9 .8-5-2.2-4.4-1.2-3.8-.3-3 .4-2.9 1.1-2.8 1.8-2.4 4-3 4.5-2.2 4.2-7.8 2-2.2 3.4-2.2 2.8-.8 4 0 4.8 1.3 4.5 2.2 7.7-1.9 5.9 .3 2.8 1.1 3.1 2.5 2.7 4.1 2.1 6.7 5.5 4.2 3.5 4.9 .8 3.9-.5 3.9-1.6 3.6zM734.6 634.2l-3 0-4.5 5.4-4.7 3.6-2.7 1.3-3.9 .7-4-.4-3.7-1.4-4.2-2.7-4.6-3.7-5.9 .8-5-.2-4.7-1.4-3.3-2.3-2.4-3.1-1.3-2.7-1.3-4.8-.5-5-4.5-3.8-2.7-2.9-2.1-3.4-1-3.9 .1-3.9 1.3-3.8 2.6-4.2 3.3-3.8-.3-8 .7-3.9 1.1-2.8 3-3.9 4.2-2.6 5.8-1.4 6-.2 5.2-6.1 4.9-3.4 4.7-1.4 4 .1 2.9 .8 3.6 1.8 7 5.4 5.9-.8 5 .2 3.8 1 3.4 2 2.7 3 1.8 3.5 1.3 4.8 .5 5 5.9 5.2 2.9 4M800.5 635.2l 0 6-1 4.9-1.8 3.6-2.8 2.8-2.6 1.4-3.9 1.1-7.9 .1-5.3 4.6-5.4 2.6-3.9 .6-3-.3-2.8-1.1-3.3-2.1-6.2-6.4-5-.6-4.7-1.6-2.6-1.5-2.7-2.9-1.3-2.7-.8-3.9 0-4 .8-4.9-3.5-8.2-.4-3 .4-4 1.6-3.6 2-2.2 4-3 4.5-2.1 2.6-5.4 2.2-3.3 2.9-2.8 2.5-1.5 3.9-1 4 .2 4.8 1.4 4.4 2.2 8.7-2 5.9 .3 3.6 1.7 3 2.7 2.6 4.2 2.1 6.7 6.2 4.9 3.3 4.9 .9 3.9-.5 3.9-2 4.6zM129.5 847.4l-5.7-5.5-5.8-6.9-5.1-7.5-4-6.9-3.8-8.1-3.7-9.3-2.7-8.5-2.7-10.7 279.7 0 .1 .6-2.2 7.7-4.2 11.2-4.8 9.9-5.5 9.5-5.9 8.1-7.2 8.3-7.3 6.7-8 6M747 826.1l-11.3-11.3-5.7-6.9-2.8-5.3-2.1-5.6-2.1-7.7-1.2-6.9-.7-12 1.5-9.9 3.3-8.3 9.4-17.7M708.6 733.5l-6.2 12.5-3.7 11.4-1.9 15.9 0 12 1.7 13.9 3.2 12.6 7.5 18.5 6.1 12.6M709 734.9l-3.1-2.5-2.5-3M705.4 710.9l 3.6-3.4 4.2-2.6 4.7-1.9 4.8-1 5-.2 5.8 1 3.8 1.4 4.1 2.7 2.7 2.9 1.8 3.5 .9 3.9-.3 3.9-1.7 4.7-2.2 3.3-3.6 3.4-4.2 2.6M745.9 826l 13.7-2.9 14.9-1.5M902.7 777.4l 3.4-3.1 2.3 17.8 .4 17-.8 11-1.7 10.8-2.4 9.7-3.6 10.4-3.7 8.2-4.4 7.9-5.1 7.3-5.9 6.9-5.7 5.5-7.1 5.6-7.5 5-8.8 4.6-122 0-7-.6-5.7-1.8-6-3.5-4.8-5-3.2-6.3-1.4-7.8 .8-10 2.3-8.6 4.1-8 6.3-7.8"/>
    <path stroke-width="6" d="M161.3 121.7l 22.2 9.2M127.7 155.3l 9.2 22.2M80.3 155.3l-9.2 22.2M46.7 121.7l-22.2 9.2M46.7 74.3l-22.2-9.2M80.3 40.7l-9.2-22.2M127.7 40.7l 9.2-22.2M161.3 74.3l 22.2-9.2M647.2 283.6l 9.7 14 .5 0 11-25.5 11 25.6 11.4-25.4 11 25.7 10.9-25.7 11.4 25.4 11-25.6 11 25.5 .5 0 9.7-14M131.9 307.6l 10.5 14.1 11.3-25.6 11.7 25.5 11.3-25.6 11.3 25.5 .4 0 11.3-25.5 11.3 25.6 11.7-25.5 11.3 25.6 10.4-14.1M891.8 346.8l 12.6 15.1 13.1-25.7 13.1 25.4 .5 0 13.1-25.4 13.1 25.7 12.6-15.1M384.8 370.8l 11.6 14.9 .5-.2 12.1-25.1 .4 .1 12.1 25.1 .4 0 4.3-9M40.8 510.2l 2.4-6.6 .4-2-.2-.9-1.6-.9-5 .3-.9-.5-.6-1.8 13.5-49 .4-2-.5-1.8-3.7-.3-.4-1.8 12.2-53.5 1-2.8 .7 .4 .6 1.9 12.1 52.5 .1 2.9-.7 .8-2.9-.4-.8 .6 .2 3 13.5 49-.2 1.9-.8 .6-.9 .3-4.9-.3-.9 .5-.4 1.8 2.2 6.6M123.2 510.1l 9.7-26.3-.6-1.8-.8-.5-7 .5-.9-.2-.8-.7-.4-1.9 16.9-59.6-.2-2.9-.8-.4-3.9 0-.8-1.7 .3-2 14.8-63.3 1.1-2.8 .7 .5 .6 1.9 15.1 64.2-.2 2.9-.8 .6-3.9-.2-.7 .7 .2 3 16.8 59.6-.8 1.8-.8 .4-7-.5-.9 .3-.8 .7-.1 1.9 11.5 30.9M259.1 520l-.9 .4-3.9-.4-.9 .4-.4 .8 .5 2.9 3.3 8.4M226.3 524.5l .8-2.8-.2-1-1.7-.7-4 .3-.8-.6-.2-1.9 11.8-40.3-.1-1.9-.8-.3-2 .3-.7-.6-.1-2 10.4-41.7 1.1-2.7 .7 .4 .7 1.8 10.5 42.8-.4 1.8-2.9-.1-.5 .8 .2 1.9 10.6 35.5M801.4 529.9l 4.5-12.2 .4-2.9-1.4-1.2-4.9 .2-.9-.4-.4-1.9 12.8-46.3 .1-2-.5-.7-3 .3-.6-.8 0-2 11.2-48.7 1.1-2.8 .7 .5 .6 1.9 11.5 49.6-.4 1.9-3.6 .4 0 2.9 12.7 46.3-.8 1.6-.9 .4-5-.2-.7 .5-.3 1 4.2 12.3M875.7 524.3l 13.4-33.3-.3-1.9-.8-.5-7 .4-1.5-1-.3-1 16.2-53.5 .2-1.9-.3-.9-.9-.4-3 .4-.8-.4-.3-2.9 14.4-56.1 1.1-2.7 .8 .4 .6 1.8 14.4 56.2 .3 2-.2 .9-.7 .7-3.9-.1-.7 .7 .3 2.9 16.1 52.5-.6 1.9-.8 .4-7-.4-.9 .3-.7 1.8 12.6 31.5M523 512l 0-33.9 .4-2.9 2.3-4.4 3.1-2.5 4.7-1.3 4 .6 2.6 1.3 2.3 2 1.6 2.5 .8 2.8 .1 35.8zM573 512l 0-33.9 .4-2.9 2.3-4.4 3.1-2.5 4.7-1.3 4 .6 2.6 1.3 2.3 2 1.6 2.5 .8 2.8 .1 35.8zM623 512l 0-33.9 .4-2.9 2.3-4.4 3.1-2.5 4.7-1.3 4 .6 2.6 1.3 2.3 2 1.6 2.5 .8 2.8 .1 35.8zM425 416l 63 0M444 330l 0-34 .9-4.8 2.7-4.2 4.1-2.9 4.8-1.1 4.9 .8 3.5 1.9 2.2 2.1 1.6 2.5 1 2.8 .3 3 0 33.9zM472 368l-1.2 5.8-3.3 4.9-4 2.8-5.8 1.5-5.8-.9-5.1-3.1-3.4-4.8-1.4-5.7 1-5.8 3.1-5 4.9-3.4 5.8-1.3 5.8 1.1 4.9 3.2 3.3 4.9zM444 470l 0-24 .3-2.9 1-2.8 1.7-2.6 2.1-2 4.5-2.2 4.9-.4 4.7 1.5 3.9 3.2 1.6 2.5 1 2.8 .3 26.9zM444 562l 0-30 .6-3.9 1.8-3.6 2.7-2.8 4.5-2.2 3.9-.5 3.9 .8 3.5 1.9 2.8 2.9 1.7 3.5 .6 4 0 29.9M489 252l 7 0 0 16-78 0 0-16 7 0M457 106l 0-15M457 77l 0-13M436 562l 42 0 21.9 99.5-.4 .5-85 0-.4-.4zM216 672l 76.8 4 75.9 2.8 75.9 1.6 76.9 .6 76.9-.6 77.9-1.6 76.9-2.8 78.8-4M103 808l 265 0M20 846l 7.5-2.8 6.7-1.7 6.9-1.1 7-.4 7 .4 7.9 1.3 6.7 1.9 11.2 4.3 6.7 2 7.8 1.5 8 .6 7.9-.4 6.9-1.2 7.7-2.1 16.9-6 7.9-1.6 7.9-.7 7 .2 7.9 1.2 8.7 2.4 16.9 6 7.8 1.6 8 .6 8-.4 7.8-1.3 7.7-2.1 11.2-4.4 5.7-1.7 7.9-1.5 6.9-.6 7 .2 7.9 1.1 7.8 2 12.1 4.6 6.7 2 6.8 1.4 8 .7 8-.3 7.8-1.3 7.7-2.1 16.9-6 7.9-1.6 6.9-.7 8 .2 8.9 1.4 7.7 2.2 15.9 5.7 6.8 1.6 7 .8 8 0 7.9-1 8.7-2.1 7.5-2.8M750 852l 3-6.3 3.5-6 4.2-5.6 5.4-5.9 5.2-4.6 6.4-4.8 6.8-4.2 8-4.2 14.6-6.3 16.1-5.4 60.9-15.9 21.9-6.8-2.8 12.7-4.3 12.2-5.7 11.6-7.2 10.8-8.4 9.9-9.6 8.7-11.3 8.2-12.3 6.8-14.7 6.1-15.3 4.4-13.8 2.5-11-.2-16.8-1.9-6.8-1.6-5.6-2-4.4-2.4-3-2.6-2.2-3.3z"/>
    <path stroke-width="5" d="M222 196l 2.7-2.9 3.8-3.1 3.6-1.7 3.9-.7 3.9 .7 3.6 1.7 3.8 3.1 2.7 2.9 4.2-4.2 4.1-2.8 3.7-1.2 4 0 5.5 2.2 3.8 3.1 2.7 2.9M284 226l 5.1-4.7 2.7-1.3 3-.6 2.9 .4 2.7 1.2 5.3 4.6 .6 0 3.6-3.5 2.5-1.6 3.9-1.1 2.9 .3 4.5 2.2 4.3 4.1M736 220l 2.7-2.9 3.2-2.4 2.7-1.3 2.9-.6 3 .3 2.7 1.1 3.3 2.2 3.5 3.6 3.5-3.6 3.3-2.2 3.7-1.3 3 0 2.8 .9 2.6 1.4 5.1 4.8M499 391l 169 0M487 414l 195 0M432 580l 50 0M428 598l 58 0M424 616l 66 0M420 634l 74 0M416 650l 82 0M106.4 814l-42.4 28.3M80.1 848.4l 32.4-21.6M176.5 784.1l 27.4-18.3-7.8-11.6-44.9 29.9M357 825.1l 23.3 15.5M416.3 847.8l-52.3-34.9M320.7 784.1l-44.8-29.9-7.8 11.6 27.4 18.3M800 870l 6.1-7.9 7-7.1 8.6-6.8 10.1-6.5 11.5-6 12.8-5.6 15-5.7 18.9-6.4M853.6 852.1l 9.1-7.6 10-6.6M706 710l-39.8 15.9-1.7 3.5 .6 2.8 1.6 1.2 1.8 .5 35.5-4.1zM670 916l 7.5-2.6 6.9-1.6 6.9-.7 7 .1 10.8 1.8 19.9 6.5 5.9 1.1 7 .4 6-.3 6.9-1.1 20.9-6.8 6.8-1.3 6-.5 7 .3 6.9 1 5.8 1.6 15.1 5.2 5.8 1.2 7 .7 7-.2 7.9-1.3 19.9-6.5 5.8-1.3 6-.6 7 0 6.9 .9 6.8 1.6 6.6 2.4M80 712l 9.4-2.9 9.9-1.1 10.8 1 16.9 5.3 9.8 1.6 5.9 0 5.9-.6 5.8-1.4 5.6-1.9M860 720l 9.4-2.9 9.9-1.1 10.8 1 16.9 5.3 9.8 1.6 5.9 0 5.9-.6 5.8-1.4 5.6-1.9M520 760l 9.4-2.9 9.9-1.1 10.8 1 16.9 5.3 9.8 1.6 5.9 0 5.9-.6 5.8-1.4 5.6-1.9M500 920l 9.4-2.9 9.9-1.1 10.8 1 16.9 5.3 9.8 1.6 5.9 0 5.9-.6 5.8-1.4 5.6-1.9M90 960l 9.4-2.9 9.9-1.1 10.8 1 16.9 5.3 9.8 1.6 5.9 0 5.9-.6 5.8-1.4 5.6-1.9M300 970l 9.4-2.9 9.9-1.1 10.8 1 16.9 5.3 9.8 1.6 5.9 0 5.9-.6 5.8-1.4 5.6-1.9"/>
    <path fill="#111" stroke-width="5" d="M465 84l-.6 3-1.6 2.5-2.5 1.8-2.9 .7-3-.4-2.6-1.6-1.9-2.3-.9-2.9 .3-3.1 1.4-2.6 2.3-2 2.9-1 3 .1 3.9 2.3 1.6 2.5z"/>
    <path fill="#111" stroke-width="5" d="M728 714l-.3 1.5-.9 1.3-1.3 .9-1.5 .3-1.5-.3-1.3-.9-.9-1.3-.3-1.5 .3-1.5 .9-1.3 1.3-.9 1.5-.3 1.5 .3 1.3 .9 .9 1.3z"/>
  </g>
</svg>
`,E=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="10" d="M188 132l-1.1 10.9-3.2 10.5-5.1 9.7-7 8.5-8.5 7-9.7 5.1-10.5 3.2-10.9 1.1-10.9-1.1-10.5-3.2-9.7-5.1-8.5-7-7-8.5-5.1-9.7-3.2-10.5-1.1-10.9 1.1-10.9 3.2-10.5 5.1-9.7 7-8.5 8.5-7 9.7-5.1 10.5-3.2 10.9-1.1 10.9 1.1 10.5 3.2 9.7 5.1 8.5 7 7 8.5 5.1 9.7 3.2 10.5zM690 180l .1-9 2.2-8.7 3.7-7.1 5.7-6.9 5.6-4.3 6.2-3.2 6.6-2 7.9-.9 3.4-8.3 4.8-7.6 6.1-6.6 7.1-5.5 6.2-3.2 6.6-2.4 5.8-1.3 7-.7 9 .7 8.7 2.2 7.2 3.3 8.3 5.4 5.5-2.3 5.8-1.6 6-.8 5 0 5.9 .7 5.8 1.6 5.5 2.3 4.4 2.4 7.7 6.4 6 7.9 4.2 9.1 2.3 10.6 3.6 1.8 4 3 3.4 3.6 2.4 3.2 3.2 7.3 1.2 7.9-.1 3zM95 424l .2-8 1.9-6.7 3.4-6.1 4.6-5.2 4.9-3.5 4.5-2.1 4.8-1.4 5.9-.6 3.2-7.2 3.7-5.9 4.8-5.1 5.6-4.2 5.3-2.8 4.7-1.7 5.8-1.3 5-.3 7 .5 6.7 1.7 6.4 2.9 5.7 4 10.4-3.2 8.9-.4 8.8 1.9 8 4 6 5.2 4.8 6.4 3.2 7.3 1.5 7.8 5.9 3.7 4.6 5.3 2.9 6.3 1 6.9-.3 1.8zM-30 650l 392 0M578 650l 117 0M739 650l 291 0M526 171l 0 91M414 262l 0-91M390 172l 4.4-15.3 6-13.7 7.5-11.8 9.3-10.4 10.9-8.7 12.2-6.8 13.9-5.4 15.5-3.8 15.5 3.6 14 5.3 6.2 3.1 6.8 4.2 10.9 8.8 8.6 9.6 7.6 11.7 6.1 13.7 4.5 15.3-.3 .6zM548.7 337.9l 39.7 420.1M352.6 748.1l 38.6-410.1M374 308l 193.7 .1 2.9 .8 2.6 1.5 3.3 3.7 1.4 4.8 0 8-.9 3.8-2.8 4.1-3.4 2.2-4.8 1-193.7-.1-2.9-.8-2.6-1.5-3.3-3.7-1.4-4.8 0-8 .9-3.8 2.8-4.1 3.4-2.2zM323.3 910.9l-53 .7-10-1-10.6-2.6-9.3-3.8-8.6-5-37.6-26.5-5.9-5.4-4.3-6.7-2.3-7.6 .1-8 1.8-7.8 6.1-18 5.6-11.6 3.9-5.9 4.4-5.4 4.9-5 5.3-4.6 20.8-15.6 6.6-4.4 10.6-5.7 12.1-4.8 11.6-3 39.2-7.7 14-.8 13.9 1.1 10.8 2.2 29 7.7 10.9 4.8 9.2 6.1 5.2 4.6 4.8 5.2 16.3 21.5 5.5 10.6 1.9 5.7 1.5 6.8M788.9 766.2l 4.2 4.3 4.3 5.6 3.5 6 2.4 5.5 1.8 5.7 5.7 23.3 .8 5.9 .1 5M777.9 874.6l-6 3.7-6.3 2.8-6.7 2.1-6.9 1.4-71.8 3.5M557.3 816.1l-.1-6 .9-6.9 2-6.7 3-6.3 9.4-15.4 3.4-4.9 6.7-7.3 7-5.7 6.8-4.2 7.2-3.3 37.8-13 16.6-3.8 8.9-1.1 9-.4M329.6 889l 9.7-17.5 3.8-5.9 5.7-6.9 6.6-6.1 6.4-4.7 7-3.9 34-14.5 18.1-5.9 17.6-3.5 69.6-7.7 9.9-.7 10 0 11 .7 10.9 1.4 54 10.1 12.5 3.5 11.8 5.4 6.8 4.2 7.1 5.5 23.9 21.3 5.5 5.8 4.6 6.6 2.8 6.3 1.9 7.8 .5 7.9-2.4 19.9-1.7 6.8-3.9 8.1-2.3 3.2-3.5 3.6-5.7 4.1-6.3 3-42.6 14.3-16.6 3.5-16.9 1.5-161.9 1.5-20-1.7-10.8-1.9-9.7-2.4-25.9-7.4-8.2-3.8-6.4-4.7-4.8-5.1-3.7-5.9-3.7-9.3-1.5-6.8-.3-7 .9-6.9 2.4-7.7zM779.6 867.2l 3.5-10.4 3.3-7.3 4.4-6.6 4.7-5.2 4.6-3.9 6.7-4.2 20.3-8.5 8.5-3 7.7-2.1 7.9-1.4 7.9-.9 13 0 34.9 2.6 9.8 1.8 9.3 3.7 8.2 5.6 6.9 7.3 10.7 15.6 4.9 9.8 1.8 5.7 1.2 5.9 .4 6-.2 6-.9 5.9-4 17.6-2.8 8.5-2.8 5.3-2.8 4.1-4.2 4.3-4.7 3.7-5.2 3-4.5 2-27.2 10.1-9.6 2.9-8.8 1.8-8.9 1-8 .2-9-.4-32.8-3.3-7.9-1.4-5.6-2-4.5-2.2-4.9-3.5-4.3-4.2-4.2-5.6-2.9-5.2-8.2-17.1-3.2-9.5-1.5-8.8-.1-8 1-7.9z"/>
    <path stroke-width="7" d="M202.2 161.1l 25.9 10.7M161.1 202.2l 10.7 25.9M102.9 202.2l-10.7 25.9M61.8 161.1l-25.9 10.7M61.8 102.9l-25.9-10.7M102.9 61.8l-10.7-25.9M161.1 61.8l 10.7-25.9M202.2 102.9l 25.9-10.7M256 255l 4.8-5 5.5-4.3 5.4-2.6 5.8-1.1 5.9 .8 5.5 2.4 5.6 4.1 5.5 5.7 6.3-6.4 6.6-4.4 6.6-2 6 .1 4.7 1.5 4.3 2.4 4.7 3.8 4.8 5M654.8 330l 4.1-4.3 3.1-2.5 3.4-2 3.8-1.3 4.9-.2 4.8 1.3 4.3 2.5 6.5 6.1 .6 0 4.9-4.9 4.1-2.8 4.6-1.8 3.9-.5 4 .6 4.5 2 4.8 3.5 4.1 4.3M761.4 410l 3.4-3.6 3.2-2.4 3.6-1.7 3.9-.7 2.9 .3 3.7 1.4 4.1 2.8 3.5 3.5 .6 0 5.1-4.7 3.4-2.1 3.8-1.1 3.9 .1 5.5 2.2 3.2 2.4 3.4 3.6M-30 772l 20.8-2.8 20.9-1.9 20-.9 21-.1 19 .7 18.9 1.3 64.7 6.9 22.9 1.9 25 .7 23.9-1.1M794.6 773.1l 37.4-7 33.6-5 30.9-3 27.9-1.1 27 .8 25.9 2.8 25.6 4.6 27.1 6.8M-30 920l 21.8-2.9 21.9-1.9 21-.9 21 .1 36.9 2.1 79.6 8.2 19 .9 18 .1 16.9-.9 17.9-2.1 44.3-8 23.7-3.8M671.6 934.9l 27.9-1.2 28.9-2.5 28.8-3.7 30.6-5.1M954.4 906.1l 17.9 1.8 18.8 2.9 19.6 4.1 19.3 5.1M470 40l 0 31M465.1 97.1l-4.3-2.5-3.1-3.9-1.5-4.7 .1-5 1.9-4.6 2.6-3 4.3-2.5 4.9-.9 4.9 .9 4.3 2.5 2.6 3 1.9 4.6 .1 5-1.5 4.7-3.1 3.9-4.3 2.5M451 171l 0 91M489 171l 0 91M383.4 416.8l 43.7 3.2 42.9 1 42.9-1 43.7-3.2M376.5 486.1l 22.8 2.1 23.9 1.6 23.9 .9 22.9 .3 22.9-.3 23.9-.9 23.9-1.6 22.8-2.1M370.5 555.4l 24.8 2.5 24.9 1.7 24.9 1.1 24.9 .3 24.9-.3 24.9-1.1 24.9-1.7 24.8-2.5M363.6 624.6l 26.7 2.8 26.9 2 25.9 1.2 26.9 .4 26.9-.4 25.9-1.2 26.9-2 26.7-2.8M378 308l 0-46 184 0 0 46M490 517l-.4 4-1.2 3.8-1.9 3.5-2.5 3-3.2 2.5-3.5 1.8-3.8 1.1-4 .3-3-.3-3.8-1.1-3.5-1.8-3.2-2.5-2.5-3-1.9-3.5-1.2-3.8-.4-4 .4-4 1.2-3.8 1.9-3.5 2.5-3 3.2-2.5 3.5-1.8 3.8-1.1 3-.3 4 .3 3.8 1.1 3.5 1.8 3.2 2.5 2.5 3 1.9 3.5 1.2 3.8zM436 814l 0-101.9 .9-8 1.9-5.6 2.3-4.5 3-4 4.2-4.2 5-3.4 5.4-2.5 5.8-1.5 5-.4 6 .5 4.8 1.1 4.7 1.9 5.1 3.1 3.8 3.2 3.9 4.6 3 5.2 2 5.6 1.2 8.9 0 100.9M304.2 747.2l 7.7 20.5-11.9 26.3M789.6 766.3l-13.5 23.9 9.9 25.8M474.4 816l 9.5 21.8-11.9 26.2M888.8 814.4l-8.7 23.4 13.9 24.2M683.1 670.3l 2.6-7.6 3.3-6.1 4.4-5.4 5.5-4.4 5.3-2.7 6.8-1.7 7-.4 6.9 1 5.7 1.8 4.5 2.2 4.1 2.9 4.2 4.2 3 4 2.7 5.3 2 5.7 .9 4.9 21 11.6 23.4 11.4M823.1 708.2l 22.7 7.8-.3 .7-11 14.2-12.4 13-12.9 11.1-12.4 8.4-5.3 2.8-7.7 2.1-10.8 2.1-12.9 1.5-12 .6-11-.1-11-.8-9.9-1.3-14.5-3.7-5.6-2.2-5.3-2.8-4-2.9-2.9-2.8-2.7-4.2-2.5-5.5-2.4-9.6-.5-11 .9-7 1.8-7.7 2.4-6.6 3.1-6.3-1.7-7.8-.5-7"/>
    <path stroke-width="6" d="M408.7 261l 0 47M439.3 261l 0 47M470 261l 0 47M500.7 261l 0 47M531.3 261l 0 47M736 690l 8.7-2.3 9-.6 9.9 .8 11.8 2.3 13.4 4 15 5.6 19.3 8.3 16.6 8-12.6 6-13.9 5.7-13.2 4.6-12.5 3.7-11.6 2.6-9.9 1.5-10 .5-8-.7-6.1-3.3-5.8-5.5-4.3-6.7-2.6-7.6-.8-7.9 .9-6.9 2.5-6.5zM797.3 696.6l-.2 8.9 .6 8.9 1.4 9.8 1.8 8.7M684 662l-41.6 9.9-1.7 2.4-.3 .9 .4 1.9 1.2 1.6 2.6 1.4 37.4 3.7z"/>
    <path fill="#111" stroke-width="6" d="M717 666l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
  </g>
</svg>
`,D=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="7" d="M162 108l-1 9.9-2.9 9.5-4.8 8.8-5.7 6.9-7.6 6.3-8.8 4.8-8.6 2.7-9.9 1.1-9.9-.9-9.5-2.7-8.8-4.7-7.8-6.3-6.3-7.6-4.3-7.9-3-9.5-1.1-9.9 .7-8.9 2.7-9.6 4.5-8.9 6.1-7.8 7.6-6.5 8.8-4.8 9.4-3 10-1 9.9 .9 9.5 2.9 8.8 4.8 7.6 6.3 5.7 6.9 4.8 8.8 2.9 9.5zM315 145.5l .2-8 1.7-6.7 3.7-7.1 4.6-5.3 4.7-3.6 5.4-2.7 5.7-1.7 6-.6 3.6-8 3.8-5.8 4.8-5.2 6.3-4.9 4.4-2.3 5.6-2.2 5.8-1.4 6-.5 7.9 .6 6.8 1.8 7.3 3.3 5.7 4 10.3-3.3 9-.6 4.9 .6 4.9 1.2 4.6 1.9 4.3 2.5 6.9 5.8 4.7 6.4 3.3 7.3 1.8 8.8 6.6 4.3 4.6 5.3 3 6.3 1.2 6.8-.1 3zM510 251l .1-5 1.1-3.8 2.3-4.4 2.7-2.9 2.4-1.9 3.6-1.7 3.8-1.1 3-.2 1.9-4.6 2.1-3.3 3.4-3.7 3.2-2.4 6.4-2.8 5.9-1 4.9 .3 3.9 .9 4.6 2 3.3 2.3 .8 .1 5.7-1.9 5.9-.2 5.9 1.3 4.4 2.3 3.8 3.2 2.9 4 2.1 4.5 .9 4.9 4.1 2.8 2.6 3 1.7 3.6 .6 3.9-.2 1.8zM-30 812l 108.9-2.1M921.1 809.9l 108.9 2.1M83.4 812.5l 5.9 1.3M92.2 814.4l 31.7 4M125.9 818.6l 21 1.8M154.8 821l 6 .4M163.8 821.6l 5 .3M170.8 822l 4 .3M176.8 822.4l 43.9 2.3 50 1.9 112.9 2.6M386.6 829.2l 70 .7 71 .1 71-.6 67-1.1M667.6 828.2l 86.9-2.5 71.9-3.5M857.4 820l 15.9-1.3M876.3 818.4l 31.7-4.1M911 813.8l 6.8-1.6 3.5-1.4 0-461-3.5-3.6-4.7-3.6-6-3.7-8.1-3.9-18.7-7-23.1-6.6M827 314.7l-41.4-6.9-45.7-5.8-50.7-4.8-53.9-3.6-55.9-2.4-59-1.1-58 .2-58 1.5-55.9 2.7-53.9 4-48.7 5.1-44.5 6.2-38.4 7-32.1 7.8-13.3 4.1-12.2 4.4-10.1 4.6-7.8 4.4-5.5 4.3-3.3 3.7 0 460.9 2.8 1M186 885.7l-1.7-2.4-3.1-2.5-3.6-1.7-4.8-1.2-1.1-5.7-1.3-3.8-2.3-3.2-2.4-1.8-2.8-1.1-3-.4-6.9 .7-.7-.4-2.3-4.4-1.8-2.4-2.1-2.1-3.6-1.8-3.9-.5-3 .5-2.8 .9-4.4 2.4-.8-.3-3.5-3.5-2.4-1.8-2.7-1.3-3.9-.7-3 .3-3.6 1.6-6.7 5.8-7.2-3.4-4-.5-2.9 .4-2.8 1.2-3 2.6-4.7 7.4-6.9-.7-3 .4-2.8 1-3.1 2.5-2.1 3.3-1.2 3.9-.6 4.8-4.9 1.2-3.6 1.7-3.2 2.4-1.7 2.4-1 2.9-.3 2.9 .4 4 1.3 4.8-4.8 3.5-4.2 4.3-2.5 4.3-.9 3.9 .1 4 1.5 4.7 2.4 4.4 3.8 4.6 28.6 3.9 30.9 2 30 .1 29.9-1.9M300 940l 3-4 1.8-3.6 .8-3.9-.2-2.9-1-2.9-2.3-3.2-6.3-4.9 .7-3.9-.1-4-.9-2.9-1.8-2.4-4.3-2.5-5.8-1.1-.9-3.9-1.5-3.7-1.9-2.3-2.4-1.7-4.9-1-6.8 1.3-3.2-5-2-2.2-2.5-1.7-2.8-.9-5 .2-2.8 1-4.3 2.5-.7 0-5.2-4.7-2.6-1.4-2.9-.8-4 .3-2.7 1.2-2.5 1.6-4.3 4-3.4-2.1-3.7-1.5-2.9-.5-3 .3-2.8 1.1-2.3 1.9-2.5 3.1-2 3.4-7.7-1.1-3 .5-2.7 1.3-3.2 3.8-2 6.6-.7 .5-3.9 .7-2.8 1-1.7 1-2.2 2.1-1.6 4.6 .5 6.9-4.5 3.6-2.7 2.9-1.9 3.5-.6 3 .2 2.9 1.3 3.8 2.6 4.2 2.1 2 30.8 3.8 26.9 1.5 28-.1 26.9-1.8zM824.9 898.6l .8-20.9 .3-27 0-546-1.1-2.7-4.2-6.8-10.1-12.4M838.9 281.3l 3 2.6 2.1-1.9M876.8 276.3l-12.3 18.2-5.5 9.6-1 2.7 0 537 .9 25.9 2.5 22.9M972 214l 2.3 4.4 .8 3.9-.4 4-1.3 2.7-2 2.2-3.9 3.1-1.5 5.6-2.1 3.4-2.4 1.8-1.9 .7-6.7 .7-1.6 3.6-2.2 3.4-2.1 2.1-2.6 1.6-2.8 .9-3 .3-8.5-1.6-2.7 4.2-3.4 3.7-4.1 2.8-3.8 1.2-3 .3-3.9-.5-9.1-3.4-3.7 4.6-3.7 3.4-4.3 2.5-3.8 1.2-5 .3-4.9-1.1-4.5-2-5.1-3.2-5.6 5.3-4.9 3.5-5.5 2.2-5 .5-3.9-.6-3.8-1.2-4.4-2.3-5.6-4.3-.7 .1-5.3 4.6-4.2 2.7-4.6 1.9-4.9 .8-5-.4-5.6-2.1-5-3.3-5.2-4.5-4.7 3.7-5.2 2.9-4.8 1.6-4.9 .3-4.9-.9-4.6-2-4.8-3.6-4.8-5-5 3.1-4.6 2.1-3.8 1-4 .2-4.9-1-4.4-2.2-3.9-3.2-5.1-5.8-4.5 2.3-4.8 1.4-4.9 .3-3.9-.9-2.7-1.3-3.2-2.4-6-7.7-6.7 1.7-3 0-2.9-.6-3.6-1.9-2.1-2-4.5-7.6-5-.1-4.5-1.9-1.5-1.4-1.5-2.5-1.4-5.8-3.2-2.3-2.7-2.9-1.4-2.7-.6-2.9 .7-4.9 2.2-4.5-1-4.7 .4-2.9 2.3-3.2 3.3-2.1 .7-3.9 1.7-3.6 2.1-2.2 2.6-1.3 2.9-.6 4 0 2.2-4.4 2.2-3.2 2.2-2.1 2.6-1.5 3.9-.9 3 0 6.7 1.8 3.3-4.9 3.4-3.6 4.3-2.7 3.8-1.1 4-.1 2.9 .5 3.8 1.3 4.5 2.2 3.7-4.5 3.6-3.4 4.3-2.6 3.7-1.3 4-.4 4.9 .6 4.7 1.8 6.8 3.9 4.8-5 5.7-4 5.6-2.1 5-.3 3.9 .6 4.7 1.7 4.3 2.6 4.7 3.7 5.2-4.7 5-3.2 4.7-1.8 4.9-.7 4.9 .6 4.7 1.7 5.1 3.2 5.2 4.6 .8-.1 5.6-4.2 4.4-2.3 4.7-1.4 5-.3 4.9 1 4.5 2.2 4 2.9 4.9 5 .7 .2 4.2-2.7 4.5-2.1 3.8-1.1 4-.3 4.9 .8 4.5 2.1 4.6 3.8 4.5 5.4 5.3-2.4 4.8-1.3 4.9-.1 3.9 1 3.5 1.9 2.2 1.9 2.6 3.1 2.7 4.2 7.6-1.6 3 .1 2.9 .7 2.6 1.4 2.9 2.7 2.2 3.4 1.6 3.6 5.8 .4 2.9 1 1.6 1.1 1.4 1.4 1.4 2.7 1.6 5.6 3.3 2.1 1.8 2.4 .5 3.9zM962 966l 3.3-5 1.9-4.6 .5-4.9-1.1-3.9-3.5-4.8-6.5-4.6-.5-8.7-.9-2.9-1.6-2.5-2.2-2-3.7-1.6-3.9-.7-4-.1-3.4-8.2-3.9-4.5-3.5-1.8-3.9-.7-4 .3-6.6 2.2-.7-.3-3.3-5-3.4-3.6-4.2-2.7-3.9-1-4 .1-3.8 1.1-3.6 1.8-4.9 3.4-4.2-4.3-3.9-3.1-3.6-1.7-3.9-.9-4 .3-4.7 1.8-4.1 2.8-4.9 5-4.9-3.2-4.5-2.2-2.9-.7-4-.2-3.8 1-4.3 2.6-2.8 2.8-4.5 6.2-4.7-1.7-4.9-.8-4 .3-3.7 1.6-2.3 1.8-2.4 3.2-3.4 8.3-3.9 0-4 .7-3.6 1.6-2.3 2-1.6 2.5-1 2.8-.3 8.8-4.3 2.7-3.6 3.4-2.2 3.3-1.2 3.8 .1 3 .9 3.9 1.8 3.6 2.8 4.1 23.7 3.4 27.9 2.7 35.9 1.6 35-.5 33.9-2.5z"/>
    <path stroke-width="6" d="M174.8 134l 22.2 9.2M138 170.8l 9.2 22.2M86 170.8l-9.2 22.2M49.2 134l-22.2 9.2M49.2 82l-22.2-9.2M86 45.2l-9.2-22.2M138 45.2l 9.2-22.2M174.8 82l 22.2-9.2M464.2 829.6l-7.5 14-9.3 15.4-10.9 16.6-13.2 18.8-26.2 35.2-77.1 100.4M535.8 829.6l 7.5 14 9.3 15.4 10.9 16.6 13.2 18.8 26.2 35.2 77.1 100.4M78.7 624.9l 11.8-2.1 20.8-2 64.9-3.6 91.9-2.8 112-1.8 121.9-.6 121.9 .6 111 1.8 91.9 2.9M857.7 618.8l 41.9 2.9 13.9 1.6 7.8 1.6M78.7 609.5l 11.7-2.5M92.3 606.7l 22.9-2.5 31.8-2.4M149 601.7l 9-.5M161 601l 5-.2M169 600.6l 4-.2M175 600.3l 66.8-2.7 78.9-1.9 87.9-1.3 91.9-.4 91.9 .4 87.9 1.3 78.9 2 66.8 2.6M857.9 602.2l 16 1.1M875.9 603.5l 33.7 3.5M911.6 607.3l 9.7 2.2M78.7 455.8l 4.9-3.4 7.2-3.4 9.4-3.4 11.6-3.2 28.3-6 36.6-5.6 43.7-5 48.8-4.1 53.9-3.4 56.9-2.4 60-1.4 62-.5 62 .5 60 1.6 56.9 2.4 53.9 3.5 48.8 4.2 42.7 5M857.9 436l 23.5 4.7 18.4 4.9 13.1 5 5.3 2.8 3.1 2.4M78.7 440.4l 4.7-3.5 7.2-3.6 9.3-3.6 11.5-3.4 28.2-6.4 36.5-6 42.6-5.2 49.8-4.5 53.8-3.5 57.9-2.6 59.9-1.6 61.9-.5 61.9 .6 59.9 1.6 57.9 2.7 53.8 3.6 48.7 4.5 42.7 5.3M857.4 419.3l 23.5 5 18.2 5.1 13.9 5.5 4.4 2.5 3.9 3M78.7 363.6l 5-4.8 6.7-4.4 8.9-4.5 12.1-4.7 13.4-4.3 15.4-4.1 36.2-7.6 43.4-6.9 48.7-5.7 53.7-4.6 57.9-3.3 59.9-2 62-.7 62 .7 59.9 2.2 57.9 3.4 53.7 4.7 48.6 5.9 42.5 6.8M857.9 336.3l 23.1 6.4 18.8 6.8 7.2 3.5 6 3.5 4.9 3.5 3.4 3.6M81.1 811.9l .1-124.8 .6-8 1.2-6.9 1.9-4.6 1.7-.6 2.1 2.1 1.8 4.7 1.4 6.8 .8 8 0 124.8 0 1-.9-.1zM81.1 608.8l .2-103.8 .7-8.9 1.3-6.9 2.1-4.5 .7-.6 1 0 2 2.1 1.5 3.7 1.3 5.9 .8 7.9 0 102.8zM104.2 816.2l .2-128.7 1.1-7.9 2.4-7.6 1.4-2.6 2-2.2 1.7-1.1 1.9-.4 1.9 .4 2.5 1.6 3.5 4.8 2.5 6.6 1.5 8.8 .1 130.7zM104.2 605.3l .3-106.8 1.7-9.8 2.8-7.5 1.7-2.4 2.2-2 1.8-.8 2 0 3.4 1.9 3.4 4.9 2.2 6.6 1.1 6.9 .1 106.7zM107.5 407.6l 15.2-4.4 0-37.8-15 4.5zM145.9 820.3l .3-132.8 1.8-8.8 1.9-4.6 2-3.4 2.6-3 3.4-2.2 2.8-.9 3 0 2.9 .8 2.6 1.5 4.8 5 3.6 7.1 2 8.7 .1 134.8zM145.9 601.9l 0-103 .6-8 2.5-9.6 3.9-7 2.7-2.9 3.3-2.2 2.9-.8 3-.1 2.9 .8 2.6 1.5 4.1 4.3 3.2 6.2 2 8.8 .1 110zM151.1 397.4l 22.6-3.8-.2-39.5-22.4 4.4zM206 824l 0-130.9 .4-6 1.2-5.8 1.8-4.7 2.6-4.3 2.5-3 3.1-2.6 4.4-2.3 3.9-.8 4 .1 2.9 .6 3.7 1.6 3.3 2.2 2.8 2.8 3 4 1.8 3.6 2.4 8.6 .4 6-.1 131.8-.2 .9zM206 598.9l 0-105.9 .7-8 1.5-5.8 1.9-4.5 2.7-4.3 3.4-3.6 4-2.9 3.7-1.6 3.9-.7 4 .3 2.9 .8 3.6 1.7 5.2 4.6 2.3 3.3 2.2 4.5 1.9 7.7 .1 112.9zM213 388.3l 29.4-3.3 0-39.7-.3-.7-28.6 3.5-.5 .5zM282.7 826.9l 0-133.9 .7-8 1.8-5.7 2.3-4.4 3.1-4 3.6-3.3 4.3-2.6 4.7-1.7 5-.6 4.9 .4 3.9 1.1 3.6 1.7 4.1 2.9 2.8 2.8 2.5 3.1 2.4 4.4 1.4 3.7 1.1 4.9 .3 6-.1 133.9-.5 .7zM282.7 596.5l 0-109 .8-7.9 1.8-5.7 2.3-4.5 3.7-4.7 3.7-3.3 5.2-3 4.8-1.5 4.9-.5 5 .7 3.8 1.2 3.5 1.8 5.4 4.5 4.5 6.6 1.8 4.6 .9 3.9 .4 6-.2 109-.4 .7zM291.1 381l 34.9-2.2 .2-40.8-.4-.6-34.7 2.7zM372.3 829l 0-136 .8-7.9 1.9-5.7 2.5-4.4 3.1-3.9 4.5-3.9 5.3-2.8 4.7-1.6 6-.6 5.9 .6 3.9 1.1 4.5 2.1 3.3 2.2 3.7 3.4 3.1 3.9 1.9 3.5 1.8 4.7 1 4.9 0 140.9zM372.3 594.8l 0-110.8 1-7.9 2-5.6 3-5.2 4-4.4 4.7-3.6 4.5-2.2 5.8-1.6 5.9-.3 5.9 .9 3.8 1.4 4.4 2.3 5.9 5.3 4.4 6.7 2.3 7.6 .5 6-.3 110.7zM381.8 376.1l 38.7-1.2 0-41.7-38.6 1.2zM470 829.9l 0-136.9 .9-7.9 1.9-5.7 3-5.1 4-4.5 4-3 4.4-2.4 5.7-1.8 6-.6 5.9 .6 3.9 1 4.6 2 4.1 2.8 3 2.6 3.2 3.9 2.5 4.3 1.5 3.7 1.1 4.9 .3 5-.2 136.9zM470 594l 0-110.9 .3-5 .8-3.9 1.7-4.7 3-5.2 4-4.4 4.8-3.6 5.5-2.6 5.8-1.4 6-.2 5.9 .9 7.3 3.1 3.3 2.3 3.7 3.4 3 3.9 2 3.5 2.4 7.6 .5 6-.3 110.9-.7 .3zM480 374.1l 40 0 0-42-40 0zM569.6 829.7l 0-137 .7-6.9 1.4-4.8 2.7-5.3 3.8-4.7 4.6-3.9 5.2-2.8 4.8-1.5 6-.6 5.9 .6 3.9 1.1 4.5 2.2 3.3 2.2 3.6 3.4 3 4 1.9 3.6 1.4 3.7 1.1 4.9 .3 5-.2 135.9zM569.6 594.2l 0-110.7 .9-8 1.9-5.6 2.5-4.3 3.1-3.9 4.6-3.8 5.3-2.8 5.8-1.6 5-.4 5.9 .8 7.4 2.8 4.2 2.8 3.6 3.4 2.4 3.2 2.5 4.3 1.7 4.7 .9 3.9 .4 5.9-.3 109.8zM579.5 375l 38.7 1.1-.1-41.7-38.6-1.2zM664.8 828.3l 0-135 .5-6.9 1.3-4.9 2.5-5.4 3.6-4.8 3.7-3.4 4.2-2.6 4.7-1.8 4.9-.8 5 .3 4.8 1.3 3.6 1.8 3.2 2.3 2.9 2.8 2.4 3.2 2.4 4.3 1.7 4.8 .8 3.9 .3 6-.1 132.9-.4 .7zM664.8 595.4l 0-110 .9-7.9 1.6-4.8 2.3-4.4 3-3.9 3.8-3.3 4.3-2.5 4.7-1.6 5-.6 5 .6 3.8 1.1 3.6 1.8 3.2 2.3 3.6 3.5 2.9 4 1.9 3.5 2.5 8.7 .4 5.9-.1 108-.4 .7zM673.8 378.8l 34.9 2.2 .2-40.7-.7-.4-23.9-1.8-9.9-.7-.6 .4zM749.8 825.9l 0-132.9 .4-6 1.1-4.9 1.8-4.6 2.5-4.3 3.2-3.8 3.9-3.1 3.6-1.7 4.9-1.1 4 .2 2.9 .8 3.6 1.7 3.1 2.4 2.7 3 3.9 7 2.2 8.6 .4 6-.1 129.9-.2 .9zM749.8 597.4l 0-107.9 .6-7 1.3-4.8 2-4.6 2.8-4.1 2.9-2.8 3.2-2.3 3.7-1.6 3.9-.7 4 .3 3.8 1.1 3.5 1.9 3.1 2.6 2.6 3 2.7 4.2 1.6 3.7 2.2 8.7 .3 5.9-.3 105.9zM757.6 385.1l 29.4 3 0-39.7-29.3-3.8zM873 818.7l .2-130.7 1.5-8.8 2.9-7.4 3.7-4.7 2.7-1.3 2 0 1.8 .7 1.6 1.3 3.1 5 2 6.7 1.2 8.9 0 127.7zM873 603.2l .3-107.7 1.4-7.9 2.7-6.4 1.7-2.5 2.2-1.9 1.8-.8 2-.1 3.4 2 3.3 5 2.5 7.6 1.3 8.8 .1 105.8zM877.3 403.4l 15.2 4 0-36.8-.4-.8-14.2-4.4-.6 .2zM907.2 814.5l .1-125.9 .9-8.9 1.6-6.8 2-4.6 1.5-1.3 1 0 1.8 2.3 1.2 3.8 1 6.9 .5 8 .1 123.8zM907.2 606.7l .2-103.8 .9-7.9 1.3-5.9 2.3-4.4 1.8-.6 1.9 2.1 1.3 3.8 1.2 6.9 .7 8.9 .1 102.8zM725.2 276.6l .4-4-.1-4-1-3.8-1.7-3.6-2.5-3.2-2.9-2.7-9.3-5.4 4.5-4 3.8-4.6 2.1-4.5 .9-3.9-.1-4-1.2-4.8-2.1-4.5-3.9-5.6 6.5-2.7 5.1-3.1 3.7-3.4 2.9-4 1.8-4.6 .8-5.9-.5-6-2.1-8.4 5.2-2.9 3.8-3.3 2.5-4.3 .8-3.8M886.8 276.6l-.4-4 .1-4 1-3.9 1.8-3.5 2.4-3.2 2.9-2.7 9.3-5.4-4.5-4-3.8-4.7-2.1-4.4-.9-3.9 .1-4 1.2-4.8 2.1-4.5 3.9-5.7-5.5-2.4-5-3.3-3.7-3.4-2.8-4.1-1.8-4.6-.6-6 .8-5.9 2.4-8.3-5.2-2.9-3.8-3.3-2.5-4.3-.9-4.8"/>
    <path stroke-width="5" d="M218 236l 4.1-4.3 3.9-2.9 3.6-1.7 3.9-.7 3.9 .5 4.6 1.9 3.9 2.9 4.1 4.3 4.1-4.3 4.8-3.4 4.6-1.7 5 0 3.7 1.3 3.4 2 6.4 6.1M288 270l 2.7-2.9 3.2-2.4 2.7-1.3 2.9-.6 3 .3 2.7 1.1 3.3 2.2 3.5 3.6 3.5-3.6 3.3-2.2 3.7-1.3 3 0 2.8 .9 2.6 1.4 5.1 4.8M436.6 874.7l 62.9 .3 63.9-.3M393.7 932.9l 105.8 1.1 106.8-1.1M340.9 1001.8l 78.8 2.4 79.8 .8 79.8-.8 79.8-2.4M98.1 815.3l 0-193.4M98.1 606l 0-159.7M98.1 430.3l 0-79.8M136.1 819.5l 0-200.4M136.1 602.6l 0-165.5M136.1 420.6l 0-82.8M192.6 823.3l 0-206.8M192.6 599.5l 0-170.7M192.6 411.7l 0-85.3M266.1 826.4l 0-212M266.1 596.9l 0-175M266.1 404.4l 0-87.5M353.6 828.7l 0-215.8M353.6 595.1l 0-178.2M353.6 399.1l 0-89.1M450.1 829.9l 0-217.8M450.1 594.1l 0-179.8M450.1 396.4l 0-89.9M549.9 829.9l 0-217.8M549.9 594.1l 0-179.8M549.9 396.4l 0-89.9M646.4 828.7l 0-215.8M646.4 595.1l 0-178.2M646.4 399.1l 0-89.1M733.9 826.4l 0-212M733.9 596.9l 0-175M733.9 404.4l 0-87.5M807.4 823.3l 0-206.8M807.4 599.5l 0-170.7M807.4 411.7l 0-85.3M901.9 815.3l 0-193.4M901.9 606l 0-159.7M901.9 430.3l 0-79.8M836 430l 3.9 6.9 2.1 7.6 0 7.9-2 7.6M848 600l-3.5 7.1-1.2 3.8-.8 4.8 .6 7.9 2.9 8.4M836 770l 3.8 8 1.1 3.8 .6 4.9-.5 7.9-3 9.4M132 972l 3.1 6.2 1.8 5.7 .2 4-.6 1.9-1.1 1.6-2.5 1.7-3.8 .9-5 0-6.9-1-9 7.6-3.6 1.7-2.9 .4-2-.4-1.7-1-2.4-3.1-1.8-4.7-1.8-8.7-6.2-3.2-4-2.9-2.6-3-1.2-3.7 1.2-3.7 2.6-3 4-2.9 6.2-3.2 1.8-8.7 1.8-4.7 2.4-3.1 1.7-1 2-.4 2.9 .4 3.6 1.7 9 7.6 6.9-1 5 0 3.8 .9 2.5 1.7 1.1 1.6 .6 1.9-.2 4-1.8 5.7zM120 972l-.8 3.9-2.2 3.2-2.4 1.8-3.9 1.1-3.9-.5-3.4-2-2.4-3.2-1-3.8 .6-3.9 2.1-3.4 3.2-2.3 3.9-.9 3.8 .7 3.4 2.2 2.2 3.2zM362 876l 3.1 6.2 1.8 5.7 .2 4-.6 1.9-1.1 1.6-2.5 1.7-3.8 .9-5 0-6.9-1-9 7.6-3.6 1.7-2.9 .4-2-.4-1.7-1-2.4-3.1-1.8-4.7-1.8-8.7-6.2-3.2-4-2.9-2.6-3-1.2-3.7 1.2-3.7 2.6-3 4-2.9 6.2-3.2 1.8-8.7 1.8-4.7 2.4-3.1 1.7-1 2-.4 2.9 .4 3.6 1.7 9 7.6 6.9-1 5 0 3.8 .9 2.5 1.7 1.1 1.6 .6 1.9-.2 4-1.8 5.7zM350 876l-.8 3.9-2.2 3.2-2.4 1.8-3.9 1.1-3.9-.5-3.4-2-2.4-3.2-1-3.8 .6-3.9 2.1-3.4 3.2-2.3 3.9-.9 3.8 .7 3.4 2.2 2.2 3.2zM724 956l 3.5 7.1 1.8 5.7 .1 5-1.8 3.5-3.4 2-3.9 .7-6-.1-6.9-1.1-4.9 5-4 3-3.5 1.9-3.8 .8-2-.3-1.8-.9-3.1-3.8-2.1-5.6-1.6-8.8-7.1-3.7-4.8-3.6-2.5-3-1.1-3.8 1.1-3.8 2.5-3 4.8-3.6 7.1-3.7 1.6-8.8 2.1-5.6 3.1-3.8 1.8-.9 2-.3 3.8 .8 3.5 1.9 4 3 4.9 5 6.9-1.1 6-.1 3.9 .7 3.4 2 1.8 3.5-.1 5-1.8 5.7zM710 956l-.8 3.9-2.2 3.2-2.4 1.8-3.9 1.1-3.9-.5-3.4-2-2.4-3.2-1-3.8 .6-3.9 2.1-3.4 3.2-2.3 3.9-.9 3.8 .7 3.4 2.2 2.2 3.2z"/>
  </g>
</svg>
`,O=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="16" d="M500 71l 0 583"/>
    <path stroke-width="14" d="M500 138l 29.6 20.5 29.3 22.4 28.4 23.8 28 25.6 27 26.7 25.8 27.9 24.6 28.9 23.3 29.9 21.5 30.2 19.5 30.2 17.7 30.2 15.7 30.1 14.2 30.8 12.6 31.6 10.3 30.3 8.5 30.8-39.4 6-43.7 4.8-42.9 3-41.9 1.3-43-.3-42.9-2.1-44.8-3.9-27.8-3.4-9.6-1.6zM500 200l-47.4 54.1-42.7 51.7-39 50.7-18.1 25.1-16.6 23.8-16 24.2-14.9 23.6-13.9 23.2-13.3 23.5-12.6 23.9-11.5 23.3-11.1 24.5-6.6 16.4 32.6 4.9 32.8 3.6 33.9 2.4 32.9 1.1 33-.1 33-1.4 33.9-2.8 31.6-3.8zM216.7 796.8l-17.4-17.9-15.2-18.5-13.8-19.6-12.8-21.5-11.3-22.3-10.6-24.8-9.4-26.4-8.2-27.8 44 9.5 45.2 8.1 44.5 6.6 46.7 5.3 46.9 3.8 46.9 2.3 48 .9 46.9-.5 49-2 48.9-3.3 49.7-4.9 50.6-6.3 50.4-7.6 51.2-9.1 51.9-10.6 52.6-12.1 .5 .3-.4 2-5.6 23.3-4.7 16.3-5.3 16.2-10.8 27.9-12.6 26.2-14.1 24.1-15.5 22.1-17.4 20.7-19.1 19M-30 812l 17.9-8.8 13.2-4.8 5.8-1.3 6-.8 11 0 9.8 1.7 10.5 3.4 8.2 3.5 24.1 12.3 13.7 6 7.6 2.5 7.8 1.6 6 .6 7 0 10.9-1.7 10.4-3.4 11-4.7 26.8-13.6 12-4.8 6.8-2 6.9-1.2 10.9-.4 8.9 1.2 12.5 3.6 11 4.8 26.8 13.5 13 5.2 10.6 2.7 11 .9 7-.5 5.9-1.1 10.5-3.1 12.8-5.6 24.1-12.2 15.7-6.4 10.7-2.5 11-.6 8 .8 4.9 1 10.4 3.4 8.3 3.5 29.5 14.8 11.1 4.5 12.6 3.3 10.9 .7 10-1.1 11.5-3.2 12.9-5.4 29.5-14.8 10.3-4 10.6-2.6 11-.9 7 .5 5.9 1.1 10.5 3.1 12.8 5.7 25 12.6 12.9 5.3 10.7 2.7 10.9 1 5-.2 7.9-1.2 7.7-2.1 5.7-2.1 12.7-5.8 22.3-11.4 14.8-5.9 8.7-2.2 6-.9 7-.2 10.9 1.3 12.4 3.7 9.2 3.9 28.6 14.4 11.1 4.6 12.5 3.2 11 .9 10.9-1.2 12.5-3.6 11-4.7 26.8-13.5 8.2-3.6 10.5-3.4 7.8-1.5 6-.5 7 .3 7.9 1.1 10.6 3.2 8.3 3.4 16 8.1-.1 217.9-1059.9 0z"/>
    <path stroke-width="12" d="M506.8 68.6l 12-1.2 11.9 .3 13.9 1.5 29.5 5.2 13.9 1.9 16 .7 13.9-1-6.1 6.4-4 5.7-2.6 6.5-.7 5.9 1 5.9 2.3 5.5 4 5.7 6.1 6.4-13.9 .5-14-.8-12.9-1.7-30.5-5-15.9-1.6-16 .2-14.7 2.3 0-46.9"/>
    <path stroke-width="10" d="M137.6 678.7l 43.5 6.7 43.6 5.5 44.8 4.5 43.9 3.3 44.9 2.3 46 1.2 45 0 45.9-.9 47-2.1 45.9-3.1 47.8-4.3 46.7-5.3 48.5-6.5 48.4-7.5 48.3-8.5 49-9.7M355 742l-.5 4.9-1.5 4.8-2.3 4.3-3.2 3.8-3.1 2.6-4.3 2.4-4.7 1.6-4.9 .6-4.9-.4-4.8-1.4-4.4-2.3-3.9-3.1-3.2-3.8-2.3-4.3-1.5-4.8-.5-4.9 .5-4.9 1.5-4.8 2.3-4.3 3.2-3.8 3.1-2.6 4.3-2.4 4.7-1.6 4.9-.6 4.9 .4 4.8 1.4 4.4 2.3 3.9 3.1 3.2 3.8 2.3 4.3 1.5 4.8zM525 752l-.5 4.9-1.5 4.8-2.3 4.3-3.2 3.8-3.1 2.6-4.3 2.4-4.7 1.6-4.9 .6-4.9-.4-4.8-1.4-4.4-2.3-3.9-3.1-3.2-3.8-2.3-4.3-1.5-4.8-.5-4.9 .5-4.9 1.5-4.8 2.3-4.3 3.2-3.8 3.1-2.6 4.3-2.4 4.7-1.6 4.9-.6 4.9 .4 4.8 1.4 4.4 2.3 3.9 3.1 3.2 3.8 2.3 4.3 1.5 4.8zM695 738l-.5 4.9-1.5 4.8-2.3 4.3-3.2 3.8-3.1 2.6-4.3 2.4-4.7 1.6-4.9 .6-4.9-.4-4.8-1.4-4.4-2.3-3.9-3.1-3.2-3.8-2.3-4.3-1.5-4.8-.5-4.9 .5-4.9 1.5-4.8 2.3-4.3 3.2-3.8 3.1-2.6 4.3-2.4 4.7-1.6 4.9-.6 4.9 .4 4.8 1.4 4.4 2.3 3.9 3.1 3.2 3.8 2.3 4.3 1.5 4.8zM-30 923.8l 8.9 1.4 9.9 .8 8-.1 10.9-1.2 9.8-1.9 13.5-3.9 34.8-12.6 15.3-4.6 13.7-2.7 7.9-.8 8-.2 15.9 1.5 15.6 3.6 10.5 3.3 31.9 11.6 8.6 2.7 12.6 3.2 15.8 1.9 12 0 12.9-1.6 10.7-2.5 15.3-4.8 31.9-11.6 13.4-3.8 13.8-2.6 7.9-.8 7-.1 13.9 1.2 15.6 3.4 13.4 4.2 31.9 11.6 18.3 5.1 13.8 2.1 8 .4 8-.2 10.9-1.3 15.5-3.7 16.2-5.3 26.2-9.6 16.4-4.7 10.7-2.1 15-1.1 11.9 .7 9.9 1.6 7.8 1.8 16.2 5.1 31.9 11.6 13.5 3.8 13.7 2.6 8 .7 8 .1 12.9-1.2 15.6-3.5 13.3-4.2 27.2-10 18.2-5.5 13.7-2.7 15-.9 5.9 .2 10 1.2 15.5 3.6 11.5 3.6 30 11 18.2 5.3 10.8 2.1 15.9 1 10-.6 9.9-1.5 8.7-2.1 15.3-4.8 31.9-11.6 19.3-5.2"/>
    <path fill="#111" stroke-width="8" d="M510 62l-1 4.4-1.8 2.5-2.4 1.9-4.4 1.2-3-.4-4.1-2.1-1.9-2.4-1.4-4.3 .3-3.1 2-4.1 2.3-2 4.3-1.5 4.5 .5 3.8 2.5 1.8 2.5z"/>
  </g>
</svg>
`,te=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="14" d="M404 794l 0-548 27 0 .4 .6 0 43 .6 .4 26.9-.1 .1-43.9 27 0 .3 43.7 .7 .3 26.7-.3 .3-43.7 27 0 .1 43.9 .9 .1 26 0 .6-.4 0-43 .4-.6 27 0 0 130M282 790l 0-414 24 0 .4 .6 0 43 .6 .4 23.8-.2 .2-43.8 24 0 .2 43.8 .8 .2 23 0 .6-.4 0-43 .4-.6 24 0 0 418M596 788l 0-412 24 0 .4 .6 0 43 .6 .4 23.8-.2 .2-43.8 24 0 .2 43.8 .8 .2 23 0 .6-.4 0-43 .4-.6 24 0 0 407M232.6 786.7l 78.9 3.8 48.9 1.8 47 1 44 0 59.9-1.8 201.8-9.1 77.9-2.3M906.9 781l 35 1.6 33.9 2.3 42.8 3.9 10.9 1.1 .5 .6 0 239-.5 .5-1059.5-.1 0-239.9 40.8-3.8 41.9-2.3M36 650l 213.9 0-29.9 250-153.9 0zM788.6 761.9l 115.4-12.1 10.5 100.4 .4 8-.3 6-.9 5.9-1.5 5.8-2.5 6.5-2.8 5.3-3.4 5-4.6 5.2-4.4 4.1-5.6 4.3-11.2 6.6-12.8 5.5-1.9 .5-6-1-15.4-3.9-6.6-2.6-6.2-3.1-6-3.7-4.7-3.7-4.9-5-3.7-4.7-3.1-5.1-3-6.3-2.2-6.7-1.6-7.8zM782.9 458.8l 63.6-6.7 4 0 3.9 .8 3.7 1.5 3.3 2.2 3.4 3.6 2 3.5 1.5 4.7 .7 6-.1 3.9-.5 3-1.9 4.6-3 4-4.8 3.6-4.6 1.9-66.5 7.2-4 0-3.9-.7-3.7-1.6-3.3-2.2-2.2-2.1-2.3-3.2-2.4-6.5-.7-8.9 .4-3 1.2-3.8 3.9-5.8 2.3-2 3.3-2z"/>
    <path stroke-width="12" d="M442 794.1l 0-87.9 1-8.9 2.7-9.6 3.3-7.3 4.9-7.5 5.9-6.7 6.2-5.2 7.6-4.7 7.4-3.1 7.7-2.1 8.9-1 9 .3 8.8 1.7 7.5 2.6 8 4.2 7.2 5.3 6.3 6.4 5.2 7.3 3.7 7.1 3.1 9.5 1.5 10.9 .1 84.8M61.5 650.1l 1.7-7.8 2.4-7.6 3-7.4 3.2-6.2 7.9-11.5 5.3-5.9 5.2-4.7 5.5-4.3 5.9-3.7 6.2-3.3 7.4-3 7.6-2.4 6.8-1.5 6.9-.9 8-.4 8 .3 6.9 .9 6.8 1.4 7.7 2.2 7.4 3 6.2 3.2 6 3.6 6.3 4.9 5.2 4.7 5.3 5.9 7.9 11.5 3.2 6.2 3 7.4 2.4 7.6 1.7 7.8M834.3 497.7l 27 257.5M831.5 758.4l-27.2-258.6"/>
    <path stroke-width="10" d="M500 240l 0-73M500 108l 32.2 6.9 23.2 6.2 20.6 7.4 19.9 9.4-21.3 8.2-22.7 7.6-24.9 7.3-27 6.9zM314 586l 0-67.8 .6-4.9 1.8-5.7 2.3-4.4 3.8-4.7 4.6-3.7 5.3-2.8 4.8-1.4 5.9-.6 5.9 .6 5.7 1.9 6 3.5 5 4.9 3.6 5.9 2.3 7.6 .4 5-.2 66.6zM628 586l 0-67.8 .6-4.9 1.8-5.7 2.3-4.4 3.8-4.7 4.6-3.7 5.3-2.8 4.8-1.4 5.9-.6 5.9 .6 5.7 1.9 6 3.5 5 4.9 3.6 5.9 2.3 7.6 .4 5-.2 66.6zM540 420l-.8 7.9-2.3 7.6-3.9 7-5.1 6.1-5.4 4.4-7 3.9-7.6 2.3-7.9 .8-7.9-.8-7.6-2.3-7-3.9-6.1-5.1-5-6.2-3.3-6.2-2.3-7.6-.8-7.9 .8-7.9 2.3-7.6 3.3-6.2 5-6.2 6.1-5.1 7-3.9 7.6-2.3 7.9-.8 7.9 .8 7.6 2.3 7 3.9 5.4 4.4 5.1 6.1 3.9 7 2.3 7.6zM500 834l 1.8 .7 2.5 3.1 10.5 24.8 3.2 5.1 3.6 3.4 4.5 2.1 5.9 1.3 25.8 2.2 3.7 1.4 1.3 1.5-.1 2-2.2 3.3-19.7 16.9-3.9 4.5-2.5 4.4-.8 4.9 .3 5.9 5.3 21.4 .9 5.9-.6 3.9-1.6 1.1-3-.2-3.6-1.6-21.3-13.1-5.6-2.2-3.9-.7-4.9 .7-5.6 2.2-23.1 13.9-3.8 1.1-1.9-.5-1.1-1.7-.1-3.9 6.1-26.3 .3-5.9-.8-4.9-1.9-3.6-3.8-4.6-18.3-15.5-2.7-2.9-1.6-2.5-.1-2 .5-.9 3.5-1.8 5.9-.9 21.9-1.6 5.8-1.5 4.4-2.3 3.4-3.7 3-5.2 10.1-23.9 2.5-3.1zM42 704l 202 0"/>
  </g>
</svg>
`,ne=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="7" d="M158 104l-.9 8.9-2.6 8.6-4.2 7.9-5.6 6.9-6.9 5.8-7.9 4.2-8.5 2.7-8.9 1-9.9-1-8.5-2.7-7.9-4.2-6.9-5.8-5.6-6.9-4.2-7.9-2.6-8.6-.9-8.9 .9-8.9 2.6-8.6 4.2-7.9 5.6-6.9 6.9-5.8 7.9-4.2 8.5-2.7 8.9-1 9.9 1 8.5 2.7 7.9 4.2 6.9 5.8 5.6 6.9 4.2 7.9 2.6 8.6zM490 141l 0-6 1.4-5.8 3.2-6.2 4-4.5 3.1-2.5 4.4-2.3 4.8-1.5 5.8-.8 2.2-5.6 3.2-5.1 4-4.5 5.5-4.2 8.1-3.8 4.9-1.1 5-.5 6.9 .6 5.8 1.6 5.4 2.6 4.9 3.4 7.5-2.7 8-.7 7.8 1.4 7.3 3.4 5.4 4.4 4.3 5.5 3 6.3 1.7 7.7 5.1 3.2 3.9 4.4 2.5 5.5 1 5.9-.2 1.9zM825 166.5l .1-5 1.2-4.8 2.4-4.4 3.3-3.7 3.3-2.3 3.6-1.7 6.8-1.2 2.5-5.4 2.1-3.3 3.4-3.7 4-3 6.3-2.9 7.9-1.3 3.9 .2 4.9 1.1 3.7 1.5 5.9 3.4 5.6-1.9 6-.6 5.9 1 6.3 2.9 3.9 3.2 3.7 4.7 2.1 4.5 1.3 5.8 3.9 2.8 3.4 3.7 2 4.5 .6 4-.1 1.9zM-30 810l 198 0M935 810l 95 0M333.9 816l 37 2.2M394.8 819.7l 71.9 4.2M491.6 825.4l 69.9 4.2M587.4 831.1l 69.9 4.2M684.2 836.9l 51.8 3M736 530l-21.9 1.3M712.1 531.4l-3 .2M707.1 531.7l-40.9 2.5M664.2 534.3l-3 .2M659.2 534.6l-40.9 2.4M616.3 537.1l-3 .2M611.3 537.4l-27 1.6M582.3 539.2l-11.9 .7M568.4 540l-3 .2M563.4 540.3l-22 1.3M539.4 541.7l-3 .2M534.4 542l-11.9 .7M520.5 542.9l-3 .1M515.5 543.2l-3 .1M510.5 543.4l-17 1.1M491.5 544.6l-3 .2M486.5 544.9l-16.9 1M467.6 546l-3 .2M462.6 546.3l-3 .2M457.6 546.6l-12 .7M443.6 547.4l-3 .2M438.6 547.7l-3 .2M433.6 548l-6.9 .4M424.7 548.6l-8 .4M414.7 549.2l-40.9 2.4M371.8 551.7l-3 .2M366.8 552l-3 .2M361.8 552.3l-12 .7M347.8 553.1l-3 .2M342.8 553.4l-3 .2M337.8 553.7l-3 .2M333.9 554l 402.1-24 .3-.9M740.8 514.8l .6-1.9M766.1 434.7l .7-1.9M804.4 313.7l .6-1.9M818.9 268l .6-1.9M822.2 257.5l .6-1.9M824.9 248.9l .7-1.9M835.8 214.6l-.1-.5-449.4 75.9-52.5 161.4M736 840l 0-310 100.2-315.5 99.8 315.5 0 310zM334 363.2l-.1 484.8-29.9 8 0-492.8M304 363l 0 493-136 0 0-493M250.7 159.7l 89.2 184.3-181.9 0 83.4-183.8"/>
    <path stroke-width="6" d="M171.1 128.5l 22.2 9.2M136.5 163.1l 9.2 22.2M87.5 163.1l-9.2 22.2M52.9 128.5l-22.2 9.2M52.9 79.5l-22.2-9.2M87.5 44.9l-9.2-22.2M136.5 44.9l 9.2-22.2M171.1 79.5l 22.2-9.2M-30 880l 1060 0M-30 940l 1060 0M416.3 750.7l 0-98.8 .4-8 1.6-9.8 2.8-8.6 4.5-8.9 5.2-7.1 5.3 7.2 4.5 8.9 2.7 8.6 1.6 9.8 .4 8 0 97.8-.1 .9zM511.6 753.4l 0-102.9 .4-8 1.5-9.8 3.4-10.5 4.6-8.8 5.3-7 5.3 7.2 4.6 8.9 3 9.5 1.7 9.9 .5 8.9 0 101.9-.4 .7zM606.9 756.2l 0-107 .6-10 1.7-9.8 3.6-10.5 4.6-8.8 5.4-6.8 5.8 8.1 4.5 8.9 3.1 9.5 1.8 10.9 .4 9 0 106-.5 .5zM370.3 822.9l 0-169.5 .4-.3 24.7 18.4 0 150.6-.2 .8zM465.7 828.7l 0-177 26.2 19.2 0 157-.2 .8zM561.1 834.4l 0-183.8 .4-.2 26.6 19.5 .2 .9 0 162.9-.3 .7zM656.4 840.1l .3-191.1 28.1 20.7 0 169.8-.4 .6zM735 530l 201 0M876 420l-.8 7.9-2.3 7.6-3.9 7-5.1 6.1-5.4 4.4-7 3.9-7.6 2.3-7.9 .8-7.9-.8-7.6-2.3-7-3.9-6.1-5.1-5-6.2-3.3-6.2-2.3-7.6-.8-7.9 .8-7.9 2.3-7.6 3.3-6.2 5-6.2 6.1-5.1 7-3.9 7.6-2.3 7.9-.8 7.9 .8 7.6 2.3 7 3.9 5.4 4.4 5.1 6.1 3.9 7 2.3 7.6zM850 420l-.3 3-1 2.8-2.8 4.1-2.3 1.9-2.7 1.3-4.9 .9-4.9-.9-2.7-1.3-2.3-1.9-2.8-4.1-1-2.8-.3-3 .3-3 1-2.8 2.8-4.1 2.3-1.9 2.7-1.3 4.9-.9 4.9 .9 2.7 1.3 2.3 1.9 2.8 4.1 1 2.8zM786 840l 0-141.8 .6-9 1.7-9.8 2.4-8.6 3.8-9.3 4.8-8.7 5.6-8.3 7.1-8.3 7.9-7.7 10.9-8.8 4.8-3.5 .9 .1 9.6 7.1 7.6 6.5 7 7.1 7.1 8.4 5.5 8.3 4.7 8.9 3.3 8.3 2.7 9.6 1.4 8.9 .6 9-.1 141.6zM806 840l 0-133.8 .8-11 1.1-5.9 2.1-6.7 2.7-6.4 3.3-6.1 3.3-5 5.1-6.2 5.6-5.7 6-5.2 6.1 5.2 5.6 5.8 5 6.2 3.3 4.9 3.4 6.2 2.7 6.4 2 6.7 1.1 5.9 .8 10.9-.1 133.8zM167 600l 137 0M167 740l 137 0M304 600l 30-8M304 740l 30-8M276 432l-.8 7.9-2.3 7.6-3.9 7-5.1 6.1-5.4 4.4-7 3.9-7.6 2.3-7.9 .8-7.9-.8-7.6-2.3-7-3.9-6.1-5.1-5-6.2-3.3-6.2-2.3-7.6-.8-7.9 .8-7.9 2.3-7.6 3.3-6.2 5-6.2 6.1-5.1 7-3.9 7.6-2.3 7.9-.8 7.9 .8 7.6 2.3 7 3.9 5.4 4.4 5.1 6.1 3.9 7 2.3 7.6zM236 428l 0-24M240.2 434.5l 15.8 9.5M196 576l 0-56 .3-3 1-2.8 1.5-2.6 2-2.2 2.5-1.7 2.8-1.1 2.9-.6 4.9 .6 3.7 1.6 3 2.7 2.1 3.3 1.1 3.8 .2 58zM248 576l 0-56 .3-3 1-2.8 1.5-2.6 2-2.2 2.5-1.7 2.8-1.1 2.9-.6 4.9 .6 3.7 1.6 3 2.7 2.1 3.3 1.1 3.8 .2 58zM220 712l 0-61.8 .5-3.9 1.3-3.7 1.7-2.5 4.5-3.9 5.6-2 5.9 .2 4.6 1.8 3.2 2.5 2.9 4 1.6 4.7 .1 64.6zM214 856l 0-65.8 1-6.8 1.6-3.7 2.1-3.3 3.5-3.6 3.4-2.2 4.6-1.8 3.9-.7 5 .1 3.8 .9 5.4 2.7 4.4 3.9 3.2 5 1.8 5.7 .1 69.6zM158 344l 182 0 0 20-182 0zM246 143l 0-25"/>
    <path stroke-width="5" d="M372 216l 2.7-2.9 3.8-3.1 3.6-1.7 3.9-.7 3.9 .7 3.6 1.7 3.8 3.1 2.7 2.9 4.2-4.2 4.1-2.8 3.7-1.2 4 0 5.5 2.2 3.8 3.1 2.7 2.9M448 250l 5.1-4.7 2.7-1.3 3-.6 2.9 .4 2.7 1.2 5.3 4.6 .6 0 3.6-3.5 2.5-1.6 3.9-1.1 2.9 .3 4.5 2.2 4.3 4.1M60 810l 26.4 70M196.2 855.1l 6.8 24.9M315 852.4l 4.5 27.6M432.7 821.8l 3.4 58.2M555.1 828.7l-2.5 51.3M675.4 839.6l-6.2 40.4M796.3 839.7l-10.5 40.3M917 839.9l-14.7 40.1M122 880l 22.7 60M246 880l 15.2 60M370 880l 7.8 60M494 880l .4 60M618 880l-7.1 60M742 880l-14.5 60M866 880l-22 60M990 880l-29.4 60M60 940l 26.4 90M184 940l 19 90M308 940l 11.5 90M432 940l 4.1 90M556 940l-3.4 90M680 940l-10.8 90M804 940l-18.2 90M928 940l-25.7 90M354.4 553.1l 87.9-272.9M408.8 550.1l 89.9-279.7M463.2 547.2l 91.8-286.6M517.9 543.3l 93.2-291.6M572.3 540.4l 95.1-298.5M626.7 537.4l 97.1-305.3M681.4 533.5l 98.4-310.3M333.3 510.2l 419.4-32.9M333.5 466.9l 436-42.3M342.7 423l 443.6-51M356.8 378.7l 446.4-59.4M371 334.4l 449-67.8M848.1 427l 22.5 13M836 434l 0 26M823.9 427l-22.5 13M823.9 413l-22.5-13M836 406l 0-26M848.1 413l 22.5-13M750 760l .2-125.9 1.2-8.9 2.2-7.7 4.3-9 2.8-4.1 .6 0 3.8 5.8 3.6 8.3 2.1 7.7 1.1 8.9 .1 124.9zM900 760l .2-125.9 1.2-8.9 2.2-7.7 4.3-9 2.8-4.1 .6 0 3.8 5.8 3.6 8.3 2.1 7.7 1.1 8.9 .1 124.9z"/>
    <path fill="#111" stroke-width="5" d="M241 432l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="5" d="M256 152l-1 4.4-1.8 2.5-3.8 2.5-3 .6-4.5-.9-2.6-1.6-1.9-2.4-1.4-4.3 .3-3.1 2-4.1 3.6-2.7 4.5-.9 3 .6 3.8 2.5 1.8 2.5z"/>
    <path fill="#111" stroke-width="5" d="M251 114l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
  </g>
</svg>
`,re=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(-18 -45)">
      <path stroke-width="14" d="M 612 296 C 520 262 428 318 430 432 C 432 540 480 618 560 620 C 612 622 648 540 648 448 C 648 380 634 330 612 296 Z"/>
      <path stroke-width="10" d="M 598 336 C 530 316 472 356 472 436 C 472 520 510 578 562 578 C 598 578 614 520 614 448 C 614 398 606 362 598 336 Z"/>
      <circle cx="728" cy="392" r="42" stroke-width="12"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 707 396 A 25 25 0 1 0 757 396 A 25 25 0 1 0 707 396 Z M 732 386 A 9 9 0 1 0 750 386 A 9 9 0 1 0 732 386 Z"/>
      <circle cx="782" cy="466" r="18" stroke-width="10"/>
      <path stroke-width="11" d="M 700 500 Q 728 538 764 518"/>
      <path stroke-width="14" d="M 621.9 572.4 A 168.0 168.0 0 0 0 795.4 516.0 M 832.0 391.3 A 168.0 168.0 0 0 0 551.3 286.3"/>
      <path stroke-width="14" d="M 831.9 391.3 L 840.0 392.0 C 886.0 392.0 900.0 352.0 894.0 300.0 A 26.1 26.1 0 0 1 946.0 296.0 C 958.0 420.0 890.0 522.0 800.0 522.0 L 795.3 515.9"/>
      <path stroke-width="14" d="M 441.3 365.6 A 272.0 200.0 0 0 0 148.0 565.0 A 272.0 200.0 0 0 0 691.6 575.9"/>
      <path stroke-width="14" d="M 195.0 677.3 L 195.0 854.0 C 195.0 863.3 199.7 868.0 209.0 868.0 L 291.0 868.0 C 300.3 868.0 305.0 863.3 305.0 854.0 L 305.0 746.2"/>
      <path stroke-width="14" d="M 330.0 753.7 L 330.0 838.0 C 330.0 847.3 334.7 852.0 344.0 852.0 L 398.0 852.0 C 407.3 852.0 412.0 847.3 412.0 838.0 L 412.0 764.9"/>
      <path stroke-width="14" d="M 470.0 761.6 L 470.0 838.0 C 470.0 847.3 474.7 852.0 484.0 852.0 L 536.0 852.0 C 545.3 852.0 550.0 847.3 550.0 838.0 L 550.0 740.6"/>
      <path stroke-width="14" d="M 565.0 734.2 L 565.0 854.0 C 565.0 863.3 569.7 868.0 579.0 868.0 L 661.0 868.0 C 670.3 868.0 675.0 863.3 675.0 854.0 L 675.0 634.6"/>
      <path stroke-width="10" d="M 206 868 V 846 A 13 13 0 0 1 232 846 V 868 M 237 868 V 846 A 13 13 0 0 1 263 846 V 868 M 268 868 V 846 A 13 13 0 0 1 294 846 V 868"/>
      <path stroke-width="10" d="M 576 868 V 846 A 13 13 0 0 1 602 846 V 868 M 607 868 V 846 A 13 13 0 0 1 633 846 V 868 M 638 868 V 846 A 13 13 0 0 1 664 846 V 868"/>
      <path stroke-width="12" d="M 166.3 491.6 C 118 498 104 540 112 585"/>
      <path stroke-width="12" d="M 112 585 C 88 600 90 634 108 646 C 126 634 136 604 112 585 Z"/>
    </g>
  </g>
</svg>
`,ie=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="10" d="M 710.8 697.8 C 723.4 648.0 704.0 597.0 662.0 560.0 C 652.0 552.0 640.0 560.0 646.0 572.0 C 675.5 611.4 683.8 662.4 668.7 721.3"/>
    <path stroke-width="10" d="M 661.3 760.5 A 54 42 -20 1 0 762.7 723.5 A 54 42 -20 1 0 661.3 760.5 Z"/>
    <path stroke-width="10" d="M 202 800 A 54 40 0 1 0 310 800 A 54 40 0 1 0 202 800 Z"/>
    <path stroke-width="7" d="M 236 812 L 236 838 M 262 816 L 262 840 M 288 812 L 288 836"/>
    <path stroke-width="10" d="M 326.2 867.4 A 66 40 4 1 0 457.8 876.6 A 66 40 4 1 0 326.2 867.4 Z"/>
    <path stroke-width="8" d="M 366.3 832.6 A 15.0 15.0 0 0 0 367.0 828.0 A 15.0 15.0 0 0 0 337.0 828.0 A 15.0 15.0 0 0 0 344.4 840.9"/>
    <path stroke-width="8" d="M 396.4 830.8 A 15.0 15.0 0 0 0 401.0 820.0 A 15.0 15.0 0 0 0 371.0 820.0 A 15.0 15.0 0 0 0 375.9 831.1"/>
    <path stroke-width="8" d="M 426.0 837.8 A 15.0 15.0 0 0 0 435.0 824.0 A 15.0 15.0 0 0 0 405.0 824.0 A 15.0 15.0 0 0 0 407.5 832.4"/>
    <path stroke-width="10" d="M 542.2 876.6 A 66 40 -4 1 0 673.8 867.4 A 66 40 -4 1 0 542.2 876.6 Z"/>
    <path stroke-width="8" d="M 655.6 840.9 A 15.0 15.0 0 0 0 663.0 828.0 A 15.0 15.0 0 0 0 633.0 828.0 A 15.0 15.0 0 0 0 633.7 832.6"/>
    <path stroke-width="8" d="M 624.1 831.1 A 15.0 15.0 0 0 0 629.0 820.0 A 15.0 15.0 0 0 0 599.0 820.0 A 15.0 15.0 0 0 0 603.6 830.8"/>
    <path stroke-width="8" d="M 592.5 832.4 A 15.0 15.0 0 0 0 595.0 824.0 A 15.0 15.0 0 0 0 565.0 824.0 A 15.0 15.0 0 0 0 574.0 837.8"/>
    <path stroke-width="10" d="M 296.2 826.7 A 112.0 72.0 12 0 0 328.9 856.4 M 458.0 873.7 A 112.0 72.0 12 0 0 504.6 829.3 A 112.0 72.0 12 0 0 290.5 769.2"/>
    <path stroke-width="10" d="M 500.0 841.8 A 112.0 72.0 -12 0 0 542.0 873.7 M 671.1 856.4 A 112.0 72.0 -12 0 0 715.2 785.9 M 660.7 736.1 A 112.0 72.0 -12 0 0 500.0 795.9"/>
    <path stroke-width="10" d="M 500 196 C 580 196 642 268 642 356 C 642 440 584 482 500 482 C 416 482 358 440 358 356 C 358 268 420 196 500 196 Z"/>
    <path stroke-width="10" d="M 358.5 342.0 A 30.0 30.0 0 0 0 330.0 372.0 A 30.0 30.0 0 0 0 364.8 401.6"/>
    <path stroke-width="10" d="M 635.2 401.6 A 30.0 30.0 0 0 0 670.0 372.0 A 30.0 30.0 0 0 0 641.5 342.0"/>
    <path stroke-width="8" d="M 500 300 C 470 282 408 284 404 330 C 401 360 414 376 420 386 C 394 412 400 470 500 472 C 600 470 606 412 580 386 C 586 376 599 360 596 330 C 592 284 530 282 500 300 Z"/>
    <circle cx="456" cy="338" r="27" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 443 341 A 15 15 0 1 0 473 341 A 15 15 0 1 0 443 341 Z M 455 336 A 7 7 0 1 0 469 336 A 7 7 0 1 0 455 336 Z"/>
    <circle cx="544" cy="338" r="27" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 527 341 A 15 15 0 1 0 557 341 A 15 15 0 1 0 527 341 Z M 539 336 A 7 7 0 1 0 553 336 A 7 7 0 1 0 539 336 Z"/>
    <path stroke-width="8" d="M 500 382 C 480 366 452 370 454 394 C 456 414 482 420 500 412 C 518 420 544 414 546 394 C 548 370 520 366 500 382 Z"/>
    <circle cx="487.0" cy="400.0" r="7" fill="#111" stroke="none"/>
    <circle cx="513.0" cy="400.0" r="7" fill="#111" stroke="none"/>
    <path stroke-width="8" d="M 440 434 C 466 466 534 466 560 434"/>
    <path stroke-width="10" d="M 384.9 438.0 C 330.1 447.0 278.3 470.8 254.0 524.0 C 228.8 583.4 218.2 678.4 220.7 769.7 M 286.4 833.0 L 300.0 840.0 C 302.8 840.3 305.7 840.7 308.6 841.0 M 495.3 849.0 C 498.4 849.0 501.6 849.0 504.7 849.0 M 691.4 841.0 C 694.3 840.7 697.2 840.3 700.0 840.0 L 701.2 830.2 M 750.1 706.2 C 784.6 656.9 785.8 584.4 764.0 530.0 C 739.7 475.4 677.2 449.5 613.9 439.4"/>
    <path stroke-width="9" d="M 382.0 470.0 C 349.7 540.0 328.6 637.5 307.3 750.8"/>
    <path stroke-width="9" d="M 618.0 470.0 C 630.8 497.6 641.8 527.0 651.3 557.0 M 666.1 608.7 C 669.2 620.4 672.0 632.2 674.7 643.8"/>
    <path stroke-width="7" d="M 500.0 546.0 C 470.0 518.0 408.0 518.0 404.0 566.0 C 400.0 626.0 452.0 690.0 500.0 704.0 C 548.0 690.0 600.0 626.0 596.0 566.0 C 592.0 518.0 530.0 518.0 500.0 546.0 Z"/>
    <path stroke-width="10" d="M -10.0 770.0 C 68.1 762.6 144.7 762.0 220.5 763.5 M 757.8 759.3 C 861.7 759.6 933.5 767.6 1010.0 762.0"/>
    <path stroke-width="10" d="M 173.3 637.9 C 155.8 575.6 112.2 513.3 60.0 470.0 C 38.2 583.6 70.7 724.0 165.0 762.9"/>
    <path stroke-width="7" d="M 138.8 689.7 C 123.0 634.7 103.7 581.0 81.0 528.6"/>
    <path stroke-width="10" d="M 262.8 507.8 C 189.2 578.7 136.3 683.7 165.0 762.9 C 185.9 755.0 204.5 741.5 220.5 724.1"/>
    <path stroke-width="7" d="M 197.5 692.2 C 207.8 672.8 217.7 653.2 227.2 633.3"/>
    <path stroke-width="10" d="M 835.0 760.7 C 929.3 720.9 961.8 579.3 940.0 465.0 C 896.8 501.3 859.5 550.7 838.0 602.3"/>
    <path stroke-width="7" d="M 861.2 686.8 C 884.0 633.8 903.3 579.6 919.0 524.1"/>
    <path stroke-width="10" d="M 768.7 669.0 C 784.4 707.9 806.4 740.5 835.0 760.7 C 877.9 669.2 822.5 516.2 745.0 420.0 C 741.2 443.5 739.1 468.5 738.8 493.9"/>
    <path stroke-width="7" d="M 812.5 675.5 C 799.1 612.2 782.6 549.8 763.0 488.1"/>
    <path stroke-width="7" d="M 88.75 900 A 21.25 21.25 0 1 0 131.25 900 A 21.25 21.25 0 1 0 88.75 900 Z"/>
    <path stroke-width="7" d="M 115.2 879.4 A 25.5 13.6 -90 0 0 110.0 830.3 A 25.5 13.6 -90 0 0 104.8 879.4"/>
    <path stroke-width="7" d="M 131.2 898.6 A 25.6 13.6 -18 0 0 176.3 878.4 A 25.6 13.6 -18 0 0 127.9 888.6"/>
    <path stroke-width="7" d="M 117.6 919.8 A 25.5 13.6 54 0 0 151.0 956.4 A 25.5 13.6 54 0 0 126.5 913.4"/>
    <path stroke-width="7" d="M 93.5 913.4 A 25.5 13.6 126 0 0 69.0 956.4 A 25.5 13.6 126 0 0 102.4 919.8"/>
    <path stroke-width="7" d="M 92.1 888.6 A 25.6 13.6 198 0 0 43.7 878.4 A 25.6 13.6 198 0 0 88.8 898.6"/>
    <path stroke-width="7" d="M 868.75 905 A 21.25 21.25 0 1 0 911.25 905 A 21.25 21.25 0 1 0 868.75 905 Z"/>
    <path stroke-width="7" d="M 895.2 884.4 A 25.5 13.6 -90 0 0 890.0 835.3 A 25.5 13.6 -90 0 0 884.8 884.4"/>
    <path stroke-width="7" d="M 911.2 903.6 A 25.6 13.6 -18 0 0 956.3 883.4 A 25.6 13.6 -18 0 0 907.9 893.6"/>
    <path stroke-width="7" d="M 897.6 924.8 A 25.5 13.6 54 0 0 931.0 961.4 A 25.5 13.6 54 0 0 906.5 918.4"/>
    <path stroke-width="7" d="M 873.5 918.4 A 25.5 13.6 126 0 0 849.0 961.4 A 25.5 13.6 126 0 0 882.4 924.8"/>
    <path stroke-width="7" d="M 872.1 893.6 A 25.6 13.6 198 0 0 823.7 883.4 A 25.6 13.6 198 0 0 868.8 903.6"/>
    <path stroke-width="10" d="M 80 130 A 50 50 0 1 0 180 130 A 50 50 0 1 0 80 130 Z"/>
    <path stroke-width="8" d="M 194.0 130.0 L 220.0 130.0 M 175.3 175.3 L 193.6 193.6 M 130.0 194.0 L 130.0 220.0 M 84.7 175.3 L 66.4 193.6 M 66.0 130.0 L 40.0 130.0 M 84.7 84.7 L 66.4 66.4 M 130.0 66.0 L 130.0 40.0 M 175.3 84.7 L 193.6 66.4"/>
    <path stroke-width="10" d="M 739.2 184.0 C 701.0 184.0 701.0 137.2 739.2 139.8 C 739.2 103.2 790.2 99.0 798.8 120.2 C 811.5 82.0 875.2 86.2 875.2 128.8 C 913.5 120.2 934.8 184.0 896.5 184.0 Z"/>
  </g>
</svg>
`,ae=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="5" d="M 460.0 905.0 A 18.0 18.0 0 0 0 496.0 905.0 A 18.0 18.0 0 0 0 460.0 905.0 Z"/>
    <path stroke-width="5" d="M 482.4 887.6 A 21.6 11.5 -90 0 0 478.0 846.0 A 21.6 11.5 -90 0 0 473.6 887.6"/>
    <path stroke-width="5" d="M 496.0 904.2 A 21.6 11.5 -18 0 0 534.1 886.7 A 21.6 11.5 -18 0 0 493.0 895.0"/>
    <path stroke-width="5" d="M 484.7 921.7 A 21.6 11.5 54 0 0 512.7 952.8 A 21.6 11.5 54 0 0 491.8 916.5"/>
    <path stroke-width="5" d="M 464.2 916.5 A 21.6 11.5 126 0 0 443.3 952.8 A 21.6 11.5 126 0 0 471.3 921.7"/>
    <path stroke-width="5" d="M 463.0 895.0 A 21.6 11.5 198 0 0 421.9 886.7 A 21.6 11.5 198 0 0 460.0 904.2"/>
    <path stroke-width="5" d="M 46.2 560.0 A 13.8 13.8 0 0 0 73.8 560.0 A 13.8 13.8 0 0 0 46.2 560.0 Z"/>
    <path stroke-width="5" d="M 63.3 546.7 A 16.5 8.8 -90 0 0 60.0 514.9 A 16.5 8.8 -90 0 0 56.7 546.7"/>
    <path stroke-width="5" d="M 73.7 559.1 A 16.5 8.8 -18 0 0 102.9 546.1 A 16.5 8.8 -18 0 0 71.7 552.7"/>
    <path stroke-width="5" d="M 64.7 572.9 A 16.5 8.8 54 0 0 86.5 596.4 A 16.5 8.8 54 0 0 70.9 568.4"/>
    <path stroke-width="5" d="M 49.1 568.4 A 16.5 8.8 126 0 0 33.5 596.4 A 16.5 8.8 126 0 0 55.3 572.9"/>
    <path stroke-width="5" d="M 48.3 552.7 A 16.5 8.8 198 0 0 17.1 546.1 A 16.5 8.8 198 0 0 46.3 559.1"/>
    <path stroke-width="5" d="M 926.2 552.0 A 13.8 13.8 0 0 0 953.8 552.0 A 13.8 13.8 0 0 0 926.2 552.0 Z"/>
    <path stroke-width="5" d="M 943.3 538.7 A 16.5 8.8 -90 0 0 940.0 506.9 A 16.5 8.8 -90 0 0 936.7 538.7"/>
    <path stroke-width="5" d="M 953.7 551.1 A 16.5 8.8 -18 0 0 982.9 538.1 A 16.5 8.8 -18 0 0 951.7 544.7"/>
    <path stroke-width="5" d="M 944.7 564.9 A 16.5 8.8 54 0 0 966.5 588.4 A 16.5 8.8 54 0 0 950.9 560.4"/>
    <path stroke-width="5" d="M 929.1 560.4 A 16.5 8.8 126 0 0 913.5 588.4 A 16.5 8.8 126 0 0 935.3 564.9"/>
    <path stroke-width="5" d="M 928.3 544.7 A 16.5 8.8 198 0 0 897.1 538.1 A 16.5 8.8 198 0 0 926.3 551.1"/>
    <path stroke-width="5" d="M 215.5 410.0 A 12.5 12.5 0 0 0 240.5 410.0 A 12.5 12.5 0 0 0 215.5 410.0 Z"/>
    <path stroke-width="5" d="M 231.0 397.9 A 15.0 8.0 -90 0 0 228.0 369.0 A 15.0 8.0 -90 0 0 225.0 397.9"/>
    <path stroke-width="5" d="M 240.5 409.2 A 15.0 8.0 -18 0 0 267.0 397.4 A 15.0 8.0 -18 0 0 238.6 403.3"/>
    <path stroke-width="5" d="M 232.3 421.7 A 15.0 8.0 54 0 0 252.1 443.1 A 15.0 8.0 54 0 0 237.9 417.6"/>
    <path stroke-width="5" d="M 218.1 417.6 A 15.0 8.0 126 0 0 203.9 443.1 A 15.0 8.0 126 0 0 223.7 421.7"/>
    <path stroke-width="5" d="M 217.4 403.3 A 15.0 8.0 198 0 0 189.0 397.4 A 15.0 8.0 198 0 0 215.5 409.2"/>
    <path stroke-width="5" d="M 759.5 410.0 A 12.5 12.5 0 0 0 784.5 410.0 A 12.5 12.5 0 0 0 759.5 410.0 Z"/>
    <path stroke-width="5" d="M 775.0 397.9 A 15.0 8.0 -90 0 0 772.0 369.0 A 15.0 8.0 -90 0 0 769.0 397.9"/>
    <path stroke-width="5" d="M 784.5 409.2 A 15.0 8.0 -18 0 0 811.0 397.4 A 15.0 8.0 -18 0 0 782.6 403.3"/>
    <path stroke-width="5" d="M 776.3 421.7 A 15.0 8.0 54 0 0 796.1 443.1 A 15.0 8.0 54 0 0 781.9 417.6"/>
    <path stroke-width="5" d="M 762.1 417.6 A 15.0 8.0 126 0 0 747.9 443.1 A 15.0 8.0 126 0 0 767.7 421.7"/>
    <path stroke-width="5" d="M 761.4 403.3 A 15.0 8.0 198 0 0 733.0 397.4 A 15.0 8.0 198 0 0 759.5 409.2"/>
    <path stroke-width="5" d="M 398.0 975.0 L 390.0 958.0 M 410.0 975.0 L 410.0 953.0 M 422.0 975.0 L 430.0 958.0"/>
    <path stroke-width="5" d="M 536.0 968.0 L 528.0 952.0 M 548.0 968.0 L 548.0 946.0 M 560.0 968.0 L 568.0 952.0"/>
    <path stroke-width="5" d="M 203.0 985.0 L 195.0 968.0 M 215.0 985.0 L 215.0 963.0 M 227.0 985.0 L 235.0 968.0"/>
    <path stroke-width="7" d="M -30.0 -20.0 C -39.6 -16.6 -46.4 2.1 -51.4 12.3 C -56.4 22.5 -58.0 31.8 -60.0 41.3 C -62.0 50.7 -63.0 59.9 -63.4 69.0 C -63.9 78.0 -63.5 86.8 -62.6 95.5 C -61.7 104.1 -60.2 112.6 -58.1 120.8 C -56.1 129.0 -53.4 137.0 -50.3 144.7 C -47.1 152.5 -43.5 160.0 -39.4 167.2 C -35.3 174.5 -30.7 181.5 -25.7 188.2 C -20.8 195.0 -15.3 201.4 -9.6 207.7 C -3.9 213.9 2.2 219.8 8.6 225.5 C 15.0 231.2 21.8 236.7 28.8 241.8 C 35.8 247.0 43.0 251.9 50.5 256.6 C 58.0 261.3 65.7 265.7 73.6 269.8 C 81.4 274.0 89.5 278.0 97.8 281.6 C 106.0 285.3 114.3 288.9 123.0 291.9 C 131.7 295.0 146.0 303.3 150.0 300.0 C 154.0 296.7 148.1 281.2 147.0 272.3 C 145.9 263.3 144.5 254.8 143.2 246.2 C 142.0 237.7 140.7 229.3 139.4 221.1 C 138.1 212.9 136.9 204.8 135.5 196.9 C 134.1 189.0 132.7 181.2 131.2 173.6 C 129.7 166.0 128.1 158.6 126.4 151.3 C 124.6 144.1 122.7 137.0 120.6 130.1 C 118.5 123.1 116.3 116.4 113.7 109.8 C 111.2 103.2 108.4 96.8 105.4 90.5 C 102.3 84.2 99.0 78.1 95.3 72.2 C 91.6 66.2 87.6 60.4 83.1 54.7 C 78.7 49.0 73.9 43.5 68.6 38.0 C 63.3 32.6 57.7 27.2 51.4 22.0 C 45.2 16.8 38.5 11.6 31.0 6.6 C 23.5 1.6 16.6 -3.7 6.4 -8.1 C -3.8 -12.5 -20.4 -23.4 -30.0 -20.0 Z"/>
    <path stroke-width="5" d="M -30.0 -20.0 C 8.7 98.7 68.7 205.3 150.0 300.0"/>
    <path stroke-width="5" d="M 30.0 123.2 C 14.2 135.5 -1.4 160.9 -16.8 199.5"/>
    <path stroke-width="5" d="M 30.0 123.2 C 49.3 117.2 79.3 119.0 120.2 128.7"/>
    <path stroke-width="5" d="M 74.4 199.3 C 63.5 209.6 53.3 227.3 44.1 252.5"/>
    <path stroke-width="5" d="M 74.4 199.3 C 88.2 193.5 108.4 191.5 134.8 193.1"/>
    <path stroke-width="7" d="M 111.5 104.3 C 116.9 106.2 122.3 107.8 127.7 109.4 C 135.0 111.5 142.4 113.3 150.0 115.0 C 157.5 116.6 165.2 118.1 173.1 119.4 C 180.9 120.7 188.9 121.9 197.1 123.0 C 205.2 124.1 213.5 125.0 221.9 125.9 C 230.3 126.9 238.8 127.7 247.5 128.6 C 256.2 129.4 265.0 130.2 273.9 131.0 C 282.9 131.9 291.9 132.8 301.2 133.5 C 310.6 134.1 327.3 139.1 330.0 135.0 C 332.7 130.9 321.9 117.2 317.4 108.7 C 312.9 100.3 307.9 92.3 302.8 84.5 C 297.8 76.6 292.5 68.8 287.0 61.4 C 281.4 53.9 275.7 46.6 269.8 39.6 C 263.8 32.5 257.6 25.7 251.3 19.2 C 244.9 12.7 238.3 6.5 231.4 0.6 C 224.6 -5.3 217.6 -10.9 210.3 -16.0 C 203.0 -21.2 195.5 -26.0 187.8 -30.4 C 180.1 -34.8 172.2 -38.7 164.1 -42.2 C 156.0 -45.7 147.7 -48.7 139.3 -51.2 C 130.8 -53.7 122.1 -55.7 113.3 -57.1 C 104.5 -58.6 95.5 -59.5 86.4 -59.7 C 77.3 -59.9 68.0 -59.6 58.7 -58.6 C 49.3 -57.5 39.8 -55.9 30.2 -53.3 C 20.6 -50.7 11.1 -48.5 1.1 -42.9 C -9.0 -37.4 -27.8 -29.5 -30.0 -20.0"/>
    <path stroke-width="5" d="M -7.7 -15.0 C 114.0 13.7 226.6 63.7 330.0 135.0"/>
    <path stroke-width="5" d="M 128.8 27.6 C 125.0 46.6 129.9 75.2 143.4 113.5"/>
    <path stroke-width="5" d="M 128.8 27.6 C 138.9 11.2 161.7 -6.2 197.1 -24.8"/>
    <path stroke-width="5" d="M 214.6 66.1 C 210.4 80.0 210.6 99.7 215.0 125.2"/>
    <path stroke-width="5" d="M 214.6 66.1 C 223.4 54.5 239.5 43.0 262.8 31.5"/>
    <path stroke-width="7" d="M 1030.0 -20.0 C 1020.4 -23.4 1003.8 -12.5 993.6 -8.1 C 983.4 -3.7 976.5 1.6 969.0 6.6 C 961.5 11.6 954.8 16.8 948.6 22.0 C 942.3 27.2 936.7 32.6 931.4 38.0 C 926.1 43.5 921.3 49.0 916.9 54.7 C 912.4 60.4 908.4 66.2 904.7 72.2 C 901.0 78.1 897.7 84.2 894.6 90.5 C 891.6 96.8 888.8 103.2 886.3 109.8 C 883.7 116.4 881.5 123.1 879.4 130.1 C 877.3 137.0 875.4 144.1 873.6 151.3 C 871.9 158.6 870.3 166.0 868.8 173.6 C 867.3 181.2 865.9 189.0 864.5 196.9 C 863.1 204.8 861.9 212.9 860.6 221.1 C 859.3 229.3 858.0 237.7 856.8 246.2 C 855.5 254.8 854.1 263.3 853.0 272.3 C 851.9 281.2 846.0 296.7 850.0 300.0 C 854.0 303.3 868.3 295.0 877.0 291.9 C 885.7 288.9 894.0 285.3 902.2 281.6 C 910.5 278.0 918.6 274.0 926.4 269.8 C 934.3 265.7 942.0 261.3 949.5 256.6 C 957.0 251.9 964.2 247.0 971.2 241.8 C 978.2 236.7 985.0 231.2 991.4 225.5 C 997.8 219.8 1003.9 213.9 1009.6 207.7 C 1015.3 201.4 1020.8 195.0 1025.7 188.2 C 1030.7 181.5 1035.3 174.5 1039.4 167.2 C 1043.5 160.0 1047.1 152.5 1050.3 144.7 C 1053.4 137.0 1056.1 129.0 1058.1 120.8 C 1060.2 112.6 1061.7 104.1 1062.6 95.5 C 1063.5 86.8 1063.9 78.0 1063.4 69.0 C 1063.0 59.9 1062.0 50.7 1060.0 41.3 C 1058.0 31.8 1056.4 22.5 1051.4 12.3 C 1046.4 2.1 1039.6 -16.6 1030.0 -20.0 Z"/>
    <path stroke-width="5" d="M 1030.0 -20.0 C 991.3 98.7 931.3 205.3 850.0 300.0"/>
    <path stroke-width="5" d="M 970.0 123.2 C 950.7 117.2 920.7 119.0 879.8 128.7"/>
    <path stroke-width="5" d="M 970.0 123.2 C 985.8 135.5 1001.4 160.9 1016.8 199.5"/>
    <path stroke-width="5" d="M 925.6 199.3 C 911.8 193.5 891.6 191.5 865.2 193.1"/>
    <path stroke-width="5" d="M 925.6 199.3 C 936.5 209.6 946.7 227.3 955.9 252.5"/>
    <path stroke-width="7" d="M 1030.0 -20.0 C 1027.8 -29.5 1009.0 -37.4 998.9 -42.9 C 988.9 -48.5 979.4 -50.7 969.8 -53.3 C 960.2 -55.9 950.7 -57.5 941.3 -58.6 C 932.0 -59.6 922.7 -59.9 913.6 -59.7 C 904.5 -59.5 895.5 -58.6 886.7 -57.1 C 877.9 -55.7 869.2 -53.7 860.7 -51.2 C 852.3 -48.7 844.0 -45.7 835.9 -42.2 C 827.8 -38.7 819.9 -34.8 812.2 -30.4 C 804.5 -26.0 797.0 -21.2 789.7 -16.0 C 782.4 -10.9 775.4 -5.3 768.6 0.6 C 761.7 6.5 755.1 12.7 748.7 19.2 C 742.4 25.7 736.2 32.5 730.2 39.6 C 724.3 46.6 718.6 53.9 713.0 61.4 C 707.5 68.8 702.2 76.6 697.2 84.5 C 692.1 92.3 687.1 100.3 682.6 108.7 C 678.1 117.2 667.3 130.9 670.0 135.0 C 672.7 139.1 689.4 134.1 698.8 133.5 C 708.1 132.8 717.1 131.9 726.1 131.0 C 735.0 130.2 743.8 129.4 752.5 128.6 C 761.2 127.7 769.7 126.9 778.1 125.9 C 786.5 125.0 794.8 124.1 802.9 123.0 C 811.1 121.9 819.1 120.7 826.9 119.4 C 834.8 118.1 842.5 116.6 850.0 115.0 C 857.6 113.3 865.0 111.5 872.3 109.4 C 877.7 107.8 883.1 106.2 888.5 104.3"/>
    <path stroke-width="5" d="M 1007.7 -15.0 C 886.0 13.7 773.4 63.7 670.0 135.0"/>
    <path stroke-width="5" d="M 871.2 27.6 C 861.1 11.2 838.3 -6.2 802.9 -24.8"/>
    <path stroke-width="5" d="M 871.2 27.6 C 875.0 46.6 870.1 75.2 856.6 113.5"/>
    <path stroke-width="5" d="M 785.4 66.1 C 776.6 54.5 760.5 43.0 737.2 31.5"/>
    <path stroke-width="5" d="M 785.4 66.1 C 789.6 80.0 789.4 99.7 785.0 125.2"/>
    <path stroke-width="7" d="M 441.2 665.9 C 452.4 663.5 464.6 667.3 470.0 678.0 C 480.0 654.0 520.0 654.0 530.0 678.0 C 540.0 658.0 574.0 662.0 580.0 686.0 C 600.0 674.0 628.0 690.0 616.0 716.0 C 601.8 725.0 518.5 728.2 455.3 725.6"/>
    <path stroke-width="7" d="M 353.9 783.4 A 206.0 58.0 0 0 0 615.8 792.9 M 652.6 703.5 A 206.0 58.0 0 0 0 617.1 695.3"/>
    <path stroke-width="5" d="M 438.4 766.1 C 448.0 766.7 457.6 768.6 466.0 772.0"/>
    <path stroke-width="5" d="M 540.0 778.0 C 562.0 770.0 590.0 770.0 612.0 778.0"/>
    <path stroke-width="7" d="M 436.4 625.6 L 446.0 300.0 C 470.0 290.0 530.0 290.0 554.0 300.0 L 564.9 668.0"/>
    <path stroke-width="5" d="M 476.0 322.0 C 468.3 416.2 480.9 530.6 473.1 672.5"/>
    <path stroke-width="5" d="M 500.0 320.0 C 505.6 413.2 495.5 523.9 500.6 660.0"/>
    <path stroke-width="5" d="M 526.0 322.0 C 533.8 417.0 520.8 532.6 529.1 676.1"/>
    <path stroke-width="5" d="M 448.0 334.0 C 480.0 322.0 520.0 322.0 552.0 334.0"/>
    <path stroke-width="7" d="M 299.3 704.6 C 288.1 702.2 279.1 699.0 272.1 694.3 C 260.3 686.1 255.0 673.0 254.7 660.0 C 254.4 647.0 258.9 627.0 270.3 616.1 C 281.7 605.1 299.3 597.1 323.1 594.4 C 346.9 591.7 389.9 595.5 413.1 599.7 C 422.3 601.3 430.1 603.1 437.0 605.4"/>
    <path stroke-width="7" d="M 254.8 654.8 C 242.3 652.4 231.0 649.3 224.3 640.3 C 216.8 630.4 213.9 612.5 214.1 596.0 C 214.3 579.5 218.1 554.1 225.4 541.3 C 232.8 528.5 243.8 523.2 258.0 519.0 C 272.3 514.9 296.9 512.4 310.9 516.2 C 324.9 520.0 334.7 528.4 342.1 541.7 C 349.3 554.4 354.8 577.4 355.6 593.8"/>
    <path stroke-width="7" d="M 437.1 600.1 C 434.0 601.1 430.7 601.9 427.1 602.6 M 333.6 529.8 C 334.6 527.8 335.7 526.0 336.8 524.3 C 343.3 514.6 350.6 505.1 364.7 502.0 C 378.8 499.0 406.6 502.3 421.3 505.9 C 428.5 507.6 434.6 509.7 439.7 512.4"/>
    <path stroke-width="7" d="M 265.0 427.7 C 268.4 426.3 272.1 425.2 276.1 424.3 C 289.8 421.1 314.8 420.8 327.8 424.5 C 340.8 428.3 348.2 436.6 354.2 446.8 C 360.2 457.1 364.1 474.4 364.0 486.0 C 363.9 491.9 362.8 497.7 360.9 503.0 M 254.3 520.1 C 253.1 519.0 251.9 517.8 250.8 516.5 C 244.2 509.0 239.7 498.2 238.8 486.0 C 237.9 475.5 238.8 459.1 243.0 448.1"/>
    <path stroke-width="7" d="M 439.8 508.3 C 438.2 508.9 436.4 509.5 434.6 510.0 M 344.5 434.1 C 345.5 432.7 346.5 431.4 347.4 430.2 C 354.7 421.0 361.0 414.3 374.3 410.5 C 387.6 406.7 413.4 404.5 427.2 407.3 C 433.1 408.5 438.2 410.6 442.6 413.4"/>
    <path stroke-width="7" d="M 257.2 381.3 C 259.1 371.7 264.2 360.5 270.1 353.5 C 277.9 344.3 287.8 337.3 303.4 334.5 C 318.9 331.8 347.1 334.1 363.3 337.0 C 379.4 340.0 392.0 343.4 400.2 352.2 C 408.5 361.0 412.6 378.7 412.7 390.0 C 412.7 395.4 411.8 401.0 410.0 406.0 M 344.8 433.8 C 344.6 433.8 344.4 433.8 344.2 433.8 M 281.7 423.2 C 278.8 421.5 276.3 419.5 273.7 417.3 C 272.1 415.9 270.5 414.4 268.9 412.9"/>
    <path stroke-width="7" d="M 444.2 359.9 C 435.1 359.6 424.5 358.2 417.5 356.8 C 410.5 355.4 404.4 354.1 399.6 351.6 M 393.2 346.5 C 388.4 340.6 386.4 330.8 386.8 322.0 C 387.2 312.9 391.1 300.0 396.0 292.3 C 401.0 284.6 406.7 278.2 416.4 275.8 C 426.2 273.5 444.2 275.9 454.5 278.4 C 464.7 281.0 472.8 283.6 477.9 290.9 C 478.4 291.6 478.9 292.5 479.4 293.3"/>
    <path stroke-width="7" d="M 646.7 593.7 C 625.5 594.4 602.0 597.0 586.9 599.7 C 577.7 601.3 569.9 603.1 563.0 605.4"/>
    <path stroke-width="7" d="M 774.4 540.9 C 767.0 528.4 756.0 523.2 742.0 519.0 C 727.7 514.9 703.1 512.4 689.1 516.2 C 680.0 518.7 672.7 523.1 666.7 529.5 M 646.3 577.7 C 645.3 583.4 644.6 588.9 644.4 593.8"/>
    <path stroke-width="7" d="M 562.9 600.1 C 566.0 601.1 569.3 601.9 572.9 602.6 M 666.2 529.4 C 665.3 527.6 664.3 525.9 663.2 524.3 C 656.7 514.6 649.4 505.1 635.3 502.0 C 621.2 499.0 593.4 502.3 578.7 505.9 C 571.5 507.6 565.4 509.7 560.3 512.4"/>
    <path stroke-width="7" d="M 735.0 427.7 C 731.6 426.3 727.9 425.2 723.9 424.3 C 710.2 421.1 685.2 420.8 672.2 424.5 C 659.2 428.3 651.8 436.6 645.8 446.8 C 639.8 457.1 635.9 474.4 636.0 486.0 C 636.1 491.9 637.2 497.7 639.1 503.0 M 745.7 520.1 C 746.9 519.0 748.1 517.8 749.2 516.5 C 755.8 509.0 760.3 498.2 761.2 486.0 C 762.1 475.5 761.2 459.1 757.0 448.1"/>
    <path stroke-width="7" d="M 560.2 508.3 C 561.8 508.9 563.6 509.5 565.4 510.0 M 655.5 434.1 C 654.5 432.7 653.5 431.4 652.6 430.2 C 645.3 421.0 639.0 414.3 625.7 410.5 C 612.4 406.7 586.6 404.5 572.8 407.3 C 566.9 408.5 561.8 410.6 557.4 413.4"/>
    <path stroke-width="7" d="M 742.8 381.3 C 740.9 371.7 735.8 360.5 729.9 353.5 C 722.1 344.3 712.2 337.3 696.6 334.5 C 681.1 331.8 652.9 334.1 636.7 337.0 C 620.6 340.0 608.0 343.4 599.8 352.2 C 591.5 361.0 587.4 378.7 587.3 390.0 C 587.3 395.4 588.2 401.0 590.0 406.0 M 655.2 433.8 C 655.4 433.8 655.6 433.8 655.8 433.8 M 718.3 423.2 C 721.2 421.5 723.7 419.5 726.3 417.3 C 727.9 415.9 729.5 414.4 731.1 412.9"/>
    <path stroke-width="7" d="M 555.8 359.9 C 564.9 359.6 575.5 358.2 582.5 356.8 C 589.5 355.4 595.6 354.1 600.4 351.6 M 606.8 346.5 C 611.6 340.6 613.6 330.8 613.2 322.0 C 612.8 312.9 608.9 300.0 604.0 292.3 C 599.0 284.6 593.3 278.2 583.6 275.8 C 573.8 273.5 555.8 275.9 545.5 278.4 C 535.3 281.0 527.2 283.6 522.1 290.9 C 521.6 291.6 521.1 292.5 520.6 293.3"/>
    <path stroke-width="7" d="M 211.0 124.7 C 235.6 205.1 215.3 285.6 224.1 369.2"/>
    <path stroke-width="7" d="M 222.7 190.9 C 198.6 181.4 183.2 201.5 181.9 226.3 C 206.7 228.4 228.7 216.0 222.7 190.9 Z"/>
    <path stroke-width="5" d="M 212.5 199.7 C 206.2 203.7 200.6 208.6 195.8 214.3"/>
    <path stroke-width="7" d="M 223.1 259.9 C 217.7 285.0 239.6 295.9 263.7 292.4 C 261.9 268.0 246.4 249.1 223.1 259.9 Z"/>
    <path stroke-width="5" d="M 233.3 268.0 C 238.1 273.3 243.6 277.8 249.9 281.3"/>
    <path stroke-width="7" d="M 221.9 334.5 C 199.9 324.3 184.8 342.3 182.7 365.4 C 205.6 368.7 226.7 358.2 221.9 334.5 Z"/>
    <path stroke-width="5" d="M 212.1 342.2 C 206.1 345.6 200.7 349.8 196.0 354.9"/>
    <path stroke-width="7" d="M 789.0 124.7 C 764.4 205.1 784.7 285.6 775.9 369.2"/>
    <path stroke-width="7" d="M 777.3 190.9 C 771.3 216.0 793.3 228.4 818.1 226.3 C 816.8 201.5 801.4 181.4 777.3 190.9 Z"/>
    <path stroke-width="5" d="M 787.5 199.7 C 792.4 205.4 797.9 210.3 804.2 214.3"/>
    <path stroke-width="7" d="M 776.9 259.9 C 753.6 249.1 738.1 268.0 736.3 292.4 C 760.4 295.9 782.3 285.0 776.9 259.9 Z"/>
    <path stroke-width="5" d="M 766.7 268.0 C 760.4 271.5 754.9 276.0 750.1 281.3"/>
    <path stroke-width="7" d="M 778.1 334.5 C 773.3 358.2 794.4 368.7 817.3 365.4 C 815.2 342.3 800.1 324.3 778.1 334.5 Z"/>
    <path stroke-width="5" d="M 787.9 342.2 C 792.6 347.3 797.9 351.5 804.0 354.9"/>
    <path stroke-width="7" d="M -10.0 652.0 C 67.7 641.6 152.8 649.2 227.3 643.7"/>
    <path stroke-width="7" d="M 831.7 636.8 C 891.5 637.9 950.8 642.6 1010.0 636.0"/>
    <path stroke-width="7" d="M 80.9 500.4 C 64.0 477.3 42.9 456.4 20.0 440.0 C 15.8 470.4 17.0 503.1 23.6 533.4 M 53.0 604.6 C 67.5 625.5 86.5 641.5 110.0 649.2"/>
    <path stroke-width="5" d="M 54.3 515.3 C 49.1 504.0 43.7 492.9 38.0 481.8"/>
    <path stroke-width="7" d="M 80.8 600.0 C 86.4 618.8 96.0 635.6 110.0 649.2 C 171.5 599.1 163.0 488.5 120.0 410.0 C 98.8 442.0 83.4 480.5 77.3 518.4"/>
    <path stroke-width="5" d="M 112.5 589.4 C 117.2 545.7 119.1 501.8 118.0 457.8"/>
    <path stroke-width="7" d="M 110.0 649.2 C 182.7 635.1 220.0 541.9 215.0 460.0 C 191.9 472.5 170.2 489.2 152.1 508.5"/>
    <path stroke-width="5" d="M 150.0 580.0 C 166.2 553.4 180.8 526.0 194.0 497.8"/>
    <path stroke-width="7" d="M 890.0 641.3 C 914.6 634.1 934.2 617.8 949.0 596.2 M 977.2 526.5 C 983.0 498.3 983.9 468.3 980.0 440.0 C 957.1 455.4 936.0 475.3 919.1 497.4"/>
    <path stroke-width="5" d="M 951.2 508.3 C 954.9 499.0 958.6 489.7 962.0 480.3"/>
    <path stroke-width="7" d="M 922.0 510.7 C 915.5 475.4 900.4 439.8 880.0 410.0 C 837.0 486.0 828.5 593.0 890.0 641.3 C 904.4 627.8 914.0 611.0 919.6 592.2"/>
    <path stroke-width="5" d="M 887.5 583.5 C 888.6 541.0 886.7 498.6 882.0 456.3"/>
    <path stroke-width="7" d="M 847.8 505.6 C 829.8 487.3 808.0 471.5 785.0 460.0 C 783.7 483.2 785.9 507.2 791.4 529.9 M 811.1 580.8 C 828.9 612.4 855.5 635.8 890.0 641.3"/>
    <path stroke-width="5" d="M 848.3 565.7 C 835.4 541.9 821.3 518.7 806.0 496.3"/>
    <path stroke-width="7" d="M 456.0 140.0 A 44.0 44.0 0 0 0 544.0 140.0 A 44.0 44.0 0 0 0 456.0 140.0 Z"/>
    <path stroke-width="5" d="M 556.0 140.0 L 578.0 140.0 M 539.6 179.6 L 555.2 195.2 M 500.0 196.0 L 500.0 218.0 M 460.4 179.6 L 444.8 195.2 M 444.0 140.0 L 422.0 140.0 M 460.4 100.4 L 444.8 84.8 M 500.0 84.0 L 500.0 62.0 M 539.6 100.4 L 555.2 84.8"/>
    <path stroke-width="7" d="M 322.5 256.0 C 300.0 256.0 300.0 228.5 322.5 230.0 C 322.5 208.5 352.5 206.0 357.5 218.5 C 365.0 196.0 402.5 198.5 402.5 223.5 C 425.0 218.5 437.5 256.0 415.0 256.0 L 322.5 256.0 Z"/>
    <path stroke-width="7" d="M 582.5 248.0 C 560.0 248.0 560.0 220.5 582.5 222.0 C 582.5 200.5 612.5 198.0 617.5 210.5 C 625.0 188.0 662.5 190.5 662.5 215.5 C 685.0 210.5 697.5 248.0 675.0 248.0 L 582.5 248.0 Z"/>
    <g transform="translate(-28.2 485.2) scale(0.56)">
      <path stroke-width="12.499999999999998" d="M 722.0 270.0 C 798.0 270.0 850.0 316.0 850.8 380.0 C 862.0 396.0 872.0 408.0 878.8 424.0 Q 864.0 426.0 857.2 435.2 C 866.0 448.0 873.2 464.0 874.0 478.0 Q 858.0 478.0 846.8 484.8 C 826.0 520.0 778.0 534.0 722.0 534.0 C 666.0 534.0 618.0 520.0 597.2 484.8 Q 586.0 478.0 570.0 478.0 C 570.8 464.0 578.0 448.0 586.8 435.2 Q 580.0 426.0 565.2 424.0 C 572.0 408.0 582.0 396.0 593.2 380.0 C 594.0 316.0 646.0 270.0 722.0 270.0 Z"/>
      <path stroke-width="12.499999999999998" d="M 665.7 279.7 A 40.0 40.0 0 0 0 586.8 288.8 A 40.0 40.0 0 0 0 609.0 324.6"/>
      <path stroke-width="12.499999999999998" d="M 835.0 324.6 A 40.0 40.0 0 0 0 857.2 288.8 A 40.0 40.0 0 0 0 778.3 279.7"/>
      <path stroke-width="8.928571428571427" d="M 701.1 271.2 C 705.6 301.1 714.1 318.9 722.0 329.6 C 729.9 318.9 738.4 301.1 742.9 271.2"/>
      <path stroke-width="8.928571428571427" d="M 664.2 280.3 C 674.1 301.8 686.8 312.4 701.2 317.6 C 699.2 300.9 696.6 285.8 695.4 272.0"/>
      <path stroke-width="8.928571428571427" d="M 779.8 280.3 C 769.9 301.8 757.2 312.4 742.8 317.6 C 744.8 300.9 747.4 285.8 748.6 272.0"/>
      <path stroke-width="8.928571428571427" d="M 868.6 405.3 C 848.5 412.9 830.0 422.8 814.0 434.0 C 829.6 437.9 845.1 439.3 860.2 439.7"/>
      <path stroke-width="8.928571428571427" d="M 575.4 405.3 C 595.5 412.9 614.0 422.8 630.0 434.0 C 614.4 437.9 598.9 439.3 583.8 439.7"/>
      <circle cx="666.8" cy="384.0" r="27.2" stroke-width="9.928571428571427"/>
      <circle cx="667.0" cy="384.2" r="16.0" fill="#111" stroke="none"/>
      <circle cx="777.2" cy="384.0" r="27.2" stroke-width="9.928571428571427"/>
      <circle cx="777.0" cy="384.2" r="16.0" fill="#111" stroke="none"/>
      <path stroke-width="9.928571428571427" d="M 722.0 453.7 A 28.0 22.0 0 1 0 722.0 478.3 A 28.0 22.0 0 1 0 722.0 453.7 Z"/>
      <path stroke-width="9.928571428571427" fill="#111" d="M 701.2 432.0 C 701.2 422.4 742.8 422.4 742.8 432.0 C 742.8 440.8 730.8 448.8 722.0 454.0 C 713.2 448.8 701.2 440.8 701.2 432.0 Z"/>
      <path stroke-width="9.928571428571427" d="M 679.0 481.6 C 682.8 527.2 761.2 527.2 765.0 481.6"/>
      <circle cx="694.0" cy="464.0" r="6.249999999999999" fill="#111" stroke="none"/>
      <circle cx="683.6" cy="468.8" r="6.249999999999999" fill="#111" stroke="none"/>
      <circle cx="697.2" cy="474.4" r="6.249999999999999" fill="#111" stroke="none"/>
      <circle cx="750.0" cy="464.0" r="6.249999999999999" fill="#111" stroke="none"/>
      <circle cx="760.4" cy="468.8" r="6.249999999999999" fill="#111" stroke="none"/>
      <circle cx="746.8" cy="474.4" r="6.249999999999999" fill="#111" stroke="none"/>
      <path stroke-width="12.499999999999998" d="M 603.2 652.8 L 631.0 796.0 C 631.0 820.0 639.0 826.0 657.0 826.0 L 709.0 826.0 C 729.0 826.0 729.0 792.0 705.0 788.0 L 669.1 610.2"/>
      <path stroke-width="12.499999999999998" d="M 228.0 610.0 C 222.0 545.0 280.0 505.0 335.0 512.0 C 395.0 520.0 418.0 578.0 395.0 632.0 L 376.0 770.0 C 374.0 790.0 384.0 800.0 398.0 802.0 C 420.0 806.0 420.0 826.0 398.0 826.0 L 300.0 826.0 C 278.0 826.0 272.0 810.0 280.0 795.0 L 292.0 712.0 C 252.0 690.0 232.0 655.0 228.0 610.0 Z"/>
      <path stroke-width="12.499999999999998" d="M 573.6 460.9 A 240.0 118.0 0 0 0 210.0 562.0 A 240.0 118.0 0 0 0 227.7 606.5 M 388.9 676.1 A 240.0 118.0 0 0 0 603.3 652.8 M 669.1 610.2 A 240.0 118.0 0 0 0 690.0 562.0 A 240.0 118.0 0 0 0 681.7 531.2"/>
      <path stroke-width="12.499999999999998" d="M 511.0 676.1 L 511.0 780.0 C 511.0 804.0 519.0 810.0 537.0 810.0 L 573.0 810.0 C 581.0 810.0 581.0 776.0 569.0 772.0 L 569.0 664.5"/>
      <path stroke-width="12.499999999999998" d="M 418.4 679.0 L 421.0 780.0 C 421.0 804.0 429.0 810.0 447.0 810.0 L 483.0 810.0 C 491.0 810.0 491.0 776.0 479.0 772.0 L 476.5 679.3"/>
      <path stroke-width="12.499999999999998" d="M 236.7 507.9 C 236.7 504.3 236.4 501.2 235.6 499.3 C 232.4 491.7 217.5 497.2 209.2 495.2 C 200.9 493.2 193.2 490.6 185.8 487.3 C 178.4 484.0 171.2 479.9 164.8 475.2 C 158.4 470.5 152.4 465.0 147.4 459.0 C 142.3 453.0 137.9 446.3 134.5 439.3 C 131.2 432.2 128.7 424.5 127.1 416.7 C 125.6 409.0 125.1 400.7 125.5 392.8 C 125.8 384.9 127.0 376.7 129.3 369.4 C 131.6 362.0 135.0 354.7 139.3 348.6 C 143.5 342.5 149.0 336.8 154.8 332.9 C 160.6 328.9 166.9 325.7 174.1 324.8 C 181.3 324.0 192.1 327.9 198.0 327.9 C 204.0 327.8 206.9 326.9 209.8 324.6 C 212.8 322.3 215.4 317.7 215.9 314.0 C 216.3 310.2 214.9 305.1 212.6 302.2 C 210.3 299.2 209.1 297.8 202.0 296.1 C 194.9 294.5 180.9 290.9 170.1 292.2 C 159.2 293.6 146.4 298.5 136.6 304.5 C 126.9 310.5 118.3 319.3 111.5 328.2 C 104.7 337.1 99.5 347.7 95.8 358.1 C 92.2 368.4 90.2 379.6 89.4 390.5 C 88.5 401.3 88.9 412.5 90.7 423.3 C 92.5 434.0 95.7 445.0 100.1 455.0 C 104.6 465.0 110.6 474.8 117.3 483.4 C 124.1 492.0 132.3 499.9 140.8 506.6 C 149.4 513.3 158.9 519.0 168.6 523.7 C 178.2 528.5 188.8 532.2 198.7 535.0 C 203.4 536.3 208.8 538.9 214.0 540.8"/>
      <path stroke-width="8.928571428571427" d="M 264.1 487.4 C 269.5 499.6 275.6 510.2 281.6 519.8 M 295.6 514.8 C 294.7 502.4 294.0 488.5 292.9 472.8"/>
      <path stroke-width="8.928571428571427" d="M 333.4 458.9 C 339.6 482.7 348.8 501.5 357.1 517.8 M 368.1 523.3 C 369.0 503.3 372.1 479.7 372.2 450.4"/>
      <path stroke-width="8.928571428571427" d="M 410.7 445.6 C 418.6 484.9 433.1 511.7 440.0 535.0 C 442.4 511.3 451.4 482.9 452.2 444.0"/>
      <path stroke-width="8.928571428571427" d="M 491.4 445.8 C 495.4 482.1 503.5 508.1 505.0 530.0 C 511.6 509.1 524.0 484.8 528.5 450.5"/>
      <path stroke-width="8.928571428571427" d="M 393.3 549.3 C 361.4 564.5 339.8 578.3 320.0 585.0 C 341.9 585.4 368.9 589.6 403.2 580.0"/>
      <path stroke-width="8.928571428571427" d="M 400.8 614.6 C 366.4 629.1 344.6 643.7 325.0 650.0 C 343.1 650.9 365.0 655.2 392.6 649.8"/>
      <path stroke-width="8.928571428571427" d="M 684.1 684.5 C 657.7 691.1 640.9 703.9 626.0 710.0 C 642.4 711.4 662.7 718.9 690.7 717.1"/>
      <path stroke-width="8.928571428571427" d="M 162.5 473.5 L 137.8 504.1"/>
      <path stroke-width="8.928571428571427" d="M 142.8 453.1 L 111.1 474.7"/>
      <path stroke-width="8.928571428571427" d="M 126.2 411.0 L 89.7 415.5"/>
      <path stroke-width="8.928571428571427" d="M 126.5 382.0 L 91.1 376.4"/>
      <path stroke-width="8.928571428571427" d="M 156.5 331.7 L 138.7 303.2"/>
    </g>
    <g transform="translate(400.8 371.6) scale(0.66)">
      <path stroke-width="10.606060606060606" d="M 500.0 261.4 C 579.8 261.4 634.4 309.7 635.2 376.9 C 647.0 393.7 657.5 406.3 664.6 423.1 Q 649.1 425.2 642.0 434.9 C 651.2 448.3 658.8 465.1 659.6 479.8 Q 642.8 479.8 631.0 486.9 C 609.2 523.9 558.8 538.6 500.0 538.6 C 441.2 538.6 390.8 523.9 369.0 486.9 Q 357.2 479.8 340.4 479.8 C 341.2 465.1 348.8 448.3 358.0 434.9 Q 350.9 425.2 335.4 423.1 C 342.5 406.3 353.0 393.7 364.8 376.9 C 365.6 309.7 420.2 261.4 500.0 261.4 Z"/>
      <path stroke-width="10.606060606060606" d="M 440.9 271.6 A 42.0 42.0 0 0 0 358.0 281.1 A 42.0 42.0 0 0 0 381.4 318.8"/>
      <path stroke-width="10.606060606060606" d="M 618.6 318.8 A 42.0 42.0 0 0 0 642.0 281.1 A 42.0 42.0 0 0 0 559.1 271.6"/>
      <path stroke-width="7.575757575757575" d="M 478.0 262.7 C 482.8 294.1 491.8 312.7 500.0 324.0 C 508.2 312.7 517.2 294.1 522.0 262.7"/>
      <path stroke-width="7.575757575757575" d="M 439.3 272.2 C 449.7 294.8 463.1 305.9 478.2 311.4 C 476.0 293.8 473.4 278.0 472.0 263.5"/>
      <path stroke-width="7.575757575757575" d="M 560.7 272.2 C 550.3 294.8 536.9 305.9 521.8 311.4 C 524.0 293.8 526.6 278.0 528.0 263.5"/>
      <path stroke-width="7.575757575757575" d="M 654.0 403.4 C 632.9 411.4 613.4 421.8 596.6 433.6 C 613.0 437.7 629.3 439.1 645.1 439.6"/>
      <path stroke-width="7.575757575757575" d="M 346.0 403.4 C 367.1 411.4 386.6 421.8 403.4 433.6 C 387.0 437.7 370.7 439.1 354.9 439.6"/>
      <circle cx="442.0" cy="381.1" r="28.6" stroke-width="8.575757575757574"/>
      <circle cx="443.1" cy="382.1" r="16.8" fill="#111" stroke="none"/>
      <circle cx="558.0" cy="381.1" r="28.6" stroke-width="8.575757575757574"/>
      <circle cx="556.9" cy="382.1" r="16.8" fill="#111" stroke="none"/>
      <path stroke-width="8.575757575757574" d="M 500.0 454.3 A 29.4 23.1 0 1 0 500.0 480.1 A 29.4 23.1 0 1 0 500.0 454.3 Z"/>
      <path stroke-width="8.575757575757574" fill="#111" d="M 478.2 431.5 C 478.2 421.4 521.8 421.4 521.8 431.5 C 521.8 440.7 509.2 449.1 500.0 454.6 C 490.8 449.1 478.2 440.7 478.2 431.5 Z"/>
      <path stroke-width="8.575757575757574" d="M 454.9 483.5 C 458.8 531.5 541.2 531.5 545.1 483.5"/>
      <circle cx="470.6" cy="465.1" r="5.303030303030303" fill="#111" stroke="none"/>
      <circle cx="459.7" cy="470.1" r="5.303030303030303" fill="#111" stroke="none"/>
      <circle cx="474.0" cy="476.0" r="5.303030303030303" fill="#111" stroke="none"/>
      <circle cx="529.4" cy="465.1" r="5.303030303030303" fill="#111" stroke="none"/>
      <circle cx="540.3" cy="470.1" r="5.303030303030303" fill="#111" stroke="none"/>
      <circle cx="526.0" cy="476.0" r="5.303030303030303" fill="#111" stroke="none"/>
      <path stroke-width="10.606060606060606" d="M 398.0 600.0 C 396.0 700.0 394.0 780.0 394.0 838.0 C 370.0 844.0 364.0 880.0 390.0 882.0 L 466.0 882.0 C 492.0 880.0 488.0 844.0 464.0 838.0 C 462.0 780.0 464.0 700.0 468.0 600.0"/>
      <path stroke-width="10.606060606060606" d="M 602.0 600.0 C 604.0 700.0 606.0 780.0 606.0 838.0 C 630.0 844.0 636.0 880.0 610.0 882.0 L 534.0 882.0 C 508.0 880.0 512.0 844.0 536.0 838.0 C 538.0 780.0 536.0 700.0 532.0 600.0"/>
      <path stroke-width="10.606060606060606" d="M 266.1 859.6 A 52.0 26.0 -4 0 0 369.9 852.4 A 52.0 26.0 -4 0 0 266.1 859.6 Z"/>
      <path stroke-width="10.606060606060606" d="M 630.1 852.4 A 52.0 26.0 4 0 0 733.9 859.6 A 52.0 26.0 4 0 0 630.1 852.4 Z"/>
      <path stroke-width="10.606060606060606" d="M 396.4 678.9 A 86.0 84.0 -12 0 0 283.9 777.9 A 86.0 84.0 -12 0 0 317.7 830.0 M 367.6 845.7 A 86.0 84.0 -12 0 0 382.1 844.5"/>
      <path stroke-width="10.606060606060606" d="M 617.9 844.5 A 86.0 84.0 12 0 0 632.4 845.7 M 682.3 830.0 A 86.0 84.0 12 0 0 716.1 777.9 A 86.0 84.0 12 0 0 603.6 678.9"/>
      <path stroke-width="10.606060606060606" d="M 610.6 509.8 C 653.4 548.6 675.1 612.2 680.0 685.0 C 680.1 686.4 680.2 687.7 680.3 689.1 M 528.5 841.2 C 519.4 841.7 510.0 842.0 500.0 842.0 C 490.0 842.0 480.6 841.7 471.5 841.2 M 319.7 689.1 C 319.8 687.7 319.9 686.4 320.0 685.0 C 324.9 612.2 346.6 548.6 389.4 509.8"/>
      <path stroke-width="10.606060606060606" d="M 712.3 791.2 C 712.5 791.2 712.7 791.2 712.9 791.2 C 721.3 791.0 730.3 790.5 739.0 788.8 C 747.8 787.1 756.9 784.8 765.3 780.8 C 773.8 776.8 782.6 771.5 789.5 764.9 C 796.4 758.3 802.5 749.7 806.7 741.2 C 810.9 732.7 813.3 722.8 814.6 713.9 C 816.0 704.9 815.2 695.6 814.7 687.4 C 814.3 679.3 812.2 672.0 811.8 665.2 C 811.5 658.5 811.6 652.3 812.6 646.8 C 813.6 641.3 815.3 636.1 817.8 632.5 C 820.4 628.8 823.4 626.0 828.0 624.9 C 832.6 623.9 840.6 626.5 845.5 626.0 C 850.3 625.4 854.2 624.3 856.9 621.7 C 859.7 619.1 861.9 614.3 862.0 610.5 C 862.1 606.8 860.3 601.8 857.7 599.1 C 855.1 596.3 853.0 594.9 846.5 594.0 C 840.1 593.1 827.9 590.7 818.8 593.6 C 809.7 596.5 798.5 603.9 792.0 611.4 C 785.4 619.0 782.0 629.8 779.5 638.9 C 777.0 648.0 777.2 657.6 777.2 666.0 C 777.1 674.4 779.1 682.2 779.5 689.3 C 779.8 696.3 779.9 702.6 779.0 708.5 C 778.1 714.4 776.5 720.0 774.0 724.8 C 771.5 729.7 768.1 734.0 764.0 737.6 C 760.0 741.1 755.0 744.0 749.7 746.2 C 744.4 748.4 738.4 749.8 732.2 750.8 C 727.6 751.5 722.8 751.8 717.9 751.9"/>
      <path stroke-width="7.575757575757575" d="M 281.8 761.4 C 307.7 760.9 327.6 753.7 344.0 752.0 C 329.3 745.5 313.0 733.0 289.4 724.5"/>
      <path stroke-width="7.575757575757575" d="M 718.2 761.4 C 692.3 760.9 672.4 753.7 656.0 752.0 C 670.7 745.5 687.0 733.0 710.6 724.5"/>
      <path stroke-width="7.575757575757575" d="M 395.6 717.9 C 418.1 715.3 435.4 708.3 450.0 706.0 C 435.6 701.2 419.1 691.1 396.2 684.9"/>
      <path stroke-width="7.575757575757575" d="M 604.4 717.9 C 581.9 715.3 564.6 708.3 550.0 706.0 C 564.4 701.2 580.9 691.1 603.8 684.9"/>
      <path stroke-width="7.575757575757575" d="M 780.4 772.3 L 758.8 741.5"/>
      <path stroke-width="7.575757575757575" d="M 802.1 749.4 L 771.3 729.3"/>
      <path stroke-width="7.575757575757575" d="M 815.1 693.9 L 779.7 695.5"/>
      <path stroke-width="7.575757575757575" d="M 812.1 668.8 L 777.4 671.6"/>
      <path stroke-width="7.575757575757575" d="M 818.8 631.2 L 793.4 609.9"/>
    </g>
  </g>
</svg>
`,oe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="10" d="M 350 254 A 30 30 0 1 0 410 254 A 30 30 0 1 0 350 254 Z"/>
    <path stroke-width="10" d="M 689.0 373.0 C 677.0 345.0 687.0 315.0 715.0 311.0 C 741.0 307.0 759.0 327.0 753.0 355.0 C 749.0 375.0 729.0 385.0 711.0 383.0 C 701.0 382.0 693.0 379.0 689.0 373.0 Z"/>
    <path stroke-width="10" d="M 693.7 322.0 A 24.0 15.0 -60 0 0 688.0 309.2 A 24.0 15.0 -60 1 0 664.0 350.8 A 24.0 15.0 -60 0 0 684.3 343.9"/>
    <path stroke-width="10" d="M 536.9 494.8 A 112.0 112.0 0 0 0 582.0 405.0 A 112.0 112.0 0 0 0 358.0 405.0 A 112.0 112.0 0 0 0 403.1 494.8"/>
    <path stroke-width="10" d="M 366.5 362.2 A 50.0 50.0 0 0 0 302.0 410.0 A 50.0 50.0 0 0 0 370.5 456.4"/>
    <path stroke-width="10" d="M 569.5 456.4 A 50.0 50.0 0 0 0 638.0 410.0 A 50.0 50.0 0 0 0 573.5 362.2"/>
    <path stroke-width="7" d="M 359.3 387.9 A 28.0 28.0 0 0 0 317.0 412.0 A 28.0 28.0 0 0 0 361.9 434.3"/>
    <path stroke-width="7" d="M 578.1 434.3 A 28.0 28.0 0 0 0 623.0 412.0 A 28.0 28.0 0 0 0 580.7 387.9"/>
    <path stroke-width="8" d="M 470 352 C 444 314 384 320 382 372 C 380 404 396 424 402 440 C 384 480 410 532 470 534 C 530 532 556 480 538 440 C 544 424 560 404 558 372 C 556 320 496 314 470 352 Z"/>
    <circle cx="440" cy="384" r="25" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 429 387 A 13 13 0 1 0 455 387 A 13 13 0 1 0 429 387 Z M 438.5 383 A 6.5 6.5 0 1 0 451.5 383 A 6.5 6.5 0 1 0 438.5 383 Z"/>
    <circle cx="500" cy="384" r="25" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 485 387 A 13 13 0 1 0 511 387 A 13 13 0 1 0 485 387 Z M 494.5 383 A 6.5 6.5 0 1 0 507.5 383 A 6.5 6.5 0 1 0 494.5 383 Z"/>
    <circle cx="462.0" cy="438.0" r="6" fill="#111" stroke="none"/>
    <circle cx="480.0" cy="438.0" r="6" fill="#111" stroke="none"/>
    <path stroke-width="8" d="M 428 462 C 446 494 494 494 512 462"/>
    <path stroke-width="10" d="M 415.2 511.9 A 92.0 112.0 0 0 0 380.0 600.0 A 92.0 112.0 0 0 0 564.0 600.0 A 92.0 112.0 0 0 0 526.6 509.9"/>
    <path stroke-width="7" d="M 414.0 618.0 A 58.0 76.0 0 0 0 530.0 618.0 A 58.0 76.0 0 0 0 414.0 618.0 Z"/>
    <path stroke-width="10" d="M 407.0 520.7 C 399.1 518.8 386.0 521.7 377.5 519.9 C 366.3 517.5 355.8 514.3 345.7 510.0 C 335.6 505.7 325.7 500.3 316.9 494.1 C 308.1 487.8 299.8 480.5 292.8 472.4 C 285.8 464.4 279.6 455.3 275.0 445.8 C 270.3 436.3 266.9 425.9 264.9 415.6 C 263.0 405.2 262.4 394.2 263.3 383.9 C 264.2 373.5 266.3 363.0 270.3 353.6 C 274.3 344.1 280.4 335.2 287.3 327.2 C 294.1 319.1 302.6 311.6 311.4 305.2 C 320.2 298.8 329.7 293.1 340.0 288.6 C 347.7 285.3 358.3 282.9 366.3 280.7 M 351.6 244.4 C 343.1 246.7 333.0 249.9 324.8 253.4 C 312.5 258.8 299.9 265.8 288.7 273.9 C 277.5 282.0 266.6 291.2 257.5 301.9 C 248.5 312.6 239.8 325.1 234.2 338.1 C 228.6 351.1 225.2 366.0 223.8 380.1 C 222.3 394.2 223.1 408.9 225.6 422.8 C 228.1 436.7 232.6 450.7 238.7 463.3 C 244.7 476.0 252.8 488.2 261.9 498.9 C 270.9 509.6 281.7 519.2 292.9 527.4 C 304.2 535.5 316.6 542.4 329.2 547.9 C 341.8 553.4 355.5 557.6 368.5 560.6 C 373.4 561.7 379.0 563.6 384.6 565.2"/>
    <path stroke-width="10" d="M 559.3 564.6 C 563.2 563.3 567.2 561.8 570.7 561.1 C 580.2 559.2 590.0 556.8 599.5 553.7 C 608.9 550.6 618.3 546.9 627.3 542.5 C 636.3 538.1 645.1 533.0 653.4 527.2 C 661.7 521.5 669.7 514.9 676.9 507.8 C 684.1 500.6 690.8 492.7 696.6 484.3 C 702.5 475.9 707.8 466.7 711.9 457.4 C 715.9 448.1 718.8 438.1 721.2 428.5 C 723.6 418.8 724.9 409.1 726.1 399.7 C 726.9 393.8 727.9 387.1 728.4 381.3 M 691.9 376.2 C 691.3 382.1 690.9 389.0 690.1 394.6 C 688.8 403.1 687.5 411.5 685.5 419.5 C 683.5 427.4 681.1 435.1 677.9 442.3 C 674.6 449.5 670.5 456.2 665.9 462.6 C 661.3 469.0 656.0 475.1 650.3 480.6 C 644.6 486.1 638.2 491.2 631.6 495.6 C 625.0 500.1 617.8 504.1 610.5 507.6 C 603.1 511.0 595.4 513.9 587.6 516.4 C 579.7 518.8 571.8 520.7 563.4 522.1 C 556.0 523.4 544.0 519.1 539.0 523.3"/>
    <path stroke-width="10" d="M 337.5 837.4 A 44.0 24.0 -15 0 0 422.5 814.6 A 44.0 24.0 -15 0 0 337.5 837.4 Z"/>
    <path stroke-width="10" d="M 536.7 799.0 A 44.0 24.0 20 1 0 619.3 829.0 A 44.0 24.0 20 1 0 536.7 799.0 Z"/>
    <path stroke-width="10" d="M 414.8 687.7 C 413.4 691.1 416.2 697.1 415.3 700.7 C 414.1 705.8 412.8 710.7 411.4 715.7 C 410.0 720.6 408.4 725.6 406.8 730.5 C 405.1 735.4 403.4 740.2 401.5 745.1 C 399.6 749.9 397.7 754.7 395.6 759.5 C 393.5 764.3 391.3 769.1 389.1 773.9 C 386.8 778.6 384.5 783.3 382.0 788.1 C 379.6 792.8 376.0 797.5 374.5 802.4 C 374.5 802.5 374.4 802.6 374.4 802.7 M 417.7 807.3 C 417.7 807.2 417.8 807.2 417.8 807.1 C 420.5 802.1 423.2 797.1 425.8 792.0 C 428.4 786.9 431.0 781.8 433.4 776.6 C 435.9 771.4 438.2 766.1 440.5 760.8 C 442.7 755.5 444.8 750.1 446.9 744.6 C 448.9 739.2 450.8 733.7 452.5 728.2 C 454.3 722.6 456.0 716.9 457.5 711.4 C 457.6 711.1 457.6 710.9 457.7 710.6"/>
    <path stroke-width="10" d="M 487.4 710.4 C 487.5 710.6 487.5 710.8 487.6 711.0 C 489.2 716.4 491.1 722.0 493.0 727.4 C 495.0 732.8 497.2 738.1 499.6 743.3 C 502.0 748.5 504.5 753.7 507.2 758.7 C 510.0 763.7 512.9 768.6 515.9 773.4 C 519.0 778.2 522.2 782.9 525.5 787.5 C 528.9 792.1 532.5 796.6 536.0 800.9 M 577.4 787.5 C 577.3 787.3 577.2 787.1 577.1 786.9 C 574.7 782.6 570.5 779.2 567.5 775.4 C 564.5 771.5 561.7 767.7 559.0 763.8 C 556.3 759.8 553.7 755.8 551.3 751.7 C 548.9 747.6 546.6 743.4 544.5 739.2 C 542.3 735.0 540.4 730.7 538.5 726.3 C 536.7 721.9 535.1 717.5 533.6 713.0 C 532.1 708.6 530.8 704.2 529.6 699.5 C 528.7 696.0 531.6 690.0 530.0 686.9"/>
    <path stroke-width="10" d="M 540.5 674.7 C 540.5 677.6 541.1 680.1 542.5 681.7 C 546.9 686.7 563.2 686.8 573.9 688.2 C 584.7 689.7 595.9 690.4 606.8 690.3 C 617.8 690.2 628.9 689.3 639.7 687.5 C 650.5 685.8 661.4 683.2 671.8 679.7 C 682.3 676.3 692.6 671.9 702.3 666.8 C 712.1 661.7 721.5 655.7 730.3 649.0 C 739.0 642.3 747.3 634.8 754.8 626.7 C 762.3 618.6 769.1 609.7 775.1 600.5 C 781.0 591.2 786.2 581.3 790.5 571.3 C 794.9 561.2 798.3 550.7 801.1 540.2 C 803.9 529.7 805.8 518.9 807.3 508.3 C 808.8 497.6 809.5 486.9 810.1 476.2 C 810.7 465.6 810.8 454.9 810.7 444.4 C 810.7 433.8 810.3 423.2 809.9 412.7 C 809.6 402.2 808.9 391.8 808.4 381.4 C 807.9 370.9 807.2 360.5 806.7 350.2 C 806.2 339.8 805.7 329.5 805.5 319.2 C 805.4 309.0 805.4 298.2 805.7 288.6 C 806.0 279.0 804.1 267.9 807.1 261.8 C 810.1 255.7 817.1 252.8 823.7 252.1 C 830.4 251.3 841.1 253.4 846.9 257.5 C 852.7 261.5 857.7 270.3 858.6 276.3 C 859.5 282.3 856.3 292.7 852.2 293.6 C 848.0 294.5 838.1 283.9 833.9 281.9 C 829.7 279.9 829.0 280.8 827.0 281.5 C 825.0 282.2 822.8 284.2 821.9 286.1 C 821.0 288.0 820.8 291.0 821.5 293.0 C 822.2 295.0 819.9 295.2 826.1 298.1 C 832.3 301.1 850.1 314.5 858.6 310.7 C 867.1 306.9 877.2 286.7 877.0 275.3 C 876.9 263.9 867.3 249.3 858.0 242.3 C 848.7 235.3 832.5 231.6 821.2 233.2 C 810.0 234.9 796.3 243.1 790.5 252.1 C 784.7 261.2 787.0 276.4 786.2 287.6 C 785.4 298.8 785.7 308.9 785.8 319.5 C 785.9 330.1 786.3 340.6 786.7 351.0 C 787.1 361.5 787.7 371.9 788.2 382.3 C 788.6 392.7 789.2 403.1 789.5 413.4 C 789.8 423.8 790.0 434.1 790.0 444.3 C 790.0 454.6 789.8 464.8 789.2 475.0 C 788.5 485.1 787.7 495.3 786.2 505.2 C 784.8 515.1 782.9 525.0 780.3 534.6 C 777.7 544.2 774.5 553.6 770.6 562.6 C 766.7 571.6 762.0 580.3 756.6 588.5 C 751.3 596.7 745.2 604.5 738.5 611.6 C 731.9 618.7 724.5 625.3 716.7 631.1 C 708.9 637.0 700.5 642.2 691.8 646.6 C 683.2 651.1 674.0 654.9 664.7 657.8 C 655.4 660.8 645.7 663.1 636.1 664.6 C 626.4 666.1 616.5 666.8 606.7 666.8 C 596.8 666.8 587.1 666.1 577.2 664.7 C 568.9 663.5 557.7 657.8 550.9 657.7"/>
    <path stroke-width="12" d="M -10.0 150.0 C 129.6 216.5 233.9 244.1 329.3 251.6 M 410.0 253.5 C 430.0 253.0 449.9 251.7 470.0 250.0 C 640.0 236.0 800.0 170.0 1010.0 110.0"/>
    <path stroke-width="6" d="M 362 236 L 372 252 M 380 228 L 386 246 M 398 234 L 400 250"/>
    <path stroke-width="10" d="M 67.2 184.3 C 98.9 203.1 126.8 178.0 135.9 143.3 C 100.9 134.8 65.7 147.5 67.2 184.3 Z"/>
    <path stroke-width="7" d="M 84.4 174.1 C 94.6 169.8 104.0 164.2 112.5 157.2"/>
    <path stroke-width="10" d="M 186.8 225.9 C 164.8 251.1 182.7 278.7 212.4 291.1 C 225.7 261.8 220.1 229.4 186.8 225.9 Z"/>
    <path stroke-width="7" d="M 193.2 242.2 C 195.3 251.7 198.8 260.6 203.7 268.9"/>
    <path stroke-width="10" d="M 625.3 224.1 C 618.9 257.4 649.3 274.0 682.3 271.4 C 678.8 238.5 656.8 211.7 625.3 224.1 Z"/>
    <path stroke-width="7" d="M 639.6 235.9 C 646.4 243.5 654.2 250.0 662.9 255.3"/>
    <path stroke-width="10" d="M 787.9 178.1 C 824.3 172.4 829.9 135.4 814.7 102.8 C 782.4 118.4 763.3 150.7 787.9 178.1 Z"/>
    <path stroke-width="7" d="M 794.6 159.3 C 799.8 149.6 803.5 139.3 805.6 128.4"/>
    <path stroke-width="10" d="M 939.1 131.0 C 934.4 164.3 965.0 178.5 997.2 173.5 C 992.3 141.2 969.4 116.3 939.1 131.0 Z"/>
    <path stroke-width="7" d="M 953.6 141.6 C 960.7 148.6 968.7 154.4 977.5 159.0"/>
    <path stroke-width="10" d="M -10.0 880.0 C -3.0 879.3 4.0 878.7 11.0 878.2 M 82.0 874.1 C 104.6 873.3 127.0 872.9 149.3 872.8 M 222.9 873.4 C 350.3 875.8 475.1 883.2 600.0 872.0 C 677.3 865.8 739.6 865.0 793.4 865.9 M 864.7 867.9 C 885.7 868.6 905.5 869.3 924.9 869.7 M 997.3 868.8 C 1001.5 868.6 1005.8 868.3 1010.0 868.0"/>
    <path stroke-width="10" d="M 960.0 1015.0 C 1019.8 961.6 1007.6 848.8 962.0 770.0 C 915.2 848.0 901.0 960.6 960.0 1015.0 Z"/>
    <path stroke-width="7" d="M 960.5 953.8 C 963.8 908.9 964.1 863.9 961.6 819.0"/>
    <path stroke-width="10" d="M 900.0 1015.0 C 928.7 940.6 866.3 847.8 790.0 800.0 C 784.1 889.8 822.9 994.8 900.0 1015.0 Z"/>
    <path stroke-width="7" d="M 872.5 961.2 C 855.0 920.5 834.8 881.1 812.0 843.0"/>
    <path stroke-width="10" d="M 55.0 1015.0 C 108.3 957.6 88.8 845.7 40.0 770.0 C 0.8 851.1 -4.9 964.6 55.0 1015.0 Z"/>
    <path stroke-width="7" d="M 51.2 953.8 C 51.3 908.7 48.5 863.7 43.0 819.0"/>
    <path stroke-width="10" d="M 110.0 1015.0 C 188.0 998.3 231.7 895.1 230.0 805.0 C 151.5 849.3 84.8 939.3 110.0 1015.0 Z"/>
    <path stroke-width="7" d="M 140.0 962.5 C 164.5 925.4 186.5 886.9 206.0 847.0"/>
    <path stroke-width="7" d="M 280.0 940 A 20.0 20.0 0 1 0 320.0 940 A 20.0 20.0 0 1 0 280.0 940 Z"/>
    <path stroke-width="7" d="M 304.9 920.6 A 24.0 12.8 -90 0 0 300.0 874.4 A 24.0 12.8 -90 0 0 295.1 920.6"/>
    <path stroke-width="7" d="M 320.0 939.0 A 24.0 12.8 -18 0 0 362.4 919.7 A 24.0 12.8 -18 0 0 316.7 929.0"/>
    <path stroke-width="7" d="M 307.2 958.7 A 24.0 12.8 54 0 0 338.6 993.1 A 24.0 12.8 54 0 0 315.5 952.6"/>
    <path stroke-width="7" d="M 284.5 952.6 A 24.0 12.8 126 0 0 261.4 993.1 A 24.0 12.8 126 0 0 292.8 958.7"/>
    <path stroke-width="7" d="M 283.3 929.0 A 24.0 12.8 198 0 0 237.6 919.7 A 24.0 12.8 198 0 0 280.0 939.0"/>
    <path stroke-width="7" d="M 668.75 935 A 21.25 21.25 0 1 0 711.25 935 A 21.25 21.25 0 1 0 668.75 935 Z"/>
    <path stroke-width="7" d="M 695.2 914.4 A 25.5 13.6 -90 0 0 690.0 865.3 A 25.5 13.6 -90 0 0 684.8 914.4"/>
    <path stroke-width="7" d="M 711.2 933.6 A 25.6 13.6 -18 0 0 756.3 913.4 A 25.6 13.6 -18 0 0 707.9 923.6"/>
    <path stroke-width="7" d="M 697.6 954.8 A 25.5 13.6 54 0 0 731.0 991.4 A 25.5 13.6 54 0 0 706.5 948.4"/>
    <path stroke-width="7" d="M 673.5 948.4 A 25.5 13.6 126 0 0 649.0 991.4 A 25.5 13.6 126 0 0 682.4 954.8"/>
    <path stroke-width="7" d="M 672.1 923.6 A 25.6 13.6 198 0 0 623.7 913.4 A 25.6 13.6 198 0 0 668.8 933.6"/>
    <path stroke-width="10" d="M 94 410 A 46 46 0 1 0 186 410 A 46 46 0 1 0 94 410 Z"/>
    <path stroke-width="8" d="M 200.0 410.0 L 224.0 410.0 M 182.4 452.4 L 199.4 469.4 M 140.0 470.0 L 140.0 494.0 M 97.6 452.4 L 80.6 469.4 M 80.0 410.0 L 56.0 410.0 M 97.6 367.6 L 80.6 350.6 M 140.0 350.0 L 140.0 326.0 M 182.4 367.6 L 199.4 350.6"/>
    <path stroke-width="10" d="M 109.0 662.0 C 73.0 662.0 73.0 618.0 109.0 620.4 C 109.0 586.0 157.0 582.0 165.0 602.0 C 177.0 566.0 237.0 570.0 237.0 610.0 C 273.0 602.0 293.0 662.0 257.0 662.0 Z"/>
  </g>
</svg>
`,se=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="15" d="M 500 215 C 690 215 820 330 822 490 C 850 530 875 560 892 600 Q 855 605 838 628 C 860 660 878 700 880 735 Q 840 735 812 752 C 760 840 640 875 500 875 C 360 875 240 840 188 752 Q 160 735 120 735 C 122 700 140 660 162 628 Q 145 605 108 600 C 125 560 150 530 178 490 C 180 330 310 215 500 215 Z"/>
    <path stroke-width="15" d="M 359.4 239.2 A 100.0 100.0 0 0 0 162.0 262.0 A 100.0 100.0 0 0 0 217.6 351.6"/>
    <path stroke-width="15" d="M 782.4 351.6 A 100.0 100.0 0 0 0 838.0 262.0 A 100.0 100.0 0 0 0 640.6 239.2"/>
    <path d="M 323.2 255.5 A 52.0 52.0 0 0 0 223.0 275.0 A 52.0 52.0 0 0 0 243.9 316.7"/>
    <path d="M 756.1 316.7 A 52.0 52.0 0 0 0 777.0 275.0 A 52.0 52.0 0 0 0 676.8 255.5"/>
    <path d="M 457.9 217.0 C 466.3 281.4 482.3 322.9 500.0 345.0 C 517.7 322.9 533.7 281.4 542.1 217.0"/>
    <path d="M 371.8 234.8 C 390.9 282.0 415.5 307.4 440.0 318.0 C 433.5 286.9 427.6 254.5 422.9 221.8"/>
    <path d="M 628.2 234.8 C 609.1 282.0 584.5 307.4 560.0 318.0 C 566.5 286.9 572.4 254.5 577.1 221.8"/>
    <path d="M 846.8 524.6 C 809.6 539.7 776.9 556.4 748.0 575.0 C 792.2 579.3 835.0 576.3 877.5 571.0"/>
    <path d="M 846.6 641.3 C 817.7 648.9 791.3 658.7 768.0 670.0 C 798.6 677.3 833.5 679.3 865.6 678.3"/>
    <path d="M 153.2 524.6 C 190.4 539.7 223.1 556.4 252.0 575.0 C 207.8 579.3 165.0 576.3 122.5 571.0"/>
    <path d="M 153.4 641.3 C 182.3 648.9 208.7 658.7 232.0 670.0 C 201.4 677.3 166.5 679.3 134.4 678.3"/>
    <circle cx="362" cy="500" r="68" stroke-width="12"/>
    <circle cx="638" cy="500" r="68" stroke-width="12"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 334 512 A 40 40 0 1 0 414 512 A 40 40 0 1 0 334 512 Z M 375 496 A 14 14 0 1 0 403 496 A 14 14 0 1 0 375 496 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 586 512 A 40 40 0 1 0 666 512 A 40 40 0 1 0 586 512 Z M 627 496 A 14 14 0 1 0 655 496 A 14 14 0 1 0 627 496 Z"/>
    <path stroke-width="12" d="M 500 674.2 A 70 55 0 1 0 500 735.8 A 70 55 0 1 0 500 674.2 Z"/>
    <path stroke-width="12" d="M 448 620 C 448 596 552 596 552 620 C 552 642 522 662 500 675 C 478 662 448 642 448 620 Z"/>
    <path stroke-width="12" d="M 392.5 743.9 C 402 858 598 858 607.5 743.9"/>
    <circle cx="430" cy="700" r="7" fill="#111" stroke="none"/>
    <circle cx="404" cy="712" r="7" fill="#111" stroke="none"/>
    <circle cx="438" cy="726" r="7" fill="#111" stroke="none"/>
    <circle cx="570" cy="700" r="7" fill="#111" stroke="none"/>
    <circle cx="596" cy="712" r="7" fill="#111" stroke="none"/>
    <circle cx="562" cy="726" r="7" fill="#111" stroke="none"/>
  </g>
</svg>
`,ce=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="10" d="M 722.0 270.0 C 798.0 270.0 850.0 316.0 850.8 380.0 C 862.0 396.0 872.0 408.0 878.8 424.0 Q 864.0 426.0 857.2 435.2 C 866.0 448.0 873.2 464.0 874.0 478.0 Q 858.0 478.0 846.8 484.8 C 826.0 520.0 778.0 534.0 722.0 534.0 C 666.0 534.0 618.0 520.0 597.2 484.8 Q 586.0 478.0 570.0 478.0 C 570.8 464.0 578.0 448.0 586.8 435.2 Q 580.0 426.0 565.2 424.0 C 572.0 408.0 582.0 396.0 593.2 380.0 C 594.0 316.0 646.0 270.0 722.0 270.0 Z"/>
    <path stroke-width="10" d="M 665.7 279.7 A 40.0 40.0 0 0 0 586.8 288.8 A 40.0 40.0 0 0 0 609.0 324.6"/>
    <path stroke-width="10" d="M 835.0 324.6 A 40.0 40.0 0 0 0 857.2 288.8 A 40.0 40.0 0 0 0 778.3 279.7"/>
    <path stroke-width="7" d="M 651.3 286.2 A 20.8 20.8 0 0 0 611.2 294.0 A 20.8 20.8 0 0 0 619.6 310.7"/>
    <path stroke-width="7" d="M 824.4 310.7 A 20.8 20.8 0 0 0 832.8 294.0 A 20.8 20.8 0 0 0 792.7 286.2"/>
    <path stroke-width="7" d="M 701.1 271.2 C 705.6 301.1 714.1 318.9 722.0 329.6 C 729.9 318.9 738.4 301.1 742.9 271.2"/>
    <path stroke-width="7" d="M 664.2 280.3 C 674.1 301.8 686.8 312.4 701.2 317.6 C 699.2 300.9 696.6 285.8 695.4 272.0"/>
    <path stroke-width="7" d="M 779.8 280.3 C 769.9 301.8 757.2 312.4 742.8 317.6 C 744.8 300.9 747.4 285.8 748.6 272.0"/>
    <path stroke-width="7" d="M 868.6 405.3 C 848.5 412.9 830.0 422.8 814.0 434.0 C 829.6 437.9 845.1 439.3 860.2 439.7"/>
    <path stroke-width="7" d="M 575.4 405.3 C 595.5 412.9 614.0 422.8 630.0 434.0 C 614.4 437.9 598.9 439.3 583.8 439.7"/>
    <circle cx="666.8" cy="384.0" r="27.2" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 651.6 384.8 A 16.0 16.0 0 1 0 683.6 384.8 A 16.0 16.0 0 1 0 651.6 384.8 Z M 664.9 380.6 A 7 7 0 1 0 678.9 380.6 A 7 7 0 1 0 664.9 380.6 Z"/>
    <circle cx="777.2" cy="384.0" r="27.2" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 760.4 384.8 A 16.0 16.0 0 1 0 792.4 384.8 A 16.0 16.0 0 1 0 760.4 384.8 Z M 773.6 380.6 A 7 7 0 1 0 787.6 380.6 A 7 7 0 1 0 773.6 380.6 Z"/>
    <path stroke-width="8" d="M 722.0 453.7 A 28.0 22.0 0 1 0 722.0 478.3 A 28.0 22.0 0 1 0 722.0 453.7 Z"/>
    <path stroke-width="8" d="M 701.2 432.0 C 701.2 422.4 742.8 422.4 742.8 432.0 C 742.8 440.8 730.8 448.8 722.0 454.0 C 713.2 448.8 701.2 440.8 701.2 432.0 Z"/>
    <path stroke-width="8" d="M 679.0 481.6 C 682.8 527.2 761.2 527.2 765.0 481.6"/>
    <circle cx="694.0" cy="464.0" r="4" fill="#111" stroke="none"/>
    <circle cx="683.6" cy="468.8" r="4" fill="#111" stroke="none"/>
    <circle cx="697.2" cy="474.4" r="4" fill="#111" stroke="none"/>
    <circle cx="750.0" cy="464.0" r="4" fill="#111" stroke="none"/>
    <circle cx="760.4" cy="468.8" r="4" fill="#111" stroke="none"/>
    <circle cx="746.8" cy="474.4" r="4" fill="#111" stroke="none"/>
    <path stroke-width="10" d="M 603.2 652.8 L 631.0 796.0 C 631.0 820.0 639.0 826.0 657.0 826.0 L 709.0 826.0 C 729.0 826.0 729.0 792.0 705.0 788.0 L 669.1 610.2"/>
    <path stroke-width="10" d="M 228.0 610.0 C 222.0 545.0 280.0 505.0 335.0 512.0 C 395.0 520.0 418.0 578.0 395.0 632.0 L 376.0 770.0 C 374.0 790.0 384.0 800.0 398.0 802.0 C 420.0 806.0 420.0 826.0 398.0 826.0 L 300.0 826.0 C 278.0 826.0 272.0 810.0 280.0 795.0 L 292.0 712.0 C 252.0 690.0 232.0 655.0 228.0 610.0 Z"/>
    <path stroke-width="10" d="M 573.6 460.9 A 240.0 118.0 0 0 0 210.0 562.0 A 240.0 118.0 0 0 0 227.7 606.5 M 388.9 676.1 A 240.0 118.0 0 0 0 603.3 652.8 M 669.1 610.2 A 240.0 118.0 0 0 0 690.0 562.0 A 240.0 118.0 0 0 0 681.7 531.2"/>
    <path stroke-width="10" d="M 515.0 675.6 L 515.0 780.0 C 515.0 804.0 523.0 810.0 541.0 810.0 L 585.0 810.0 C 595.0 810.0 595.0 776.0 581.0 772.0 L 581.0 660.8"/>
    <path stroke-width="10" d="M 414.7 678.7 L 418.0 780.0 C 418.0 804.0 426.0 810.0 444.0 810.0 L 486.0 810.0 C 496.0 810.0 496.0 776.0 482.0 772.0 L 478.8 679.1"/>
    <path stroke-width="10" d="M 236.7 507.9 C 236.7 504.3 236.4 501.2 235.6 499.3 C 232.4 491.7 217.5 497.2 209.2 495.2 C 200.9 493.2 193.2 490.6 185.8 487.3 C 178.4 484.0 171.2 479.9 164.8 475.2 C 158.4 470.5 152.4 465.0 147.4 459.0 C 142.3 453.0 137.9 446.3 134.5 439.3 C 131.2 432.2 128.7 424.5 127.1 416.7 C 125.6 409.0 125.1 400.7 125.5 392.8 C 125.8 384.9 127.0 376.7 129.3 369.4 C 131.6 362.0 135.0 354.7 139.3 348.6 C 143.5 342.5 149.0 336.8 154.8 332.9 C 160.6 328.9 166.9 325.7 174.1 324.8 C 181.3 324.0 192.1 327.9 198.0 327.9 C 204.0 327.8 206.9 326.9 209.8 324.6 C 212.8 322.3 215.4 317.7 215.9 314.0 C 216.3 310.2 214.9 305.1 212.6 302.2 C 210.3 299.2 209.1 297.8 202.0 296.1 C 194.9 294.5 180.9 290.9 170.1 292.2 C 159.2 293.6 146.4 298.5 136.6 304.5 C 126.9 310.5 118.3 319.3 111.5 328.2 C 104.7 337.1 99.5 347.7 95.8 358.1 C 92.2 368.4 90.2 379.6 89.4 390.5 C 88.5 401.3 88.9 412.5 90.7 423.3 C 92.5 434.0 95.7 445.0 100.1 455.0 C 104.6 465.0 110.6 474.8 117.3 483.4 C 124.1 492.0 132.3 499.9 140.8 506.6 C 149.4 513.3 158.9 519.0 168.6 523.7 C 178.2 528.5 188.8 532.2 198.7 535.0 C 203.4 536.3 208.8 538.9 214.0 540.8"/>
    <path stroke-width="7" d="M 699.0 826.0 L 699.0 812.0 M 681.0 826.0 L 681.0 812.0"/>
    <path stroke-width="7" d="M 575.0 810.0 L 575.0 796.0 M 557.0 810.0 L 557.0 796.0"/>
    <path stroke-width="7" d="M 476.0 810.0 L 476.0 796.0 M 458.0 810.0 L 458.0 796.0"/>
    <path stroke-width="7" d="M 392 826 L 392 812 M 374 826 L 374 812"/>
    <path stroke-width="7" d="M 264.1 487.4 C 269.5 499.6 275.6 510.2 281.6 519.8 M 295.6 514.8 C 294.7 502.4 294.0 488.5 292.9 472.8"/>
    <path stroke-width="7" d="M 333.4 458.9 C 339.6 482.7 348.8 501.5 357.1 517.8 M 368.1 523.3 C 369.0 503.3 372.1 479.7 372.2 450.4"/>
    <path stroke-width="7" d="M 410.7 445.6 C 418.6 484.9 433.1 511.7 440.0 535.0 C 442.4 511.3 451.4 482.9 452.2 444.0"/>
    <path stroke-width="7" d="M 491.4 445.8 C 495.4 482.1 503.5 508.1 505.0 530.0 C 511.6 509.1 524.0 484.8 528.5 450.5"/>
    <path stroke-width="7" d="M 393.3 549.3 C 361.4 564.5 339.8 578.3 320.0 585.0 C 341.9 585.4 368.9 589.6 403.2 580.0"/>
    <path stroke-width="7" d="M 400.8 614.6 C 366.4 629.1 344.6 643.7 325.0 650.0 C 343.1 650.9 365.0 655.2 392.6 649.8"/>
    <path stroke-width="7" d="M 387.0 689.8 C 361.9 696.7 345.0 706.6 330.0 712.0 C 344.3 712.1 361.4 715.1 383.7 714.3"/>
    <path stroke-width="7" d="M 682.8 678.4 C 659.0 684.4 643.6 694.8 630.0 700.0 C 644.7 700.6 662.9 705.4 687.9 703.2"/>
    <path stroke-width="7" d="M 695.0 738.7 C 670.2 743.8 654.0 753.3 640.0 758.0 C 655.0 758.9 673.5 764.1 699.8 762.1"/>
    <path stroke-width="7" d="M 145.8 457.1 C 138.1 468.7 135.1 480.9 130.3 488.9 C 140.3 485.7 155.0 485.7 169.8 478.6"/>
    <path stroke-width="7" d="M 125.4 399.9 C 112.8 404.1 103.2 411.2 94.8 414.3 C 104.4 418.0 115.6 427.1 131.1 431.1"/>
    <path stroke-width="7" d="M 141.5 345.6 C 128.7 342.1 116.9 342.6 108.3 340.5 C 114.0 348.7 118.1 362.0 128.1 373.7"/>
    <path stroke-width="7" d="M 170.4 325.5 L 162.6 293.6"/>
    <path stroke-width="10" d="M -10.0 772.0 C 89.9 762.5 187.5 764.7 284.0 767.6 M 376.0 770.1 C 389.9 770.4 403.8 770.6 417.7 770.7 M 482.0 770.6 C 493.0 770.4 504.0 770.1 515.0 769.7 M 581.0 765.7 C 587.3 765.2 593.7 764.6 600.0 764.0 C 608.3 763.3 616.4 762.6 624.4 762.0 M 699.0 758.5 C 826.5 755.4 921.5 768.0 1010.0 760.0"/>
    <path stroke-width="10" d="M 66 118 A 52 52 0 1 0 170 118 A 52 52 0 1 0 66 118 Z"/>
    <path stroke-width="8" d="M 186.0 118.0 L 214.0 118.0 M 166.1 166.1 L 185.9 185.9 M 118.0 186.0 L 118.0 214.0 M 69.9 166.1 L 50.1 185.9 M 50.0 118.0 L 22.0 118.0 M 69.9 69.9 L 50.1 50.1 M 118.0 50.0 L 118.0 22.0 M 166.1 69.9 L 185.9 50.1"/>
    <path stroke-width="10" d="M 339.8 188.0 C 297.0 188.0 297.0 135.8 339.8 138.6 C 339.8 97.8 396.8 93.0 406.2 116.8 C 420.5 74.0 491.8 78.8 491.8 126.2 C 534.5 116.8 558.2 188.0 515.5 188.0 Z"/>
    <path stroke-width="7" d="M 497.5 905 A 22.5 22.5 0 1 0 542.5 905 A 22.5 22.5 0 1 0 497.5 905 Z"/>
    <path stroke-width="7" d="M 525.5 883.2 A 27.0 14.4 -90 0 0 520.0 831.2 A 27.0 14.4 -90 0 0 514.5 883.2"/>
    <path stroke-width="7" d="M 542.4 903.4 A 27.0 14.4 -18 0 0 590.2 882.2 A 27.0 14.4 -18 0 0 539.0 893.0"/>
    <path stroke-width="7" d="M 528.0 926.0 A 27.0 14.4 54 0 0 563.4 964.7 A 27.0 14.4 54 0 0 537.5 919.2"/>
    <path stroke-width="7" d="M 502.5 919.2 A 27.0 14.4 126 0 0 476.6 964.7 A 27.0 14.4 126 0 0 512.0 926.0"/>
    <path stroke-width="7" d="M 501.0 893.0 A 27.0 14.4 198 0 0 449.8 882.2 A 27.0 14.4 198 0 0 497.6 903.4"/>
    <path stroke-width="7" d="M 835.0 885 A 25.0 25.0 0 1 0 885.0 885 A 25.0 25.0 0 1 0 835.0 885 Z"/>
    <path stroke-width="7" d="M 866.1 860.8 A 30.0 16.0 -90 0 0 860.0 803.0 A 30.0 16.0 -90 0 0 853.9 860.8"/>
    <path stroke-width="7" d="M 885.0 883.7 A 30.0 16.0 -18 0 0 938.0 859.6 A 30.0 16.0 -18 0 0 881.0 871.4"/>
    <path stroke-width="7" d="M 869.4 908.2 A 30.0 16.0 54 0 0 908.2 951.4 A 30.0 16.0 54 0 0 879.1 901.1"/>
    <path stroke-width="7" d="M 840.9 901.1 A 30.0 16.0 126 0 0 811.8 951.4 A 30.0 16.0 126 0 0 850.6 908.2"/>
    <path stroke-width="7" d="M 839.0 871.4 A 30.0 16.0 198 0 0 782.0 859.6 A 30.0 16.0 198 0 0 835.0 883.7"/>
    <path stroke-width="10" d="M 70.0 1010.0 C 132.6 1046.2 215.4 1000.0 260.0 935.0 C 229.8 928.3 197.2 927.8 167.6 933.8"/>
    <path stroke-width="7" d="M 128.4 987.7 C 160.4 977.3 191.6 964.7 222.0 950.0"/>
    <path stroke-width="10" d="M 70.0 1010.0 C 144.0 1007.7 186.1 924.2 185.0 845.0 C 147.8 858.2 113.3 881.7 91.0 910.7"/>
    <path stroke-width="7" d="M 98.8 968.8 C 122.3 940.2 143.3 909.9 162.0 878.0"/>
    <path stroke-width="10" d="M 70.0 1010.0 C 116.8 958.9 91.1 871.0 40.0 815.0 C 8.1 883.8 10.0 975.3 70.0 1010.0 Z"/>
    <path stroke-width="7" d="M 62.5 961.2 C 59.6 925.1 54.1 889.3 46.0 854.0"/>
    <path stroke-width="7" d="M 318 905 L 310 886 M 330 905 L 330 879 M 342 905 L 350 886"/>
    <path stroke-width="7" d="M 383 965 L 375 946 M 395 965 L 395 939 M 407 965 L 415 946"/>
    <path stroke-width="7" d="M 688 960 L 680 940 M 700 960 L 700 934 M 712 960 L 720 940"/>
    <path stroke-width="7" d="M 948 850 L 940 830 M 960 850 L 960 824 M 972 850 L 980 830"/>
    <path stroke-width="7" d="M 598 850 L 590 830 M 610 850 L 610 824 M 622 850 L 630 830"/>
    <path stroke-width="10" d="M 905.0 -10.0 C 885.0 50.0 925.0 110.0 900.0 170.0 C 888.0 200.0 895.0 220.0 905.0 235.0"/>
    <path stroke-width="10" d="M 900.6 52.0 C 865.6 40.3 843.6 70.7 842.1 106.5 C 878.0 107.5 909.8 87.6 900.6 52.0 Z"/>
    <path stroke-width="7" d="M 886.0 65.6 C 876.9 71.9 868.9 79.3 862.0 88.0"/>
    <path stroke-width="10" d="M 908.5 126.6 C 901.5 158.7 928.9 171.4 959.2 165.6 C 957.1 134.8 937.8 111.6 908.5 126.6 Z"/>
    <path stroke-width="7" d="M 921.2 136.4 C 927.2 142.9 934.1 148.2 942.0 152.4"/>
    <path stroke-width="10" d="M 893.7 199.8 C 863.6 185.1 841.7 209.5 837.4 241.4 C 869.1 246.7 898.9 232.8 893.7 199.8 Z"/>
    <path stroke-width="7" d="M 879.6 210.2 C 871.1 214.7 863.4 220.3 856.5 227.2"/>
  </g>
</svg>
`,le=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="10">
      <circle cx="128" cy="138" r="50"/>
      <path d="M618.6 171.2C616.7 167.2 615.6 162.7 615.6 158C615.6 147.1 621.4 137.1 630.8 131.7C637.1 128 644.4 126.8 651.4 128.1"/>
      <path d="M650.6 128.5C656.2 112.2 671.7 100.4 690 100.4C707.1 100.4 721.8 110.7 728.2 125.5"/>
      <path d="M727.4 125.1C729.5 124.6 731.7 124.4 734 124.4C751.7 124.4 766 138.7 766 156.4C766 162.4 764.3 168 761.4 172.9"/>
      <path d="M762 171.6L762 172.4C762 182.1 754.1 190 744.4 190L635.6 190C625.9 190 618 182.1 618 172.4L618 171.6C618 170.7 618.1 169.8 618.2 168.9"/>
      <path d="M289.6 186.7C287.9 183.1 286.9 179.2 286.9 175C286.9 160.3 298.8 148.4 313.5 148.4C315.1 148.4 316.7 148.5 318.3 148.8"/>
      <path d="M317.5 149.3C320.3 141.1 326 134 333.8 129.5C345.1 123 358.9 123 370.2 129.5C377.1 133.5 382.4 139.6 385.5 146.7"/>
      <path d="M384.6 146.2C386.5 145.8 388.5 145.6 390.5 145.6C406 145.6 418.5 158.1 418.5 173.6C418.5 178.9 417 183.9 414.4 188.1"/>
      <path d="M415 186.9L415 187.6C415 196.1 408.1 203 399.6 203L304.4 203C295.9 203 289 196.1 289 187.6L289 186.9C289 186 289.1 185.1 289.2 184.2"/>
      <path d="M-10 840C48.9 821.6 106.3 808.6 165.5 799.6M834.5 799.6C893.7 808.6 951.1 821.6 1010 840"/>
      <path d="M451.8 799.4C439.6 880.8 399.8 950.3 372 1010"/>
      <path d="M548.2 799.4C560.4 880.8 600.2 950.3 628 1010"/>
      <path d="M555 272.4L555 440.8M445 440.8L445 272.4"/>
      <path d="M428 270Q500 284 572 270L506 112Q500 100 494 112Z"/>
      <path d="M264.5 560L305 560L305 590L335 590L335 560L370.7 560M375.1 800L371 800"/>
      <path d="M629.4 560L668 560L668 590L698 590L698 560L735.6 560M627.2 800L625 800"/>
      <path d="M265 412.9L265 748M227.8 800L145 800L145 412.9"/>
      <path d="M127 410Q205 426 283 410L211 236Q205 224 199 236Z"/>
      <path d="M855 412.9L855 800L772.2 800M735 748L735 412.9"/>
      <path d="M717 410Q795 426 873 410L801 236Q795 224 789 236Z"/>
      <path d="M370 775.1L370 440L410 440L410 470L443 470L443 440L483 440L483 470L517 470L517 440L557 440L557 470L590 470L590 440L630 440L630 658M630 658L630 775.1M627.1 800L566.1 800M565.9 800L560.5 800M557.8 800L549.7 800M549.4 800L542.4 800M541.1 800L522.6 800M521.3 800L512.4 800M509.4 800L504.6 800M503.4 800L498.9 800M498.3 800L487.9 800M486.5 800L480.9 800M480.3 800L475.6 800M474.2 800L458.9 800M458.9 800L452.5 800M450.4 800L446.5 800M446.2 800L372.9 800"/>
      <path d="M452 800V700A48 48 0 0 1 548 700V800Z"/>
      <path d="M227.4 799.8C226.5 796.7 226 793.4 226 790C226 771.2 241.2 756 260 756C260.3 756 260.7 756 261 756M277 819.4C272 822.3 266.2 824 260 824C253.8 824 248 822.3 243 819.4"/>
      <path d="M260.2 756.6C265.8 740 281.5 728 300 728C318.5 728 334.2 740 339.8 756.6"/>
      <path d="M339 756C339.3 756 339.7 756 340 756C358.8 756 374 771.2 374 790C374 793.4 373.5 796.7 372.6 799.8M357 819.4C352 822.3 346.2 824 340 824C333.8 824 328 822.3 323 819.4"/>
      <path d="M372.4 798.2C373.4 800.3 374 802.6 374 805L374 805C374 813.3 367.3 820 359 820L355.3 820M325.8 820L274.2 820M244.7 820L241 820C232.7 820 226 813.3 226 805L226 805C226 802.6 226.6 800.3 227.6 798.2"/>
      <path d="M627.4 799.8C626.5 796.7 626 793.4 626 790C626 771.2 641.2 756 660 756C660.3 756 660.7 756 661 756M677 819.4C672 822.3 666.2 824 660 824C653.8 824 648 822.3 643 819.4"/>
      <path d="M660.2 756.6C665.8 740 681.5 728 700 728C718.5 728 734.2 740 739.8 756.6"/>
      <path d="M739 756C739.3 756 739.7 756 740 756C758.8 756 774 771.2 774 790C774 793.4 773.5 796.7 772.6 799.8M757 819.4C752 822.3 746.2 824 740 824C733.8 824 728 822.3 723 819.4"/>
      <path d="M772.4 798.2C773.4 800.3 774 802.6 774 805L774 805C774 813.3 767.3 820 759 820L755.3 820M725.8 820L674.2 820M644.7 820L641 820C632.7 820 626 813.3 626 805L626 805C626 802.6 626.6 800.3 627.6 798.2"/>
    </g>
    <g stroke-width="7">
      <path d="M192.7 164.8L212.5 173"/>
      <path d="M154.8 202.7L164 224.8"/>
      <path d="M101.2 202.7L92 224.8"/>
      <path d="M63.3 164.8L41.2 174"/>
      <path d="M63.3 111.2L41.2 102"/>
      <path d="M101.2 73.3L92 51.2"/>
      <path d="M154.8 73.3L164 51.2"/>
      <path d="M192.7 111.2L214.8 102"/>
      <ellipse cx="495" cy="850" rx="30" ry="14"/>
      <ellipse cx="478" cy="912" rx="38" ry="17"/>
      <ellipse cx="512" cy="975" rx="46" ry="19"/>
      <path d="M500 105L500 83.9M500 76.7L500 72M500 72.1L500 67.1M500 50.1L500 46"/>
      <path d="M500 48Q530 40 562 56Q532 66 500 84Z"/>
      <circle cx="500" cy="345" r="28"/>
      <path d="M205 230L205 208.2M205 210L205 204.9M205 203.8L205 193.7M205 176.1L205 172"/>
      <path d="M205 174Q235 166 267 182Q237 192 205 210Z"/>
      <path d="M181 560V500A24 24 0 0 1 229 500V560Z"/>
      <path d="M795 230L795 208.9M795 205.7L795 204.9M795 176.1L795 172"/>
      <path d="M795 174Q825 166 857 182Q827 192 795 210Z"/>
      <path d="M771 560V500A24 24 0 0 1 819 500V560Z"/>
      <path d="M411 600V545A24 24 0 0 1 459 545V600Z"/>
      <path d="M541 600V545A24 24 0 0 1 589 545V600Z"/>
      <path d="M473.4 800L432 800L432 700C432 662.4 462.4 632 500 632C537.6 632 568 662.4 568 700L568 800L547.8 800M547.4 800L538.7 800M536.6 800L528.8 800M532.7 800L517.9 800M515.6 800L504.5 800M504.5 800L469.4 800"/>
      <path d="M484 652.8L484 801.5"/>
      <path d="M516 652.8L516 801.5"/>
      <rect x="168" y="640" width="40" height="20" rx="4"/>
      <rect x="196" y="712" width="40" height="20" rx="4"/>
      <rect x="770" y="650" width="40" height="20" rx="4"/>
      <rect x="812" y="720" width="40" height="20" rx="4"/>
      <rect x="392" y="670" width="40" height="20" rx="4"/>
      <rect x="590" y="650" width="40" height="20" rx="4"/>
      <rect x="290" y="660" width="40" height="20" rx="4"/>
      <rect x="660" y="700" width="40" height="20" rx="4"/>
      <rect x="470" y="395" width="40" height="20" rx="4"/>
    </g>
    <path fill="#111" stroke="none" d="M530 742C526.1 742 523 745.2 523.1 749C523.1 752.9 526.2 756 530 756C533.9 756 537 752.9 537 749C537.1 745.2 534 742 530.1 742Z"/>
  </g>
</svg>
`,ue=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="10">
      <circle cx="870" cy="130" r="55"/>
      <path d="M72.2 163.1C70.8 159 70 154.6 70 150C70 127.9 87.9 110 110 110C111.9 110 113.8 110.1 115.7 110.4"/>
      <path d="M114.9 110.9C121.1 89 141.2 73 165 73C189.6 73 210.3 90.1 215.6 113.1"/>
      <path d="M214.9 112.6C217.2 112.2 219.6 112 222 112C244.1 112 262 129.9 262 152C262 156.2 261.4 160.2 260.2 163.9"/>
      <path d="M260.1 162.2C261.3 164.9 262 167.9 262 171L262 171C262 182.6 252.6 192 241 192L91 192C79.4 192 70 182.6 70 171L70 171C70 167.6 70.8 164.4 72.3 161.5"/>
      <path d="M-10 880C20.3 877.9 50.7 876 81 874.3M188.1 869C231.3 867.2 274.5 865.8 317.7 864.7M662.6 864.3C778.4 866.8 894.2 872.1 1010 880"/>
      <path d="M657 780.8C667.3 792.9 679.1 804.6 690 812C715 829 752 842 780 842C808 842 838.8 829 858 812C877.2 795 890 761.3 895 740C897.8 728 897.2 713.9 895 702.7M856.4 704.9C853.3 719.7 858.6 746.7 850 760C840.3 775 820 786.7 800 790C780 793.3 753.3 791.7 730 780C711.6 770.7 688.9 742.8 672 728.2"/>
      <path d="M836 716L872 610Q878 598 886 610L928 706Q900 690 882 716Q862 694 836 716Z"/>
      <path d="M362.9 459.9C317.5 399 263.2 366.4 200 362C214.7 407.3 225.3 448 232 484C252 473.3 272 485.3 292 520C307.5 514.2 322.3 521 336.4 540.6"/>
      <path d="M617.1 459.9C662.5 399 716.8 366.4 780 362C765.3 407.3 754.7 448 748 484C728 473.3 708 485.3 688 520C672.5 514.2 657.7 521 643.6 540.6"/>
      <path d="M388.3 432C348.7 455.5 344.3 518 330 560C315.3 603.3 303.7 650 304 690C304.3 730 316 774 332 800C336.4 807.2 341.6 813.2 347.3 818.3M632.7 818.3C638.4 813.2 643.6 807.2 648 800C664 774 675.7 730 676 690C676.3 650 664.7 603.3 650 560C635.7 518 631.3 455.5 591.7 432"/>
      <path d="M425.3 809.6C401.3 783.9 386 744.4 386 700C386 670.7 392.7 643.5 404.1 621.1M438.7 578.2C453.8 566.6 471.4 560 490 560C508.6 560 526.2 566.6 541.3 578.2M575.9 621.1C587.3 643.5 594 670.7 594 700C594 744.4 578.7 783.9 554.7 809.6"/>
      <path d="M490.3 868.5C476.6 884.6 443.6 896 405 896C354.2 896 313 876.3 313 852C313 827.7 354.2 808 405 808C443.6 808 476.6 819.4 490.3 835.5"/>
      <ellipse cx="575" cy="852" rx="92" ry="44"/>
      <path d="M400 468C393.3 469 380.7 484.7 374 498C367.3 511.3 359.7 531 360 548C360.3 565 367.3 587.3 376 600C384.7 612.7 400 621.7 412 624C424 626.3 441.3 620.3 448 614C454.7 607.7 455.7 593.3 452 586C448.3 578.7 433.7 578.3 426 570C418.3 561.7 408 549 406 536C404 523 415 503.3 414 492C413 480.7 406.7 467 400 468Z"/>
      <path d="M580 468C586.7 469 599.3 484.7 606 498C612.7 511.3 620.3 531 620 548C619.7 565 612.7 587.3 604 600C595.3 612.7 580 621.7 568 624C556 626.3 538.7 620.3 532 614C525.3 607.7 524.3 593.3 528 586C531.7 578.7 546.3 578.3 554 570C561.7 561.7 572 549 574 536C576 523 565 503.3 566 492C567 480.7 573.3 467 580 468Z"/>
      <path d="M403.8 203C401.8 192 400.8 178.5 398 168C393 149 382 108 382 108C382 108 407.7 129.8 420 146C428 156.6 441.5 173.1 449.5 186.8"/>
      <path d="M576.2 203C578.2 192 579.2 178.5 582 168C587 149 598 108 598 108C598 108 572.3 129.8 560 146C552 156.6 538.5 173.1 530.5 186.8"/>
      <path d="M337.6 267.5C322.9 249.7 262 232 262 232C262 232 290 278 290 278C290 278 248 306 248 306C248 306 300 318 300 318C300 318 276 350 276 350C276 350 306.4 351.9 327.6 348"/>
      <path d="M642.4 267.5C657.1 249.7 718 232 718 232C718 232 690 278 690 278C690 278 732 306 732 306C732 306 680 318 680 318C680 318 704 350 704 350C704 350 673.6 351.9 652.4 348"/>
      <ellipse cx="490" cy="322" rx="166" ry="140"/>
      <ellipse cx="490" cy="402" rx="100" ry="42"/>
      <path d="M62 800L84 768L106 794L130 762L154 792L178 764L200 798Q214 890 132 892Q52 890 62 800Z"/>
    </g>
    <g stroke-width="7">
      <path d="M945 130L968 130"/>
      <path d="M923 183L939.3 199.3"/>
      <path d="M870 205L870 228"/>
      <path d="M817 183L800.7 199.3"/>
      <path d="M795 130L772 130"/>
      <path d="M817 77L800.7 60.7"/>
      <path d="M870 55L870 32"/>
      <path d="M923 77L939.3 60.7"/>
      <path d="M353.4 485.7L232 484"/>
      <path d="M626.6 485.7L748 484"/>
      <path d="M350.5 496.3L292 520"/>
      <path d="M629.5 496.3L688 520"/>
      <path d="M444 614.7C474.7 616.4 505.3 616.4 536 614.7"/>
      <path d="M388.3 659.5C456.1 668.2 523.9 668.2 591.7 659.5"/>
      <path d="M384.1 709C454.7 718.3 525.3 718.3 595.9 709"/>
      <path d="M393.9 760.2C458 767.9 522 767.9 586.1 760.2"/>
      <path d="M385 894Q383 878 389 866"/>
      <path d="M421 894Q419 878 425 866"/>
      <path d="M555 894Q553 878 559 866"/>
      <path d="M591 894Q589 878 595 866"/>
      <path d="M426 598Q436 604 444 600"/>
      <path d="M554 598Q544 604 536 600"/>
      <ellipse cx="418" cy="272" rx="40" ry="46"/>
      <ellipse cx="562" cy="272" rx="40" ry="46"/>
      <path d="M440 408Q490 436 540 408"/>
      <ellipse cx="372" cy="348" rx="25" ry="15"/>
      <ellipse cx="608" cy="348" rx="25" ry="15"/>
      <circle cx="108" cy="836" r="15"/>
      <circle cx="160" cy="852" r="12"/>
      <path d="M262.1 813.3C263.3 835.4 262.6 855 260 872"/>
      <path d="M261 852Q230 822 214 834Q232 864 261 862Z"/>
      <path d="M236 770Q232 808 262 814Q292 808 288 770L276 786L262 764L248 786Z"/>
    </g>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M398 280C398 297.1 409.2 311 423 311C436.8 311 448 297.1 448 280C448 262.9 436.8 249 423 249C409.2 249 398 262.9 398 280ZM402.8 268.8C402.8 274.3 407.3 278.8 412.8 278.8C418.3 278.8 422.8 274.3 422.8 268.8C422.8 263.3 418.3 258.8 412.8 258.8C407.3 258.8 402.8 263.3 402.8 268.8Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M542 280C542 297.1 553.2 311 567 311C580.8 311 592 297.1 592 280C592 262.9 580.8 249 567 249C553.2 249 542 262.9 542 280ZM546.8 268.8C546.8 274.3 551.3 278.8 556.8 278.8C562.3 278.8 566.8 274.3 566.8 268.8C566.8 263.3 562.3 258.8 556.8 258.8C551.3 258.8 546.8 263.3 546.8 268.8Z"/>
    <path fill="#111" stroke="none" d="M458 382C454 382 451.6 386.3 452.8 391.6C453.9 396.8 458.1 401.1 462.1 401.1C466.2 401.1 468.6 396.8 467.4 391.6C466.3 386.3 462.2 382 458.1 382ZM522 382C517.9 382 513.8 386.3 512.7 391.6C511.5 396.8 513.9 401.1 518 401.1C522 401.1 526.2 396.8 527.3 391.6C528.5 386.3 526.1 382 522.1 382Z"/>
  </g>
</svg>
`,de=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="7">
      <path d="M97 958.3C96.8 975.5 95.1 992.8 92 1010"/>
      <path d="M596.8 933.3C595.9 958.8 600.3 984.4 610 1010"/>
      <path d="M915.2 935.2C915.4 960.2 912 985.1 905 1010"/>
      <path d="M782 938.6C786.9 962.4 787.6 986.2 784 1010"/>
      <path d="M518 967C514.4 981.3 513.7 995.7 516 1010"/>
      <path d="M171.7 967C174.8 981.3 174.9 995.7 172 1010"/>
      <path d="M113.1 58.2A62 62 0 1 0 170.2 153.4A56 56 0 0 1 113.1 58.2Z"/>
      <path d="M-10 600C35.7 588.6 80.5 581.6 125.2 577.9M354.7 580.3C392.3 583 430.6 586.5 470 590C550.7 596.7 629.4 591.4 708.8 582.4M925.2 555.4C953.1 552.4 981.3 549.8 1010 548"/>
      <path d="M204.8 775.5C178.2 850.3 228.1 930.2 262 1010"/>
      <path d="M287.3 775.5C330.4 850.3 420.2 920.2 488 1010"/>
      <path d="M120.6 505.5C118.3 532.3 127.4 567.4 124 600C118.7 651 108 776 108 776C108 776 157.2 776 213.1 776M205.9 776C212.7 776 219.7 776 226.7 776M215.2 776C220.4 776 225.7 776 231 776M231.6 776C242.8 776 254 776 265 776M250.5 776C262.7 776 274.8 776 286.3 776M286.4 776C333.7 776 372 776 372 776C372 776 361.3 651 356 600C352.2 563.7 363.9 524.2 358.1 496.7"/>
      <path d="M205 776V690A41 41 0 0 1 287 690V776Z"/>
      <circle cx="166" cy="598" r="30"/>
      <circle cx="318" cy="572" r="30"/>
      <path d="M26 492C20 380 100 318 205 314C318 318 392 380 386 492Q205 528 26 492Z"/>
      <path d="M761.7 630.4C754.2 648.4 762.4 679 760 700C757 726 752 776 752 776C752 776 771.4 776 796.1 776M797.3 776C798.3 776 799.4 776 800.4 776M795.5 776C798.9 776 802.3 776 805.8 776M806.7 776C810.3 776 814 776 817.6 776M810.3 776C816 776 821.9 776 827.8 776M821.5 776C823 776 824.5 776 826 776M828.9 776C830.2 776 831.5 776 832.8 776M832.8 776C867.4 776 900 776 900 776C900 776 895 726 892 700C889.6 679 897.8 648.4 890.3 630.4"/>
      <path d="M796 776V722A26 26 0 0 1 848 722V776Z"/>
      <path d="M700 622C700 556 760 516 826 514C892 516 952 556 952 622Q826 646 700 622Z"/>
      <path d="M464.2 740.1C466.4 750.9 467.1 764.2 466 780L438 780C436.9 764.2 437.6 750.9 439.8 740.1"/>
      <path d="M410.0 736.0C410.0 700.0 432.0 684.0 452 684.0C472.0 684.0 494.0 700.0 494.0 736.0Q452 746.0 410.0 736.0Z"/>
      <path d="M668 762.1C673.8 760.3 676.9 757.8 680 754C684.3 748.7 682.3 736.7 686 732C689.7 727.3 697.7 724.7 702 726C706.3 727.3 711.3 733 712 740C712.7 747 710.7 760.7 706 768C701.3 775.3 702.7 781.7 684 784C665.3 786.3 594 782 594 782C594 782 601 769 612 766C612.7 765.8 613.5 765.6 614.3 765.5"/>
      <path d="M606 744C606 725.2 621.2 710 640 710C658.8 710 674 725.2 674 744C674 762.8 658.8 778 640 778C621.2 778 606 762.8 606 744Z"/>
      <path d="M570.7 300.5C564 293.9 555.9 286.8 547.2 279.5M514.4 252.4C508.8 247.7 503.6 243.2 499 239C469.1 211.7 429.7 167.5 408 161C386.3 154.5 371.2 178.3 369 200C366.8 221.7 373.3 267.2 395 291C412.6 310.2 448.7 328.7 478.9 338M548.3 343.5C557.6 342.3 566.2 340.5 573 338"/>
      <path d="M680.5 239.4C680.7 239.3 680.8 239.1 681 239C710.9 212.7 750.3 173 772 167.5C793.7 162 809.3 186 811 206.5C812.7 227 804.1 268.2 782.4 291C760.7 313.8 712.6 337.4 681 343C676.3 343.8 671 344.4 665.4 344.7M631.8 343.5C622.5 342.3 613.8 340.5 607 337.9"/>
      <path d="M561.9 345.1C549.3 342.5 534.8 341.1 522.6 342.6M478.8 358.2C467.9 364 457.7 370.6 449.6 376.8C431.4 390.7 413.6 411.9 410.6 426.2C407.6 440.5 419.7 460 431.4 462.6C443.1 465.2 463.5 453.1 480.8 441.8C492.1 434.4 504.3 421 516.3 409.8"/>
      <path d="M618.1 345.1C631.6 342.3 647.5 340.8 660.2 343C683.2 346.9 712.2 362.9 730.4 376.8C748.6 390.7 766.4 411.9 769.4 426.2C772.4 440.5 760.3 460 748.6 462.6C736.9 465.2 716.5 453.1 699.2 441.8C687.9 434.4 675.7 421 663.7 409.8"/>
      <path d="M548.3 417.6L531.8 512.2M549.3 517.4C549.4 517 549.5 516.6 549.6 516.2L565.1 427.4"/>
      <path d="M615.1 427.2L630.4 508.5C630.5 508.9 630.6 509.2 630.7 509.6M648.2 504.4L631.8 417.6"/>
      <path d="M517.2 527.6C518.9 515.5 526.7 510.3 540.6 512C551 515.5 555.3 521.5 553.6 530.2C544.9 537.1 532.8 536.3 517.2 527.6Z"/>
      <path d="M662.8 519.8C661.1 507.7 653.3 502.5 639.4 504.2C629 507.7 624.7 513.7 626.4 522.4C635.1 529.3 647.2 528.5 662.8 519.8Z"/>
      <path d="M573 338.5C561.4 343.8 546.6 352.8 535.4 369C523.7 385.9 504.2 439.2 504.2 439.2C504.2 439.2 536.7 414.9 551 418.4C565.3 421.9 590 460 590 460C590 460 614.7 421.9 629 418.4C643.3 414.9 675.8 439.2 675.8 439.2C675.8 439.2 656.3 385.9 644.6 369C633.4 352.8 618.6 343.8 607 338.5"/>
      <path d="M570.7 300.5L491.4 336.7M497.5 353.9L572.2 322.1"/>
      <path d="M473 348.2C473 341 478.8 335.2 486 335.2C493.2 335.2 499 341 499 348.2C499 355.4 493.2 361.2 486 361.2C478.8 361.2 473 355.4 473 348.2Z"/>
      <path d="M608.6 313.7L639.9 287.6M664.5 267.1L671.1 261.6C671.9 260.8 672.5 260 673 259"/>
      <path d="M674.1 234.9L714.8 155.8"/>
      <path d="M663.8 235.7C665.8 234.5 668.1 233.8 670.6 233.8C677.8 233.8 683.6 239.6 683.6 246.8C683.6 254 677.8 259.8 670.6 259.8C668.8 259.8 667.1 259.4 665.5 258.8"/>
      <path d="M723.5 94.6C724.6 92.1 725.8 92.1 726.9 94.6L734.4 112L753.1 113.8C755.9 114.1 756.3 115.1 754.2 116.9L740 129.4L744.2 147.9C744.8 150.6 743.9 151.2 741.5 149.8L725.2 140.2L709 149.8C706.5 151.2 705.6 150.6 706.2 147.9L710.4 129.4L696.2 116.9C694.1 115.1 694.5 114.1 697.2 113.8L716 112Z"/>
      <path d="M610.6 289.3L606.9 348.2C595.6 351.7 584.4 351.7 573.1 348.2L569.4 289.3"/>
      <path d="M569.9 176.2C564.7 171 561.4 163.8 561.4 155.8C561.4 140 574.2 127.2 590 127.2C605.8 127.2 618.6 140 618.6 155.8C618.6 163.8 615.3 171 610.1 176.2"/>
      <path d="M549.9 276.5C546.5 281.5 544.5 286.9 540.6 288.4C533.7 291 524.1 291 519.8 283.2C515.5 275.4 512 257.2 514.6 241.6C517.2 226 522.8 200.9 535.4 189.6C548 178.3 571.8 174 590 174C608.2 174 632 178.3 644.6 189.6C657.2 200.9 662.8 226 665.4 241.6C668 257.2 664.5 275.4 660.2 283.2C655.9 291 646.3 291 639.4 288.4C635.5 286.9 633.5 281.5 630.1 276.5"/>
      <path d="M647.2 236.4C647.2 268 621.6 293.6 590 293.6C558.4 293.6 532.8 268 532.8 236.4"/>
      <path d="M647.2 236.4C635.1 220.8 622.1 214.7 608.2 218.2C596.1 206.1 583.9 206.1 571.8 218.2C557.9 214.7 544.9 220.8 532.8 236.4"/>
    </g>
    <g stroke-width="5.5">
      <path d="M298.6 54.7Q300 52 301.4 54.7L307.9 67.1L321.7 69.4Q324.7 70 322.6 72.2L312.9 82.2L314.8 96Q315.3 99 312.5 97.7L300 91.5L287.5 97.7Q284.7 99 285.2 96L287.1 82.2L277.4 72.2Q275.3 70 278.3 69.4L292.1 67.1Z"/>
      <path d="M230.8 230.3Q232 228 233.2 230.3L238.7 240.7L250.4 242.8Q252.9 243.2 251.1 245.1L242.9 253.5L244.6 265.2Q244.9 267.8 242.6 266.7L232 261.4L221.4 266.7Q219.1 267.8 219.4 265.2L221.1 253.5L212.9 245.1Q211.1 243.2 213.6 242.8L225.3 240.7Z"/>
      <path d="M50.8 280.3Q52 278 53.2 280.3L58.7 290.7L70.4 292.8Q72.9 293.2 71.1 295.1L62.9 303.5L64.6 315.2Q64.9 317.8 62.6 316.7L52 311.4L41.4 316.7Q39.1 317.8 39.4 315.2L41.1 303.5L32.9 295.1Q31.1 293.2 33.6 292.8L45.3 290.7Z"/>
      <path d="M858.5 40.9Q860 38 861.5 40.9L868.6 54.2L883.4 56.8Q886.6 57.3 884.3 59.7L873.8 70.5L876 85.4Q876.5 88.7 873.5 87.2L860 80.6L846.5 87.2Q843.5 88.7 844 85.4L846.2 70.5L835.7 59.7Q833.4 57.3 836.6 56.8L851.4 54.2Z"/>
      <path d="M946.8 194.3Q948 192 949.2 194.3L954.7 204.7L966.4 206.8Q968.9 207.2 967.1 209.1L958.9 217.5L960.6 229.2Q960.9 231.8 958.6 230.7L948 225.4L937.4 230.7Q935.1 231.8 935.4 229.2L937.1 217.5L928.9 209.1Q927.1 207.2 929.6 206.8L941.3 204.7Z"/>
      <path d="M466.8 38.3Q468 36 469.2 38.3L474.7 48.7L486.4 50.8Q488.9 51.2 487.1 53.1L478.9 61.5L480.6 73.2Q480.9 75.8 478.6 74.7L468 69.4L457.4 74.7Q455.1 75.8 455.4 73.2L457.1 61.5L448.9 53.1Q447.1 51.2 449.6 50.8L461.3 48.7Z"/>
      <path d="M369.5 211.1L360 206.4L350.4 211.1C348.9 211.8 348.3 211.4 348.6 209.8L350.1 199.2L342.6 191.5C341.5 190.4 341.8 189.7 343.3 189.4L353.9 187.6L358.9 178.1C359.6 176.7 360.4 176.7 361.1 178.1L366.1 187.6L373.3 188.8"/>
      <path d="M878.9 332.1Q880 330 881.1 332.1L886.1 341.6L896.7 343.4Q899 343.8 897.4 345.5L889.9 353.2L891.4 363.8Q891.8 366.2 889.6 365.1L880 360.4L870.4 365.1Q868.2 366.2 868.6 363.8L870.1 353.2L862.6 345.5Q861 343.8 863.3 343.4L873.9 341.6Z"/>
      <path d="M560 598C607 622.7 667.7 636.3 760.4 641.3M891.4 643.3C927.3 642.9 966.7 641.7 1010 640"/>
      <ellipse cx="250" cy="810" rx="30" ry="13"/>
      <ellipse cx="290" cy="868" rx="38" ry="16"/>
      <ellipse cx="345" cy="930" rx="44" ry="18"/>
      <ellipse cx="402" cy="980" rx="42" ry="16"/>
      <path d="M232 650.3L232 777.2"/>
      <path d="M260 650.3L260 777.2"/>
      <path d="M134.6 598L197.4 598"/>
      <path d="M166 566.6L166 629.4"/>
      <path d="M286.6 572L349.4 572"/>
      <path d="M318 540.6L318 603.4"/>
      <circle cx="104" cy="420" r="28"/>
      <circle cx="200" cy="362" r="22"/>
      <circle cx="300" cy="418" r="32"/>
      <circle cx="186" cy="456" r="16"/>
      <circle cx="352" cy="470" r="12"/>
      <circle cx="66" cy="468" r="12"/>
      <circle cx="872" cy="680" r="17"/>
      <circle cx="760" cy="580" r="18"/>
      <circle cx="830" cy="548" r="15"/>
      <circle cx="895" cy="586" r="20"/>
      <circle cx="438" cy="710" r="11"/>
      <circle cx="470" cy="714" r="10"/>
      <path d="M690 730L682.5 705.8M702 728L708 702"/>
      <path d="M692 756C697.3 760 702.7 759.3 708 754"/>
      <path d="M642 746C632 746 632 732 644 732C660 732 662 754 644 758C622 762 614 736 626 724C636 714 656 714 664 724"/>
      <path d="M127.9 864.7C128.7 864.7 129.5 864.6 130.4 864.6C145.2 864.6 157.3 871.5 157.3 880C157.3 888.5 145.2 895.4 130.4 895.4C129.5 895.4 128.7 895.3 127.9 895.3"/>
      <path d="M112.3 885.8C118 887.1 124.4 890.7 130 896.3C140.5 906.8 144.2 920.2 138.2 926.2C135.6 928.8 131.6 929.5 127.1 928.8M114.6 923.3C112.4 921.8 110.3 920 108.3 918C107.7 917.4 107.1 916.8 106.5 916.2"/>
      <path d="M102.3 898.5C105.4 903.4 107.4 910.5 107.4 918.4C107.4 922.2 106.9 925.8 106.1 929.1M95.2 944.7C94.2 945.1 93.1 945.3 92 945.3C83.5 945.3 76.6 933.2 76.6 918.4C76.6 917.5 76.7 916.7 76.7 915.9"/>
      <path d="M86.2 900.3C84.9 906 81.3 912.4 75.7 918C65.2 928.5 51.8 932.2 45.8 926.2C39.8 920.2 43.5 906.8 54 896.3C54.6 895.7 55.2 895.1 55.8 894.5"/>
      <path d="M73.5 890.3C68.6 893.4 61.5 895.4 53.6 895.4C38.8 895.4 26.7 888.5 26.7 880C26.7 871.5 38.8 864.6 53.6 864.6C54.5 864.6 55.3 864.7 56.1 864.7"/>
      <path d="M71.7 874.2C66 872.9 59.6 869.3 54 863.7C43.5 853.2 39.8 839.8 45.8 833.8C51.8 827.8 65.2 831.5 75.7 842C76.3 842.6 76.9 843.2 77.5 843.8"/>
      <path d="M81.7 861.5C78.6 856.6 76.6 849.5 76.6 841.6C76.6 826.8 83.5 814.7 92 814.7C100.5 814.7 107.4 826.8 107.4 841.6C107.4 842.5 107.3 843.3 107.3 844.1"/>
      <path d="M97.8 859.7C99.1 854 102.7 847.6 108.3 842C118.8 831.5 132.2 827.8 138.2 833.8C144.2 839.8 140.5 853.2 130 863.7C124.4 869.3 118 872.9 112.3 874.2"/>
      <circle cx="92" cy="880" r="21.8"/>
      <path d="M92 960C92.9 936.2 106.7 921.5 133.3 915.9C124.4 940.1 110.6 954.8 92 960Z"/>
      <path d="M92 975C72.7 985.1 54.7 980.9 38.1 962.4C61.4 958.4 79.3 962.6 92 975Z"/>
      <path d="M632.9 888.2C637.3 889.6 641.5 891.7 644.9 894.4C650.7 899 653.3 904.5 651.8 908.8C650.2 913.2 644.6 915.7 637.3 915.5C632.9 915.4 628.3 914.3 624.1 912.5"/>
      <path d="M614.3 900.4C615.9 901.4 617.5 902.7 619.1 904.3C624.1 909.7 627.8 917.6 628.7 924.9C629.1 928.3 628.8 931.3 628.1 933.8M617.3 940.3C614.3 939.5 611.2 937.5 608.3 934.4C605.3 931.2 602.8 927.2 601.1 922.9"/>
      <path d="M602.8 907.5C603.2 909.3 603.4 911.4 603.3 913.6C603.1 921 600.2 929.1 595.6 934.9C591 940.7 585.5 943.3 581.2 941.8C576.8 940.2 574.3 934.6 574.5 927.3C574.6 922.9 575.7 918.3 577.5 914.1"/>
      <path d="M589.6 904.3C588.6 905.9 587.3 907.5 585.7 909.1C580.3 914.1 572.4 917.8 565.1 918.7C557.8 919.5 552 917.5 550.1 913.3C548.1 909.1 550.2 903.4 555.6 898.3C558.8 895.3 562.8 892.8 567.1 891.1"/>
      <path d="M582.5 892.8C580.7 893.2 578.6 893.4 576.4 893.3C569 893.1 560.9 890.2 555.1 885.6C549.3 881 546.7 875.5 548.2 871.2C549.8 866.8 555.4 864.3 562.7 864.5C567.1 864.6 571.7 865.7 575.9 867.5"/>
      <path d="M585.7 879.6C584.1 878.6 582.5 877.3 580.9 875.7C575.9 870.3 572.2 862.4 571.3 855.1C570.5 847.8 572.5 842 576.7 840.1C580.9 838.1 586.6 840.2 591.7 845.6C594.7 848.8 597.2 852.8 598.9 857.1"/>
      <path d="M597.2 872.5C596.8 870.7 596.6 868.6 596.7 866.4C596.9 859 599.8 850.9 604.4 845.1C609 839.3 614.5 836.7 618.8 838.2C623.2 839.8 625.7 845.4 625.5 852.7C625.4 857.1 624.3 861.7 622.5 865.9"/>
      <path d="M610.4 875.7C611.4 874.1 612.7 872.5 614.3 870.9C619.7 865.9 627.6 862.2 634.9 861.3C642.2 860.5 648 862.5 649.9 866.7C651.9 870.9 649.8 876.6 644.4 881.7C639 886.8 631.2 890.4 623.8 891.3C621.6 891.5 619.5 891.5 617.6 891.3"/>
      <circle cx="600" cy="890" r="18.4"/>
      <path d="M606 960C610.2 940.6 623.6 930.6 646.3 929.8C635.5 948.4 622 958.4 606 960Z"/>
      <path d="M950.8 856.7C964.5 857.4 975.3 864 975.3 872C975.3 880 964.5 886.6 950.8 887.3"/>
      <path d="M930.8 876C936.6 876.8 943.2 879.8 949.3 884.9C960.7 894.5 965.5 907.5 960 914C954.9 920.1 942.4 918.2 931.4 910"/>
      <path d="M923.4 888.4C927.3 892.7 930.4 899.4 931.8 907.1C934.4 921.8 929.7 934.8 921.3 936.3C913.4 937.7 905.1 928.2 902 914.9"/>
      <path d="M909.7 893.2C909.9 899 908 906.1 904.1 912.9C896.7 925.8 884.7 932.8 877.4 928.5C870.4 924.5 870.1 911.9 876.3 899.7"/>
      <path d="M896.1 888C892.6 892.6 886.6 896.9 879.2 899.6C865.2 904.6 851.6 902.3 848.7 894.3C845.9 886.8 853.8 876.9 866.4 871.6"/>
      <path d="M889.1 875.4C883.4 876.6 876.1 876 868.7 873.3C854.7 868.2 845.8 857.6 848.7 849.7C851.4 842.1 863.7 839.6 876.9 843.7"/>
      <path d="M891.8 861.1C886.7 858.4 881.4 853.2 877.5 846.4C870.1 833.6 870 819.7 877.4 815.5C884.3 811.5 895.4 817.5 902.8 829"/>
      <path d="M903 852C900.9 846.6 900.2 839.3 901.5 831.5C904.1 816.9 913 806.2 921.3 807.7C929.2 809.1 933.8 820.8 932.2 834.4"/>
      <path d="M917.5 852.2C919.3 846.7 923.5 840.6 929.5 835.6C940.9 826 954.6 823.5 960 830C965.5 836.5 960.7 849.5 949.3 859.1C943.2 864.2 936.6 867.2 930.8 868"/>
      <circle cx="910" cy="872" r="21.8"/>
      <path d="M908 956C887.2 962.6 870.3 955.4 857.1 934.2C880.7 934.3 897.7 941.6 908 956Z"/>
      <path d="M751.4 892.6Q747.0 936.6 780 938.8Q813.0 936.6 808.6 892.6L793.2 908.0L780 886.0L766.8 908.0Z"/>
      <path d="M496.6 929.4Q493.0 965.4 520 967.2Q547.0 965.4 543.4 929.4L530.8 942.0L520 924.0L509.2 942.0Z"/>
      <path d="M146.6 929.4Q143.0 965.4 170 967.2Q197.0 965.4 193.4 929.4L180.8 942.0L170 924.0L159.2 942.0Z"/>
      <path d="M30 770Q28 756 18 746M44 770Q43 752 47 736M58 770Q61 757 71 748"/>
      <path d="M410 880Q408 866 398 856M424 880Q423 862 427 846M438 880Q441 867 451 858"/>
      <path d="M702 910Q700 896 690 886M716 910Q715 892 719 876M730 910Q733 897 743 888"/>
      <path d="M948 770Q946 756 936 746M962 770Q961 752 965 736M976 770Q979 757 989 748"/>
      <path d="M526 790Q524 776 514 766M540 790Q539 772 543 756M554 790Q557 777 567 768"/>
      <path d="M525 297.5C526.3 287.1 464.8 236.7 447 228.6C429.2 220.5 419.7 239 418.4 249.4C417.1 259.8 421.4 282.9 439.2 291C457 299.1 523.7 307.9 525 297.5Z"/>
      <path d="M655 297.5C653.7 287.1 715.2 236.7 733 228.6C750.8 220.5 760.3 239 761.6 249.4C762.9 259.8 758.6 282.9 740.8 291C723 299.1 656.3 307.9 655 297.5Z"/>
      <ellipse cx="457.4" cy="410.6" rx="24" ry="10" transform="rotate(-30 457.4 410.6)"/>
      <ellipse cx="722.6" cy="410.6" rx="24" ry="10" transform="rotate(30 722.6 410.6)"/>
      <path d="M551 418.4C556.2 395.9 564 375.1 574.4 356M629 418.4C623.8 395.9 616 375.1 605.6 356"/>
      <path d="M579.6 270.2C586.5 276.3 593.5 276.3 600.4 270.2"/>
      <path d="M439 503.9Q440 502 441 503.9L445.3 512.7L455 514.1Q457.1 514.4 455.6 515.9L448.6 522.8L450.2 532.4Q450.6 534.6 448.7 533.6L440 529L431.3 533.6Q429.4 534.6 429.8 532.4L431.4 522.8L424.4 515.9Q422.9 514.4 425 514.1L434.7 512.7Z"/>
      <path d="M825 413.9Q826 412 827 413.9L831.3 422.7L841 424.1Q843.1 424.4 841.6 425.9L834.6 432.8L836.2 442.4Q836.6 444.6 834.7 443.6L826 439L817.3 443.6Q815.4 444.6 815.8 442.4L817.4 432.8L810.4 425.9Q808.9 424.4 811 424.1L820.7 422.7Z"/>
      <path d="M499 123.9Q500 122 501 123.9L505.3 132.7L515 134.1Q517.1 134.4 515.6 135.9L508.6 142.8L510.2 152.4Q510.6 154.6 508.7 153.6L500 149L491.3 153.6Q489.4 154.6 489.8 152.4L491.4 142.8L484.4 135.9Q482.9 134.4 485 134.1L494.7 132.7Z"/>
    </g>
    <path fill="#111" stroke="none" d="M194 60C194 56.7 196.7 54 200 54C203.3 54 206 56.7 206 60C206 63.3 203.3 66 200 66C196.7 66 194 63.3 194 60Z"/>
    <path fill="#111" stroke="none" d="M414 120C414 116.7 416.7 114 420 114C423.3 114 426 116.7 426 120C426 123.3 423.3 126 420 126C416.7 126 414 123.3 414 120Z"/>
    <path fill="#111" stroke="none" d="M924 120C924 116.7 926.7 114 930 114C933.3 114 936 116.7 936 120C936 123.3 933.3 126 930 126C926.7 126 924 123.3 924 120Z"/>
    <path fill="#111" stroke="none" d="M324 268C324 264.7 326.7 262 330 262C333.3 262 336 264.7 336 268C336 271.3 333.3 274 330 274C326.7 274 324 271.3 324 268Z"/>
    <path fill="#111" stroke="none" d="M974 440C974 436.7 976.7 434 980 434C983.3 434 986 436.7 986 440C986 443.3 983.3 446 980 446C976.7 446 974 443.3 974 440Z"/>
    <path fill="#111" stroke="none" d="M154 230C154 226.7 156.7 224 160 224C163.3 224 166 226.7 166 230C166 233.3 163.3 236 160 236C156.7 236 154 233.3 154 230Z"/>
    <path fill="#111" stroke="none" d="M276 730C272.7 730 270 732.7 270.1 736C270.1 739.3 272.7 742 276.1 742C279.4 742 282 739.3 282 736C282.1 732.7 279.4 730 276.1 730Z"/>
    <path fill="#111" stroke="none" d="M838 750C835.2 750 833 752.3 833.1 755C833.1 757.8 835.3 760 838 760C840.8 760 843 757.8 843 755C843.1 752.3 840.9 750 838.1 750Z"/>
    <path fill="#111" stroke="none" d="M675 700C675 696.7 677.7 694 681 694C684.3 694 687 696.7 687 700C687 703.3 684.3 706 681 706C677.7 706 675 703.3 675 700ZM703 698C703 694.7 705.7 692 709 692C712.3 692 715 694.7 715 698C715 701.3 712.3 704 709 704C705.7 704 703 701.3 703 698Z"/>
    <path fill="#111" stroke="none" d="M694.5 742C694.5 739.5 696.5 737.5 699 737.5C701.5 737.5 703.5 739.5 703.5 742C703.5 744.5 701.5 746.5 699 746.5C696.5 746.5 694.5 744.5 694.5 742Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M556.2 249.4C556.2 240.1 562 232.5 569.2 232.5C576.4 232.5 582.2 240.1 582.2 249.4C582.2 258.7 576.4 266.3 569.2 266.3C562 266.3 556.2 258.7 556.2 249.4ZM558.8 241.6C558.8 238 561.7 235.1 565.3 235.1C568.9 235.1 571.8 238 571.8 241.6C571.8 245.2 568.9 248.1 565.3 248.1C561.7 248.1 558.8 245.2 558.8 241.6Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M597.8 249.4C597.8 240.1 603.6 232.5 610.8 232.5C618 232.5 623.8 240.1 623.8 249.4C623.8 258.7 618 266.3 610.8 266.3C603.6 266.3 597.8 258.7 597.8 249.4ZM600.4 241.6C600.4 238 603.3 235.1 606.9 235.1C610.5 235.1 613.4 238 613.4 241.6C613.4 245.2 610.5 248.1 606.9 248.1C603.3 248.1 600.4 245.2 600.4 241.6Z"/>
  </g>
</svg>
`,fe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="10">
      <circle cx="860" cy="125" r="50"/>
      <path d="M76 151.8C74.7 148.1 74 144.1 74 140C74 120.1 90.1 104 110 104C112.3 104 114.5 104.2 116.6 104.6"/>
      <path d="M115.8 105.1C121.4 86 139.1 72 160 72C181.7 72 199.9 87.1 204.8 107.3"/>
      <path d="M204.1 106.9C206.6 106.3 209.3 106 212 106C231.9 106 248 122.1 248 142C248 145.8 247.4 149.5 246.3 152.9"/>
      <path d="M246.2 151C247.4 153.4 248 156.1 248 159L248 159C248 169.5 239.5 178 229 178L93 178C82.5 178 74 169.5 74 159L74 159C74 155.9 74.8 152.9 76.1 150.3"/>
      <path d="M-10 560L228.9 560M685.3 560L774.2 560M801.1 560L1010 560"/>
      <path d="M281 498.3C267.7 496.3 246.6 482.2 244.8 469.4C242.9 455.9 269.1 437.7 271.7 417.8C274.3 398 258.6 373.4 260.5 350.6C262.4 327.9 279.9 306.2 282.9 281.2C285.9 256.2 276.2 228.6 278.4 200.6C280.6 172.6 283.7 138.2 296.3 113.2C309 88.2 329.6 63.1 354.6 50.5C379.5 37.8 415.8 37 446.4 37C477 37 513.3 37.8 538.2 50.5C563.2 63.1 583.8 88.2 596.5 113.2C609.1 138.2 612.2 172.6 614.4 200.6C616.6 228.6 606.9 256.2 609.9 281.2C612.9 306.2 630.4 327.9 632.3 350.6C634.2 373.4 618.5 398 621.1 417.8C623.7 437.7 649.9 455.9 648 469.4C646.6 479.3 633.7 490 621.7 495.2"/>
      <path d="M155.2 805.7C125 757.9 192.7 671.2 202.2 628.4C213.8 576.5 234.4 545.9 258.2 518.6C272.7 502.1 290.3 489.9 308.9 480.4M341.5 466.4C342.9 465.9 344.2 465.4 345.6 464.9C358.1 460.4 370.9 457.4 384 455.3M509.6 453.7C523 455 536.2 457 548.7 460M595.8 478.4C619 490.8 640.1 507.2 659.2 527.6C675.2 544.7 689.9 563 703.2 585.5M780.8 724.4C795.3 748.3 806.6 772.3 805.3 792.1"/>
      <path d="M398.9 425.9C398.3 426.2 397.7 426.5 397.1 426.8C378.4 437.1 384 466.9 383.7 488.4C383.3 509.9 384.8 533.8 394.9 555.6C405 577.4 420.6 601 444.2 619.4C467.7 637.9 502.7 656.7 536 666.5C568.4 676 621.7 686.1 642 678.3M647.3 609.7C632 597.5 590.9 597.6 571.8 585.8C551.3 573.2 536.8 553.7 527 536.6C517.3 519.4 518.9 501.1 513.6 482.8C508.3 464.5 515.1 436.1 495.7 426.8C495.1 426.5 494.5 426.3 493.9 426"/>
      <path d="M627.8 617.2C690.6 592.6 748.8 559 802.6 554.5C798.1 597 769 628.4 742.1 644.1C773.4 662 800.3 691.1 811.5 727C751 727 692.8 702.3 630.1 673.2Z"/>
      <path d="M403.3 311.5C402.2 308.9 400.9 306.9 399.4 305.8C392.3 301 373.6 306.6 363.5 317C353.4 327.5 347.5 351.8 338.9 368.6C330.3 385.4 321.3 404.7 312 417.8C302.7 430.9 287.7 437.7 282.9 447C278.1 456.3 275 468.2 282.9 473.8C290.7 479.4 319.1 483.9 329.9 480.6C340.8 477.2 341.5 464.9 347.8 453.7C354.2 442.5 361.3 426 368 413.4C374.7 400.7 381.8 388.7 388.2 377.5C388.5 377 388.8 376.4 389.1 375.9"/>
      <path d="M489.5 311.5C490.6 308.9 491.9 306.9 493.4 305.8C500.5 301 519.2 306.6 529.3 317C539.4 327.5 545.3 351.8 553.9 368.6C562.5 385.4 571.5 404.7 580.8 417.8C590.1 430.9 605.1 437.7 609.9 447C614.7 456.3 617.8 468.2 609.9 473.8C602.1 479.4 573.7 483.9 562.9 480.6C552 477.2 551.3 464.9 545 453.7C538.6 442.5 531.5 426 524.8 413.4C518.1 400.7 511 388.7 504.6 377.5C504.3 377 504 376.4 503.7 375.9"/>
      <path d="M402.5 311.2C431.8 302.6 461 302.6 490.3 311.2M504.3 375.9C500.1 395.1 494.6 414.6 493.4 435.8L399.4 435.8C398.2 414.6 392.7 395.1 388.5 375.9"/>
      <path d="M546.8 168.9C547.1 172 547.2 175 547.2 178.2C547.2 233.8 502.1 279 446.4 279C390.7 279 345.6 233.8 345.6 178.2C345.6 174.8 345.8 171.5 346.1 168.2"/>
      <path d="M545 180.4C533 150.5 515.8 132.6 493.4 126.6C478.5 149 462.8 148.3 446.4 124.4C430 148.3 414.3 149 399.4 126.6C377 135.6 359.8 154.3 347.8 182.6"/>
      <path d="M-10 800Q60 784 125 800T250 800T375 800T500 800T625 800T750 800T875 800T1010 800"/>
    </g>
    <g stroke-width="7">
      <path d="M924.7 151.8L945 160.2"/>
      <path d="M886.8 189.7L895.2 210"/>
      <path d="M833.2 189.7L824.8 210"/>
      <path d="M795.3 151.8L775 160.2"/>
      <path d="M795.3 98.2L775 89.8"/>
      <path d="M833.2 60.3L824.8 40"/>
      <path d="M886.8 60.3L895.2 40"/>
      <path d="M924.7 98.2L945 89.8"/>
      <path d="M640 170Q660 150 680 170Q700 150 720 170"/>
      <path d="M700 250Q716 234 732 250Q748 234 764 250"/>
      <path d="M50 620Q65 606 80 620Q95 606 110 620"/>
      <path d="M66 724Q81 710 96 724Q111 710 126 724"/>
      <path d="M830 620Q845 606 860 620Q875 606 890 620"/>
      <path d="M870 700Q885 686 900 700Q915 686 930 700"/>
      <path d="M890 760Q905 746 920 760Q935 746 950 760"/>
      <path d="M298.6 236.4C297.4 249.5 295.2 290.5 291.8 314.8C288.5 339.1 280.6 370.8 278.4 382"/>
      <path d="M594.2 236.4C595.4 249.5 597.6 290.5 601 314.8C604.3 339.1 612.2 370.8 614.4 382"/>
      <path d="M258.2 583.6C273.2 597 279.1 614.2 276.2 635.1"/>
      <path d="M381.3 458.1C388.1 451.5 394.8 452.3 401.6 460.4C409.1 469.4 416.5 469.4 424 460.4C431.5 451.4 438.9 451.4 446.4 460.4C453.9 469.4 461.3 469.4 468.8 460.4C476.3 451.4 483.7 451.4 491.2 460.4C498.4 469.1 505.7 469.4 512.9 461.2"/>
      <path d="M421.8 505.2C430.7 515.7 439.7 515.7 448.6 505.2"/>
      <path d="M455.4 527.6C464.3 538.1 473.3 538.1 482.2 527.6"/>
      <path d="M438.6 566.8C447.5 577.3 456.5 577.3 465.4 566.8"/>
      <path d="M483.4 589.2C492.3 599.7 501.3 599.7 510.2 589.2"/>
      <path d="M522.6 617.2C531.5 627.7 540.5 627.7 549.4 617.2"/>
      <path d="M561.8 628.4C570.7 638.9 579.7 638.9 588.6 628.4"/>
      <path d="M670.4 634L743.2 597M672.6 656.4L748.8 690"/>
      <path d="M461 274.9L461 307.8M431.8 307.8L431.8 274.9"/>
      <path d="M398.2 343.9C401.2 333.5 406.1 330.1 412.8 333.8C418 325.6 423.3 325.6 428.5 333.8C435.2 330.1 440.1 333.5 443 343.9C437.1 360.3 430.7 371.5 424 377.5L417.3 377.5C410.6 371.5 404.2 360.3 398.2 343.9Z"/>
      <path d="M449.8 343.9C452.7 333.5 457.6 330.1 464.3 333.8C469.5 325.6 474.8 325.6 480 333.8C486.7 330.1 491.6 333.5 494.6 343.9C488.6 360.3 482.2 371.5 475.5 377.5L468.8 377.5C462.1 371.5 455.7 360.3 449.8 343.9Z"/>
      <path d="M498.9 62.2C499.7 60.4 500.6 60.4 501.4 62.2L506.8 75L520.5 76.2C522.6 76.4 522.8 77.1 521.3 78.5L510.8 87.6L513.9 101.1C514.4 103 513.7 103.5 512 102.4L500.2 95.3L488.3 102.4C486.6 103.5 485.9 103 486.4 101.1L489.5 87.6L479 78.5C477.5 77.1 477.8 76.4 479.8 76.2L493.6 75Z"/>
      <path d="M394.9 184.9L381.4 175.9M497.9 184.9L511.4 175.9"/>
      <path d="M431.8 238.6C441.5 248.3 451.3 248.3 461 238.6"/>
      <path d="M388.2 243.1C388.2 238.2 394.2 234.2 401.6 234.2C409 234.2 415 238.2 415 243.1C415 248.1 409 252.1 401.6 252.1C394.2 252.1 388.2 248.1 388.2 243.1Z"/>
      <path d="M477.8 243.1C477.8 238.2 483.8 234.2 491.2 234.2C498.6 234.2 504.6 238.2 504.6 243.1C504.6 248.1 498.6 252.1 491.2 252.1C483.8 252.1 477.8 248.1 477.8 243.1Z"/>
      <circle cx="200" cy="880" r="18"/>
      <circle cx="240" cy="930" r="12"/>
      <circle cx="780" cy="870" r="16"/>
      <circle cx="820" cy="920" r="22"/>
      <circle cx="520" cy="900" r="14"/>
      <path d="M334.3 704.8Q336.9 700.6 338 705.4L342.9 727.5L364.8 733.2Q369.6 734.4 365.3 737L345.9 748.5L347.2 771Q347.5 776 343.8 772.7L326.9 757.7L305.8 766Q301.2 767.8 303.2 763.2L312.2 742.5L297.8 725.1Q294.7 721.2 299.6 721.7L322.1 723.8Z"/>
    </g>
    <g stroke-width="6">
      <path d="M420.6 360.7L420.6 346.2"/>
      <path d="M472.2 360.7L472.2 346.2"/>
    </g>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M387 200.6C387 214.8 395.6 226.3 406.1 226.3C416.6 226.3 425.1 214.8 425.1 200.6C425.1 186.3 416.6 174.8 406.1 174.8C395.6 174.8 387 186.3 387 200.6ZM392.1 190.5C392.1 195.1 395.8 198.9 400.5 198.9C405.1 198.9 408.9 195.1 408.9 190.5C408.9 185.8 405.1 182.1 400.5 182.1C395.8 182.1 392.1 185.8 392.1 190.5Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M467.7 200.6C467.7 214.8 476.2 226.3 486.7 226.3C497.2 226.3 505.8 214.8 505.8 200.6C505.8 186.3 497.2 174.8 486.7 174.8C476.2 174.8 467.7 186.3 467.7 200.6ZM472.7 190.5C472.7 195.1 476.5 198.9 481.1 198.9C485.8 198.9 489.5 195.1 489.5 190.5C489.5 185.8 485.8 182.1 481.1 182.1C476.5 182.1 472.7 185.8 472.7 190.5Z"/>
  </g>
</svg>
`,pe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="14">
      <path d="M55 662.6L55 630C55 384.2 254.2 185 500 185C745.8 185 945 384.2 945 630L945 662.6"/>
      <path d="M107 590.4C126.8 390.9 295.2 235 500 235C704.8 235 873.2 390.9 893 590.4"/>
      <path d="M168.8 533.2C210.6 389.8 343.1 285 500 285C656.9 285 789.4 389.8 831.2 533.2"/>
      <path d="M220.3 536C259.6 419.1 370 335 500 335C630 335 740.4 419.1 779.7 536"/>
      <path d="M289.5 504.6C332.3 433 410.5 385 500 385C589.5 385 667.7 433 710.5 504.6"/>
      <path d="M340.5 517.8C375.8 467.7 434.1 435 500 435C565.9 435 624.2 467.7 659.5 517.8"/>
      <path d="M376.1 554.7C401.5 512.9 447.5 485 500 485C552.5 485 598.5 512.9 623.9 554.7"/>
      <path d="M50.5 730.5C46.3 721.2 44 710.9 44 700C44 664.2 69.4 634.4 103.1 627.5"/>
      <path d="M102.6 628.2C102.2 624.8 102 621.4 102 618C102 569.4 141.4 530 190 530C201.1 530 211.6 532 221.4 535.8"/>
      <path d="M220.4 536C238 516.4 263.6 504 292 504C345 504 388 547 388 600C388 600.8 388 601.6 388 602.4"/>
      <path d="M387.4 601.7C419.8 608.7 444 637.5 444 672C444 683.4 441.4 694.1 436.7 703.6"/>
      <path d="M436.8 702.2C438.9 708.4 440 715.1 440 722L440 738C440 772.2 412.2 800 378 800L112 800C77.8 800 50 772.2 50 738L50 727.1"/>
      <path d="M896.9 627.5C930.6 634.4 956 664.2 956 700C956 710.9 953.7 721.2 949.5 730.5"/>
      <path d="M778.6 535.8C788.4 532 798.9 530 810 530C858.6 530 898 569.4 898 618C898 621.4 897.8 624.8 897.4 628.2"/>
      <path d="M612 602.4C612 601.6 612 600.8 612 600C612 547 655 504 708 504C736.4 504 762 516.4 779.6 536"/>
      <path d="M563.3 703.6C558.6 694.1 556 683.4 556 672C556 637.5 580.2 608.7 612.6 601.7"/>
      <path d="M950 727.1L950 738C950 772.2 922.2 800 888 800L622 800C587.8 800 560 772.2 560 738L560 722C560 715.1 561.1 708.4 563.2 702.2"/>
    </g>
    <g stroke-width="10">
      <path d="M222 742Q250 772 278 742"/>
      <path d="M778 742Q750 772 722 742"/>
    </g>
    <g stroke-width="9">
      <ellipse cx="140" cy="752" rx="26" ry="18"/>
      <ellipse cx="360" cy="752" rx="26" ry="18"/>
      <ellipse cx="860" cy="752" rx="26" ry="18"/>
      <ellipse cx="640" cy="752" rx="26" ry="18"/>
    </g>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M169 700C169 714.4 180.6 726 195 726C209.4 726 221 714.4 221 700C221 685.6 209.4 674 195 674C180.6 674 169 685.6 169 700ZM177 691C177 696.5 181.5 701 187 701C192.5 701 197 696.5 197 691C197 685.5 192.5 681 187 681C181.5 681 177 685.5 177 691Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M279 700C279 714.4 290.6 726 305 726C319.4 726 331 714.4 331 700C331 685.6 319.4 674 305 674C290.6 674 279 685.6 279 700ZM287 691C287 696.5 291.5 701 297 701C302.5 701 307 696.5 307 691C307 685.5 302.5 681 297 681C291.5 681 287 685.5 287 691Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M779 700C779 714.4 790.6 726 805 726C819.4 726 831 714.4 831 700C831 685.6 819.4 674 805 674C790.6 674 779 685.6 779 700ZM787 691C787 696.5 791.5 701 797 701C802.5 701 807 696.5 807 691C807 685.5 802.5 681 797 681C791.5 681 787 685.5 787 691Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M669 700C669 714.4 680.6 726 695 726C709.4 726 721 714.4 721 700C721 685.6 709.4 674 695 674C680.6 674 669 685.6 669 700ZM677 691C677 696.5 681.5 701 687 701C692.5 701 697 696.5 697 691C697 685.5 692.5 681 687 681C681.5 681 677 685.5 677 691Z"/>
  </g>
</svg>
`,me=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
  <g transform="translate(0 14)">
    <g stroke-width="14">
      <path d="M245.9 558.6C234.6 548.1 218.6 543.2 205 538C185 530.3 156.8 526.7 138 532C119.2 537.3 102.3 552 92 570C81.7 588 76.3 615.8 76 640C75.7 664.2 81.3 693 90 715C98.7 737 113.3 757.5 128 772C142.7 786.5 162.3 798 178 802C193.7 806 222 796 222 796C222 796 201.3 779.3 200 768C198.7 756.7 205.7 741 214 728C218.4 721 226.4 717.8 233.9 712.5"/>
      <path d="M318.6 856.4C323.5 862.8 331.7 866 343 866L357 866C377 866 387 856 387 836L388.7 775.8"/>
      <path d="M483.2 774.4L485 836C485 856 495 866 515 866L529 866C539 866 546.4 863.5 551.4 858.6"/>
      <path d="M241.5 721.6L245 860C245 880 255 890 275 890L289 890C309 890 319 880 319 860L321.4 764.5"/>
      <path d="M548.6 762.5L551 860C551 880 561 890 581 890L595 890C615 890 625 880 625 860L628.5 721.4"/>
      <path d="M544.9 470.1C541.3 475.1 536.8 479.3 531.7 482.9M414.7 510.7C395.9 511.5 376.7 512.2 360 515C325.8 520.8 289.2 522.5 265 540C240.8 557.5 220 590.8 215 620C210 649.2 217.5 690.8 235 715C252.5 739.2 285.8 754.5 320 765C354.2 775.5 400 778.8 440 778C480 777.2 526.7 771 560 760C593.3 749 618.7 732.8 640 712C661.3 691.2 677.3 662.8 688 635C698.7 607.2 703.7 572.5 704 545C704.1 532.9 703.2 522.2 701.3 511.7"/>
      <path d="M506.9 158.5C506.3 131.4 512.9 107.3 525 88C552.9 109.5 574.5 136.2 584.6 168.9"/>
      <path d="M660.6 183.5C719.8 203.9 762.7 259.1 764.9 324.7M646.7 480.6C634.9 483.5 622.6 485 610 485C578.6 485 549.4 475.7 525 459.6"/>
      <path d="M693.4 340.5C703.2 335.6 713.9 331.6 725.3 328.8C790.6 312.5 853.8 340.1 866.4 390.5C878.9 440.9 836.1 494.9 770.7 511.2C705.4 527.5 642.2 499.9 629.6 449.5C626.9 438.7 626.8 427.7 628.9 417M632.3 404.4C638.7 386.8 650.9 370.4 667.6 357"/>
      <path d="M584.6 168.7C570.8 162.1 549.3 156.8 535 156C513 154.7 485.5 161 466 172C446.5 183 430.3 204.3 418 222C405.7 239.7 392 278 392 278C392 278 430 280 430 280C430 280 401 310.3 392 330C383 349.7 376 398 376 398C376 398 416 400 416 400C416 400 397.3 442 398 462C398.7 482 409.3 505 420 520C430.7 535 440 547.3 462 552C484 556.7 541 561.7 552 548C563 534.3 534.7 498 528 470C521.3 442 513.7 410 512 380C510.3 350 512 316.3 518 290C524 263.7 534.7 240.3 548 222C554 213.8 565.2 206.7 575.4 200.3"/>
      <path d="M572 200L632 44Q640 30 648 44L662 192Q617 214 572 200Z"/>
    </g>
    <g stroke-width="10">
      <path d="M160 585C154.2 594.2 131 620.8 125 640C119 659.2 119.8 682 124 700C128.2 718 145.7 740 150 748"/>
      <path d="M316.8 826L389.9 826"/>
      <path d="M482.1 826L553.4 826"/>
      <path d="M242.2 850L321.8 850"/>
      <path d="M548.2 850L627.8 850"/>
      <path d="M534 158.6C533.1 145.4 534.6 133.6 538 125"/>
      <path d="M430 280C436.7 277 455 268.7 470 262C485 255.3 503.3 249.5 520 240C529.6 234.5 541.9 225.7 552.3 218.1"/>
      <path d="M416 400C423.3 396.7 446 388.3 460 380C474 371.7 488.3 363.3 500 350C504.6 344.8 509.5 337.2 514 329.4"/>
      <path d="M581.5 168.7C606.7 164.5 632.9 155.3 660 141"/>
      <path d="M604.2 109.7C621.2 106.2 638.2 99.9 655.2 90.7"/>
      <path d="M692 284L712 262M702 300L728 288M676 274L688 250"/>
      <ellipse cx="606" cy="408" rx="27" ry="17"/>
      <path d="M742 468Q785 492 828 458"/>
    </g>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M636 315C636 338.2 650.3 357 668 357C685.7 357 700 338.2 700 315C700 291.8 685.7 273 668 273C650.3 273 636 291.8 636 315ZM644 296C644 302.6 649.4 308 656 308C662.6 308 668 302.6 668 296C668 289.4 662.6 284 656 284C649.4 284 644 289.4 644 296Z"/>
    <path fill="#111" stroke="none" d="M806 383C801 383 797.5 388.3 798.2 394.9C798.9 401.4 803.5 406.7 808.5 406.7C813.6 406.7 817.1 401.4 816.4 394.9C815.7 388.3 811.1 383 806.1 383Z"/>
  </g>
  </g>
</svg>
`,he=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="7" d="M523.9 484.8l 11-1.1 12.9-.4 52 .7M626.8 484.2l 36.9 2.4 18.9 2.1 17.8 2.7 30.4 6.2 35.6 9.9 18.1 5.7 16 5.7 13.9 5.6 12.8 5.8 11.5 6.1 10.2 6.2 8.9 6.4 8.4 7.2 8.4 8.6 8.9 10.7 7.5 10.7 7.2 12 5.8 11.6 5.4 12.9 4.1 12.3 3.1 12.6 1.8 11.9 .7 11-.2 12-1.2 12.9-2 12.8-3.1 13.7-3.7 12.4-4.7 13.2-6.7 15.6-7 13.3-8.7 13.4-10.3 13.5-11.9 13.6-13.4 13.4-14.3 12.5-15.8 12.2-14.9 10.1-15.6 9-16.1 8-17.5 7.3-17.1 5.9-17.3 4.6-15.8 3-15.9 1.5-15 .3-13.9-.7-14.9-1.9-12.7-2.6-13.4-4.1-11.1-4.6-10.5-5.8-9.8-6.9-10.6-9.1-10.4-10.9-10-12.4-9.2-13.1-9.8-16.2-8.8-16.9-6-13.7-5.3-15.1M476.1 484.8l-11-1.1-12.9-.4-52 .7M373.2 484.2l-36.9 2.4-18.9 2.1-17.8 2.7-30.4 6.2-35.6 9.9-18.1 5.7-16 5.7-13.9 5.6-12.8 5.8-11.5 6.1-10.2 6.2-8.9 6.4-8.4 7.2-8.4 8.6-8.9 10.7-7.5 10.7-7.2 12-5.8 11.6-5.4 12.9-4.1 12.3-3.1 12.6-1.8 11.9-.7 11 .2 12 1.2 12.9 2 12.8 3.1 13.7 3.7 12.4 4.7 13.2 6.7 15.6 7 13.3 8.7 13.4 10.3 13.5 11.9 13.6 13.4 13.4 14.3 12.5 15.8 12.2 14.9 10.1 15.6 9 16.1 8 17.5 7.3 17.1 5.9 17.3 4.6 15.8 3 15.9 1.5 15 .3 13.9-.7 14.9-1.9 12.7-2.6 13.4-4.1 11.1-4.6 10.5-5.8 9.8-6.9 10.6-9.1 10.4-10.9 10-12.4 9.2-13.1 9.8-16.2 8.8-16.9 6-13.7 5.3-15.1M537.1 233.6l 11.6-13.8 13.7-14.5 14.5-13.8 14.5-12.3 15.8-12.1 15.7-10.8 17.1-10.3 16-8.4 18.1-8.3 19.6-7.7 19.9-6.6 20.2-5.7 19.5-4.4 18.7-3.2 20.9-2.4 18.9-1.1 18-.1 17 .9 15.8 1.9 14.7 3.1 14.3 4.6 14.7 6.2 13.2 7.1 11.6 7.9 9 7.9 6.5 7.5 5.5 8.4 4.6 10 3.5 11.4 2.7 13.8 1.5 14.9 .5 15-.5 15.9-1.4 14-2.6 14.7-3.5 13.6-4.7 14.2-6 14.8-7.4 15.3-7.8 14-8.8 13.4-10.1 13.6-10.9 13-11.7 12.4-11.7 10.9-12.2 10.3-12.9 9.4-13.5 8.6-15.8 8.7-17.9 8.8-18.4 7.8-20.6 7.7-20 6.5-19.3 5.2-19.5 4.4-19.7 3.6-20.8 2.7-18.9 1.5-25 .6-24-.3-19.9-1.3-15.9-2.1-13.7-2.9-12.3-4.1M531.2 470.6l-10.1-6.4M462.9 233.6l-11.6-13.8-13.7-14.5-14.5-13.8-14.5-12.3-15.8-12.1-15.7-10.8-17.1-10.3-16-8.4-18.1-8.3-19.6-7.7-19.9-6.6-20.2-5.7-19.5-4.4-18.7-3.2-20.9-2.4-18.9-1.1-18-.1-17 .9-15.8 1.9-14.7 3.1-14.3 4.6-14.7 6.2-13.2 7.1-11.6 7.9-9 7.9-6.5 7.5-5.5 8.4-4.2 9-3.6 11.5-2.7 12.7-1.7 14.9-.6 16 .4 15.9 1.3 14 2.4 13.8 3.4 13.6 4.5 14.2 5.9 14.9 7.3 15.4 7.7 14 8.6 13.4 10.1 13.7 10.8 13.1 11.6 12.4 12.3 11.8 13 10.9 12.1 8.8 13.5 8.7 16.6 9.2 17 8.4 19.3 8.2 19.7 7.4 19 6.2 19.3 5.3 19.4 4.5 20.7 3.8 19.8 2.7 19.9 1.6 24 .7 24-.2 18.9-1.1 16.9-2.1 14.7-3 12.4-3.9M468.8 470.6l 10.1-6.4M510.8 417.9l 2.8-9.6M508.2 411.4l 4.8 12 4.7 18.4 4 22.6 3.4 27.8 2.5 30.9 1.6 32.9 .8 35-.2 34-1.2 33.9-2 32-3 29.8-3.7 25.7-4.2 20.6-4.7 15.3-2.4 5.4-2.6 4.3-2.8 2.9-2.7 1.1-2.9-.6-2.3-1.9-3-4-2.6-5.4-4.9-15.2-4.2-19.5-3.9-25.7-3-28.9-2.1-31.9-1.3-33.9-.3-35 .7-35 1.6-33.9 2.4-30.9 3.3-27.8 4.1-23.6 4.6-18.4 2.6-7.6 2.5-5.4M521.4 287.7l 4.6 7.8 3.5 8.3 2.9 9.5 2 9.8 1.2 9.9 .4 11-.4 11-1.4 10.9-2.3 10.7-3.1 9.5-3.8 8.2-4.2 6.8-4.5 5.3-5.4 4.3-5.5 2.5-5.9 .8-5.9-1.1-5.3-2.7-5.3-4.5-4.4-5.4-4.1-6.9-3.6-8.2-3-9.6-2.1-9.7-1.4-10.9-.4-10 .4-11 1.2-10.9 2-9.8 2.9-9.5 4-9.2 4.1-6.9M542 252l-1 8.9-2.4 7.6-3.8 7-5.1 6.2-7 5.6-7.1 3.7-7.7 2.2-7.9 .8-7.9-.8-8.6-2.6-7-3.8-6.2-5.1-5.1-6.2-4.2-7.9-2.2-7.7-.8-7.9 .8-7.9 2.2-7.7 4.2-7.9 5.1-6.2 6.2-5.1 7-3.8 8.6-2.6 7.9-.8 7.9 .8 7.7 2.2 7.1 3.7 7 5.6 5.1 6.2 3.8 7 2.4 7.6z"/>
    <path stroke-width="6" d="M527.9 541l 8.9-1.3 13-.5 76 1 32.9 2.2 31.7 4.1 15.7 3 15.6 3.6 24.1 6.7 20.9 6.5 15.1 5.4 13.9 5.7 11.7 5.7 10.3 6 8 6 6.5 6.3 7 8.4 6.7 10 5.8 10.5 4.8 10.9 3.5 10.5 2.3 10.7 .8 9-.2 10-1.3 10.9-2.1 10.8-3.1 11.6-3.9 11.3-4.7 11-5.5 10.7-8.2 12.5-10.7 13.2-12.4 13-14.1 12.7-14.3 11-14.2 9.4-14.9 8.1-16.4 7.4-16.9 6.2-15.4 4.2-13.8 2.4-14.9 .9-16-.6-13.8-2.2-12.5-3.7-5.5-2.4-5.2-2.9-7.2-5.4-7.8-7.7-8.4-10-7.5-10.5-7.9-12.8-7.5-14.1-4.8-11-4-11.3-5.7-21.2-5.1-25.5-3.5-22.8-5.9-44.5-9-56.3-2.2-17.9-1.1-13.9-.2-12 .9-9-3.4 5-4.4 4.1M570.9 568.2l-6.9 7.2-8.7 6.7-7.8 4.5-8.3 3.1 15.9-.4 74 1.1 27.9 2 25.8 3.5 13.7 2.6 13.6 3.2 22.2 6.2 18.1 5.7 13.2 4.7 12 4.9 9.9 4.9 6.8 4.2 3.6 3.5 3.7 4.6 6.8 11.1 5 12 1.4 5.8 .4 4-.3 6-1.1 7.9-1.8 7.8-2.6 8.6-6.1 14.8-3.3 6.1-4 5.8-6.8 8.6-7.4 8.1-8.7 8.3-9.1 7.8-8.8 6.6-9.2 6.1-9.5 5.4-9.9 4.8-10.2 4.3-10.3 3.6-9.7 2.6-8.8 1.6-10 .6-10-.3-8.9-1.4-6.4-2.1-5.2-4.7-6.4-7.7-5.7-8.1-6.2-10.3-8-16.1-3.3-9.5-3-10.5-3.7-16.6-3.3-18.7-8.2-59.4-8.8-55.3-2.7-22.8-.5-15-1.8 6.5-3.2 7.4-4 6.9zM766.7 685.3l-.3 6-1 6.9-1.7 6.8-2 5.6-3.1 6.3-3.1 5.1-3.5 4.9-4.7 5.1-5.2 4.7-4.9 3.5-6 3.6-5.4 2.5-5.7 2.1-6.7 1.7-7 .9-5.9 .3-12-1.1-5.8-1.4-6.6-2.3-5.5-2.5-6-3.5-5.7-4.1-4.4-4-4.1-4.4-4.2-5.6-3.2-5.1-3.1-6.2-2.3-6.6-1.5-5.8-1-5.9-.4-7 .3-7 .9-5.9 1.7-6.8 2-5.7 2.5-5.4 3.5-6 4.2-5.7 4-4.4 5.1-4.7 4.9-3.6 5.1-3.1 6.3-3.1 6.5-2.3 5.9-1.5 6.9-1 6-.3 5.9 .2 7 1 6.7 1.7 5.7 2 5.4 2.6 6 3.5 4.9 3.6 5.2 4.6 4.7 5.2 3.5 4.8 3.1 5.2 3.1 6.3 2 5.6 1.7 6.8 1 6.9zM472.1 541l-8.9-1.3-13-.5-76 1-32.9 2.2-31.7 4.1-15.7 3-15.6 3.6-24.1 6.7-20.9 6.5-15.1 5.4-13.9 5.7-11.7 5.7-10.3 6-8 6-6.5 6.3-7 8.4-6.7 10-5.8 10.5-4.8 10.9-3.5 10.5-2.3 10.7-.8 9 .2 10 1.3 10.9 2.1 10.8 3.1 11.6 3.9 11.3 4.7 11 5.5 10.7 8.2 12.5 10.7 13.2 12.4 13 14.1 12.7 14.3 11 14.2 9.4 14.9 8.1 16.4 7.4 16.9 6.2 15.4 4.2 13.8 2.4 14.9 .9 16-.6 13.8-2.2 12.5-3.7 5.5-2.4 5.2-2.9 7.2-5.4 7.8-7.7 8.4-10 7.5-10.5 7.9-12.8 7.5-14.1 4.8-11 4-11.3 5.7-21.2 5.1-25.5 3.5-22.8 5.9-44.5 9-56.3 2.2-17.9 1.1-13.9 .2-12-.9-9 3.4 5 4.4 4.1M429.1 568.2l 6.9 7.2 8.7 6.7 7.8 4.5 8.3 3.1-15.9-.4-74 1.1-27.9 2-25.8 3.5-13.7 2.6-13.6 3.2-22.2 6.2-18.1 5.7-13.2 4.7-12 4.9-9.9 4.9-6.8 4.2-3.6 3.5-3.7 4.6-6.8 11.1-5 12-1.4 5.8-.4 4 .3 6 1.1 7.9 1.8 7.8 2.6 8.6 6.1 14.8 3.3 6.1 4 5.8 6.8 8.6 7.4 8.1 8.7 8.3 9.1 7.8 8.8 6.6 9.2 6.1 9.5 5.4 9.9 4.8 10.2 4.3 10.3 3.6 9.7 2.6 8.8 1.6 10 .6 10-.3 8.9-1.4 6.4-2.1 5.2-4.7 6.4-7.7 5.7-8.1 6.2-10.3 8-16.1 3.3-9.5 3-10.5 3.7-16.6 3.3-18.7 8.2-59.4 8.8-55.3 2.7-22.8 .5-15 1.8 6.5 3.2 7.4 4 6.9zM233.3 685.3l .3 6 1 6.9 1.7 6.8 2 5.6 3.1 6.3 3.1 5.1 3.5 4.9 4.7 5.1 5.2 4.7 4.9 3.5 6 3.6 5.4 2.5 5.7 2.1 6.7 1.7 7 .9 5.9 .3 12-1.1 5.8-1.4 6.6-2.3 5.5-2.5 6-3.5 5.7-4.1 4.4-4 4.1-4.4 4.2-5.6 3.2-5.1 3.1-6.2 2.3-6.6 1.5-5.8 1-5.9 .4-7-.3-7-.9-5.9-1.7-6.8-2-5.7-2.5-5.4-3.5-6-4.2-5.7-4-4.4-5.1-4.7-4.9-3.6-5.1-3.1-6.3-3.1-6.5-2.3-5.9-1.5-6.9-1-6-.3-5.9 .2-7 1-6.7 1.7-5.7 2-5.4 2.6-6 3.5-4.9 3.6-5.2 4.6-4.7 5.2-3.5 4.8-3.1 5.2-3.1 6.3-2 5.6-1.7 6.8-1 6.9zM540.6 342.6l 2.8-9.6 4.3-11.2 5.2-10.8 6.9-12.2 8.1-12.6 8.7-12.2 9.4-11.7 10-11.2 10.5-10.7 11.1-10.1 12.3-10.2 12-9 12.4-8.4 12-7.2 12.3-6.6 12.7-6 15.7-6.5 16-5.7 17.2-5.2 16.5-4.1 15.7-3.1 15.8-2.2 17-1.5 15.9-.6 14 .3 13 1.1 10.8 1.8 9.6 2.7 12.1 4.7 10.6 5.6 8.1 6 2.7 2.9 1.5 2.5 1.7 4.7 1.6 6.8 1.8 14.9 .2 18-1.5 16.9-3.2 14.7-4.9 15.2-6.6 15.6-7.9 15-9.8 15.1-11.1 14.2-12 13.4-13.1 12.3-12.5 10-13.3 8.8-15.7 8.9-18 8.6-25.1 10-26.6 8.8-27.1 6.8-26.6 4.7-26.8 2.6-32 .7-27-1.1-10.9-1.2-9.8-1.7-9.6-3-5.5-4.2-3.2-3.9-2.6-4.2-4.4-10.1-2.8-11.6-1.3-15 .4-14.9zM740.9 217.5l 19.2-5.5 18.6-4 17.8-2.5 19-1.4 17 .1 13.9 1.5 4.8 1.1 5.7 2 8.9 4.5-4.5-5.4-3.9-7.1 .9 5.9 .5 8-.6 18-2.6 12.7-5.3 15.1-7.9 16.1-9.2 14.3-12 14.7-13.5 13.4M775.6 340.9l-10.7 5.4M726.8 361.3l-18.2 5.5-18.5 4.5-18.7 3.5-18.8 2.3-18 1-27 .1-17.9-1-12.9-2 7.1 3.6 3.2 2.5 2.8 3.1-1.1-3.8-.8-5.9 .1-13 1.7-9.9 4.3-11.2 7.9-15 10.4-15.9 12.3-15.8 12.9-13.9 10.2-9.6 11.4-9.7 12-9 11.6-7.8 11.2-6.6 11.6-5.9 12.8-5.7 14-5.3M794.7 293.9l 8 12.6 3.1 6.3 1.7 4.7 1 4.8 .1 4-.8 3.9-1.4 2.7-1.9 2.2-3.3 2.3-3.6 1.6-4.9 1.3-10.9 1-13.9-.6-6.5 12.2-5.7 8.2-5.6 5.6-3.4 2.2-2.8 1-4 .4-3.8-.8-3.6-1.9-3.8-3.1-3.4-3.8-4-5.7-7.5-14.1-17.7 .3-6-.7-4.8-1-4.7-1.8-3.3-2.2-2.6-3-1.3-2.7-.6-3 0-4 1.9-7.7 4.2-9 7.5-11.8 0-.8-8.4-13.6-3.9-9.2-1.2-4.8-.2-4 .7-3.9 1.3-2.7 1.9-2.3 3.1-2.4 3.7-1.7 4.8-1.3 9.9-1.1 15.7 .3 6-11.5 5.5-8.3 5.6-5.7 3.3-2.2 2.8-1.1 3.9-.6 4 .7 3.5 1.8 3.9 3 4 4.5 3.5 4.9 8.1 14.8 13.9-.6 10.9 1 7.6 2.4 3.4 2.1 2.1 2.1 2 3.4 .7 2.9 .1 4-.9 4.9-1.9 5.7-2.6 5.4zM459.4 342.6l-2.8-9.6-4.3-11.2-5.2-10.8-6.9-12.2-8.1-12.6-8.7-12.2-9.4-11.7-10-11.2-10.5-10.7-11.1-10.1-12.3-10.2-12-9-12.4-8.4-12-7.2-12.3-6.6-12.7-6-15.7-6.5-16-5.7-17.2-5.2-16.5-4.1-15.7-3.1-15.8-2.2-17-1.5-15.9-.6-14 .3-13 1.1-10.8 1.8-9.6 2.7-12.1 4.7-10.6 5.6-8.1 6-2.7 2.9-1.5 2.5-1.7 4.7-1.6 6.8-1.8 14.9-.2 18 1.5 16.9 3.2 14.7 4.9 15.2 6.6 15.6 7.9 15 9.8 15.1 11.1 14.2 12 13.4 13.1 12.3 12.5 10 13.3 8.8 15.7 8.9 18 8.6 25.1 10 26.6 8.8 27.1 6.8 26.6 4.7 26.8 2.6 32 .7 27-1.1 10.9-1.2 9.8-1.7 9.6-3 5.5-4.2 3.2-3.9 2.6-4.2 4.4-10.1 2.8-11.6 1.3-15-.4-14.9zM259.1 217.5l-19.2-5.5-18.6-4-17.8-2.5-19-1.4-17 .1-13.9 1.5-4.8 1.1-5.7 2-8.9 4.5 4.5-5.4 3.9-7.1-.9 5.9-.5 8 .6 18 2.6 12.7 5.3 15.1 7.9 16.1 9.2 14.3 12 14.7 13.5 13.4M224.4 340.9l 10.7 5.4M273.2 361.3l 18.2 5.5 18.5 4.5 18.7 3.5 18.8 2.3 18 1 27 .1 17.9-1 12.9-2-7.1 3.6-3.2 2.5-2.8 3.1 1.1-3.8 .8-5.9-.1-13-1.7-9.9-4.3-11.2-7.9-15-10.4-15.9-12.3-15.8-12.9-13.9-10.2-9.6-11.4-9.7-12-9-11.6-7.8-11.2-6.6-11.6-5.9-12.8-5.7-14-5.3M205.3 293.9l-8 12.6-3.1 6.3-1.7 4.7-1 4.8-.1 4 .8 3.9 1.4 2.7 1.9 2.2 3.3 2.3 3.6 1.6 4.9 1.3 10.9 1 13.9-.6 6.5 12.2 5.7 8.2 5.6 5.6 3.4 2.2 2.8 1 4 .4 3.8-.8 3.6-1.9 3.8-3.1 3.4-3.8 4-5.7 7.5-14.1 17.7 .3 6-.7 4.8-1 4.7-1.8 3.3-2.2 2.6-3 1.3-2.7 .6-3 0-4-1.9-7.7-4.2-9-7.5-11.8 0-.8 8.4-13.6 3.9-9.2 1.2-4.8 .2-4-.7-3.9-1.3-2.7-1.9-2.3-3.1-2.4-3.7-1.7-4.8-1.3-9.9-1.1-15.7 .3-6-11.5-5.5-8.3-5.6-5.7-3.3-2.2-2.8-1.1-3.9-.6-4 .7-3.5 1.8-3.9 3-4 4.5-3.5 4.9-8.1 14.8-13.9-.6-10.9 1-7.6 2.4-3.4 2.1-2.1 2.1-2 3.4-.7 2.9-.1 4 .9 4.9 1.9 5.7 2.6 5.4zM512 214l 4.7-13.1 5-12 6-12.6 6.2-11.3 6.8-11 7.6-10.5 7.6-9.2 7.6-7.9 8.8-8.1 9.4-7.3 10.9-7 9.7-5 7.6-2.6 7.8-1.3 7 .3 6.7 1.8M652 112l-1.1 5.8-3.2 5.1-4.7 3.5-2.8 1-4 .6-3.9-.4-2.8-1-4.9-3.4-3.3-4.9-1.3-5.8 .9-5.9 3-5.1 4.7-3.7 2.7-1.1 4-.7 5.8 .9 2.7 1.2 3.2 2.3 2.6 3.1 1.3 2.7zM488 214l-4.7-13.1-5-12-6-12.6-6.2-11.3-6.8-11-7.6-10.5-7.6-9.2-7.6-7.9-8.8-8.1-9.4-7.3-10.9-7-9.7-5-7.6-2.6-7.8-1.3-7 .3-6.7 1.8M348 112l 1.1 5.8 3.2 5.1 4.7 3.5 2.8 1 4 .6 3.9-.4 2.8-1 4.9-3.4 3.3-4.9 1.3-5.8-.9-5.9-3-5.1-4.7-3.7-2.7-1.1-4-.7-5.8 .9-2.7 1.2-3.2 2.3-2.6 3.1-1.3 2.7z"/>
    <path stroke-width="5" d="M586.5 511.7l-1 4.8-2.1 3.3-4 2.8-4.9 1-4.8-1-4-2.8-2.1-3.3-1.1-4.8 1.1-4.9 2.1-3.3 4-2.8 4.8-1 4.9 1 4 2.8 2.1 3.3zM650.8 512.8l-1 4.8-2.1 3.3-4.1 2.9-4.8 1-4.8-1-4-2.9-2.1-3.3-1.1-4.8 1.1-4.8 2.1-3.3 4-2.9 4.8-1 4.8 1 4.1 2.9 2.1 3.3zM714.6 520.2l-1 4.8-2.1 3.4-4 2.8-4.9 1-4.8-1-4-2.8-2.1-3.4-1.1-4.8 1.1-4.8 2.1-3.3 4-2.8 4.8-1 4.9 1 4 2.8 2.1 3.3zM776.9 536.3l-1.1 4.8-2.1 3.3-4 2.9-4.8 1-4.8-1-4.1-2.9-2.1-3.3-1-4.8 1-4.8 2.1-3.3 4.1-2.9 4.8-1 4.8 1 4 2.9 2.1 3.3zM836.3 560.4l-1 4.9-2.1 3.3-4 2.8-4.9 1-4.8-1-4-2.8-2.1-3.3-1.1-4.9 1.1-4.8 2.1-3.3 4-2.8 4.8-1 4.9 1 4 2.8 2.1 3.3zM881.7 604.9l-1 4.8-2.2 3.4-4 2.8-4.8 1-4.8-1-4-2.8-2.2-3.4-1-4.8 1-4.8 2.2-3.3 4-2.8 4.8-1 4.8 1 4 2.8 2.2 3.3zM902.8 665.1l-1 4.8-2.2 3.3-4 2.9-4.8 1-4.8-1-4-2.9-2.2-3.3-1-4.8 1-4.8 2.2-3.3 4-2.9 4.8-1 4.8 1 4 2.9 2.2 3.3zM893.4 728.3l-1 4.8-2.1 3.3-4 2.8-4.9 1-4.8-1-4-2.8-2.1-3.3-1.1-4.8 1.1-4.8 2.1-3.3 4-2.9 4.8-1 4.9 1 4 2.9 2.1 3.3zM862.8 784.4l-1 4.8-2.2 3.3-4 2.9-4.8 1-4.8-1-4-2.9-2.2-3.3-1-4.8 1-4.8 2.2-3.3 4-2.9 4.8-1 4.8 1 4 2.9 2.2 3.3zM816.5 828.8l-1 4.8-2.2 3.3-4 2.9-4.8 1-4.8-1-4-2.9-2.2-3.3-1-4.8 1-4.8 2.2-3.3 4-2.9 4.8-1 4.8 1 4 2.9 2.2 3.3zM760.8 860.5l-1 4.8-2.2 3.3-4 2.9-4.8 1-4.8-1-4-2.9-2.2-3.3-1-4.8 1-4.8 2.2-3.3 4-2.8 4.8-1 4.8 1 4 2.8 2.2 3.3zM698.8 876.3l-1.1 4.8-2.1 3.3-4 2.9-4.8 1-4.9-1-4-2.9-2.1-3.3-1-4.8 1-4.8 2.1-3.3 4-2.9 4.9-1 4.8 1 4 2.9 2.1 3.3zM635.5 868.2l-1.1 4.9-2.1 3.3-4 2.8-4.8 1-4.9-1-4-2.8-2.1-3.3-1-4.9 1-4.8 2.1-3.3 4-2.8 4.9-1 4.8 1 4 2.8 2.1 3.3zM586.9 827.5l-1 4.8-2.1 3.3-4.1 2.8-4.8 1-4.8-1-4-2.8-2.1-3.3-1.1-4.8 1.1-4.8 2.1-3.4 4-2.8 4.8-1 4.8 1 4.1 2.8 2.1 3.4zM532.8 536l 38.1 32.2M584.8 539.8l 5.8 3.1M652.2 541.7l-3.5 50.1M718.5 552.2l-11.6 48.8M782.7 572.1l-17.6 46.8M838.1 608.4l-39.3 31M863.1 669.9l-50 2.1M848.8 735l-45.6-20.6M808.8 788.5l-34.6-36.1M754.2 827.4l-22-45.1M690.5 847.9l-5.7-49.7M625 838.1l 25.3-43.2M582.3 787l 44-23.8M560.2 723.8l 49.3-9.5M550 657.4l 49.9-6M541.6 596.7l-1.9-6.4M742.7 685.3l-1 8.9-2.4 7.6-3.8 7-5.1 6.2-7 5.6-7.1 3.7-7.6 2.2-8 .8-7.9-.8-8.6-2.6-7-3.8-6.2-5.1-5.1-6.2-4.2-7.9-2.2-7.7-.8-7.9 .8-8 2.2-7.6 4.2-8 5.1-6.1 6.2-5.1 7-3.8 8.6-2.7 7.9-.7 8 .7 7.6 2.3 7.1 3.7 7 5.6 5.1 6.1 3.8 7.1 2.4 7.6zM718.7 685.3l-.4 3.9-1.3 3.8-2.1 3.3-2 2.2-2.4 1.8-3.5 1.8-3.8 1-3 .2-2.9-.4-3.8-1.1-3.4-2-2.3-2-2.4-3.1-1.4-2.6-.9-2.9-.4-3.9 .4-4 .9-2.8 1.4-2.6 2.4-3.2 2.3-1.9 3.4-2 3.8-1.2 2.9-.3 3 .2 3.8 .9 3.5 1.8 2.4 1.8 2 2.2 2.1 3.4 1.3 3.8zM413.5 511.7l 1 4.8 2.1 3.3 4 2.8 4.9 1 4.8-1 4-2.8 2.1-3.3 1.1-4.8-1.1-4.9-2.1-3.3-4-2.8-4.8-1-4.9 1-4 2.8-2.1 3.3zM349.2 512.8l 1 4.8 2.1 3.3 4.1 2.9 4.8 1 4.8-1 4-2.9 2.1-3.3 1.1-4.8-1.1-4.8-2.1-3.3-4-2.9-4.8-1-4.8 1-4.1 2.9-2.1 3.3zM285.4 520.2l 1 4.8 2.1 3.4 4 2.8 4.9 1 4.8-1 4-2.8 2.1-3.4 1.1-4.8-1.1-4.8-2.1-3.3-4-2.8-4.8-1-4.9 1-4 2.8-2.1 3.3zM223.1 536.3l 1.1 4.8 2.1 3.3 4 2.9 4.8 1 4.8-1 4.1-2.9 2.1-3.3 1-4.8-1-4.8-2.1-3.3-4.1-2.9-4.8-1-4.8 1-4 2.9-2.1 3.3zM163.7 560.4l 1 4.9 2.1 3.3 4 2.8 4.9 1 4.8-1 4-2.8 2.1-3.3 1.1-4.9-1.1-4.8-2.1-3.3-4-2.8-4.8-1-4.9 1-4 2.8-2.1 3.3zM118.3 604.9l 1 4.8 2.2 3.4 4 2.8 4.8 1 4.8-1 4-2.8 2.2-3.4 1-4.8-1-4.8-2.2-3.3-4-2.8-4.8-1-4.8 1-4 2.8-2.2 3.3zM97.2 665.1l 1 4.8 2.2 3.3 4 2.9 4.8 1 4.8-1 4-2.9 2.2-3.3 1-4.8-1-4.8-2.2-3.3-4-2.9-4.8-1-4.8 1-4 2.9-2.2 3.3zM106.6 728.3l 1 4.8 2.1 3.3 4 2.8 4.9 1 4.8-1 4-2.8 2.1-3.3 1.1-4.8-1.1-4.8-2.1-3.3-4-2.9-4.8-1-4.9 1-4 2.9-2.1 3.3zM137.2 784.4l 1 4.8 2.2 3.3 4 2.9 4.8 1 4.8-1 4-2.9 2.2-3.3 1-4.8-1-4.8-2.2-3.3-4-2.9-4.8-1-4.8 1-4 2.9-2.2 3.3zM183.5 828.8l 1 4.8 2.2 3.3 4 2.9 4.8 1 4.8-1 4-2.9 2.2-3.3 1-4.8-1-4.8-2.2-3.3-4-2.9-4.8-1-4.8 1-4 2.9-2.2 3.3zM239.2 860.5l 1 4.8 2.2 3.3 4 2.9 4.8 1 4.8-1 4-2.9 2.2-3.3 1-4.8-1-4.8-2.2-3.3-4-2.8-4.8-1-4.8 1-4 2.8-2.2 3.3zM301.2 876.3l 1.1 4.8 2.1 3.3 4 2.9 4.8 1 4.9-1 4-2.9 2.1-3.3 1-4.8-1-4.8-2.1-3.3-4-2.9-4.9-1-4.8 1-4 2.9-2.1 3.3zM364.5 868.2l 1.1 4.9 2.1 3.3 4 2.8 4.8 1 4.9-1 4-2.8 2.1-3.3 1-4.9-1-4.8-2.1-3.3-4-2.8-4.9-1-4.8 1-4 2.8-2.1 3.3zM413.1 827.5l 1 4.8 2.1 3.3 4.1 2.8 4.8 1 4.8-1 4-2.8 2.1-3.3 1.1-4.8-1.1-4.8-2.1-3.4-4-2.8-4.8-1-4.8 1-4.1 2.8-2.1 3.4zM467.2 536l-38.1 32.2M415.2 539.8l-5.8 3.1M347.8 541.7l 3.5 50.1M281.5 552.2l 11.6 48.8M217.3 572.1l 17.6 46.8M161.9 608.4l 39.3 31M136.9 669.9l 50 2.1M151.2 735l 45.6-20.6M191.2 788.5l 34.6-36.1M245.8 827.4l 22-45.1M309.5 847.9l 5.7-49.7M375 838.1l-25.3-43.2M417.7 787l-44-23.8M439.8 723.8l-49.3-9.5M450 657.4l-49.9-6M458.4 596.7l 1.9-6.4M257.3 685.3l 1 8.9 2.4 7.6 3.8 7 5.1 6.2 7 5.6 7.1 3.7 7.6 2.2 8 .8 7.9-.8 8.6-2.6 7-3.8 6.2-5.1 5.1-6.2 4.2-7.9 2.2-7.7 .8-7.9-.8-8-2.2-7.6-4.2-8-5.1-6.1-6.2-5.1-7-3.8-8.6-2.7-7.9-.7-8 .7-7.6 2.3-7.1 3.7-7 5.6-5.1 6.1-3.8 7.1-2.4 7.6zM281.3 685.3l .4 3.9 1.3 3.8 2.1 3.3 2 2.2 2.4 1.8 3.5 1.8 3.8 1 3 .2 2.9-.4 3.8-1.1 3.4-2 2.3-2 2.4-3.1 1.4-2.6 .9-2.9 .4-3.9-.4-4-.9-2.8-1.4-2.6-2.4-3.2-2.3-1.9-3.4-2-3.8-1.2-2.9-.3-3 .2-3.8 .9-3.5 1.8-2.4 1.8-2 2.2-2.1 3.4-1.3 3.8zM590.5 228.8l-1 4.9-2.2 3.3-4 2.8-4.8 1-4.8-1-4-2.8-2.2-3.3-1-4.9 1-4.8 2.2-3.3 4-2.8 4.8-1 4.8 1 4 2.8 2.2 3.3zM638.7 187.6l-1.1 4.8-2.1 3.3-4 2.9-4.8 1-4.8-1-4.1-2.9-2.1-3.3-1-4.8 1-4.8 2.1-3.3 4.1-2.9 4.8-1 4.8 1 4 2.9 2.1 3.3zM693.9 156.5l-1 4.8-2.2 3.3-4 2.9-4.8 1-4.8-1-4-2.9-2.2-3.3-1-4.8 1-4.8 2.2-3.3 4-2.9 4.8-1 4.8 1 4 2.9 2.2 3.3zM754 136.1l-1.1 4.8-2.1 3.3-4 2.9-4.8 1-4.9-1-4-2.9-2.1-3.3-1-4.8 1-4.8 2.1-3.3 4-2.9 4.9-1 4.8 1 4 2.9 2.1 3.3zM816.6 126.5l-1 4.9-2.1 3.3-4.1 2.8-4.8 1-4.8-1-4-2.8-2.1-3.3-1.1-4.9 1.1-4.8 2.1-3.3 4-2.8 4.8-1 4.8 1 4.1 2.8 2.1 3.3zM879.8 130.5l-1 4.9-2.2 3.3-4 2.8-4.8 1-4.8-1-4-2.8-2.2-3.3-1-4.9 1-4.8 2.2-3.3 4-2.8 4.8-1 4.8 1 4 2.8 2.2 3.3zM934.9 160.4l-1.1 4.8-2.1 3.3-4 2.8-4.8 1-4.9-1-4-2.8-2.1-3.3-1-4.8 1-4.8 2.1-3.4 4-2.8 4.9-1 4.8 1 4 2.8 2.1 3.4zM948.9 221.1l-1.1 4.8-2.1 3.3-4 2.8-4.8 1-4.8-1-4-2.8-2.2-3.3-1-4.8 1-4.8 2.2-3.4 4-2.8 4.8-1 4.8 1 4 2.8 2.1 3.4zM937.3 283.1l-1.1 4.8-2.1 3.3-4 2.9-4.8 1-4.9-1-4-2.9-2.1-3.3-1-4.8 1-4.8 2.1-3.3 4-2.9 4.9-1 4.8 1 4 2.9 2.1 3.3zM906.9 338.6l-1.1 4.9-2.1 3.3-4 2.8-4.8 1-4.8-1-4.1-2.8-2.1-3.3-1-4.9 1-4.8 2.1-3.3 4.1-2.8 4.8-1 4.8 1 4 2.8 2.1 3.3zM863.1 384.5l-1 4.8-2.1 3.3-4.1 2.8-4.8 1-4.8-1-4-2.8-2.1-3.3-1.1-4.8 1.1-4.9 2.1-3.3 4-2.8 4.8-1 4.8 1 4.1 2.8 2.1 3.3zM809 417.3l-1 4.9-2.2 3.3-4 2.8-4.8 1-4.8-1-4-2.8-2.2-3.3-1-4.9 1-4.8 2.2-3.3 4-2.8 4.8-1 4.8 1 4 2.8 2.2 3.3zM749.6 439.7l-1 4.8-2.2 3.3-4 2.9-4.8 1-4.8-1-4-2.9-2.1-3.3-1.1-4.8 1.1-4.8 2.1-3.3 4-2.9 4.8-1 4.8 1 4 2.9 2.2 3.3zM687.6 453l-1 4.8-2.2 3.3-4 2.8-4.8 1.1-4.8-1.1-4-2.8-2.2-3.3-1-4.8 1-4.8 2.2-3.3 4-2.9 4.8-1 4.8 1 4 2.9 2.2 3.3zM624.2 456.3l-1 4.8-2.1 3.3-4 2.9-4.9 1-4.8-1-4-2.9-2.1-3.3-1.1-4.8 1.1-4.8 2.1-3.3 4-2.9 4.8-1 4.9 1 4 2.9 2.1 3.3zM540.6 342.5l 40.7 36.7M561.6 295.8l 42.5 26.4M592.6 254.7l 37.1 33.6M630.4 219.6l 30.5 39.9M673.5 191.5l 23 44.4M720.8 171.4l 16.7 47.3M770.7 158.5l 9.2 49.4M822 154l 0 50M872.7 161.3l-17.7 44.7M907.2 195l-46.9 20.7M906.7 246.4l-49.2-8.9M889.5 294.7l-44.5-22.9M860.3 337l-38.1-32.7M822 371.3l-23.1-33.8M776.7 395.9l-17.1-40.9M728.3 413.3l-14.4-48M678 424.3l-7.2-49.4M626.6 428.4l-.9-50.2M575.2 425.8l 17-46.7M540.5 393.7l 41.7-21.2M760.7 293.9l-.4 3.9-1.2 3.8-1.9 3.5-2.6 3.1-3.1 2.5-3.5 1.8-3.8 1.1-4 .3-3-.3-3.8-1.1-3.6-1.8-3.1-2.5-2.5-3.1-1.9-3.5-1.2-3.8-.4-3.9 .4-4 1.2-3.8 1.9-3.5 2.5-3 3.1-2.5 3.6-1.8 3.8-1.1 3-.3 4 .3 3.8 1.1 3.5 1.8 3.1 2.5 2.6 3 1.9 3.5 1.2 3.8zM409.5 228.8l 1 4.9 2.2 3.3 4 2.8 4.8 1 4.8-1 4-2.8 2.2-3.3 1-4.9-1-4.8-2.2-3.3-4-2.8-4.8-1-4.8 1-4 2.8-2.2 3.3zM361.3 187.6l 1.1 4.8 2.1 3.3 4 2.9 4.8 1 4.8-1 4.1-2.9 2.1-3.3 1-4.8-1-4.8-2.1-3.3-4.1-2.9-4.8-1-4.8 1-4 2.9-2.1 3.3zM306.1 156.5l 1 4.8 2.2 3.3 4 2.9 4.8 1 4.8-1 4-2.9 2.2-3.3 1-4.8-1-4.8-2.2-3.3-4-2.9-4.8-1-4.8 1-4 2.9-2.2 3.3zM246 136.1l 1.1 4.8 2.1 3.3 4 2.9 4.8 1 4.9-1 4-2.9 2.1-3.3 1-4.8-1-4.8-2.1-3.3-4-2.9-4.9-1-4.8 1-4 2.9-2.1 3.3zM183.4 126.5l 1 4.9 2.1 3.3 4.1 2.8 4.8 1 4.8-1 4-2.8 2.1-3.3 1.1-4.9-1.1-4.8-2.1-3.3-4-2.8-4.8-1-4.8 1-4.1 2.8-2.1 3.3zM120.2 130.5l 1 4.9 2.2 3.3 4 2.8 4.8 1 4.8-1 4-2.8 2.2-3.3 1-4.9-1-4.8-2.2-3.3-4-2.8-4.8-1-4.8 1-4 2.8-2.2 3.3zM65.1 160.4l 1.1 4.8 2.1 3.3 4 2.8 4.8 1 4.9-1 4-2.8 2.1-3.3 1-4.8-1-4.8-2.1-3.4-4-2.8-4.9-1-4.8 1-4 2.8-2.1 3.4zM51.1 221.1l 1.1 4.8 2.1 3.3 4 2.8 4.8 1 4.8-1 4-2.8 2.2-3.3 1-4.8-1-4.8-2.2-3.4-4-2.8-4.8-1-4.8 1-4 2.8-2.1 3.4zM62.7 283.1l 1.1 4.8 2.1 3.3 4 2.9 4.8 1 4.9-1 4-2.9 2.1-3.3 1-4.8-1-4.8-2.1-3.3-4-2.9-4.9-1-4.8 1-4 2.9-2.1 3.3zM93.1 338.6l 1.1 4.9 2.1 3.3 4 2.8 4.8 1 4.8-1 4.1-2.8 2.1-3.3 1-4.9-1-4.8-2.1-3.3-4.1-2.8-4.8-1-4.8 1-4 2.8-2.1 3.3zM136.9 384.5l 1 4.8 2.1 3.3 4.1 2.8 4.8 1 4.8-1 4-2.8 2.1-3.3 1.1-4.8-1.1-4.9-2.1-3.3-4-2.8-4.8-1-4.8 1-4.1 2.8-2.1 3.3zM191 417.3l 1 4.9 2.2 3.3 4 2.8 4.8 1 4.8-1 4-2.8 2.2-3.3 1-4.9-1-4.8-2.2-3.3-4-2.8-4.8-1-4.8 1-4 2.8-2.2 3.3zM250.4 439.7l 1 4.8 2.2 3.3 4 2.9 4.8 1 4.8-1 4-2.9 2.1-3.3 1.1-4.8-1.1-4.8-2.1-3.3-4-2.9-4.8-1-4.8 1-4 2.9-2.2 3.3zM312.4 453l 1 4.8 2.2 3.3 4 2.8 4.8 1.1 4.8-1.1 4-2.8 2.2-3.3 1-4.8-1-4.8-2.2-3.3-4-2.9-4.8-1-4.8 1-4 2.9-2.2 3.3zM375.8 456.3l 1 4.8 2.1 3.3 4 2.9 4.9 1 4.8-1 4-2.9 2.1-3.3 1.1-4.8-1.1-4.8-2.1-3.3-4-2.9-4.8-1-4.9 1-4 2.9-2.1 3.3zM459.4 342.5l-40.7 36.7M438.4 295.8l-42.5 26.4M407.4 254.7l-37.1 33.6M369.6 219.6l-30.5 39.9M326.5 191.5l-23 44.4M279.2 171.4l-16.7 47.3M229.3 158.5l-9.2 49.4M178 154l 0 50M127.3 161.3l 17.7 44.7M92.8 195l 46.9 20.7M93.3 246.4l 49.2-8.9M110.5 294.7l 44.5-22.9M139.7 337l 38.1-32.7M178 371.3l 23.1-33.8M223.3 395.9l 17.1-40.9M271.7 413.3l 14.4-48M322 424.3l 7.2-49.4M373.4 428.4l .9-50.2M424.8 425.8l-17-46.7M459.5 393.7l-41.7-21.2M239.3 293.9l .4 3.9 1.2 3.8 1.9 3.5 2.6 3.1 3.1 2.5 3.5 1.8 3.8 1.1 4 .3 3-.3 3.8-1.1 3.6-1.8 3.1-2.5 2.5-3.1 1.9-3.5 1.2-3.8 .4-3.9-.4-4-1.2-3.8-1.9-3.5-2.5-3-3.1-2.5-3.6-1.8-3.8-1.1-3-.3-4 .3-3.8 1.1-3.5 1.8-3.1 2.5-2.6 3-1.9 3.5-1.2 3.8zM475.3 484.3l 12.8 2.1 11.9 .6 11.9-.6 12.8-2.1M471.4 533.4l 14.7 2.8 13.9 .8 13.9-.8 14.7-2.8M469.5 582.9l 15.6 3.1 14.9 1 14.9-1 15.6-3.1M469.5 632.9l 15.6 3.1 14.9 1 14.9-1 15.6-3.1M472.4 683.7l 13.7 2.5 13.9 .8 13.9-.8 13.7-2.5M478.2 734.9l 10.9 1.6 10.9 .5 10.9-.5 10.9-1.6M484 266l 4.8 3.5 3.5 1.9 3.8 1.2 3.9 .4 3.9-.4 3.8-1.2 3.5-1.9 4.8-3.5"/>
    <path fill="#111" stroke-width="5" d="M491 246l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="5" d="M519 246l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="5" d="M330.1 255.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="5" d="M670.9 255.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="5" d="M474.1 477l-.9 3.4-2.5 2.5-3.4 .9-3.4-.9-2.5-2.5-.9-3.4 .9-3.4 2.5-2.5 3.4-.9 3.4 .9 2.5 2.5z"/>
    <path fill="#111" stroke-width="5" d="M538.5 477l-.9 3.4-2.5 2.5-3.4 .9-3.4-.9-2.5-2.5-.9-3.4 .9-3.4 2.5-2.5 3.4-.9 3.4 .9 2.5 2.5z"/>
    <path fill="#111" stroke-width="5" d="M542 478.5l-1 1-1-1 1-1z"/>
  </g>
</svg>
`,ge=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="10" d="M-30 900l 25.8-2.9 27-1.9 26.9-.9 30 .1 55 2 129.7 8 35 1.2 32 .1 26.9-.7 25-1.4 21.9-1.9 35.8-4 26.9-2 31-1.2 33.9-.3 63 1.4 167.8 7 47 1.1 44 .2 46-.6 42.9-1.5 43-2.4 42.8-3.3 .7 .2 0 133-.3 .7-1059.7 0zM230 410.7l-18.7-23.4-10.1-11.2-10.5-10.6-10.3-9.5-10.7-9-10.4-7.7-10.9-7.1-10.4-5.9-10-4.6-10.3-3.8-9.7-2.6-9.8-1.4-9-.3-9.9 1.2-4.9 1.1-.5 .7-1.7 10.8-.9 12 .2 11 1 10.9 1.8 10.8 3.1 12.7 3.7 11.3 4.6 11.1 5.7 11.7 6 10.4 7.1 10.8 7.9 10.3 8.5 9.9 9.1 9.2 9.7 8.6 10.3 7.9-8 6-8.4 7.2-7.9 7.5-7.5 8.1-13.7 17.2-6.6 9.9-5.6 9.5-9 19-3.5 9.3-3.2 10.5-2.3 9.7-1.7 9.9-1 8.9-.3 10 .9 15.9 1.7 10.9 .6 .6 5.8 1.3 7 .9 12.9-.4 13.7-2.7 14.2-4.9 12.6-6 13.7-8.3 13-9.2 13.1-10.8 13.1-12.3 12.4-13 12.4-14.4 11.6-15M373 294.1l 2.9-12.7 4.1-12.3 5.3-11.9 7-12.1 8.1-11.3 8.6-9.8 10.2-9.6 11-8.6 12.6-8.2 13.2-7.1 13.7-5.9 14.2-5 15.4-4.1 15.7-3 15.9-2 16-.9 23 .4-2.3 10.6-.3 5 .4 5.9 2.6 11.7 5.4 12.9 7.6 13 10.4 14.6 11.8 14.9 24.5 29.1M420.2 693l 1.1 8.9 1.8 8.8 2.4 8.7 3.1 8.4 3.8 8.1 4.1 6.9 4.6 6.5 5.9 6.8 5.9 5.5 6.3 4.9 6.7 4.3 8.1 4 8.4 3.2 7.7 2.1 7.8 1.6 9.9 1.1 12 .1 12-.9-3.8-10-2.1-9.7-.6-10 1.1-10.9 2.8-10.6 4.4-10.1 6.2-10.3 7.6-9.2M816 486l-1.9-11.8-2.6-11.8-3.4-11.5-4-11.3-4.7-11-5.8-11.6-6-10.4-7.1-10.9-7.7-10.5-8.3-10-8.8-9.6-9.2-9.1-9.7-8.7-10.8-8.8-11.3-8.4-12.5-8.3-24.2-14-13.5-6.6-13.7-6.1-13.9-5.5-14.2-4.9-28.9-8.2-15.6-3.4-14.7-2.6-30.8-3.7-16-1-17-.3-13 .3-14.9 1-14.9 1.7-14.8 2.4-13.7 3-14.5 3.8-13.4 4.2-14 5.2-13.8 5.9-13.5 6.5-13.2 7.1-13.8 8.3-12.5 8.2-12.9 9.5-12.5 9.9-12.1 10.5-12.4 11.6-11.2 11.4-12.1 13.4-10.9 13-11 14.2-10.5 14.7-.1 107.9 14.1 19.4 17.2 20.8 17.7 19 18.1 17.3 18.4 15.4 20 14.9 20.2 12.9 20.2 11.1 21.8 10 20.6 7.7 21.1 6.2 22.5 4.9 21.8 3 21.9 1.5 23 0 24.9-1.5 26.8-3.3 25.6-4.9 25.1-6.6 24.7-8.2 24-9.9 22.3-11.3 20.6-12.3 20.4-14.4 17.6-14.8 16.3-16.3 14.7-17.6 12.4-18.2 10.1-18.4 8.1-19.4 6-20.1z"/>
    <path stroke-width="7" d="M886 140l-.7 6.9-2 6.7-3.2 6.2-4.4 5.4-5.3 4.5-6.1 3.3-6.6 2.2-7 .8-7.9-.7-6.6-2.1-6.2-3.3-5.4-4.4-4.4-5.3-3.3-6.1-2.1-6.7-.8-6.9 .6-6.9 1.9-6.7 3.7-7.1 4.4-5.3 5.4-4.4 6.2-3.3 6.6-2.1 7-.7 6.9 .6 6.7 2 6.2 3.2 5.4 4.3 4.5 5.3 3.4 6.1 2.2 6.6zM922 250l-.6 4.9-1.2 3.8-2.5 4.3-2.6 3-4 3-3.6 1.7-3.8 1-3.9 .3-4-.4-4.7-1.5-3.5-1.9-3.1-2.6-2.5-3-2-3.4-1.5-4.8-.5-3.9 .3-4 1-3.8 2.1-4.5 2.4-3.1 3.8-3.3 3.5-1.9 4.7-1.5 4-.4 3.9 .3 3.8 1 3.6 1.7 4 3 2.6 3 2.5 4.3 1.2 3.8zM188 150l-.6 6-1.5 4.7-2.9 5.3-3.2 3.8-3.8 3.2-5.3 2.9-5.7 1.7-5 .4-6-.6-4.7-1.5-4.4-2.3-4.7-3.8-3.8-4.7-2.3-4.4-1.6-5.7-.5-5 .5-5 1.6-5.7 2.3-4.4 3.8-4.7 4.7-3.8 4.4-2.3 4.7-1.5 6-.6 5 .4 5.7 1.7 5.3 2.9 3.8 3.2 3.2 3.8 2.9 5.3 1.5 4.7zM246 220l-1.1 5.8-3.2 5.1-4.7 3.5-2.8 1-4 .6-3.9-.4-2.8-1-4.9-3.4-3.3-4.9-1.3-5.8 .9-5.9 3-5.1 4.7-3.7 2.7-1.1 4-.7 5.8 .9 2.7 1.2 3.2 2.3 2.6 3.1 1.3 2.7zM162.2 898.4l 1.1-6.9 2-7.7 10.1-28.2 3.5-11.5 2.1-10.8 .8-10.9-1.2-11.9-1.4-5.8-2.3-6.6-5.5-10.6-10.5-14.6-2-4.6-1-3.9-.2-5.9 .9-6 8.8-28.6 1.5-6.8 .8-7-.3-7.9-1.4-6.9-2.5-6.5-3.5-6-.8 .1-22.7 14.4 1.6 6.5-1 6.9-2.4 6.6-8.6 20.1-3.8 12.4-1.2 6.9-.5 7 .4 8 1.3 6.8 2.1 6.7 2.8 6.4 10.2 17.1 1.7 5.8 .3 5.9-1.2 6.9-2.5 7.6-12.7 28.3-4.7 12.1-3 10.5-1.9 9.8M915.3 903.5l-1.2-11.9-2.9-12.6-4.5-13.3-13.6-34.3-2.9-10.6-1.3-9.9 .4-9 1.8-8.8 2.6-7.5 6.6-13.5 3.3-8.3 2.8-10.7 1.3-9.9 0-11.9-1.2-11-2.3-11.7-6.9-28.2-2-13.8 .1-8 1-6.9 2-6.7 3.5-8-24.1-13.9-5.3 9.6-3.7 9.3-2.7 10.6-1.3 10.9-.1 9 .9 11 6.3 40.4 .3 8-.6 8-1.3 5.8-2 5.7-10 18.4-5.3 12.9-3.5 13.6-1.5 13.8 .4 13 2.2 13.8 3.7 14.5 11.3 35.2 1.9 9.8 .2 8M334 950l-.7 3.9-1.8 3.6-3.3 3.7-4 2.9-5.4 2.6-5.7 1.8-5.9 1-7 .5-6.9-.4-5.9-1-5.7-1.8-5.4-2.5-4.1-2.8-3.5-3.6-1.9-3.5-.8-3.9 .5-3.9 1.7-3.6 3.2-3.8 4-3 5.3-2.7 5.7-1.8 6.9-1.3 6-.4 6.9 .3 6.9 1.2 5.7 1.8 5.4 2.6 4 2.9 3.3 3.7 1.8 3.6zM668 960l-.5 2.9-1.9 3.5-2.8 2.9-3.3 2.2-4.6 2-4.7 1.4-10 1.1-9.9-1-4.8-1.3-4.6-2-3.3-2.1-2.9-2.8-2-3.4-.7-2.9 .3-3 1.8-3.5 2.7-2.9 3.3-2.3 8.3-3.4 5.9-1.1 5-.3 5.9 .3 5 .8 4.7 1.4 4.6 2 3.3 2.2 2.8 2.9 1.9 3.5zM641.2 291.6l 7.5 11.8 7 13.2 6.2 13.7 5.7 14.9 5.3 16.2 4.4 16.4 3.9 17.6 3.3 18.7M688.7 449.8l 1.5 33-.6 33-2.7 31.8-2.2 15.9-2.8 15.7-6.7 28.2-4.4 14.4-4.5 12.2-5.4 12.9-5.3 10.8-5.8 10.4-6.6 10.1M650 512l-6.9 1.2-7.6 2.3-7.4 3-7.1 3.6-7.6 4.7-7.3 5.3-7.5 6.5-6.5 6.3-12.2 14.4-5.7 8.2-5.8 9.3-9.4 18.7-4.5 11.1-2.4 7.4 11.7 2.8 12.9 1.2 12.9-.7 12.7-2.5 12.3-4.2 11.6-5.8 10.7-7.2 9.6-8.7 5.3-6 2.2-3.2zM766 428l-1 8.9-2.4 7.6-3.8 7-5.1 6.2-7 5.6-7.1 3.7-7.7 2.2-7.9 .8-7.9-.8-8.6-2.6-7-3.8-6.2-5.1-5.1-6.2-4.2-7.9-2.2-7.7-.8-7.9 .8-7.9 2.2-7.7 4.2-7.9 5.1-6.2 6.2-5.1 7-3.8 8.6-2.6 7.9-.8 7.9 .8 7.7 2.2 7.1 3.7 7 5.6 5.1 6.2 3.8 7 2.4 7.6zM762 548l 5.8 3.7 6.3 2.7 5.8 .9 4.9-.3 5.7-1.7 5.1-2.9 5.2-4.5 5.2-5.9"/>
    <path stroke-width="6" d="M214.4 444.8l-64.2-61.3-74.3-68.2M214.4 527.2l-64.2 61.3-74.3 68.2M452.4 270.2l 4.1-23.6 5.8-22.2 7.9-22.6 9.4-20.9M545 268.5l 4.4-20.4 5-19.3 6.4-20.9 6.8-18.8M564.7 270.7l 2.9 6.3 2.2 3.4 3.8 4.6 5.2 4.6 6 3.7 5.5 2.4 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-6.2 3.3-5.5 4.2-6 6.7-3.6 6.1-2.7 7.4-1.4 8.9 .2 7 2.4 9.7 2.9 6.3 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-6.4 2.9-7.4 5.1-4.9 5-4 5.7-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-7.3 3.4-6.5 4.6-4.9 5-4 5.7-2.9 6.3-1.9 6.8-.8 6.9 .8 8.9 1.9 6.8 2.9 6.3 4 5.7 4.9 5 6.5 4.6 7.3 3.4M583 555.7l-4.2 2.7-5.2 4.6-6 8-3.9 9.2-1.6 8.8M570.4 617.1l 6.1 6.6 8.3 5.6 9.3 3.5 9.9 1.2-9.9 1.2-6.6 2.2-4.5 2.3-4.2 2.7-5.2 4.6-6 8-2.6 5.4-1.5 4.7-1.2 5.9-.3 6 .3 4 1.4 6.8 2.1 5.6 2.9 5.3M533.8 266.9l-4.2 4.4-4 5.7-2.9 6.3-1.7 5.8-.7 3.9-.2 7 .7 5.9 1.9 6.8 2.9 6.3 2.2 3.4 3.8 4.6 5.2 4.6 6 3.7 5.5 2.4 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-7.2 6.9-5.4 8.4-2.7 7.4-1.4 8.9 .7 9.9 1.9 6.8 2.9 6.3 4 5.7 4.9 5 7.4 5.1 6.4 2.9 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-5.2 4.6-6 8-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 4 5.7 4.9 5 6.5 4.6 7.3 3.4 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-5.2 4.6-6 8-3.9 9.2-1.4 6.8 0 10 1.4 6.8 2.5 6.5 3.6 6.1 6 6.7 5.5 4.2 6.2 3.3 6.6 2.2 8.9 1.2M561 592l-8.9 1.2-6.6 2.2-8.7 5-5.2 4.6-6 8-2.9 6.3-1.9 6.8-.8 8.9 1 7.9 2.8 8.5 3.4 6.1 5.1 6.2 7 5.6 6.2 3.3 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-5.5 2.4-6 3.7-5.2 4.6-3.8 4.6-3.6 6.1-1.9 4.6M479.2 265.9l 2.6 7.5 3.4 6.1 4.4 5.5 5.2 4.6 6 3.7 5.5 2.4 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-6.2 3.3-5.5 4.2-6 6.7-3.6 6.1-2.7 7.4-1.4 8.9 .2 7 2.4 9.7 2.9 6.3 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-6.4 2.9-7.4 5.1-4.9 5-4 5.7-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-6.4 2.9-7.4 5.1-4.9 5-4 5.7-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-6.4 2.9-7.4 5.1-4.9 5-4 5.7-2.9 6.3-1.9 6.8-.7 9.9 1.4 8.9 2.7 7.4 5.4 8.4 7.2 6.9 8.7 5 6.6 2.2 9.9 1.2-7 .6-5.8 1.4-3.7 1.4-6.2 3.3-4.8 3.6-4.9 5-4 5.7-1.8 3.6-2.1 5.6-1.2 5.8-.5 5 .3 6 1.4 6.8 2.1 5.6 3.4 6.1 3.7 4.7M446.3 270.5l-3.1 4-3.4 6.1-2.1 5.6-1.4 6.8-.3 6 .5 5 1.2 5.8 2.1 5.6 1.8 3.6 4 5.7 4.9 5 4.8 3.6 6.2 3.3 3.7 1.4 5.8 1.4 7 .6-9.9 1.2-6.6 2.2-8.7 5-7.2 6.9-5.4 8.4-2.7 7.4-1.4 8.9 .7 9.9 1.9 6.8 2.9 6.3 4 5.7 4.9 5 6.5 4.6 7.3 3.4 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-5.2 4.6-6 8-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 4 5.7 4.9 5 7.4 5.1 6.4 2.9 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-5.2 4.6-6 8-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 4 5.7 4.9 5 6.5 4.6 7.3 3.4 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-5.2 4.6-6 8-2.9 6.3-2.4 9.7-.2 7 1.4 8.9 2.7 7.4 3.6 6.1 6 6.7 5.5 4.2 6.2 3.3 6.6 2.2 9.9 1.2-6 .5-4.9 1-5.6 1.9-5.3 2.8-3.4 2.2-5.2 4.6-3.8 4.6-3.1 5.2M402.4 281.1l 6.1 6.6 8.3 5.6 9.3 3.5 9.9 1.2-9.9 1.2-9.3 3.5-8.3 5.6-6.7 7.3-4 7-3 9.5-.7 9.9 1.6 9.8 2.5 6.5 3 5.2 4.4 5.5 5.2 4.6 6 3.7 5.5 2.4 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-7.2 6.9-5.4 8.4-2.7 7.4-1.4 8.9 .7 9.9 1.9 6.8 2.9 6.3 4 5.7 4.9 5 7.4 5.1 6.4 2.9 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-5.2 4.6-6 8-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 4 5.7 4.9 5 6.5 4.6 7.3 3.4 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-5.2 4.6-6 8-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 4 5.7 4.9 5 7.4 5.1 6.4 2.9 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-8.7 5-7.2 6.9-5.4 8.4-3.2 9.4-.7 3.9-.3 6 1.2 8.9M352.3 303l 1.4 6.8 3.9 9.2 4 5.7 4.9 5 7.4 5.1 6.4 2.9 6.7 1.7 7 .6-9.9 1.2-6.6 2.2-6.2 3.3-5.5 4.2-6 6.7-3.6 6.1-2.7 7.4-1.4 8.9 .2 7 2.4 9.7 2.9 6.3 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-9.9 1.2-6.6 2.2-6.2 3.3-5.5 4.2-6 6.7-3.6 6.1-2.7 7.4-1.4 8.9 .2 7 2.4 9.7 2.9 6.3 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-7.3 3.4-6.5 4.6-4.9 5-4 5.7-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-8.1 3.9-5.7 4.1-4.9 5-4 5.7-2.9 6.3-1.9 6.8-.7 9.9 1.4 8.9 2.7 7.4 5.4 8.4 7.2 6.9 8.7 5 6.6 2.2 9.9 1.2-9.9 1.2-6.6 2.2M311.5 329.1l-1.4 8.9 .7 9.9 3 9.5 1.8 3.6 3.4 4.9 5.5 5.8 8.3 5.6 9.3 3.5 9.9 1.2-7 .6-6.7 1.7-7.3 3.4-6.5 4.6-4.9 5-4 5.7-3.9 9.2-1.4 6.8 0 10 1.4 6.8 3.9 9.2 6 8 5.2 4.6 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-7.3 3.4-6.5 4.6-4.9 5-4 5.7-2.9 6.3-1.9 6.8-.7 9.9 1.4 8.9 2.7 7.4 5.4 8.4 7.2 6.9 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-5.5 2.4-6 3.7-5.2 4.6-4.4 5.5-3 5.2-2.5 6.5-1.6 9.8 .7 9.9 3 9.5 4 7 6.7 7.3 8.3 5.6 9.3 3.5 9.9 1.2-9.9 1.2-6.6 2.2-8.7 5-5.9 5.4M299.1 338.5l 4.9 1 6 .5-9.9 1.2-6.6 2.2M273.6 361l-2.6 5.4-1.5 4.7-1.2 5.9-.3 6 .3 4 1.4 6.8 3.9 9.2 6 8 5.2 4.6 4.2 2.7 4.5 2.3 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-7.3 3.4-6.5 4.6-4.9 5-4 5.7-2.9 6.3-1.9 6.8-.7 9.9 1.4 8.9 2.7 7.4 5.4 8.4 7.2 6.9 8.7 5 6.6 2.2 9.9 1.2-7 .6-6.7 1.7-5.5 2.4-6 3.7-5.2 4.6-3.8 4.6-2.2 3.4-2.9 6.3-2.4 9.7 0 10 2.4 9.7 4.5 8.8 4.4 5.5 2.9 2.7 8.3 5.6 9.3 3.5 9.9 1.2-9.9 1.2-6.6 2.2-3.6 1.8-5.1 3.2-3 2.5-4.2 4.4-2.9 4M255.2 380l 5.8 1.4 7 .6-9.9 1.2-8.4 3.1M227.5 413.1l-1.4 8.9 .7 9.9 3 9.5 1.8 3.6 3.4 4.9 5.5 5.8 8.3 5.6 9.3 3.5 9.9 1.2-7 .6-6.7 1.7-5.5 2.4-6 3.7-5.2 4.6-3.8 4.6-2.2 3.4-2.9 6.3-2.4 9.7 0 10 2.4 9.7 4.5 8.8 4.4 5.5 2.9 2.7 8.3 5.6 9.3 3.5 9.9 1.2-9.9 1.2-9.3 3.5-8.3 5.6-6.7 7.3M219 423.4l 7 .6-7 .6M213.2 506l 5.8 1.4 7 .6-7 .6-5.8 1.4M652.4 547.7l-10.6 5.7-11 6.9-10.4 7.7-10 8.3-10 9.7-8.9 9.5-9.5 11.6-8.3 11.3"/>
    <path fill="#111" stroke-width="6" d="M595 424l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M553 382l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M553 550l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M511 424l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M511 592l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M469 382l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M469 550l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M427 424l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M427 592l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M385 382l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M385 550l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M343 424l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M343 592l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M301 382l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M301 550l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M259 424l-.4 1.9-1.1 1.6-1.6 1.1-1.9 .4-1.9-.4-1.6-1.1-1.1-1.6-.4-1.9 .4-1.9 1.1-1.6 1.6-1.1 1.9-.4 1.9 .4 1.6 1.1 1.1 1.6z"/>
    <path fill="#111" stroke-width="6" d="M754 430l-.3 3-1.3 4.3-1.4 2.7-3 3.4-2.4 1.8-4 1.9-6 .9-4.4-.7-2.9-1-4.9-3.4-3.5-4.9-1.1-2.8-.8-4.4 .8-6 1.1-2.8 2.5-3.8 2.1-2.1 3.8-2.4 2.9-1 4.4-.7 6 .9 4 1.9 2.4 1.8 3 3.4 1.4 2.7 1.3 4.3z"/>
    <path fill="#111" stroke-width="6" d="M362.3 665l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M264.7 377.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M655.3 667l-1 1-1-1 1-1z"/>
  </g>
</svg>
`,k=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="10" d="M847.3 425.3l 19.6 3.6 19.2 5.6 17.5 7.4 15.6 8.9 14.4 10.7 8.1 7.5 6.1 6.6 8.8 12.1 2.5 4.4 2.7 7.4-2.4 7.6-2.8 5.2-8.8 12.2-6.1 6.6-8.1 7.4-14.4 10.7-15.6 8.9-17.5 7.4-19.2 5.6-19.7 3.6M838.1 609l 15.3 12.9 13.7 14.4 11.5 15.2 9 15.5 7.2 16.5 3.3 10.5 1.9 8.8 1.6 14.8-.1 5-1.3 7.9-5.8 5.3-5.1 3.2-13.7 6.1-8.6 2.6-10.7 2.5-17.9 2-18-.1-18.8-2.3-19.4-4.7-18.8-6.8M738.3 763.4l 6.8 18.8 4.7 19.4 2.3 18.9 .1 17.9-2 17.9-2.5 10.7-2.6 8.6-6.1 13.7-2.6 4.3-5.1 6.1-7.7 1.7-6 .2-14.9-1.6-8.7-1.9-10.5-3.3-16.5-7.2-15.5-9.1-15.2-11.4-14.5-13.8-12.8-15.2M574.7 847.3l-3.6 19.6-5.6 19.2-7.4 17.5-8.9 15.6-10.7 14.4-7.5 8.1-6.6 6.1-12.1 8.8-4.4 2.5-7.4 2.7-7.6-2.4-5.2-2.8-12.2-8.8-6.6-6.1-7.4-8.1-10.7-14.4-8.9-15.6-7.4-17.5-5.6-19.2-3.6-19.7M391 838.1l-12.9 15.3-14.4 13.7-15.2 11.5-15.5 9-16.5 7.2-10.5 3.3-8.8 1.9-14.8 1.6-5-.1-7.9-1.3-5.3-5.8-3.2-5.1-6.1-13.7-2.6-8.6-2.5-10.7-2-17.9 .1-18 2.3-18.8 4.7-19.4 6.8-18.8M236.6 738.3l-18.8 6.8-19.4 4.7-18.9 2.3-17.9 .1-17.9-2-10.7-2.5-8.6-2.6-13.7-6.1-4.3-2.6-6.1-5.1-1.7-7.7-.2-6 1.6-14.9 1.9-8.7 3.3-10.5 7.2-16.5 9.1-15.5 11.4-15.2 13.8-14.5 15.2-12.8M152.7 574.7l-19.6-3.6-19.2-5.6-17.5-7.4-15.6-8.9-14.4-10.7-8.1-7.5-6.1-6.6-8.8-12.1-2.5-4.4-2.7-7.4 2.4-7.6 2.8-5.2 8.8-12.2 6.1-6.6 8.1-7.4 14.4-10.7 15.6-8.9 17.5-7.4 19.2-5.6 19.7-3.6M161.9 391l-15.3-12.9-13.7-14.4-11.5-15.2-9-15.5-7.2-16.5-3.3-10.5-1.9-8.8-1.6-14.8 .1-5 1.3-7.9 5.8-5.3 5.1-3.2 13.7-6.1 8.6-2.6 10.7-2.5 17.9-2 18 .1 18.8 2.3 19.4 4.7 18.8 6.8M261.7 236.6l-6.8-18.8-4.7-19.4-2.3-18.9-.1-17.9 2-17.9 2.5-10.7 2.6-8.6 6.1-13.7 2.6-4.3 5.1-6.1 7.7-1.7 6-.2 14.9 1.6 8.7 1.9 10.5 3.3 16.5 7.2 15.5 9.1 15.2 11.4 14.5 13.8 12.8 15.2M425.3 152.7l 3.6-19.6 5.6-19.2 7.4-17.5 8.9-15.6 10.7-14.4 7.5-8.1 6.6-6.1 12.1-8.8 4.4-2.5 7.4-2.7 7.6 2.4 5.2 2.8 12.2 8.8 6.6 6.1 7.4 8.1 10.7 14.4 8.9 15.6 7.4 17.5 5.6 19.2 3.6 19.7M609 161.9l 12.9-15.3 14.4-13.7 15.2-11.5 15.5-9 16.5-7.2 10.5-3.3 8.8-1.9 14.8-1.6 5 .1 7.9 1.3 5.3 5.8 3.2 5.1 6.1 13.7 2.6 8.6 2.5 10.7 2 17.9-.1 18-2.3 18.8-4.7 19.4-6.8 18.8M763.4 261.7l 18.8-6.8 19.4-4.7 18.9-2.3 17.9-.1 17.9 2 10.7 2.5 8.6 2.6 13.7 6.1 4.3 2.6 6.1 5.1 1.7 7.7 .2 6-1.6 14.9-1.9 8.7-3.3 10.5-7.2 16.5-9.1 15.5-11.4 15.2-13.8 14.5-15.2 12.8M604 500l-.6 11-1.5 9.8-2.5 9.7-3.4 9.4-4.2 9-5.7 9.4-6 8-6.7 7.4-7.4 6.7-8.1 6-9.4 5.6-9 4.2-9.5 3.4-9.6 2.4-9.9 1.5-11 .5-10-.5-9.9-1.5-9.6-2.4-9.5-3.4-9-4.2-8.6-5.1-8.9-6.5-7.4-6.7-7.3-8.1-5.9-8.1-5.2-8.6-4.2-9-3.4-9.4-2.7-10.6-1.4-9.9-.5-10 .5-10 1.4-9.9 2.7-10.6 3.4-9.4 4.2-9 5.2-8.6 5.9-8.1 7.3-8.1 7.4-6.7 8.9-6.5 8.6-5.1 9-4.2 9.5-3.4 9.6-2.4 9.9-1.5 10-.5 11 .5 9.9 1.5 9.6 2.4 9.5 3.4 9 4.2 9.4 5.6 8.1 6 7.4 6.7 6.7 7.4 6 8 5.7 9.4 4.2 9 3.4 9.4 2.5 9.7 1.5 9.8z"/>
    <path stroke-width="7" d="M742.3 507.6l 20.3 5.5 20.5 7.7 17.8 9 9.3 5.9 8.1 5.9 6.9 5.7 7.2 6.9 6.6 7.5 6 8 4.2 6.8 3.4 7.2 1.7 4.7 1.2 6.8-4.5 5.4-3.8 3.3-6.6 4.5-7 3.8-9.2 3.9-9.4 3.1-9.7 2.4-8.9 1.5-9.9 1.1-11 .4-19.9-1-21.7-3.6-20.2-5.5M649.2 542.6l 1.3-4.9M706 627.8l 14.9 14.8 13.9 17 10.9 16.7 5.1 9.7 4 9.1 3.2 8.5 2.7 9.5 2.1 9.8 1.1 9.9 .2 8-.6 8-.8 4.9-2.5 6.5-6.5 2.5-4.9 .8-8 .6-8-.2-9.9-1.1-9.8-2.1-9.5-2.7-8.5-3.2-9.1-4-9.7-5.1-16.7-10.9-17-13.9-14.8-14.9M607.9 611.4l 3.6-3.5M614.6 713.7l 5.4 20.2 3.6 21.7 1 19.9-.4 11-1.1 9.9-1.5 8.9-2.4 9.7-3.1 9.4-3.9 9.2-3.8 7-4.5 6.6-3.3 3.8-5.4 4.5-6.8-1.2-4.7-1.7-7.2-3.4-6.8-4.2-8-6-7.5-6.6-6.9-7.2-5.7-6.9-5.9-8.1-5.9-9.3-9-17.8-7.7-20.5-5.5-20.3M537.7 650.5l 4.9-1.3M492.4 742.3l-5.5 20.3-7.7 20.5-9 17.8-5.9 9.3-5.9 8.1-5.7 6.9-6.9 7.2-7.5 6.6-8 6-6.8 4.2-7.2 3.4-4.7 1.7-6.8 1.2-5.4-4.5-3.3-3.8-4.5-6.6-3.8-7-3.9-9.2-3.1-9.4-2.4-9.7-1.5-8.9-1.1-9.9-.4-11 1-19.9 3.6-21.7 5.5-20.2M457.4 649.2l 4.9 1.3M372.2 706l-14.8 14.9-17 13.9-16.7 10.9-9.7 5.1-9.1 4-8.5 3.2-9.5 2.7-9.8 2.1-9.9 1.1-8 .2-8-.6-4.9-.8-6.5-2.5-2.5-6.5-.8-4.9-.6-8 .2-8 1.1-9.9 2.1-9.8 2.7-9.5 3.2-8.5 4-9.1 5.1-9.7 10.9-16.7 13.9-17 14.9-14.8M388.6 607.9l 3.5 3.6M286.3 614.6l-20.2 5.4-21.7 3.6-19.9 1-11-.4-9.9-1.1-8.9-1.5-9.7-2.4-9.4-3.1-9.2-3.9-7-3.8-6.6-4.5-3.8-3.3-4.5-5.4 1.2-6.8 1.7-4.7 3.4-7.2 4.2-6.8 6-8 6.6-7.5 7.2-6.9 6.9-5.7 8.1-5.9 9.3-5.9 17.8-9 20.5-7.7 20.3-5.5M349.5 537.7l 1.3 4.9M257.7 492.4l-20.3-5.5-20.5-7.7-17.8-9-9.3-5.9-8.1-5.9-6.9-5.7-7.2-6.9-6.6-7.5-6-8-4.2-6.8-3.4-7.2-1.7-4.7-1.2-6.8 4.5-5.4 3.8-3.3 6.6-4.5 7-3.8 9.2-3.9 9.4-3.1 9.7-2.4 8.9-1.5 9.9-1.1 11-.4 19.9 1 21.7 3.6 20.2 5.5M350.8 457.4l-1.3 4.9M294 372.2l-14.9-14.8-13.9-17-10.9-16.7-5.1-9.7-4-9.1-3.2-8.5-2.7-9.5-2.1-9.8-1.1-9.9-.2-8 .6-8 .8-4.9 2.5-6.5 6.5-2.5 4.9-.8 8-.6 8 .2 9.9 1.1 9.8 2.1 9.5 2.7 8.5 3.2 9.1 4 9.7 5.1 16.7 10.9 17 13.9 14.8 14.9M392.1 388.6l-3.6 3.5M385.4 286.3l-5.4-20.2-3.6-21.7-1-19.9 .4-11 1.1-9.9 1.5-8.9 2.4-9.7 3.1-9.4 3.9-9.2 3.8-7 4.5-6.6 3.3-3.8 5.4-4.5 6.8 1.2 4.7 1.7 7.2 3.4 6.8 4.2 8 6 7.5 6.6 6.9 7.2 5.7 6.9 5.9 8.1 5.9 9.3 9 17.8 7.7 20.5 5.5 20.3M462.3 349.5l-4.9 1.3M507.6 257.7l 5.5-20.3 7.7-20.5 9-17.8 5.9-9.3 5.9-8.1 5.7-6.9 6.9-7.2 7.5-6.6 8-6 6.8-4.2 7.2-3.4 4.7-1.7 6.8-1.2 5.4 4.5 3.3 3.8 4.5 6.6 3.8 7 3.9 9.2 3.1 9.4 2.4 9.7 1.5 8.9 1.1 9.9 .4 11-1 19.9-3.6 21.7-5.5 20.2M542.6 350.8l-4.9-1.3M627.8 294l 14.8-14.9 17-13.9 16.7-10.9 9.7-5.1 9.1-4 8.5-3.2 9.5-2.7 9.8-2.1 9.9-1.1 8-.2 8 .6 4.9 .8 6.5 2.5 2.5 6.5 .8 4.9 .6 8-.2 8-1.1 9.9-2.1 9.8-2.7 9.5-3.2 8.5-4 9.1-5.1 9.7-10.9 16.7-13.9 17-14.9 14.8M611.4 392.1l-3.5-3.6M713.7 385.4l 20.2-5.4 21.7-3.6 19.9-1 11 .4 9.9 1.1 8.9 1.5 9.7 2.4 9.4 3.1 9.2 3.9 7 3.8 6.6 4.5 3.8 3.3 4.5 5.4-1.2 6.8-1.7 4.7-3.4 7.2-4.2 6.8-6 8-6.6 7.5-7.2 6.9-6.9 5.7-8.1 5.9-9.3 5.9-17.8 9-20.5 7.7-20.3 5.5M650.5 462.3l-1.3-4.9M600.5 473.1l 33-8 13.7-2.7 12.8-1.9 12-1 10-.3 9.9 .5 9.9 1.3 9.7 2.4 8.4 3.3 6.9 4 6.2 5 4.6 5.3 3.9 6.9 2.4 11.8-2.1 11.7-4.3 7.9-4.7 5.2-6.2 5-7.9 4.3-8.4 3.1-8.7 2.1-9.9 1.4-10 .4-10-.3-11.9-1.1-25.6-4.3-34-8.3M600.4 526.9l 32.6 9.6 13.3 4.6 12 4.8 10.9 5 8.8 4.8 8.4 5.3 7.9 6.1 7.2 7 5.5 7 4.1 6.9 2.9 7.5 1.3 6.8-.1 8-3.8 11.4-7.7 9.1-7.7 4.6-6.6 2.2-7.9 1.2-9-.2-8.9-1.5-8.6-2.5-9.2-3.8-8.9-4.6-8.5-5.3-9.8-6.9-20-16.6-25.3-24.1M573.5 573.5l 23.5 24.6 9.1 10.6 8.1 10.2 6.9 9.8 5.2 8.5 4.6 8.9 3.8 9.2 2.7 9.6 1.3 8.9 .1 8-1.2 7.9-2.3 6.6-4.1 6.8-8.9 8-11.3 4-9 .2-6.8-1.4-7.4-2.9-7.7-4.7-6.9-5.7-6.2-6.5-6.1-7.9-5.4-8.5-4.7-8.8-5.1-10.8-9-24.4-9.8-33.5M526.9 600.5l 8 33 2.7 13.7 1.9 12.8 1 12 .3 10-.5 9.9-1.3 9.9-2.4 9.7-3.3 8.4-4 6.9-5 6.2-5.3 4.6-6.9 3.9-11.8 2.4-11.7-2.1-7.9-4.3-5.2-4.7-5-6.2-4.3-7.9-3.1-8.4-2.1-8.7-1.4-9.9-.4-10 .3-10 1.1-11.9 4.3-25.6 8.3-34M473.1 600.4l-9.6 32.6-4.6 13.3-4.8 12-5 10.9-4.8 8.8-5.3 8.4-6.1 7.9-7 7.2-7 5.5-6.9 4.1-7.5 2.9-6.8 1.3-8-.1-11.4-3.8-9.1-7.7-4.6-7.7-2.2-6.6-1.2-7.9 .2-9 1.5-8.9 2.5-8.6 3.8-9.2 4.6-8.9 5.3-8.5 6.9-9.8 16.6-20 24.1-25.3M426.5 573.5l-24.6 23.5-10.6 9.1-10.2 8.1-9.8 6.9-8.5 5.2-8.9 4.6-9.2 3.8-9.6 2.7-8.9 1.3-8 .1-7.9-1.2-6.6-2.3-6.8-4.1-8-8.9-4-11.3-.2-9 1.4-6.8 2.9-7.4 4.7-7.7 5.7-6.9 6.5-6.2 7.9-6.1 8.5-5.4 8.8-4.7 10.8-5.1 24.4-9 33.5-9.8M399.5 526.9l-33 8-13.7 2.7-12.8 1.9-12 1-10 .3-9.9-.5-9.9-1.3-9.7-2.4-8.4-3.3-6.9-4-6.2-5-4.6-5.3-3.9-6.9-2.4-11.8 2.1-11.7 4.3-7.9 4.7-5.2 6.2-5 7.9-4.3 8.4-3.1 8.7-2.1 9.9-1.4 10-.4 10 .3 11.9 1.1 25.6 4.3 34 8.3M399.6 473.1l-32.6-9.6-13.3-4.6-12-4.8-10.9-5-8.8-4.8-8.4-5.3-7.9-6.1-7.2-7-5.5-7-4.1-6.9-2.9-7.5-1.3-6.8 .1-8 3.8-11.4 7.7-9.1 7.7-4.6 6.6-2.2 7.9-1.2 9 .2 8.9 1.5 8.6 2.5 9.2 3.8 8.9 4.6 8.5 5.3 9.8 6.9 20 16.6 25.3 24.1M426.5 426.5l-23.5-24.6-9.1-10.6-8.1-10.2-6.9-9.8-5.2-8.5-4.6-8.9-3.8-9.2-2.7-9.6-1.3-8.9-.1-8 1.2-7.9 2.3-6.6 4.1-6.8 8.9-8 11.3-4 9-.2 6.8 1.4 7.4 2.9 7.7 4.7 6.9 5.7 6.2 6.5 6.1 7.9 5.4 8.5 4.7 8.8 5.1 10.8 9 24.4 9.8 33.5M473.1 399.5l-8-33-2.7-13.7-1.9-12.8-1-12-.3-10 .5-9.9 1.3-9.9 2.4-9.7 3.3-8.4 4-6.9 5-6.2 5.3-4.6 6.9-3.9 11.8-2.4 11.7 2.1 7.9 4.3 5.2 4.7 5 6.2 4.3 7.9 3.1 8.4 2.1 8.7 1.4 9.9 .4 10-.3 10-1.1 11.9-4.3 25.6-8.3 34M526.9 399.6l 9.6-32.6 4.6-13.3 4.8-12 5-10.9 4.8-8.8 5.3-8.4 6.1-7.9 7-7.2 7-5.5 6.9-4.1 7.5-2.9 6.8-1.3 8 .1 11.4 3.8 9.1 7.7 4.6 7.7 2.2 6.6 1.2 7.9-.2 9-1.5 8.9-2.5 8.6-3.8 9.2-4.6 8.9-5.3 8.5-6.9 9.8-16.6 20-24.1 25.3M573.5 426.5l 24.6-23.5 10.6-9.1 10.2-8.1 9.8-6.9 8.5-5.2 8.9-4.6 9.2-3.8 9.6-2.7 8.9-1.3 8-.1 7.9 1.2 6.6 2.3 6.8 4.1 8 8.9 4 11.3 .2 9-1.4 6.8-2.9 7.4-4.7 7.7-5.7 6.9-6.5 6.2-7.9 6.1-8.5 5.4-8.8 4.7-10.8 5.1-24.4 9-33.5 9.8M550 500l-1 9.9-2.9 9.5-4.8 8.8-5.7 6.9-7.6 6.3-8.8 4.8-8.6 2.7-9.9 1.1-9.9-.9-9.5-2.7-8.8-4.7-7.8-6.3-6.3-7.6-4.3-7.9-3-9.5-1.1-9.9 .7-8.9 2.7-9.6 4.5-8.9 6.1-7.8 7.6-6.5 8.8-4.8 9.4-3 10-1 9.9 .9 9.5 2.9 8.8 4.8 7.6 6.3 5.7 6.9 4.8 8.8 2.9 9.5zM584.1 529.5l-.9 4.8-2.7 4.2-4 2.8-4.9 1.1-4.8-.7-4.3-2.5-3-4-1-2.8-.4-2.9 1-4.9 2.7-4.1 4-2.9 4.8-1.1 4.9 .8 4.3 2.5 3 3.9 1 2.8zM542.5 571.1l-1 4.9-2.7 4.1-4 2.9-4.8 1.1-4.9-.7-4.3-2.6-3-3.9-1-2.8-.3-3 .9-4.8 2.7-4.2 4.1-2.8 4.8-1.1 4.9 .7 4.2 2.5 3 4 1 2.8zM483.5 571.1l-.9 4.9-2.7 4.1-4.1 2.9-4.8 1.1-4.9-.7-4.2-2.6-3-3.9-1-2.8-.4-3 1-4.8 2.7-4.2 4-2.8 4.8-1.1 4.9 .7 4.3 2.5 3 4 1 2.8zM441.9 529.5l-1 4.8-2.7 4.2-4 2.8-4.8 1.1-4.9-.7-4.3-2.5-3-4-1-2.8-.3-2.9 .9-4.9 2.7-4.1 4-2.9 4.9-1.1 4.8 .8 4.3 2.5 3 3.9 1 2.8zM441.9 470.5l-1 4.9-2.7 4.1-4 2.9-4.8 1.1-4.9-.8-4.3-2.5-3-3.9-1-2.8-.3-3 .9-4.8 2.7-4.2 4-2.8 4.9-1.1 4.8 .7 4.3 2.5 3 4 1 2.8zM483.5 428.9l-.9 4.8-2.7 4.2-4.1 2.8-4.8 1.1-4.9-.7-4.2-2.5-3-4-1-2.8-.4-2.9 1-4.9 2.7-4.1 4-2.9 4.8-1.1 4.9 .7 4.3 2.6 3 3.9 1 2.8zM542.5 428.9l-1 4.8-2.7 4.2-4 2.8-4.8 1.1-4.9-.7-4.3-2.5-3-4-1-2.8-.3-2.9 .9-4.9 2.7-4.1 4.1-2.9 4.8-1.1 4.9 .7 4.2 2.6 3 3.9 1 2.8zM584.1 470.5l-.9 4.9-2.7 4.1-4 2.9-4.9 1.1-4.8-.8-4.3-2.5-3-3.9-1-2.8-.4-3 1-4.8 2.7-4.2 4-2.8 4.8-1.1 4.9 .7 4.3 2.5 3 4 1 2.8zM943.1 613.4l-.4 3.9-1.2 3.8-1.9 3.5-2.6 3.1-3.1 2.5-3.5 1.8-3.9 1-3.9 .4-3-.3-3.8-1.1-3.6-1.8-3.1-2.5-2.5-3.1-1.9-3.5-1.2-3.8-.4-3.9 .4-4 1.2-3.8 1.9-3.5 2.5-3.1 3.1-2.4 3.6-1.8 3.8-1.1 3-.3 3.9 .3 3.9 1.1 3.5 1.8 3.1 2.5 2.6 3 1.9 3.5 1.2 3.8zM829.7 809.7l-.4 4-1.2 3.8-1.9 3.5-2.5 3-3.1 2.5-3.6 1.8-3.8 1.1-4 .3-3-.3-3.8-1.1-3.5-1.8-3.2-2.5-2.5-3-1.9-3.5-1.2-3.8-.4-4 .4-3.9 1.2-3.9 1.9-3.4 2.5-3.1 3.2-2.5 3.5-1.8 3.8-1.1 3-.3 4 .3 3.8 1.1 3.6 1.8 3.1 2.5 2.5 3 1.9 3.5 1.2 3.9zM633.4 923.1l-.4 3.9-1.2 3.8-1.9 3.5-2.6 3.1-3.1 2.5-3.5 1.8-3.9 1.1-3.9 .3-3-.3-3.8-1.1-3.6-1.8-3.1-2.5-2.6-3.1-1.9-3.5-1.1-3.8-.4-3.9 .4-4 1.1-3.8 1.9-3.5 2.6-3 3.1-2.5 3.6-1.8 3.8-1.1 3-.3 3.9 .3 3.9 1.1 3.5 1.8 3.1 2.5 2.6 3 1.9 3.5 1.2 3.8zM406.6 923.1l-.4 3.9-1.1 3.8-1.9 3.5-2.6 3.1-3.1 2.5-3.6 1.8-3.8 1.1-4 .3-2.9-.3-3.9-1.1-3.5-1.8-3.1-2.5-2.6-3.1-1.9-3.5-1.2-3.8-.3-3.9 .3-4 1.2-3.8 1.9-3.5 2.6-3 3.1-2.5 3.5-1.8 3.9-1.1 2.9-.3 4 .3 3.8 1.1 3.6 1.8 3.1 2.5 2.6 3 1.9 3.5 1.1 3.8zM210.3 809.7l-.4 4-1.2 3.8-1.9 3.5-2.6 3-3.1 2.5-3.5 1.8-3.8 1.1-4 .3-3-.3-3.8-1.1-3.6-1.8-3.1-2.5-2.5-3-1.9-3.5-1.2-3.8-.4-4 .4-3.9 1.2-3.9 1.9-3.4 2.5-3.1 3.1-2.5 3.6-1.8 3.8-1.1 3-.3 4 .3 3.8 1.1 3.5 1.8 3.1 2.5 2.6 3 1.9 3.5 1.2 3.9zM96.9 613.4l-.4 3.9-1.2 3.8-1.9 3.5-2.5 3.1-3.1 2.5-3.6 1.8-3.8 1-4 .4-2.9-.3-3.9-1.1-3.5-1.8-3.1-2.5-2.6-3.1-1.9-3.5-1.2-3.8-.4-3.9 .4-4 1.2-3.8 1.9-3.5 2.6-3.1 3.1-2.4 3.5-1.8 3.9-1.1 2.9-.3 4 .3 3.8 1.1 3.6 1.8 3.1 2.5 2.5 3 1.9 3.5 1.2 3.8zM96.9 386.6l-.4 4-1.2 3.8-1.9 3.5-2.5 3-3.1 2.5-3.6 1.8-3.8 1.1-4 .3-2.9-.3-3.9-1.1-3.5-1.8-3.1-2.4-2.6-3.1-1.9-3.5-1.2-3.8-.4-4 .4-3.9 1.2-3.8 1.9-3.5 2.6-3.1 3.1-2.5 3.5-1.8 3.9-1.1 2.9-.3 4 .4 3.8 1 3.6 1.8 3.1 2.5 2.5 3.1 1.9 3.5 1.2 3.8zM210.3 190.3l-.4 3.9-1.2 3.9-1.9 3.5-2.6 3-3.1 2.5-3.5 1.8-3.8 1.1-4 .3-3-.3-3.8-1.1-3.6-1.8-3.1-2.5-2.5-3.1-1.9-3.4-1.2-3.9-.4-3.9 .4-4 1.2-3.8 1.9-3.5 2.5-3 3.1-2.5 3.6-1.8 3.8-1.1 3-.3 4 .3 3.8 1.1 3.5 1.8 3.1 2.5 2.6 3 1.9 3.5 1.2 3.8zM406.6 76.9l-.4 4-1.1 3.8-1.9 3.5-2.6 3-3.1 2.5-3.6 1.8-3.8 1.1-4 .3-2.9-.3-3.9-1.1-3.5-1.8-3.1-2.5-2.6-3-1.9-3.5-1.2-3.8-.3-4 .3-3.9 1.2-3.8 1.9-3.5 2.6-3.1 3.1-2.5 3.5-1.8 3.9-1.1 2.9-.3 4 .3 3.8 1.1 3.6 1.8 3.1 2.5 2.6 3.1 1.9 3.5 1.1 3.8zM633.4 76.9l-.4 4-1.2 3.8-1.9 3.5-2.6 3-3.1 2.5-3.5 1.8-3.9 1.1-3.9 .3-3-.3-3.8-1.1-3.6-1.8-3.1-2.5-2.6-3-1.9-3.5-1.1-3.8-.4-4 .4-3.9 1.1-3.8 1.9-3.5 2.6-3.1 3.1-2.5 3.6-1.8 3.8-1.1 3-.3 3.9 .3 3.9 1.1 3.5 1.8 3.1 2.5 2.6 3.1 1.9 3.5 1.2 3.8zM829.7 190.3l-.4 3.9-1.2 3.9-1.9 3.5-2.5 3-3.1 2.5-3.6 1.8-3.8 1.1-4 .3-3-.3-3.8-1.1-3.5-1.8-3.2-2.5-2.5-3.1-1.9-3.4-1.2-3.9-.4-3.9 .4-4 1.2-3.8 1.9-3.5 2.5-3 3.2-2.5 3.5-1.8 3.8-1.1 3-.3 4 .3 3.8 1.1 3.6 1.8 3.1 2.5 2.5 3 1.9 3.5 1.2 3.8zM943.1 386.6l-.4 4-1.2 3.8-1.9 3.5-2.6 3-3.1 2.5-3.5 1.8-3.9 1.1-3.9 .3-3-.3-3.8-1.1-3.6-1.8-3.1-2.4-2.5-3.1-1.9-3.5-1.2-3.8-.4-4 .4-3.9 1.2-3.8 1.9-3.5 2.5-3.1 3.1-2.5 3.6-1.8 3.8-1.1 3-.3 3.9 .4 3.9 1 3.5 1.8 3.1 2.5 2.6 3.1 1.9 3.5 1.2 3.8z"/>
    <path fill="#111" stroke-width="6" d="M337.4 543l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M457.1 336.4l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M381.9 618.2l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M619.2 618.2l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M380.9 619.1l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M620.1 619.1l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M380.9 379.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M620.1 379.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M381.9 380.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M544 662.6l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M619.2 380.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M663.6 456.1l-1 1-1-1 1-1z"/>
  </g>
</svg>
`,A=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="10" d="M592 286l 180-173.7 24 291.7-203.1-117.5M208.3 401.5l 2.6-1.5M213.5 398.5l 2.6-1.5M219.5 395l 2.6-1.5M224.7 392l 2.6-1.5M230.8 388.5l 2.6-1.5M236 385.5l 3.4-2M242 382l 3.5-2M248.1 378.5l 1.7-1M253.3 375.5l 3.4-2M264.5 369l 1.7-1M275.7 362.5l 2.6-1.5M281.8 359l 2.6-1.5M287 356l 2.6-1.5M293 352.5l 2.6-1.5M298.2 349.5l 3.5-2M304.3 346l 1.7-1M320.7 336.5l 1.7-1M326.7 333l 1.8-1M331.9 330l 3.5-2M338 326.5l 3.4-2M344 323l 3.5-2M350.1 319.5l 6-3.5M365.6 310.5l 1.8-1M371.7 307l 1.7-1M376.9 304l 2.6-1.5M383.8 300l 1.7-1M388.1 297.5l 3.5-2M394.2 294l 1.7-1M407.1 286.5l .9-.5-180-173.7-24 291.7 1.7-1M500 300l 91.9-14 203.5 117.6 134.6 162.4-160.3 98.2-165.6 115.7-104.1 112.1-104.1-112.1-165.6-115.7-160.3-98.2 134.6-162.4 203.5-117.6z"/>
    <path stroke-width="6" d="M649.6 291.6l 99-95.6 13.2 160.3zM350.4 291.6l-99-95.6-13.2 160.3zM604 780l 46-130M799.2 407.8l 1.2 1.6M805.5 415.5l 1.3 1.6M839.2 456.2l 1.3 1.5M845.5 463.9l 1.3 1.5M867.1 490l 1.3 1.5M879.2 504.6l 1.9 2.3M886.8 513.8l 1.3 1.5M891.9 519.9l 2.5 3.1M899.5 529.1l 1.3 1.6M905.9 536.8l 3.1 3.9M914.1 546.8l 1.3 1.5M918.6 552.2l 3.1 3.8M650 650l-150 4M796 404l-84 124M770 664l-58-136M500 470l 146-50M646 420l-62 146M500 300l 0 170M712 528l-62 122M627.4 306.5l 1.8 1M670.7 331.5l 1.7 1M678.4 336l 1.8 1M757.1 381.5l 1.7 1M592 286l 54 134M500 892l 0-31M500 812l 0-158M915.5 574.9l-2.5 1.5M910.4 578l-4.2 2.6M901.9 583.2l-2.5 1.6M894.3 587.9l-1.7 1M876.4 598.8l-3.4 2.1M870.4 602.5l-4.2 2.6M862.8 607.2l-2.6 1.5M855.1 611.9l-1.7 1M836.4 623.3l-3.4 2.1M830.4 627l-4.2 2.6M822.8 631.7l-2.6 1.5M815.1 636.4l-1.7 1M802.3 644.2l-1.7 1M796.4 647.8l-3.4 2.1M790.4 651.5l-3.4 2.1M782.8 656.2l-2.6 1.5M775.1 660.9l-1.7 1M796 404l-150 16M768.4 665.1l-1.7 1.2M757.7 672.6l-2.4 1.7M746.3 680.6l-2.5 1.7M735.7 688l-3.3 2.3M728.3 693.1l-1.6 1.2M724.2 696l-3.3 2.3M716.8 701.1l-1.6 1.2M706.2 708.6l-2.4 1.7M694.8 716.6l-2.5 1.7M684.1 724l-3.2 2.3M676.8 729.1l-1.7 1.2M672.7 732l-3.3 2.3M665.3 737.1l-1.6 1.2M662.1 739.4l-3.3 2.3M654.7 744.6l-3.3 2.3M649.8 748l-1.6 1.1M643.3 752.6l-2.5 1.7M632.6 760l-3.3 2.3M625.3 765.1l-1.7 1.2M620.4 768.6l-1.7 1.1M613.8 773.1l-2.4 1.8M609.7 776l-3.2 2.3M770 664l-120-14M500 470l 84 96M500 300l 92-14M646 420l 66 108M712 528l-128 38M584 566l-84 88M600.6 783.7l-1.4 1.4M595.2 789.5l-1.4 1.5M589.7 795.4l-1.3 1.4M579.5 806.4l-1.3 1.4M576.8 809.3l-1.3 1.4M570.7 815.9l-1.4 1.4M568 818.8l-1.4 1.5M565.3 821.7l-1.4 1.5M562.5 824.7l-1.3 1.4M559.8 827.6l-1.3 1.4M549.6 838.6l-1.3 1.4M546.9 841.5l-1.4 1.5M540.8 848.1l-1.4 1.4M538.1 851l-1.4 1.5M535.3 853.9l-1.3 1.5M532.6 856.9l-1.3 1.4M514.3 876.6l-1.4 1.5M510.9 880.3l-1.4 1.5M508.2 883.2l-1.4 1.5M505.4 886.1l-1.3 1.5M502.7 889.1l-1.3 1.4M604 780l-104-126M930 566l-218-38M500 300l 146 120M500 470l 0 184M584 566l 66 84M396 780l-46-130M204 404l-134 162M350 650l 150 4M204 404l 84 124M230 664l 58-136M500 470l-146-50M354 420l 62 146M500 300l 0 170M288 528l 62 122M408 286l-204 118M408 286l-54 134M500 892l 0-31M500 812l 0-158M70 566l 3.4 2.1M76 569.6l 4.2 2.7M82.8 573.8l 4.2 2.6M88.7 577.5l 5.1 3.1M95.5 581.6l 5.1 3.2M102.3 585.8l 5.1 3.1M109.1 590l 4.3 2.6M116 594.1l 4.2 2.7M122.8 598.3l 11 6.8M136.4 606.7l 3.4 2M142.3 610.3l 4.3 2.6M148.3 614l 5.1 3.1M156 618.6l 4.2 2.7M161.9 622.3l 11.9 7.3M176.4 631.2l 3.4 2M182.3 634.8l 4.3 2.6M188.3 638.5l 5.1 3.1M196 643.1l 4.2 2.7M201.9 646.8l 5.1 3.1M208.7 651l 4.3 2.6M216.4 655.7l 3.4 2M222.3 659.3l 4.3 2.6M228.3 663l 1.7 1M204 404l 150 16M230 664l 3.3 2.3M234.9 667.4l 21.3 14.9M258.6 684l 9 6.3M269.3 691.4l 4 2.9M275 695.4l 44.1 30.9M320.8 727.4l 15.5 10.9M337.9 739.4l 44.2 30.9M383.7 771.4l 12.3 8.6M230 664l 120-14M500 470l-84 96M500 300l-4.9-.7M493.1 299l-6.8-1.1M484.3 297.6l-2.9-.4M479.4 296.9l-1.9-.3M475.5 296.3l-7.8-1.2M465.7 294.8l-1.9-.3M461.8 294.2l-2.9-.5M456.9 293.4l-2.9-.4M452 292.7l-11.7-1.8M438.3 290.6l-2.9-.4M433.4 289.9l-6.8-1.1M424.6 288.5l-2.9-.4M419.7 287.8l-1.9-.3M415.8 287.2l-2.9-.5M410.9 286.4l-2.9-.4M354 420l-66 108M288 528l 128 38M416 566l 84 88M396 780l 104 112M396 780l 104-126M70 566l 218-38M500 300l-146 120M500 470l 0 184M416 566l-66 84M467 115.4l 65.8 0 21.8 32.2 .2 .8-54.7 66-54.8-65.9 0-.8zM445 148.1l 110 0M482.4 148.1l 17.6 66.3M517.6 148.1l-17.6 66.3M80 209.5l 59.9 0 20.1 29.7-49.6 59.9-.7 .1-49.6-59.9zM60 239.2l 100 0M94 239.2l 16 60.3M126 239.2l-16 60.3M860 209.5l 59.9 0 20.1 29.7-49.6 59.9-.7 .1-49.6-59.9zM840 239.2l 100 0M874 239.2l 16 60.3M906 239.2l-16 60.3M115.2 799l 69.8 .2 22.8 34-.2 .8-57.4 69.1-.6-.2-57.4-69.1 .1-.8zM92 833.5l 116 0M131.4 833.5l 18.6 69.9M168.6 833.5l-18.6 69.9M815.2 799l 69.8 .2 22.8 34-.2 .8-57.4 69.1-.6-.2-57.4-69.1 .1-.8zM792 833.5l 116 0M831.4 833.5l 18.6 69.9M868.6 833.5l-18.6 69.9"/>
    <path fill="#111" stroke-width="6" d="M668.3 508.7l-.5 4.5-.8 2.9-1.3 2.7-2.6 3.7-2.2 2.2-3.7 2.5-4.2 1.7-4.5 .7-4.6-.2-4.3-1.2-4.1-2.2-2.3-1.8-3-3.4-2.2-4-1.3-4.4-.4-3 .4-4.5 1.3-4.4 2.2-3.9 1.9-2.4 3.4-2.9 4.1-2.1 4.3-1.3 3.1-.2 4.5 .4 2.9 .8 4.1 2 3.5 2.8 2.9 3.5 2.1 4 .8 3z"/>
    <path fill="#111" stroke-width="6" d="M373.7 508.7l-.5 4.5-.9 2.9-1.3 2.7-2.6 3.7-3.3 3.1-2.6 1.6-4.2 1.7-4.5 .7-4.5-.2-3-.7-4.1-1.8-3.7-2.7-3-3.4-2.2-4-1-2.9-.6-4.5 .3-4.5 1.3-4.4 1.4-2.7 2.7-3.6 3.5-2.9 4-2.1 2.9-1 4.5-.5 4.5 .4 2.9 .8 4.1 2 3.6 2.8 2.9 3.5 2 4 .9 3z"/>
    <path fill="#111" stroke-width="6" d="M470 812l 62 .1 4.2 1.2 1.1 1.5 .1 1-.7 2.5-2.1 3.2-27.2 35-4 3.8-2.7 .9-1.4 0-4-1.9-2.7-2.8-28.4-36.7-1.6-4 .5-1.8 1.8-1.3z"/>
    <path fill="#111" stroke-width="6" d="M493.2 199.2l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M507.8 199.7l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M388.7 767.6l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M612.3 767.6l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M103.5 285.2l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="6" d="M897.5 285.2l-1 1-1-1 1-1z"/>
  </g>
</svg>
`,_e=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="14" d="M318 226l-.6 13-2 12.8-3.1 12.6-4.4 12.2-5.6 11.8-6.7 11.1-7.7 10.4-8.7 9.6-8.9 8.1-10.4 7.8-11.1 6.7-11.7 5.6-12.2 4.4-12.6 3.3-12.8 1.9-13 .7-13-.6-12.8-1.9-12.6-3.1-12.3-4.3-11.7-5.5-11.2-6.7-10.4-7.7-9.7-8.7-8.7-9.6-7.7-10.4-6.7-11.1-5.6-11.8-4.4-12.2-3.1-12.6-2-12.8-.6-13 .6-13 2-12.8 3.1-12.6 4.4-12.2 5.6-11.8 6.7-11.1 7.7-10.4 8.7-9.6 8.9-8.1 10.4-7.8 11.1-6.7 11.7-5.6 12.2-4.4 12.6-3.3 12.8-1.9 13-.7 13 .6 12.8 1.9 12.6 3.1 12.3 4.3 11.7 5.5 11.2 6.7 10.4 7.7 9.7 8.7 8.7 9.6 7.7 10.4 6.7 11.1 5.6 11.8 4.4 12.2 3.1 12.6 2 12.8zM512 118.6l 31.3 74.6 4.2 6.8 5 4.8 6.2 3.3 6.8 1.7 82.6 6.9 5.8 1.3 1.8 1 1.2 1.6 0 2-.8 1.8-3.9 4.5-62.8 54.2-4.5 5.3-3.1 6.3-1.3 6.8 .6 8 18.5 78.8 .8 4.9-.2 4-1 1.7-1.8 .8-2.9-.2-2.8-1.1-72.7-43.9-7.4-3-6.9-.8-6.9 1-6.5 2.7-70.9 42.9-4.6 2.1-1.9 .4-2-.2-.9-.5-1.1-1.6-.4-3 .3-3 19.2-82.7 .5-7-1.2-6.8-3-6.3-4.5-5.4-63.5-54.9-3.7-4.6-.5-2.9 1-1.7 1.7-1 4.8-1.3 83.6-7.1 5.9-1.3 6.3-3 3.2-2.4 2.7-2.8 4.3-6.8 31.3-74.6 2.7-5.3 2.8-2.9 .9-.3 2 .2 2.9 2.7zM748.6 99.9l 183.1 32.3 6.7 2 5.4 2.6 4.7 3.7 3 4 2.1 4.5 1 4.9 .3 5-.5 6-32.3 183.1-1.7 6.8-2.8 6.4-3.6 4.7-4.7 3.7-4.6 2-4.8 1.1-5 .2-6-.5-183.1-32.3-6.8-1.7-6.4-2.9-4.7-3.7-3.7-4.7-1.6-3.6-1.2-4.9-.3-5 .4-6 33.6-188.9 2.1-5.6 2.5-4.4 3.4-3.7 4-2.9 4.6-1.9 4.9-.9 6-.1zM212.3 564.7l 150 209.7 3.6 6 2.2 5.5 .6 5-.9 3.8-2.3 3.3-4.1 2.8-5.7 2-7.8 1.4-252.4 26.6-10-.1-6.7-1.9-3.9-3.1-2-4.5-.3-2.9 .3-4 2.2-7.7 105.4-241.8 3.6-6 3.3-3.7 4.1-2.7 4-.7 3.8 .9 4.3 2.5 4.4 4.1zM512 828l-51.9-33.8-17.2-12-15.2-11.5-14.6-12-12.5-11.5-11.1-11.6-8.9-10.7-7.9-11.6-6.2-11.4-4.4-11.1-2.9-11.6-1.2-11 .6-12.9 1.9-11.8 3.6-11.5 5-10.9 5.9-9.2 7.1-8.4 8-7.5 9.7-7.1 9.6-5.3 10.1-4.2 11.5-3.3 13.9-1.9 14 .2 11.7 2.2 11.2 4.2 5.2 3 4.9 3.5 7.9 7.6 6.4 9 5.6 11.6 .4 0 2.8-6.4 3.9-6.9 4-5.7 4-4.5 4.4-4.1 4.8-3.6 5.2-3 6.4-2.9 6.6-2.1 6.9-1.4 7.9-.8 8 0 8 .6 6.9 1.2 7.7 1.9 7.6 2.6 8.2 3.6 7.9 4.4 6.6 4.5 6.9 5.7 6.4 6.3 5.7 7 4.9 7.5 3.7 7.1 3.4 8.3 2.5 8.7 1.6 8.8 .8 9 0 7.9-.9 9-1.9 8.8-2.8 8.5-7 14.4-4.7 7.6-5.8 8.1-12.4 14.5-16.5 15.9-18.4 15.4-20.9 15.4-24 16.3zM835.7 567.7l 91.7 132.2 2.9 5.3 1.7 4.7 1 4.9 .1 5-1.6 7.8-1.9 4.6-2.5 4.3-91.2 131.4-3.7 4.7-2.9 2.7-3.4 2-3.9 .8-3-.4-3.5-1.8-3.1-2.6-3.2-3.8-91.2-131.4-3.2-5.1-2.3-5.5-1.3-4.8-.3-6 .4-3.9 1.3-4.9 4-8 94.2-135.4 2.7-2.9 3.3-2.3 3.7-1.3 3 0 2.9 .9 3.3 2.1 2.9 2.8z"/>
    <path stroke-width="10" d="M152 250l 8.7 8 8.3 5.5 8.2 3.3 8.8 1.2 8.8-1.2 8.2-3.3 8.3-5.5 8.7-8M477.8 301.2l 7.3 6.7 6.6 4.3 6.5 2.5 6.8 .9 6.8-.9 6.5-2.5 6.6-4.3 7.3-6.7M784 260l 8.7 8 8.3 5.5 8.2 3.3 8.8 1.2 8.8-1.2 8.2-3.3 8.3-5.5 8.7-8M183.1 764.4l 7.3 6.7 7.4 4.9 7.3 2.8 6.9 .9 6.9-.9 7.3-2.8 7.4-4.9 7.3-6.7M478 714l 8.7 8 8.3 5.5 8.2 3.3 8.8 1.2 8.8-1.2 8.2-3.3 8.3-5.5 8.7-8M794.8 737.2l 7.3 6.7 6.6 4.3 6.5 2.5 6.8 .9 6.8-.9 6.5-2.5 6.6-4.3 7.3-6.7M388 470l 44 0M410 448l 0 44M932 470l 36 0M950 452l 0 36M620 950l 40 0M640 930l 0 40M42 470l 36 0M60 452l 0 36M312 940l 36 0M330 922l 0 36"/>
    <path fill="#111" stroke-width="8" d="M162 216l-1 4.4-1.8 2.5-3.8 2.5-3 .6-4.5-.9-2.6-1.6-1.9-2.4-1.4-4.3 .3-3.1 2-4.1 3.6-2.7 4.5-.9 3 .6 3.8 2.5 1.8 2.5z"/>
    <path fill="#111" stroke-width="8" d="M230 216l-1 4.4-1.8 2.5-3.8 2.5-3 .6-4.5-.9-2.6-1.6-1.9-2.4-1.4-4.3 .3-3.1 2-4.1 3.6-2.7 4.5-.9 3 .6 3.8 2.5 1.8 2.5z"/>
    <path fill="#111" stroke-width="8" d="M485 274l-.5 2.8-1.6 2.3-2.3 1.6-2.8 .5-2.8-.5-2.3-1.6-1.6-2.3-.5-2.8 .5-2.8 1.6-2.3 2.3-1.6 2.8-.5 2.8 .5 2.3 1.6 1.6 2.3z"/>
    <path fill="#111" stroke-width="8" d="M539.4 274l-.5 2.8-1.6 2.3-2.3 1.6-2.8 .5-2.8-.5-2.3-1.6-1.6-2.3-.5-2.8 .5-2.8 1.6-2.3 2.3-1.6 2.8-.5 2.8 .5 2.3 1.6 1.6 2.3z"/>
    <path fill="#111" stroke-width="8" d="M794 226l-.5 3-2.3 3.9-3.8 2.5-3 .6-4.5-.9-2.6-1.6-2.6-3.8-.7-2.9 .7-4.5 1.6-2.7 3.6-2.7 4.5-.9 3 .6 3.8 2.5 2.3 3.9z"/>
    <path fill="#111" stroke-width="8" d="M862 226l-.5 3-2.3 3.9-3.8 2.5-3 .6-4.5-.9-2.6-1.6-2.6-3.8-.7-2.9 .7-4.5 1.6-2.7 3.6-2.7 4.5-.9 3 .6 3.8 2.5 2.3 3.9z"/>
    <path fill="#111" stroke-width="8" d="M191 735.5l-.6 2.9-1.6 2.6-2.4 1.7-2.9 .7-3-.4-2.6-1.5-1.8-2.4-.9-2.8 .3-3 1.4-2.7 2.2-1.9 2.9-1 3 .1 3.8 2.2 1.6 2.6z"/>
    <path fill="#111" stroke-width="8" d="M248.8 735.5l-.6 2.9-1.6 2.6-2.4 1.7-2.9 .7-3-.4-2.6-1.5-1.8-2.4-.9-2.8 .3-3 1.4-2.7 2.3-1.9 2.8-1 3 .1 3.8 2.2 1.6 2.6z"/>
    <path fill="#111" stroke-width="8" d="M488 680l-1 4.4-1.8 2.5-2.4 1.9-4.4 1.2-4.5-.9-2.6-1.6-1.9-2.4-1.4-4.3 .7-4.5 2.6-3.8 2.6-1.6 4.5-.9 4.4 1.2 2.4 1.9 1.8 2.5z"/>
    <path fill="#111" stroke-width="8" d="M556 680l-.5 3-2.3 3.9-2.4 1.9-4.4 1.2-4.5-.9-2.6-1.6-2.6-3.8-.7-2.9 .7-4.5 2.6-3.8 2.6-1.6 4.5-.9 4.4 1.2 2.4 1.9 2.3 3.9z"/>
    <path fill="#111" stroke-width="8" d="M802 710l-.5 2.8-1.6 2.3-2.3 1.6-2.8 .5-2.8-.5-2.3-1.6-1.6-2.3-.5-2.8 .5-2.8 1.6-2.3 2.3-1.6 2.8-.5 2.8 .5 2.3 1.6 1.6 2.3z"/>
    <path fill="#111" stroke-width="8" d="M856.4 710l-.5 2.8-1.6 2.3-2.3 1.6-2.8 .5-2.8-.5-2.3-1.6-1.6-2.3-.5-2.8 .5-2.8 1.6-2.3 2.3-1.6 2.8-.5 2.8 .5 2.3 1.6 1.6 2.3z"/>
    <path fill="#111" stroke-width="8" d="M626 470l-.5 2.3-1.3 1.9-1.9 1.3-2.3 .5-2.3-.5-1.9-1.3-1.3-1.9-.5-2.3 .5-2.3 1.3-1.9 1.9-1.3 2.3-.5 2.3 .5 1.9 1.3 1.3 1.9z"/>
    <path fill="#111" stroke-width="8" d="M376 60l-.5 2.3-1.3 1.9-1.9 1.3-2.3 .5-2.3-.5-1.9-1.3-1.3-1.9-.5-2.3 .5-2.3 1.3-1.9 1.9-1.3 2.3-.5 2.3 .5 1.9 1.3 1.3 1.9z"/>
    <path fill="#111" stroke-width="8" d="M686 70l-.5 2.3-1.3 1.9-1.9 1.3-2.3 .5-2.3-.5-1.9-1.3-1.3-1.9-.5-2.3 .5-2.3 1.3-1.9 1.9-1.3 2.3-.5 2.3 .5 1.9 1.3 1.3 1.9z"/>
    <path fill="#111" stroke-width="8" d="M116 930l-.5 2.3-1.3 1.9-1.9 1.3-2.3 .5-2.3-.5-1.9-1.3-1.3-1.9-.5-2.3 .5-2.3 1.3-1.9 1.9-1.3 2.3-.5 2.3 .5 1.9 1.3 1.3 1.9z"/>
    <path fill="#111" stroke-width="8" d="M946 960l-.5 2.3-1.3 1.9-1.9 1.3-2.3 .5-2.3-.5-1.9-1.3-1.3-1.9-.5-2.3 .5-2.3 1.3-1.9 1.9-1.3 2.3-.5 2.3 .5 1.9 1.3 1.3 1.9z"/>
    <path fill="#111" stroke-width="8" d="M506 950l-.5 2.3-1.3 1.9-1.9 1.3-2.3 .5-2.3-.5-1.9-1.3-1.3-1.9-.5-2.3 .5-2.3 1.3-1.9 1.9-1.3 2.3-.5 2.3 .5 1.9 1.3 1.3 1.9z"/>
  </g>
</svg>
`,ve=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path stroke-width="7" d="M832.1 427.4l 10-.1 8.9 .6 9.9 1.4 8.8 1.9 8.7 2.4 10.3 3.6 9.2 3.9 9.9 4.9 9.5 5.5 8.3 5.5 8.8 6.5 8.4 7.1 8.6 8.4 6.7 7.3 6.2 7.9 3.7 5.9-3.8 5.9-6.2 7.8-6.7 7.4-8.6 8.3-8.4 7.1-8.8 6.5-8.4 5.5-10.4 6-18.1 8.3-10.4 3.5-8.7 2.4-8.8 1.9-9.9 1.4-9.9 .6-9-.1M823.9 603.2l 8.7 4.9 7.4 5 7.9 6.2 6.7 6 6.3 6.4 7.1 8.3 6.1 8 6 9.1 5.5 9.5 4.5 8.9 4.3 10.1 3.7 10.4 3.4 11.5 2.1 9.7 1.4 9.9 .2 6.9-6.2 3.3-9.2 3.7-9.6 3-11.6 2.9-10.8 1.9-10.9 1.3-10 .6-12-.1-19.8-1.9-10.8-2.1-8.7-2.2-8.5-2.8-9.3-3.7-9-4.5-7.7-4.6M728.9 751.3l 5.1 8.6 3.9 8.1 3.7 9.2 2.8 8.6 2.3 8.7 2 10.8 1.3 9.9 .7 10.9 0 11-.6 10-1.3 10.9-2 10.8-2.9 11.6-3 9.5-3.7 9.3-3.3 6.1-7-.3-9.8-1.4-9.8-2.2-11.5-3.3-10.3-3.7-10.1-4.4-8.9-4.5-10.4-6-16.3-11.6-8.2-7.2-6.4-6.3-6-6.7-6.2-7.8-5.5-8.3-4.4-7.9M572.6 832.1l .1 10-.6 8.9-1.4 9.9-1.9 8.8-2.4 8.7-3.6 10.3-3.9 9.2-4.9 9.9-5.5 9.5-5.5 8.3-6.5 8.8-7.1 8.4-8.4 8.6-7.3 6.7-7.9 6.2-5.9 3.7-5.9-3.8-7.8-6.2-7.4-6.7-8.3-8.6-7.1-8.4-6.5-8.8-5.5-8.4-6-10.4-8.3-18.1-3.5-10.4-2.4-8.7-1.9-8.8-1.4-9.9-.6-9.9 .1-9M396.8 823.9l-4.9 8.7-5 7.4-6.2 7.9-6 6.7-6.4 6.3-8.3 7.1-8 6.1-9.1 6-9.5 5.5-8.9 4.5-10.1 4.3-10.4 3.7-11.5 3.4-9.7 2.1-9.9 1.4-6.9 .2-3.3-6.2-3.7-9.2-3-9.6-2.9-11.6-1.9-10.8-1.3-10.9-.6-10 .1-12 1.9-19.8 2.1-10.8 2.2-8.7 2.8-8.5 3.7-9.3 4.5-9 4.6-7.7M248.7 728.9l-8.6 5.1-8.1 3.9-9.2 3.7-8.6 2.8-8.7 2.3-10.8 2-9.9 1.3-10.9 .7-11 0-10-.6-10.9-1.3-10.8-2-11.6-2.9-9.5-3-9.3-3.7-6.1-3.3 .3-7 1.4-9.8 2.2-9.8 3.3-11.5 3.7-10.3 4.4-10.1 4.5-8.9 6-10.4 11.6-16.3 7.2-8.2 6.3-6.4 6.7-6 7.8-6.2 8.3-5.5 7.9-4.4M167.9 572.6l-10 .1-8.9-.6-9.9-1.4-8.8-1.9-8.7-2.4-10.3-3.6-9.2-3.9-9.9-4.9-9.5-5.5-8.3-5.5-8.8-6.5-8.4-7.1-8.6-8.4-6.7-7.3-6.2-7.9-3.7-5.9 3.8-5.9 6.2-7.8 6.7-7.4 8.6-8.3 8.4-7.1 8.8-6.5 8.4-5.5 10.4-6 18.1-8.3 10.4-3.5 8.7-2.4 8.8-1.9 9.9-1.4 9.9-.6 9 .1M176.1 396.8l-8.7-4.9-7.4-5-7.9-6.2-6.7-6-6.3-6.4-7.1-8.3-6.1-8-6-9.1-5.5-9.5-4.5-8.9-4.3-10.1-3.7-10.4-3.4-11.5-2.1-9.7-1.4-9.9-.2-6.9 6.2-3.3 9.2-3.7 9.6-3 11.6-2.9 10.8-1.9 10.9-1.3 10-.6 12 .1 19.8 1.9 10.8 2.1 8.7 2.2 8.5 2.8 9.3 3.7 9 4.5 7.7 4.6M271.1 248.7l-5.1-8.6-3.9-8.1-3.7-9.2-2.8-8.6-2.3-8.7-2-10.8-1.3-9.9-.7-10.9 0-11 .6-10 1.3-10.9 2-10.8 2.9-11.6 3-9.5 3.7-9.3 3.3-6.1 7 .3 9.8 1.4 9.8 2.2 11.5 3.3 10.3 3.7 10.1 4.4 8.9 4.5 10.4 6 16.3 11.6 8.2 7.2 6.4 6.3 6 6.7 6.2 7.8 5.5 8.3 4.4 7.9M427.4 167.9l-.1-10 .6-8.9 1.4-9.9 1.9-8.8 2.4-8.7 3.6-10.3 3.9-9.2 4.9-9.9 5.5-9.5 5.5-8.3 6.5-8.8 7.1-8.4 8.4-8.6 7.3-6.7 7.9-6.2 5.9-3.7 5.9 3.8 7.8 6.2 7.4 6.7 8.3 8.6 7.1 8.4 6.5 8.8 5.5 8.4 6 10.4 8.3 18.1 3.5 10.4 2.4 8.7 1.9 8.8 1.4 9.9 .6 9.9-.1 9M603.2 176.1l 4.9-8.7 5-7.4 6.2-7.9 6-6.7 6.4-6.3 8.3-7.1 8-6.1 9.1-6 9.5-5.5 8.9-4.5 10.1-4.3 10.4-3.7 11.5-3.4 9.7-2.1 9.9-1.4 6.9-.2 3.3 6.2 3.7 9.2 3 9.6 2.9 11.6 1.9 10.8 1.3 10.9 .6 10-.1 12-1.9 19.8-2.1 10.8-2.2 8.7-2.8 8.5-3.7 9.3-4.5 9-4.6 7.7M751.3 271.1l 8.6-5.1 8.1-3.9 9.2-3.7 8.6-2.8 8.7-2.3 10.8-2 9.9-1.3 10.9-.7 11 0 10 .6 10.9 1.3 10.8 2 11.6 2.9 9.5 3 9.3 3.7 6.1 3.3-.3 7-1.4 9.8-2.2 9.8-3.3 11.5-3.7 10.3-4.4 10.1-4.5 8.9-6 10.4-11.6 16.3-7.2 8.2-6.3 6.4-6.7 6-7.8 6.2-8.3 5.5-7.9 4.4M840 500l-.4 17-1.2 15.9-2.1 16.9-2.9 16.7-3.7 16.6-4.6 16.4-5 15.2-6.1 15.8-7 15.5-7.6 15.2-8.5 14.8-8.6 13.4-9.8 13.9-9.8 12.6-11.2 12.9-11 11.5-12.3 11.7-12.1 10.5-13.4 10.5-13.9 9.8-14.3 9-14.8 8.4-14.3 7.2-15.6 6.8-15.8 6.1-16.2 5.3-16.4 4.5-15.6 3.5-16.7 2.8-15.9 2-17 1.2-16 .4-16.9-.4-16-1.2-16.9-2-16.7-2.9-16.6-3.8-16.3-4.5-15.2-5-15.9-6.2-14.6-6.4-15.2-7.7-13.9-7.8-14.4-9.1-13.1-9.1-13.4-10.5-12.9-11-12.4-11.7-11.7-12.3-10.4-12.1-10.5-13.4-9.8-13.9-9.1-14.3-8.4-14.8-7.2-14.3-6.8-15.5-5.8-15-5.4-16.1-4.3-15.4-3.7-16.6-2.8-15.7-2.2-16.9-1.2-16.9-.5-17 .4-17 1.2-16.9 2-15.9 2.9-16.8 3.7-16.5 4.5-16.4 5.4-16.1 5.8-15 6.8-15.5 7.2-14.3 8.4-14.8 9.1-14.3 9.8-13.9 10.5-13.4 10.4-12.1 11.7-12.3 12.4-11.7 12.9-11 13.4-10.5 13.1-9.1 14.4-9.1 13.9-7.8 15.2-7.7 14.6-6.4 15.9-6.2 15.2-5 16.3-4.5 16.6-3.8 16.7-2.9 16.9-2 16-1.2 16.9-.4 16 .4 17 1.2 15.9 2 16.7 2.8 15.6 3.5 16.4 4.5 16.2 5.3 15.8 6.1 15.6 6.8 14.3 7.2 14.8 8.4 14.3 9 13.9 9.8 13.4 10.5 12.1 10.5 12.3 11.7 11 11.5 11.2 12.9 9.8 12.6 9.8 13.9 8.6 13.4 8.5 14.8 7.6 15.2 7 15.5 6.1 15.8 5 15.2 4.6 16.4 3.7 16.6 2.9 16.7 2.1 16.9 1.2 15.9z"/>
    <path stroke-width="6" d="M910.8 552l 4.3 6.8 3.5 7.2 3.1 8.4 1.9 7.8 1.3 9.9 .1 7-1.9 13.8-5.5 13.9-3.7 6-5.4 7.2-5.4 5.8-6.9 5.8-7.4 5.1-7.1 3.7M829.8 750.5l .3 8-.6 7.9-1.5 8.9-2.2 7.7-3.9 9.2-3.3 6.1-8.6 11.1-11.8 9.2-6.1 3.4-8.3 3.5-7.6 2.3-8.9 1.6-8.9 .7-8-.3M660.4 881.8l-3.8 7.1-4.4 6.6-5.8 6.9-5.7 5.5-8 6.1-6 3.6-12.9 5.3-14.8 2.1-7-.1-8.9-1.1-7.8-1.8-8.5-3-8.1-4-6.8-4.2M448 910.8l-6.8 4.3-7.2 3.5-8.4 3.1-7.8 1.9-9.9 1.3-7 .1-13.8-1.9-13.9-5.5-6-3.7-7.2-5.4-5.8-5.4-5.8-6.9-5.1-7.4-3.7-7.1M249.5 829.8l-8 .3-7.9-.6-8.9-1.5-7.7-2.2-9.2-3.9-6.1-3.3-11.1-8.6-9.2-11.8-3.4-6.1-3.5-8.3-2.3-7.6-1.6-8.9-.7-8.9 .3-8M118.2 660.4l-7.1-3.8-6.6-4.4-6.9-5.8-5.5-5.7-6.1-8-3.6-6-5.3-12.9-2.1-14.8 .1-7 1.1-8.9 1.8-7.8 3-8.5 4-8.1 4.2-6.8M89.2 448l-4.3-6.8-3.5-7.2-3.1-8.4-1.9-7.8-1.3-9.9-.1-7 1.9-13.8 5.5-13.9 3.7-6 5.4-7.2 5.4-5.8 6.9-5.8 7.4-5.1 7.1-3.7M170.2 249.5l-.3-8 .6-7.9 1.5-8.9 2.2-7.7 3.9-9.2 3.3-6.1 8.6-11.1 11.8-9.2 6.1-3.4 8.3-3.5 7.6-2.3 8.9-1.6 8.9-.7 8 .3M339.6 118.2l 3.8-7.1 4.4-6.6 5.8-6.9 5.7-5.5 8-6.1 6-3.6 12.9-5.3 14.8-2.1 7 .1 8.9 1.1 7.8 1.8 8.5 3 8.1 4 6.8 4.2M552 89.2l 6.8-4.3 7.2-3.5 8.4-3.1 7.8-1.9 9.9-1.3 7-.1 13.8 1.9 13.9 5.5 6 3.7 7.2 5.4 5.8 5.4 5.8 6.9 5.1 7.4 3.7 7.1M750.5 170.2l 8-.3 7.9 .6 8.9 1.5 7.7 2.2 9.2 3.9 6.1 3.3 11.1 8.6 9.2 11.8 3.4 6.1 3.5 8.3 2.3 7.6 1.6 8.9 .7 8.9-.3 8M881.8 339.6l 7.1 3.8 6.6 4.4 6.9 5.8 5.5 5.7 6.1 8 3.6 6 5.3 12.9 2.1 14.8-.1 7-1.1 8.9-1.8 7.8-3 8.5-4 8.1-4.2 6.8M780 500l-.4 14-.9 12.9-1.7 13.9-2.4 13.8-3.1 13.7-3.7 13.5-4.1 12.3-5 13.1-5.7 12.7-6.3 12.5-6.9 12.2-7 11-8.1 11.4-7.9 10.2-9.2 10.7-9.6 10.1-10.1 9.6-10.7 9.2-10.2 7.9-11.4 8.1-11 7-12.2 6.9-12.5 6.3-12.7 5.7-13.1 5-12.3 4.1-13.5 3.7-13.7 3.1-13.8 2.4-13.9 1.7-12.9 .9-14 .4-14-.4-12.9-.9-13.9-1.7-13.8-2.4-13.7-3.1-13.5-3.7-12.3-4.1-13.1-5-12.7-5.7-12.5-6.3-12.2-6.9-11-7-11.4-8.1-10.2-7.9-10.7-9.2-10.1-9.6-9.6-10.1-9.2-10.7-7.9-10.2-8.1-11.4-7-11-6.9-12.2-6.3-12.5-5.7-12.7-5-13.1-4.1-12.3-3.7-13.5-3.1-13.7-2.4-13.8-1.7-13.9-.9-12.9-.4-14 .4-14 .9-12.9 1.7-13.9 2.4-13.8 3.1-13.7 3.7-13.5 4.1-12.3 5-13.1 5.7-12.7 6.3-12.5 6.9-12.2 7-11 8.1-11.4 7.9-10.2 9.2-10.7 9.6-10.1 10.1-9.6 10.7-9.2 10.2-7.9 11.4-8.1 11-7 12.2-6.9 12.5-6.3 12.7-5.7 13.1-5 12.3-4.1 13.5-3.7 13.7-3.1 13.8-2.4 13.9-1.7 12.9-.9 14-.4 14 .4 12.9 .9 13.9 1.7 13.8 2.4 13.7 3.1 13.5 3.7 12.3 4.1 13.1 5 12.7 5.7 12.5 6.3 12.2 6.9 11 7 11.4 8.1 10.2 7.9 10.7 9.2 10.1 9.6 9.6 10.1 9.2 10.7 7.9 10.2 8.1 11.4 7 11 6.9 12.2 6.3 12.5 5.7 12.7 5 13.1 4.1 12.3 3.7 13.5 3.1 13.7 2.4 13.8 1.7 13.9 .9 12.9zM710 500l-1 21-3.2 20.7-5.2 20.3-6.8 18.8-9 19-10.3 17.1-11.9 16-14.1 15.6-15.6 14.1-16.9 12.4-17.1 10.3-19 8.9-19.8 7-19.4 4.8-19.7 3-21 1-20-1-20.7-3-20.4-5.1-19.7-7.1-19-9-17.1-10.3-16.8-12.6-14.8-13.4-13.4-14.8-12.6-16.8-10.8-18-8.9-19-7-19.8-4.8-19.4-3-20.7-1-20 1-20 3-20.7 4.8-19.4 7-19.8 8.9-19 10.8-18 12.6-16.8 13.4-14.8 14.8-13.4 16.8-12.6 17.1-10.3 19-9 19.7-7.1 20.4-5.1 20.7-3 20-1 21 1 19.7 3 19.4 4.8 19.8 7 19 8.9 17.1 10.3 16.9 12.4 15.6 14.1 14.1 15.6 11.9 16 10.3 17.1 9 19 6.8 18.8 5.2 20.3 3.2 20.7zM600 500l-.5 10-1.5 9.8-2.5 9.7-3 8.5-4.2 9-5.2 8.6-5.9 8-6.1 6.7-7.3 6.7-8 6-7.7 4.7-9 4.3-9.3 3.5-9.7 2.5-9.9 1.5-10 .5-9.9-.5-9.9-1.4-9.7-2.5-9.4-3.4-9-4.3-8.5-5.2-8-6-6.6-6.1-6.7-7.4-5.9-8-4.6-7.7-4.3-9.1-3.4-9.4-2.4-9.6-1.4-8.9-.5-10 .5-10 1.4-9.9 2.4-9.6 3.4-9.4 4.3-9.1 4.6-7.7 5.9-8 6.7-7.4 6.6-6.1 8-6 8.5-5.2 9-4.3 8.5-3.1 9.6-2.6 9.9-1.5 10-.6 9.9 .4 9.9 1.4 9.7 2.4 8.5 3 9.1 4.2 8.6 5.1 8 5.9 7.4 6.6 6.8 7.4 5.9 8 5.2 8.6 4.2 9 3 8.5 2.5 9.7 1.5 9.8zM501.8 430.7l 10.8 29 1.4 2.6 1.7 1 2-.1 1.8-.6 28.2-12.8 2.8-.5 .3 .9-.5 1.9-13.2 29.1-.5 1.9 .4 1.9 1.4 1.4 1.7 .9 29 10.9 2.4 1.6-.3 .8-1.7 1-29.9 11.3-1.7 .9-1.1 1.7-.1 1.9 .6 1.9 12.8 28.2 .8 2.9-.8 .4-2-.4-29-13.2-2-.6-1.9 .2-1.5 1.3-.9 1.8-10.9 29-1.5 2.5-.8 0-1.1-1.6-11.3-29.9-.9-1.8-1.5-1.3-2-.2-1.9 .6-29.1 13.2-1.9 .4-.8-.5 .8-2.8 12.8-28.2 .6-1.9-.1-2-1.1-1.6-1.8-.9-29.9-11.3-1.7-1-.2-.8 2.4-1.6 29-10.9 1.8-.9 1.3-1.4 .4-1.9-.5-2-13.2-29-.5-2 .3-.8 2.8 .5 28.2 12.8 1.9 .6 1.9 .1 1.7-1.1 1.4-2.6 11.3-29.8 1.3-1.4 .8 .5z"/>
    <path stroke-width="5" d="M860.6 468.4l 9 .3 9.8 1.7 9.6 2.7 10.2 4 9.8 5 10.1 6.5 10 8.2 2.7 2.9-.2 .8-5.7 5.6-8.7 6.7-8.5 5.3-9.8 4.9-10.2 4-9.6 2.7-9.8 1.6-8 .3-.7-.4 1.1-15.9 .3-16-.3-14.9zM828.1 653l 7.6 4.7 7.7 6.4 6.9 7.1 6.9 8.6 6 9.2 5.5 10.6 4.5 12.2 .9 3.9-.6 .5-7.7 2-10.9 1.5-10 .3-10.9-.6-10.8-1.7-9.7-2.5-9.3-3.5-7.1-3.7-.4-.6 8.9-13.3 8.2-13.7 7.2-13.1zM707.6 796.5l 4.3 7.9 3.4 9.4 2.5 9.7 1.6 10.8 .6 11-.5 11.9-2.2 12.8-1.2 3.8-.8 .2-7.6-2.1-10.2-4.2-8.8-4.7-9.1-6-8.6-6.9-7.1-7-6.4-7.7-4.2-6.7 0-.8 14.3-7 14-7.7 12.8-7.8zM531.6 860.6l-.3 9-1.7 9.8-2.7 9.6-4 10.2-5 9.8-6.5 10.1-8.2 10-2.9 2.7-.8-.2-5.6-5.7-6.7-8.7-5.3-8.5-4.9-9.8-4-10.2-2.7-9.6-1.6-9.8-.3-8 .4-.7 15.9 1.1 16 .3 14.9-.3zM347 828.1l-4.7 7.6-6.4 7.7-7.1 6.9-8.6 6.9-9.2 6-10.6 5.5-12.2 4.5-3.9 .9-.5-.6-2-7.7-1.5-10.9-.3-10 .6-10.9 1.7-10.8 2.5-9.7 3.5-9.3 3.7-7.1 .6-.4 13.3 8.9 13.7 8.2 13.1 7.2zM203.5 707.6l-7.9 4.3-9.4 3.4-9.7 2.5-10.8 1.6-11 .6-11.9-.5-12.8-2.2-3.8-1.2-.2-.8 2.1-7.6 4.2-10.2 4.7-8.8 6-9.1 6.9-8.6 7-7.1 7.7-6.4 6.7-4.2 .8 0 7 14.3 7.7 14 7.8 12.8zM139.4 531.6l-9-.3-9.8-1.7-9.6-2.7-10.2-4-9.8-5-10.1-6.5-10-8.2-2.7-2.9 .2-.8 5.7-5.6 8.7-6.7 8.5-5.3 9.8-4.9 10.2-4 9.6-2.7 9.8-1.6 8-.3 .7 .4-1.1 15.9-.3 16 .3 14.9zM171.9 347l-7.6-4.7-7.7-6.4-6.9-7.1-6.9-8.6-6-9.2-5.5-10.6-4.5-12.2-.9-3.9 .6-.5 7.7-2 10.9-1.5 10-.3 10.9 .6 10.8 1.7 9.7 2.5 9.3 3.5 7.1 3.7 .4 .6-8.9 13.3-8.2 13.7-7.2 13.1zM292.4 203.5l-4.3-7.9-3.4-9.4-2.5-9.7-1.6-10.8-.6-11 .5-11.9 2.2-12.8 1.2-3.8 .8-.2 7.6 2.1 10.2 4.2 8.8 4.7 9.1 6 8.6 6.9 7.1 7 6.4 7.7 4.2 6.7 0 .8-14.3 7-14 7.7-12.8 7.8zM468.4 139.4l .3-9 1.7-9.8 2.7-9.6 4-10.2 5-9.8 6.5-10.1 8.2-10 2.9-2.7 .8 .2 5.6 5.7 6.7 8.7 5.3 8.5 4.9 9.8 4 10.2 2.7 9.6 1.6 9.8 .3 8-.4 .7-15.9-1.1-16-.3-14.9 .3zM653 171.9l 4.7-7.6 6.4-7.7 7.1-6.9 8.6-6.9 9.2-6 10.6-5.5 12.2-4.5 3.9-.9 .5 .6 2 7.7 1.5 10.9 .3 10-.6 10.9-1.7 10.8-2.5 9.7-3.5 9.3-3.7 7.1-.6 .4-13.3-8.9-13.7-8.2-13.1-7.2zM796.5 292.4l 7.9-4.3 9.4-3.4 9.7-2.5 10.8-1.6 11-.6 11.9 .5 12.8 2.2 3.8 1.2 .2 .8-2.1 7.6-4.2 10.2-4.7 8.8-6 9.1-6.9 8.6-7 7.1-7.7 6.4-6.7 4.2-.8 0-7-14.3-7.7-14-7.8-12.8zM822.3 540.5l-1.1 5.8-3.3 4.8-4.1 2.9-5.7 1.4-5.9-.8-5-3.1-3.5-4.8-1.3-5.7 .9-5.9 3.2-5 4.8-3.4 5.8-1.2 5.8 1 5 3.3 3.3 4.9zM801.4 618.6l-1.2 5.8-3.3 4.9-4 2.9-5.8 1.4-5.8-.9-5-3-3.5-4.8-1.4-5.8 1-5.8 3.2-5 4.8-3.4 5.8-1.2 5.8 1 4.9 3.2 3.3 4.9zM760.9 688.7l-1.1 5.8-3.3 4.9-4.1 2.8-5.7 1.5-5.9-.9-5-3.1-3.5-4.7-1.3-5.8 .9-5.8 3.2-5 4.8-3.4 5.8-1.3 5.8 1.1 5 3.2 3.3 4.9zM703.7 745.9l-1.2 5.8-3.3 4.9-4 2.9-5.7 1.4-5.9-.9-5-3-3.5-4.8-1.4-5.8 1-5.8 3.2-5 4.8-3.4 5.8-1.2 5.8 1 4.9 3.3 3.3 4.8zM633.6 786.4l-1.1 5.8-3.4 4.9-4 2.8-5.7 1.5-5.9-.9-5-3.1-3.5-4.8-1.3-5.7 .9-5.8 3.2-5 4.8-3.4 5.8-1.3 5.8 1.1 4.9 3.2 3.4 4.9zM555.5 807.3l-1.2 5.8-3.3 4.9-4.1 2.9-5.7 1.4-5.8-.9-5.1-3-3.5-4.8-1.3-5.8 1-5.8 3.1-5 4.8-3.4 5.8-1.2 5.8 1 5 3.3 3.3 4.9zM474.5 807.3l-1.1 5.8-3.4 4.9-4 2.9-5.7 1.4-5.9-.9-5-3-3.5-4.8-1.3-5.8 .9-5.8 3.2-5 4.8-3.4 5.8-1.2 5.8 1 4.9 3.3 3.4 4.9zM396.4 786.4l-1.2 5.8-3.3 4.9-4.1 2.8-5.7 1.5-5.8-.9-5.1-3.1-3.5-4.8-1.3-5.7 1-5.8 3.1-5 4.9-3.4 5.7-1.3 5.8 1.1 5 3.2 3.3 4.9zM326.3 745.9l-1.2 5.8-3.3 4.9-4 2.9-5.8 1.4-5.8-.9-5.1-3-3.4-4.8-1.4-5.8 1-5.8 3.1-5 4.9-3.4 5.7-1.2 5.8 1 5 3.3 3.3 4.8zM269.1 688.7l-1.2 5.8-3.3 4.9-4.1 2.8-5.7 1.5-5.8-.9-5.1-3.1-3.5-4.7-1.3-5.8 1-5.8 3.1-5 4.8-3.4 5.8-1.3 5.8 1.1 5 3.2 3.3 4.9zM228.6 618.6l-1.2 5.8-3.3 4.9-4 2.9-5.8 1.4-5.8-.9-5.1-3-3.4-4.8-1.4-5.8 1-5.8 3.1-5 4.9-3.4 5.7-1.2 5.9 1 4.9 3.2 3.3 4.9zM207.7 540.5l-1.2 5.8-3.3 4.8-4.1 2.9-5.7 1.4-5.9-.8-5-3.1-3.5-4.8-1.3-5.7 1-5.9 3.1-5 4.8-3.4 5.8-1.2 5.8 1 5 3.3 3.3 4.9zM207.7 459.5l-1.2 5.8-3.3 4.9-4.1 2.9-5.7 1.4-5.9-.9-5-3-3.5-4.8-1.3-5.8 1-5.8 3.1-5 4.8-3.4 5.8-1.2 5.8 1 5 3.3 3.3 4.8zM228.6 381.4l-1.2 5.8-3.3 4.9-4 2.8-5.8 1.4-5.8-.8-5.1-3.1-3.4-4.8-1.4-5.7 1-5.9 3.1-5 4.9-3.4 5.7-1.2 5.9 1.1 4.9 3.2 3.3 4.9zM269.1 311.3l-1.2 5.8-3.3 4.9-4.1 2.8-5.7 1.5-5.8-.9-5.1-3.1-3.5-4.8-1.3-5.7 1-5.8 3.1-5 4.8-3.4 5.8-1.3 5.8 1.1 5 3.2 3.3 4.9zM326.3 254.1l-1.2 5.8-3.3 4.8-4 2.9-5.8 1.4-5.8-.8-5.1-3.1-3.4-4.8-1.4-5.7 1-5.9 3.1-5 4.9-3.4 5.7-1.2 5.8 1 5 3.3 3.3 4.9zM396.4 213.6l-1.2 5.8-3.3 4.9-4.1 2.8-5.7 1.5-5.8-.9-5.1-3.1-3.5-4.8-1.3-5.7 1-5.8 3.1-5 4.9-3.4 5.7-1.3 5.8 1.1 5 3.2 3.3 4.9zM474.5 192.7l-1.1 5.7-3.4 4.9-4 2.9-5.7 1.4-5.9-.8-5-3.1-3.5-4.8-1.3-5.8 .9-5.8 3.2-5 4.8-3.4 5.8-1.2 5.8 1 4.9 3.3 3.4 4.9zM555.5 192.7l-1.2 5.7-3.3 4.9-4.1 2.9-5.7 1.4-5.8-.8-5.1-3.1-3.5-4.8-1.3-5.8 1-5.8 3.1-5 4.8-3.4 5.8-1.2 5.8 1 5 3.3 3.3 4.9zM633.6 213.6l-1.1 5.8-3.4 4.9-4 2.8-5.7 1.5-5.9-.9-5-3.1-3.5-4.8-1.3-5.7 .9-5.8 3.2-5 4.8-3.4 5.8-1.3 5.8 1.1 4.9 3.2 3.4 4.9zM703.7 254.1l-1.2 5.8-3.3 4.8-4 2.9-5.7 1.4-5.9-.8-5-3.1-3.5-4.8-1.4-5.7 1-5.9 3.2-5 4.8-3.4 5.8-1.2 5.8 1 4.9 3.3 3.3 4.9zM760.9 311.3l-1.1 5.8-3.3 4.9-4.1 2.8-5.7 1.5-5.9-.9-5-3.1-3.5-4.8-1.3-5.7 .9-5.8 3.2-5 4.8-3.4 5.8-1.3 5.8 1.1 5 3.2 3.3 4.9zM801.4 381.4l-1.2 5.8-3.3 4.9-4 2.8-5.8 1.4-5.8-.8-5-3.1-3.5-4.8-1.4-5.7 1-5.9 3.2-5 4.8-3.4 5.8-1.2 5.8 1.1 4.9 3.2 3.3 4.9zM822.3 459.5l-1.1 5.8-3.3 4.9-4.1 2.9-5.7 1.4-5.9-.9-5-3-3.5-4.8-1.3-5.8 .9-5.8 3.2-5 4.8-3.4 5.8-1.2 5.8 1 5 3.3 3.3 4.8zM780.5 503.5l-72.6 22.3M707.8 529.1l 64.4 40.3M769.6 576l-74.9 2.7M692.8 581.5l 51.8 55.6M741.3 643.3l-74-17M665.3 629l 35.7 67.1M695.7 700.7l-67.2-35.6M626.2 666.8l 17 74.1M637.5 744.9l-55.6-51.8M578.7 694.2l-2.7 75.9M569.2 771.8l-40.3-64.4M525.6 708.3l-21.9 71.7M496.3 780l-21.9-71.7M471.1 707.4l-40.3 64.4M424 770.1l-2.7-75.9M418.1 693.1l-55.6 51.8M356.8 740.9l 17-74.1M371.5 665.1l-67.2 35.6M299 696.1l 35.7-67.1M332.7 626.3l-74 17M255.4 637.1l 51.8-55.6M305.3 578.7l-74.9-2.7M227.8 569.4l 64.4-40.3M292.1 525.8l-72.6-22.3M219.5 496.5l 72.6-22.3M292.2 470.9l-64.4-40.3M230.4 424l 74.9-2.7M307.2 418.5l-51.8-55.6M258.7 356.7l 74 17M334.7 371l-35.7-67.1M304.3 299.3l 67.2 35.6M373.8 333.2l-17-74.1M362.5 255.1l 55.6 51.8M421.3 305.8l 2.7-75.9M430.8 228.2l 40.3 64.4M474.4 291.7l 21.9-71.7M503.7 220l 21.9 71.7M528.9 292.6l 40.3-64.4M576 229.9l 2.7 75.9M581.9 306.9l 55.6-51.8M643.2 259.1l-17 74.1M628.5 334.9l 67.2-35.6M701 303.9l-35.7 67.1M667.3 373.7l 74-17M744.6 362.9l-51.8 55.6M694.7 421.3l 74.9 2.7M772.2 430.6l-64.4 40.3M707.9 474.2l 72.6 22.3M598.5 482.8l-.2-1 5.9-1 19.9-2.2 14 .1 11.8 1.6 10.6 3.1 8.8 4.7 3.8 3.2 2.6 3 1.1 1.7 1.2 3.8-1.1 3.9-1.6 2.5-5.8 5.5-7.8 4.4-10.5 3.3-11.8 1.8-14 .3-17.9-1.7-8.9-1.5-.2-.7M593.9 534.3l .4-.9 5.6 2 18.3 8.1 12 7.1 9.5 7.3 7.6 8 5.2 8.4 1.8 4.7 .7 3.9 .1 2-.9 3.9-2.8 2.8-2.7 1.4-7.7 1.9-9-.2-10.7-2.3-11.2-4.3-12.2-6.8-14.7-10.4-6.9-5.7 .2-.8M536.8 593l 1.9-.8M545 589.3l 1.8-.9M564.2 576.7l .7-.7 3.9 4.6 11.8 16.2 6.9 12.1 4.5 11.1 2.6 10.7 .3 10-.8 4.9-1.3 3.7-1 1.8-2.7 2.9-3.8 1-3-.1-7.7-2.2-7.7-4.6-8.1-7.4-7.5-9.4-7.2-12-7.4-16.3-3.2-8.4 .5-.6M485.4 598.9l 2 .3M494.3 599.8l 2 .1M517.2 598.5l 1-.2 1 5.9 2.2 19.9-.1 14-1.6 11.8-3.1 10.6-4.7 8.8-3.2 3.8-3 2.6-1.7 1.1-3.8 1.2-3.9-1.1-2.5-1.6-5.5-5.8-4.4-7.8-3.3-10.5-1.8-11.8-.3-14 1.7-17.9 1.5-8.9 .7-.2M437.9 578.4l 1.6 1.2M445.2 583.6l 1.7 1.1M465.7 593.9l .9 .4-2 5.6-8.1 18.3-7.1 12-7.3 9.5-8 7.6-8.4 5.2-4.7 1.8-3.9 .7-2 .1-3.9-.9-2.8-2.8-1.4-2.7-1.9-7.7 .2-9 2.3-10.7 4.3-11.2 6.8-12.2 10.4-14.7 5.7-6.9 .8 .2M407 536.8l .8 1.9M410.7 545l .9 1.8M423.3 564.2l .7 .7-4.6 3.9-16.2 11.8-12.1 6.9-11.1 4.5-10.7 2.6-10 .3-4.9-.8-3.7-1.3-1.8-1-2.9-2.7-1-3.8 .1-3 2.2-7.7 4.6-7.7 7.4-8.1 9.4-7.5 12-7.2 16.3-7.4 8.4-3.2 .6 .5M401.5 517.2l .2 1-5.9 1-19.9 2.2-14-.1-11.8-1.6-10.6-3.1-8.8-4.7-3.8-3.2-2.6-3-1.1-1.7-1.2-3.8 1.1-3.9 1.6-2.5 5.8-5.5 7.8-4.4 10.5-3.3 11.8-1.8 14-.3 17.9 1.7 8.9 1.5 .2 .7M406.1 465.7l-.4 .9-5.6-2-18.3-8.1-12-7.1-9.5-7.3-7.6-8-5.2-8.4-1.8-4.7-.7-3.9-.1-2 .9-3.9 2.8-2.8 2.7-1.4 7.7-1.9 9 .2 10.7 2.3 11.2 4.3 12.2 6.8 14.7 10.4 6.9 5.7-.2 .8M463.2 407l-1.9 .8M455 410.7l-1.8 .9M435.8 423.3l-.7 .7-3.9-4.6-11.8-16.2-6.9-12.1-4.5-11.1-2.6-10.7-.3-10 .8-4.9 1.3-3.7 1-1.8 2.7-2.9 3.8-1 3 .1 7.7 2.2 7.7 4.6 8.1 7.4 7.5 9.4 7.2 12 7.4 16.3 3.2 8.4-.5 .6M514.6 401.1l-2-.3M505.7 400.2l-2-.1M482.8 401.5l-1 .2-1-5.9-2.2-19.9 .1-14 1.6-11.8 3.1-10.6 4.7-8.8 3.2-3.8 3-2.6 1.7-1.1 3.8-1.2 3.9 1.1 2.5 1.6 5.5 5.8 4.4 7.8 3.3 10.5 1.8 11.8 .3 14-1.7 17.9-1.5 8.9-.7 .2M562.1 421.6l-1.6-1.2M554.8 416.4l-1.7-1.1M534.3 406.1l-.9-.4 2-5.6 8.1-18.3 7.1-12 7.3-9.5 8-7.6 8.4-5.2 4.7-1.8 3.9-.7 2-.1 3.9 .9 2.8 2.8 1.4 2.7 1.9 7.7-.2 9-2.3 10.7-4.3 11.2-6.8 12.2-10.4 14.7-5.7 6.9-.8-.2M593 463.2l-.8-1.9M589.3 455l-.9-1.8M576.7 435.8l-.7-.7 4.6-3.9 16.2-11.8 12.1-6.9 11.1-4.5 10.7-2.6 10-.3 4.9 .8 3.7 1.3 1.8 1 2.9 2.7 1 3.8-.1 3-2.2 7.7-4.6 7.7-7.4 8.1-9.4 7.5-12 7.2-16.3 7.4-8.4 3.2-.6-.5M518 500l-.5 3.9-1.2 3.8-2.1 3.4-2 2.1-2.4 1.9-3.5 1.7-3.8 1-3 .2-3-.3-3.7-1.2-3.5-2-2.2-2-2.4-3.1-1.4-2.6-.9-2.9-.4-3.9 .4-3.9 .9-2.9 1.4-2.6 2.4-3.1 2.2-2 3.5-2 3.7-1.2 3-.3 3 .2 3.8 1 3.5 1.7 2.4 1.9 2 2.1 2.1 3.4 1.2 3.8z"/>
    <path fill="#111" stroke-width="5" d="M897.2 604.6l-.5 2.6-1.5 2.3-2.3 1.5-2.7 .6-2.6-.6-2.3-1.5-1.5-2.3-.6-2.6 .6-2.7 1.5-2.3 2.3-1.5 2.6-.5 2.7 .5 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M792.7 785.7l-.6 2.6-1.5 2.3-2.3 1.5-2.6 .6-2.7-.6-2.3-1.5-1.5-2.3-.5-2.6 .5-2.7 1.5-2.3 2.3-1.5 2.7-.5 2.6 .5 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M611.6 890.2l-.6 2.7-1.5 2.3-2.3 1.5-2.6 .5-2.7-.5-2.3-1.5-1.5-2.3-.5-2.7 .5-2.6 1.5-2.3 2.3-1.5 2.7-.6 2.6 .6 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M402.4 890.2l-.5 2.7-1.5 2.3-2.3 1.5-2.7 .5-2.6-.5-2.3-1.5-1.5-2.3-.6-2.7 .6-2.6 1.5-2.3 2.3-1.5 2.6-.6 2.7 .6 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M221.3 785.7l-.5 2.6-1.5 2.3-2.3 1.5-2.7 .6-2.6-.6-2.3-1.5-1.5-2.3-.6-2.6 .6-2.7 1.5-2.3 2.3-1.5 2.6-.5 2.7 .5 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M116.8 604.6l-.6 2.6-1.5 2.3-2.3 1.5-2.6 .6-2.7-.6-2.3-1.5-1.5-2.3-.5-2.6 .5-2.7 1.5-2.3 2.3-1.5 2.7-.5 2.6 .5 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M116.8 395.4l-.6 2.7-1.5 2.3-2.3 1.5-2.6 .5-2.7-.5-2.3-1.5-1.5-2.3-.5-2.7 .5-2.6 1.5-2.3 2.3-1.5 2.7-.6 2.6 .6 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M221.3 214.3l-.5 2.7-1.5 2.3-2.3 1.5-2.7 .5-2.6-.5-2.3-1.5-1.5-2.3-.6-2.7 .6-2.6 1.5-2.3 2.3-1.5 2.6-.6 2.7 .6 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M402.4 109.8l-.5 2.6-1.5 2.3-2.3 1.5-2.7 .6-2.6-.6-2.3-1.5-1.5-2.3-.6-2.6 .6-2.7 1.5-2.3 2.3-1.5 2.6-.5 2.7 .5 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M611.6 109.8l-.6 2.6-1.5 2.3-2.3 1.5-2.6 .6-2.7-.6-2.3-1.5-1.5-2.3-.5-2.6 .5-2.7 1.5-2.3 2.3-1.5 2.7-.5 2.6 .5 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M792.7 214.3l-.6 2.7-1.5 2.3-2.3 1.5-2.6 .5-2.7-.5-2.3-1.5-1.5-2.3-.5-2.7 .5-2.6 1.5-2.3 2.3-1.5 2.7-.6 2.6 .6 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M897.2 395.4l-.5 2.7-1.5 2.3-2.3 1.5-2.7 .5-2.6-.5-2.3-1.5-1.5-2.3-.6-2.7 .6-2.6 1.5-2.3 2.3-1.5 2.6-.6 2.7 .6 2.3 1.5 1.5 2.3z"/>
    <path fill="#111" stroke-width="5" d="M455.1 544.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="5" d="M545.9 544.9l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="5" d="M455.1 454.1l-1 1-1-1 1-1z"/>
    <path fill="#111" stroke-width="5" d="M545.9 454.1l-1 1-1-1 1-1z"/>
  </g>
</svg>
`,ye=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="10">
      <path d="M0 880L345.6 880M654.4 880L1000 880"/>
      <path d="M112 560Q96 548 104 540L126 540L272 540Q282 540 282 550L282 858Q282 878 262 878L132 878Q112 878 112 858Z"/>
      <path d="M844 568L844 640L928 838C936 864.7 926.7 878 900 878L720 878C693.3 878 684 864.7 692 838L776 640L776 568"/>
      <path d="M602 161.7L602 830C602 833.2 601.6 836.1 600.8 838.5M399.2 838.5C398.4 836.1 398 833.2 398 830L398 161.7"/>
      <path d="M398.3 162L394 162C387.4 162 382 156.6 382 150L382 146C382 139.4 387.4 134 394 134L606 134C612.6 134 618 139.4 618 146L618 150C618 156.6 612.6 162 606 162L601.7 162"/>
      <path d="M372 838L628 838Q648 838 652 856L656 872Q658 888 640 888L360 888Q342 888 344 872L348 856Q352 838 372 838Z"/>
      <path d="M446 198C446 198 453.7 218.3 462 224C470.3 229.7 484.7 231.3 496 232C507.3 232.7 519.7 228 530 228C540.3 228 551.7 228.3 558 232C564.3 235.7 569 244.3 568 250C567 255.7 563 262.3 552 266C541 269.7 517 272.3 502 272C487 271.7 471.2 269.3 462 264C452.8 258.7 449.7 251 447 240C444.3 229 446 198 446 198Z"/>
      <path d="M553 206.2C549 216.1 539.3 223 528 223C513.1 223 501 210.9 501 196C501 181.1 513.1 169 528 169C541.3 169 552.3 178.6 554.6 191.3"/>
    </g>
    <g stroke-width="7">
      <path d="M109.9 694.4C140 690.6 170 692.5 200 700C228 707 256 709.1 284.1 706.3"/>
      <path d="M256 600L282 600"/>
      <path d="M242 650L282 650"/>
      <path d="M256 750L282 750"/>
      <path d="M242 800L282 800"/>
      <circle cx="160" cy="760" r="18"/>
      <circle cx="210" cy="812" r="13"/>
      <rect x="764" y="540" width="92" height="28" rx="10"/>
      <path d="M725.2 754.4C733.5 755.7 741.7 757.5 750 760C783.3 770 816.7 770 850 760C864.7 755.6 879.3 753.1 894 752.6"/>
      <circle cx="790" cy="810" r="14"/>
      <circle cx="840" cy="826" r="11"/>
      <circle cx="812" cy="488" r="16"/>
      <circle cx="838" cy="430" r="20"/>
      <circle cx="806" cy="372" r="14"/>
      <circle cx="846" cy="320" r="12"/>
      <path d="M395.9 241.7C414.2 243.6 432.5 244.9 450.8 245.8M565.4 244.9C578.3 244.1 591.2 243 604.1 241.7"/>
      <path d="M395.9 335.4C430.6 326.9 465.3 328.4 500 340C534.7 351.6 569.4 353.1 604.1 344.6"/>
      <path d="M395.9 444.6C408 447.5 420 449.3 432 449.8M486.2 444.1C490.8 442.9 495.4 441.5 500 440C534.7 428.4 569.4 426.9 604.1 435.4"/>
      <path d="M395.9 535.4C430.6 526.9 465.3 528.4 500 540C534.7 551.6 569.4 553.1 604.1 544.6"/>
      <path d="M395.9 644.6C430.6 653.1 465.3 651.6 500 640C509.9 636.7 519.9 634.2 529.8 632.5M573.3 630.5C583.6 631.3 593.8 632.9 604.1 635.4"/>
      <path d="M395.9 735.4C430.6 726.9 465.3 728.4 500 740C534.7 751.6 569.4 753.1 604.1 744.6"/>
      <circle cx="458" cy="436" r="30"/>
      <circle cx="552" cy="640" r="24"/>
      <path d="M550 192Q570 188 580 198Q570 208 550 206Z"/>
      <path d="M486 246Q506 262 528 247"/>
      <path d="M420 280L420 315M420 560L420 610"/>
      <path d="M270 160Q277.2 192.8 310 200Q277.2 207.2 270 240Q262.8 207.2 230 200Q262.8 192.8 270 160Z"/>
      <path d="M720 126Q726.12 153.88 754 160Q726.12 166.12 720 194Q713.88 166.12 686 160Q713.88 153.88 720 126Z"/>
      <path d="M180 354Q184.68 375.32 206 380Q184.68 384.68 180 406Q175.32 384.68 154 380Q175.32 375.32 180 354Z"/>
      <path d="M880 204Q884.68 225.32 906 230Q884.68 234.68 880 256Q875.32 234.68 854 230Q875.32 225.32 880 204Z"/>
    </g>
    <path fill="#111" stroke="none" d="M540 188C536.7 188 534 190.7 534.1 194C534.1 197.3 536.7 200 540 200C543.4 200 546 197.3 546 194C546.1 190.7 543.4 188 540.1 188Z"/>
  </g>
</svg>
`,j=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="7">
      <path d="M-10 930L108.8 930M193.3 930L206.8 930M290.9 930L1010 930"/>
      <path d="M100.6 664L-10 664L-10 630L100.6 630M299.2 630L310 630M342.5 630L386.9 630M495.1 630L508.9 630M631.1 630L636.2 630M763.9 630L790.8 630M819.3 630L866.6 630M895.4 630L915 630M964.6 630L1010 630L1010 664L366.2 664M325.8 664L299.2 664"/>
      <path d="M380 664L380 930"/>
      <path d="M431.9 211.9C428.7 199.1 454.3 180.9 494.4 165.2M611 136.1C653.8 131.2 684.9 135.3 688.1 148.1C691.3 160.9 665.7 179.1 625.6 194.8M509 223.9C466.2 228.8 435.1 224.7 431.9 211.9"/>
      <path d="M463 204.2C461.4 197.7 473 188.7 492.6 179.6M619.3 148C640.9 146.8 655.4 149.3 657 155.8"/>
      <path d="M500 212C494.9 202.5 492 191.6 492 180C492 142.4 522.4 112 560 112C597.6 112 628 142.4 628 180C628 180 628 180.1 628 180.1M626.4 194.5C619.8 225.1 592.6 248 560 248C539.2 248 520.6 238.7 508.2 224"/>
      <path d="M431.9 211.9C436.5 230.2 497.5 230.6 568.2 213C639 195.4 692.6 166.3 688.1 148.1"/>
      <circle cx="810" cy="140" r="54"/>
      <path d="M458 618.5L458 614M458 584L458 552.6M458 467.4L458 380"/>
      <rect x="386" y="618" width="110" height="24" rx="6"/>
      <path d="M433.5 453.6C459 459.6 478 482.6 478 510C478 542 452 568 420 568C388 568 362 542 362 510C362 482.6 381 459.6 406.5 453.6"/>
      <path d="M434 406L434 454.5M406 454.5L406 406"/>
      <path d="M434 430L470 430"/>
      <path d="M632 549L632 630C632 640.7 628 646 620 646L520 646C512 646 508 640.7 508 630L508 538"/>
      <path d="M508 504C510 494 509.3 479.7 516 470C522.7 460.3 535.7 450 548 446C560.3 442 577.7 442 590 446C602.3 450 614.7 460.3 622 470C629.3 479.7 631 493.3 634 504C637 514.7 641 526 640 534C639 542 631.3 553.7 628 552C624.7 550.3 624 530.7 620 524C616 517.3 609 509.3 604 512C599 514.7 594.7 533.3 590 540C585.3 546.7 580 553.7 576 552C572 550.3 570.7 536 566 530C561.3 524 554 515.7 548 516C542 516.3 535.3 527 530 532C524.7 537 520.3 546.3 516 546C511.7 545.7 505.3 537 504 530C502.7 523 506 514 508 504Z"/>
      <path d="M716 492L716 548L766 632C771.3 641.3 768.7 646 758 646L642 646C631.3 646 628.7 641.3 634 632L684 548L684 492"/>
      <path d="M790 646L790 548A53 53 0 0 1 896 548L896 646L866 646L866 548A23 23 0 0 0 820 548L820 646Z"/>
      <path d="M789.5 612L820.8 612M865.2 612L896.5 612"/>
      <path d="M184 751.5L184 880.5M134 880.6L134 751.5"/>
      <path d="M266 751.5L266 880.6M216 880.5L216 751.5"/>
      <path d="M106 910Q106 880 138 880L184 880Q194 880 194 894L194 936L114 936Q106 936 106 910Z"/>
      <path d="M294 910Q294 880 262 880L216 880Q206 880 206 894L206 936L286 936Q294 936 294 910Z"/>
      <path d="M101.1 548.5C104.3 537.8 114.3 530 126 530L176 530M224 530L274 530C288.4 530 300 541.6 300 556L300 564.4M300 612.4L300 726C300 740.4 288.4 752 274 752L126 752C111.6 752 100 740.4 100 726L100 603.2"/>
      <path d="M293 602L326.5 660.5M354.2 650.2C354 649 353.6 647.8 353 646.6L319.1 587.3"/>
      <circle cx="346" cy="670" r="22"/>
      <circle cx="300" cy="584" r="20"/>
      <path d="M109.3 567.1L77.9 490.3C77.7 489.9 77.5 489.5 77.3 489.1M49.4 499.6C49.6 500.3 49.8 501 50.1 501.7L81.5 578.5"/>
      <circle cx="58" cy="480" r="22"/>
      <circle cx="100" cy="584" r="20"/>
      <path d="M200 352.6L200 319.6"/>
      <circle cx="200" cy="306" r="14"/>
      <rect x="110" y="352" width="180" height="152" rx="30"/>
    </g>
    <g stroke-width="5.5">
      <rect x="392" y="694" width="172" height="206" rx="8"/>
      <circle cx="542" cy="800" r="10"/>
      <rect x="584" y="694" width="172" height="206" rx="8"/>
      <circle cx="734" cy="800" r="10"/>
      <rect x="776" y="694" width="196" height="206" rx="8"/>
      <circle cx="950" cy="800" r="10"/>
      <path d="M560 -10L560 112"/>
      <path d="M494.3 157.7C538.1 151.4 581.9 151.4 625.7 157.7"/>
      <path d="M657 155.8C660 167.6 618.9 188 565.3 201.3C511.7 214.7 465.9 216 463 204.2"/>
      <path d="M810 -10L810 86"/>
      <path d="M784 112C789.3 105.3 800.3 104.7 806 106C811.7 107.3 818 114.7 818 120C818 125.3 810.7 132 806 138C801.3 144 795.3 154.7 790 156C784.7 157.3 775 153.3 774 146C773 138.7 778.7 118.7 784 112Z"/>
      <path d="M822 154C824 150 836.3 148 840 150C843.7 152 846 162 844 166C842 170 831.7 176 828 174C824.3 172 820 158 822 154Z"/>
      <rect x="392" y="584" width="92" height="30" rx="8"/>
      <rect x="398" y="390" width="44" height="16" rx="6"/>
      <path d="M360.7 511.1C380.5 505.2 400.2 506.5 420 515C439.5 523.4 459.1 524.7 478.6 519.1"/>
      <circle cx="402" cy="540" r="9"/>
      <circle cx="436" cy="552" r="11"/>
      <circle cx="420" cy="352" r="13"/>
      <circle cx="440" cy="312" r="17"/>
      <circle cx="418" cy="268" r="12"/>
      <path d="M506.7 575.4C527.8 571.1 548.9 572.6 570 580C591.1 587.4 612.2 588.9 633.3 584.6"/>
      <path d="M560 494Q571 504 582 494"/>
      <circle cx="546" cy="610" r="10"/>
      <circle cx="596" cy="620" r="13"/>
      <rect x="676" y="474" width="48" height="18" rx="6"/>
      <path d="M655.4 593.6C660.2 594.6 665.1 596 670 598C690 606 710 606 730 598C734.9 596 739.8 594.6 744.6 593.6"/>
      <circle cx="700" cy="622" r="10"/>
      <circle cx="700" cy="440" r="12"/>
      <circle cx="684" cy="404" r="16"/>
      <circle cx="708" cy="366" r="11"/>
      <path d="M922.9 612.9L958.8 609.2C964.8 608.5 970.2 612.9 970.8 619C971.5 625 967.1 630.4 961.1 631.1L925.2 634.8C919.2 635.5 913.8 631.1 913.2 625C912.5 619 916.9 613.6 922.9 612.9Z"/>
      <path d="M930.1 623.3L953.9 620.7"/>
      <path d="M922.7 565.5L957.9 573C963.8 574.2 967.6 580.1 966.4 586C965.1 592 959.3 595.8 953.3 594.5L918.1 587C912.2 585.8 908.4 579.9 909.6 574C910.9 568 916.7 564.2 922.7 565.5Z"/>
      <path d="M926.3 577.5L949.7 582.5"/>
      <rect x="130" y="556" width="140" height="112" rx="12"/>
      <path d="M170 612C150 596 152 576 170 584C188 576 190 596 170 612Z"/>
      <circle cx="232" cy="592" r="20"/>
      <path d="M232 592L242 578"/>
      <circle cx="165" cy="644" r="10"/>
      <circle cx="200" cy="644" r="10"/>
      <circle cx="235" cy="644" r="10"/>
      <path d="M99.1 706L300.9 706"/>
      <path d="M224 502.4L224 536L176 536L176 502.4"/>
      <path d="M111 455.3C110 456.9 108.1 458 106 458L98 458C94.7 458 92 455.3 92 452L92 410C92 406.7 94.7 404 98 404L106 404C108.1 404 110 405.1 111 406.7"/>
      <path d="M289 406.7C290 405.1 291.9 404 294 404L302 404C305.3 404 308 406.7 308 410L308 452C308 455.3 305.3 458 302 458L294 458C291.9 458 290 456.9 289 455.3"/>
      <rect x="132" y="374" width="136" height="108" rx="22"/>
      <circle cx="168" cy="418" r="25"/>
      <circle cx="232" cy="418" r="25"/>
      <path d="M180 454Q200 472 220 454"/>
      <ellipse cx="160" cy="464" rx="14" ry="8"/>
      <ellipse cx="240" cy="464" rx="14" ry="8"/>
      <circle cx="300" cy="230" r="16"/>
      <circle cx="340" cy="120" r="12"/>
      <circle cx="900" cy="300" r="18"/>
      <circle cx="950" cy="420" r="13"/>
      <circle cx="640" cy="300" r="14"/>
      <circle cx="110" cy="160" r="18"/>
      <circle cx="60" cy="250" r="12"/>
      <circle cx="300" cy="300" r="13"/>
    </g>
    <path fill="#111" stroke="none" d="M406 599C406 595.7 408.7 593 412 593C415.3 593 418 595.7 418 599C418 602.3 415.3 605 412 605C408.7 605 406 602.3 406 599Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M543 474C543 480.1 547 485 552 485C557 485 561 480.1 561 474C561 467.9 557 463 552 463C547 463 543 467.9 543 474ZM543.5 469C543.5 472 546 474.5 549 474.5C552 474.5 554.5 472 554.5 469C554.5 466 552 463.5 549 463.5C546 463.5 543.5 466 543.5 469Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M581 474C581 480.1 585 485 590 485C595 485 599 480.1 599 474C599 467.9 595 463 590 463C585 463 581 467.9 581 474ZM581.5 469C581.5 472 584 474.5 587 474.5C590 474.5 592.5 472 592.5 469C592.5 466 590 463.5 587 463.5C584 463.5 581.5 466 581.5 469Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M157 420C157 427.2 162.8 433 170 433C177.2 433 183 427.2 183 420C183 412.8 177.2 407 170 407C162.8 407 157 412.8 157 420ZM159.8 415C159.8 418.4 162.6 421.2 166 421.2C169.4 421.2 172.2 418.4 172.2 415C172.2 411.6 169.4 408.8 166 408.8C162.6 408.8 159.8 411.6 159.8 415Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M221 420C221 427.2 226.8 433 234 433C241.2 433 247 427.2 247 420C247 412.8 241.2 407 234 407C226.8 407 221 412.8 221 420ZM223.8 415C223.8 418.4 226.6 421.2 230 421.2C233.4 421.2 236.2 418.4 236.2 415C236.2 411.6 233.4 408.8 230 408.8C226.6 408.8 223.8 411.6 223.8 415Z"/>
  </g>
</svg>
`,be=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="10">
      <path d="M62 330.5L62 206C62 203.8 63.8 202 66 202L98 202C100.2 202 102 203.8 102 206L102 330.5"/>
      <path d="M104 330.5L104 226C104 223.8 105.8 222 108 222L136 222C138.2 222 140 223.8 140 226L140 330.5"/>
      <path d="M142 330.4L142 196C142 193.8 143.8 192 146 192L182 192C184.2 192 186 193.8 186 196L186 330.4"/>
      <path d="M284.5 238.7C291.3 242.4 296 249.6 296 258L296 318C296 322.7 294.6 327 292.1 330.5M213.9 330.5C211.4 327 210 322.7 210 318L210 258C210 249.6 214.7 242.4 221.5 238.7"/>
      <path d="M0 862L306.7 862M693.3 862L806.5 862M890.2 862L1000 862"/>
      <path d="M70 645.7L70 740.9M70 773.3L70 800C70 811 79 820 90 820C101 820 110 811 110 800L110 773.3M110 740.9L110 645.7"/>
      <path d="M140 645.7L140 740.9M140 773.3L140 800C140 811 149 820 160 820C171 820 180 811 180 800L180 773.3M180 740.9L180 645.7"/>
      <path d="M210 645.7L210 740.9M210 773.3L210 800C210 811 219 820 230 820C241 820 250 811 250 800L250 773.3M250 740.9L250 645.7"/>
      <rect x="50" y="740" width="220" height="34" rx="8"/>
      <path d="M62 774L62 868M258 774L258 868"/>
      <rect x="40" y="330" width="280" height="22" rx="6"/>
      <path d="M627.3 800L680 800C696.6 800 710 813.4 710 830L710 836C710 852.6 696.6 866 680 866L320 866C303.4 866 290 852.6 290 836L290 830C290 813.4 303.4 800 320 800L415.1 800M484.9 800L566.8 800"/>
      <path d="M689.1 529.4C687.5 602.8 667.6 678.1 628 735L628 812L566 812L566 735C581.8 702.3 593.4 661.6 599.2 619.4M602.3 590.6C607.6 519.1 595.8 447.2 560 405L494.5 387.2M494.6 276.6L596 290C646 323 676.6 390.9 686.1 467.8"/>
      <rect x="330" y="590" width="330" height="30" rx="8"/>
      <path d="M494.3 440L516 440L502 484C467.3 494.7 432.7 494.7 398 484L384 440L405.7 440"/>
      <path d="M478.3 228L491 228C493.2 228 495 229.8 495 232L495 440C495 442.2 493.2 444 491 444L409 444C406.8 444 405 442.2 405 440L405 232C405 229.8 406.8 228 409 228L421.7 228"/>
      <path d="M479 163.7L479 230C479 232.2 477.2 234 475 234L425 234C422.8 234 421 232.2 421 230L421 163.7"/>
      <rect x="410" y="138" width="80" height="26" rx="10"/>
      <circle cx="660" cy="500" r="42"/>
      <circle cx="790" cy="205" r="148"/>
      <path d="M742 814L742 844C812.7 873.3 883.3 873.3 954 844L954 814"/>
      <ellipse cx="848" cy="814" rx="106" ry="32"/>
    </g>
    <g stroke-width="7">
      <rect x="220" y="214" width="66" height="28" rx="8"/>
      <path d="M434 488.5L434 534C434 537.3 431.3 540 428 540L410 540C406.7 540 404 537.3 404 534L404 483.3"/>
      <path d="M472 488.2L472 542C472 545.3 469.3 548 466 548L446 548C442.7 548 440 545.3 440 542L440 489.3"/>
      <path d="M504 476.3L504 522C504 525.3 501.3 528 498 528L482 528C478.7 528 476 525.3 476 522L476 487.1"/>
      <path d="M382 590L382 570C382 567.8 383.8 566 386 566L518 566C520.2 566 522 567.8 522 570L522 590"/>
      <path d="M67.9 692.8C82.6 697.1 97.4 697.1 112.1 692.8"/>
      <rect x="64" y="624" width="52" height="22" rx="8"/>
      <path d="M137.9 708.8C152.6 713.1 167.4 713.1 182.1 708.8"/>
      <rect x="134" y="624" width="52" height="22" rx="8"/>
      <path d="M207.9 682.8C222.6 687.1 237.4 687.1 252.1 682.8"/>
      <rect x="204" y="624" width="52" height="22" rx="8"/>
      <path d="M70 349.4L70 392L111 349.4"/>
      <path d="M290 349.4L290 392L249 349.4"/>
      <path d="M60.2 230L103.8 230"/>
      <path d="M102.1 250L141.9 250"/>
      <path d="M140.2 220L187.8 220"/>
      <path d="M207.9 282.2C238 289.9 268 289.9 298.1 282.2"/>
      <path d="M415 802C415 748 485 748 485 802Z"/>
      <path d="M402.9 300L497.1 300"/>
      <circle cx="660" cy="500" r="17"/>
      <circle cx="530" cy="120" r="13"/>
      <circle cx="580" cy="100" r="20"/>
      <path d="M700 150C703.3 133.3 723.3 111.3 740 105C756.7 98.7 785 104.5 800 112C815 119.5 827.5 136.2 830 150C832.5 163.8 825 184.2 815 195C805 205.8 785.8 213.3 770 215C754.2 216.7 731.7 215.8 720 205C708.3 194.2 696.7 166.7 700 150Z"/>
      <path d="M760 175Q772 188 784 175"/>
      <circle cx="860" cy="260" r="46"/>
      <circle cx="868" cy="252" r="17"/>
      <rect x="700" y="262" width="100" height="44" rx="22"/>
      <circle cx="872" cy="140" r="13"/>
      <circle cx="790" cy="318" r="13"/>
      <circle cx="676" cy="250" r="13"/>
      <circle cx="806" cy="818" r="12"/>
      <circle cx="852" cy="810" r="14"/>
      <circle cx="896" cy="820" r="11"/>
    </g>
    <g stroke-width="6">
      <path d="M738 292Q746 299 754 292"/>
    </g>
    <path fill="#111" stroke="none" d="M752 150C747 150 743 154.1 743.1 159C743.1 164 747.1 168 752 168C757 168 761 164 761 159C761.1 154.1 757.1 150 752.1 150ZM792 150C787 150 783 154.1 783.1 159C783.1 164 787.1 168 792 168C797 168 801 164 801 159C801.1 154.1 797.1 150 792.1 150Z"/>
    <path fill="#111" stroke="none" d="M730 276C726.1 276 723 279.2 723.1 283C723.1 286.9 726.2 290 730 290C733.9 290 737 286.9 737 283C737.1 279.2 734 276 730.1 276ZM762 276C758.1 276 755 279.2 755.1 283C755.1 286.9 758.2 290 762 290C765.9 290 769 286.9 769 283C769.1 279.2 766 276 762.1 276Z"/>
  </g>
</svg>
`,xe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="14">
      <path d="M177.3 372.6L170 300C170 290 175.3 285 186 285L234 285C244.7 285 250 290 250 300L242.7 372.6"/>
      <path d="M469.2 272.6L462 186C462 175.3 467.3 170 478 170L522 170C532.7 170 538 175.3 538 186L530.8 272.6"/>
      <path d="M751.1 400.6L744 330C744 319.3 749.3 314 760 314L800 314C810.7 314 816 319.3 816 330L808.9 400.6"/>
      <path d="M0 850L1000 850"/>
      <path d="M247.5 526.4C317.8 543.3 370 606.5 370 682C370 770.4 298.4 842 210 842C121.6 842 50 770.4 50 682C50 606.5 102.2 543.3 172.5 526.4"/>
      <path d="M248 405.4L248 527.2M172 527.2L172 405.4"/>
      <path d="M172 406C164.3 406 158 399.7 158 392L158 386C158 378.3 164.3 372 172 372L248 372C255.7 372 262 378.3 262 386L262 392C262 399.7 255.7 406 248 406"/>
      <path d="M534 305.3L534 396C570 410 600 432 600 480L600 805C600 831.7 586.7 845 560 845L440 845C413.3 845 400 831.7 400 805L400 480C400 432 430 410 466 396L466 305.3"/>
      <path d="M466.3 306L464 306C456.3 306 450 299.7 450 292L450 286C450 278.3 456.3 272 464 272L536 272C543.7 272 550 278.3 550 286L550 292C550 299.7 543.7 306 536 306L533.7 306"/>
      <path d="M812 433.4L812 545L935 800C948.3 830 938.3 845 905 845L655 845C621.7 845 611.7 830 625 800L748 545L748 433.4"/>
      <path d="M748.3 434L747 434C739.3 434 733 427.7 733 420L733 414C733 406.3 739.3 400 747 400L813 400C820.7 400 827 406.3 827 414L827 420C827 427.7 820.7 434 813 434L811.7 434"/>
    </g>
    <g stroke-width="10">
      <path d="M56.2 629.8C87.5 621 118.7 624.4 150 640C190 660 230 660 270 640C301.3 624.4 332.5 621 363.8 629.8"/>
      <path d="M186.0 768.0Q210 792.0 234.0 768.0"/>
      <circle cx="270" cy="590" r="18"/>
      <path d="M397.6 551.4C418.4 544.1 439.2 547 460 560C486.7 576.7 513.3 576.7 540 560C560.8 547 581.6 544.1 602.4 551.4"/>
      <path d="M476.0 728.0Q500 752.0 524.0 728.0"/>
      <circle cx="462" cy="488" r="17"/>
      <path d="M683.4 673.1C688.9 674.9 694.5 677.2 700 680C733.3 696.7 766.7 696.7 800 680C825 667.5 850 664.4 875.1 670.6"/>
      <path d="M756.0 798.0Q780 822.0 804.0 798.0"/>
      <circle cx="790" cy="612" r="17"/>
      <path d="M95 700Q92 640 125 600"/>
      <path d="M428 760L428 610"/>
      <path d="M668 800L702 730"/>
    </g>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M146 730C146 743.3 156.7 754 170 754C183.3 754 194 743.3 194 730C194 716.7 183.3 706 170 706C156.7 706 146 716.7 146 730ZM153.1 721.4C153.1 726.4 157.1 730.4 162.1 730.4C167.1 730.4 171.1 726.4 171.1 721.4C171.1 716.4 167.1 712.4 162.1 712.4C157.1 712.4 153.1 716.4 153.1 721.4Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M226 730C226 743.3 236.7 754 250 754C263.3 754 274 743.3 274 730C274 716.7 263.3 706 250 706C236.7 706 226 716.7 226 730ZM233.1 721.4C233.1 726.4 237.1 730.4 242.1 730.4C247.1 730.4 251.1 726.4 251.1 721.4C251.1 716.4 247.1 712.4 242.1 712.4C237.1 712.4 233.1 716.4 233.1 721.4Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M436 690C436 703.3 446.7 714 460 714C473.3 714 484 703.3 484 690C484 676.7 473.3 666 460 666C446.7 666 436 676.7 436 690ZM443.1 681.4C443.1 686.4 447.1 690.4 452.1 690.4C457.1 690.4 461.1 686.4 461.1 681.4C461.1 676.4 457.1 672.4 452.1 672.4C447.1 672.4 443.1 676.4 443.1 681.4Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M516 690C516 703.3 526.7 714 540 714C553.3 714 564 703.3 564 690C564 676.7 553.3 666 540 666C526.7 666 516 676.7 516 690ZM523.1 681.4C523.1 686.4 527.1 690.4 532.1 690.4C537.1 690.4 541.1 686.4 541.1 681.4C541.1 676.4 537.1 672.4 532.1 672.4C527.1 672.4 523.1 676.4 523.1 681.4Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M716 760C716 773.3 726.7 784 740 784C753.3 784 764 773.3 764 760C764 746.7 753.3 736 740 736C726.7 736 716 746.7 716 760ZM723.1 751.4C723.1 756.4 727.1 760.4 732.1 760.4C737.1 760.4 741.1 756.4 741.1 751.4C741.1 746.4 737.1 742.4 732.1 742.4C727.1 742.4 723.1 746.4 723.1 751.4Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M796 760C796 773.3 806.7 784 820 784C833.3 784 844 773.3 844 760C844 746.7 833.3 736 820 736C806.7 736 796 746.7 796 760ZM803.1 751.4C803.1 756.4 807.1 760.4 812.1 760.4C817.1 760.4 821.1 756.4 821.1 751.4C821.1 746.4 817.1 742.4 812.1 742.4C807.1 742.4 803.1 746.4 803.1 751.4Z"/>
  </g>
</svg>
`,Se=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="10">
      <path d="M910 508L910 547.3M880 547.3L880 508"/>
      <path d="M742 640L742 540C735.3 534.7 734.7 530 740 526L828 526L828 628C828 636 824 640 816 640M813.1 640L812.2 640M806.6 640L798.8 640M794 640L784.4 640M789.5 640L786.8 640M784.3 640L775.6 640"/>
      <path d="M909.5 546.3C927.8 552.4 941 569.6 941 590C941 615.4 920.4 636 895 636C869.6 636 849 615.4 849 590C849 569.6 862.2 552.4 880.5 546.3"/>
      <path d="M483 711.3L483 818.7M441 818.7L441 711.3"/>
      <path d="M559 711.3L559 818.7M517 818.7L517 711.3"/>
      <path d="M-10 870L416.5 870M485 870L515 870M583.5 870L1010 870"/>
      <path d="M730 669.8L730 872M940 669.8L940 872"/>
      <rect x="700" y="640" width="270" height="30" rx="8"/>
      <path d="M404 848Q404 818 440 818L484 818L486 872L424 872Q404 872 404 848Z"/>
      <path d="M596 848Q596 818 560 818L516 818L514 872L576 872Q596 872 596 848Z"/>
      <path d="M486 386.9C480.1 387.1 474.5 387.4 470 388C450 390.7 410 404 410 404C410 404 408.5 407.6 406.3 413.4M383.6 492.2C379 518.2 375.1 549.1 370 580C363.3 620.3 348 712 348 712C348 712 652 712 652 712C652 712 636.7 620.3 630 580C628.4 570.5 627 561 625.5 551.6M594.6 415.5C591.9 408.5 590 404 590 404C590 404 530 388 530 388C530 388 523.3 387.5 514 387.2"/>
      <path d="M704 571C711.2 576 716 584.5 716 594C716 609.5 703.5 622 688 622C672.5 622 660 609.5 660 594C660 589.5 661.1 585.2 663 581.4"/>
      <path d="M598 410C607 403 625.3 410.7 640 428C654.7 445.3 674.3 491.7 686 514C697.7 536.3 713 550.3 710 562C707 573.7 685.3 589.3 668 584C650.7 578.7 619.7 549 606 530C592.3 511 587.3 490 586 470C584.7 450 589 417 598 410Z"/>
      <path d="M262 460L262 500L214 590C207.3 608.7 214 618 234 618L330 618C350 618 356.7 608.7 350 590L305.4 506.5"/>
      <path d="M322.5 500.8C326.4 506.7 338.8 514.2 350 512C361.7 509.7 380.3 496.3 392 486C403.7 475.7 418.3 462.7 420 450C421.7 437.3 410.3 411.7 402 410C393.7 408.3 382 429 370 440C358.8 450.3 340.6 464 331.8 473.9"/>
      <circle cx="306" cy="480" r="27"/>
      <path d="M374.5 215.7C361 207.2 352 192.1 352 175C352 148.5 373.5 127 400 127C418.1 127 433.9 137 442.1 151.9"/>
      <path d="M557.9 151.9C566.1 137 581.9 127 600 127C626.5 127 648 148.5 648 175C648 192.1 639 207.2 625.5 215.7"/>
      <path d="M430.9 339.5C422.4 339.6 415.3 339.8 410 340C375.7 341.3 391 354.7 384 348C377 341.3 370 321 368 300C366 279 365 245.3 372 222C379 198.7 388.7 172 410 160C431.3 148 470 150 500 150C530 150 568.7 148 590 160C611.3 172 621 198.7 628 222C635 245.3 634 279 632 300C630 321 623 341.3 616 348C609 354.7 624.3 341.3 590 340C584.7 339.8 577.6 339.6 569.1 339.5"/>
      <path d="M596.5 241.8C598.8 250.2 600 259 600 268C600 323.2 555.2 368 500 368C444.8 368 400 323.2 400 268C400 259 401.2 250.2 403.5 241.8M472.1 171.9C481 169.4 490.3 168 500 168C509.7 168 519 169.4 527.9 171.9"/>
      <path d="M596 250C578.7 235.3 560 230.7 540 236C538 233.8 536 232 534 230.5M523.5 225.5C514.4 223.6 504.6 227 494 236C478 229.3 463.3 232 450 244C435.3 238.7 420 240.7 404 250"/>
      <path d="M398 214C407.8 211.3 417.6 209 427.4 207.1M489.4 200.2C496.5 199.9 503.5 199.9 510.6 200.2M572.6 207.1C582.4 209 592.2 211.3 602 214"/>
      <circle cx="458" cy="200" r="32"/>
      <circle cx="542" cy="200" r="32"/>
    </g>
    <g stroke-width="7">
      <rect x="872" y="486" width="46" height="22" rx="8"/>
      <path d="M739.9 575.5C760 572.5 780 574 800 580C810 583 820 584.9 830 585.6"/>
      <path d="M847.1 593.5C864.7 588.1 882.4 588.9 900 596C913.9 601.6 927.8 603.3 941.7 601.1"/>
      <path d="M470 390L500 470L530 390"/>
      <path d="M470 390L436 432L470 450L500 470M530 390L564 432L530 450L500 470"/>
      <path d="M500 470L500 712"/>
      <circle cx="520" cy="510" r="10"/>
      <circle cx="520" cy="565" r="10"/>
      <circle cx="520" cy="620" r="10"/>
      <rect x="392" y="610" width="70" height="56" rx="8"/>
      <rect x="538" y="610" width="70" height="56" rx="8"/>
      <path d="M292.1 460L260 460C255.6 460 252 456.4 252 452L252 448C252 443.6 255.6 440 260 440L304 440C308.4 440 312 443.6 312 448L312 452C312 453.3 311.7 454.4 311.2 455.5"/>
      <path d="M231.2 553.5C237.5 554.7 243.7 556.9 250 560C270 570 290 570 310 560C317.5 556.3 325 553.9 332.5 553"/>
      <circle cx="262" cy="596" r="11"/>
      <circle cx="300" cy="590" r="10"/>
      <circle cx="290" cy="404" r="14"/>
      <circle cx="268" cy="362" r="18"/>
      <circle cx="298" cy="318" r="12"/>
      <circle cx="276" cy="280" r="22"/>
      <path d="M514 364L514 400L486 400L486 364"/>
      <circle cx="458" cy="200" r="18"/>
      <circle cx="542" cy="200" r="18"/>
      <path d="M444 272L436 264M556 272L564 264"/>
      <path d="M474 316Q500 354 526 316Z"/>
      <ellipse cx="430" cy="318" rx="15" ry="9"/>
      <ellipse cx="570" cy="318" rx="15" ry="9"/>
      <path d="M170 214Q176.48 243.52 206 250Q176.48 256.48 170 286Q163.52 256.48 134 250Q163.52 243.52 170 214Z"/>
      <path d="M380 54Q384.68 75.32 406 80Q384.68 84.68 380 106Q375.32 84.68 354 80Q375.32 75.32 380 54Z"/>
      <path d="M780 160Q787.2 192.8 820 200Q787.2 207.2 780 240Q772.8 207.2 740 200Q772.8 192.8 780 160Z"/>
      <path d="M880 314Q884.68 335.32 906 340Q884.68 344.68 880 366Q875.32 344.68 854 340Q875.32 335.32 880 314Z"/>
      <path d="M140 426Q144.32 445.68 164 450Q144.32 454.32 140 474Q135.68 454.32 116 450Q135.68 445.68 140 426Z"/>
    </g>
    <g stroke-width="6">
      <path d="M290 470Q302 478 316 474M292 490Q304 497 318 492"/>
    </g>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M443 288C443 300.2 450.6 310 460 310C469.4 310 477 300.2 477 288C477 275.8 469.4 266 460 266C450.6 266 443 275.8 443 288ZM447.5 279C447.5 283.1 450.9 286.5 455 286.5C459.1 286.5 462.5 283.1 462.5 279C462.5 274.9 459.1 271.5 455 271.5C450.9 271.5 447.5 274.9 447.5 279Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M523 288C523 300.2 530.6 310 540 310C549.4 310 557 300.2 557 288C557 275.8 549.4 266 540 266C530.6 266 523 275.8 523 288ZM527.5 279C527.5 283.1 530.9 286.5 535 286.5C539.1 286.5 542.5 283.1 542.5 279C542.5 274.9 539.1 271.5 535 271.5C530.9 271.5 527.5 274.9 527.5 279Z"/>
  </g>
</svg>
`,Ce=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g stroke-width="14">
      <path d="M0 880L144.6 880M855.4 880L1000 880"/>
      <path d="M766.1 818L860 818C873.3 818 877.3 825.3 872 840L862 870C859.3 880.7 851.3 886 838 886L162 886C148.7 886 140.7 880.7 138 870L128 840C122.7 825.3 126.7 818 140 818L233.9 818"/>
      <path d="M653 593.9C687.4 672.1 728.1 749.5 768 820L232 820C266.8 758.7 302 692.1 333.3 624.3"/>
      <path d="M364 421.2C357.9 436.3 358.6 454.2 352 468C340.5 492.2 331.7 518.7 326 540C320.3 561.3 316 581.3 318 596C320 610.7 330.3 625.3 338 628C345.7 630.7 356.7 622.3 364 612C371.3 601.7 374.7 567.3 382 566C389.3 564.7 402 588 408 604C414 620 411.7 648 418 662C424.3 676 437 688.3 446 688C455 687.7 467 674 472 660C477 646 471 617.7 476 604C481 590.3 493 578.3 502 578C511 577.7 523 591 530 602C537 613 537.3 635 544 644C550.7 653 562 658.7 570 656C578 653.3 587.7 640 592 628C596.3 616 590.7 595 596 584C601.3 573 615.3 561 624 562C632.7 563 640.3 583 648 590C655.7 597 664 607 670 604C676 601 683 586 684 572C685 558 681.3 537.7 676 520C670.7 502.3 663.8 486.8 652 466C645.2 454 644.8 436.1 637.5 420.8"/>
      <path d="M558.1 391C541.4 401.8 521.4 408 500 408C478.6 408 458.6 401.8 441.9 391"/>
      <path d="M442.6 390.9C429.8 410.8 407.4 424 382 424C342.2 424 310 391.8 310 352C310 312.6 341.7 280.5 381 280"/>
      <path d="M620.2 280C658.9 281.2 690 313 690 352C690 391.8 657.8 424 618 424C592.6 424 570.2 410.8 557.4 390.9"/>
      <path d="M380.8 280.6C366.8 267.4 358 248.7 358 228C358 188.2 390.2 156 430 156C433.4 156 436.8 156.2 440 156.7"/>
      <path d="M557.2 147.4C562 146.5 566.9 146 572 146C614 146 648 180 648 222C648 245.6 637.3 266.7 620.4 280.6"/>
      <path d="M439.3 157.2C445.2 129.1 470.2 108 500 108C526.4 108 549 124.6 557.9 147.9"/>
      <path d="M314.9 263.4L253.1 269.8A30 30 0 1 1 271.4 219Z"/>
      <path d="M694.3 233.6L729.9 187.8A28 28 0 1 1 752.3 233Z"/>
      <path d="M266.4 387.4L229.7 417.7A23 23 0 1 1 219.8 377.5Z"/>
      <path d="M735.3 362.5L782.6 347.2A24 24 0 1 1 776.7 390Z"/>
    </g>
    <g stroke-width="10">
      <circle cx="455" cy="300" r="24"/>
      <circle cx="560" cy="330" r="18"/>
      <circle cx="600" cy="240" r="16"/>
      <path d="M462 782Q500 816 538 782"/>
      <ellipse cx="360" cy="785" rx="30" ry="19"/>
      <ellipse cx="640" cy="785" rx="30" ry="19"/>
    </g>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M395 735C395 751.6 408.4 765 425 765C441.6 765 455 751.6 455 735C455 718.4 441.6 705 425 705C408.4 705 395 718.4 395 735ZM404.1 724.2C404.1 730.3 409 735.2 415.1 735.2C421.2 735.2 426.1 730.3 426.1 724.2C426.1 718.1 421.2 713.2 415.1 713.2C409 713.2 404.1 718.1 404.1 724.2Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M545 735C545 751.6 558.4 765 575 765C591.6 765 605 751.6 605 735C605 718.4 591.6 705 575 705C558.4 705 545 718.4 545 735ZM554.1 724.2C554.1 730.3 559 735.2 565.1 735.2C571.2 735.2 576.1 730.3 576.1 724.2C576.1 718.1 571.2 713.2 565.1 713.2C559 713.2 554.1 718.1 554.1 724.2Z"/>
  </g>
</svg>
`,we=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sea floor -->
    <path stroke-width="7" d="M -20 800 C 8.3 798.3 91.7 788.7 150 790 C 208.3 791.3 268.3 807.2 330 808 C 391.7 808.8 458.3 794.7 520 795 C 581.7 795.3 640 810.5 700 810 C 760 809.5 826.7 793.3 880 792 C 933.3 790.7 996.7 800.3 1020 802"/>
    <!-- branching coral -->
    <path stroke-width="7" d="M 130 789.9 C 130.3 785.3 133 772 132 762 C 131 752 128.2 739.3 124 730 C 119.8 720.7 114 714 107 706 C 100 698 89.5 690.3 82 682 C 74.5 673.7 68.3 665.3 62 656 C 55.7 646.7 47.4 636.5 44 626 C 40.6 615.5 40.4 599.8 41.6 592.8 C 42.8 585.8 47.4 585.4 51.2 584 C 55 582.7 60 577.9 64.2 584.6 C 68.3 591.3 71 614.8 76 624 C 81 633.2 91 643 94 640 C 97 637 94.3 618 94 606 C 93.7 594 91.7 581.3 92 568 C 92.3 554.7 93.3 533.8 96 526 C 98.6 518.1 104 521 108 521 C 112 521 117.4 518.1 120 526 C 122.7 533.8 123 553.7 124 568 C 125 582.3 124.7 598 126 612 C 127.3 626 129.3 641.3 132 652 C 134.7 662.7 139.7 681 142 676 C 144.3 671 145.3 641 146 622 C 146.7 603 145.2 582.3 146 562 C 146.8 541.7 148.1 511.1 151 500 C 153.8 488.8 159 495 163 495 C 167 495 172.2 488.8 175 500 C 177.9 511.1 179.2 541.7 180 562 C 180.8 582.3 179 603.7 180 622 C 181 640.3 183 670.3 186 672 C 189 673.7 194.7 645.7 198 632 C 201.3 618.3 203.5 604.8 206 590 C 208.5 575.2 209.8 551.5 213.1 543 C 216.3 534.5 221.5 538.7 225.5 539.1 C 229.5 539.4 234.6 536.3 237 545.1 C 239.4 553.9 240.2 577.5 240 592 C 239.8 606.5 236.3 622 236 632 C 235.7 642 234.3 652.3 238 652 C 241.7 651.7 250.8 638.6 258 630 C 265.2 621.4 275.9 603.9 281.2 600.6 C 286.5 597.3 288.6 606.4 290 610.2 C 291.3 614 292.7 616.2 289.4 623.2 C 286.1 630.2 277.6 642.2 270 652 C 262.4 661.8 252.7 673 244 682 C 235.3 691 226 697.7 218 706 C 210 714.3 200.7 722.3 196 732 C 191.3 741.7 191.3 753.9 190 764 C 188.7 774.1 188.3 787.8 188 792.6"/>
    <circle stroke-width="5" cx="159" cy="768" r="9"/>
    <circle stroke-width="5" cx="159" cy="724" r="9"/>
    <circle stroke-width="5" cx="220" cy="680" r="9"/>
    <path stroke-width="7" d="M 222 796.8 C 223 789.9 221.3 769.1 228 755 C 234.7 740.9 248.5 722.2 262 712 C 275.5 701.8 293.3 694 309 694 C 324.7 694 342.5 701.8 356 712 C 369.5 722.2 383.3 739.6 390 755 C 396.7 770.4 395 796.4 396 804.6"/>
    <path stroke-width="5" d="M 250 800.8 C 249.4 799.6 247.5 795.9 246.7 793.6 C 245.8 791.3 245.2 789.1 245.1 786.9 C 245 784.7 245.3 782.5 246.1 780.5 C 246.8 778.4 248.1 776.5 249.5 774.8 C 250.9 773.1 252.8 771.6 254.5 770.2 C 256.2 768.7 258.1 767.5 259.6 766.2 C 261.1 764.9 262.5 763.7 263.6 762.2 C 264.6 760.8 265.3 759.3 265.9 757.5 C 266.4 755.7 266.6 753.7 266.8 751.6 C 267.1 749.5 267 747.1 267.3 744.8 C 267.5 742.6 267.8 740.1 268.4 738 C 269 735.9 269.8 733.8 271 732.3 C 272.1 730.7 273.6 729.4 275.2 728.6 C 276.8 727.8 278.7 727.5 280.6 727.4 C 282.5 727.2 284.5 727.6 286.4 727.9 C 288.3 728.2 290.2 728.9 291.9 729.2 C 293.5 729.5 295.1 729.8 296.6 729.7 C 298 729.6 299.3 729.3 300.7 728.6 C 302 727.9 303.3 726.9 304.6 725.8 C 306 724.7 307.5 723.2 309 722 C 310.5 720.8 312.2 719.5 313.9 718.7 C 315.6 717.9 317.4 717.3 319.1 717.3 C 320.8 717.3 322.6 717.7 324.1 718.6 C 325.6 719.5 327.1 720.9 328.3 722.5 C 329.6 724 330.6 726.1 331.6 727.9 C 332.6 729.8 333.3 731.9 334.2 733.6 C 335.1 735.4 335.8 737 336.8 738.4 C 337.9 739.7 339 740.7 340.3 741.5 C 341.7 742.3 343.3 742.8 345 743.4 C 346.8 743.9 348.8 744.2 350.7 744.8 C 352.6 745.5 354.8 746.1 356.5 747.1 C 358.3 748 360.1 749.3 361.3 750.8 C 362.6 752.3 363.6 754.2 364.2 756.3 C 364.7 758.3 364.8 760.7 364.7 763 C 364.6 765.3 364 767.8 363.5 770.2 C 363 772.5 362.2 774.8 361.8 777 C 361.3 779.1 360.8 781.2 360.8 783.1 C 360.8 785.1 361.1 786.9 361.6 788.7 C 362.2 790.5 363.2 791.1 364.3 794.2 C 365.4 797.2 367.4 804.8 368 806.9"/>
    <path stroke-width="5" d="M 278 804.4 C 277.6 802.9 276.1 798 275.4 795.9 C 274.6 793.7 274 792.9 273.6 791.4 C 273.2 789.9 273 788.4 273.1 786.9 C 273.2 785.5 273.5 784.1 274.1 782.8 C 274.6 781.5 275.5 780.3 276.4 779.2 C 277.4 778.2 278.6 777.3 279.7 776.5 C 280.9 775.6 282.2 775 283.4 774.4 C 284.5 773.7 285.8 773.2 286.8 772.7 C 287.8 772.1 288.7 771.6 289.5 771 C 290.3 770.4 290.8 769.7 291.3 768.9 C 291.8 768.1 292.1 767.1 292.3 766 C 292.6 765 292.7 763.7 292.9 762.4 C 293 761.1 293.1 759.6 293.3 758.2 C 293.5 756.7 293.7 755.2 294.1 753.8 C 294.5 752.4 294.9 751 295.5 749.9 C 296.1 748.8 296.8 747.7 297.7 747 C 298.5 746.3 299.4 745.8 300.4 745.6 C 301.3 745.4 302.4 745.5 303.4 745.8 C 304.4 746.1 305.4 746.7 306.4 747.4 C 307.3 748.1 308.2 749.1 309 750 C 309.8 750.9 310.5 752 311.2 752.9 C 311.9 753.8 312.5 754.7 313.1 755.4 C 313.7 756.1 314.2 756.7 314.9 757.1 C 315.5 757.6 316.1 757.8 316.8 757.9 C 317.5 758 318.3 757.9 319.2 757.7 C 320.1 757.6 321.2 757.3 322.2 757.1 C 323.3 756.9 324.5 756.6 325.7 756.6 C 326.9 756.5 328.1 756.5 329.3 756.7 C 330.4 756.9 331.6 757.3 332.6 757.9 C 333.6 758.5 334.5 759.4 335.2 760.4 C 335.8 761.4 336.3 762.7 336.6 764.1 C 336.9 765.4 337 767 336.9 768.5 C 336.9 770.1 336.6 771.8 336.2 773.4 C 335.9 775 335.4 776.6 335 778.1 C 334.6 779.7 334 781.1 333.7 782.5 C 333.4 783.9 333.1 785.1 333.1 786.3 C 333 787.5 333.1 788.6 333.4 789.7 C 333.7 790.8 334.2 791.8 334.8 792.9 C 335.5 794 336.3 793.8 337.2 796.3 C 338.1 798.8 339.5 806.1 340 808"/>
    <!-- seaweed -->
    <path stroke-width="7" d="M 448 799.3 C 447.4 796.8 445.7 789 444.7 784.4 C 443.6 779.9 442.6 776.1 441.6 772 C 440.6 767.9 439.6 763.8 438.8 759.8 C 437.9 755.8 437.1 751.7 436.5 747.8 C 435.9 743.9 435.3 740 435 736.4 C 434.8 732.8 434.7 729.7 435 726.2 C 435.4 722.7 436.1 719.1 437 715.4 C 437.9 711.6 439.2 707.7 440.4 703.7 C 441.6 699.6 443.1 695.4 444.4 691 C 445.6 686.6 447 682.2 447.8 677.2 C 448.7 672.3 449.4 666.7 449.3 661.5 C 449.1 656.4 448 651.2 446.8 646.5 C 445.6 641.7 443.8 637.3 442 633 C 440.2 628.7 438.1 624.6 436.1 620.6 C 434 616.6 431.8 612.7 429.7 609 C 427.6 605.2 425 600.4 423.7 598 C 422.3 595.7 422.4 595.8 421.4 595.1 C 420.5 594.4 419.1 594 417.9 594 C 416.7 594 415.3 594.5 414.4 595.2 C 413.4 595.9 412.6 597.1 412.3 598.3 C 411.9 599.4 411.6 599.2 412.3 602 C 413 604.7 415.2 610.8 416.6 615 C 418 619.2 419.5 623.1 420.7 627.1 C 422 631.1 423.2 635.1 424.2 639 C 425.1 642.9 426 646.9 426.4 650.6 C 426.9 654.4 427.1 657.9 426.7 661.4 C 426.4 664.9 425.5 667.9 424.4 671.4 C 423.3 674.9 421.7 678.7 420.1 682.5 C 418.6 686.3 416.8 690.2 415.1 694.3 C 413.4 698.4 411.5 702.7 410.1 707.2 C 408.6 711.8 407 716.8 406.2 721.8 C 405.3 726.9 405 732.5 405 737.5 C 405 742.6 405.5 747.4 406 752.1 C 406.5 756.8 407.3 761.3 408.1 765.8 C 408.8 770.3 409.8 774.7 410.7 779 C 411.6 783.4 412.8 788 413.6 791.9 C 414.5 795.9 415.6 800.9 416 802.6"/>
    <path stroke-width="7" d="M 495 795.6 C 495.3 793.8 496.2 789 496.8 784.7 C 497.5 780.4 498.3 775 498.9 770 C 499.6 765.1 500.2 760.1 500.7 755 C 501.2 749.9 501.6 744.8 501.8 739.6 C 502.1 734.4 502.3 729.1 502 723.6 C 501.7 718.2 501.1 712.4 500.3 707 C 499.4 701.7 498 696.5 496.7 691.6 C 495.4 686.6 493.9 681.8 492.5 677.2 C 491.2 672.5 489.7 668 488.5 663.5 C 487.3 659 486.1 654.6 485.3 650.3 C 484.6 646.1 484 642.2 483.9 637.9 C 483.7 633.6 484 629.1 484.3 624.5 C 484.7 620 485.3 615.3 486 610.6 C 486.7 606 487.5 601.2 488.4 596.5 C 489.2 591.7 490.2 587 491.2 582.2 C 492.1 577.3 493.5 570.4 493.8 567.3 C 494.2 564.3 494 564.7 493.5 563.6 C 493.1 562.6 492.1 561.5 491.1 560.9 C 490.1 560.2 488.6 559.9 487.5 560 C 486.3 560.1 484.9 560.7 484.1 561.5 C 483.2 562.3 483.3 561.9 482.2 564.7 C 481 567.4 478.8 573.5 477.1 578.1 C 475.4 582.6 473.5 587.3 471.8 592 C 470.2 596.7 468.5 601.4 467 606.2 C 465.6 611.1 464.1 616 463 621.1 C 461.9 626.2 460.8 631.4 460.3 636.8 C 459.8 642.2 459.8 648.2 460.1 653.6 C 460.4 659 461.3 664.2 462.1 669.3 C 462.9 674.4 464 679.3 464.9 684.1 C 465.8 688.9 466.9 693.6 467.7 698.2 C 468.5 702.7 469.3 707.2 469.7 711.5 C 470.1 715.8 470.2 719.8 470.2 724.1 C 470.1 728.4 469.7 732.9 469.3 737.4 C 468.9 741.9 468.3 746.5 467.7 751.1 C 467.1 755.8 466.3 760.5 465.6 765.2 C 464.9 769.9 464.1 774 463.3 779.5 C 462.5 785 461.4 795 461 798"/>
    <!-- tube sponges -->
    <path stroke-width="7" d="M 520 795 C 519.8 787.1 520.2 770 519 747.5 C 517.8 725 514 674.6 513 660"/>
    <path stroke-width="7" d="M 573 660 C 572 674.8 568.2 725.9 567 748.8 C 565.8 771.7 566.2 789.4 566 797.6"/>
    <ellipse stroke-width="7" cx="543" cy="660" rx="30" ry="12"/>
    <path stroke-width="7" d="M 588 800 C 587.8 786.3 588.3 752 587 718 C 585.7 684 581.2 616.3 580 596"/>
    <path stroke-width="7" d="M 650 596 C 648.8 616.9 644.3 686.2 643 721.3 C 641.7 756.4 642.2 792.4 642 806.6"/>
    <ellipse stroke-width="7" cx="615" cy="596" rx="35" ry="12"/>
    <path stroke-width="7" d="M 664 808.6 C 663.8 801.6 664.2 787.1 663 766.3 C 661.8 745.5 658 697.7 657 684"/>
    <path stroke-width="7" d="M 715 684 C 714 697.8 710.2 745.9 709 766.9 C 707.8 787.9 708.2 802.7 708 809.8"/>
    <ellipse stroke-width="7" cx="686" cy="684" rx="29" ry="12"/>
    <!-- sea fan -->
    <path stroke-width="7" d="M 836 744 C 830.5 734.8 815.7 704.9 802.9 688.8 C 790.1 672.7 770.1 657.1 759 647.4 C 747.9 637.6 740 633.2 736.2 630.3 C 737.2 626 736.7 608.4 742.1 604.4 C 747.5 600.4 764.2 606 768.6 606.3 C 770.6 602.3 774.6 585.2 780.8 582.7 C 787.1 580.2 801.8 589.7 806 591.1 C 809 587.9 817.1 572.3 823.8 571.4 C 830.5 570.6 842.3 583.6 846 586 C 849.7 583.6 861.5 570.6 868.2 571.4 C 874.9 572.3 883 587.9 886 591.1 C 890.2 589.7 904.9 580.2 911.2 582.7 C 917.4 585.2 921.4 602.3 923.4 606.3 C 927.8 606 944.5 600.4 949.9 604.4 C 955.3 608.4 954.8 626 955.8 630.3 C 952 633.2 944.1 637.6 933 647.4 C 921.9 657.1 901.9 672.7 889.1 688.8 C 876.3 704.9 861.5 734.8 856 744 C 852.7 744 839.3 744 836 744 Z"/>
    <path stroke-width="7" d="M 836 795.5 C 836 776 836 760 836 744 M 856 793.4 C 856 776 856 760 856 744"/>
    <path stroke-width="5" d="M 807.8 695.4 C 808.8 694.7 812.1 692.1 814.1 690.9 C 816.1 689.6 817.8 688.7 819.8 687.8 C 821.8 686.9 823.8 686.1 825.8 685.4 C 827.9 684.7 829.9 684.1 832.1 683.6 C 834.2 683.1 836.3 682.7 838.4 682.5 C 840.6 682.2 842.8 682 844.9 682 C 847.1 682 849.3 682 851.4 682.2 C 853.6 682.4 855.7 682.7 857.8 683.1 C 860 683.6 862.1 684.1 864.1 684.7 C 866.2 685.3 868.2 686.1 870.2 686.9 C 872.2 687.8 874.2 688.7 876.1 689.8 C 877.9 690.8 880.2 692.3 881.6 693.2 C 882.9 694.2 883.8 695 884.2 695.4 M 769.8 656.6 C 771.4 655.4 776.1 651.3 779.5 649 C 782.8 646.6 786.2 644.5 789.8 642.5 C 793.3 640.6 797 638.8 800.7 637.2 C 804.4 635.6 808.2 634.3 812.1 633.1 C 816 631.9 819.9 630.9 823.9 630.1 C 827.8 629.4 831.9 628.8 835.9 628.4 C 839.9 628.1 844 627.9 848 628 C 852.1 628.1 856.1 628.4 860.1 628.9 C 864.1 629.4 868.2 630.1 872.1 631 C 876 631.9 879.9 633 883.8 634.3 C 887.6 635.6 891.4 637.2 895 638.9 C 898.7 640.6 902.3 642.5 905.7 644.6 C 909.2 646.7 913.1 649.3 915.8 651.4 C 918.5 653.4 921.1 655.8 922.2 656.6 M 815.6 690 C 810.8 683.5 795 665 787.2 651.1 C 779.3 637.1 771.7 613.7 768.6 606.3 M 830.2 684.1 C 827.2 676.6 816.6 654.7 812.6 639.2 C 808.6 623.7 807.1 599.2 806 591.1 M 845.9 682 C 845.9 674 846 650 846 634 C 846 618 846 594 846 586 M 861.7 684 C 864.6 676.5 875.3 654.7 879.4 639.2 C 883.4 623.7 884.9 599.2 886 591.1 M 876.4 690 C 881.1 683.5 897 665 904.8 651.1 C 912.7 637.1 920.3 613.7 923.4 606.3"/>
    <!-- submarine -->
    <path stroke-width="7" d="M 102.2 188.9 C 105.8 184.1 111 168.8 124 160 C 137 151.2 155.7 141.3 180 136 C 204.3 130.7 240 128 270 128 C 300 128 337.3 130.7 360 136 C 382.7 141.3 395.7 149.3 406 160 C 416.3 170.7 422 186.7 422 200 C 422 213.3 416.3 229.3 406 240 C 395.7 250.7 382.7 258.7 360 264 C 337.3 269.3 300 272 270 272 C 240 272 204.3 269.3 180 264 C 155.7 258.7 137 248.8 124 240 C 111 231.2 105.8 215.9 102.2 211.1"/>
    <circle stroke-width="7" cx="88" cy="200" r="18"/>
    <path stroke-width="7" d="M 76.9 185.8 C 74.1 181.8 64.2 170 60 162 C 55.8 154 51.3 144.3 52 138 C 52.7 131.7 59.3 124.3 64 124 C 68.7 123.7 76.7 130 80 136 C 83.3 142 83.4 152.2 84 160 C 84.6 167.8 83.7 178.8 83.6 182.5"/>
    <path stroke-width="7" d="M 76.9 214.2 C 74.1 218.2 64.2 230 60 238 C 55.8 246 51.3 255.7 52 262 C 52.7 268.3 59.3 275.7 64 276 C 68.7 276.3 76.7 270 80 264 C 83.3 258 83.4 247.8 84 240 C 84.6 232.2 83.7 221.2 83.6 217.5"/>
    <path stroke-width="7" d="M 226 129.8 C 226.7 124.1 227.3 104 230 96 C 232.7 88 240 84.3 242 82 C 251 82 287 82 296 82 C 297.7 84.3 304 88.1 306 96 C 308 103.9 307.8 123.7 308.1 129.3"/>
    <path stroke-width="7" d="M 274 82 L 274 52 Q 274 44 282 44 L 306 44 Q 314 44 314 52 L 314 58 Q 314 66 306 66 L 290 66 L 290 82"/>
    <circle stroke-width="5" cx="268" cy="108" r="11"/>
    <circle stroke-width="6" cx="175" cy="200" r="28"/>
    <circle stroke-width="5" cx="175" cy="200" r="15"/>
    <circle stroke-width="6" cx="250" cy="200" r="28"/>
    <circle stroke-width="5" cx="250" cy="200" r="15"/>
    <circle stroke-width="6" cx="325" cy="200" r="28"/>
    <circle stroke-width="5" cx="325" cy="200" r="15"/>
    <path stroke-width="5" d="M 382.2 143.3 C 385.5 152.7 402 181.1 402 200 C 402 218.9 385.5 247.3 382.2 256.7"/>
    <path stroke-width="5" d="M 157.1 142.8 C 154.2 152.3 140 180.9 140 200 C 140 219.1 154.2 247.7 157.1 257.2"/>
    <!-- big fish -->
    <path stroke-width="7" d="M 504 406.8 C 510 404.8 528.2 402.8 540 395 C 551.8 387.2 569.2 365.8 575 360 C 571.8 372 559.2 420 556 432 C 559.2 444 571.8 492 575 504 C 569.2 498.2 551.8 476.8 540 469 C 528.2 461.2 510 459.2 504 457.2"/>
    <path stroke-width="7" d="M 385.5 374.5 C 389.3 369.6 398.9 352.8 408 345 C 417.1 337.2 426.7 328.8 440 328 C 453.3 327.2 482.8 331.2 488 340 C 493.2 348.8 474.2 373.8 471.4 380.6"/>
    <path stroke-width="7" d="M 439.1 492.6 C 437.6 496.5 426.2 511.4 430 516 C 433.8 520.6 455.5 525.2 462 520 C 468.5 514.8 467.6 490.5 468.8 484.6"/>
    <ellipse stroke-width="7" cx="420" cy="432" rx="92" ry="62"/>
    <path stroke-width="5" d="M 418.1 370 C 416.1 380.3 406 411.3 406 432 C 406 452.7 416.1 483.7 418.1 494"/>
    <path stroke-width="5" d="M 452.9 374.1 C 451.4 383.7 444 412.7 444 432 C 444 451.3 451.4 480.3 452.9 489.9"/>
    <circle cx="366" cy="416" r="25" stroke-width="5"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 348.7 418.2 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 Z M 350.3 412.9 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="5" d="M 348 452 Q 364 468 384 456"/>
    <!-- little fish -->
    <path stroke-width="7" d="M 889.7 111.1 C 895.1 110.6 912.6 112.5 922 108 C 931.4 103.5 942 88 946 84 C 944 91.3 936 120.7 934 128 C 936 135.3 944 164.7 946 172 C 942 168 931.4 152.5 922 148 C 912.6 143.5 895.1 145.4 889.7 144.9"/>
    <ellipse stroke-width="7" cx="842" cy="128" rx="54" ry="36"/>
    <path stroke-width="5" d="M 847.4 92.2 C 845.5 98.1 836 116.1 836 128 C 836 139.9 845.5 157.9 847.4 163.8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 804 122.6 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0 Z M 803.6 118.4 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="5" d="M 806.4 140.2 Q 813.9 148.9 823.6 142.4"/>
    <path stroke-width="7" d="M 902.4 297 C 907.7 296.1 924.7 296.8 934 292 C 943.3 287.2 954 272 958 268 C 956 275.3 948 304.7 946 312 C 948 319.3 956 348.7 958 356 C 954 352 943.3 336.8 934 332 C 924.7 327.2 907.7 327.9 902.4 327"/>
    <ellipse stroke-width="7" cx="860" cy="312" rx="48" ry="32"/>
    <path stroke-width="5" d="M 865.3 280.2 C 863.4 285.5 854 301.4 854 312 C 854 322.6 863.4 338.5 865.3 343.8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 825 307.2 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0 Z M 824.6 303 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="5" d="M 828.3 322.9 Q 835 330.6 843.7 324.8"/>
    <!-- seahorse -->
    <path stroke-width="7" d="M 718.2 288 C 718.5 290.1 719.5 296.7 719.6 300.8 C 719.7 304.9 719.5 309.7 718.9 312.7 C 718.3 315.7 717.2 316.1 716.1 318.8 C 715 321.5 713.9 324.7 712.3 328.8 C 710.7 332.9 708.5 338.1 706.5 343.6 C 704.5 349.1 702.1 356.4 700.4 361.9 C 698.7 367.5 697.3 371.3 696.3 376.9 C 695.2 382.6 694.3 388.9 693.9 395.9 C 693.4 402.9 692.7 411.4 693.3 419 C 693.9 426.7 695.3 435 697.2 442 C 699.2 448.9 702.1 454.8 705.2 460.7 C 708.2 466.7 711.3 472 715.5 477.7 C 719.6 483.3 725.8 490.2 729.9 494.6 C 734.1 499 737.6 501 740.2 504 C 742.7 507 743.9 509.1 745.3 512.6 C 746.8 516.1 748.3 521 749 524.9 C 749.7 528.9 750 532.4 749.3 536.1 C 748.6 539.8 746.7 543.9 744.8 547.1 C 742.9 550.4 740.8 553.4 738 555.4 C 735.1 557.4 731.4 558.6 727.7 559.1 C 724 559.7 719.3 560 715.9 558.9 C 712.5 557.8 709.6 555.2 707.3 552.5 C 705 549.8 702.7 546.5 702.2 543 C 701.7 539.4 702.9 534.2 704.2 531.1 C 705.4 527.9 706.1 525.6 709.5 524.1 C 713 522.7 721.9 523 725 522.4 C 728.2 521.8 727.7 521.5 728.6 520.6 C 729.5 519.7 730.2 518.2 730.4 517 C 730.6 515.7 730.4 514.2 729.8 513 C 729.2 511.9 728.1 510.8 726.9 510.2 C 725.8 509.6 726.4 509.6 723 509.6 C 719.5 509.6 711.9 507.6 706.3 510.1 C 700.8 512.7 693.3 519.1 689.8 524.8 C 686.3 530.5 684.7 537.7 685.2 544.2 C 685.7 550.7 688.8 558.3 692.8 563.8 C 696.8 569.3 702.9 574.5 708.9 577.4 C 715 580.3 722.2 581.1 729 581 C 735.8 580.9 743.5 579.7 749.7 576.7 C 755.9 573.8 761.7 568.3 766.2 563.1 C 770.7 558 774.1 552.1 776.8 545.8 C 779.5 539.5 781.3 532 782.3 525.3 C 783.3 518.6 783.7 512.5 783.1 505.5 C 782.5 498.6 780.6 490.1 778.6 483.5 C 776.7 476.9 772.8 470.6 771.3 465.9 C 769.8 461.1 769.9 459.1 769.6 455 C 769.3 450.9 769.3 445.8 769.3 441.5 C 769.3 437.1 769.4 432.5 769.6 428.9 C 769.8 425.3 770 422.8 770.7 419.8 C 771.4 416.8 772.4 414.5 773.7 410.9 C 775 407.4 777.1 403.2 778.6 398.5 C 780.1 393.7 781.5 387.1 782.6 382.2 C 783.8 377.4 784.2 374.3 785.4 369.6 C 786.6 364.8 788.3 360 789.8 353.8 C 791.3 347.7 793.8 340.5 794.3 332.7 C 794.8 324.8 794.1 314.3 792.9 306.6 C 791.7 299 791.8 293.9 787.3 286.7 C 782.8 279.5 769.5 267.5 765.9 263.6"/>
    <path stroke-width="7" d="M 773.7 410.9 C 778.7 410 796.6 401.3 803.6 405.7 C 810.5 410 816.1 427.3 815.4 437 C 814.8 446.7 807.1 460.8 799.5 463.8 C 791.8 466.8 774.6 456.5 769.6 455"/>
    <path stroke-width="5" d="M 780.3 426.3 L 802.2 428.4 M 778.9 441 L 800.8 443.1"/>
    <path stroke-width="5" d="M 718.9 312.7 C 723.2 317.1 741.4 332.3 744.9 339.3 C 748.3 346.3 741.3 349.3 739.6 354.5 C 738 359.7 736.4 365.2 734.9 370.5 C 733.4 375.7 732.1 380.7 730.8 386 C 729.6 391.3 728.2 396.6 727.4 402.2 C 726.5 407.8 725.8 413.6 725.8 419.3 C 725.9 425.1 726.6 430.9 727.6 436.5 C 728.7 442 730.3 447.4 732.1 452.6 C 733.9 457.9 735.7 463.2 738.2 468.1 C 740.7 473.1 744.3 478 747.3 482.5 C 750.3 487.1 756 488.3 756.3 495.4 C 756.6 502.4 750.2 520 749 524.9"/>
    <path stroke-width="5" d="M 700.4 361.9 L 734.9 370.5 M 693.3 419 L 725.8 419.3 M 715.5 477.7 L 738.2 468.1 M 738 555.4 L 749.7 576.7 M 715.9 558.9 L 708.9 577.4 M 702.2 543 L 685.2 544.2"/>
    <path stroke-width="7" d="M 668.8 234 C 668 234.4 665.8 235.7 664 236.4 C 662.2 237.1 659.9 237.7 658 238.2 C 656.1 238.7 654.4 239.2 652.6 239.6 C 650.8 239.9 649.3 240.1 647.3 240.3 C 645.4 240.5 643.4 240.6 641.2 240.7 C 638.9 240.8 636.3 240.7 634.1 241 C 631.8 241.3 629.4 241.6 627.6 242.7 C 625.7 243.8 623.9 245.6 622.8 247.4 C 621.7 249.3 621 251.8 621 253.9 C 621 256.1 621.6 258.6 622.7 260.4 C 623.8 262.3 625.6 264.1 627.4 265.2 C 629.3 266.3 631.8 266.6 633.9 267 C 636.1 267.4 638 267.5 640.3 267.7 C 642.6 267.9 645 268.2 647.6 268.3 C 650.2 268.4 653.1 268.5 655.8 268.4 C 658.5 268.3 661.2 267.9 663.7 267.6 C 666.2 267.4 668.8 266.8 670.9 266.6 C 672.9 266.5 675.2 266.6 676.1 266.6"/>
    <path stroke-width="7" d="M 689.3 204.9 C 689.4 201.1 687.9 188.1 690 182 C 692.1 175.9 698 168.7 702 168 C 706 167.3 710 178.3 714 178 C 718 177.7 721.7 166.3 726 166 C 730.3 165.7 737.5 170.4 740 176 C 742.5 181.6 740.7 195.9 740.8 199.9"/>
    <ellipse stroke-width="7" cx="720" cy="242" rx="52" ry="46"/>
    <circle cx="728" cy="234" r="22" stroke-width="5"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 712.6 235.4 a 12.5 12.5 0 1 0 25 0 a 12.5 12.5 0 1 0 -25 0 Z M 713.3 230.7 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="5" d="M 688 264 Q 703 278 720 269"/>
    <!-- bubbles -->
    <circle stroke-width="5" cx="316" cy="398" r="10"/>
    <circle stroke-width="5" cx="298" cy="358" r="14"/>
    <circle stroke-width="5" cx="318" cy="314" r="10"/>
    <circle stroke-width="5" cx="604" cy="212" r="12"/>
    <circle stroke-width="5" cx="618" cy="166" r="10"/>
    <circle stroke-width="5" cx="472" cy="72" r="17"/>
    <circle stroke-width="5" cx="524" cy="124" r="11"/>
    <circle stroke-width="5" cx="430" cy="150" r="10"/>
    <circle stroke-width="5" cx="566" cy="56" r="10"/>
    <circle stroke-width="5" cx="950" cy="214" r="12"/>
    <circle stroke-width="5" cx="948" cy="432" r="13"/>
    <circle stroke-width="5" cx="924" cy="480" r="10"/>
    <circle stroke-width="5" cx="700" cy="70" r="13"/>
    <circle stroke-width="5" cx="740" cy="120" r="10"/>
    <!-- on the sand -->
    <path stroke-width="7" d="M 430 846 C 434.9 846 438.5 873.5 446.5 879.3 C 454.4 885.2 481.7 880 483.3 884.7 C 484.8 889.4 459.7 901.3 456.6 910.7 C 453.6 920 466.9 944.4 462.9 947.3 C 458.9 950.2 439.9 930 430 930 C 420.1 930 401.1 950.2 397.1 947.3 C 393.1 944.4 406.4 920 403.4 910.7 C 400.3 901.3 375.2 889.4 376.7 884.7 C 378.3 880 405.6 885.2 413.5 879.3 C 421.5 873.5 425.1 846 430 846 Z"/>
    <circle stroke-width="5" cx="430" cy="902" r="10"/>
    <path stroke-width="7" d="M 567 905 C 567.4 902.3 566.4 892 569.6 889 C 572.7 885.9 583.3 887.1 586 886.7 C 587.7 884.6 592.1 875.1 596.5 874 C 600.8 872.9 609.4 879 612 880 C 614.6 879 623.2 872.9 627.5 874 C 631.9 875.1 636.3 884.6 638 886.7 C 640.7 887.1 651.3 885.9 654.4 889 C 657.6 892 656.6 902.3 657 905 L 625.9 922 A 16 16 0 0 0 598.1 922 Z"/>
    <path stroke-width="7" d="M 598.1 922 L 584 934 Q 582 948 594 948 L 630 948 Q 642 948 640 934 L 625.9 922"/>
    <path stroke-width="5" d="M 586 886.7 L 604 916.1 M 612 880 L 612 914 M 638 886.7 L 620 916.1"/>
    <circle stroke-width="7" cx="800" cy="905" r="36"/>
    <path stroke-width="5" d="M 764 905 C 768.5 901.1 785.4 885.4 790.9 881.3 C 796.4 877.3 794.9 880.6 796.9 880.5 C 798.9 880.5 800.9 880.7 802.8 881.2 C 804.6 881.6 806.5 882.3 808.1 883.2 C 809.8 884 811.3 885.1 812.7 886.3 C 814.1 887.5 815.3 888.9 816.3 890.3 C 817.3 891.8 818.1 893.4 818.7 895 C 819.3 896.6 819.7 898.3 819.9 899.9 C 820.1 901.5 820 903.2 819.8 904.8 C 819.6 906.4 819.2 907.9 818.6 909.4 C 818.1 910.8 817.3 912.2 816.4 913.4 C 815.6 914.6 814.5 915.7 813.4 916.6 C 812.4 917.5 811.1 918.3 809.9 918.9 C 808.7 919.5 807.3 920 806 920.2 C 804.7 920.5 803.4 920.6 802.1 920.5 C 800.9 920.5 799.6 920.3 798.4 919.9 C 797.3 919.6 796.1 919.1 795.2 918.5 C 794.2 917.9 793.2 917.1 792.5 916.3 C 791.7 915.6 791 914.7 790.5 913.8 C 790 912.8 789.5 911.9 789.3 910.9 C 789 909.9 788.9 908.9 788.8 908 C 788.8 907 788.9 906.1 789.1 905.2 C 789.3 904.4 789.7 903.5 790.1 902.8 C 790.5 902 791 901.4 791.5 900.8 C 792 900.2 792.7 899.7 793.3 899.3 C 793.9 898.9 794.9 898.6 795.2 898.4"/>
    <ellipse stroke-width="6" cx="130" cy="878" rx="34" ry="18"/>
    <ellipse stroke-width="6" cx="250" cy="936" rx="26" ry="15"/>
    <ellipse stroke-width="6" cx="930" cy="900" rx="30" ry="17"/>
    <ellipse stroke-width="6" cx="712" cy="952" rx="22" ry="13"/>
    <ellipse stroke-width="6" cx="60" cy="950" rx="22" ry="13"/>
  </g>
</svg>
`,Te=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sand -->
    <path d="M -20 572 C 0 574.3 61 584.4 100 586 C 139 587.6 194.8 582.4 213.7 581.6"/>
    <path d="M 546.3 581.6 C 565.2 580 614.4 570.9 660 572 C 705.6 573.1 760 587.7 820 588 C 880 588.3 986.7 576.3 1020 574"/>
    <path d="M 950 580.2 C 950.3 579.1 951.2 577.1 952 573.7 C 952.7 570.2 953.8 564.4 954.5 559.6 C 955.2 554.8 955.9 549.9 956.4 544.8 C 956.8 539.7 957.2 534.4 957.1 529 C 957 523.5 956.6 517.6 955.8 512.2 C 955 506.8 953.6 501.5 952.3 496.6 C 951 491.6 949.4 487.1 947.9 482.7 C 946.4 478.2 944.8 474 943.4 469.8 C 942 465.7 940.6 461.7 939.4 457.8 C 938.2 453.9 937 449.9 936.2 446.2 C 935.4 442.5 934.8 439.2 934.5 435.4 C 934.2 431.6 934.3 427.5 934.4 423.4 C 934.5 419.2 934.8 414.8 935.2 410.5 C 935.5 406.2 936 401.8 936.6 397.3 C 937.1 392.9 937.7 388.4 938.3 383.8 C 938.8 379.2 939.7 372.8 939.8 369.6 C 940 366.4 939.9 366.1 939.3 364.7 C 938.6 363.2 937.3 361.8 935.9 361 C 934.6 360.3 932.6 359.9 931.1 360.1 C 929.5 360.2 927.7 361 926.6 362.1 C 925.4 363.2 925.4 363.7 924.2 366.4 C 922.9 369.2 920.8 374.5 919.1 378.6 C 917.4 382.8 915.5 387.1 913.8 391.5 C 912.1 395.9 910.4 400.3 908.9 404.9 C 907.4 409.4 905.9 414 904.7 418.8 C 903.5 423.7 902.3 428.7 901.7 434 C 901.1 439.2 900.8 445.1 900.9 450.4 C 901 455.7 901.7 460.7 902.3 465.7 C 903 470.6 903.9 475.5 904.8 480.1 C 905.6 484.8 906.6 489.3 907.5 493.6 C 908.3 498 909.2 502.2 909.8 506.2 C 910.5 510.1 911 513.7 911.2 517.3 C 911.4 521 911.3 524.2 911.1 527.8 C 910.9 531.5 910.4 535.2 909.8 539.2 C 909.2 543.1 908.5 547.3 907.7 551.4 C 906.9 555.6 906 558.6 905.1 564.1 C 904.1 569.6 902.5 580.9 902 584.2"/>
    <path d="M 877 586 C 876.5 583.6 875 576 874.1 572.1 C 873.2 568.2 872.5 565.7 871.7 562.6 C 871 559.5 870.3 556.5 869.7 553.6 C 869.1 550.8 868.6 547.9 868.3 545.3 C 867.9 542.6 867.7 540.2 867.7 537.8 C 867.6 535.4 867.8 533.5 868.2 531 C 868.6 528.5 869.3 525.6 870 522.6 C 870.7 519.6 871.6 516.3 872.5 513 C 873.4 509.7 874.4 506.3 875.2 502.7 C 876 499.2 877 495.6 877.6 491.6 C 878.1 487.6 878.8 483.2 878.7 478.8 C 878.6 474.5 878 469.6 877.1 465.5 C 876.3 461.4 875 457.7 873.6 454.2 C 872.3 450.6 870.8 447.2 869.2 443.9 C 867.7 440.6 865.9 437.4 864.3 434.4 C 862.7 431.4 860.9 428 859.7 425.9 C 858.5 423.8 858.3 422.8 857.1 421.8 C 855.8 420.8 854 420.1 852.4 420 C 850.9 419.9 849 420.4 847.7 421.3 C 846.3 422.1 845.1 423.7 844.5 425.1 C 844 426.6 844 427.4 844.3 430.1 C 844.6 432.7 845.7 437.5 846.3 441 C 847 444.5 847.7 447.6 848.2 450.8 C 848.8 454 849.3 457.2 849.6 460.2 C 849.9 463.3 850.1 466.4 850 469 C 849.9 471.7 849.7 473.7 849.1 476.1 C 848.6 478.6 847.7 480.9 846.7 483.5 C 845.7 486.2 844.5 489.1 843.2 492 C 841.9 494.9 840.5 497.9 839.1 501 C 837.7 504.2 836.2 507.3 834.9 510.8 C 833.5 514.4 832 518 830.9 522.1 C 829.8 526.2 828.7 531.1 828.3 535.5 C 827.8 539.9 827.9 544.4 828 548.5 C 828.2 552.7 828.7 556.6 829.2 560.5 C 829.7 564.3 830.4 568 831.1 571.6 C 831.8 575.2 832.8 579.4 833.4 582.1 C 834.1 584.8 834.7 586.9 835 587.9"/>
    <!-- crab -->
    <path stroke-width="10" d="M 172.3 304.3 C 182 298.1 221 272.9 230.7 266.6 C 233.8 272.1 246.2 287 249.1 299.2 C 252.1 311.4 251.5 327 248.4 339.8 C 245.4 352.6 239 365.9 230.9 376 C 222.8 386.2 211.5 395.1 200 400.5 C 188.5 405.9 174.6 408.7 162 408.2 C 149.4 407.8 135.7 403.9 124.6 397.7 C 113.5 391.5 102.8 381.8 95.4 371.1 C 88 360.4 82.5 346.7 80.3 333.7 C 78.1 320.7 78.9 305.8 82.3 293.1 C 85.8 280.4 92.7 267.4 101.1 257.6 C 109.5 247.8 121.2 238.1 132.8 234.3 C 144.4 230.5 164.5 234.7 170.8 234.8 C 171.1 246.4 172 292.7 172.3 304.3 Z"/>
    <path d="M 260.1 542.2 C 259.7 540.7 258.7 536.9 257.5 533.2 C 256.4 529.5 254.5 524.5 253.1 520 C 251.7 515.4 250.4 510.7 249 505.9 C 247.7 501.2 246.3 496.2 245 491.4 C 243.6 486.5 242.3 481.6 241 476.8 C 239.6 471.9 238.3 467 237 462.1 C 235.7 457.2 234.3 452.3 233 447.4 C 231.7 442.5 230.4 437.6 229 432.7 C 227.7 427.8 227.7 424.7 225.1 418 C 222.5 411.3 215.4 396.7 213.5 392.5 M 221.7 571.8 C 219.5 568.3 211.7 557 208.6 551 C 205.6 544.9 205 540.4 203.4 535.3 C 201.8 530.1 200.4 525.1 199 520.1 C 197.5 515 196.2 510.2 194.8 505.2 C 193.5 500.3 192.1 495.4 190.8 490.4 C 189.4 485.5 188.1 480.6 186.8 475.7 C 185.5 470.8 184.1 465.8 182.8 460.9 C 181.5 456 180.2 451.1 178.8 446.2 C 177.5 441.3 176.3 437.8 174.9 431.5 C 173.5 425.1 171.1 412 170.3 408.1"/>
    <path stroke-width="10" d="M 587.7 304.3 C 578 298.1 539 272.9 529.3 266.6 C 526.2 272.1 513.8 287 510.9 299.2 C 507.9 311.4 508.5 327 511.6 339.8 C 514.6 352.6 521 365.9 529.1 376 C 537.2 386.2 548.5 395.1 560 400.5 C 571.5 405.9 585.4 408.7 598 408.2 C 610.6 407.8 624.3 403.9 635.4 397.7 C 646.5 391.5 657.2 381.8 664.6 371.1 C 672 360.4 677.5 346.7 679.7 333.7 C 681.9 320.7 681.1 305.8 677.7 293.1 C 674.2 280.4 667.3 267.4 658.9 257.6 C 650.5 247.8 638.8 238.1 627.2 234.3 C 615.6 230.5 595.5 234.7 589.2 234.8 C 588.9 246.4 588 292.7 587.7 304.3 Z"/>
    <path d="M 538.3 571.8 C 540.5 568.3 548.3 557 551.4 551 C 554.4 544.9 555 540.4 556.6 535.3 C 558.2 530.1 559.6 525.1 561 520.1 C 562.5 515 563.8 510.2 565.2 505.2 C 566.5 500.3 567.9 495.4 569.2 490.4 C 570.6 485.5 571.9 480.6 573.2 475.7 C 574.5 470.8 575.9 465.8 577.2 460.9 C 578.5 456 579.8 451.1 581.2 446.2 C 582.5 441.3 583.7 437.8 585.1 431.5 C 586.5 425.1 588.9 412 589.7 408.1 M 499.9 542.2 C 500.3 540.7 501.3 536.9 502.5 533.2 C 503.6 529.5 505.5 524.5 506.9 520 C 508.3 515.4 509.6 510.7 511 505.9 C 512.3 501.2 513.7 496.2 515 491.4 C 516.4 486.5 517.7 481.6 519 476.8 C 520.4 471.9 521.7 467 523 462.1 C 524.3 457.2 525.7 452.3 527 447.4 C 528.3 442.5 529.6 437.6 531 432.7 C 532.3 427.8 532.3 424.7 534.9 418 C 537.5 411.3 544.6 396.7 546.5 392.5"/>
    <path stroke-width="10" d="M 198.1 624 C 196.1 622.6 190.4 617.1 185.8 615.6 C 181.2 614.2 175.9 615.3 170.7 615.3 C 165.6 615.3 160.5 615.2 155 615.7 C 149.5 616.2 143.5 617.1 138 618.3 C 132.6 619.5 127.6 620.8 122.3 622.8 C 117.1 624.8 111.6 626.9 106.5 630.1 C 101.3 633.3 95.6 637.5 91.5 642.1 C 87.4 646.6 84.6 652.3 82 657.3 C 79.4 662.2 77.8 667.2 76 671.7 C 74.3 676.3 72.4 681.2 71.4 684.4 C 70.4 687.5 69.9 688.4 70 690.4 C 70.1 692.4 70.8 694.7 71.8 696.3 C 72.9 698 74.6 699.6 76.4 700.6 C 78.1 701.5 80.4 702.1 82.4 702 C 84.4 701.9 86.7 701.2 88.3 700.2 C 90 699.1 90.7 698.7 92.6 695.6 C 94.5 692.6 97.3 686.1 99.5 681.9 C 101.7 677.7 103.7 673.7 105.9 670.3 C 108 667 110 664 112.5 661.8 C 115 659.5 117.6 658.3 120.8 656.9 C 124 655.5 127.8 654.3 131.6 653.4 C 135.5 652.5 140 651.8 144 651.3 C 147.9 650.9 151.5 650.8 155.6 650.9 C 159.7 651 164.2 651.5 168.6 652 C 173.1 652.5 176.9 654.6 182.3 653.9 C 187.7 653.2 197.7 648.8 200.8 647.8"/>
    <path stroke-width="10" d="M 559.2 647.8 C 562.3 648.8 572.3 653.2 577.7 653.9 C 583.1 654.6 586.9 652.5 591.4 652 C 595.8 651.5 600.3 651 604.4 650.9 C 608.5 650.8 612.1 650.9 616 651.3 C 620 651.8 624.5 652.5 628.4 653.4 C 632.2 654.3 636 655.5 639.2 656.9 C 642.4 658.3 645 659.5 647.5 661.8 C 650 664 652 667 654.1 670.3 C 656.3 673.7 658.3 677.7 660.5 681.9 C 662.7 686.1 665.5 692.6 667.4 695.6 C 669.3 698.7 670 699.1 671.7 700.2 C 673.3 701.2 675.6 701.9 677.6 702 C 679.6 702.1 681.9 701.5 683.6 700.6 C 685.4 699.6 687.1 698 688.2 696.3 C 689.2 694.7 689.9 692.4 690 690.4 C 690.1 688.4 689.6 687.5 688.6 684.4 C 687.6 681.2 685.7 676.3 684 671.7 C 682.2 667.2 680.6 662.2 678 657.3 C 675.4 652.3 672.6 646.6 668.5 642.1 C 664.4 637.5 658.7 633.3 653.5 630.1 C 648.4 626.9 642.9 624.8 637.7 622.8 C 632.4 620.8 627.4 619.5 622 618.3 C 616.5 617.1 610.5 616.2 605 615.7 C 599.5 615.2 594.4 615.3 589.3 615.3 C 584.1 615.3 578.8 614.2 574.2 615.6 C 569.6 617.1 563.9 622.6 561.9 624"/>
    <path stroke-width="10" d="M 202.7 653.6 C 199.7 654.2 190 655 184.9 657.1 C 179.8 659.2 176.4 663.1 172.2 666.4 C 168 669.6 163.7 672.9 159.5 676.6 C 155.3 680.4 151 684.8 147.2 689 C 143.5 693.1 140.1 697.3 136.9 701.8 C 133.6 706.3 130.4 710.9 127.6 715.9 C 124.8 721 121.9 726.6 120 732.2 C 118.1 737.8 117 744 116.1 749.6 C 115.3 755.2 115.1 760.6 114.8 765.7 C 114.5 770.8 114.1 776.7 114.1 780.1 C 114.1 783.6 114.1 784.4 114.8 786.3 C 115.5 788.2 116.9 790.1 118.5 791.3 C 120 792.6 122.2 793.5 124.1 793.9 C 126.1 794.2 128.4 793.9 130.3 793.2 C 132.2 792.5 134.1 791.1 135.3 789.5 C 136.6 788 137 787.4 137.9 783.9 C 138.7 780.3 139.4 773.1 140.3 768.2 C 141.1 763.3 141.8 758.7 142.9 754.5 C 144 750.2 145.1 746.4 146.8 742.7 C 148.5 739 150.7 735.7 153.2 732.3 C 155.7 728.9 158.6 725.4 161.6 722 C 164.7 718.7 168.1 715.3 171.4 712.4 C 174.6 709.4 177.7 706.9 181.3 704.3 C 184.9 701.7 189 699.2 193 696.7 C 197 694.3 201.9 692.9 205.6 689.5 C 209.2 686.1 213.5 678.4 215.1 676.2"/>
    <path stroke-width="10" d="M 544.9 676.2 C 546.5 678.4 550.8 686.1 554.4 689.5 C 558.1 692.9 563 694.3 567 696.7 C 571 699.2 575.1 701.7 578.7 704.3 C 582.3 706.9 585.4 709.4 588.6 712.4 C 591.9 715.3 595.3 718.7 598.4 722 C 601.4 725.4 604.3 728.9 606.8 732.3 C 609.3 735.7 611.5 739 613.2 742.7 C 614.9 746.4 616 750.2 617.1 754.5 C 618.2 758.7 618.9 763.3 619.7 768.2 C 620.6 773.1 621.3 780.3 622.1 783.9 C 623 787.4 623.4 788 624.7 789.5 C 625.9 791.1 627.8 792.5 629.7 793.2 C 631.6 793.9 633.9 794.2 635.9 793.9 C 637.8 793.5 640 792.6 641.5 791.3 C 643.1 790.1 644.5 788.2 645.2 786.3 C 645.9 784.4 645.9 783.6 645.9 780.1 C 645.9 776.7 645.5 770.8 645.2 765.7 C 644.9 760.6 644.7 755.2 643.9 749.6 C 643 744 641.9 737.8 640 732.2 C 638.1 726.6 635.2 721 632.4 715.9 C 629.6 710.9 626.4 706.3 623.1 701.8 C 619.9 697.3 616.5 693.1 612.8 689 C 609 684.8 604.7 680.4 600.5 676.6 C 596.3 672.9 592 669.6 587.8 666.4 C 583.6 663.1 580.2 659.2 575.1 657.1 C 570 655 560.3 654.2 557.3 653.6"/>
    <path stroke-width="10" d="M 222.4 685 C 220.1 686.8 212.4 691.8 208.9 695.6 C 205.4 699.4 203.8 703.7 201.3 707.9 C 198.8 712 196.2 716.1 193.8 720.3 C 191.3 724.6 188.8 729 186.5 733.2 C 184.1 737.4 181.9 741.1 179.5 745.5 C 177.1 749.8 174.4 754.3 172.3 759.3 C 170.1 764.2 167.7 769.7 166.4 775.3 C 165.1 780.8 164.6 787.1 164.3 792.6 C 164.1 798 164.6 803.2 164.9 808 C 165.2 812.9 165.6 818.3 166 821.6 C 166.4 824.9 166.5 825.9 167.4 827.7 C 168.4 829.4 170 831.1 171.7 832.2 C 173.4 833.2 175.6 833.9 177.6 834 C 179.6 834.1 181.9 833.5 183.7 832.6 C 185.4 831.6 187.1 830 188.2 828.3 C 189.2 826.6 189.6 825.9 190 822.4 C 190.4 818.9 190.2 812.1 190.5 807.5 C 190.7 802.8 190.9 798.4 191.4 794.4 C 192 790.5 192.7 787.1 193.9 783.6 C 195.2 780.1 197.1 776.9 199.2 773.4 C 201.2 770 203.8 766.4 206.5 762.7 C 209.1 759 212.1 754.8 214.9 751 C 217.7 747.2 220.3 743.6 223 739.9 C 225.8 736.2 228.7 732.5 231.5 728.8 C 234.4 725.1 238.1 721.8 240.3 717.7 C 242.5 713.6 244 706.5 244.7 704.3"/>
    <path stroke-width="10" d="M 515.3 704.3 C 516 706.5 517.5 713.6 519.7 717.7 C 521.9 721.8 525.6 725.1 528.5 728.8 C 531.3 732.5 534.2 736.2 537 739.9 C 539.7 743.6 542.3 747.2 545.1 751 C 547.9 754.8 550.9 759 553.5 762.7 C 556.2 766.4 558.8 770 560.8 773.4 C 562.9 776.9 564.8 780.1 566.1 783.6 C 567.3 787.1 568 790.5 568.6 794.4 C 569.1 798.4 569.3 802.8 569.5 807.5 C 569.8 812.1 569.6 818.9 570 822.4 C 570.4 825.9 570.8 826.6 571.8 828.3 C 572.9 830 574.6 831.6 576.3 832.6 C 578.1 833.5 580.4 834.1 582.4 834 C 584.4 833.9 586.6 833.2 588.3 832.2 C 590 831.1 591.6 829.4 592.6 827.7 C 593.5 825.9 593.6 824.9 594 821.6 C 594.4 818.3 594.8 812.9 595.1 808 C 595.4 803.2 595.9 798 595.7 792.6 C 595.4 787.1 594.9 780.8 593.6 775.3 C 592.3 769.7 589.9 764.2 587.7 759.3 C 585.6 754.3 582.9 749.8 580.5 745.5 C 578.1 741.1 575.9 737.4 573.5 733.2 C 571.2 729 568.7 724.6 566.2 720.3 C 563.8 716.1 561.2 712 558.7 707.9 C 556.2 703.7 554.6 699.4 551.1 695.6 C 547.6 691.8 539.9 686.8 537.6 685"/>
    <path stroke-width="8" d="M 343.9 516.3 C 343.4 514.8 341.8 509.5 341 507.3 C 340.2 505.1 339.7 504.5 339.1 503.2 C 338.6 501.9 338 500.6 337.6 499.4 C 337.1 498.2 336.8 497 336.4 495.7 C 336 494.4 335.7 493 335.4 491.6 C 335 490.1 334.7 488.5 334.4 487 C 334.1 485.4 333.8 483.8 333.5 482.2 C 333.2 480.5 332.9 478.9 332.6 477.3 C 332.3 475.7 331.1 471.9 331.7 472.3 C 332.3 472.8 335.4 478.7 336.1 480 M 315.3 521.4 C 315.1 521.3 314.6 521.4 314 520.4 C 313.4 519.3 312.4 517.1 311.7 515.3 C 310.9 513.5 310.1 511.6 309.4 509.7 C 308.7 507.8 308 505.7 307.5 503.8 C 306.9 501.8 306.5 499.9 306.1 498.1 C 305.7 496.3 305.3 494.6 305 492.8 C 304.6 491.1 304.3 489.4 304 487.7 C 303.7 486 303.3 484.3 303 482.6 C 302.7 480.9 302.9 477.9 302.1 477.6 C 301.4 477.3 299 480.4 298.4 480.9"/>
    <circle cx="316" cy="432" r="52"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 290.4 434.2 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0 Z M 298.9 422.8 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0 Z"/>
    <path stroke-width="8" d="M 444.7 521.4 C 444.9 521.3 445.4 521.4 446 520.4 C 446.6 519.3 447.6 517.1 448.3 515.3 C 449.1 513.5 449.9 511.6 450.6 509.7 C 451.3 507.8 452 505.7 452.5 503.8 C 453.1 501.8 453.5 499.9 453.9 498.1 C 454.3 496.3 454.7 494.6 455 492.8 C 455.4 491.1 455.7 489.4 456 487.7 C 456.3 486 456.7 484.3 457 482.6 C 457.3 480.9 457.1 477.9 457.9 477.6 C 458.6 477.3 461 480.4 461.6 480.9 M 416.1 516.3 C 416.6 514.8 418.2 509.5 419 507.3 C 419.8 505.1 420.3 504.5 420.9 503.2 C 421.4 501.9 422 500.6 422.4 499.4 C 422.9 498.2 423.2 497 423.6 495.7 C 424 494.4 424.3 493 424.6 491.6 C 425 490.1 425.3 488.5 425.6 487 C 425.9 485.4 426.2 483.8 426.5 482.2 C 426.8 480.5 427.1 478.9 427.4 477.3 C 427.7 475.7 428.9 471.9 428.3 472.3 C 427.7 472.8 424.6 478.7 423.9 480"/>
    <circle cx="444" cy="432" r="52"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 409.6 434.2 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0 Z M 418.1 422.8 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0 Z"/>
    <ellipse stroke-width="10" cx="380" cy="628" rx="182" ry="114"/>
    <path d="M 326 666 Q 380 718 434 666"/>
    <circle cx="272" cy="656" r="22"/>
    <circle cx="488" cy="656" r="22"/>
    <circle cx="292" cy="580" r="12"/>
    <circle cx="468" cy="580" r="12"/>
    <circle cx="380" cy="560" r="14"/>
    <!-- starfish -->
    <path stroke-width="10" d="M 814.8 642.7 C 827.5 641.4 844.8 694.5 864 705.6 C 883.2 716.8 937.9 705.2 943.1 716.8 C 948.3 728.3 903 761.2 898.4 783 C 893.8 804.7 921.7 853.1 912.3 861.6 C 902.9 870.1 857.6 837.3 835.5 839.6 C 813.4 841.9 776 883.5 765 877.1 C 754 870.8 771.3 817.6 762.2 797.3 C 753.2 777 702.1 754.2 704.8 741.8 C 707.4 729.4 763.3 729.4 779.8 714.5 C 796.3 699.6 802.2 644 814.8 642.7 Z"/>
    <circle stroke-width="7" cx="820.1" cy="692.4" r="11"/>
    <circle stroke-width="7" cx="897.4" cy="737.1" r="11"/>
    <circle stroke-width="7" cx="878.9" cy="824.5" r="11"/>
    <circle stroke-width="7" cx="790" cy="833.8" r="11"/>
    <circle stroke-width="7" cx="753.7" cy="752.2" r="11"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 789 758 a 17 17 0 1 0 34 0 a 17 17 0 1 0 -34 0 Z M 792.5 751.5 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 835 758 a 17 17 0 1 0 34 0 a 17 17 0 1 0 -34 0 Z M 838.5 751.5 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="7" d="M 808 796 Q 829 818 850 796"/>
    <!-- shells -->
    <path stroke-width="9" d="M 51.9 895.7 C 52.1 891.3 48.2 874.9 52.7 869.6 C 57.2 864.3 74.7 864.8 79.1 863.9 C 81.2 860 85.1 843.3 91.6 840.4 C 98.1 837.5 113.8 845.3 118.3 846.3 C 121.9 843.6 132.8 830 140 830 C 147.2 830 158.1 843.6 161.7 846.3 C 166.2 845.3 181.9 837.5 188.4 840.4 C 194.9 843.3 198.8 860 200.9 863.9 C 205.3 864.8 222.8 864.3 227.3 869.6 C 231.8 874.9 227.9 891.3 228.1 895.7 L 167 922.8 A 30 30 0 0 0 113 922.8 Z"/>
    <path stroke-width="9" d="M 113 922.8 L 88 942 Q 84 966 104 966 L 176 966 Q 196 966 192 942 L 167 922.8"/>
    <path stroke-width="6" d="M 79.1 863.9 L 121.4 912.5 M 118.3 846.3 L 133.4 906.7 M 161.7 846.3 L 146.6 906.7 M 200.9 863.9 L 158.6 912.5"/>
    <circle stroke-width="9" cx="480" cy="905" r="50"/>
    <path stroke-width="6" d="M 430 905 C 436.1 899.6 459 878 466.5 872.4 C 473.9 866.7 471.9 871.2 474.6 871 C 477.3 870.9 480.1 871.2 482.6 871.7 C 485.2 872.2 487.7 873 490 874.1 C 492.4 875.2 494.6 876.5 496.5 878.1 C 498.4 879.6 500.2 881.4 501.7 883.3 C 503.1 885.2 504.4 887.4 505.3 889.5 C 506.3 891.6 506.9 893.9 507.3 896.1 C 507.7 898.3 507.9 900.6 507.7 902.8 C 507.6 905 507.2 907.2 506.5 909.2 C 505.9 911.2 505 913.2 504 914.9 C 502.9 916.7 501.6 918.3 500.2 919.7 C 498.8 921.1 497.2 922.3 495.6 923.3 C 494 924.3 492.2 925.1 490.5 925.6 C 488.8 926.2 486.9 926.5 485.2 926.6 C 483.4 926.7 481.7 926.6 480 926.2 C 478.3 925.9 476.7 925.4 475.3 924.8 C 473.8 924.1 472.4 923.2 471.2 922.3 C 470 921.3 468.9 920.2 468 919 C 467.1 917.9 466.4 916.6 465.8 915.3 C 465.3 914 464.9 912.6 464.7 911.3 C 464.5 910 464.5 908.7 464.6 907.4 C 464.7 906.2 465 905 465.4 903.8 C 465.8 902.7 466.3 901.7 466.9 900.8 C 467.5 899.8 468.3 899 469.1 898.3 C 469.9 897.6 470.7 897 471.6 896.6 C 472.5 896.2 473.4 895.9 474.3 895.7 C 475.2 895.5 476.5 895.5 476.9 895.5"/>
    <ellipse stroke-width="8" cx="650" cy="925" rx="36" ry="20"/>
    <ellipse stroke-width="8" cx="320" cy="930" rx="26" ry="16"/>
    <!-- fish and bubbles -->
    <path stroke-width="9" d="M 847 175.4 C 853.8 171.5 876.7 159.9 888 152 C 899.3 144.1 910.5 132 915 128 C 912.5 138.3 902.5 179.7 900 190 C 902.5 200.3 912.5 241.7 915 252 C 910.5 248 899.3 235.9 888 228 C 876.7 220.1 853.8 208.5 847 204.6"/>
    <ellipse stroke-width="9" cx="770" cy="190" rx="80" ry="54"/>
    <path stroke-width="7" d="M 788.8 137.5 C 786.3 146.3 774 172.5 774 190 C 774 207.5 786.3 233.7 788.8 242.5"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 717 178 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 719.2 172.3 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="7" d="M 712 210 Q 728 226 746 212"/>
    <circle cx="660" cy="160" r="16"/>
    <circle cx="630" cy="95" r="24"/>
    <circle cx="70" cy="110" r="24"/>
    <circle cx="126" cy="52" r="15"/>
    <circle cx="390" cy="210" r="22"/>
    <circle cx="420" cy="138" r="15"/>
  </g>
</svg>
`,Ee=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(0 25)">
      <!-- fish outline: body, fins and tail -->
      <path stroke-width="14" d="M 847 520 C 847 487.8 838.2 452.1 825.7 423.4 C 813.2 394.6 794.3 369.2 772 347.4 C 749.7 325.5 719.8 305.8 692.1 292.2 C 664.4 278.6 632.5 270.8 605.7 265.9 C 603.8 255.3 603.6 219.7 594 202 C 584.4 184.3 568.3 170 548 160 C 527.7 150 496.3 143.7 472 142 C 447.7 140.3 422.3 144 402 150 C 381.7 156 358.7 173.3 350 178 C 353 189.2 359.8 223.2 368 245 C 376.2 266.8 393.8 298 399 308.7 C 378.3 323.2 354.4 344.2 337.8 364.7 C 321.2 385.2 305.8 420.6 299.4 431.8 C 288.2 423.1 254.4 399.6 232 380 C 209.6 360.4 186.7 333.3 165 314 C 143.3 294.7 112.5 272.3 102 264 C 105 278 112 318.3 120 348 C 128 377.7 140 413.3 150 442 C 160 470.7 175 507 180 520 C 175 533 160 569.3 150 598 C 140 626.7 128 662.3 120 692 C 112 721.7 105 762 102 776 C 112.5 767.7 143.3 745.3 165 726 C 186.7 706.7 209.6 679.6 232 660 C 254.4 640.4 288.2 616.9 299.4 608.2 C 307.3 621.2 328.1 664.1 346.6 685.8 C 341.9 695.2 327.1 721.6 318 742 C 308.9 762.4 296.3 797 292 808 C 302 807.7 334.7 809.3 352 806 C 369.3 802.7 386.2 799.2 396 788 C 405.8 776.8 408.4 747 410.9 738.8 C 431.6 752.1 450.9 759 470.9 765.4 C 491 771.7 507.2 775.9 531.3 777 C 555.4 778.2 588.9 777.2 615.7 772.4 C 642.5 767.5 666 761.1 692.1 747.8 C 718.1 734.5 749.7 714.5 772 692.6 C 794.3 670.8 813.2 645.4 825.7 616.6 C 838.2 587.9 847 552.2 847 520 Z"/>
      <!-- where the fins and tail join the body -->
      <path d="M 605.7 265.9 C 578.9 261 555.2 261 531.3 263 C 507.3 264.9 484 269.9 462 277.6 C 439.9 285.2 419.7 294.1 399 308.7"/>
      <path d="M 299.4 431.8 C 299.4 461.2 299.4 578.8 299.4 608.2"/>
      <path d="M 346.6 685.8 C 365.2 707.6 390.1 725.5 410.9 738.8"/>
      <!-- head and stripe -->
      <path d="M 692.1 292.2 C 682.1 330.2 632 444.1 632 520 C 632 595.9 682.1 709.8 692.1 747.8"/>
      <path d="M 531.3 263 C 524.1 305.8 488 434.3 488 520 C 488 605.7 524.1 734.2 531.3 777"/>
      <path d="M 462 277.6 C 453.6 318 410.5 438.7 412 520 C 413.5 601.3 461.1 724.5 470.9 765.4"/>
      <!-- fin lines -->
      <path stroke-width="8" d="M 215 430 Q 172 405 145 362 M 215 610 Q 172 635 145 678"/>
      <path stroke-width="8" d="M 548 238 Q 528 205 492 186 M 470 240 Q 450 214 418 200"/>
      <!-- eye, cheek and smile -->
      <circle cx="730" cy="440" r="62"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 700.5 445.2 a 36 36 0 1 0 72 0 a 36 36 0 1 0 -72 0 Z M 710.9 431.5 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z"/>
      <circle cx="692" cy="578" r="22"/>
      <path d="M 732 580 Q 774 628 818 574"/>
    </g>
    <!-- bubbles -->
    <circle cx="900" cy="330" r="28"/>
    <circle cx="928" cy="212" r="36"/>
    <circle cx="890" cy="98" r="24"/>
  </g>
</svg>
`,De=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sea floor -->
    <path d="M -20 878 C 8.3 875.3 91.7 861 150 862 C 208.3 863 271.7 882.7 330 884 C 388.3 885.3 441.7 869 500 870 C 558.3 871 621.7 890.7 680 890 C 738.3 889.3 793.3 867.7 850 866 C 906.7 864.3 991.7 877.7 1020 880"/>
    <path d="M 104 863.6 C 103.4 860.7 101.4 851.4 100.3 846.4 C 99.1 841.4 98.1 837.8 97.2 833.7 C 96.2 829.5 95.3 825.5 94.6 821.5 C 93.8 817.6 93.2 813.6 92.8 810.1 C 92.4 806.6 92.2 803.9 92.3 800.7 C 92.4 797.4 92.9 794.2 93.5 790.5 C 94.2 786.8 95.3 782.8 96.4 778.6 C 97.4 774.4 98.8 769.9 100 765.3 C 101.2 760.7 102.5 756 103.4 750.9 C 104.4 745.8 105.5 740.5 105.8 734.9 C 106.2 729.3 106.1 722.8 105.6 717.4 C 105.1 711.9 103.9 707.1 102.8 702.2 C 101.6 697.3 100.2 692.5 98.7 687.8 C 97.3 683.2 95.7 678.7 94 674.3 C 92.4 669.8 90.6 665.4 88.9 661.1 C 87.2 656.9 85.1 651.4 83.9 648.6 C 82.7 645.8 82.7 645.4 81.6 644.3 C 80.5 643.2 78.7 642.3 77.1 642.1 C 75.6 641.9 73.7 642.2 72.3 642.9 C 70.9 643.7 69.5 645.1 68.8 646.5 C 68.1 647.9 68.1 648.1 68.1 651.4 C 68.2 654.6 68.7 661.1 69.1 665.8 C 69.4 670.5 69.8 675 70.2 679.6 C 70.5 684.1 70.8 688.7 71 693.1 C 71.2 697.5 71.3 701.8 71.3 706 C 71.2 710.2 71.1 714.6 70.6 718.3 C 70.1 722.1 69.5 724.9 68.5 728.4 C 67.5 731.8 66.1 735.4 64.6 739.2 C 63 743 61.2 746.9 59.4 751 C 57.6 755.1 55.6 759.2 53.8 763.8 C 51.9 768.3 49.9 773 48.3 778.2 C 46.6 783.4 45 789.2 44.1 795 C 43.3 800.9 43.1 807.5 43.2 813.2 C 43.2 818.9 43.8 824 44.4 829.2 C 45 834.4 45.9 839.3 46.8 844.2 C 47.7 849.1 48.9 854.3 49.8 858.4 C 50.7 862.5 51.6 867.1 52 868.8"/>
    <path d="M 948 871.8 C 948.4 870 949.3 865.2 950.1 861.1 C 951 856.9 952.1 851.7 953 846.8 C 953.9 841.9 954.7 837 955.3 831.8 C 956 826.6 956.5 821.4 956.7 815.9 C 956.8 810.3 956.9 804.5 956.2 798.6 C 955.5 792.7 953.9 786 952.4 780.5 C 950.9 774.9 948.8 770.2 946.9 765.5 C 945 760.9 943 756.6 941.1 752.4 C 939.3 748.2 937.4 744.3 935.9 740.5 C 934.3 736.7 932.8 733.1 931.7 729.5 C 930.7 725.9 929.9 722.8 929.4 719 C 928.9 715.2 928.7 711 928.7 706.8 C 928.6 702.5 928.7 698 928.9 693.5 C 929.1 689.1 929.4 684.6 929.8 680 C 930.1 675.4 930.5 670.8 930.9 666 C 931.3 661.3 931.8 654.6 931.9 651.4 C 931.9 648.1 931.9 647.9 931.2 646.5 C 930.5 645.1 929.1 643.7 927.7 642.9 C 926.3 642.2 924.4 641.9 922.9 642.1 C 921.3 642.3 919.5 643.2 918.4 644.3 C 917.3 645.4 917.3 645.8 916.1 648.6 C 914.9 651.5 912.8 657 911.1 661.3 C 909.4 665.7 907.6 670.1 905.9 674.7 C 904.2 679.2 902.6 683.8 901.1 688.5 C 899.7 693.2 898.3 697.9 897.1 703 C 896 708 894.9 713.2 894.4 718.7 C 894 724.2 893.9 730.5 894.4 736.1 C 894.8 741.6 895.9 747.1 897 752.2 C 898 757.4 899.4 762.2 900.6 766.9 C 901.9 771.5 903.2 775.9 904.2 780.1 C 905.3 784.3 906.3 788.4 906.9 792 C 907.5 795.5 907.8 798.1 907.8 801.4 C 907.8 804.8 907.5 808.4 907.1 812.2 C 906.6 815.9 906 820 905.2 824 C 904.5 828.1 903.5 832.3 902.6 836.6 C 901.7 840.9 900.6 844.6 899.5 849.7 C 898.4 854.8 896.6 864.2 896 867.1"/>
    <ellipse cx="300" cy="934" rx="46" ry="24"/>
    <ellipse cx="372" cy="946" rx="24" ry="15"/>
    <ellipse cx="690" cy="944" rx="38" ry="21"/>
    <ellipse cx="520" cy="944" rx="26" ry="15"/>
    <ellipse cx="880" cy="940" rx="30" ry="18"/>
    <ellipse cx="120" cy="945" rx="28" ry="17"/>
    <!-- bubbles -->
    <circle cx="140" cy="170" r="30"/>
    <circle cx="200" cy="92" r="18"/>
    <circle cx="112" cy="62" r="14"/>
    <circle cx="862" cy="150" r="26"/>
    <circle cx="900" cy="70" r="16"/>
    <!-- octopus -->
    <path stroke-width="10" d="M 295 288 a 205 212 0 1 0 410 0 a 205 212 0 1 0 -410 0 Z"/>
    <path stroke-width="10" d="M 682 385.6 C 687 389.1 700.3 400.8 712 406.6 C 723.7 412.5 737.4 417.8 752.1 420.4 C 766.8 423.1 785 424.1 800.1 422.4 C 815.3 420.8 829.4 416.4 843 410.5 C 856.5 404.6 869.8 397.1 881.3 387.2 C 892.7 377.2 904.8 364.8 911.7 351 C 918.6 337.1 923.3 319.8 922.5 304 C 921.8 288.3 916.4 269.4 907.1 256.4 C 897.9 243.4 881.9 230.4 866.9 226.1 C 851.9 221.9 830.4 223 817.3 230.9 C 804.2 238.7 789.1 259.1 788.4 273.3 C 787.6 287.4 807.6 308 812.7 315.9 C 817.8 323.7 816.8 319.4 819.1 320.2 C 821.5 321 824.4 321.2 826.9 320.7 C 829.3 320.2 832 318.9 833.9 317.3 C 835.7 315.7 837.4 313.2 838.2 310.9 C 839 308.5 839.2 305.6 838.7 303.1 C 838.2 300.7 838.3 299.8 835.3 296.1 C 832.3 292.4 821.3 286.2 820.8 280.9 C 820.4 275.5 827 266.8 832.8 264.1 C 838.6 261.4 849.3 261.7 855.7 264.5 C 862.1 267.3 867.9 274.3 871.2 280.7 C 874.6 287 876.4 295.1 875.9 302.8 C 875.3 310.4 872.5 319.7 868 326.7 C 863.5 333.7 856.4 339.7 848.9 344.8 C 841.4 349.9 832.1 354.5 822.9 357.5 C 813.8 360.5 803 362.5 794 362.8 C 785 363 777.7 362.1 768.7 359.3 C 759.7 356.5 751.4 350.3 740 346.1 C 728.5 342 706.7 336.2 700.1 334.2"/>
    <path stroke-width="10" d="M 299.9 334.2 C 293.3 336.2 271.5 342 260 346.1 C 248.6 350.3 240.3 356.5 231.3 359.3 C 222.3 362.1 215 363 206 362.8 C 197 362.5 186.2 360.5 177.1 357.5 C 167.9 354.5 158.6 349.9 151.1 344.8 C 143.6 339.7 136.5 333.7 132 326.7 C 127.5 319.7 124.7 310.4 124.1 302.8 C 123.6 295.1 125.4 287 128.8 280.7 C 132.1 274.3 137.9 267.3 144.3 264.5 C 150.7 261.7 161.4 261.4 167.2 264.1 C 173 266.8 179.6 275.5 179.2 280.9 C 178.7 286.2 167.7 292.4 164.7 296.1 C 161.7 299.8 161.8 300.7 161.3 303.1 C 160.8 305.6 161 308.5 161.8 310.9 C 162.6 313.2 164.3 315.7 166.1 317.3 C 168 318.9 170.7 320.2 173.1 320.7 C 175.6 321.2 178.5 321 180.9 320.2 C 183.2 319.4 182.2 323.7 187.3 315.9 C 192.4 308 212.4 287.4 211.6 273.3 C 210.9 259.1 195.8 238.7 182.7 230.9 C 169.6 223 148.1 221.9 133.1 226.1 C 118.1 230.4 102.1 243.4 92.9 256.4 C 83.6 269.4 78.2 288.3 77.5 304 C 76.7 319.8 81.4 337.1 88.3 351 C 95.2 364.8 107.3 377.2 118.7 387.2 C 130.2 397.1 143.5 404.6 157 410.5 C 170.6 416.4 184.7 420.8 199.9 422.4 C 215 424.1 233.2 423.1 247.9 420.4 C 262.6 417.8 276.3 412.5 288 406.6 C 299.7 400.8 313 389.1 318 385.6"/>
    <path stroke-width="10" d="M 638.8 444.1 C 641.9 448.7 649.8 463.5 657.5 472.2 C 665.2 480.9 674.8 488.3 684.9 496 C 695.1 503.7 707.9 512.1 718.4 518.3 C 728.9 524.5 739.4 528.1 747.9 533.3 C 756.4 538.5 762 542.9 769.5 549.7 C 776.9 556.5 784.1 566 792.9 574.2 C 801.7 582.4 811.5 591.6 822.3 599 C 833 606.5 843.5 615.9 857.4 619.1 C 871.3 622.2 891.7 623.2 905.7 617.8 C 919.7 612.4 935 600 941.5 586.8 C 948.1 573.6 950.2 550.7 945 538.5 C 939.8 526.3 917.3 518.1 910.3 513.5 C 903.3 508.9 905.5 511.2 903 511 C 900.5 510.9 897.6 511.4 895.3 512.6 C 893.1 513.7 890.9 515.6 889.5 517.7 C 888.1 519.8 887.2 522.5 887 525 C 886.9 527.5 887.4 530.4 888.6 532.7 C 889.7 534.9 889.4 535.3 893.7 538.5 C 898 541.7 911.9 546.5 914.4 551.8 C 917 557 912.7 565.2 908.9 570 C 905.2 574.7 898 578.7 892.1 580.1 C 886.2 581.6 880.5 581.9 873.7 578.9 C 866.9 576 858.4 568.7 851.1 562.4 C 843.9 556 837.2 549 830.2 540.9 C 823.1 532.8 817.4 522.9 808.8 513.6 C 800.1 504.4 788.5 493.4 778.5 485.6 C 768.4 477.7 757.2 472.6 748.6 466.5 C 740 460.3 734.1 455.4 726.8 448.5 C 719.5 441.6 713.7 432.8 704.7 425.1 C 695.7 417.4 678 406 672.7 402.2"/>
    <path stroke-width="10" d="M 327.3 402.2 C 322 406 304.3 417.4 295.3 425.1 C 286.3 432.8 280.5 441.6 273.2 448.5 C 265.9 455.4 260 460.3 251.4 466.5 C 242.8 472.6 231.6 477.7 221.5 485.6 C 211.5 493.4 199.9 504.4 191.2 513.6 C 182.6 522.9 176.9 532.8 169.8 540.9 C 162.8 549 156.1 556 148.9 562.4 C 141.6 568.7 133.1 576 126.3 578.9 C 119.5 581.9 113.8 581.6 107.9 580.1 C 102 578.7 94.8 574.7 91.1 570 C 87.3 565.2 83 557 85.6 551.8 C 88.1 546.5 102 541.7 106.3 538.5 C 110.6 535.3 110.3 534.9 111.4 532.7 C 112.6 530.4 113.1 527.5 113 525 C 112.8 522.5 111.9 519.8 110.5 517.7 C 109.1 515.6 106.9 513.7 104.7 512.6 C 102.4 511.4 99.5 510.9 97 511 C 94.5 511.2 96.7 508.9 89.7 513.5 C 82.7 518.1 60.2 526.3 55 538.5 C 49.8 550.7 51.9 573.6 58.5 586.8 C 65 600 80.3 612.4 94.3 617.8 C 108.3 623.2 128.7 622.2 142.6 619.1 C 156.5 615.9 167 606.5 177.7 599 C 188.5 591.6 198.3 582.4 207.1 574.2 C 215.9 566 223.1 556.5 230.5 549.7 C 238 542.9 243.6 538.5 252.1 533.3 C 260.6 528.1 271.1 524.5 281.6 518.3 C 292.1 512.1 304.9 503.7 315.1 496 C 325.2 488.3 334.8 480.9 342.5 472.2 C 350.2 463.5 358.1 448.7 361.2 444.1"/>
    <path stroke-width="10" d="M 578.8 483.7 C 580 489.7 582.1 507.6 586.2 519.4 C 590.2 531.1 597.1 542.7 603.1 554.4 C 609.1 566 615.8 578 622.4 589.3 C 628.9 600.5 635.9 611.3 642.4 622.1 C 649 632.8 655.2 642.9 661.7 653.8 C 668.3 664.6 674.5 676.2 681.9 687.2 C 689.3 698.2 697.3 709.3 706 719.8 C 714.7 730.3 722.5 741.5 734.3 750.2 C 746.1 758.9 761.4 769.5 777 772.2 C 792.6 775 815.2 775.1 828.1 766.4 C 841.1 757.8 854.7 734.9 854.6 720.6 C 854.5 706.2 833.1 687.9 827.6 680.4 C 822 673 823.6 676.8 821.2 675.9 C 818.9 675.1 816 674.8 813.5 675.2 C 811 675.6 808.4 676.8 806.4 678.4 C 804.5 680 802.8 682.4 801.9 684.8 C 801.1 687.1 800.8 690 801.2 692.5 C 801.6 695 801.1 695.3 804.4 699.6 C 807.8 703.9 820.5 712.5 821.3 718.4 C 822.1 724.3 815.2 732.5 809.4 734.9 C 803.5 737.4 793.9 736.1 786.3 733.4 C 778.8 730.6 771.3 725.7 764.1 718.7 C 756.9 711.8 749.8 701.2 743.3 691.8 C 736.8 682.3 730.7 672.3 724.9 661.8 C 719.2 651.3 714.4 640.1 708.9 628.8 C 703.4 617.6 697.4 605.6 691.8 594.3 C 686.2 582.9 680.4 571.9 675.2 560.9 C 670.1 549.9 665.3 539.3 660.7 528.1 C 656.1 516.9 653.7 505.7 647.7 493.7 C 641.7 481.8 628.4 462.6 624.5 456.4"/>
    <path stroke-width="10" d="M 375.5 456.4 C 371.6 462.6 358.3 481.8 352.3 493.7 C 346.3 505.7 343.9 516.9 339.3 528.1 C 334.7 539.3 329.9 549.9 324.8 560.9 C 319.6 571.9 313.8 582.9 308.2 594.3 C 302.6 605.6 296.6 617.6 291.1 628.8 C 285.6 640.1 280.8 651.3 275.1 661.8 C 269.3 672.3 263.2 682.3 256.7 691.8 C 250.2 701.2 243.1 711.8 235.9 718.7 C 228.7 725.7 221.2 730.6 213.7 733.4 C 206.1 736.1 196.5 737.4 190.6 734.9 C 184.8 732.5 177.9 724.3 178.7 718.4 C 179.5 712.5 192.2 703.9 195.6 699.6 C 198.9 695.3 198.4 695 198.8 692.5 C 199.2 690 198.9 687.1 198.1 684.8 C 197.2 682.4 195.5 680 193.6 678.4 C 191.6 676.8 189 675.6 186.5 675.2 C 184 674.8 181.1 675.1 178.8 675.9 C 176.4 676.8 178 673 172.4 680.4 C 166.9 687.9 145.5 706.2 145.4 720.6 C 145.3 734.9 158.9 757.8 171.9 766.4 C 184.8 775.1 207.4 775 223 772.2 C 238.6 769.5 253.9 758.9 265.7 750.2 C 277.5 741.5 285.3 730.3 294 719.8 C 302.7 709.3 310.7 698.2 318.1 687.2 C 325.5 676.2 331.7 664.6 338.3 653.8 C 344.8 642.9 351 632.8 357.6 622.1 C 364.1 611.3 371.1 600.5 377.6 589.3 C 384.2 578 390.9 566 396.9 554.4 C 402.9 542.7 409.8 531.1 413.8 519.4 C 417.9 507.6 420 489.7 421.2 483.7"/>
    <path stroke-width="10" d="M 509.3 499.8 C 509.2 506.1 507.6 525.9 508.6 538 C 509.6 550 513.5 561.2 515.1 572.1 C 516.7 583 517.7 592.3 518.1 603.6 C 518.5 614.9 517.1 627.1 517.5 639.8 C 518 652.5 518.9 666.8 520.6 679.9 C 522.3 692.9 524.1 705.2 527.7 718.2 C 531.4 731.2 535.8 745.5 542.5 757.9 C 549.1 770.2 556.6 782.7 567.7 792.3 C 578.8 802 594 812.8 609.2 815.9 C 624.4 819.1 646.3 819.3 658.8 811.1 C 671.4 802.9 684.8 780.7 684.4 766.7 C 684.1 752.8 662.5 734.7 656.7 727.5 C 651 720.3 652.5 724.2 650.1 723.6 C 647.7 722.9 644.7 722.8 642.3 723.5 C 639.9 724.1 637.3 725.5 635.5 727.3 C 633.7 729 632.2 731.5 631.6 733.9 C 630.9 736.3 630.8 739.3 631.5 741.7 C 632.1 744.1 632 744.9 635.3 748.5 C 638.6 752 650.4 758 651.3 763.2 C 652.2 768.3 646 776.9 640.6 779.3 C 635.2 781.6 625.7 779.8 618.9 777.1 C 612.1 774.4 605.4 769.7 599.7 763.1 C 594 756.5 588.3 746.7 584.5 737.5 C 580.7 728.4 578.5 718.8 576.7 708.4 C 574.9 697.9 574.1 685.8 573.7 674.8 C 573.3 663.8 573.4 653.8 574.2 642.4 C 574.9 630.9 577.4 619 578.1 606.1 C 578.7 593.2 578.7 578.2 578.1 565.1 C 577.5 551.9 577.2 539.8 574.4 527.3 C 571.6 514.8 563.5 496.5 561.3 490.3"/>
    <path stroke-width="10" d="M 438.7 490.3 C 436.5 496.5 428.4 514.8 425.6 527.3 C 422.8 539.8 422.5 551.9 421.9 565.1 C 421.3 578.2 421.3 593.2 421.9 606.1 C 422.6 619 425.1 630.9 425.8 642.4 C 426.6 653.8 426.7 663.8 426.3 674.8 C 425.9 685.8 425.1 697.9 423.3 708.4 C 421.5 718.8 419.3 728.4 415.5 737.5 C 411.7 746.7 406 756.5 400.3 763.1 C 394.6 769.7 387.9 774.4 381.1 777.1 C 374.3 779.8 364.8 781.6 359.4 779.3 C 354 776.9 347.8 768.3 348.7 763.2 C 349.6 758 361.4 752 364.7 748.5 C 368 744.9 367.9 744.1 368.5 741.7 C 369.2 739.3 369.1 736.3 368.4 733.9 C 367.8 731.5 366.3 729 364.5 727.3 C 362.7 725.5 360.1 724.1 357.7 723.5 C 355.3 722.8 352.3 722.9 349.9 723.6 C 347.5 724.2 349 720.3 343.3 727.5 C 337.5 734.7 315.9 752.8 315.6 766.7 C 315.2 780.7 328.6 802.9 341.2 811.1 C 353.7 819.3 375.6 819.1 390.8 815.9 C 406 812.8 421.2 802 432.3 792.3 C 443.4 782.7 450.9 770.2 457.5 757.9 C 464.2 745.5 468.6 731.2 472.3 718.2 C 475.9 705.2 477.7 692.9 479.4 679.9 C 481.1 666.8 482 652.5 482.5 639.8 C 482.9 627.1 481.5 614.9 481.9 603.6 C 482.3 592.3 483.3 583 484.9 572.1 C 486.5 561.2 490.4 550 491.4 538 C 492.4 525.9 490.8 506.1 490.7 499.8"/>
    <g stroke-width="6">
      <circle cx="818.9" cy="388.6" r="10"/>
      <circle cx="876.2" cy="356.3" r="10"/>
      <circle cx="899.1" cy="296" r="10"/>
      <circle cx="181.1" cy="388.6" r="10"/>
      <circle cx="123.8" cy="356.3" r="10"/>
      <circle cx="100.9" cy="296" r="10"/>
      <circle cx="751.4" cy="502.4" r="10"/>
      <circle cx="798.1" cy="542" r="10"/>
      <circle cx="842.1" cy="584.9" r="10"/>
      <circle cx="248.6" cy="502.4" r="10"/>
      <circle cx="201.9" cy="542" r="10"/>
      <circle cx="157.9" cy="584.9" r="10"/>
      <circle cx="659.7" cy="595" r="10"/>
      <circle cx="692.4" cy="654.7" r="10"/>
      <circle cx="729.2" cy="711.8" r="10"/>
      <circle cx="340.3" cy="595" r="10"/>
      <circle cx="307.6" cy="654.7" r="10"/>
      <circle cx="270.8" cy="711.8" r="10"/>
      <circle cx="546.8" cy="626.6" r="10"/>
      <circle cx="548.7" cy="691.8" r="10"/>
      <circle cx="566.8" cy="754.1" r="10"/>
      <circle cx="453.2" cy="626.6" r="10"/>
      <circle cx="451.3" cy="691.8" r="10"/>
      <circle cx="433.2" cy="754.1" r="10"/>
    </g>
    <!-- face and spots -->
    <circle cx="425" cy="300" r="50"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 398 305 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0 Z M 406.5 293.6 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0 Z"/>
    <circle cx="575" cy="300" r="50"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 542 305 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0 Z M 550.5 293.6 a 11 11 0 1 0 22 0 a 11 11 0 1 0 -22 0 Z"/>
    <circle cx="372" cy="382" r="22"/>
    <circle cx="628" cy="382" r="22"/>
    <path d="M 456 392 Q 500 436 544 392"/>
    <circle cx="560" cy="160" r="26"/>
    <circle cx="630" cy="210" r="16"/>
    <circle cx="470" cy="138" r="16"/>
    <path stroke-width="8" d="M 352 212 Q 368 160 412 132"/>
  </g>
</svg>
`,Oe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sea floor -->
    <path d="M -20 900 C 13.3 897.3 110 883.7 180 884 C 250 884.3 326.7 901.7 400 902 C 473.3 902.3 550 885.7 620 886 C 690 886.3 753.3 903.3 820 904 C 886.7 904.7 986.7 892.3 1020 890"/>
    <path d="M 862 903.1 C 861.5 900.1 860.1 890.5 859.2 885.1 C 858.3 879.6 857.4 875.4 856.5 870.6 C 855.7 865.8 854.8 861.1 854 856.4 C 853.2 851.8 852.5 847.3 851.9 842.7 C 851.3 838.2 850.7 833.6 850.4 829.4 C 850.1 825.2 849.8 821.6 850 817.6 C 850.2 813.6 850.7 809.7 851.4 805.5 C 852.1 801.2 853.1 796.7 854.1 792.1 C 855.2 787.4 856.5 782.6 857.6 777.5 C 858.7 772.5 859.9 767.3 860.7 761.7 C 861.5 756.2 862.3 750 862.2 744.1 C 862.2 738.2 861.4 732 860.4 726.4 C 859.4 720.8 857.9 715.7 856.4 710.6 C 854.8 705.5 853 700.7 851.2 695.8 C 849.4 691 847.3 686.2 845.4 681.7 C 843.5 677.1 841.2 671.3 839.8 668.4 C 838.5 665.4 838.5 665.1 837.4 664.1 C 836.2 663 834.4 662.2 832.9 662 C 831.3 661.9 829.4 662.3 828 663.1 C 826.7 663.8 825.3 665.3 824.7 666.7 C 824.1 668.1 823.9 668.2 824.2 671.6 C 824.4 675 825.6 682.1 826.3 687.1 C 827 692.1 827.8 696.9 828.4 701.7 C 829 706.5 829.7 711.3 830 716 C 830.4 720.6 830.7 725.4 830.6 729.6 C 830.5 733.9 830.2 737.8 829.5 741.7 C 828.7 745.7 827.5 749.3 826.2 753.5 C 824.9 757.6 823.1 761.9 821.4 766.4 C 819.7 770.9 817.7 775.4 815.9 780.3 C 814.1 785.2 812.2 790.2 810.7 795.6 C 809.1 801.1 807.6 807 806.8 812.8 C 805.9 818.7 805.6 825 805.5 830.8 C 805.4 836.5 805.8 841.8 806.1 847.2 C 806.5 852.6 807 857.9 807.6 863.1 C 808.2 868.3 808.9 873.4 809.7 878.4 C 810.4 883.4 811.3 889.1 812 893.3 C 812.8 897.6 813.7 902.1 814 903.9"/>
    <path d="M 933 898.1 C 933.3 897.2 934 895.4 934.7 892.5 C 935.3 889.6 936.2 884.8 936.9 880.9 C 937.5 877 938.2 873 938.8 869 C 939.4 864.9 940 860.8 940.4 856.6 C 940.8 852.4 941.2 848.2 941.4 843.8 C 941.5 839.3 941.7 834.8 941.2 830 C 940.7 825.2 939.7 819.8 938.5 815.1 C 937.3 810.5 935.6 806.1 934 802.1 C 932.4 798 930.5 794.5 928.9 791 C 927.3 787.5 925.7 784.2 924.4 781.1 C 923 778 921.9 775.3 921.1 772.4 C 920.4 769.6 920 767.2 919.9 764.2 C 919.7 761.1 919.9 757.7 920.2 754.2 C 920.5 750.7 921 747.1 921.6 743.4 C 922.1 739.7 922.9 736.1 923.6 732.2 C 924.3 728.2 925.5 722.8 925.8 719.9 C 926.1 717 926 716.4 925.4 715 C 924.8 713.5 923.5 712 922.2 711.2 C 920.9 710.4 919 709.9 917.4 710 C 915.8 710.1 914 710.9 912.8 711.9 C 911.6 712.9 911.5 713.7 910.2 716.1 C 909 718.5 907.1 722.6 905.4 726.1 C 903.8 729.6 902 733.3 900.4 737.1 C 898.8 740.9 897.2 744.7 895.9 748.9 C 894.6 753 893.3 757.3 892.6 761.9 C 891.9 766.6 891.5 772.1 891.8 776.9 C 892 781.7 893.1 786.6 894.1 790.9 C 895 795.3 896.3 799.2 897.4 803 C 898.4 806.8 899.6 810.4 900.4 813.8 C 901.3 817.1 902 820.2 902.4 823.1 C 902.8 826 902.9 828.3 902.9 831.3 C 902.8 834.3 902.4 837.6 902 840.9 C 901.6 844.2 901 847.7 900.4 851.2 C 899.8 854.7 899.1 858.3 898.3 861.9 C 897.6 865.5 896.8 869.2 896 872.9 C 895.3 876.6 894.5 879.4 893.6 884.2 C 892.8 888.9 891.4 898.5 891 901.4"/>
    <ellipse cx="250" cy="940" rx="40" ry="22"/>
    <ellipse cx="760" cy="942" rx="34" ry="19"/>
    <ellipse cx="520" cy="948" rx="22" ry="14"/>
    <!-- bubbles -->
    <circle cx="905" cy="250" r="22"/>
    <circle cx="935" cy="165" r="28"/>
    <circle cx="900" cy="80" r="18"/>
    <circle cx="90" cy="150" r="26"/>
    <circle cx="150" cy="80" r="16"/>
    <!-- turtle -->
    <g transform="translate(-25 -40) scale(1.05)">
    <path stroke-width="10" d="M 687.3 441.1 C 695.3 437.2 719.9 431.5 735 418 C 750.1 404.5 759.7 373.7 778 360 C 796.3 346.3 823.8 335.7 845 336 C 866.2 336.3 890.8 347.2 905 362 C 919.2 376.8 927.8 403.3 930 425 C 932.2 446.7 928 474.2 918 492 C 908 509.8 889.7 523.2 870 532 C 850.3 540.8 820 543.7 800 545 C 780 546.3 765.5 543.2 750 540 C 734.5 536.8 714.3 528 707.2 525.6"/>
    <path stroke-width="10" d="M 655 606.7 C 658.3 617.6 674.2 648.5 675 672 C 675.8 695.5 671.5 724.7 660 748 C 648.5 771.3 629.3 794.7 606 812 C 582.7 829.3 543.3 844.7 520 852 C 496.7 859.3 473.3 861 466 856 C 458.7 851 467.3 836 476 822 C 484.7 808 506.3 791.7 518 772 C 529.7 752.3 541.5 728.9 546 704 C 550.5 679.1 545.2 636.4 545 622.9"/>
    <path stroke-width="10" d="M 290 619.2 C 290 627 295.3 650.2 290 666 C 284.7 681.8 274.3 701.3 258 714 C 241.7 726.7 215.3 737 192 742 C 168.7 747 133.3 747.3 118 744 C 102.7 740.7 96.3 731 100 722 C 103.7 713 126.7 702 140 690 C 153.3 678 171.7 665 180 650 C 188.3 635 188.3 608.1 190 599.7"/>
    <path stroke-width="10" d="M 150 590 C 154.3 571.7 159.3 515 176 480 C 192.7 445 219.3 408 250 380 C 280.7 352 323.3 326.7 360 312 C 396.7 297.3 433.3 291 470 292 C 506.7 293 548.3 301.3 580 318 C 611.7 334.7 640 365 660 392 C 680 419 691.3 447 700 480 C 708.7 513 710 571.7 712 590 C 693.3 594.7 647 612 600 618 C 553 624 483.3 626 430 626 C 376.7 626 326.7 624 280 618 C 233.3 612 171.7 594.7 150 590 Z"/>
    <path d="M 158.6 540 C 182.2 544.3 254.8 560.3 300 566 C 345.2 571.7 383.3 574 430 574 C 476.7 574 533.6 571.7 580 566 C 626.4 560.3 687.1 544.3 708.5 540"/>
    <path d="M 232 554.6 L 232 609.5 M 318 568.1 L 318 622 M 405 573.8 L 405 625.8 M 492 572.7 L 492 625.1 M 578 566.2 L 578 620.4 M 650 553.3 L 650 608"/>
    <path d="M 352 438 C 356 432.5 396 377.5 400 372 C 408.3 371 491.7 361 500 360 C 506.2 363.8 568.8 401.2 575 405 C 573.8 411.9 561.2 481.1 560 488 C 552.5 490 477.5 510 470 512 C 462.5 511 387.5 501 380 500 C 377.7 494.8 354.3 443.2 352 438 Z"/>
    <path d="M 352 438 L 204 432.5 M 400 372 L 332.6 324.4 M 500 360 L 519.3 297.5 M 575 405 L 678.1 420.9 M 560 488 L 599.2 563.2 M 380 500 L 329.6 569.3"/>
    <!-- face -->
    <circle cx="840" cy="425" r="42"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 820.1 428.4 a 25 25 0 1 0 50 0 a 25 25 0 1 0 -50 0 Z M 827.4 418.9 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0 Z"/>
    <circle cx="785" cy="485" r="18"/>
    <path d="M 838 492 Q 875 522 908 486"/>
    <!-- spots -->
    <g stroke-width="7">
      <circle cx="600" cy="740" r="16"/>
      <circle cx="560" cy="800" r="12"/>
      <circle cx="625" cy="680" r="12"/>
      <circle cx="225" cy="700" r="13"/>
      <circle cx="170" cy="725" r="10"/>
    </g>
    </g>
  </g>
</svg>
`,ke=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(-30 52) scale(1.06)">
      <!-- whale -->
      <path stroke-width="14" d="M 139 578 C 139.5 563.3 131.8 518.8 142 490 C 152.2 461.2 173.7 428 200 405 C 226.3 382 263.3 363.5 300 352 C 336.7 340.5 380 336 420 336 C 460 336 505 341.3 540 352 C 575 362.7 603.3 382.8 630 400 C 656.7 417.2 682 449.7 700 455 C 718 460.3 727.7 445.8 738 432 C 748.3 418.2 758 382 762 372 C 755.3 367.5 735 357 722 345 C 709 333 694 315.8 684 300 C 674 284.2 665.7 258.3 662 250 C 670.3 251.3 695.3 253 712 258 C 728.7 263 747.8 271.3 762 280 C 776.2 288.7 791.2 305 797 310 C 802.8 305 817.8 288.7 832 280 C 846.2 271.3 865.3 263 882 258 C 898.7 253 923.7 251.3 932 250 C 928.3 258.3 920 284.2 910 300 C 900 315.8 885 333 872 345 C 859 357 838.7 367.5 832 372 C 833.7 385.3 848 416.5 842 452 C 836 487.5 815 550 796 585 C 777 620 760.7 639.8 728 662 C 695.3 684.2 646.3 705.7 600 718 C 553.7 730.3 498.3 735.3 450 736 C 401.7 736.7 349.2 729.7 310 722 C 270.8 714.3 243.5 714 215 690 C 186.5 666 151.7 596.7 139 578 Z"/>
      <path d="M 762 372 C 767.8 374 785.3 384 797 384 C 808.7 384 826.2 374 832 372"/>
      <path d="M 139 578 C 149.2 584.7 171.5 606 200 618 C 228.5 630 266.7 642 310 650 C 353.3 658 408.3 666 460 666 C 511.7 666 576.3 660.3 620 650 C 663.7 639.7 692.7 614.8 722 604 C 751.3 593.2 783.7 588.2 796 585"/>
      <!-- face -->
      <circle cx="278" cy="478" r="56"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 238.1 482.6 a 33 33 0 1 0 66 0 a 33 33 0 1 0 -66 0 Z M 247.6 470.1 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0 Z"/>
      <circle cx="356" cy="572" r="22"/>
      <path d="M 170 548 Q 220 600 272 560"/>
      <!-- water spout and drops -->
      <path stroke-width="12" d="M 384 318 C 385 311.3 389.7 291 390 278 C 390.3 265 390.7 252 386 240 C 381.3 228 373.3 214 362 206 C 350.7 198 333.3 192 318 192 C 302.7 192 283 196.3 270 206 C 257 215.7 245 242.7 240 250 C 240.7 241 235.7 212.7 244 196 C 252.3 179.3 272.7 161.7 290 150 C 307.3 138.3 329.7 131.3 348 126 C 366.3 120.7 382.7 118 400 118 C 417.3 118 433.7 120.7 452 126 C 470.3 131.3 492.7 138.3 510 150 C 527.3 161.7 547.7 179.3 556 196 C 564.3 212.7 559.3 241 560 250 C 555 242.7 543 215.7 530 206 C 517 196.3 497.3 192 482 192 C 466.7 192 449.3 198 438 206 C 426.7 214 418.7 228 414 240 C 409.3 252 409.7 265 410 278 C 410.3 291 415 311.3 416 318 C 410.7 318 389.3 318 384 318 Z"/>
      <path stroke-width="12" d="M 232 286 C 218 308 212 330 232 334 C 252 330 246 308 232 286 Z"/>
      <path stroke-width="12" d="M 568 286 C 554 308 548 330 568 334 C 588 330 582 308 568 286 Z"/>
    </g>
    <!-- sea -->
    <path stroke-width="14" d="M -30 895 Q 20 865 70 895 T 170 895 T 270 895 T 370 895 T 470 895 T 570 895 T 670 895 T 770 895 T 870 895 T 970 895 T 1070 895"/>
  </g>
</svg>
`,Ae=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- antennae -->
    <path stroke-width="12" d="M 458.3 247.4 C 458 246.7 457.5 245.9 456.8 243.5 C 456.1 241.1 455.1 236.7 454.1 233.2 C 453.2 229.8 452.3 226.3 451.3 222.7 C 450.3 219.2 449.2 215.7 448 212.1 C 446.8 208.5 445.6 204.8 443.9 201 C 442.3 197.3 440.2 193.1 438.2 189.6 C 436.1 186 434 182.8 431.8 179.7 C 429.6 176.5 427.4 173.5 425.1 170.5 C 422.9 167.6 422.5 165.6 418.5 162 C 414.5 158.5 404 151.3 401.2 149.1 M 421.8 255.9 C 421.8 255.3 422.3 254.6 421.9 252.3 C 421.4 250.1 420.2 245.6 419.3 242.4 C 418.5 239.1 417.6 235.9 416.7 232.7 C 415.8 229.6 414.8 226.4 413.8 223.4 C 412.8 220.4 411.8 217.5 410.7 214.9 C 409.6 212.3 408.5 210.2 407.1 207.8 C 405.7 205.3 403.9 202.7 402.2 200.1 C 400.4 197.5 398.5 195 396.5 192.4 C 394.6 189.8 393 188.4 390.3 184.5 C 387.7 180.5 382.2 171.5 380.6 168.8"/>
    <circle stroke-width="14" cx="365" cy="132" r="40"/>
    <path stroke-width="12" d="M 578.2 255.9 C 578.2 255.3 577.7 254.6 578.1 252.3 C 578.6 250.1 579.8 245.6 580.7 242.4 C 581.5 239.1 582.4 235.9 583.3 232.7 C 584.2 229.6 585.2 226.4 586.2 223.4 C 587.2 220.4 588.2 217.5 589.3 214.9 C 590.4 212.3 591.5 210.2 592.9 207.8 C 594.3 205.3 596.1 202.7 597.8 200.1 C 599.6 197.5 601.5 195 603.5 192.4 C 605.4 189.8 607 188.4 609.7 184.5 C 612.3 180.5 617.8 171.5 619.4 168.8 M 541.7 247.4 C 542 246.7 542.5 245.9 543.2 243.5 C 543.9 241.1 544.9 236.7 545.9 233.2 C 546.8 229.8 547.7 226.3 548.7 222.7 C 549.7 219.2 550.8 215.7 552 212.1 C 553.2 208.5 554.4 204.8 556.1 201 C 557.7 197.3 559.8 193.1 561.8 189.6 C 563.9 186 566 182.8 568.2 179.7 C 570.4 176.5 572.6 173.5 574.9 170.5 C 577.1 167.6 577.5 165.6 581.5 162 C 585.5 158.5 596 151.3 598.8 149.1"/>
    <circle stroke-width="14" cx="635" cy="132" r="40"/>
    <!-- arms and feet -->
    <path stroke-width="14" d="M 290.6 529.6 C 290 528.2 290.2 523.8 286.8 520.8 C 283.5 517.8 274.8 514.7 270.3 511.7 C 265.9 508.7 263.4 506.8 259.9 502.9 C 256.3 499.1 252.6 493.7 249.2 488.4 C 245.9 483.1 242.4 476.9 239.7 471.3 C 236.9 465.7 234.4 460.5 232.6 454.9 C 230.9 449.3 230.2 444.4 229.2 437.6 C 228.2 430.8 228.1 420.3 226.7 414 C 225.3 407.8 223.9 404 220.9 400.2 C 217.9 396.4 213.4 393 208.9 391.1 C 204.4 389.3 198.8 388.6 194 389.3 C 189.2 389.9 184 392.1 180.2 395.1 C 176.4 398.1 173 402.6 171.1 407.1 C 169.3 411.6 169.4 415.9 169.3 422 C 169.2 428.1 169.6 435.5 170.5 443.7 C 171.5 451.8 172.6 462.2 174.8 471.1 C 177.1 480 180.8 488.8 184.3 497 C 187.8 505.1 191.5 512.4 195.9 520 C 200.4 527.7 204.7 535.4 211.1 542.8 C 217.5 550.2 226.5 558.5 234.1 564.5 C 241.7 570.4 248 574.4 256.8 578.4 C 265.5 582.4 281.7 586.9 286.7 588.6"/>
    <path stroke-width="14" d="M 377 789.9 C 374.2 797 358.8 819.3 360 832 C 361.2 844.7 368.7 860 384 866 C 399.3 872 435.7 872 452 868 C 468.3 864 478.3 852.1 482 842 C 485.7 831.9 475.3 813.1 473.9 807.3"/>
    <path stroke-width="14" d="M 713.3 588.6 C 718.3 586.9 734.5 582.4 743.2 578.4 C 752 574.4 758.3 570.4 765.9 564.5 C 773.5 558.5 782.5 550.2 788.9 542.8 C 795.3 535.4 799.6 527.7 804.1 520 C 808.5 512.4 812.2 505.1 815.7 497 C 819.2 488.8 822.9 480 825.2 471.1 C 827.4 462.2 828.5 451.8 829.5 443.7 C 830.4 435.5 830.8 428.1 830.7 422 C 830.6 415.9 830.7 411.6 828.9 407.1 C 827 402.6 823.6 398.1 819.8 395.1 C 816 392.1 810.8 389.9 806 389.3 C 801.2 388.6 795.6 389.3 791.1 391.1 C 786.6 393 782.1 396.4 779.1 400.2 C 776.1 404 774.7 407.8 773.3 414 C 771.9 420.3 771.8 430.8 770.8 437.6 C 769.8 444.4 769.1 449.3 767.4 454.9 C 765.6 460.5 763.1 465.7 760.3 471.3 C 757.6 476.9 754.1 483.1 750.8 488.4 C 747.4 493.7 743.7 499.1 740.1 502.9 C 736.6 506.8 734.1 508.7 729.7 511.7 C 725.2 514.7 716.5 517.8 713.2 520.8 C 709.8 523.8 710 528.2 709.4 529.6"/>
    <path stroke-width="14" d="M 623 789.9 C 625.8 797 641.2 819.3 640 832 C 638.8 844.7 631.3 860 616 866 C 600.7 872 564.3 872 548 868 C 531.7 864 521.7 852.1 518 842 C 514.3 831.9 524.7 813.1 526.1 807.3"/>
    <!-- body and face -->
    <path stroke-width="14" d="M 500 245 C 529.3 245 562.7 247.8 588 260 C 613.3 272.2 635 291.3 652 318 C 669 344.7 680 379.7 690 420 C 700 460.3 709.3 515 712 560 C 714.7 605 715.3 654.7 706 690 C 696.7 725.3 680 753 656 772 C 632 791 598.3 798.7 562 804 C 525.7 809.3 474.3 809.3 438 804 C 401.7 798.7 368 791 344 772 C 320 753 303.3 725.3 294 690 C 284.7 654.7 285.3 605 288 560 C 290.7 515 300 460.3 310 420 C 320 379.7 331 344.7 348 318 C 365 291.3 386.7 272.2 412 260 C 437.3 247.8 470.7 245 500 245 Z"/>
    <circle cx="428" cy="428" r="62"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 397.2 434.5 a 36 36 0 1 0 72 0 a 36 36 0 1 0 -72 0 Z M 407.6 420.8 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z"/>
    <circle cx="572" cy="428" r="62"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 530.8 434.5 a 36 36 0 1 0 72 0 a 36 36 0 1 0 -72 0 Z M 541.2 420.8 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0 Z"/>
    <path d="M 428 572 Q 500 586 572 572 Q 560 652 500 654 Q 440 652 428 572 Z"/>
    <circle cx="368" cy="560" r="24"/>
    <circle cx="632" cy="560" r="24"/>
    <ellipse cx="500" cy="722" rx="86" ry="46"/>
    <circle cx="462" cy="314" r="20"/>
    <circle cx="548" cy="300" r="14"/>
  </g>
</svg>
`,M=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="rotate(-14 500 520)">
      <!-- astronaut -->
      <path stroke-width="10" d="M 410 539.7 C 407.9 538.6 401.7 535.3 397.1 533 C 392.5 530.7 386.8 528.2 382.6 525.9 C 378.4 523.5 375.7 521.9 372 518.9 C 368.3 516 364 511.9 360.2 508.1 C 356.4 504.3 352.6 500.2 349.2 496.2 C 345.8 492.2 342.5 487.8 339.8 483.9 C 337.1 479.9 335.1 476.8 333.1 472.5 C 331.2 468.3 329.7 463.5 328.1 458.4 C 326.5 453.2 325.3 447.9 323.8 441.7 C 322.2 435.5 321 427.1 318.8 421.4 C 316.6 415.6 314.2 410.8 310.4 407.1 C 306.5 403.4 301.1 400.3 295.9 399 C 290.8 397.7 284.5 397.7 279.4 399.2 C 274.2 400.6 268.8 403.8 265.1 407.6 C 261.4 411.5 258.3 416.9 257 422.1 C 255.7 427.2 256.6 433.1 257.2 438.6 C 257.8 444.2 259.3 449.3 260.6 455.5 C 262 461.7 263.3 468.8 265.3 475.9 C 267.3 483 269.3 490.6 272.4 497.9 C 275.6 505.2 279.9 513.2 284.1 520 C 288.2 526.7 292.6 532.6 297.2 538.4 C 301.8 544.2 306.5 549.7 311.6 555.1 C 316.6 560.4 321.3 565.4 327.3 570.5 C 333.4 575.5 341.3 581.1 348 585.3 C 354.7 589.5 359.6 592.7 367.4 595.7 C 375.2 598.8 390.3 602.3 394.9 603.7"/>
      <path stroke-width="7" d="M 334.3 474.9 L 274.5 502.5"/>
      <path stroke-width="7" d="M 328.1 458.4 L 265.3 475.9"/>
      <path stroke-width="10" d="M 605.1 605.1 C 605.6 606 605.1 609 608 610.7 C 610.9 612.3 618.2 613.4 622.6 614.8 C 627 616.2 630.4 617.4 634.3 619.2 C 638.1 621 641.8 623.3 645.7 625.8 C 649.5 628.3 653.7 631.3 657.6 634.3 C 661.4 637.2 665.4 640.6 668.8 643.7 C 672.3 646.9 675.4 649.8 678.3 653.2 C 681.3 656.6 683.8 660.2 686.6 664.2 C 689.5 668.3 692.2 672.7 695.3 677.6 C 698.4 682.5 701.5 689 705.2 693.5 C 708.9 698 712.8 702.1 717.5 704.5 C 722.3 707 728.4 708.2 733.7 708 C 739.1 707.7 745 705.7 749.5 702.8 C 753.9 699.9 758.1 695.2 760.5 690.5 C 763 685.7 764.2 679.6 764 674.3 C 763.7 668.9 761 663.5 758.8 658.5 C 756.6 653.6 753.8 649.6 750.8 644.6 C 747.9 639.6 744.8 634 741.2 628.5 C 737.5 622.9 733.5 616.8 729.1 611.3 C 724.7 605.9 719.5 600.5 714.7 595.7 C 709.8 590.8 704.9 586.5 699.8 582.2 C 694.7 578 689.5 573.9 683.8 570 C 678.1 566 672 561.9 665.5 558.6 C 659.1 555.2 651.6 552.2 645.1 549.8 C 638.6 547.3 635.3 544.4 626.5 543.8 C 617.6 543.1 597.9 545.6 592.2 546"/>
      <path stroke-width="7" d="M 676.7 651.4 L 726.3 607.9"/>
      <path stroke-width="7" d="M 686.6 664.2 L 741.2 628.5"/>
      <path stroke-width="10" d="M 413.9 672.8 C 413.4 675.7 412 684.9 411.2 690.1 C 410.4 695.3 409.8 699.4 409 704 C 408.3 708.6 407.5 713.2 406.7 717.6 C 405.9 722 405 726.5 404.1 730.6 C 403.2 734.8 402.4 738.5 401.3 742.4 C 400.2 746.4 398.9 750.3 397.5 754.4 C 396.2 758.5 394.6 762.8 393.1 767 C 391.5 771.3 389.8 775.6 388.1 780 C 386.4 784.3 384.7 788.6 382.9 793.2 C 381.1 797.7 378.6 802 377.3 807.4 C 376.1 812.8 374.5 819.7 375.4 825.4 C 376.3 831.2 379.1 837.5 382.8 842 C 386.4 846.5 392 850.6 397.4 852.7 C 402.9 854.8 409.7 855.5 415.4 854.6 C 421.2 853.7 427.5 850.9 432 847.2 C 436.5 843.6 440 837.1 442.7 832.6 C 445.3 828.1 446.1 824.4 448 820.1 C 449.8 815.8 451.8 811.2 453.7 806.6 C 455.6 802.1 457.6 797.5 459.5 792.7 C 461.3 788 463.2 783.3 465 778.3 C 466.9 773.3 468.7 768.2 470.3 762.9 C 471.9 757.7 473.4 752 474.7 746.8 C 476 741.6 477.1 736.6 478.1 731.6 C 479.2 726.6 480.2 721.7 481.1 716.8 C 482.1 711.9 482.9 706.9 483.8 702.3 C 484.7 697.7 485.9 691.4 486.3 689.2"/>
      <path stroke-width="7" d="M 393.1 767 L 459.5 792.7"/>
      <path stroke-width="10" d="M 516.6 688.9 C 517.3 691.6 519.2 700.4 520.6 705.4 C 521.9 710.5 523.3 714.5 524.8 719.1 C 526.2 723.8 527.7 728.5 529.4 733.3 C 531 738 532.7 742.9 534.7 747.9 C 536.7 752.9 538.9 758.2 541.4 763.3 C 544 768.4 547.1 773.8 549.9 778.5 C 552.7 783.2 555.6 787.4 558.4 791.5 C 561.3 795.7 564.1 799.7 567 803.7 C 569.8 807.6 572.8 811.6 575.4 815.2 C 578.1 818.8 579.3 821.6 582.8 825.3 C 586.2 828.9 591.1 834.7 596.3 837.3 C 601.5 839.9 608.2 841.3 614.1 840.9 C 619.9 840.6 626.4 838.4 631.3 835.2 C 636.1 832 640.7 826.9 643.3 821.7 C 645.9 816.5 647.3 809.8 646.9 803.9 C 646.6 798.1 643.6 791.7 641.2 786.7 C 638.8 781.8 635.3 778 632.6 774.1 C 629.8 770.1 627.3 766.6 624.9 762.9 C 622.4 759.3 620 755.7 617.7 752.1 C 615.4 748.6 613.2 745 611.3 741.7 C 609.5 738.4 608 735.7 606.5 732.5 C 605 729.3 603.7 725.9 602.4 722.3 C 601.1 718.7 599.8 714.7 598.6 710.7 C 597.3 706.7 596.1 702.5 594.9 698.2 C 593.7 694 592.6 689.5 591.3 685.2 C 590.1 680.9 588.3 674.5 587.6 672.3"/>
      <path stroke-width="7" d="M 558.4 791.5 L 617.7 752.1"/>
      <path stroke-width="10" d="M 414 528 C 411 538.3 399 566.7 396 590 C 393 613.3 396 655 396 668 C 413.3 671.7 465.3 690 500 690 C 534.7 690 586.7 671.7 604 668 C 604 655 607 613.3 604 590 C 601 566.7 589 538.3 586 528"/>
      <path stroke-width="10" d="M 416.3 464 C 415.9 470 415.4 489.3 414 500 C 412.6 510.7 409 523.3 408 528 C 438.7 528 561.3 528 592 528 C 591 523.3 587.4 510.7 586 500 C 584.6 489.3 584.1 470 583.7 464"/>
      <path stroke-width="7" d="M 396 650 L 604 650"/>
      <rect stroke-width="7" x="448" y="556" width="104" height="70" rx="14"/>
      <circle stroke-width="7" cx="476" cy="591" r="13"/>
      <circle stroke-width="7" cx="524" cy="591" r="13"/>
      <path stroke-width="7" d="M 511.1 172.4 C 511.1 172 511 171.2 511 170.2 C 511 169.2 511 167.7 511 166.4 C 511 165.1 511 163.9 511 162.6 C 511 161.3 511 160.1 511 158.8 C 511 157.5 511 156.3 511 155 C 511 153.7 511 152.5 511 151.2 C 511 149.9 511 148.7 511 147.4 C 511 146.1 511 144.9 511 143.6 C 511 142.3 510.9 140.9 511 139.8 C 511.1 138.7 511.4 137.3 511.5 136.8 M 488.9 172.4 C 488.9 172 489 171.2 489 170.2 C 489 169.2 489 167.7 489 166.4 C 489 165.1 489 163.9 489 162.6 C 489 161.3 489 160.1 489 158.8 C 489 157.5 489 156.3 489 155 C 489 153.7 489 152.5 489 151.2 C 489 149.9 489 148.7 489 147.4 C 489 146.1 489 144.9 489 143.6 C 489 142.3 489.1 140.9 489 139.8 C 488.9 138.7 488.6 137.3 488.5 136.8"/>
      <circle stroke-width="10" cx="500" cy="118" r="22"/>
      <path stroke-width="10" d="M 355.7 394.3 C 352.3 395.8 343.2 413.9 335.6 403.2 C 328 392.5 310 354.4 310 330 C 310 305.6 328 267.5 335.6 256.8 C 343.2 246.1 352.3 264.2 355.7 265.7"/>
      <path stroke-width="10" d="M 644.3 394.3 C 647.7 395.8 656.8 413.9 664.4 403.2 C 672 392.5 690 354.4 690 330 C 690 305.6 672 267.5 664.4 256.8 C 656.8 246.1 647.7 264.2 644.3 265.7"/>
      <circle stroke-width="10" cx="500" cy="330" r="158"/>
      <path stroke-width="10" d="M 500 252 C 529.3 252 567.3 250.3 588 262 C 608.7 273.7 619.7 300.3 624 322 C 628.3 343.7 634.7 374 614 392 C 593.3 410 538 430 500 430 C 462 430 406.7 410 386 392 C 365.3 374 371.7 343.7 376 322 C 380.3 300.3 391.3 273.7 412 262 C 432.7 250.3 470.7 252 500 252 Z"/>
      <circle cx="456" cy="330" r="32" stroke-width="7"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 440.8 332.8 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0 Z M 444.5 326 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
      <circle cx="544" cy="330" r="32" stroke-width="7"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 523.2 332.8 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0 Z M 526.9 326 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
      <path stroke-width="7" d="M 470 380 Q 500 404 530 380"/>
      <circle stroke-width="7" cx="420" cy="374" r="13"/>
      <circle stroke-width="7" cx="580" cy="374" r="13"/>
    </g>
    <!-- planets and stars -->
    <path stroke-width="10" d="M 257.9 847.7 C 257.2 849.2 255.1 853.8 253.5 856.6 C 251.8 859.4 249.9 862.2 247.9 864.8 C 245.8 867.4 243.6 869.9 241.2 872.2 C 238.9 874.5 236.4 876.7 233.7 878.7 C 231.1 880.7 228.3 882.5 225.4 884.2 C 222.5 885.8 219.5 887.2 216.4 888.5 C 213.4 889.7 210.2 890.8 207 891.6 C 203.8 892.4 200.5 893 197.2 893.4 C 193.9 893.8 190.6 894 187.3 894 C 184 894 180.7 893.7 177.4 893.3 C 174.1 892.8 170.8 892.1 167.7 891.2 C 164.5 890.3 161.3 889.2 158.3 887.9 C 155.2 886.7 152.4 885.3 149.4 883.5 C 146.4 881.7 141.7 878.1 140.2 877.1"/>
    <path stroke-width="10" d="M 121.7 855.2 C 121 853.7 118.7 849.3 117.4 846.2 C 116.2 843.2 115.2 840 114.4 836.8 C 113.5 833.6 112.9 830.3 112.5 827 C 112.1 823.7 112 820.4 112 817.1 C 112 813.8 112.3 810.5 112.8 807.2 C 113.2 803.9 113.9 800.6 114.8 797.5 C 115.7 794.3 116.8 791.1 118.1 788.1 C 119.4 785 120.9 782.1 122.6 779.2 C 124.3 776.4 126.2 773.6 128.3 771 C 130.3 768.4 132.5 765.9 134.9 763.6 C 137.3 761.3 139.8 759.1 142.5 757.2 C 145.1 755.2 147.9 753.4 150.8 751.7 C 153.7 750.1 156.7 748.7 159.8 747.4 C 162.8 746.2 166 745.2 169.2 744.4 C 172.4 743.5 175.7 742.9 179 742.5 C 182.3 742.1 185.6 742 188.9 742 C 192.2 742 195.5 742.3 198.8 742.8 C 202.1 743.2 205.4 743.9 208.5 744.8 C 211.7 745.7 214.9 746.8 217.9 748.1 C 221 749.4 223.9 750.9 226.8 752.6 C 229.6 754.3 232.4 756.2 235 758.3 C 237.6 760.3 240.1 762.5 242.4 764.9 C 244.7 767.3 246.9 769.8 248.8 772.5 C 250.8 775.1 252.6 777.9 254.3 780.8 C 255.9 783.7 257.3 786.7 258.6 789.8 C 259.8 792.8 260.8 796 261.6 799.2 C 262.5 802.4 263.1 805.5 263.5 809 C 263.9 812.4 263.9 818 264 819.8"/>
    <path stroke-width="10" d="M 235.8 758.9 C 238.7 758.7 247.6 758 253.2 757.8 C 258.8 757.5 264.2 757.5 269.4 757.6 C 274.6 757.7 279.6 758.1 284.3 758.5 C 288.9 759 293.4 759.6 297.5 760.4 C 301.6 761.2 305.4 762.2 308.8 763.3 C 312.2 764.5 315.4 765.8 318.1 767.2 C 320.8 768.6 323.2 770.2 325.1 771.9 C 327.1 773.6 328.7 775.4 329.8 777.4 C 331 779.3 331.7 781.4 332.1 783.6 C 332.4 785.7 332.4 788 331.9 790.4 C 331.4 792.7 330.5 795.1 329.2 797.6 C 327.9 800.1 326.2 802.6 324.2 805.2 C 322.1 807.8 319.6 810.4 316.8 813 C 313.9 815.7 310.7 818.3 307.1 820.9 C 303.6 823.6 299.7 826.2 295.5 828.8 C 291.3 831.4 286.8 834 282 836.5 C 277.3 839 272.2 841.4 266.9 843.8 C 261.7 846.2 256.1 848.5 250.5 850.7 C 244.8 852.9 238.9 855.1 233 857.1 C 227 859.1 220.9 861 214.7 862.8 C 208.5 864.5 202.2 866.2 195.9 867.7 C 189.7 869.2 183.3 870.6 177.1 871.8 C 170.8 873 164.5 874 158.4 874.9 C 152.2 875.8 146.1 876.5 140.2 877.1 C 134.3 877.6 128.4 878 122.8 878.2 C 117.2 878.5 111.8 878.5 106.6 878.4 C 101.4 878.3 96.4 877.9 91.7 877.5 C 87.1 877 82.6 876.4 78.5 875.6 C 74.4 874.8 70.6 873.8 67.2 872.7 C 63.8 871.5 60.6 870.2 57.9 868.8 C 55.2 867.4 52.8 865.8 50.9 864.1 C 48.9 862.4 47.3 860.6 46.2 858.6 C 45 856.7 44.3 854.6 43.9 852.4 C 43.6 850.3 43.6 848 44.1 845.6 C 44.6 843.3 45.5 840.9 46.8 838.4 C 48.1 835.9 49.8 833.4 51.8 830.8 C 53.9 828.2 56.4 825.6 59.2 823 C 62.1 820.3 65.3 817.7 68.9 815.1 C 72.4 812.4 76.3 809.8 80.5 807.2 C 84.7 804.6 89.2 802 94 799.5 C 98.7 797 105.1 794 109.1 792.2 C 113.1 790.3 116.6 788.9 118.1 788.3"/>
    <path stroke-width="10" d="M 254.3 780.8 C 255.9 780.8 261.2 780.8 264.3 781 C 267.4 781.1 270.4 781.4 273.1 781.8 C 275.7 782.1 278.2 782.6 280.4 783.2 C 282.5 783.8 284.4 784.4 286.1 785.2 C 287.7 786 289 786.8 290.1 787.8 C 291.1 788.7 291.9 789.8 292.4 790.9 C 292.8 792 293 793.2 292.9 794.4 C 292.7 795.7 292.3 797 291.6 798.4 C 290.9 799.8 289.8 801.2 288.5 802.7 C 287.2 804.2 285.6 805.7 283.7 807.3 C 281.9 808.8 279.7 810.4 277.3 812 C 274.9 813.6 272.2 815.2 269.4 816.9 C 266.5 818.5 263.3 820.1 260 821.7 C 256.7 823.3 253.1 825 249.4 826.5 C 245.7 828.1 241.8 829.7 237.8 831.2 C 233.8 832.7 229.6 834.2 225.3 835.6 C 221.1 837.1 216.6 838.4 212.2 839.8 C 207.8 841.1 203.2 842.3 198.7 843.5 C 194.1 844.7 189.5 845.8 185 846.8 C 180.4 847.9 175.8 848.8 171.3 849.7 C 166.8 850.5 162.3 851.3 157.9 852 C 153.5 852.6 149.2 853.2 145 853.7 C 140.9 854.1 136.8 854.5 132.9 854.8 C 129 855 125.3 855.2 121.7 855.2 C 118.2 855.3 114.8 855.2 111.7 855 C 108.6 854.9 105.6 854.6 102.9 854.2 C 100.3 853.9 97.8 853.4 95.6 852.8 C 93.5 852.2 91.6 851.6 89.9 850.8 C 88.3 850 87 849.2 85.9 848.2 C 84.9 847.3 84.1 846.2 83.6 845.1 C 83.2 844 83 842.8 83.1 841.6 C 83.3 840.3 83.7 839 84.4 837.6 C 85.1 836.2 86.2 834.8 87.5 833.3 C 88.8 831.8 90.4 830.3 92.3 828.7 C 94.1 827.2 96.3 825.6 98.7 824 C 101.1 822.4 104.4 820.4 106.6 819.1 C 108.9 817.8 111.1 816.7 112 816.2"/>
    <path stroke-width="7" d="M 121.1 782 C 132.2 783.2 165.7 789 188 789 C 210.3 789 243.8 783.2 254.9 782"/>
    <circle stroke-width="10" cx="842" cy="168" r="66"/>
    <circle stroke-width="7" cx="818" cy="150" r="17"/>
    <circle stroke-width="7" cx="868" cy="194" r="13"/>
    <circle stroke-width="7" cx="862" cy="132" r="11"/>
    <path stroke-width="8" d="M 142.6 125.2 L 150.3 141 Q 151.8 143.8 154.9 144.3 L 172.3 146.8 Q 178 147.6 173.9 151.7 L 161.3 164 Q 159 166.2 159.6 169.3 L 162.5 186.6 Q 163.5 192.4 158.3 189.6 L 142.8 181.5 Q 140 180 137.2 181.5 L 121.7 189.6 Q 116.5 192.4 117.5 186.6 L 120.4 169.3 Q 121 166.2 118.7 164 L 106.1 151.7 Q 102 147.6 107.7 146.8 L 125.1 144.3 Q 128.2 143.8 129.7 141 L 137.4 125.2 Q 140 120 142.6 125.2 Z"/>
    <path stroke-width="8" d="M 882.2 440.5 L 888.8 453.8 Q 890 456.2 892.7 456.6 L 907.4 458.8 Q 912.3 459.5 908.8 463 L 898.1 473.4 Q 896.2 475.3 896.6 477.9 L 899.1 492.6 Q 900 497.5 895.6 495.2 L 882.4 488.3 Q 880 487 877.6 488.3 L 864.4 495.2 Q 860 497.5 860.9 492.6 L 863.4 477.9 Q 863.8 475.3 861.9 473.4 L 851.2 463 Q 847.7 459.5 852.6 458.8 L 867.3 456.6 Q 870 456.2 871.2 453.8 L 877.8 440.5 Q 880 436 882.2 440.5 Z"/>
    <path stroke-width="8" d="M 101.7 447.4 L 106.7 457.6 Q 107.6 459.5 109.7 459.8 L 121 461.4 Q 124.7 462 122 464.6 L 113.8 472.6 Q 112.4 474 112.7 476.1 L 114.6 487.3 Q 115.3 491 111.9 489.3 L 101.8 484 Q 100 483 98.2 484 L 88.1 489.3 Q 84.7 491 85.4 487.3 L 87.3 476.1 Q 87.6 474 86.2 472.6 L 78 464.6 Q 75.3 462 79 461.4 L 90.3 459.8 Q 92.4 459.5 93.3 457.6 L 98.3 447.4 Q 100 444 101.7 447.4 Z"/>
    <path stroke-width="8" d="M 852.5 827 L 859.8 841.9 Q 861.2 844.6 864.2 845.1 L 880.6 847.5 Q 886.1 848.3 882.2 852.1 L 870.2 863.8 Q 868.1 865.9 868.6 868.9 L 871.4 885.3 Q 872.3 890.7 867.4 888.2 L 852.7 880.4 Q 850 879 847.3 880.4 L 832.6 888.2 Q 827.7 890.7 828.6 885.3 L 831.4 868.9 Q 831.9 865.9 829.8 863.8 L 817.8 852.1 Q 813.9 848.3 819.4 847.5 L 835.8 845.1 Q 838.8 844.6 840.2 841.9 L 847.5 827 Q 850 822 852.5 827 Z"/>
    <path stroke-width="8" d="M 621.6 879.1 L 626.2 888.6 Q 627.1 890.3 628.9 890.6 L 639.4 892.1 Q 642.8 892.6 640.3 895 L 632.8 902.4 Q 631.4 903.7 631.7 905.6 L 633.5 916 Q 634.1 919.4 631 917.8 L 621.7 912.9 Q 620 912 618.3 912.9 L 609 917.8 Q 605.9 919.4 606.5 916 L 608.3 905.6 Q 608.6 903.7 607.2 902.4 L 599.7 895 Q 597.2 892.6 600.6 892.1 L 611.1 890.6 Q 612.9 890.3 613.8 888.6 L 618.4 879.1 Q 620 876 621.6 879.1 Z"/>
    <path stroke-width="8" d="M 331.4 60.9 L 335.7 69.5 Q 336.5 71.1 338.2 71.4 L 347.7 72.7 Q 350.9 73.2 348.6 75.4 L 341.7 82.2 Q 340.5 83.4 340.8 85.1 L 342.4 94.6 Q 342.9 97.8 340.1 96.3 L 331.6 91.8 Q 330 91 328.4 91.8 L 319.9 96.3 Q 317.1 97.8 317.6 94.6 L 319.2 85.1 Q 319.5 83.4 318.3 82.2 L 311.4 75.4 Q 309.1 73.2 312.3 72.7 L 321.8 71.4 Q 323.5 71.1 324.3 69.5 L 328.6 60.9 Q 330 58 331.4 60.9 Z"/>
    <circle fill="#111" stroke="none" cx="250" cy="240" r="7"/>
    <circle fill="#111" stroke="none" cx="760" cy="330" r="7"/>
    <circle fill="#111" stroke="none" cx="60" cy="700" r="7"/>
    <circle fill="#111" stroke="none" cx="930" cy="690" r="7"/>
    <circle fill="#111" stroke="none" cx="420" cy="930" r="7"/>
    <circle fill="#111" stroke="none" cx="690" cy="70" r="7"/>
    <circle fill="#111" stroke="none" cx="230" cy="600" r="7"/>
    <circle fill="#111" stroke="none" cx="960" cy="300" r="7"/>
  </g>
</svg>
`,je=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- light beam -->
    <path stroke-width="8" d="M 448.3 613.1 C 440.6 639.6 420 723.2 402 772 C 384 820.8 350.3 883.7 340 906 C 353.3 910 393.3 925 420 930 C 446.7 935 473.3 936 500 936 C 526.7 936 553.3 935 580 930 C 606.7 925 646.7 910 660 906 C 649.7 883.7 616 820.8 598 772 C 580 723.2 559.4 639.6 551.7 613.1"/>
    <path stroke-width="7" d="M 477.9 713.9 L 483.8 725.7 Q 484.8 727.9 487.2 728.2 L 500.2 730.1 Q 504.5 730.7 501.4 733.8 L 492 743 Q 490.3 744.6 490.7 747 L 492.9 760 Q 493.6 764.3 489.8 762.2 L 478.1 756.1 Q 476 755 473.9 756.1 L 462.2 762.2 Q 458.4 764.3 459.1 760 L 461.3 747 Q 461.7 744.6 460 743 L 450.6 733.8 Q 447.5 730.7 451.8 730.1 L 464.8 728.2 Q 467.2 727.9 468.2 725.7 L 474.1 713.9 Q 476 710 477.9 713.9 Z"/>
    <path stroke-width="7" d="M 561.7 807.4 L 566.7 817.6 Q 567.6 819.5 569.7 819.8 L 581 821.4 Q 584.7 822 582 824.6 L 573.8 832.6 Q 572.4 834 572.7 836.1 L 574.6 847.3 Q 575.3 851 571.9 849.3 L 561.8 844 Q 560 843 558.2 844 L 548.1 849.3 Q 544.7 851 545.4 847.3 L 547.3 836.1 Q 547.6 834 546.2 832.6 L 538 824.6 Q 535.3 822 539 821.4 L 550.3 819.8 Q 552.4 819.5 553.3 817.6 L 558.3 807.4 Q 560 804 561.7 807.4 Z"/>
    <path stroke-width="7" d="M 437.6 847.1 L 442.2 856.6 Q 443.1 858.3 444.9 858.6 L 455.4 860.1 Q 458.8 860.6 456.3 863 L 448.8 870.4 Q 447.4 871.7 447.7 873.6 L 449.5 884 Q 450.1 887.4 447 885.8 L 437.7 880.9 Q 436 880 434.3 880.9 L 425 885.8 Q 421.9 887.4 422.5 884 L 424.3 873.6 Q 424.6 871.7 423.2 870.4 L 415.7 863 Q 413.2 860.6 416.6 860.1 L 427.1 858.6 Q 428.9 858.3 429.8 856.6 L 434.4 847.1 Q 436 844 437.6 847.1 Z"/>
    <!-- flying saucer -->
    <path stroke-width="10" d="M 392 563.7 C 395 566.1 401 570 410 578 C 419 586 431 604.3 446 612 C 461 619.7 482 624 500 624 C 518 624 539 619.7 554 612 C 569 604.3 581 586 590 578 C 599 570 605 566.1 608 563.7"/>
    <path stroke-width="10" d="M 346 421 C 348 407.5 347.3 368.2 358 340 C 368.7 311.8 386.3 272 410 252 C 433.7 232 470 220 500 220 C 530 220 566.3 232 590 252 C 613.7 272 631.3 311.8 642 340 C 652.7 368.2 652 407.5 654 421"/>
    <path stroke-width="7" d="M 468.7 380.4 C 465.9 383.7 458.8 394.4 452 400 C 445.2 405.6 432 411.6 428 413.9"/>
    <path stroke-width="7" d="M 531.3 380.4 C 534.1 383.7 541.2 394.4 548 400 C 554.8 405.6 568 411.6 572 413.9"/>
    <path stroke-width="6" d="M 482.4 280.8 C 482.2 280.4 481.6 278.9 481.2 278.1 C 480.8 277.2 480.5 276.5 480.1 275.6 C 479.7 274.8 479.3 274 478.9 273.1 C 478.5 272.3 478.1 271.5 477.6 270.6 C 477.2 269.7 476.8 268.9 476.3 268 C 475.8 267.1 475.2 266.1 474.6 265.2 C 474 264.2 473.2 263.1 472.5 262.2 C 471.8 261.3 471.1 260.6 470.4 259.8 C 469.7 259 467.7 258.2 468.3 257.5 C 468.9 256.9 473 256 474 255.7 M 466.7 289 C 466.4 288.5 465.4 286.6 464.9 285.7 C 464.4 284.8 464.2 284.1 463.8 283.3 C 463.4 282.5 463 281.8 462.7 281 C 462.3 280.2 461.9 279.5 461.6 278.8 C 461.2 278 460.8 277.3 460.4 276.6 C 460.1 276 459.8 275.4 459.4 274.9 C 459.1 274.3 458.8 274 458.4 273.5 C 458 273 457.5 272.4 457.1 271.9 C 456.6 271.3 456.1 270.8 455.5 270.2 C 454.9 269.6 453.7 268.6 453.3 268.3"/>
    <circle stroke-width="7" cx="460" cy="256" r="14"/>
    <path stroke-width="6" d="M 533.3 289 C 533.6 288.5 534.6 286.6 535.1 285.7 C 535.6 284.8 535.8 284.1 536.2 283.3 C 536.6 282.5 537 281.8 537.3 281 C 537.7 280.2 538.1 279.5 538.4 278.8 C 538.8 278 539.2 277.3 539.6 276.6 C 539.9 276 540.2 275.4 540.6 274.9 C 540.9 274.3 541.2 274 541.6 273.5 C 542 273 542.5 272.4 542.9 271.9 C 543.4 271.3 543.9 270.8 544.5 270.2 C 545.1 269.6 546.3 268.6 546.7 268.3 M 517.6 280.8 C 517.8 280.4 518.4 278.9 518.8 278.1 C 519.2 277.2 519.5 276.5 519.9 275.6 C 520.3 274.8 520.7 274 521.1 273.1 C 521.5 272.3 521.9 271.5 522.4 270.6 C 522.8 269.7 523.2 268.9 523.7 268 C 524.2 267.1 524.8 266.1 525.4 265.2 C 526 264.2 526.8 263.1 527.5 262.2 C 528.2 261.3 528.9 260.6 529.6 259.8 C 530.3 259 532.3 258.2 531.7 257.5 C 531.1 256.9 527 256 526 255.7"/>
    <circle stroke-width="7" cx="540" cy="256" r="14"/>
    <circle stroke-width="7" cx="500" cy="334" r="56"/>
    <circle cx="477" cy="328" r="22" stroke-width="6"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 466 329 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0 Z M 466.3 324.4 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <circle cx="523" cy="328" r="22" stroke-width="6"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 510 329 a 12 12 0 1 0 24 0 a 12 12 0 1 0 -24 0 Z M 510.3 324.4 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="6" d="M 480 362 Q 500 380 520 362"/>
    <ellipse stroke-width="10" cx="500" cy="490" rx="330" ry="78"/>
    <circle stroke-width="7" cx="268.8" cy="510.9" r="18"/>
    <circle stroke-width="7" cx="335.4" cy="523.8" r="18"/>
    <circle stroke-width="7" cx="440.5" cy="531" r="18"/>
    <circle stroke-width="7" cx="559.5" cy="531" r="18"/>
    <circle stroke-width="7" cx="664.6" cy="523.8" r="18"/>
    <circle stroke-width="7" cx="731.2" cy="510.9" r="18"/>
    <!-- moon, planet and stars -->
    <path stroke-width="10" d="M 913.1 190 C 912.4 192.1 910.5 198.7 908.7 202.8 C 906.9 206.9 904.7 210.9 902.3 214.6 C 899.8 218.4 897.1 222 894.1 225.4 C 891.1 228.7 887.8 231.8 884.3 234.7 C 880.8 237.5 877.1 240.1 873.2 242.4 C 869.3 244.6 865.2 246.6 861 248.2 C 856.9 249.8 852.5 251.1 848.1 252.1 C 843.7 253 839.2 253.6 834.7 253.9 C 830.3 254.1 825.7 254 821.3 253.6 C 816.8 253.1 812.3 252.3 808 251.1 C 803.6 250 799.3 248.5 795.2 246.7 C 791.1 244.9 787.1 242.7 783.4 240.3 C 779.6 237.8 776 235.1 772.6 232.1 C 769.3 229.1 766.2 225.8 763.3 222.3 C 760.5 218.8 757.9 215.1 755.6 211.2 C 753.4 207.3 751.4 203.2 749.8 199 C 748.2 194.9 746.9 190.5 745.9 186.1 C 745 181.7 744.4 177.2 744.1 172.7 C 743.9 168.3 744 163.7 744.4 159.3 C 744.9 154.8 745.7 150.3 746.9 146 C 748 141.6 749.5 137.3 751.3 133.2 C 753.1 129.1 755.3 125.1 757.7 121.4 C 760.2 117.6 762.9 114 765.9 110.6 C 768.9 107.3 772.2 104.2 775.7 101.3 C 779.2 98.5 782.9 95.9 786.8 93.6 C 790.7 91.4 794.8 89.4 799 87.8 C 803.1 86.2 808.1 84.8 811.9 83.9 C 815.6 83 819.9 82.7 821.5 82.4 C 820.4 84.4 816.9 90.6 815.3 94.5 C 813.7 98.4 812.7 101.8 811.8 105.6 C 811 109.3 810.4 113.2 810.2 117.1 C 809.9 120.9 810 124.8 810.3 128.7 C 810.7 132.5 811.3 136.4 812.3 140.1 C 813.2 143.9 814.5 147.6 816 151.1 C 817.5 154.7 819.3 158.1 821.4 161.4 C 823.4 164.7 825.8 167.8 828.3 170.7 C 830.8 173.6 833.7 176.4 836.6 178.8 C 839.6 181.3 842.8 183.6 846.1 185.6 C 849.4 187.5 852.9 189.3 856.5 190.7 C 860.1 192.1 863.8 193.3 867.6 194.2 C 871.3 195 875.2 195.6 879.1 195.8 C 882.9 196.1 886.8 196 890.7 195.7 C 894.5 195.3 898.4 194.7 902.1 193.7 C 905.9 192.8 911.3 190.6 913.1 190 Z"/>
    <circle stroke-width="10" cx="160" cy="850" r="66"/>
    <circle stroke-width="7" cx="138" cy="830" r="18"/>
    <circle stroke-width="7" cx="186" cy="872" r="14"/>
    <circle stroke-width="7" cx="182" cy="818" r="11"/>
    <path stroke-width="8" d="M 112.7 113.5 L 120.9 130 Q 122.3 133 125.7 133.5 L 143.9 136.1 Q 149.9 137 145.6 141.3 L 132.4 154.2 Q 130 156.5 130.5 159.8 L 133.6 177.9 Q 134.7 184 129.3 181.1 L 113 172.6 Q 110 171 107 172.6 L 90.7 181.1 Q 85.3 184 86.4 177.9 L 89.5 159.8 Q 90 156.5 87.6 154.2 L 74.4 141.3 Q 70.1 137 76.1 136.1 L 94.3 133.5 Q 97.7 133 99.1 130 L 107.3 113.5 Q 110 108 112.7 113.5 Z"/>
    <path stroke-width="8" d="M 331.9 83.9 L 337.8 95.7 Q 338.8 97.9 341.2 98.2 L 354.2 100.1 Q 358.5 100.7 355.4 103.8 L 346 113 Q 344.3 114.6 344.7 117 L 346.9 130 Q 347.6 134.3 343.8 132.2 L 332.1 126.1 Q 330 125 327.9 126.1 L 316.2 132.2 Q 312.4 134.3 313.1 130 L 315.3 117 Q 315.7 114.6 314 113 L 304.6 103.8 Q 301.5 100.7 305.8 100.1 L 318.8 98.2 Q 321.2 97.9 322.2 95.7 L 328.1 83.9 Q 330 80 331.9 83.9 Z"/>
    <path stroke-width="8" d="M 622.1 82.2 L 628.3 94.8 Q 629.4 97.1 631.9 97.4 L 645.8 99.4 Q 650.4 100.1 647.1 103.4 L 637 113.2 Q 635.2 114.9 635.6 117.5 L 638 131.3 Q 638.8 135.9 634.7 133.7 L 622.3 127.2 Q 620 126 617.7 127.2 L 605.3 133.7 Q 601.2 135.9 602 131.3 L 604.4 117.5 Q 604.8 114.9 603 113.2 L 592.9 103.4 Q 589.6 100.1 594.2 99.4 L 608.1 97.4 Q 610.6 97.1 611.7 94.8 L 617.9 82.2 Q 620 78 622.1 82.2 Z"/>
    <path stroke-width="8" d="M 112.1 422.2 L 118.3 434.8 Q 119.4 437.1 121.9 437.4 L 135.8 439.4 Q 140.4 440.1 137.1 443.4 L 127 453.2 Q 125.2 454.9 125.6 457.5 L 128 471.3 Q 128.8 475.9 124.7 473.7 L 112.3 467.2 Q 110 466 107.7 467.2 L 95.3 473.7 Q 91.2 475.9 92 471.3 L 94.4 457.5 Q 94.8 454.9 93 453.2 L 82.9 443.4 Q 79.6 440.1 84.2 439.4 L 98.1 437.4 Q 100.6 437.1 101.7 434.8 L 107.9 422.2 Q 110 418 112.1 422.2 Z"/>
    <path stroke-width="8" d="M 907.3 398.7 L 914.3 412.9 Q 915.6 415.4 918.4 415.9 L 934 418.1 Q 939.2 418.9 935.5 422.5 L 924.2 433.6 Q 922.1 435.6 922.6 438.4 L 925.3 453.9 Q 926.2 459.1 921.5 456.7 L 907.5 449.3 Q 905 448 902.5 449.3 L 888.5 456.7 Q 883.8 459.1 884.7 453.9 L 887.4 438.4 Q 887.9 435.6 885.8 433.6 L 874.5 422.5 Q 870.8 418.9 876 418.1 L 891.6 415.9 Q 894.4 415.4 895.7 412.9 L 902.7 398.7 Q 905 394 907.3 398.7 Z"/>
    <path stroke-width="8" d="M 871.9 633.9 L 877.8 645.7 Q 878.8 647.9 881.2 648.2 L 894.2 650.1 Q 898.5 650.7 895.4 653.8 L 886 663 Q 884.3 664.6 884.7 667 L 886.9 680 Q 887.6 684.3 883.8 682.2 L 872.1 676.1 Q 870 675 867.9 676.1 L 856.2 682.2 Q 852.4 684.3 853.1 680 L 855.3 667 Q 855.7 664.6 854 663 L 844.6 653.8 Q 841.5 650.7 845.8 650.1 L 858.8 648.2 Q 861.2 647.9 862.2 645.7 L 868.1 633.9 Q 870 630 871.9 633.9 Z"/>
    <path stroke-width="8" d="M 151.9 633.9 L 157.8 645.7 Q 158.8 647.9 161.2 648.2 L 174.2 650.1 Q 178.5 650.7 175.4 653.8 L 166 663 Q 164.3 664.6 164.7 667 L 166.9 680 Q 167.6 684.3 163.8 682.2 L 152.1 676.1 Q 150 675 147.9 676.1 L 136.2 682.2 Q 132.4 684.3 133.1 680 L 135.3 667 Q 135.7 664.6 134 663 L 124.6 653.8 Q 121.5 650.7 125.8 650.1 L 138.8 648.2 Q 141.2 647.9 142.2 645.7 L 148.1 633.9 Q 150 630 151.9 633.9 Z"/>
    <path stroke-width="8" d="M 832.6 845.2 L 840.3 861 Q 841.8 863.8 844.9 864.3 L 862.3 866.8 Q 868 867.6 863.9 871.7 L 851.3 884 Q 849 886.2 849.6 889.3 L 852.5 906.6 Q 853.5 912.4 848.3 909.6 L 832.8 901.5 Q 830 900 827.2 901.5 L 811.7 909.6 Q 806.5 912.4 807.5 906.6 L 810.4 889.3 Q 811 886.2 808.7 884 L 796.1 871.7 Q 792 867.6 797.7 866.8 L 815.1 864.3 Q 818.2 863.8 819.7 861 L 827.4 845.2 Q 830 840 832.6 845.2 Z"/>
    <circle fill="#111" stroke="none" cx="230" cy="260" r="7"/>
    <circle fill="#111" stroke="none" cx="520" cy="60" r="7"/>
    <circle fill="#111" stroke="none" cx="930" cy="280" r="7"/>
    <circle fill="#111" stroke="none" cx="60" cy="300" r="7"/>
    <circle fill="#111" stroke="none" cx="260" cy="760" r="7"/>
    <circle fill="#111" stroke="none" cx="700" cy="700" r="7"/>
    <circle fill="#111" stroke="none" cx="950" cy="940" r="7"/>
    <circle fill="#111" stroke="none" cx="60" cy="560" r="7"/>
    <circle fill="#111" stroke="none" cx="720" cy="250" r="7"/>
  </g>
</svg>
`,Me=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- flag -->
    <path stroke-width="6" d="M 490.5 296 L 490.7 586.6"/>
    <path stroke-width="6" d="M 489.6 652.8 L 490.5 812"/>
    <path stroke-width="6" d="M 508.5 296 L 508.3 588.4"/>
    <path stroke-width="6" d="M 507.6 633.5 L 508.5 812"/>
    <path stroke-width="6" d="M 490.5 812 Q 499.5 820 508.5 812"/>
    <circle stroke-width="7" cx="499.5" cy="286" r="12"/>
    <path stroke-width="7" d="M 508.5 306 C 517.1 304.3 543.1 294.7 560 296 C 576.9 297.3 593.3 313.3 610 314 C 626.7 314.7 651.7 302.3 660 300 C 658.7 308.7 652 334.7 652 352 C 652 369.3 658.7 395.3 660 404 C 651.7 406.3 626.7 418.7 610 418 C 593.3 417.3 576.9 401.3 560 400 C 543.1 398.7 517.1 408.3 508.5 410"/>
    <!-- astronaut -->
    <path stroke-width="7" d="M 290.7 612.9 C 289.6 612.1 287.1 609.8 284.4 608 C 281.7 606.2 277.6 604.2 274.7 602.3 C 271.7 600.4 269.4 598.9 266.9 596.7 C 264.3 594.6 261.8 592 259.3 589.5 C 256.9 586.9 254.4 584 252.1 581.2 C 249.7 578.3 247.4 575.2 245.5 572.4 C 243.6 569.7 242.1 567.4 240.8 564.6 C 239.5 561.9 238.6 559.1 237.6 555.8 C 236.6 552.5 235.8 548.9 234.8 544.8 C 233.9 540.6 233.2 535 231.8 531 C 230.3 527.1 228.7 523.8 226.2 521.2 C 223.6 518.6 219.9 516.4 216.4 515.5 C 212.9 514.5 208.6 514.5 205 515.4 C 201.5 516.3 197.8 518.5 195.2 521 C 192.6 523.6 190.4 527.3 189.5 530.8 C 188.5 534.3 189.1 538.4 189.4 542.2 C 189.8 545.9 190.7 549.3 191.6 553.5 C 192.4 557.8 193.2 562.6 194.6 567.5 C 196 572.4 197.6 577.9 199.7 582.8 C 201.9 587.8 204.9 592.9 207.7 597.4 C 210.4 601.8 213.1 605.5 216.1 609.4 C 219 613.3 222.1 616.9 225.4 620.6 C 228.7 624.3 232.1 628 236 631.5 C 239.9 634.9 244.6 638.4 248.7 641.3 C 252.9 644.2 255.5 646.6 260.8 648.9 C 266.2 651.2 277.3 654.1 280.6 655.2"/>
    <path stroke-width="5" d="M 241.5 566.1 L 201.2 586.1"/>
    <path stroke-width="5" d="M 237.6 555.8 L 194.6 567.5"/>
    <path stroke-width="7" d="M 423.5 657.1 C 422.8 657.6 418.3 659 419.4 660.2 C 420.4 661.4 425.8 663.1 429.7 664.3 C 433.7 665.6 437.6 667.4 443 667.9 C 448.3 668.4 456.5 668.2 461.9 667.2 C 467.4 666.2 471.6 663.8 475.7 661.8 C 479.8 659.8 483.2 657.4 486.5 655.1 C 489.7 652.7 492.3 650.9 495.4 647.9 C 498.6 644.8 502.6 640.3 505.3 636.8 C 508 633.3 509.9 629.7 511.6 626.9 C 513.3 624.1 514.2 622.8 515.5 619.9 C 516.8 616.9 519 612.8 519.3 609.2 C 519.6 605.5 518.9 601.3 517.3 598 C 515.7 594.7 513 591.5 510 589.4 C 507 587.3 502.9 585.9 499.3 585.6 C 495.6 585.3 491.4 586 488.1 587.6 C 484.8 589.2 481.9 592.2 479.5 594.9 C 477.1 597.7 475.3 601.7 473.6 604.3 C 472 606.8 470.6 608.8 469.5 610.3 C 468.3 611.9 468.1 612.1 466.6 613.4 C 465.1 614.7 462.5 616.6 460.5 617.9 C 458.6 619.2 456.6 620.3 455 621.1 C 453.4 621.8 451.7 622.3 451 622.4 C 450.3 622.6 451.9 622.5 451 622.1 C 450.2 621.8 448 621.2 446 620.4 C 443.9 619.6 443.9 617.7 438.7 617.2 C 433.5 616.6 418.8 617.2 414.8 617.2"/>
    <path stroke-width="5" d="M 493.8 649.4 L 465.3 614.5"/>
    <path stroke-width="5" d="M 505.3 636.8 L 469.5 610.3"/>
    <path stroke-width="7" d="M 292.4 702.7 C 292.1 705.4 290.9 714.3 290.5 718.7 C 290.1 723.1 290.3 725.8 290.1 729.3 C 290 732.8 289.9 736.4 289.8 739.9 C 289.7 743.4 289.6 747 289.5 750.5 C 289.4 754.1 289.2 757.6 289.1 761.1 C 289 764.7 288.9 768.2 288.8 771.8 C 288.7 775.3 288.6 778.8 288.5 782.4 C 288.4 785.9 288.3 789.5 288.1 793 C 288 796.5 287.9 800.1 287.8 803.6 C 287.7 807.1 287.1 810.3 287.5 814.1 C 287.8 817.8 288.2 822.6 290 826.1 C 291.8 829.6 294.9 833.1 298.2 835.3 C 301.5 837.5 305.9 838.9 309.9 839.1 C 313.8 839.4 318.4 838.4 321.9 836.6 C 325.4 834.8 328.9 831.7 331.1 828.4 C 333.3 825.1 334.2 820.5 334.9 816.7 C 335.7 813 335.5 809.6 335.7 806 C 336 802.5 336.2 799 336.5 795.4 C 336.7 791.9 336.9 788.4 337.2 784.8 C 337.4 781.3 337.7 777.8 337.9 774.2 C 338.2 770.7 338.4 767.2 338.7 763.7 C 338.9 760.1 339.2 756.6 339.4 753.1 C 339.7 749.6 339.9 746 340.2 742.5 C 340.4 739 340.7 735.4 340.9 731.9 C 341.2 728.4 341.5 724.2 341.7 721.3 C 341.9 718.3 342 715.4 342 714.2"/>
    <path stroke-width="5" d="M 288.5 782.3 L 337.2 784.8"/>
    <path stroke-width="7" d="M 362 714.2 C 362 715.4 362.1 718.3 362.3 721.3 C 362.5 724.2 362.8 728.4 363.1 731.9 C 363.3 735.4 363.6 739 363.8 742.5 C 364.1 746 364.3 749.6 364.6 753.1 C 364.8 756.6 365.1 760.1 365.3 763.7 C 365.6 767.2 365.8 770.7 366.1 774.2 C 366.3 777.8 366.6 781.3 366.8 784.8 C 367.1 788.4 367.3 791.9 367.5 795.4 C 367.8 799 368 802.5 368.3 806 C 368.5 809.6 368.3 813 369.1 816.7 C 369.8 820.5 370.7 825.1 372.9 828.4 C 375.1 831.7 378.6 834.8 382.1 836.6 C 385.6 838.4 390.2 839.4 394.1 839.1 C 398.1 838.9 402.5 837.5 405.8 835.3 C 409.1 833.1 412.2 829.6 414 826.1 C 415.8 822.6 416.2 817.8 416.5 814.1 C 416.9 810.3 416.3 807.1 416.2 803.6 C 416.1 800.1 416 796.5 415.9 793 C 415.7 789.5 415.6 785.9 415.5 782.4 C 415.4 778.8 415.3 775.3 415.2 771.8 C 415.1 768.2 415 764.7 414.9 761.1 C 414.8 757.6 414.6 754.1 414.5 750.5 C 414.4 747 414.3 743.4 414.2 739.9 C 414.1 736.4 414 732.8 413.9 729.3 C 413.7 725.8 413.9 723.1 413.5 718.7 C 413.1 714.3 411.9 705.4 411.6 702.7"/>
    <path stroke-width="5" d="M 366.8 784.8 L 415.5 782.3"/>
    <path stroke-width="7" d="M 293.5 604.6 C 291.5 611.7 283.3 630.9 281.3 646.8 C 279.2 662.7 281.3 691 281.3 699.8 C 293.1 702.3 328.4 714.8 352 714.8 C 375.6 714.8 410.9 702.3 422.7 699.8 C 422.7 691 424.8 662.7 422.7 646.8 C 420.7 630.9 412.5 611.7 410.5 604.6"/>
    <path stroke-width="7" d="M 295.1 561.1 C 294.8 565.2 294.5 578.3 293.5 585.6 C 292.6 592.9 290.1 601.5 289.4 604.6 C 310.3 604.6 393.7 604.6 414.6 604.6 C 413.9 601.5 411.4 592.9 410.5 585.6 C 409.5 578.3 409.2 565.2 408.9 561.1"/>
    <path stroke-width="5" d="M 281.3 687.6 L 422.7 687.6"/>
    <rect stroke-width="5" x="316.6" y="623.7" width="70.7" height="47.6" rx="9"/>
    <circle stroke-width="5" cx="335.7" cy="647.5" r="9.5"/>
    <circle stroke-width="5" cx="368.3" cy="647.5" r="9.5"/>
    <path stroke-width="5" d="M 360.1 362.9 C 360.1 362.6 360 362 360 361.3 C 360 360.6 360 359.6 360 358.7 C 360 357.9 360 357 360 356.2 C 360 355.3 360 354.4 360 353.6 C 360 352.7 360 351.9 360 351 C 360 350.1 360 349.3 360 348.4 C 360 347.6 360 346.7 360 345.8 C 360 345 360 344.1 360 343.3 C 360 342.4 360 341.5 360 340.7 C 360 339.9 360.1 338.8 360.2 338.4 M 343.9 362.9 C 343.9 362.6 344 362 344 361.3 C 344 360.6 344 359.6 344 358.7 C 344 357.9 344 357 344 356.2 C 344 355.3 344 354.4 344 353.6 C 344 352.7 344 351.9 344 351 C 344 350.1 344 349.3 344 348.4 C 344 347.6 344 346.7 344 345.8 C 344 345 344 344.1 344 343.3 C 344 342.4 344 341.5 344 340.7 C 344 339.9 343.9 338.8 343.8 338.4"/>
    <circle stroke-width="7" cx="352" cy="325.8" r="15"/>
    <path stroke-width="7" d="M 253.8 513.7 C 251.7 514.6 245.9 526.7 241.1 519.4 C 236.2 512.1 224.6 486.5 224.6 470 C 224.6 453.5 236.2 427.9 241.1 420.6 C 245.9 413.3 251.7 425.4 253.8 426.3"/>
    <path stroke-width="7" d="M 450.2 513.7 C 452.3 514.6 458.1 526.7 462.9 519.4 C 467.8 512.1 479.4 486.5 479.4 470 C 479.4 453.5 467.8 427.9 462.9 420.6 C 458.1 413.3 452.3 425.4 450.2 426.3"/>
    <circle stroke-width="7" cx="352" cy="470" r="107.4"/>
    <path stroke-width="7" d="M 352 417 C 371.9 417 397.8 415.8 411.8 423.8 C 425.9 431.7 433.4 449.8 436.3 464.6 C 439.3 479.3 443.6 499.9 429.5 512.2 C 415.5 524.4 377.8 538 352 538 C 326.2 538 288.5 524.4 274.5 512.2 C 260.4 499.9 264.7 479.3 267.7 464.6 C 270.6 449.8 278.1 431.7 292.2 423.8 C 306.2 415.8 332.1 417 352 417 Z"/>
    <circle cx="322.1" cy="470" r="21" stroke-width="5"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 312.5 471.4 a 11.5 11.5 0 1 0 23 0 a 11.5 11.5 0 1 0 -23 0 Z M 312.5 467.1 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <circle cx="381.9" cy="470" r="21" stroke-width="5"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 368.5 471.4 a 11.5 11.5 0 1 0 23 0 a 11.5 11.5 0 1 0 -23 0 Z M 368.5 467.1 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="5" d="M 330.2 504 Q 352 523 373.8 504"/>
    <!-- rocket -->
    <path stroke-width="7" d="M 893 610 C 898.8 618.3 919.5 640 928 660 C 936.5 680 941 705.7 944 730 C 947 754.3 945.7 793.3 946 806 C 939.7 803.3 918.7 805 908 790 C 897.3 775 886.3 728.3 882 716"/>
    <path stroke-width="7" d="M 731 610 C 725.2 618.3 704.5 640 696 660 C 687.5 680 683 705.7 680 730 C 677 754.3 678.3 793.3 678 806 C 684.3 803.3 705.3 805 716 790 C 726.7 775 737.7 728.3 742 716"/>
    <path stroke-width="7" d="M 812 316 C 820.7 328 851.3 362.3 864 388 C 876.7 413.7 883 441.3 888 470 C 893 498.7 893.3 531.7 894 560 C 894.7 588.3 894 614 892 640 C 890 666 883.7 703.3 882 716 C 870.3 718.3 835.3 730 812 730 C 788.7 730 753.7 718.3 742 716 C 740.3 703.3 734 666 732 640 C 730 614 729.3 588.3 730 560 C 730.7 531.7 731 498.7 736 470 C 741 441.3 747.3 413.7 760 388 C 772.7 362.3 803.3 328 812 316 Z"/>
    <path stroke-width="5" d="M 750.9 409.6 C 761.1 412.7 791.6 428 812 428 C 832.4 428 862.9 412.7 873.1 409.6"/>
    <circle stroke-width="7" cx="812" cy="486" r="34"/>
    <circle stroke-width="5" cx="812" cy="486" r="21"/>
    <path stroke-width="5" d="M 730.3 548.5 C 743.9 550.4 784.8 560 812 560 C 839.2 560 880.1 550.4 893.7 548.5"/>
    <path stroke-width="5" d="M 782 690 L 782 610 Q 782 584 812 584 Q 842 584 842 610 L 842 690 Z"/>
    <circle stroke-width="5" cx="812" cy="616" r="11"/>
    <path stroke-width="5" d="M 790 690 L 784 808 M 834 690 L 840 808"/>
    <path stroke-width="5" d="M 786.5 758 L 837.5 758"/>
    <path stroke-width="5" d="M 785 788 L 839 788"/>
    <!-- moon ground -->
    <path stroke-width="7" d="M -20 650 C -19.2 649.9 -16.8 649.6 -15.1 649.3 C -13.3 649.1 -11.4 648.8 -9.4 648.5 C -7.3 648.2 -5.2 647.9 -2.9 647.5 C -0.6 647.1 1.7 646.8 4.2 646.4 C 6.7 645.9 9.3 645.5 11.9 645.1 C 14.6 644.7 17.4 644.2 20.2 643.7 C 23.1 643.3 26 642.8 29 642.3 C 32 641.8 35.1 641.3 38.2 640.8 C 41.3 640.3 44.5 639.8 47.8 639.3 C 51 638.8 54.3 638.3 57.7 637.9 C 61 637.4 64.4 636.9 67.8 636.4 C 71.2 635.9 74.7 635.4 78.1 635 C 81.6 634.5 85.1 634 88.6 633.6 C 92.1 633.2 95.6 632.7 99.1 632.3 C 102.6 631.9 106.1 631.5 109.6 631.2 C 113.1 630.8 116.6 630.5 120.1 630.2 C 123.6 629.9 127.1 629.6 130.5 629.3 C 133.9 629.1 137.3 628.9 140.7 628.7 C 144 628.5 147.4 628.3 150.6 628.2 C 153.9 628.1 157.1 628 160.3 628 C 163.5 628 166.7 628 169.9 628 C 173.1 628.1 176.3 628.2 179.5 628.3 C 182.8 628.5 186 628.7 189.3 628.9 C 192.5 629.1 195.8 629.3 199.1 629.6 C 202.4 629.9 205.7 630.2 209 630.5 C 212.3 630.8 215.6 631.2 218.9 631.6 C 222.3 631.9 225.6 632.3 228.9 632.7 C 232.3 633.1 237.3 633.8 239 634"/>
    <path stroke-width="7" d="M 508.5 632.4 C 510.2 632.2 515.2 631.8 518.5 631.5 C 521.9 631.3 525.2 631 528.5 630.8 C 531.9 630.6 535.2 630.5 538.5 630.3 C 541.9 630.2 545.2 630.1 548.6 630 C 551.9 630 555.2 630 558.6 630 C 561.9 630 565.3 630.1 568.7 630.2 C 572 630.3 575.4 630.4 578.9 630.6 C 582.3 630.8 585.7 631 589.2 631.3 C 592.6 631.5 596.1 631.8 599.6 632.2 C 603 632.5 606.5 632.8 610 633.2 C 613.5 633.5 617 633.9 620.5 634.3 C 624 634.7 627.5 635.2 631 635.6 C 634.5 636 638 636.5 641.5 637 C 645 637.4 648.5 637.9 652 638.4 C 655.5 638.9 659 639.3 662.4 639.8 C 665.9 640.3 669.4 640.8 672.8 641.3 C 676.2 641.7 679.7 642.2 683.1 642.7 C 686.5 643.2 689.8 643.6 693.2 644.1 C 696.6 644.5 701.5 645.1 703.2 645.4"/>
    <path stroke-width="7" d="M 914.1 634 C 915.3 634 918.9 634.1 921.4 634.2 C 923.8 634.3 926.3 634.4 928.7 634.6 C 931.2 634.7 933.6 634.9 936.1 635 C 938.6 635.2 941 635.4 943.5 635.6 C 946 635.8 948.4 636 950.9 636.2 C 953.3 636.4 955.7 636.6 958.1 636.9 C 960.5 637.1 962.9 637.4 965.3 637.6 C 967.6 637.9 969.9 638.1 972.2 638.4 C 974.5 638.6 976.8 638.9 979 639.1 C 981.2 639.4 983.4 639.7 985.5 639.9 C 987.6 640.2 989.7 640.4 991.7 640.7 C 993.7 640.9 995.6 641.2 997.5 641.4 C 999.4 641.6 1001.2 641.9 1003 642.1 C 1004.7 642.3 1006.4 642.5 1008 642.7 C 1009.6 642.9 1011.1 643.1 1012.5 643.2 C 1014 643.4 1015.3 643.5 1016.5 643.7 C 1017.8 643.8 1019.4 643.9 1020 644"/>
    <ellipse stroke-width="7" cx="110" cy="760" rx="74" ry="26"/>
    <path stroke-width="5" d="M 65.6 762.6 Q 110 736.6 154.4 762.6"/>
    <ellipse stroke-width="7" cx="640" cy="884" rx="96" ry="32"/>
    <path stroke-width="5" d="M 582.4 887.2 Q 640 855.2 697.6 887.2"/>
    <ellipse stroke-width="7" cx="250" cy="905" rx="62" ry="22"/>
    <path stroke-width="5" d="M 212.8 907.2 Q 250 885.2 287.2 907.2"/>
    <ellipse stroke-width="7" cx="900" cy="902" rx="56" ry="21"/>
    <path stroke-width="5" d="M 866.4 904.1 Q 900 883.1 933.6 904.1"/>
    <ellipse stroke-width="7" cx="624" cy="728" rx="56" ry="19"/>
    <path stroke-width="5" d="M 590.4 729.9 Q 624 710.9 657.6 729.9"/>
    <path stroke-width="7" d="M 596 812 C 596 805.3 606 794.3 614 790 C 622 785.7 635.7 783.3 644 786 C 652.3 788.7 663 799 664 806 C 665 813 658.3 824 650 828 C 641.7 832 623 832.7 614 830 C 605 827.3 596 818.7 596 812 Z"/>
    <path stroke-width="7" d="M 60 880 C 59 873.7 70.7 864.3 78 862 C 85.3 859.7 98.7 861.7 104 866 C 109.3 870.3 113.3 882.3 110 888 C 106.7 893.7 92.3 901.3 84 900 C 75.7 898.7 61 886.3 60 880 Z"/>
    <path stroke-width="7" d="M 176 838 C 176.3 832.3 183.7 823.3 190 820 C 196.3 816.7 207.7 815.3 214 818 C 220.3 820.7 228 830.3 228 836 C 228 841.7 220.7 849 214 852 C 207.3 855 194.3 856.3 188 854 C 181.7 851.7 175.7 843.7 176 838 Z"/>
    <ellipse stroke-width="5" cx="566" cy="922" rx="13" ry="20" transform="rotate(-20 566 922)"/>
    <ellipse stroke-width="5" cx="520" cy="948" rx="13" ry="20" transform="rotate(-20 520 948)"/>
    <!-- earth and stars -->
    <circle stroke-width="7" cx="168" cy="170" r="104"/>
    <path stroke-width="5" d="M 110 110 C 118 100.3 130 93 140 92 C 150 91 166 96 170 104 C 174 112 170.7 129 164 140 C 157.3 151 137.3 157.7 130 170 C 122.7 182.3 125.3 209 120 214 C 114.7 219 102.7 210.7 98 200 C 93.3 189.3 90 165 92 150 C 94 135 102 119.7 110 110 Z"/>
    <path stroke-width="5" d="M 196 92 C 203.7 88 223.7 96 232 104 C 240.3 112 248 130.7 246 140 C 244 149.3 226.7 150.7 220 160 C 213.3 169.3 212 194 206 196 C 200 198 187.3 183.3 184 172 C 180.7 160.7 184 141.3 186 128 C 188 114.7 188.3 96 196 92 Z"/>
    <path stroke-width="5" d="M 150 232 C 156.7 227.7 177 223 186 226 C 195 229 206.7 244 204 250 C 201.3 256 179.7 261.7 170 262 C 160.3 262.3 149.3 257 146 252 C 142.7 247 143.3 236.3 150 232 Z"/>
    <path stroke-width="6" d="M 458.9 71 L 462.8 84.4 Q 463.5 86.9 465.9 87.7 L 479.2 92.1 Q 483.7 93.5 479.8 96.2 L 468.2 104.1 Q 466.1 105.5 466.1 108.1 L 466 122.1 Q 466 126.8 462.3 123.9 L 451.2 115.3 Q 449.2 113.8 446.8 114.5 L 433.4 118.8 Q 429 120.2 430.6 115.8 L 435.3 102.6 Q 436.2 100.2 434.7 98.2 L 426.5 86.8 Q 423.7 83 428.4 83.1 L 442.4 83.5 Q 445 83.6 446.5 81.6 L 454.8 70.3 Q 457.6 66.5 458.9 71 Z"/>
    <path stroke-width="5" d="M 407.7 95.6 C 405.4 96.3 398.5 98.5 393.8 100.1 C 389.1 101.6 384.4 103.1 379.6 104.8 C 374.9 106.4 370.1 108 365.4 109.7 C 360.6 111.5 355.7 113.4 351.1 115.3 C 346.4 117.2 341.8 119.2 337.3 121.2 C 332.7 123.2 328.2 125.2 323.7 127.3 C 319.2 129.3 314.7 131.4 310.2 133.4 C 305.7 135.5 299.7 138.1 296.9 139.6 C 294 141 294 141.1 293.1 142.3 C 292.1 143.4 291.4 145 291.1 146.5 C 290.9 148 291 149.7 291.6 151.1 C 292.1 152.5 293.1 154 294.3 154.9 C 295.4 155.9 297 156.6 298.5 156.9 C 300 157.1 300 157.2 303.1 156.4 C 306.3 155.6 312.6 153.6 317.3 152.1 C 322 150.7 326.7 149.3 331.4 147.9 C 336.1 146.5 340.8 145.1 345.4 143.7 C 350.1 142.4 354.8 141.1 359.4 139.9 C 364 138.7 368.5 137.6 373.2 136.6 C 377.8 135.6 382.6 134.7 387.3 133.8 C 392 132.8 396.8 132 401.6 131.1 C 406.5 130.2 413.9 128.9 416.3 128.4 C 414.9 123 409.1 101 407.7 95.6 Z"/>
    <circle stroke-width="7" cx="600" cy="120" r="40"/>
    <path stroke-width="5" d="M 561.3 110 C 567.7 110.8 587.1 115 600 115 C 612.9 115 632.3 110.8 638.7 110"/>
    <path stroke-width="6" d="M 421.5 210.8 L 425.9 219.2 Q 426.7 220.7 428.4 221 L 437.8 222.7 Q 440.9 223.2 438.7 225.5 L 432.1 232.3 Q 430.9 233.5 431.1 235.2 L 432.5 244.7 Q 432.9 247.8 430.1 246.4 L 421.6 242.2 Q 420 241.4 418.4 242.2 L 409.9 246.4 Q 407.1 247.8 407.5 244.7 L 408.9 235.2 Q 409.1 233.5 407.9 232.3 L 401.3 225.5 Q 399.1 223.2 402.2 222.7 L 411.6 221 Q 413.3 220.7 414.1 219.2 L 418.5 210.8 Q 420 208 421.5 210.8 Z"/>
    <path stroke-width="6" d="M 721.7 187.3 L 727 197.3 Q 727.9 199.1 730 199.4 L 741 201.3 Q 744.7 202 742.1 204.7 L 734.3 212.7 Q 732.9 214.2 733.1 216.2 L 734.7 227.3 Q 735.3 231 731.9 229.4 L 721.8 224.4 Q 720 223.5 718.2 224.4 L 708.1 229.4 Q 704.7 231 705.3 227.3 L 706.9 216.2 Q 707.1 214.2 705.7 212.7 L 697.9 204.7 Q 695.3 202 699 201.3 L 710 199.4 Q 712.1 199.1 713 197.3 L 718.3 187.3 Q 720 184 721.7 187.3 Z"/>
    <path stroke-width="6" d="M 932.3 60.3 L 939.1 73.3 Q 940.4 75.7 943 76.2 L 957.5 78.7 Q 962.3 79.5 958.9 83 L 948.7 93.5 Q 946.8 95.5 947.2 98.1 L 949.3 112.7 Q 950 117.5 945.6 115.3 L 932.4 108.9 Q 930 107.7 927.6 108.9 L 914.4 115.3 Q 910 117.5 910.7 112.7 L 912.8 98.1 Q 913.2 95.5 911.3 93.5 L 901.1 83 Q 897.7 79.5 902.5 78.7 L 917 76.2 Q 919.6 75.7 920.9 73.3 L 927.7 60.3 Q 930 56 932.3 60.3 Z"/>
    <path stroke-width="6" d="M 941.6 309.1 L 946.5 318.2 Q 947.3 319.9 949.2 320.2 L 959.4 322 Q 962.8 322.6 960.4 325.1 L 953.2 332.5 Q 951.9 333.9 952.1 335.7 L 953.6 346 Q 954.1 349.4 951 347.9 L 941.7 343.3 Q 940 342.5 938.3 343.3 L 929 347.9 Q 925.9 349.4 926.4 346 L 927.9 335.7 Q 928.1 333.9 926.8 332.5 L 919.6 325.1 Q 917.2 322.6 920.6 322 L 930.8 320.2 Q 932.7 319.9 933.5 318.2 L 938.4 309.1 Q 940 306 941.6 309.1 Z"/>
    <path stroke-width="6" d="M 61.7 397.3 L 67 407.3 Q 67.9 409.1 70 409.4 L 81 411.3 Q 84.7 412 82.1 414.7 L 74.3 422.7 Q 72.9 424.2 73.1 426.2 L 74.7 437.3 Q 75.3 441 71.9 439.4 L 61.8 434.4 Q 60 433.5 58.2 434.4 L 48.1 439.4 Q 44.7 441 45.3 437.3 L 46.9 426.2 Q 47.1 424.2 45.7 422.7 L 37.9 414.7 Q 35.3 412 39 411.3 L 50 409.4 Q 52.1 409.1 53 407.3 L 58.3 397.3 Q 60 394 61.7 397.3 Z"/>
    <path stroke-width="6" d="M 231.5 360.8 L 235.9 369.2 Q 236.7 370.7 238.4 371 L 247.8 372.7 Q 250.9 373.2 248.7 375.5 L 242.1 382.3 Q 240.9 383.5 241.1 385.2 L 242.5 394.7 Q 242.9 397.8 240.1 396.4 L 231.6 392.2 Q 230 391.4 228.4 392.2 L 219.9 396.4 Q 217.1 397.8 217.5 394.7 L 218.9 385.2 Q 219.1 383.5 217.9 382.3 L 211.3 375.5 Q 209.1 373.2 212.2 372.7 L 221.6 371 Q 223.3 370.7 224.1 369.2 L 228.5 360.8 Q 230 358 231.5 360.8 Z"/>
    <path stroke-width="6" d="M 661.6 499.1 L 666.5 508.2 Q 667.3 509.9 669.2 510.2 L 679.4 512 Q 682.8 512.6 680.4 515.1 L 673.2 522.5 Q 671.9 523.9 672.1 525.7 L 673.6 536 Q 674.1 539.4 671 537.9 L 661.7 533.3 Q 660 532.5 658.3 533.3 L 649 537.9 Q 645.9 539.4 646.4 536 L 647.9 525.7 Q 648.1 523.9 646.8 522.5 L 639.6 515.1 Q 637.2 512.6 640.6 512 L 650.8 510.2 Q 652.7 509.9 653.5 508.2 L 658.4 499.1 Q 660 496 661.6 499.1 Z"/>
    <path stroke-width="6" d="M 945.3 502.5 L 949.4 510.2 Q 950.1 511.6 951.7 511.9 L 960.2 513.3 Q 963 513.8 961 515.9 L 955 522.1 Q 953.9 523.2 954.1 524.8 L 955.3 533.3 Q 955.8 536.2 953.2 534.9 L 945.4 531.1 Q 944 530.4 942.6 531.1 L 934.8 534.9 Q 932.2 536.2 932.7 533.3 L 933.9 524.8 Q 934.1 523.2 933 522.1 L 927 515.9 Q 925 513.8 927.8 513.3 L 936.3 511.9 Q 937.9 511.6 938.6 510.2 L 942.7 502.5 Q 944 500 945.3 502.5 Z"/>
    <circle fill="#111" stroke="none" cx="300" cy="214" r="6"/>
    <circle fill="#111" stroke="none" cx="520" cy="40" r="6"/>
    <circle fill="#111" stroke="none" cx="820" cy="120" r="6"/>
    <circle fill="#111" stroke="none" cx="690" cy="340" r="6"/>
    <circle fill="#111" stroke="none" cx="60" cy="300" r="6"/>
    <circle fill="#111" stroke="none" cx="300" cy="560" r="6"/>
    <circle fill="#111" stroke="none" cx="560" cy="220" r="6"/>
    <circle fill="#111" stroke="none" cx="958" cy="226" r="6"/>
    <circle fill="#111" stroke="none" cx="70" cy="570" r="6"/>
    <circle fill="#111" stroke="none" cx="960" cy="440" r="6"/>
  </g>
</svg>
`,Ne=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sun -->
    <circle stroke-width="10" cx="218" cy="218" r="104"/>
    <path stroke-width="10" d="M 343.9 273.6 L 375.5 267.7 Q 391.9 264.6 379.2 253.8 L 354.8 232.8 Q 349.8 228.5 347.5 236.8 Q 339.7 250.6 339.6 266.5 Q 337.4 274.8 343.9 273.6 Z"/>
    <path stroke-width="10" d="M 299.2 329.1 L 329.6 339.8 Q 345.3 345.3 339.8 329.6 L 329.1 299.2 Q 326.9 293 320.8 299.1 Q 307.1 307.1 299.1 320.8 Q 293 326.9 299.2 329.1 Z"/>
    <path stroke-width="10" d="M 232.8 354.8 L 253.8 379.2 Q 264.6 391.9 267.7 375.5 L 273.6 343.9 Q 274.8 337.4 266.5 339.6 Q 250.6 339.7 236.8 347.5 Q 228.5 349.8 232.8 354.8 Z"/>
    <path stroke-width="10" d="M 162.4 343.9 L 168.3 375.5 Q 171.4 391.9 182.2 379.2 L 203.2 354.8 Q 207.5 349.8 199.2 347.5 Q 185.4 339.7 169.5 339.6 Q 161.2 337.4 162.4 343.9 Z"/>
    <path stroke-width="10" d="M 106.9 299.2 L 96.2 329.6 Q 90.7 345.3 106.4 339.8 L 136.8 329.1 Q 143 326.9 136.9 320.8 Q 128.9 307.1 115.2 299.1 Q 109.1 293 106.9 299.2 Z"/>
    <path stroke-width="10" d="M 81.2 232.8 L 56.8 253.8 Q 44.1 264.6 60.5 267.7 L 92.1 273.6 Q 98.6 274.8 96.4 266.5 Q 96.3 250.6 88.5 236.8 Q 86.2 228.5 81.2 232.8 Z"/>
    <path stroke-width="10" d="M 92.1 162.4 L 60.5 168.3 Q 44.1 171.4 56.8 182.2 L 81.2 203.2 Q 86.2 207.5 88.5 199.2 Q 96.3 185.4 96.4 169.5 Q 98.6 161.2 92.1 162.4 Z"/>
    <path stroke-width="10" d="M 136.8 106.9 L 106.4 96.2 Q 90.7 90.7 96.2 106.4 L 106.9 136.8 Q 109.1 143 115.2 136.9 Q 128.9 128.9 136.9 115.2 Q 143 109.1 136.8 106.9 Z"/>
    <path stroke-width="10" d="M 203.2 81.2 L 182.2 56.8 Q 171.4 44.1 168.3 60.5 L 162.4 92.1 Q 161.2 98.6 169.5 96.4 Q 185.4 96.3 199.2 88.5 Q 207.5 86.2 203.2 81.2 Z"/>
    <path stroke-width="10" d="M 273.6 92.1 L 267.7 60.5 Q 264.6 44.1 253.8 56.8 L 232.8 81.2 Q 228.5 86.2 236.8 88.5 Q 250.6 96.3 266.5 96.4 Q 274.8 98.6 273.6 92.1 Z"/>
    <path stroke-width="10" d="M 329.1 136.8 L 339.8 106.4 Q 345.3 90.7 329.6 96.2 L 299.2 106.9 Q 293 109.1 299.1 115.2 Q 307.1 128.9 320.8 136.9 Q 326.9 143 329.1 136.8 Z"/>
    <path stroke-width="10" d="M 354.8 203.2 L 379.2 182.2 Q 391.9 171.4 375.5 168.3 L 343.9 162.4 Q 337.4 161.2 339.6 169.5 Q 339.7 185.4 347.5 199.2 Q 349.8 207.5 354.8 203.2 Z"/>
    <circle cx="180" cy="196" r="25" stroke-width="7"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 167.7 198.9 a 13.5 13.5 0 1 0 27 0 a 13.5 13.5 0 1 0 -27 0 Z M 168.9 193.7 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <circle cx="256" cy="196" r="25" stroke-width="7"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 241.3 198.9 a 13.5 13.5 0 1 0 27 0 a 13.5 13.5 0 1 0 -27 0 Z M 242.6 193.7 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <path stroke-width="7" d="M 172 248 Q 218 292 264 248"/>
    <circle stroke-width="7" cx="148" cy="250" r="15"/>
    <circle stroke-width="7" cx="288" cy="250" r="15"/>
    <!-- ringed planets -->
    <path stroke-width="10" d="M 742.1 647.9 C 740.9 650.9 737.5 660.2 734.7 666.1 C 731.8 671.9 728.5 677.6 724.9 683.1 C 721.3 688.5 717.3 693.7 713 698.7 C 708.7 703.6 704 708.3 699.1 712.6 C 694.2 716.9 689 720.9 683.6 724.5 C 678.2 728.2 672.5 731.5 666.6 734.4 C 660.8 737.3 654.7 739.8 648.5 741.9 C 642.3 744 636 745.8 629.6 747.1 C 623.2 748.3 616.6 749.2 610.1 749.7 C 603.6 750.1 597 750.1 590.5 749.7 C 584 749.3 577.5 748.4 571 747.2 C 564.6 745.9 558.3 744.2 552.1 742.1 C 545.9 740.1 539.8 737.5 533.9 734.7 C 528.1 731.8 523.1 729.2 516.9 724.9 C 510.8 720.6 500.3 711.7 497 709"/>
    <path stroke-width="10" d="M 467.5 670.4 C 466.2 667.4 461.8 658.6 459.5 652.5 C 457.2 646.4 455.3 640.1 453.8 633.7 C 452.4 627.4 451.3 620.8 450.7 614.4 C 450.1 607.9 449.9 601.3 450.1 594.7 C 450.3 588.2 451 581.7 452.1 575.2 C 453.1 568.8 454.7 562.4 456.6 556.1 C 458.5 549.9 460.8 543.7 463.5 537.8 C 466.2 531.8 469.3 526 472.8 520.5 C 476.3 515 480.1 509.6 484.3 504.6 C 488.4 499.5 492.9 494.7 497.7 490.3 C 502.5 485.8 507.6 481.7 512.9 477.9 C 518.2 474.1 523.8 470.6 529.6 467.5 C 535.4 464.5 541.4 461.8 547.5 459.5 C 553.6 457.2 559.9 455.3 566.3 453.8 C 572.6 452.4 579.2 451.3 585.6 450.7 C 592.1 450.1 598.7 449.9 605.3 450.1 C 611.8 450.3 618.3 451 624.8 452.1 C 631.2 453.1 637.6 454.7 643.9 456.6 C 650.1 458.5 656.3 460.8 662.2 463.5 C 668.2 466.2 674 469.3 679.5 472.8 C 685 476.3 690.4 480.1 695.4 484.3 C 700.5 488.4 705.3 492.9 709.7 497.7 C 714.2 502.5 718.3 507.6 722.1 512.9 C 725.9 518.2 729.4 523.8 732.5 529.6 C 735.5 535.4 738.2 541.4 740.5 547.5 C 742.8 553.6 744.7 559.9 746.2 566.3 C 747.6 572.6 748.7 580 749.3 585.6 C 750 591.3 749.9 597.6 750 600"/>
    <path stroke-width="10" d="M 703 491 C 708.5 490.6 725.5 489.2 736.2 488.7 C 746.8 488.3 757.2 488.2 767 488.4 C 776.8 488.6 786.2 489.1 794.9 490 C 803.7 490.8 812 492 819.5 493.4 C 827.1 494.9 834.1 496.6 840.4 498.7 C 846.7 500.7 852.3 503.1 857.2 505.7 C 862 508.3 866.2 511.2 869.5 514.3 C 872.9 517.5 875.5 520.8 877.3 524.4 C 879 528 880.1 531.8 880.3 535.8 C 880.5 539.8 879.8 544 878.5 548.3 C 877.1 552.6 874.9 557.1 871.9 561.7 C 868.9 566.2 865.2 570.9 860.7 575.7 C 856.2 580.4 850.9 585.3 845 590.1 C 839.1 595 832.4 599.9 825.1 604.7 C 817.9 609.6 809.9 614.5 801.4 619.3 C 792.9 624.1 783.8 628.8 774.3 633.5 C 764.7 638.1 754.6 642.7 744.1 647.1 C 733.6 651.5 722.7 655.8 711.5 659.9 C 700.3 664 688.7 668 677 671.7 C 665.2 675.4 653.2 679 641.1 682.3 C 629.1 685.6 616.8 688.6 604.6 691.4 C 592.4 694.2 580.1 696.8 568 699 C 555.9 701.3 543.7 703.3 531.9 704.9 C 520.1 706.6 508.3 708 497 709 C 485.7 710.1 474.5 710.8 463.8 711.3 C 453.2 711.7 442.8 711.8 433 711.6 C 423.2 711.4 413.8 710.9 405.1 710 C 396.3 709.2 388 708 380.5 706.6 C 372.9 705.1 365.9 703.4 359.6 701.3 C 353.3 699.3 347.7 696.9 342.8 694.3 C 338 691.7 333.8 688.8 330.5 685.7 C 327.1 682.5 324.5 679.2 322.7 675.6 C 321 672 319.9 668.2 319.7 664.2 C 319.5 660.2 320.2 656 321.5 651.7 C 322.9 647.4 325.1 642.9 328.1 638.3 C 331.1 633.8 334.8 629.1 339.3 624.3 C 343.8 619.6 349.1 614.7 355 609.9 C 360.9 605 367.6 600.1 374.9 595.3 C 382.1 590.4 390.1 585.5 398.6 580.7 C 407.1 575.9 415.9 571.3 425.7 566.5 C 435.6 561.8 452.5 554.5 457.9 552.1"/>
    <path stroke-width="10" d="M 732.5 529.6 C 735.6 529.7 745.3 529.7 751.1 530.1 C 756.9 530.5 762.3 531 767.1 531.8 C 772 532.5 776.5 533.5 780.3 534.6 C 784.2 535.8 787.6 537.1 790.5 538.6 C 793.3 540.1 795.6 541.8 797.3 543.7 C 799 545.5 800.2 547.5 800.8 549.6 C 801.4 551.8 801.4 554.1 800.8 556.5 C 800.3 558.9 799.1 561.5 797.4 564.1 C 795.7 566.7 793.4 569.5 790.6 572.3 C 787.8 575.1 784.5 578 780.6 581 C 776.7 583.9 772.3 587 767.5 590 C 762.6 593 757.3 596.1 751.5 599.2 C 745.7 602.3 739.5 605.3 732.9 608.4 C 726.3 611.4 719.3 614.5 712 617.4 C 704.8 620.4 697.1 623.3 689.3 626.2 C 681.4 629 673.3 631.8 665 634.5 C 656.7 637.2 648.1 639.8 639.6 642.2 C 631 644.7 622.2 647 613.5 649.2 C 604.7 651.4 595.9 653.5 587.1 655.4 C 578.4 657.2 569.6 659 561 660.6 C 552.4 662.1 543.9 663.5 535.6 664.7 C 527.3 665.9 519.1 667 511.3 667.8 C 503.4 668.6 495.7 669.3 488.5 669.7 C 481.2 670.1 474.1 670.4 467.5 670.4 C 461 670.4 454.7 670.3 448.9 669.9 C 443.1 669.5 437.7 669 432.9 668.2 C 428 667.5 423.5 666.5 419.7 665.4 C 415.8 664.2 412.4 662.9 409.5 661.4 C 406.7 659.9 404.4 658.2 402.7 656.3 C 401 654.5 399.8 652.5 399.2 650.4 C 398.6 648.2 398.6 645.9 399.2 643.5 C 399.7 641.1 400.9 638.5 402.6 635.9 C 404.3 633.3 406.6 630.5 409.4 627.7 C 412.2 624.9 415.5 622 419.4 619 C 423.3 616.1 427.4 613.2 432.5 610 C 437.6 606.8 447.1 601.7 450 600"/>
    <path stroke-width="7" d="M 470 525.2 C 487.8 522.2 541.8 515.6 576.8 506.9 C 611.7 498.1 662.6 478.6 679.7 472.9"/>
    <path stroke-width="7" d="M 450.7 585.7 C 473.9 581.3 544.1 570.7 589.8 559.2 C 635.6 547.8 702.6 524.3 725.1 517.3"/>
    <path stroke-width="10" d="M 854.4 280.2 C 853.1 281 849.2 283.7 846.5 285.2 C 843.7 286.7 840.8 288 837.9 289.2 C 835 290.3 832 291.2 828.9 292 C 825.9 292.7 822.8 293.3 819.7 293.6 C 816.5 293.9 813.4 294.1 810.2 294 C 807.1 293.9 804 293.6 800.9 293.1 C 797.8 292.6 794.7 292 791.7 291.1 C 788.7 290.2 785.7 289.1 782.8 287.8 C 780 286.6 777.2 285.1 774.5 283.5 C 771.8 281.8 769.2 280 766.8 278 C 764.4 276.1 762 273.9 759.9 271.7 C 757.7 269.4 755.7 267 753.8 264.4 C 752 261.9 750.3 259.2 748.8 256.5 C 747.3 253.7 745.9 250.8 744.8 247.9 C 743.7 245.1 742.6 240.7 742.1 239.3"/>
    <path stroke-width="10" d="M 740.3 215.9 C 740.5 214.3 741 209.6 741.7 206.6 C 742.3 203.5 743.2 200.5 744.3 197.5 C 745.4 194.6 746.6 191.7 748.1 188.9 C 749.5 186.1 751.1 183.4 752.9 180.8 C 754.7 178.2 756.7 175.8 758.8 173.5 C 760.9 171.1 763.2 169 765.6 166.9 C 768 164.9 770.6 163 773.2 161.4 C 775.8 159.7 778.6 158.1 781.4 156.8 C 784.3 155.5 787.2 154.3 790.2 153.4 C 793.2 152.4 796.3 151.7 799.4 151.1 C 802.4 150.6 805.6 150.2 808.7 150.1 C 811.8 149.9 815 150 818.1 150.3 C 821.3 150.5 824.4 151 827.4 151.7 C 830.5 152.3 833.5 153.2 836.5 154.3 C 839.4 155.4 842.3 156.6 845.1 158.1 C 847.9 159.5 850.6 161.1 853.2 162.9 C 855.8 164.7 858.2 166.7 860.5 168.8 C 862.9 170.9 865 173.2 867.1 175.6 C 869.1 178 871 180.6 872.6 183.2 C 874.3 185.8 875.9 188.6 877.2 191.4 C 878.5 194.3 879.7 197.2 880.6 200.2 C 881.6 203.2 882.3 206.3 882.9 209.4 C 883.4 212.4 883.8 215.6 883.9 218.7 C 884.1 221.8 884 225 883.7 228.1 C 883.5 231.3 883 234.4 882.3 237.4 C 881.7 240.5 880.8 243.5 879.7 246.5 C 878.6 249.4 877.4 252.3 875.9 255.1 C 874.5 257.9 871.7 262 870.9 263.4"/>
    <path stroke-width="10" d="M 881.9 204.7 C 884.2 206 891.2 210 895.5 212.7 C 899.8 215.4 903.9 218.2 907.7 220.9 C 911.5 223.7 915.1 226.4 918.3 229.1 C 921.5 231.9 924.4 234.6 927 237.2 C 929.6 239.9 931.9 242.5 933.8 245.1 C 935.7 247.6 937.3 250.1 938.5 252.5 C 939.7 254.9 940.5 257.2 941 259.4 C 941.5 261.6 941.6 263.7 941.3 265.7 C 941 267.6 940.4 269.5 939.4 271.2 C 938.4 272.9 937.1 274.5 935.3 275.9 C 933.6 277.3 931.6 278.5 929.2 279.6 C 926.8 280.7 924 281.7 921 282.4 C 917.9 283.2 914.5 283.8 910.9 284.2 C 907.3 284.6 903.3 284.8 899.2 284.8 C 895 284.9 890.5 284.7 885.9 284.4 C 881.3 284.1 876.4 283.6 871.4 283 C 866.4 282.3 861.2 281.5 855.9 280.5 C 850.6 279.5 845.1 278.3 839.6 276.9 C 834.1 275.6 828.5 274.1 822.9 272.5 C 817.3 270.9 811.6 269.1 806 267.2 C 800.3 265.3 794.7 263.2 789.1 261.1 C 783.6 259 778.1 256.7 772.7 254.3 C 767.3 252 762 249.5 756.9 247 C 751.8 244.5 746.8 241.9 742.1 239.3 C 737.4 236.7 732.8 234 728.5 231.3 C 724.2 228.6 720.1 225.8 716.3 223.1 C 712.5 220.3 708.9 217.6 705.7 214.9 C 702.5 212.1 699.6 209.4 697 206.8 C 694.4 204.1 692.1 201.5 690.2 198.9 C 688.3 196.4 686.7 193.9 685.5 191.5 C 684.3 189.1 683.5 186.8 683 184.6 C 682.5 182.4 682.4 180.3 682.7 178.3 C 683 176.4 683.6 174.5 684.6 172.8 C 685.6 171.1 686.9 169.5 688.7 168.1 C 690.4 166.7 692.4 165.5 694.8 164.4 C 697.2 163.3 700 162.3 703 161.6 C 706.1 160.8 709.5 160.2 713.1 159.8 C 716.7 159.4 720.7 159.2 724.8 159.2 C 729 159.1 733.5 159.3 738.1 159.6 C 742.7 159.9 747.3 160.3 752.6 161 C 757.8 161.7 766.7 163.4 769.6 163.8"/>
    <path stroke-width="10" d="M 883.7 228.1 C 885 229 889 231.8 891.3 233.5 C 893.6 235.3 895.6 237 897.5 238.7 C 899.3 240.4 900.9 242.1 902.2 243.6 C 903.5 245.2 904.6 246.8 905.4 248.2 C 906.2 249.6 906.7 251 907 252.3 C 907.2 253.6 907.2 254.8 906.9 255.9 C 906.6 257 906.1 258 905.2 258.9 C 904.4 259.8 903.3 260.6 902 261.2 C 900.6 261.9 899 262.5 897.2 262.9 C 895.3 263.4 893.2 263.7 890.9 263.9 C 888.6 264.1 886.1 264.2 883.3 264.2 C 880.6 264.2 877.6 264 874.5 263.8 C 871.4 263.5 868 263.1 864.6 262.6 C 861.1 262.1 857.5 261.5 853.8 260.8 C 850.1 260 846.2 259.2 842.3 258.2 C 838.4 257.3 834.3 256.2 830.2 255.1 C 826.2 254 822 252.7 817.9 251.4 C 813.8 250.1 809.6 248.7 805.5 247.2 C 801.3 245.7 797.2 244.2 793.1 242.6 C 789.1 241 785 239.3 781.1 237.6 C 777.2 235.9 773.3 234.1 769.6 232.3 C 765.9 230.5 762.3 228.7 758.9 226.9 C 755.4 225.1 752.1 223.2 749 221.4 C 745.9 219.5 743 217.7 740.3 215.9 C 737.5 214 735 212.2 732.7 210.5 C 730.4 208.7 728.4 207 726.5 205.3 C 724.7 203.6 723.1 201.9 721.8 200.4 C 720.5 198.8 719.4 197.2 718.6 195.8 C 717.8 194.4 717.3 193 717 191.7 C 716.8 190.4 716.8 189.2 717.1 188.1 C 717.4 187 717.9 186 718.8 185.1 C 719.6 184.2 720.7 183.4 722 182.8 C 723.4 182.1 725 181.5 726.8 181.1 C 728.7 180.6 730.8 180.3 733.1 180.1 C 735.4 179.9 737.9 179.8 740.7 179.8 C 743.4 179.8 747.4 180.1 749.5 180.2 C 751.6 180.4 752.5 180.5 753.1 180.6"/>
    <path stroke-width="7" d="M 762.3 169.9 C 772.2 174.3 801 189.3 821.2 196.6 C 841.4 204 873.2 211.1 883.6 214"/>
    <!-- little planets -->
    <circle stroke-width="10" cx="176" cy="808" r="88"/>
    <path stroke-width="7" d="M 96.6 770 C 109.9 771.3 149.5 778 176 778 C 202.5 778 242.1 771.3 255.4 770"/>
    <path stroke-width="7" d="M 91.9 834 C 105.9 835.3 148 842 176 842 C 204 842 246.1 835.3 260.1 834"/>
    <circle stroke-width="7" cx="206" cy="800" r="14"/>
    <circle stroke-width="7" cx="146" cy="862" r="12"/>
    <circle stroke-width="10" cx="436" cy="872" r="44"/>
    <path stroke-width="7" d="M 392.7 864 C 399.9 865 421.6 870 436 870 C 450.4 870 472.1 865 479.3 864"/>
    <!-- stars -->
    <path stroke-width="8" d="M 472.6 76.8 L 480.2 91.4 Q 481.6 94 484.6 94.5 L 500.7 97.3 Q 506.1 98.3 502.3 102.2 L 490.9 114 Q 488.8 116.1 489.2 119.1 L 491.6 135.3 Q 492.3 140.7 487.4 138.3 L 472.7 131.1 Q 470 129.8 467.3 131.1 L 452.6 138.3 Q 447.7 140.7 448.4 135.3 L 450.8 119.1 Q 451.2 116.1 449.1 114 L 437.7 102.2 Q 433.9 98.3 439.3 97.3 L 455.4 94.5 Q 458.4 94 459.8 91.4 L 467.4 76.8 Q 470 72 472.6 76.8 Z"/>
    <path stroke-width="8" d="M 642 223.8 L 648.1 235.3 Q 649.2 237.4 651.5 237.8 L 664.3 240 Q 668.5 240.7 665.5 243.8 L 656.5 253.1 Q 654.8 254.8 655.2 257.2 L 657 270 Q 657.6 274.3 653.8 272.4 L 642.1 266.6 Q 640 265.6 637.9 266.6 L 626.2 272.4 Q 622.4 274.3 623 270 L 624.8 257.2 Q 625.2 254.8 623.5 253.1 L 614.5 243.8 Q 611.5 240.7 615.7 240 L 628.5 237.8 Q 630.8 237.4 631.9 235.3 L 638 223.8 Q 640 220 642 223.8 Z"/>
    <path stroke-width="8" d="M 561.6 45.1 L 566.5 54.2 Q 567.3 55.9 569.2 56.2 L 579.4 58 Q 582.8 58.6 580.4 61.1 L 573.2 68.5 Q 571.9 69.9 572.1 71.7 L 573.6 82 Q 574.1 85.4 571 83.9 L 561.7 79.3 Q 560 78.5 558.3 79.3 L 549 83.9 Q 545.9 85.4 546.4 82 L 547.9 71.7 Q 548.1 69.9 546.8 68.5 L 539.6 61.1 Q 537.2 58.6 540.6 58 L 550.8 56.2 Q 552.7 55.9 553.5 54.2 L 558.4 45.1 Q 560 42 561.6 45.1 Z"/>
    <path stroke-width="8" d="M 922 433.8 L 928.1 445.3 Q 929.2 447.4 931.5 447.8 L 944.3 450 Q 948.5 450.7 945.5 453.8 L 936.5 463.1 Q 934.8 464.8 935.2 467.2 L 937 480 Q 937.6 484.3 933.8 482.4 L 922.1 476.6 Q 920 475.6 917.9 476.6 L 906.2 482.4 Q 902.4 484.3 903 480 L 904.8 467.2 Q 905.2 464.8 903.5 463.1 L 894.5 453.8 Q 891.5 450.7 895.7 450 L 908.5 447.8 Q 910.8 447.4 911.9 445.3 L 918 433.8 Q 920 430 922 433.8 Z"/>
    <path stroke-width="8" d="M 74.3 440.3 L 81.1 453.3 Q 82.4 455.7 85 456.2 L 99.5 458.7 Q 104.3 459.5 100.9 463 L 90.7 473.5 Q 88.8 475.5 89.2 478.1 L 91.3 492.7 Q 92 497.5 87.6 495.3 L 74.4 488.9 Q 72 487.7 69.6 488.9 L 56.4 495.3 Q 52 497.5 52.7 492.7 L 54.8 478.1 Q 55.2 475.5 53.3 473.5 L 43.1 463 Q 39.7 459.5 44.5 458.7 L 59 456.2 Q 61.6 455.7 62.9 453.3 L 69.7 440.3 Q 72 436 74.3 440.3 Z"/>
    <path stroke-width="8" d="M 352 393.8 L 358.1 405.3 Q 359.2 407.4 361.5 407.8 L 374.3 410 Q 378.5 410.7 375.5 413.8 L 366.5 423.1 Q 364.8 424.8 365.2 427.2 L 367 440 Q 367.6 444.3 363.8 442.4 L 352.1 436.6 Q 350 435.6 347.9 436.6 L 336.2 442.4 Q 332.4 444.3 333 440 L 334.8 427.2 Q 335.2 424.8 333.5 423.1 L 324.5 413.8 Q 321.5 410.7 325.7 410 L 338.5 407.8 Q 340.8 407.4 341.9 405.3 L 348 393.8 Q 350 390 352 393.8 Z"/>
    <path stroke-width="8" d="M 932.4 848.6 L 939.7 862.4 Q 941 864.9 943.8 865.3 L 959.1 868 Q 964.2 868.9 960.6 872.6 L 949.8 883.8 Q 947.8 885.8 948.2 888.6 L 950.4 904 Q 951.2 909.1 946.5 906.8 L 932.5 900 Q 930 898.7 927.5 900 L 913.5 906.8 Q 908.8 909.1 909.6 904 L 911.8 888.6 Q 912.2 885.8 910.2 883.8 L 899.4 872.6 Q 895.8 868.9 900.9 868 L 916.2 865.3 Q 919 864.9 920.3 862.4 L 927.6 848.6 Q 930 844 932.4 848.6 Z"/>
    <path stroke-width="8" d="M 691.9 875.6 L 697.5 886.3 Q 698.6 888.2 700.7 888.6 L 712.7 890.7 Q 716.6 891.3 713.8 894.2 L 705.4 902.9 Q 703.8 904.5 704.2 906.7 L 705.9 918.7 Q 706.5 922.7 702.8 920.9 L 692 915.5 Q 690 914.6 688 915.5 L 677.2 920.9 Q 673.5 922.7 674.1 918.7 L 675.8 906.7 Q 676.2 904.5 674.6 902.9 L 666.2 894.2 Q 663.4 891.3 667.3 890.7 L 679.3 888.6 Q 681.4 888.2 682.5 886.3 L 688.1 875.6 Q 690 872 691.9 875.6 Z"/>
    <path stroke-width="8" d="M 291.7 737.3 L 297 747.3 Q 297.9 749.1 300 749.4 L 311 751.3 Q 314.7 752 312.1 754.7 L 304.3 762.7 Q 302.9 764.2 303.1 766.2 L 304.7 777.3 Q 305.3 781 301.9 779.4 L 291.8 774.4 Q 290 773.5 288.2 774.4 L 278.1 779.4 Q 274.7 781 275.3 777.3 L 276.9 766.2 Q 277.1 764.2 275.7 762.7 L 267.9 754.7 Q 265.3 752 269 751.3 L 280 749.4 Q 282.1 749.1 283 747.3 L 288.3 737.3 Q 290 734 291.7 737.3 Z"/>
    <circle fill="#111" stroke="none" cx="700" cy="120" r="7"/>
    <circle fill="#111" stroke="none" cx="960" cy="350" r="7"/>
    <circle fill="#111" stroke="none" cx="60" cy="640" r="7"/>
    <circle fill="#111" stroke="none" cx="300" cy="950" r="7"/>
    <circle fill="#111" stroke="none" cx="580" cy="950" r="7"/>
    <circle fill="#111" stroke="none" cx="830" cy="760" r="7"/>
    <circle fill="#111" stroke="none" cx="960" cy="60" r="7"/>
    <circle fill="#111" stroke="none" cx="60" cy="960" r="7"/>
  </g>
</svg>
`,Pe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- stars -->
    <path stroke-width="12" d="M 184.3 151 L 198.3 174.4 Q 200.9 178.6 205.8 178.9 L 233 180.3 Q 242.1 180.8 236.1 187.6 L 218.3 208.2 Q 215 211.9 216.3 216.7 L 223.3 243 Q 225.7 251.8 217.3 248.2 L 192.2 237.6 Q 187.7 235.7 183.5 238.4 L 160.7 253.2 Q 153.1 258.1 153.9 249.1 L 156.2 222 Q 156.6 217 152.8 213.9 L 131.6 196.8 Q 124.6 191.1 133.4 189 L 160 182.9 Q 164.8 181.8 166.6 177.1 L 176.3 151.7 Q 179.6 143.2 184.3 151 Z"/>
    <path stroke-width="12" d="M 829.1 141.9 L 837.1 162.2 Q 838.6 165.9 842.5 166.8 L 863.7 172 Q 870.7 173.8 865.1 178.4 L 848.3 192.3 Q 845.3 194.9 845.6 198.8 L 847.2 220.6 Q 847.8 227.9 841.6 224 L 823.1 212.3 Q 819.8 210.2 816.1 211.7 L 795.9 220 Q 789.2 222.7 791 215.7 L 796.4 194.5 Q 797.3 190.7 794.8 187.7 L 780.7 171 Q 776 165.5 783.2 165 L 805 163.6 Q 809 163.3 811.1 159.9 L 822.5 141.4 Q 826.4 135.2 829.1 141.9 Z"/>
    <path stroke-width="12" d="M 174.9 571.1 L 180.6 590.4 Q 181.6 594 185.1 595.1 L 204.2 601.5 Q 210.6 603.6 205 607.4 L 188.4 618.8 Q 185.4 620.8 185.4 624.5 L 185.2 644.6 Q 185.2 651.3 179.8 647.3 L 163.9 635 Q 161 632.7 157.5 633.9 L 138.3 639.9 Q 131.9 642 134.2 635.6 L 140.9 616.7 Q 142.1 613.2 140 610.2 L 128.3 593.9 Q 124.4 588.4 131.1 588.6 L 151.2 589.1 Q 154.9 589.2 157 586.3 L 169 570.1 Q 173 564.7 174.9 571.1 Z"/>
    <path stroke-width="12" d="M 834.9 569.8 L 849.8 590.5 Q 852.5 594.3 857.2 594.1 L 882.7 593.1 Q 891.2 592.8 886.2 599.6 L 871.1 620.2 Q 868.3 624 869.9 628.3 L 878.8 652.3 Q 881.7 660.3 873.6 657.6 L 849.4 649.6 Q 845 648.2 841.3 651 L 821.3 666.9 Q 814.6 672.1 814.6 663.6 L 814.7 638.1 Q 814.7 633.4 810.9 630.8 L 789.6 616.7 Q 782.6 611.9 790.7 609.3 L 815 601.5 Q 819.4 600.1 820.7 595.7 L 827.6 571.1 Q 829.9 562.9 834.9 569.8 Z"/>
    <!-- rocket -->
    <path stroke-width="14" d="M 381 520 C 372.5 529.7 343.5 554.3 330 578 C 316.5 601.7 306.7 631 300 662 C 293.3 693 291.7 747 290 764 C 298.7 759.7 323.3 750.3 342 738 C 360.7 725.7 392 698 402 690"/>
    <path stroke-width="14" d="M 619 520 C 627.5 529.7 656.5 554.3 670 578 C 683.5 601.7 693.3 631 700 662 C 706.7 693 708.3 747 710 764 C 701.3 759.7 676.7 750.3 658 738 C 639.3 725.7 608 698 598 690"/>
    <path stroke-width="14" d="M 500 88 C 511.3 101.3 550.8 139 568 168 C 585.2 197 594.8 226.7 603 262 C 611.2 297.3 614.3 337 617 380 C 619.7 423 619 489.7 619 520 C 619 550.3 618.2 546 617 562 C 615.8 578 615.2 594.7 612 616 C 608.8 637.3 600.3 677.7 598 690 C 581.7 693 532.7 708 500 708 C 467.3 708 418.3 693 402 690 C 399.7 677.7 391.2 637.3 388 616 C 384.8 594.7 384.2 578 383 562 C 381.8 546 381 550.3 381 520 C 381 489.7 380.3 423 383 380 C 385.7 337 388.8 297.3 397 262 C 405.2 226.7 414.8 197 432 168 C 449.2 139 488.7 101.3 500 88 Z"/>
    <path d="M 403 262 C 419.2 266.7 467.7 290 500 290 C 532.3 290 580.8 266.7 597 262"/>
    <path d="M 383 562 C 402.5 564.3 461 576 500 576 C 539 576 597.5 564.3 617 562"/>
    <path d="M 388 616 C 406.7 618.3 462.7 630 500 630 C 537.3 630 593.3 618.3 612 616"/>
    <circle stroke-width="12" cx="500" cy="410" r="72"/>
    <circle cx="500" cy="410" r="48"/>
    <!-- engine and flame -->
    <path stroke-width="14" d="M 452 701.7 L 436 750 L 564 750 L 548 701.7"/>
    <path stroke-width="14" d="M 436 750 C 431 758 412.3 781 406 798 C 399.7 815 396 833 398 852 C 400 871 414.7 902 418 912 C 424.7 910 444.3 892.3 458 900 C 471.7 907.7 493 948.3 500 958 C 507 948.3 528.3 907.7 542 900 C 555.7 892.3 575.3 910 582 912 C 585.3 902 600 871 602 852 C 604 833 600.3 815 594 798 C 587.7 781 569 758 564 750"/>
    <path d="M 500 782 C 506 788.7 530 808.7 536 822 C 542 835.3 542 849 536 862 C 530 875 506 893.7 500 900 C 494 893.7 470 875 464 862 C 458 849 458 835.3 464 822 C 470 808.7 494 788.7 500 782 Z"/>
  </g>
</svg>
`,Fe=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <path id="digger-cloud" d="M -85 30 A 30 30 0 0 1 -62 -12 A 42 42 0 0 1 6 -38 A 36 36 0 0 1 66 -8 A 28 28 0 0 1 85 30 Z"/>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sky -->
    <circle cx="125" cy="130" r="48" stroke-width="9"/>
    <path stroke-width="8" d="M 125 66 L 125 44 M 170.3 84.7 L 185.8 69.2 M 189 130 L 211 130 M 170.3 175.3 L 185.8 190.8 M 125 194 L 125 216 M 79.7 175.3 L 64.2 190.8 M 61 130 L 39 130 M 79.7 84.7 L 64.2 69.2"/>
    <use href="#digger-cloud" transform="translate(450 125)" stroke-width="9"/>
    <use href="#digger-cloud" transform="translate(885 105) scale(0.8)" stroke-width="11"/>
    <!-- ground, dirt pile, pebbles -->
    <path stroke-width="10" d="M -10 800 L 1010 800"/>
    <path stroke-width="9" d="M 625 800 C 665 762 725 752 790 755 C 860 758 930 770 965 800"/>
    <g fill="#111" stroke="none">
      <circle cx="720" cy="782" r="6"/><circle cx="790" cy="778" r="5"/><circle cx="860" cy="784" r="6"/><circle cx="915" cy="788" r="5"/>
    </g>
    <ellipse cx="160" cy="885" rx="34" ry="18" stroke-width="8"/>
    <ellipse cx="470" cy="925" rx="26" ry="14" stroke-width="8"/>
    <ellipse cx="800" cy="890" rx="38" ry="20" stroke-width="8"/>
    <!-- smoke -->
    <circle cx="200" cy="385" r="16" stroke-width="8"/>
    <circle cx="228" cy="340" r="22" stroke-width="8"/>
    <!-- tracks -->
    <path stroke-width="11" d="M 130 800 L 560 800 Q 600 800 603 760 L 598 722 Q 592 680 552 680 L 140 680 Q 100 680 96 722 L 92 760 Q 92 800 130 800 Z"/>
    <circle cx="165" cy="741" r="34" stroke-width="8"/>
    <circle cx="275" cy="741" r="34" stroke-width="8"/>
    <circle cx="385" cy="741" r="34" stroke-width="8"/>
    <circle cx="495" cy="741" r="34" stroke-width="8"/>
    <g fill="#111" stroke="none">
      <circle cx="165" cy="741" r="9"/><circle cx="275" cy="741" r="9"/><circle cx="385" cy="741" r="9"/><circle cx="495" cy="741" r="9"/>
    </g>
    <!-- turntable and deck -->
    <path stroke-width="9" d="M 230 645 L 230 680 M 450 645 L 450 680"/>
    <rect x="100" y="555" width="500" height="90" rx="20" stroke-width="11"/>
    <!-- engine with exhaust -->
    <path stroke-width="11" d="M 120 555 L 120 492 Q 120 465 147 465 L 300 465"/>
    <rect x="178" y="420" width="26" height="45" rx="5" stroke-width="8"/>
    <path stroke-width="7" d="M 150 500 L 265 500 M 150 525 L 265 525"/>
    <!-- cab -->
    <path stroke-width="11" d="M 300 555 L 300 345 Q 300 320 325 320 L 505 320 Q 530 320 530 345 L 530 555"/>
    <rect x="325" y="345" width="180" height="118" rx="16" stroke-width="9"/>
    <circle cx="375" cy="405" r="28" stroke-width="8"/>
    <circle cx="457" cy="405" r="28" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 365 409 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 380 401 a 5.5 5.5 0 1 0 11 0 a 5.5 5.5 0 1 0 -11 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 447 409 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 462 401 a 5.5 5.5 0 1 0 11 0 a 5.5 5.5 0 1 0 -11 0 Z"/>
    <path stroke-width="9" d="M 380 503 Q 416 532 452 503"/>
    <!-- boom, stick, joints -->
    <path stroke-width="11" d="M 530 430 Q 565 175 761.2 182 M 530 545 Q 630 270 761.2 248"/>
    <path stroke-width="10" d="M 811.4 236.4 L 875.1 482.7 M 763 249 L 826.6 495.2"/>
    <circle cx="780" cy="215" r="38" stroke-width="10"/>
    <circle cx="780" cy="215" r="11" fill="#111" stroke="none"/>
    <!-- bucket -->
    <path stroke-width="11" d="M 882.2 492.3 C 945 495 975 575 945 640 Q 930 675 905 694 L 835 718 L 826 512.8"/>
    <circle cx="855" cy="505" r="30" stroke-width="10"/>
    <circle cx="855" cy="505" r="9" fill="#111" stroke="none"/>
    <path fill="#111" stroke-width="6" d="M 901.7 689.9 L 889.3 724.7 L 877.1 698.3 Z M 877.2 698.3 L 864.8 733.1 L 852.6 706.7 Z M 852.7 706.7 L 840.3 741.5 L 828.1 715.1 Z"/>
  </g>
</svg>
`,Ie=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="fire-engine-wheel">
      <circle r="95" stroke-width="11"/>
      <circle r="52" stroke-width="9"/>
      <circle r="18" stroke-width="8"/>
      <g fill="#111" stroke="none">
        <circle cx="0" cy="-35" r="6"/>
        <circle cx="33.3" cy="-10.8" r="6"/>
        <circle cx="20.6" cy="28.3" r="6"/>
        <circle cx="-20.6" cy="28.3" r="6"/>
        <circle cx="-33.3" cy="-10.8" r="6"/>
      </g>
    </g>
    <path id="fire-engine-cloud" d="M -85 30 A 30 30 0 0 1 -62 -12 A 42 42 0 0 1 6 -38 A 36 36 0 0 1 66 -8 A 28 28 0 0 1 85 30 Z"/>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sky -->
    <circle cx="125" cy="140" r="50" stroke-width="9"/>
    <path stroke-width="8" d="M 125 74 L 125 50 M 171.7 93.3 L 188.6 76.4 M 191 140 L 215 140 M 171.7 186.7 L 188.6 203.6 M 125 206 L 125 230 M 78.3 186.7 L 61.4 203.6 M 59 140 L 35 140 M 78.3 93.3 L 61.4 76.4"/>
    <use href="#fire-engine-cloud" transform="translate(450 150)" stroke-width="9"/>
    <use href="#fire-engine-cloud" transform="translate(800 120) scale(0.85)" stroke-width="10.5"/>
    <!-- road -->
    <path stroke-width="10" d="M -10 778 L 234.2 778 M 305.8 778 L 774.2 778 M 845.8 778 L 1010 778"/>
    <g fill="#111" stroke="none">
      <rect x="40" y="874" width="110" height="18" rx="9"/>
      <rect x="250" y="874" width="110" height="18" rx="9"/>
      <rect x="460" y="874" width="110" height="18" rx="9"/>
      <rect x="670" y="874" width="110" height="18" rx="9"/>
      <rect x="880" y="874" width="110" height="18" rx="9"/>
    </g>
    <!-- ladder -->
    <rect x="80" y="310" width="570" height="42" rx="14" stroke-width="9"/>
    <path stroke-width="7" d="M 130 310 L 130 352 M 180 310 L 180 352 M 230 310 L 230 352 M 280 310 L 280 352 M 330 310 L 330 352 M 380 310 L 380 352 M 430 310 L 430 352 M 480 310 L 480 352 M 530 310 L 530 352 M 580 310 L 580 352"/>
    <path stroke-width="8" d="M 115 352 L 115 400 M 150 352 L 150 400 M 560 352 L 560 400 M 595 352 L 595 400"/>
    <!-- body and cab -->
    <path stroke-width="11" d="M 45 660 L 45 422 Q 45 400 67 400 L 680 400 L 680 315 Q 680 290 705 290 L 912 290 Q 935 290 940 312 L 960 425 L 960 660 L 921 660 A 115 115 0 0 0 699 660 L 381 660 A 115 115 0 0 0 159 660 Z"/>
    <path stroke-width="9" d="M 680 400 L 680 660"/>
    <!-- siren -->
    <path stroke-width="9" d="M 780 290 A 30 30 0 0 1 840 290"/>
    <path stroke-width="7" d="M 810 245 L 810 225 M 765 258 L 750 245 M 855 258 L 870 245"/>
    <!-- window with eyes -->
    <path stroke-width="9" d="M 705 440 L 705 335 Q 705 318 722 318 L 900 318 Q 914 318 917 332 L 936 425 Q 939 440 924 440 Z"/>
    <circle cx="768" cy="380" r="34" stroke-width="9"/>
    <circle cx="862" cy="380" r="34" stroke-width="9"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 754 384 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0 Z M 772 375 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 848 384 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0 Z M 866 375 a 6.5 6.5 0 1 0 13 0 a 6.5 6.5 0 1 0 -13 0 Z"/>
    <!-- smile, headlight -->
    <path stroke-width="9" d="M 770 492 Q 815 530 860 492"/>
    <circle cx="920" cy="490" r="17" stroke-width="8"/>
    <!-- hose reel -->
    <circle cx="200" cy="485" r="58" stroke-width="9"/>
    <circle cx="200" cy="485" r="38" stroke-width="7"/>
    <circle cx="200" cy="485" r="14" stroke-width="7"/>
    <!-- locker doors -->
    <rect x="300" y="425" width="160" height="110" rx="12" stroke-width="8"/>
    <rect x="410" y="560" width="250" height="78" rx="12" stroke-width="8"/>
    <rect x="490" y="425" width="160" height="110" rx="12" stroke-width="8"/>
    <path stroke-width="10" d="M 365 512 L 395 512 M 555 512 L 585 512 M 520 620 L 550 620"/>
    <!-- wheels -->
    <use href="#fire-engine-wheel" transform="translate(270 690)"/>
    <use href="#fire-engine-wheel" transform="translate(810 690)"/>
  </g>
</svg>
`,Le=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <path id="helicopter-cloud" d="M -85 30 A 30 30 0 0 1 -62 -12 A 42 42 0 0 1 6 -38 A 36 36 0 0 1 66 -8 A 28 28 0 0 1 85 30 Z"/>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sky -->
    <circle cx="880" cy="105" r="40" stroke-width="9"/>
    <path stroke-width="8" d="M 880 51 L 880 33 M 918.2 66.8 L 930.9 54.1 M 934 105 L 952 105 M 918.2 143.2 L 930.9 155.9 M 880 159 L 880 177 M 841.8 143.2 L 829.1 155.9 M 826 105 L 808 105 M 841.8 66.8 L 829.1 54.1"/>
    <use href="#helicopter-cloud" transform="translate(200 110) scale(0.85)" stroke-width="10.5"/>
    <use href="#helicopter-cloud" transform="translate(620 100) scale(0.7)" stroke-width="13"/>
    <path stroke-width="7" d="M 70 540 Q 85 524 100 540 Q 115 524 130 540 M 150 590 Q 162 577 174 590 Q 186 577 198 590"/>
    <!-- hills and trees -->
    <path stroke-width="10" d="M -10 820 C 150 740 300 740 450 800 C 560 845 650 850 750 800 C 850 750 950 760 1010 790"/>
    <path stroke-width="9" d="M 217 757.8 L 217 713.6 M 243 757.2 L 243 713.6"/>
    <circle cx="230" cy="680" r="36" stroke-width="9"/>
    <path stroke-width="9" d="M 847 768.8 L 847 727.8 M 873 765.8 L 873 727.8"/>
    <circle cx="860" cy="690" r="40" stroke-width="9"/>
    <path stroke-width="9" d="M 330 765.2 C 320 738.8 344.4 730.0 366.0 741.1 C 373.2 715.6 409.2 726.5 411.6 752.9 C 435.6 743.3 460 776.0 450 800.0 M 590 835.1 C 580 810.9 604.4 788.0 626.0 798.1 C 633.2 774.8 669.2 765.8 671.6 790.0 C 695.6 781.2 720 795.3 710 817.3"/>
    <!-- rotor -->
    <rect x="470" y="208" width="60" height="52" rx="12" stroke-width="10"/>
    <path stroke-width="10" d="M 470 220 L 135 223 Q 105 224 105 235 Q 105 247 135 247 L 470 248 M 530 220 L 865 223 Q 895 224 895 235 Q 895 247 865 247 L 530 248"/>
    <path stroke-width="9" d="M 488 260 L 488 305.8 M 512 260 L 512 300.5"/>
    <!-- tail -->
    <path stroke-width="10" d="M 390 402 L 180.5 384 M 390 455 L 179.2 410"/>
    <path stroke-width="8" d="M 305 394.7 L 305 436.9 M 335 397.3 L 335 443.3"/>
    <path stroke-width="9" d="M 270 391.7 L 228 318 Q 220 305 210 316 L 215 387"/>
    <circle cx="140" cy="395" r="42" stroke-width="10"/>
    <path stroke-width="8" d="M 114 369 L 166 421 M 166 369 L 114 421"/>
    <circle cx="140" cy="395" r="9" fill="#111" stroke="none"/>
    <!-- skids -->
    <path stroke-width="12" d="M 495 565 L 485 650 M 600 565 L 615 650"/>
    <path stroke-width="14" d="M 390 650 L 735 650 Q 772 650 785 618"/>
    <!-- cabin -->
    <path stroke-width="11" d="M 390 390 C 420 310 500 295 590 295 C 700 295 770 360 770 440 C 770 520 700 565 600 565 L 470 565 C 420 565 395 520 390 470 Z"/>
    <rect x="425" y="362" width="85" height="163" rx="16" stroke-width="8"/>
    <circle cx="467" cy="418" r="24" stroke-width="8"/>
    <path stroke-width="9" d="M 535 470 L 535 345 Q 535 323 557 323 L 590 323 C 682.9 323 742 375.4 742 440 L 742 470 Z"/>
    <circle cx="588" cy="398" r="30" stroke-width="8"/>
    <circle cx="668" cy="398" r="30" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 578 402 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 594 393 a 5.5 5.5 0 1 0 11 0 a 5.5 5.5 0 1 0 -11 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 658 402 a 15 15 0 1 0 30 0 a 15 15 0 1 0 -30 0 Z M 674 393 a 5.5 5.5 0 1 0 11 0 a 5.5 5.5 0 1 0 -11 0 Z"/>
    <path stroke-width="9" d="M 590 505 Q 628 534 666 505"/>
  </g>
</svg>
`,Re=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="monster-truck-tyre">
      <g fill="#111" stroke="none">
        <rect x="-23" y="-205" width="46" height="34" rx="9"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(25.714)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(51.429)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(77.143)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(102.857)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(128.571)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(154.286)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(180)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(205.714)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(231.429)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(257.143)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(282.857)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(308.571)"/>
        <rect x="-23" y="-205" width="46" height="34" rx="9" transform="rotate(334.286)"/>
      </g>
      <circle r="180" stroke-width="14"/>
      <circle r="95" stroke-width="12"/>
      <circle r="36" stroke-width="10"/>
      <g fill="#111" stroke="none">
        <circle cx="0" cy="-65" r="9"/>
        <circle cx="61.8" cy="-20.1" r="9"/>
        <circle cx="38.2" cy="52.6" r="9"/>
        <circle cx="-38.2" cy="52.6" r="9"/>
        <circle cx="-61.8" cy="-20.1" r="9"/>
      </g>
    </g>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(0 -15)">
      <!-- ground -->
      <path stroke-width="12" d="M -10 850 L 215.8 850 M 334.2 850 L 665.8 850 M 784.2 850 L 1010 850"/>
      <!-- axle bar between the tyres -->
      <path stroke-width="12" d="M 453.5 655 L 546.5 655 M 453.5 705 L 546.5 705"/>
      <!-- lower body with wheel arches -->
      <path stroke-width="14" d="M 60 540 L 60 425 Q 60 380 105 380 L 895 380 Q 940 380 940 425 L 940 540 L 907.5 540 A 230 230 0 0 0 542.5 540 L 457.5 540 A 230 230 0 0 0 92.5 540 Z"/>
      <!-- cab -->
      <path stroke-width="14" d="M 320 380 L 320 240 Q 320 200 360 200 L 590 200 Q 618 200 630 225 L 705 380"/>
      <!-- roof lights -->
      <path stroke-width="12" d="M 379 200 A 26 26 0 0 1 431 200 M 449 200 A 26 26 0 0 1 501 200 M 519 200 A 26 26 0 0 1 571 200"/>
      <!-- window -->
      <path stroke-width="10" d="M 352 360 L 352 244 Q 352 222 374 222 L 578 222 Q 596 222 604 238 L 662 348 Q 668 360 654 360 Z"/>
      <!-- eyes -->
      <circle cx="440" cy="291" r="44"/>
      <circle cx="548" cy="291" r="44"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 424 297 a 24 24 0 1 0 48 0 a 24 24 0 1 0 -48 0 Z M 447 287 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 532 297 a 24 24 0 1 0 48 0 a 24 24 0 1 0 -48 0 Z M 555 287 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 Z"/>
      <!-- smile -->
      <path stroke-width="12" d="M 436 428 Q 494 486 552 428"/>
      <!-- headlight -->
      <circle cx="888" cy="430" r="24"/>
      <!-- tyres -->
      <use href="#monster-truck-tyre" transform="translate(275 680)"/>
      <use href="#monster-truck-tyre" transform="translate(725 680)"/>
    </g>
  </g>
</svg>
`,ze=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="race-car-wheel">
      <circle r="130" stroke-width="14"/>
      <circle r="72" stroke-width="12"/>
      <circle r="26" stroke-width="10"/>
      <g fill="#111" stroke="none">
        <circle cx="0" cy="-49" r="8"/>
        <circle cx="46.6" cy="-15.1" r="8"/>
        <circle cx="28.8" cy="39.6" r="8"/>
        <circle cx="-28.8" cy="39.6" r="8"/>
        <circle cx="-46.6" cy="-15.1" r="8"/>
      </g>
    </g>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <g transform="translate(0 -30)">
      <!-- ground -->
      <path stroke-width="12" d="M -10 812 L 205.1 812 M 294.9 812 L 732.9 812 M 817.1 812 L 1010 812"/>
      <!-- speed lines -->
      <path stroke-width="12" d="M 30 700 L 92 700 M 42 740 L 100 740 M 30 780 L 84 780"/>
      <!-- spoiler -->
      <rect x="45" y="330" width="200" height="44" rx="18" stroke-width="14"/>
      <path stroke-width="12" d="M 130 374 L 130 469.7 M 175 374 L 175 468"/>
      <!-- body with wheel arches -->
      <path stroke-width="14" d="M 80 650 L 80 515 Q 80 472 122 470 L 330 462 L 612 466 C 740 472 870 515 945 585 Q 970 612 958 650 L 907 650 A 143 143 0 0 0 643 650 L 402.9 650 A 158 158 0 0 0 97.1 650 Z"/>
      <!-- canopy -->
      <path stroke-width="14" d="M 330 462 C 340 360 400 330 470 330 C 550 330 605 375 614 466"/>
      <!-- eyes -->
      <circle cx="418" cy="400" r="37"/>
      <circle cx="528" cy="400" r="37"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 406 405 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 Z M 425 396 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0 Z"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 516 405 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 Z M 535 396 a 7 7 0 1 0 14 0 a 7 7 0 1 0 -14 0 Z"/>
      <!-- smile -->
      <path stroke-width="12" d="M 425 506 Q 473 552 521 506"/>
      <!-- wheels -->
      <use href="#race-car-wheel" transform="translate(250 690)"/>
      <use href="#race-car-wheel" transform="translate(775 705) scale(0.885)"/>
    </g>
  </g>
</svg>
`,Be=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="shark-truck-tyre">
      <g fill="#111" stroke="none">
        <rect x="-19" y="-166" width="38" height="28" rx="8"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(27.69)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(55.38)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(83.08)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(110.77)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(138.46)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(166.15)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(193.85)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(221.54)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(249.23)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(276.92)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(304.62)"/>
        <rect x="-19" y="-166" width="38" height="28" rx="8" transform="rotate(332.31)"/>
      </g>
      <circle r="145" stroke-width="11"/>
      <circle r="78" stroke-width="9"/>
      <circle r="28" stroke-width="8"/>
      <g fill="#111" stroke="none">
        <circle cx="0" cy="-53" r="7"/>
        <circle cx="50.4" cy="-16.4" r="7"/>
        <circle cx="31.2" cy="42.9" r="7"/>
        <circle cx="-31.2" cy="42.9" r="7"/>
        <circle cx="-50.4" cy="-16.4" r="7"/>
      </g>
    </g>
    <path id="shark-truck-drop" d="M 0 -34 C 8 -20 22 -6 22 10 A 22 22 0 0 1 -22 10 C -22 -6 -8 -20 0 -34 Z"/>
    <path id="shark-truck-cloud" d="M -85 30 A 30 30 0 0 1 -62 -12 A 42 42 0 0 1 6 -38 A 36 36 0 0 1 66 -8 A 28 28 0 0 1 85 30 Z"/>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sky -->
    <circle cx="860" cy="135" r="52" stroke-width="9"/>
    <path stroke-width="8" d="M 860 67 L 860 43 M 908.1 86.9 L 925.1 69.9 M 928 135 L 952 135 M 908.1 183.1 L 925.1 200.1 M 860 203 L 860 227 M 811.9 183.1 L 794.9 200.1 M 792 135 L 768 135 M 811.9 86.9 L 794.9 69.9"/>
    <use href="#shark-truck-cloud" transform="translate(205 120)" stroke-width="9"/>
    <use href="#shark-truck-cloud" transform="translate(650 95) scale(0.8)" stroke-width="11"/>
    <!-- ground and puddle -->
    <path stroke-width="10" d="M -10 835 L 208.6 835 M 371.4 835 L 638.6 835 M 801.4 835 L 1010 835"/>
    <path stroke-width="9" d="M 45 835 C 70 900 260 925 500 925 C 740 925 930 900 955 835"/>
    <path stroke-width="7" d="M 110 872 Q 140 862 170 872 M 460 885 Q 500 873 540 885 M 830 872 Q 860 862 890 872"/>
    <!-- splash drops -->
    <use href="#shark-truck-drop" transform="translate(68 650) rotate(-60) scale(0.7)" stroke-width="12"/>
    <use href="#shark-truck-drop" transform="translate(55 745) rotate(-80) scale(0.85)" stroke-width="10"/>
    <use href="#shark-truck-drop" transform="translate(105 800) rotate(-100) scale(0.65)" stroke-width="13"/>
    <use href="#shark-truck-drop" transform="translate(932 650) rotate(60) scale(0.7)" stroke-width="12"/>
    <use href="#shark-truck-drop" transform="translate(945 745) rotate(80) scale(0.85)" stroke-width="10"/>
    <use href="#shark-truck-drop" transform="translate(895 800) rotate(100) scale(0.65)" stroke-width="13"/>
    <!-- axle -->
    <path stroke-width="9" d="M 433.6 695 L 576.4 695 M 433.6 735 L 576.4 735"/>
    <!-- tail fin -->
    <path stroke-width="11" d="M 170 400.3 C 160 320 110 250 48 215 C 56 280 72 350 80 412 C 65 437 50 462 36 488 C 60 505 80 518 100 525"/>
    <!-- dorsal fin -->
    <path stroke-width="11" d="M 585 265 C 540 195 470 140 390 128 C 405 170 418 230 410 282.1"/>
    <!-- shark body -->
    <path stroke-width="11" d="M 100 560 L 100 470 C 160 390 320 280 500 268 C 700 255 860 285 925 350 C 975 400 975 500 940 560 L 829.9 560 A 190 190 0 0 0 610.1 560 L 399.9 560 A 190 190 0 0 0 180.1 560 Z"/>
    <!-- gills -->
    <path stroke-width="8" d="M 540 330 Q 556 365 540 400 M 568 326 Q 584 365 568 404 M 596 330 Q 612 365 596 400"/>
    <!-- side fin -->
    <path stroke-width="9" d="M 575 432 C 545 472 505 507 452 524 C 470 477 490 437 525 412 Z"/>
    <!-- eye -->
    <circle cx="785" cy="352" r="38" stroke-width="9"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 772 357 a 21 21 0 1 0 42 0 a 21 21 0 1 0 -42 0 Z M 792 347 a 7.5 7.5 0 1 0 15 0 a 7.5 7.5 0 1 0 -15 0 Z"/>
    <!-- grin and teeth -->
    <path stroke-width="10" d="M 625 400 Q 790 450 925 390 Q 800 610 625 400 Z"/>
    <path stroke-width="7" d="M 664.2 410.4 L 684.0 441.0 L 712.5 419.1 L 733.8 453.4 L 759.5 422.6 L 783.6 455.5 L 805.1 421.1 L 832.1 450.1 L 849.3 414.5 L 877.8 434.4 L 892.2 402.8"/>
    <path stroke-width="7" d="M 859.4 473.1 L 823.2 465.2 L 812.1 498.7 L 786.5 472.5 L 762.3 500.4 L 746.6 467.4 L 709.4 478.1"/>
    <!-- tyres -->
    <use href="#shark-truck-tyre" transform="translate(290 715)"/>
    <use href="#shark-truck-tyre" transform="translate(720 715)"/>
  </g>
</svg>
`,Ve=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="stadium-fan">
      <circle cx="0" cy="-50" r="17"/>
      <path d="M -24 0 L -24 -24 Q -24 -40 -13.7 -40 M 24 0 L 24 -24 Q 24 -40 13.7 -40"/>
      <circle cx="-6" cy="-53" r="2.8" fill="#111" stroke="none"/>
      <circle cx="6" cy="-53" r="2.8" fill="#111" stroke="none"/>
      <path d="M -7 -44 Q 0 -38 7 -44"/>
    </g>
    <g id="stadium-car">
      <path stroke-width="7" d="M 7.2 -22 L 6 -22 Q 0 -22 0 -28 L 0 -44 Q 0 -54 10 -54 L 102 -54 Q 112 -54 112 -44 L 112 -28 Q 112 -22 106 -22 L 104.8 -22 M 44.8 -22 L 67.2 -22"/>
      <path stroke-width="7" d="M 22 -54 L 30 -84 Q 32 -90 38 -90 L 72 -90 Q 78 -90 81 -84 L 92 -54"/>
      <path d="M 34 -61 L 40 -82 L 70 -82 L 77 -61 Z"/>
      <circle cx="26" cy="-19" r="19" stroke-width="6"/>
      <circle cx="86" cy="-19" r="19" stroke-width="6"/>
      <g fill="#111" stroke="none"><circle cx="26" cy="-19" r="6"/><circle cx="86" cy="-19" r="6"/><circle cx="99" cy="-40" r="4.5"/></g>
    </g>
    <g id="stadium-tyre">
      <g fill="#111" stroke="none"><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(0.00)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(25.71)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(51.43)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(77.14)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(102.86)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(128.57)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(154.29)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(180.00)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(205.71)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(231.43)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(257.14)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(282.86)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(308.57)"/><rect x="-11" y="-86" width="22" height="18" rx="5" transform="rotate(334.29)"/></g>
      <circle r="72" stroke-width="7"/>
      <circle r="40" stroke-width="6"/>
      <circle r="14" stroke-width="5"/>
      <g fill="#111" stroke="none"><circle cx="0.0" cy="-27.0" r="4"/><circle cx="25.7" cy="-8.3" r="4"/><circle cx="15.9" cy="21.8" r="4"/><circle cx="-15.9" cy="21.8" r="4"/><circle cx="-25.7" cy="-8.3" r="4"/></g>
    </g>
    <path id="stadium-cloud" d="M -85 30 A 30 30 0 0 1 -62 -12 A 42 42 0 0 1 6 -38 A 36 36 0 0 1 66 -8 A 28 28 0 0 1 85 30 Z"/>
    <path id="stadium-puff" d="M -40 10 A 22 22 0 0 1 -25 -25 A 26 26 0 0 1 20 -32 A 24 24 0 0 1 42 5 A 22 22 0 0 1 15 35 A 24 24 0 0 1 -40 10 Z"/>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
   <g stroke-width="6">
    <!-- sky: sun, clouds, flags -->
    <circle cx="515" cy="64" r="24"/>
    <path stroke-width="5" d="M 515 32 L 515 22 M 537.6 41.4 L 544.7 34.3 M 547 64 L 557 64 M 537.6 86.6 L 544.7 93.7 M 515 96 L 515 106 M 492.4 86.6 L 485.3 93.7 M 483 64 L 473 64 M 492.4 41.4 L 485.3 34.3"/>
    <use href="#stadium-cloud" transform="translate(230 72) scale(0.55)" stroke-width="11"/>
    <use href="#stadium-cloud" transform="translate(775 74) scale(0.55)" stroke-width="11"/>
    <path stroke-width="7" d="M 90 118 L 90 32 M 365 118 L 365 32 M 635 118 L 635 32 M 910 118 L 910 32"/>
    <path d="M 90 34 L 165 52 L 90 70 M 365 34 L 440 52 L 365 70 M 635 34 L 710 52 L 635 70 M 910 34 L 965 49 Q 972 52 965 55 L 910 70"/>
    <!-- grandstand -->
    <path stroke-width="7" d="M -10 118 L 1010 118 M -10 140 L 1010 140 M -10 225 L 1010 225 M -10 305 L 1010 305 M -10 375 L 1010 375"/>
    <g stroke-width="5">
      <use href="#stadium-fan" x="35" y="225"/>
      <use href="#stadium-fan" x="105" y="225"/>
      <use href="#stadium-fan" x="175" y="225"/>
      <use href="#stadium-fan" x="245" y="225"/>
      <use href="#stadium-fan" x="315" y="225"/>
      <use href="#stadium-fan" x="385" y="225"/>
      <use href="#stadium-fan" x="455" y="225"/>
      <use href="#stadium-fan" x="525" y="225"/>
      <use href="#stadium-fan" x="595" y="225"/>
      <use href="#stadium-fan" x="665" y="225"/>
      <use href="#stadium-fan" x="735" y="225"/>
      <use href="#stadium-fan" x="805" y="225"/>
      <use href="#stadium-fan" x="875" y="225"/>
      <use href="#stadium-fan" x="945" y="225"/>
      <use href="#stadium-fan" x="70" y="305"/>
      <use href="#stadium-fan" x="140" y="305"/>
      <use href="#stadium-fan" x="210" y="305"/>
      <use href="#stadium-fan" x="280" y="305"/>
      <use href="#stadium-fan" x="350" y="305"/>
      <use href="#stadium-fan" x="420" y="305"/>
      <use href="#stadium-fan" x="490" y="305"/>
      <use href="#stadium-fan" x="560" y="305"/>
      <use href="#stadium-fan" x="630" y="305"/>
      <use href="#stadium-fan" x="700" y="305"/>
      <use href="#stadium-fan" x="770" y="305"/>
      <use href="#stadium-fan" x="840" y="305"/>
      <use href="#stadium-fan" x="910" y="305"/>
    </g>
    <g stroke-width="5">
      <rect x="40" y="314" width="120" height="52" rx="10"/>
      <path d="M 100.0 323.0 L 104.4 333.9 L 116.2 334.7 L 107.1 342.3 L 110.0 353.8 L 100.0 347.5 L 90.0 353.8 L 92.9 342.3 L 83.8 334.7 L 95.6 333.9 Z"/>
      <rect x="200" y="314" width="120" height="52" rx="10"/>
      <path d="M 260.0 323.0 L 264.4 333.9 L 276.2 334.7 L 267.1 342.3 L 270.0 353.8 L 260.0 347.5 L 250.0 353.8 L 252.9 342.3 L 243.8 334.7 L 255.6 333.9 Z"/>
      <rect x="360" y="314" width="120" height="52" rx="10"/>
      <path d="M 420.0 323.0 L 424.4 333.9 L 436.2 334.7 L 427.1 342.3 L 430.0 353.8 L 420.0 347.5 L 410.0 353.8 L 412.9 342.3 L 403.8 334.7 L 415.6 333.9 Z"/>
      <rect x="520" y="314" width="120" height="52" rx="10"/>
      <path d="M 580.0 323.0 L 584.4 333.9 L 596.2 334.7 L 587.1 342.3 L 590.0 353.8 L 580.0 347.5 L 570.0 353.8 L 572.9 342.3 L 563.8 334.7 L 575.6 333.9 Z"/>
      <rect x="680" y="314" width="120" height="52" rx="10"/>
      <path d="M 740.0 323.0 L 744.4 333.9 L 756.2 334.7 L 747.1 342.3 L 750.0 353.8 L 740.0 347.5 L 730.0 353.8 L 732.9 342.3 L 723.8 334.7 L 735.6 333.9 Z"/>
      <rect x="840" y="314" width="120" height="52" rx="10"/>
      <path d="M 900.0 323.0 L 904.4 333.9 L 916.2 334.7 L 907.1 342.3 L 910.0 353.8 L 900.0 347.5 L 890.0 353.8 L 892.9 342.3 L 883.8 334.7 L 895.6 333.9 Z"/>
    </g>
    <!-- ramps -->
    <path stroke-width="8" d="M 40 890 L 300 770 L 300 890 Z M 960 890 L 700 770 L 700 890 Z"/>
    <path d="M 126.7 890 L 300 810 M 213.3 890 L 300 850 M 873.3 890 L 700 810 M 786.7 890 L 700 850"/>
    <!-- little cars -->
    <use href="#stadium-car" transform="translate(316 890)"/>
    <use href="#stadium-car" transform="translate(556 890) scale(-1 1)"/>
    <use href="#stadium-car" transform="translate(572 890)"/>
    <!-- dust, speed lines, tracks -->
    <use href="#stadium-puff" transform="translate(262 735) scale(0.55)" stroke-width="11"/>
    <use href="#stadium-puff" transform="translate(212 700) scale(0.4)" stroke-width="15"/>
    <path d="M 140 600 L 215 587 M 115 640 L 205 624 M 150 680 L 220 668"/>
    <path d="M 60 950 Q 120 935 180 950 Q 240 965 300 950 M 640 965 Q 700 950 760 965 Q 820 980 880 965"/>
    <g fill="#111" stroke="none"><circle cx="420" cy="940" r="5"/><circle cx="470" cy="960" r="4"/><circle cx="530" cy="935" r="5"/><circle cx="95" cy="430" r="4"/><circle cx="880" cy="450" r="5"/><circle cx="930" cy="420" r="4"/></g>
    <!-- monster truck mid-jump -->
    <g transform="translate(500 585) rotate(-10)">
      <path d="M -48.7 45 L 48.7 45 M -49.6 70 L 49.6 70"/>
      <path stroke-width="8" d="M -225 15 L -225 -50 Q -225 -70 -205 -70 L 205 -70 Q 225 -70 225 -50 L 225 15 L 211.7 15 A 100 100 0 0 0 28.3 15 L -28.3 15 A 100 100 0 0 0 -211.7 15 Z"/>
      <path stroke-width="8" d="M -85 -70 L -85 -145 Q -85 -165 -65 -165 L 40 -165 Q 56 -165 63 -150 L 100 -70"/>
      <path stroke-width="7" d="M -63 -165 A 18 18 0 0 1 -27 -165 M -8 -165 A 18 18 0 0 1 28 -165"/>
      <path d="M -68 -84 L -68 -137 Q -68 -149 -56 -149 L 45 -149 Q 52 -149 56 -141 L 80 -90 Q 83 -84 76 -84 Z"/>
      <circle cx="-30" cy="-117" r="18" stroke-width="5"/>
      <circle cx="26" cy="-117" r="18" stroke-width="5"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M -37.5 -116 a 8.5 8.5 0 1 0 17 0 a 8.5 8.5 0 1 0 -17 0 Z M -28 -120 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 Z"/>
      <path fill="#111" stroke="none" fill-rule="evenodd" d="M 18.5 -116 a 8.5 8.5 0 1 0 17 0 a 8.5 8.5 0 1 0 -17 0 Z M 28 -120 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 Z"/>
      <path d="M -32 -45 Q 0 -20 32 -45"/>
      <circle cx="193" cy="-42" r="11" stroke-width="5"/>
      <use href="#stadium-tyre" transform="translate(-120 55)"/>
      <use href="#stadium-tyre" transform="translate(120 55)"/>
    </g>
   </g>
  </g>
</svg>
`,He=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <g id="steam-train-wheel">
      <circle r="48" stroke-width="9"/>
      <circle r="24" stroke-width="7"/>
      <circle r="9" fill="#111" stroke="none"/>
    </g>
    <path id="steam-train-cloud" d="M -85 30 A 30 30 0 0 1 -62 -12 A 42 42 0 0 1 6 -38 A 36 36 0 0 1 66 -8 A 28 28 0 0 1 85 30 Z"/>
    <path id="steam-train-puff" d="M -40 10 A 22 22 0 0 1 -25 -25 A 26 26 0 0 1 20 -32 A 24 24 0 0 1 42 5 A 22 22 0 0 1 15 35 A 24 24 0 0 1 -40 10 Z"/>
  </defs>
  <g fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <!-- sky -->
    <circle cx="110" cy="120" r="46" stroke-width="9"/>
    <path stroke-width="8" d="M 110 58 L 110 36 M 153.8 76.2 L 169.4 60.6 M 172 120 L 194 120 M 153.8 163.8 L 169.4 179.4 M 110 182 L 110 204 M 66.2 163.8 L 50.6 179.4 M 48 120 L 26 120 M 66.2 76.2 L 50.6 60.6"/>
    <use href="#steam-train-cloud" transform="translate(360 140)" stroke-width="9"/>
    <use href="#steam-train-cloud" transform="translate(560 95) scale(0.8)" stroke-width="11"/>
    <path stroke-width="7" d="M 230 300 Q 245 284 260 300 Q 275 284 290 300 M 330 250 Q 342 237 354 250 Q 366 237 378 250"/>
    <!-- smoke -->
    <use href="#steam-train-puff" transform="translate(892 408) scale(0.6)" stroke-width="14"/>
    <use href="#steam-train-puff" transform="translate(815 330) scale(0.85)" stroke-width="10.5"/>
    <use href="#steam-train-puff" transform="translate(700 250) scale(1.1)" stroke-width="8.5"/>
    <!-- rails, sleepers, grass -->
    <path stroke-width="9" d="M -10 790 L 1010 790 M -10 812 L 1010 812"/>
    <path stroke-width="8" d="M 30 812 L 30 834 L 80 834 L 80 812 M 130 812 L 130 834 L 180 834 L 180 812 M 230 812 L 230 834 L 280 834 L 280 812 M 330 812 L 330 834 L 380 834 L 380 812 M 430 812 L 430 834 L 480 834 L 480 812 M 530 812 L 530 834 L 580 834 L 580 812 M 630 812 L 630 834 L 680 834 L 680 812 M 730 812 L 730 834 L 780 834 L 780 812 M 830 812 L 830 834 L 880 834 L 880 812 M 930 812 L 930 834 L 980 834 L 980 812"/>
    <path stroke-width="7" d="M 96 925 Q 96 907 84 895 M 110 925 Q 108 903 112 885 M 124 925 Q 124 907 136 895 M 406 955 Q 406 937 394 925 M 420 955 Q 418 933 422 915 M 434 955 Q 434 937 446 925 M 646 910 Q 646 892 634 880 M 660 910 Q 658 888 662 870 M 674 910 Q 674 892 686 880 M 886 950 Q 886 932 874 920 M 900 950 Q 898 928 902 910 M 914 950 Q 914 932 926 920"/>
    <!-- couplings -->
    <path stroke-width="12" d="M 245 688 L 285 688 M 500 688 L 540 688"/>
    <!-- carriage 1 -->
    <rect x="22" y="492" width="231" height="30" rx="14" stroke-width="10"/>
    <path stroke-width="10" d="M 30 522 L 30 688 Q 30 700 42 700 L 56.8 700 M 103.2 700 L 171.8 700 M 218.2 700 L 233 700 Q 245 700 245 688 L 245 522"/>
    <path stroke-width="8" d="M 30 650 L 245 650"/>
    <rect x="52" y="553" width="70" height="68" rx="14" stroke-width="8"/>
    <rect x="153" y="553" width="70" height="68" rx="14" stroke-width="8"/>
    <!-- carriage 2 -->
    <rect x="277" y="492" width="231" height="30" rx="14" stroke-width="10"/>
    <path stroke-width="10" d="M 285 522 L 285 688 Q 285 700 297 700 L 311.8 700 M 358.2 700 L 426.8 700 M 473.2 700 L 488 700 Q 500 700 500 688 L 500 522"/>
    <path stroke-width="8" d="M 285 650 L 500 650"/>
    <rect x="307" y="553" width="70" height="68" rx="14" stroke-width="8"/>
    <rect x="408" y="553" width="70" height="68" rx="14" stroke-width="8"/>
    <!-- locomotive -->
    <rect x="530" y="402" width="240" height="33" rx="14" stroke-width="10"/>
    <path stroke-width="10" d="M 540 435 L 540 700 L 576.8 700 M 623.2 700 L 701.8 700 M 748.2 700 L 846.8 700 M 893.2 700 L 960 700 L 960 655 M 540 655 L 960 655 M 760 435 L 760 655"/>
    <path stroke-width="10" d="M 760 545 L 940 545 Q 955 545 955 560 L 955 655"/>
    <path stroke-width="8" d="M 850 545 L 850 655"/>
    <path stroke-width="9" d="M 772 545 C 772 498 830 498 830 545"/>
    <path stroke-width="9" d="M 880 545 L 876 487 L 862 458 L 938 458 L 924 487 L 920 545 M 876 487 L 924 487"/>
    <rect x="563" y="455" width="174" height="110" rx="14" stroke-width="8"/>
    <circle cx="612" cy="510" r="28" stroke-width="8"/>
    <circle cx="688" cy="510" r="28" stroke-width="8"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 600 513 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 Z M 614 505 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 Z"/>
    <path fill="#111" stroke="none" fill-rule="evenodd" d="M 676 513 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0 Z M 690 505 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0 Z"/>
    <path stroke-width="9" d="M 612 596 Q 650 628 688 596"/>
    <!-- wheels -->
    <use href="#steam-train-wheel" transform="translate(80 742)"/>
    <use href="#steam-train-wheel" transform="translate(195 742)"/>
    <use href="#steam-train-wheel" transform="translate(335 742)"/>
    <use href="#steam-train-wheel" transform="translate(450 742)"/>
    <use href="#steam-train-wheel" transform="translate(600 742)"/>
    <use href="#steam-train-wheel" transform="translate(725 742)"/>
    <use href="#steam-train-wheel" transform="translate(870 742)"/>
    <path stroke-width="12" d="M 600 742 L 725 742"/>
  </g>
</svg>
`,Ue={id:`animals`,title:`Animal Friends`,order:1,colour:`#ffb703`,pictures:[{id:`duck`,title:`Duck`,level:1},{id:`cat`,title:`Cat`,level:1},{id:`puppy`,title:`Puppy`,level:1},{id:`pig`,title:`Pig splashing in the mud`,level:2},{id:`cow`,title:`Cow`,level:2},{id:`farm`,title:`On the farm`,level:3}]},We={id:`bugs`,title:`Garden Bugs`,order:9,colour:`#e63946`,pictures:[{id:`snail`,title:`Snail`,level:1},{id:`ladybird`,title:`Ladybird`,level:1},{id:`bee`,title:`Bee and flowers`,level:2},{id:`butterfly`,title:`Butterfly`,level:2},{id:`caterpillar`,title:`Caterpillar on a leaf`,level:2},{id:`garden`,title:`In the garden`,level:3}]},Ge={id:`dinosaurs`,title:`Dinosaurs`,order:5,colour:`#8ac926`,pictures:[{id:`t-rex`,title:`T-rex`,level:1},{id:`baby-hatching`,title:`Baby dinosaur hatching`,level:1},{id:`triceratops`,title:`Triceratops`,level:2},{id:`stegosaurus`,title:`Stegosaurus`,level:2},{id:`brachiosaurus`,title:`Brachiosaurus and palm trees`,level:2},{id:`dino-valley`,title:`Dino valley`,level:3}]},Ke={id:`food`,title:`Yummy Treats`,order:10,colour:`#ff6f91`,pictures:[{id:`ice-cream`,title:`Ice cream cone`,level:1},{id:`cupcake`,title:`Cupcake with a cherry`,level:1},{id:`pizza`,title:`Pizza`,level:2},{id:`birthday-cake`,title:`Birthday cake`,level:2},{id:`fruit-bowl`,title:`Fruit bowl`,level:2},{id:`picnic`,title:`Picnic in the park`,level:3}]},qe={id:`holiday`,title:`Holiday in Croatia`,order:11,colour:`#0077b6`,pictures:[{id:`sailboat`,title:`Sailboat on the sea`,level:1},{id:`sandcastle`,title:`Sandcastle with bucket and spade`,level:1},{id:`lighthouse`,title:`Lighthouse on the rocks`,level:2},{id:`lake-bled`,title:`Lake Bled island church`,level:3},{id:`pula-arena`,title:`Pula Arena`,level:3},{id:`zagreb-st-marks`,title:`St Mark's Church, Zagreb`,level:3}]},Je={id:`jungle`,title:`Jungle Tigers`,order:3,colour:`#2a9d8f`,pictures:[{id:`tiger-cub`,title:`Tiger cub`,level:1},{id:`elephant`,title:`Elephant`,level:1},{id:`gorilla`,title:`Friendly gorilla`,level:2},{id:`monkey-vine`,title:`Monkey on a vine`,level:2},{id:`tiger-walking`,title:`Tiger on a walk`,level:2},{id:`jungle-scene`,title:`Tigers at the waterfall`,level:3}]},Ye={id:`magic`,title:`Magic Land`,order:6,colour:`#c77dff`,pictures:[{id:`rainbow`,title:`Rainbow with fluffy clouds`,level:1},{id:`unicorn`,title:`Unicorn`,level:1},{id:`mermaid`,title:`Mermaid on a rock`,level:2},{id:`dragon`,title:`Friendly baby dragon`,level:2},{id:`castle`,title:`Fairy-tale castle`,level:2},{id:`fairy-garden`,title:`Fairy garden`,level:3}]},Xe={id:`patterns`,title:`Patterns`,order:12,colour:`#7b2cbf`,pictures:[{id:`shapes-party`,title:`Shapes party`,level:1},{id:`fish-scales`,title:`Fish with patterned scales`,level:2},{id:`flower-mandala`,title:`Flower mandala`,level:2},{id:`low-poly-fox`,title:`Geometric fox`,level:2},{id:`star-mandala`,title:`Star mandala`,level:3},{id:`butterfly-mandala`,title:`Butterfly mandala`,level:3}]},Ze={id:`science`,title:`Science Lab`,order:7,colour:`#4cc9f0`,pictures:[{id:`volcano`,title:`Baking-soda volcano`,level:1},{id:`potions`,title:`Potion bottles`,level:1},{id:`density-tower`,title:`Rainbow density tower`,level:2},{id:`scientist`,title:`Girl scientist`,level:2},{id:`microscope`,title:`Microscope`,level:2},{id:`lab`,title:`Science lab`,level:3}]},Qe={id:`sea`,title:`Under the Sea`,order:4,colour:`#219ebc`,pictures:[{id:`whale`,title:`Whale with a water spout`,level:1},{id:`fish`,title:`Happy fish`,level:1},{id:`sea-turtle`,title:`Sea turtle`,level:2},{id:`crab`,title:`Crab and starfish on the sand`,level:2},{id:`octopus`,title:`Octopus`,level:2},{id:`coral-reef`,title:`Coral reef with a little submarine`,level:3}]},$e={id:`space`,title:`Space`,order:8,colour:`#3a0ca3`,pictures:[{id:`rocket`,title:`Rocket`,level:1},{id:`alien`,title:`Friendly alien`,level:1},{id:`flying-saucer`,title:`Flying saucer`,level:2},{id:`astronaut`,title:`Floating astronaut`,level:2},{id:`planets`,title:`Planets and a smiling sun`,level:2},{id:`moon-landing`,title:`Astronaut on the moon`,level:3}]},et={id:`vehicles`,title:`Things That Go`,order:2,colour:`#fb5607`,pictures:[{id:`monster-truck`,title:`Monster truck`,level:1},{id:`race-car`,title:`Race car`,level:1},{id:`shark-truck`,title:`Shark monster truck`,level:2},{id:`fire-engine`,title:`Fire engine`,level:2},{id:`digger`,title:`Digger`,level:2},{id:`steam-train`,title:`Steam train`,level:2},{id:`helicopter`,title:`Helicopter`,level:2},{id:`stadium`,title:`Monster truck jump`,level:3}]},tt=Object.assign({"./pictures/animals/cat.svg":n,"./pictures/animals/cow.svg":r,"./pictures/animals/duck.svg":i,"./pictures/animals/farm.svg":a,"./pictures/animals/pig.svg":o,"./pictures/animals/puppy.svg":s,"./pictures/bugs/bee.svg":c,"./pictures/bugs/butterfly.svg":l,"./pictures/bugs/caterpillar.svg":u,"./pictures/bugs/garden.svg":d,"./pictures/bugs/ladybird.svg":f,"./pictures/bugs/snail.svg":p,"./pictures/dinosaurs/baby-hatching.svg":m,"./pictures/dinosaurs/brachiosaurus.svg":h,"./pictures/dinosaurs/dino-valley.svg":g,"./pictures/dinosaurs/stegosaurus.svg":_,"./pictures/dinosaurs/t-rex.svg":v,"./pictures/dinosaurs/triceratops.svg":y,"./pictures/food/birthday-cake.svg":b,"./pictures/food/cupcake.svg":x,"./pictures/food/fruit-bowl.svg":S,"./pictures/food/ice-cream.svg":C,"./pictures/food/picnic.svg":ee,"./pictures/food/pizza.svg":w,"./pictures/holiday/lake-bled.svg":T,"./pictures/holiday/lighthouse.svg":E,"./pictures/holiday/pula-arena.svg":D,"./pictures/holiday/sailboat.svg":O,"./pictures/holiday/sandcastle.svg":te,"./pictures/holiday/zagreb-st-marks.svg":ne,"./pictures/jungle/elephant.svg":re,"./pictures/jungle/gorilla.svg":ie,"./pictures/jungle/jungle-scene.svg":ae,"./pictures/jungle/monkey-vine.svg":oe,"./pictures/jungle/tiger-cub.svg":se,"./pictures/jungle/tiger-walking.svg":ce,"./pictures/magic/castle.svg":le,"./pictures/magic/dragon.svg":ue,"./pictures/magic/fairy-garden.svg":de,"./pictures/magic/mermaid.svg":fe,"./pictures/magic/rainbow.svg":pe,"./pictures/magic/unicorn.svg":me,"./pictures/patterns/butterfly-mandala.svg":he,"./pictures/patterns/fish-scales.svg":ge,"./pictures/patterns/flower-mandala.svg":k,"./pictures/patterns/low-poly-fox.svg":A,"./pictures/patterns/shapes-party.svg":_e,"./pictures/patterns/star-mandala.svg":ve,"./pictures/science/density-tower.svg":ye,"./pictures/science/lab.svg":j,"./pictures/science/microscope.svg":be,"./pictures/science/potions.svg":xe,"./pictures/science/scientist.svg":Se,"./pictures/science/volcano.svg":Ce,"./pictures/sea/coral-reef.svg":we,"./pictures/sea/crab.svg":Te,"./pictures/sea/fish.svg":Ee,"./pictures/sea/octopus.svg":De,"./pictures/sea/sea-turtle.svg":Oe,"./pictures/sea/whale.svg":ke,"./pictures/space/alien.svg":Ae,"./pictures/space/astronaut.svg":M,"./pictures/space/flying-saucer.svg":je,"./pictures/space/moon-landing.svg":Me,"./pictures/space/planets.svg":Ne,"./pictures/space/rocket.svg":Pe,"./pictures/vehicles/digger.svg":Fe,"./pictures/vehicles/fire-engine.svg":Ie,"./pictures/vehicles/helicopter.svg":Le,"./pictures/vehicles/monster-truck.svg":Re,"./pictures/vehicles/race-car.svg":ze,"./pictures/vehicles/shark-truck.svg":Be,"./pictures/vehicles/stadium.svg":Ve,"./pictures/vehicles/steam-train.svg":He}),nt=Object.assign({"./pictures/animals/book.json":Ue,"./pictures/bugs/book.json":We,"./pictures/dinosaurs/book.json":Ge,"./pictures/food/book.json":Ke,"./pictures/holiday/book.json":qe,"./pictures/jungle/book.json":Je,"./pictures/magic/book.json":Ye,"./pictures/patterns/book.json":Xe,"./pictures/science/book.json":Ze,"./pictures/sea/book.json":Qe,"./pictures/space/book.json":$e,"./pictures/vehicles/book.json":et});function rt(e){return e.split(`/`).at(-2)??``}function it(){let e=new Map;for(let[t,n]of Object.entries(tt)){let r=rt(t),i=t.split(`/`).at(-1).replace(/\.svg$/,``);e.has(r)||e.set(r,new Map),e.get(r).set(i,n)}let t=[];for(let[n,r]of Object.entries(nt)){let i=rt(n),a=e.get(i)??new Map,o=r.pictures??[],s=[],c=new Set;for(let e of o){let t=a.get(e.id);t&&!c.has(e.id)&&(c.add(e.id),s.push({key:`${i}/${e.id}`,book:i,id:e.id,title:e.title??ot(e.id),level:at(e.level),svg:t}))}for(let[e,t]of a)c.has(e)||s.push({key:`${i}/${e}`,book:i,id:e,title:ot(e),level:2,svg:t});s.length!==0&&t.push({id:i,title:r.title,order:r.order??99,colour:r.colour??`#3fa34d`,pictures:s})}return t.sort((e,t)=>e.order-t.order||e.title.localeCompare(t.title))}function at(e){return e===1||e===3?e:2}function ot(e){let t=e.replace(/-/g,` `);return t.charAt(0).toUpperCase()+t.slice(1)}var st=it(),ct=new Map(st.flatMap(e=>e.pictures.map(e=>[e.key,e])));function lt(e){return ct.get(e)}function ut(){return st.flatMap(e=>e.pictures)}var dt=new Map;function ft(e){let t=dt.get(e.key);return t||(t=URL.createObjectURL(new Blob([e.svg],{type:`image/svg+xml`})),dt.set(e.key,t)),t}var pt=new Map;function mt(e,t=2048){let n=pt.get(e.key);if(!n){let r=e.svg.replace(/<svg\b[^>]*>/,e=>e.replace(/\swidth="[^"]*"/,``).replace(/\sheight="[^"]*"/,``).replace(`<svg`,`<svg width="${t}" height="${t}"`));n=URL.createObjectURL(new Blob([r],{type:`image/svg+xml`})),pt.set(e.key,n)}return n}function ht(e,t=new Date){let n=ut().filter(t=>t.level<=e);return n.length===0?ut()[0]:n[Math.floor(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())/864e5)*7919%n.length]}var gt=6e3;function _t(){let e=new Map,t=new Map;return{getAll:async()=>[...e.values()],put:async t=>void e.set(t.id,{...t}),blob:async e=>t.get(e),putBlob:async(e,n)=>void t.set(e,n),deleteBlob:async e=>void t.delete(e),delete:async n=>{e.delete(n);for(let e of[...t.keys()])e.startsWith(`${n}/`)&&t.delete(e)}}}function vt(){let e=_t(),t=!1,n=new Promise((e,t)=>{try{let n=indexedDB.open(`paint-pond`,1);n.onupgradeneeded=()=>{n.result.createObjectStore(`art`,{keyPath:`id`}),n.result.createObjectStore(`blobs`)},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error),n.onblocked=()=>t(Error(`blocked`))}catch(e){t(e)}}),r=(e,t,r)=>n.then(n=>new Promise((i,a)=>{let o=n.transaction(e,t),s=r(o.objectStore(e));o.oncomplete=()=>i(s?s.result:void 0),o.onerror=o.onabort=()=>a(o.error)})),i=(e,n)=>t?n():e().catch(()=>(t=!0,n()));return{getAll:()=>i(()=>r(`art`,`readonly`,e=>e.getAll()),e.getAll),put:t=>i(()=>r(`art`,`readwrite`,e=>void e.put(t)),()=>e.put(t)),blob:t=>i(()=>r(`blobs`,`readonly`,e=>e.get(t)),()=>e.blob(t)),putBlob:(t,n)=>i(()=>r(`blobs`,`readwrite`,e=>void e.put(n,t)),()=>e.putBlob(t,n)),deleteBlob:t=>i(()=>r(`blobs`,`readwrite`,e=>void e.delete(t)),()=>e.deleteBlob(t)),delete:t=>i(async()=>{await r(`art`,`readwrite`,e=>void e.delete(t)),await r(`blobs`,`readwrite`,e=>void e.delete(IDBKeyRange.bound(`${t}/`,`${t}/￿`)))},()=>e.delete(t))}}var yt=[`id`,`profile`,`page`,`paper`,`created`,`updated`,`thumb`,`done`,`deleted`,`colourAsset`,`linesAsset`,`fxAsset`],bt=class{local=`indexedDB`in window?vt():_t();metas=new Map;account;init;uploading=new Map;ready(){return this.init??=(async()=>{for(let e of await this.local.getAll().catch(()=>[]))this.metas.set(e.id,e);let e=await Promise.race([St(),new Promise(e=>setTimeout(()=>e(void 0),gt))]);if(e){this.account=e;try{let t=await e.col.get();for(let e of t.docs){let t=e.data();if(!t?.id)continue;let n=this.metas.get(t.id);if(!n||t.updated>n.updated){let e={...t,localAt:n?.localAt,dirty:!1};this.metas.set(e.id,e),await this.local.put(e).catch(()=>{})}else n.updated>t.updated&&(n.dirty=!0)}let n=new Set(t.docs.map(e=>e.id));for(let e of this.metas.values())n.has(e.id)||(e.dirty=!0);this.syncAll()}catch{this.account=void 0}}})(),this.init}status(){return this.account?this.account.assets?`account`:`account-readonly`:`local`}list(e){return[...this.metas.values()].filter(t=>t.profile===e&&!t.deleted).sort((e,t)=>t.updated-e.updated)}get(e){let t=this.metas.get(e);return t&&!t.deleted?t:void 0}latestFor(e,t){return this.list(e).find(e=>e.page===t)}async colours(e){if((e.localAt??0)>=e.updated||!e.colourAsset){let t=await this.local.blob(`${e.id}/colours`).catch(()=>void 0);if(t||!e.colourAsset)return t}let t=await Ct(e.colourAsset);return t?(await this.local.putBlob(`${e.id}/colours`,t).catch(()=>{}),e.localAt=e.updated,await this.local.put(e).catch(()=>{}),t):this.local.blob(`${e.id}/colours`).catch(()=>void 0)}async lines(e){let t=await this.local.blob(`${e.id}/lines`).catch(()=>void 0);if(t||!e.linesAsset)return t;let n=await Ct(e.linesAsset);return n&&await this.local.putBlob(`${e.id}/lines`,n).catch(()=>{}),n}async effects(e){let t=(e.localAt??0)>=e.updated,n=await this.local.blob(`${e.id}/fx`).catch(()=>void 0);if(n||t||!e.fxAsset)return n;let r=await Ct(e.fxAsset);return r&&await this.local.putBlob(`${e.id}/fx`,r).catch(()=>{}),r}async save(e,t,n,r){e.localAt=e.updated,e.dirty=!0,this.metas.set(e.id,e),await this.local.putBlob(`${e.id}/colours`,t).catch(()=>{}),n&&await this.local.putBlob(`${e.id}/lines`,n).catch(()=>{}),r?await this.local.putBlob(`${e.id}/fx`,r).catch(()=>{}):r===null&&await this.local.deleteBlob(`${e.id}/fx`).catch(()=>{}),await this.local.put(e).catch(()=>{})}async remove(e){let t=this.metas.get(e);if(!t)return;let n={id:e,profile:t.profile,page:t.page,paper:t.paper,created:t.created,updated:Date.now(),thumb:``,deleted:!0};this.metas.set(e,n),await this.local.delete(e).catch(()=>{}),await this.local.put(n).catch(()=>{});let r=this.account;if(r?.assets)try{await r.col.doc(e).set(xt(n));for(let e of[t.colourAsset,t.linesAsset,t.fxAsset])e&&await r.assets.delete(e).catch(()=>{})}catch{}}async sync(e){if(!e)return this.syncAll();let t=this.uploading.get(e);if(t)return t;let n=this.upload(e).finally(()=>this.uploading.delete(e));return this.uploading.set(e,n),n}async syncAll(){for(let e of[...this.metas.values()])e.dirty&&await this.sync(e.id)}async upload(e){let t=this.account,n=this.metas.get(e);if(!t?.assets||!n?.dirty)return;let r=n.updated;try{if(n.deleted)await t.col.doc(e).set(xt(n));else{let r=await this.local.blob(`${e}/colours`).catch(()=>void 0);if(!r)return;let i=n.colourAsset,a=await t.assets.upload(r,{type:`image/png`});if(n.colourAsset=a.id,n.page===`photo`&&!n.linesAsset){let r=await this.local.blob(`${e}/lines`).catch(()=>void 0);r&&(n.linesAsset=(await t.assets.upload(r,{type:`image/png`})).id)}let o=n.fxAsset,s=await this.local.blob(`${e}/fx`).catch(()=>void 0);n.fxAsset=s?(await t.assets.upload(s,{type:`image/png`})).id:void 0,await t.col.doc(e).set(xt(n)),i&&i!==a.id&&await t.assets.delete(i).catch(()=>{}),o&&o!==n.fxAsset&&await t.assets.delete(o).catch(()=>{})}n.updated===r&&(n.dirty=!1),await this.local.put(n).catch(()=>{})}catch{}}};function xt(e){let t={};for(let n of yt)e[n]!==void 0&&(t[n]=e[n]);return t}async function St(){let e=window.claude;if(typeof e?.use==`function`)try{let[t,n,r]=await Promise.all([e.use(`db`),e.use(`user`),e.use(`assets`)]),i=await n?.id();return!t||!i?void 0:{col:t.collection(`data/users/${i}/paint-pond/art`),assets:r}}catch{return}}async function Ct(e){if(e)try{let t=await fetch(`/_blob/${e}`);return t.ok?await t.blob():void 0}catch{return}}var N=new bt;function wt(){return`a${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`}var Tt=6e3,Et=1200,Dt=5e3;function Ot(e,t=`default`){let n=`${e}/${t}/`,r=Pt()??Ft()??It(),i={},a,o=`connecting`,s=!1,c=new Set,l=!1,u,d,f=async e=>kt(await r.get(n+e).catch(()=>void 0)),p=(e,t)=>!t||e&&e.at>t.at?e:t,m=(async()=>{if(a=await jt(At(e,t)),!a)o=`unavailable`;else try{let e=await a.get(),t=e.exists?e.data()?.keys:void 0;Object.assign(i,t??{});for(let e of await r.keys().catch(()=>[])){if(!e.startsWith(n))continue;let t=e.slice(n.length),r=await f(t);r&&r.at>(i[t]?.at??-1)&&(i[t]=r,l=!0)}for(let[e,t]of Object.entries(i)){let i=await f(e);(!i||t.at>i.at)&&await r.set(n+e,t).catch(()=>{})}s=!0,o=`synced`;for(let e of c){let t=await f(e);t&&t.at>(i[e]?.at??-1)&&(i[e]=t,l=!0)}c.clear(),l&&g(0)}catch{a=void 0,o=`unavailable`}})(),h=()=>Promise.race([m,new Promise(e=>setTimeout(e,Tt))]);function g(e){a&&s&&(l=!0,clearTimeout(d),d=setTimeout(()=>void _(),e))}async function _(){for(clearTimeout(d);a&&s&&l;){if(u){await u;continue}l=!1,o=`saving`;let n=!1;if(u=a.set({v:1,game:e,profile:t,keys:JSON.parse(JSON.stringify(i))}).then(()=>{o=`synced`}).catch(e=>{e?.code===`unavailable`||e?.code===`resource_exhausted`?(l=n=!0,o=`synced`):(a=void 0,o=e?.code===`invalid_argument`?`read-only`:`unavailable`)}).finally(()=>{u=void 0}),await u,n){d=setTimeout(()=>void _(),Dt);return}}}let v=()=>{l&&_()};document.addEventListener(`visibilitychange`,()=>document.hidden&&v()),window.addEventListener(`pagehide`,v);let y=async(e,t)=>{s||c.add(e),await r.set(n+e,t).catch(()=>{}),a&&s&&(i[e]=t,g(Et))};return{async get(e){await h();let t=p(await f(e),i[e]);return t&&!t.deleted?t.value:void 0},set:(e,t)=>y(e,{__fg:1,at:Date.now(),value:t}),remove:e=>y(e,{__fg:1,at:Date.now(),deleted:!0}),async keys(){await h();let e=new Set(Object.keys(i));for(let t of await r.keys().catch(()=>[]))t.startsWith(n)&&e.add(t.slice(n.length));let t=[];for(let n of e){let e=p(await f(n),i[n]);e&&!e.deleted&&t.push(n)}return t},ready:h,flush:_,status:()=>({local:r.kind,account:o}),get backend(){return o===`synced`||o===`saving`?`${r.kind}+db`:r.kind}}}function kt(e){if(e!==void 0)return e&&typeof e==`object`&&e.__fg===1?e:{__fg:1,at:0,value:e}}function At(e,t){return`${e}~${t}`.replace(/[^A-Za-z0-9_\-.~:@+]/g,`_`)}async function jt(e){let t=window.claude;if(typeof t?.use!=`function`)return;let n=(async()=>{let[n,r]=await Promise.all([t.use(`db`),t.use(`user`)]),i=await r?.id();return n&&i?n.collection(`data/users/${i}`).doc(e):void 0})().catch(()=>void 0),r=new Promise(e=>setTimeout(()=>e(void 0),Tt));return Promise.race([n,r])}var Mt=`family-games`,Nt=`saves`;function Pt(){let e;try{if(!(`indexedDB`in window))return;e=new Promise((e,t)=>{let n=indexedDB.open(Mt,1);n.onupgradeneeded=()=>n.result.createObjectStore(Nt),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}catch{return}let t=Ft()??It(),n=!1,r=(t,n)=>e.then(e=>new Promise((r,i)=>{let a=e.transaction(Nt,t),o=n(a.objectStore(Nt));t===`readwrite`?(a.oncomplete=()=>r(o.result),a.onabort=a.onerror=()=>i(a.error??o.error)):(o.onsuccess=()=>r(o.result),o.onerror=()=>i(o.error))})),i=(e,t)=>e.catch(()=>(n=!0,t()));return{get kind(){return n?t.kind:`indexeddb`},get:e=>i(r(`readonly`,t=>t.get(e)),()=>t.get(e)),set:(e,n)=>i(r(`readwrite`,t=>t.put(n,e)),()=>t.set(e,n)),remove:e=>i(r(`readwrite`,t=>t.delete(e)),()=>t.remove(e)),keys:()=>i(r(`readonly`,e=>e.getAllKeys()).then(e=>e.map(String)),()=>t.keys())}}function Ft(){try{let e=`__fg_probe__`;localStorage.setItem(e,`1`),localStorage.removeItem(e)}catch{return}let e=`fg.save.`;return{kind:`localstorage`,async get(t){let n=localStorage.getItem(e+t);return n===null?void 0:JSON.parse(n)},async set(t,n){localStorage.setItem(e+t,JSON.stringify(n))},async remove(t){localStorage.removeItem(e+t)},async keys(){return Object.keys(localStorage).filter(t=>t.startsWith(e)).map(e=>e.slice(8))}}}function It(){let e=new Map;return{kind:`memory`,async get(t){return structuredClone(e.get(t))},async set(t,n){e.set(t,structuredClone(n))},async remove(t){e.delete(t)},async keys(){return[...e.keys()]}}}var Lt=[{id:`p-truck`,avatar:`🚚`,name:``,level:1,insideLines:!0},{id:`p-unicorn`,avatar:`🦄`,name:``,level:2,insideLines:!0},{id:`p-tiger`,avatar:`🐯`,name:``,level:3,insideLines:!0}],Rt=[`🚚`,`🦄`,`🐯`,`🦖`,`🐼`,`🐸`,`🦊`,`🐙`,`🐰`,`🐱`,`🐶`,`🦁`,`🐬`,`🦋`,`🚀`,`🌈`,`⚽`,`🎨`],zt,P=Lt.map(e=>({...e})),Bt={sound:!0};async function Vt(){zt=Ot(`paint-pond`,`family`),await zt.ready();let e=await zt.get(`profiles`);Array.isArray(e)&&e.length&&(P=e.map(e=>({...Lt[0],...e})));let t=await zt.get(`settings`);t&&(Bt={...Bt,...t})}function Ht(){return P}function Ut(e){return P.find(t=>t.id===e)??P[0]}function Wt(e){P=e,zt?.set(`profiles`,e)}function Gt(e,t){Wt(P.map(n=>n.id===e?{...n,...t}:n))}function Kt(){let e=new Set(P.map(e=>e.avatar)),t=Rt.find(t=>!e.has(t))??`🎨`,n={id:`p-${Date.now().toString(36)}`,avatar:t,name:``,level:2,insideLines:!0};return Wt([...P,n]),n}function qt(e){P.length<=1||Wt(P.filter(t=>t.id!==e))}function Jt(){return Bt}function Yt(e){Bt={...Bt,...e},zt?.set(`settings`,Bt)}function Xt(){return zt?.flush()??Promise.resolve()}var Zt=`https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&display=swap`,Qt=new Set;function $t(e=Zt){if(typeof document>`u`||Qt.has(e)||(Qt.add(e),document.documentElement.dataset.fgWebfont===`off`))return;let t=new URL(e).searchParams.get(`family`)?.split(`:`)[0];if([...document.querySelectorAll(`link[rel="stylesheet"]`)].some(e=>t&&e.href.includes(`family=${t.replace(/ /g,`+`)}`)))return;let n=Object.assign(document.createElement(`link`),{rel:`preconnect`,href:`https://fonts.gstatic.com`,crossOrigin:`anonymous`}),r=Object.assign(document.createElement(`link`),{rel:`stylesheet`,href:e});document.head.append(n,r)}$t(),typeof document<`u`&&document.addEventListener(`touchstart`,()=>{},{passive:!0});function en(){return typeof matchMedia==`function`&&matchMedia(`(prefers-reduced-motion: reduce)`).matches}function F(e,t=null,...n){let r=document.createElement(e);for(let[e,n]of Object.entries(t??{}))n!=null&&n!==!1&&(e===`class`?r.className=String(n):e===`style`?r.style.cssText=String(n):e===`html`?r.innerHTML=String(n):r.setAttribute(e,n===!0?``:String(n)));for(let e of n)e!=null&&e!==!1&&r.append(typeof e==`number`?String(e):e);return r}function tn(e){if(e.trimStart().startsWith(`<svg`)){let t=document.createElement(`template`);return t.innerHTML=e.trim(),t.content}return document.createTextNode(e)}var nn=`button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])`;function I(e){let t=document.activeElement instanceof HTMLElement?document.activeElement:null,n=F(`div`,{class:[`fg-overlay`,e.layer&&e.layer!==`menu`?`fg-overlay--${e.layer}`:``,e.className??``].join(` `).trim(),role:`dialog`,"aria-modal":`true`,"aria-label":e.label,tabindex:`-1`}),r=F(`div`,{class:`fg-card ${e.cardClassName??``}`.trim()});n.append(r);let i=!1;return n.addEventListener(`keydown`,t=>{if(t.stopPropagation(),e.onKey?.(t))return;if(t.key===`Escape`){t.preventDefault(),e.onEscape?.();return}if(t.key===`Tab`)return rn(t,n);let r=t.target;(t.key===`Enter`||t.key===` `)&&r instanceof HTMLButtonElement&&!r.dataset.fgHold&&(t.preventDefault(),t.repeat||r.click())}),n.addEventListener(`contextmenu`,e=>e.preventDefault()),document.body.append(n),an(n),{root:n,card:r,get closed(){return i},close(){i||(i=!0,n.remove(),t?.isConnected&&!document.querySelector(`.fg-overlay`)&&t.focus({preventScroll:!0}))}}}function rn(e,t){let n=[...t.querySelectorAll(nn)].filter(e=>e.getClientRects().length>0),r=n[0],i=n[n.length-1];if(!r||!i)return;let a=document.activeElement;e.shiftKey&&(a===r||a===t)?(e.preventDefault(),i.focus()):!e.shiftKey&&(a===i||a===t)&&(e.preventDefault(),r.focus())}function an(e){requestAnimationFrame(()=>e.isConnected&&e.focus({preventScroll:!0}))}var L=e=>({size:.4,spacing:.1,layer:1,tip:`hard`,pressureSize:.3,pressureAlpha:0,...e}),R={crayon:L({id:`crayon`,family:`stroke`,min:14,max:160,size:.48,spacing:.1,tip:`crayon`,grain:`crayon`,pressureSize:.3,pressureAlpha:.45}),pencil:L({id:`pencil`,family:`stroke`,min:4,max:48,size:.32,spacing:.22,tip:`soft`,grain:`pencil`,pressureSize:.5,pressureAlpha:.7}),marker:L({id:`marker`,family:`stroke`,min:12,max:140,size:.48,spacing:.08,layer:.82,tip:`hard`,pressureSize:.15}),paint:L({id:`paint`,family:`stroke`,min:16,max:200,size:.5,spacing:.05,tip:`bristle`,pressureSize:.55}),watercolour:L({id:`watercolour`,family:`stroke`,min:30,max:280,size:.5,spacing:.07,layer:.5,tip:`wet`,grain:`watercolour`,pressureSize:.35}),spray:L({id:`spray`,family:`stroke`,min:50,max:360,size:.5,spacing:.12,pressureSize:.2,pressureAlpha:.5}),glitter:L({id:`glitter`,family:`stroke`,min:24,max:200,size:.5,spacing:.18,pressureSize:.3}),rainbow:L({id:`rainbow`,family:`stroke`,min:14,max:170,size:.48,spacing:.07,pressureSize:.3}),glow:L({id:`glow`,family:`stroke`,min:14,max:140,size:.42,spacing:.08,pressureSize:.3}),smudge:L({id:`smudge`,family:`direct`,min:30,max:240,size:.5,spacing:.12,tip:`soft`,pressureSize:.3}),eraser:L({id:`eraser`,family:`direct`,min:16,max:260,size:.5,spacing:.08,pressureSize:.2}),fill:L({id:`fill`,family:`tap`,min:0,max:0}),sticker:L({id:`sticker`,family:`tap`,min:90,max:640,size:.4})};function on(e,t){return e.min+(e.max-e.min)*Math.max(0,Math.min(1,t))**1.6}var z=128,sn=new Map,cn=new Map;function ln(e,t=e){let n=document.createElement(`canvas`);return n.width=e,n.height=t,n}function un(e){let t=e>>>0||1;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)/4294967296)}function dn(e){let t=sn.get(e);if(t)return t;let n=ln(z),r=n.getContext(`2d`),i=z/2,a=un(e.length*977);if(e===`hard`)r.beginPath(),r.arc(i,i,63,0,Math.PI*2),r.fill();else if(e===`soft`){let e=r.createRadialGradient(i,i,0,i,i,i);e.addColorStop(0,`rgba(0,0,0,1)`),e.addColorStop(.55,`rgba(0,0,0,0.8)`),e.addColorStop(1,`rgba(0,0,0,0)`),r.fillStyle=e,r.fillRect(0,0,z,z)}else if(e===`wet`){let e=r.createRadialGradient(i,i,0,i,i,i);e.addColorStop(0,`rgba(0,0,0,0.55)`),e.addColorStop(.72,`rgba(0,0,0,0.75)`),e.addColorStop(.88,`rgba(0,0,0,0.95)`),e.addColorStop(1,`rgba(0,0,0,0)`),r.fillStyle=e,r.fillRect(0,0,z,z)}else if(e===`crayon`){r.beginPath();for(let e=0;e<=40;e++){let t=e/40*Math.PI*2,n=i*(.84+a()*.14),o=i+Math.cos(t)*n,s=i+Math.sin(t)*n;e===0?r.moveTo(o,s):r.lineTo(o,s)}r.closePath(),r.fill(),r.globalCompositeOperation=`destination-out`;for(let e=0;e<70;e++)r.globalAlpha=.2+a()*.5,r.fillRect(a()*z,a()*z,2+a()*4,2+a()*4)}else for(let e=0;e<26;e++){let t=10+e/25*108+(a()-.5)*3,n=z*(.18+a()*.16);r.globalAlpha=.55+a()*.45,r.beginPath(),r.ellipse(i,t,n,3+a()*2.5,0,0,Math.PI*2),r.fill()}return sn.set(e,n),n}function fn(e,t){let n=`${e}|${t}`,r=cn.get(n);if(r)return cn.delete(n),cn.set(n,r),r;let i=ln(z),a=i.getContext(`2d`);for(a.drawImage(dn(e),0,0),a.globalCompositeOperation=`source-in`,a.fillStyle=t,a.fillRect(0,0,z,z),cn.set(n,i);cn.size>96;){let e=cn.keys().next().value;cn.delete(e)}return i}var B=256,pn=new Map;function mn(e,t,n){let r=new Float32Array(t*t).map(()=>n()),i=new Float32Array(e*e),a=(e,n)=>r[(n%t+t)%t*t+(e%t+t)%t];for(let n=0;n<e;n++){let r=n/e*t,o=Math.floor(r),s=r-o,c=s*s*(3-2*s);for(let r=0;r<e;r++){let s=r/e*t,l=Math.floor(s),u=s-l,d=u*u*(3-2*u),f=a(l,o)+(a(l+1,o)-a(l,o))*d,p=a(l,o+1)+(a(l+1,o+1)-a(l,o+1))*d;i[n*e+r]=f+(p-f)*c}}return i}function hn(e){let t=pn.get(e);if(t)return t;let n=un(e===`crayon`?11:e===`pencil`?23:37),r=mn(B,64,n),i=mn(B,16,n),a=mn(B,4,n),o=ln(B),s=o.getContext(`2d`),c=s.createImageData(B,B);for(let t=0;t<B*B;t++){let o;o=e===`crayon`?gn(.3,.52,r[t]*.65+i[t]*.35+(n()-.5)*.12):e===`pencil`?.25+.75*gn(.28,.6,r[t]*.75+i[t]*.25+(n()-.5)*.2):.72+.28*gn(.25,.75,a[t]*.5+i[t]*.35+r[t]*.15),c.data[t*4+3]=Math.round(o*255)}return s.putImageData(c,0,0),pn.set(e,o),o}function gn(e,t,n){let r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)}function _n(e){let t=e.replace(`#`,``),n=parseInt(t.length===3?[...t].map(e=>e+e).join(``):t,16);return[n>>16&255,n>>8&255,n&255]}function vn(e,t,n){return`#${[e,t,n].map(e=>Math.round(Math.max(0,Math.min(255,e))).toString(16).padStart(2,`0`)).join(``)}`}function V(e,t){let[n,r,i]=_n(e),a=t>0?255:0,o=Math.abs(t);return vn(n+(a-n)*o,r+(a-r)*o,i+(a-i)*o)}function yn(e,t,n){let r=r=>{let i=(r+e/60)%6;return n-n*t*Math.max(0,Math.min(i,4-i,1))};return vn(r(5)*255,r(3)*255,r(1)*255)}function bn(e){let[t,n,r]=_n(e).map(e=>e/255),i=Math.max(t,n,r),a=i-Math.min(t,n,r),o=0;return a&&(o=i===t?(n-r)/a%6:i===n?(r-t)/a+2:(t-n)/a+4,o*=60,o<0&&(o+=360)),[o,i?a/i:0,i]}function xn(e,t,n){let r=t*Math.min(n,1-n),i=t=>{let i=(t+e/30)%12;return n-r*Math.max(-1,Math.min(i-3,9-i,1))};return vn(i(0)*255,i(8)*255,i(4)*255)}var Sn=`rainbow`,Cn=[`#ff4d4d`,`#ff9a3c`,`#ffd60a`,`#4cd163`,`#3fb4ff`,`#8b6cff`,`#ff5fa2`];function wn(e){return xn(Math.round(e/10)*10%360,.92,.58)}function Tn(e){let[t,n,r]=_n(e);return(t*.299+n*.587+r*.114)/255}var En,Dn=!1,On=Promise.resolve();function kn(e){let t=On.then(()=>An(e));return On=t.catch(()=>null),t}async function An(e){if(!Dn&&typeof OffscreenCanvas<`u`){try{En??=new Worker(new URL(new URL(`encode.worker-BgkKNcgQ.js`,import.meta.url).href,``+import.meta.url),{type:`module`});let t=En,n=await createImageBitmap(e),r=await new Promise((e,r)=>{t.onmessage=t=>e(t.data),t.onerror=()=>r(Error(`encode worker failed`)),t.postMessage(n,[n])});if(r)return r}catch{}Dn=!0}return new Promise(t=>e.toBlob(t,`image/png`))}var jn=104857600,Mn=50,Nn=e=>e.parts.reduce((e,t)=>e+t.w*t.h*4*(t.after?2:1),0);function H(e,t,n,r,i){let a=document.createElement(`canvas`);return a.width=r,a.height=i,a.getContext(`2d`).drawImage(e,t,n,r,i,0,0,r,i),a}function Pn(e){e&&(e.width=e.height=0)}function Fn(e,t){let n=e.ctx;n.save(),n.globalCompositeOperation=`source-over`,n.globalAlpha=1,n.clearRect(e.x,e.y,e.w,e.h),n.drawImage(t,e.x,e.y),n.restore()}var In=class{undos=[];redos=[];bytes=0;onChange;get canUndo(){return this.undos.length>0}get canRedo(){return this.redos.length>0}push(e){for(let e of this.redos)this.drop(e);for(this.redos=[],this.undos.push(e),this.bytes+=Nn(e);this.undos.length>1&&(this.bytes>jn||this.undos.length>Mn);)this.drop(this.undos.shift());this.onChange?.()}undo(){let e=this.undos.pop();if(e){this.bytes-=Nn(e);for(let t of e.parts)t.after=H(t.ctx.canvas,t.x,t.y,t.w,t.h),Fn(t,t.before);return this.redos.push(e),this.bytes+=Nn(e),this.onChange?.(),e}}redo(){let e=this.redos.pop();if(e){this.bytes-=Nn(e);for(let t of e.parts)t.after&&=(Pn(t.before),t.before=H(t.ctx.canvas,t.x,t.y,t.w,t.h),Fn(t,t.after),Pn(t.after),void 0);return this.undos.push(e),this.bytes+=Nn(e),this.onChange?.(),e}}clear(){for(let e of[...this.undos,...this.redos])for(let t of e.parts)Pn(t.before),Pn(t.after);this.undos=[],this.redos=[],this.bytes=0,this.onChange?.()}drop(e){this.bytes-=Nn(e);for(let t of e.parts)Pn(t.before),Pn(t.after)}},Ln=3;async function Rn(e,t){let n=document.createElement(`canvas`);n.width=n.height=t;let r=n.getContext(`2d`,{willReadFrequently:!0});r.drawImage(e,0,0,t,t);let i=r.getImageData(0,0,t,t).data;return n.width=n.height=0,{...await new Promise((e,n)=>{let r=new Worker(new URL(new URL(`regions.worker-ESgDrMUY.js`,import.meta.url).href,``+import.meta.url),{type:`module`});r.onmessage=t=>{r.terminate(),e(t.data)},r.onerror=e=>{r.terminate(),n(e.error??Error(e.message))};let a={size:t,rgba:i};r.postMessage(a,[i.buffer])}),size:t}}function zn(e,t,n,r=28){let{size:i,labels:a,areas:o}=e,s=Math.round(t),c=Math.round(n);if(s<0||c<0||s>=i||c>=i)return 0;let l=a[c*i+s];if(l>0&&o[l]>=400)return l;for(let e=2;e<=r;e+=2)for(let t=0;t<16;t++){let n=t/16*Math.PI*2,r=Math.round(s+Math.cos(n)*e),l=Math.round(c+Math.sin(n)*e);if(r<0||l<0||r>=i||l>=i)continue;let u=a[l*i+r];if(u>0&&o[u]>=400)return u}return l>0?l:0}var U=new Map,Bn,Vn=12582912,Hn=0;function Un(){for(let e of U.values())e.canvas.width=e.canvas.height=0;U.clear(),Bn=void 0,Hn++}function Wn(e,t){Bn!==e&&(Un(),Bn=e);let n=String(t),r=U.get(n);if(r)return U.delete(n),U.set(n,r),r;let{size:i,labels:a,boxes:o}=e,s=Math.max(0,o[t*4]-Ln),c=Math.max(0,o[t*4+1]-Ln),l=Math.min(i-1,o[t*4+2]+Ln),u=Math.min(i-1,o[t*4+3]+Ln),d=l-s+1,f=u-c+1,p=document.createElement(`canvas`);p.width=d,p.height=f;let m=p.getContext(`2d`),h=m.createImageData(d,f),g=new Uint32Array(h.data.buffer);for(let e=0;e<f;e++){let n=(c+e)*i+s,r=e*d;for(let e=0;e<d;e++)a[n+e]===t&&(g[r+e]=4278190080)}m.putImageData(h,0,0);let _=Gn(p,d,f);p.width=p.height=0;let v={canvas:_,x:s,y:c,w:d,h:f};U.set(n,v);let y=()=>[...U.values()].reduce((e,t)=>e+t.w*t.h,0);for(;U.size>1&&(U.size>12||y()>Vn);){let[e,t]=U.entries().next().value;t.canvas.width=t.canvas.height=0,U.delete(e)}return v}function Gn(e,t,n,r=Ln){let i=document.createElement(`canvas`);i.width=t,i.height=n;let a=i.getContext(`2d`);a.drawImage(e,0,0);for(let t=1;t<=r;t++)a.drawImage(e,t,0),a.drawImage(e,-t,0);let o=document.createElement(`canvas`);o.width=t,o.height=n;let s=o.getContext(`2d`);s.drawImage(i,0,0);for(let e=1;e<=r;e++)s.drawImage(i,0,e),s.drawImage(i,0,-e);return i.width=i.height=0,o}function Kn(e,t=2){let n=Array.from({length:e.count},(e,t)=>t+1).sort((t,n)=>e.areas[n]-e.areas[t]).slice(0,t),r=Hn,i=()=>{let t=n.shift();t!==void 0&&r===Hn&&(Wn(e,t),setTimeout(i,30))};setTimeout(i,30)}function qn(e,t,n,r=48){let i=e.width,a=Math.round(t),o=Math.round(n);if(a<0||o<0||a>=i||o>=i)return;let s=e.getContext(`2d`,{willReadFrequently:!0}).getImageData(0,0,i,i).data,c=(o*i+a)*4,l=s[c+3],u=l?s[c]:255,d=l?s[c+1]:255,f=l?s[c+2]:255,p=r*r*3,m=e=>{let t=e*4,n=s[t+3],r=n<40?255:s[t],i=n<40?255:s[t+1],a=n<40?255:s[t+2];if(l<40!=n<40)return!1;let o=r-u,c=i-d,m=a-f;return o*o+c*c+m*m<=p},h=i*i,g=new Uint8Array(h),_=[o*i+a],v=a,y=a,b=o,x=o;for(;_.length;){let e=_.pop();if(g[e])continue;let t=e/i|0,n=t*i,r=e-n,a=r;for(;r>0&&!g[n+r-1]&&m(n+r-1);)r--;for(;a<i-1&&!g[n+a+1]&&m(n+a+1);)a++;for(let e=r;e<=a;e++)g[n+e]=1;r<v&&(v=r),a>y&&(y=a),t<b&&(b=t),t>x&&(x=t);for(let e of[t-1,t+1]){if(e<0||e>=i)continue;let t=e*i,n=!1;for(let e=r;e<=a;e++){let r=!g[t+e]&&m(t+e);r&&!n&&_.push(t+e),n=r}}}let S=Math.max(0,v-1),C=Math.max(0,b-1),ee=Math.min(i-1,y+1),w=Math.min(i-1,x+1),T=ee-S+1,E=w-C+1,D=document.createElement(`canvas`);D.width=T,D.height=E;let O=D.getContext(`2d`),te=O.createImageData(T,E),ne=new Uint32Array(te.data.buffer);for(let e=0;e<E;e++){let t=(C+e)*i+S;for(let n=0;n<T;n++)g[t+n]&&(ne[e*T+n]=4278190080)}O.putImageData(te,0,0);let re=Gn(D,T,E,1);return D.width=D.height=0,{canvas:re,x:S,y:C,w:T,h:E}}var W=2048,G=512/W,Jn=[`#fff1a8`,`#ffd54a`,`#f0b323`,`#c98b0b`],Yn=[`#ffffff`,`#e3e8ee`,`#b9c3cd`,`#8d99a6`];function K(e){let t=document.createElement(`canvas`);return t.width=t.height=e,t}var Xn=(e,t)=>{if(!e)return{...t};let n=Math.min(e.x,t.x),r=Math.min(e.y,t.y);return{x:n,y:r,w:Math.max(e.x+e.w,t.x+t.w)-n,h:Math.max(e.y+e.h,t.y+t.h)-r}},Zn=e=>{let t=Math.max(0,Math.floor(e.x)),n=Math.max(0,Math.floor(e.y)),r=Math.min(W,Math.ceil(e.x+e.w)),i=Math.min(W,Math.ceil(e.y+e.h));return r>t&&i>n?{x:t,y:n,w:r-t,h:i-n}:void 0},Qn=`"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`,$n=class{colour=K(W);live=K(W);history=new In;coverage=K(W);backup=K(W);cc=this.colour.getContext(`2d`,{willReadFrequently:!1});lc=this.live.getContext(`2d`);vc=this.coverage.getContext(`2d`);bc=this.backup.getContext(`2d`);patch=K(256);patchMask=K(256);glitterMap=K(512);glowMap=K(512);glitterBackup=K(512);glowBackup=K(512);gm=this.glitterMap.getContext(`2d`);wm=this.glowMap.getContext(`2d`);regions;insideLines=!0;tool=`crayon`;colourHex=`#ff4d4d`;opacity=1;fillMode=`solid`;sticker=`⭐`;glitterKind=`colour`;sizes=Object.fromEntries(Object.values(R).map(e=>[e.id,e.size]));onCommit;onFill;onEffects;hasPaint=!1;stats={frameMs:0,worstFrameMs:0,endMs:0};stroke;queue=[];raf=0;fillAnim;pendingCapture;seed=1;get drawing(){return!!this.stroke}begin(e){this.finishFill();let t=R[this.tool];if(t.id===`fill`)return;this.flushCapture(),this.takeBackup();let n=un(this.seed++*2654435761),r={brush:t,colour:this.colourHex,residual:0,travelled:0,rand:n,hue:n()*360};if(this.insideLines&&this.regions&&t.id!==`sticker`){let t=zn(this.regions,e.x,e.y);t>0&&(r.mask=Wn(this.regions,t))}if(t.grain&&(r.grain=this.lc.createPattern(hn(t.grain),`repeat`)??void 0),this.live.style.visibility=t.family===`direct`?`hidden`:`visible`,this.live.style.opacity=String(t.family===`stroke`?t.layer*this.opacity:1),this.stroke=r,t.id===`sticker`){let i=on(t,this.sizes.sticker);r.sticker={x:e.x,y:e.y,size:i,rot:(n()-.5)*.5},this.drawStickerPreview()}else this.queue.push(e),this.pump()}move(e){let t=this.stroke;if(t){if(t.sticker){let n=e.at(-1);t.sticker.x=n.x,t.sticker.y=n.y,this.drawStickerPreview()}else this.queue.push(...e),this.schedule()}}end(){let e=this.stroke;if(!e)return;let t=performance.now();this.pump(),this.stroke=void 0,cancelAnimationFrame(this.raf),this.raf=0;let n=e.sticker?e.sticker.drawn:e.bbox&&Zn(e.bbox);if(n){let t=e.sticker?1:e.brush.family===`stroke`?e.brush.layer*this.opacity:this.opacity;(e.brush.family===`stroke`||e.sticker)&&(this.cc.save(),this.cc.globalAlpha=t,this.cc.drawImage(this.live,n.x,n.y,n.w,n.h,n.x,n.y,n.w,n.h),this.cc.restore());let r=e.brush.id===`glitter`?`glitter`:e.brush.id===`glow`?`glow`:e.brush.id===`smudge`?`none`:`cover`;this.applyEffect(r,this.live,n,t),this.deferCapture(n),this.lc.clearRect(n.x,n.y,n.w,n.h),this.vc.clearRect(n.x,n.y,n.w,n.h),this.hasPaint=!0,this.onCommit?.()}this.live.style.visibility=`visible`,this.stats.endMs=performance.now()-t}cancel(){let e=this.stroke;if(!e)return;this.queue=[],this.stroke=void 0,cancelAnimationFrame(this.raf),this.raf=0;let t=e.sticker?e.sticker.drawn:e.bbox&&Zn(e.bbox);t&&(e.brush.family===`direct`&&(this.cc.save(),this.cc.globalCompositeOperation=`copy`,this.cc.beginPath(),this.cc.rect(t.x,t.y,t.w,t.h),this.cc.clip(),this.cc.drawImage(this.backup,0,0),this.cc.restore()),this.lc.clearRect(t.x,t.y,t.w,t.h),this.vc.clearRect(t.x,t.y,t.w,t.h)),this.live.style.visibility=`visible`}get strokeLength(){return this.stroke?.travelled??0}schedule(){this.raf||=requestAnimationFrame(()=>{this.raf=0,this.pump(),this.stroke?.brush.id===`spray`&&this.schedule()})}pump(){let e=this.stroke;if(!e)return;let t=performance.now();this.stampAndCompose(e);let n=performance.now()-t;this.stats.frameMs=n,this.stats.worstFrameMs=Math.max(this.stats.worstFrameMs*.98,n)}stampAndCompose(e){let t=this.queue;this.queue=[],t.length===0&&e.brush.id===`spray`&&e.last&&this.dab(e,e.last,0);for(let n of t)this.addPoint(e,n);let n=e.frame&&Zn({x:e.frame.x-2,y:e.frame.y-2,w:e.frame.w+4,h:e.frame.h+4});e.frame=void 0,n&&e.brush.id!==`smudge`&&(this.composeLive(e,n),e.brush.id===`eraser`&&this.composeErase(n))}addPoint(e,t){let n=e.last;if(!n){e.last=t,this.dab(e,t,0);return}let r=t.x-n.x,i=t.y-n.y,a=Math.hypot(r,i);if(a<.5)return;let o=Math.atan2(i,r),s=t=>Math.max(1,this.diameter(e,t)*e.brush.spacing),c=e.travelled,l=s(n.pressure),u=Math.max(0,l-e.residual),d=-e.residual;for(;u<=a;){let f=u/a,p={x:n.x+r*f,y:n.y+i*f,pressure:n.pressure+(t.pressure-n.pressure)*f,tilt:n.tilt+(t.tilt-n.tilt)*f};e.travelled=c+u,this.dab(e,p,o),d=u,l=s(p.pressure),u+=l}e.residual=a-d,e.travelled=c+a,e.last=t}diameter(e,t){let n=e.brush,r=on(n,this.sizes[n.id]),i=1-n.pressureSize+n.pressureSize*Math.min(2,t*2);return Math.max(1.5,r*i)}dab(e,t,n){let r=e.brush,i=e.colour===`rainbow`?wn(e.hue+e.travelled*.32):e.colour,a=this.diameter(e,t.pressure),o=this.vc,s=e.rand,c=Math.min(1,t.pressure*1.6),l=a/2;switch(o.save(),r.id){case`crayon`:case`pencil`:case`marker`:case`watercolour`:{r.id===`pencil`&&(a*=1+t.tilt*2.5),l=a/2,o.globalAlpha=r.id===`watercolour`?.13:1-r.pressureAlpha+r.pressureAlpha*c;let e=fn(r.tip,i);o.translate(t.x,t.y),r.id===`crayon`&&o.rotate(s()*Math.PI*2),o.drawImage(e,-a/2,-a/2,a,a);break}case`paint`:{let e=s(),r=e<.25?V(i,.1):e>.8?V(i,-.1):i;o.translate(t.x,t.y),o.rotate(n),o.drawImage(fn(`bristle`,r),-a/2,-a/2,a,a);break}case`spray`:{let e=Math.min(240,Math.max(8,Math.round(a*a*.005)));o.fillStyle=i;let n=Math.max(1.6,a/55);for(let r=0;r<e;r++){let e=a/2*Math.sqrt(s())*(.3+.7*s()),r=s()*Math.PI*2;o.globalAlpha=(.35+.65*s())*(.5+.5*c);let i=n*(.6+s()*1.3);o.fillRect(t.x+Math.cos(r)*e-i/2,t.y+Math.sin(r)*e-i/2,i,i)}break}case`glitter`:{let n=Math.max(4,Math.round(a*.35)),r=er(e.colour===`rainbow`&&this.glitterKind===`colour`?`rainbow`:this.glitterKind,i);for(let e=0;e<n;e++){let e=a/2*Math.sqrt(s()),n=s()*Math.PI*2,i=t.x+Math.cos(n)*e,c=t.y+Math.sin(n)*e;o.fillStyle=r(s(),i,c);let l=1.5+s()*Math.max(2,a*.07);o.globalAlpha=.75+s()*.25,o.beginPath(),o.arc(i,c,l/2,0,Math.PI*2),o.fill()}if(s()<.22){let e=a/2*Math.sqrt(s())*.8,n=s()*Math.PI*2;nr(o,t.x+Math.cos(n)*e,t.y+Math.sin(n)*e,a*(.12+s()*.12))}break}case`rainbow`:o.fillStyle=`hsl(${((e.hue+e.travelled*.32)%360).toFixed(1)} 92% 58%)`,o.beginPath(),o.arc(t.x,t.y,a/2,0,Math.PI*2),o.fill();break;case`glow`:{l=a*1.25,o.globalAlpha=.16;let e=a*2.5;o.drawImage(fn(`soft`,i),t.x-e/2,t.y-e/2,e,e),o.globalAlpha=.95;let n=a*.42;o.drawImage(fn(`soft`,V(i,.7)),t.x-n/2,t.y-n/2,n,n);break}case`eraser`:o.drawImage(fn(`hard`,`#000000`),t.x-a/2,t.y-a/2,a,a);break;case`smudge`:o.restore(),this.smudge(e,t,a);return}o.restore();let u={x:t.x-l-2,y:t.y-l-2,w:l*2+4,h:l*2+4};e.frame=Xn(e.frame,u),e.bbox=Xn(e.bbox,u)}smudge(e,t,n){let r=e.last,i=Math.min(256,Math.ceil(n));if(!r||i<2)return;let a=Math.round(r.x-i/2),o=Math.round(r.y-i/2),s=Math.round(t.x-i/2),c=Math.round(t.y-i/2),l=this.patch.getContext(`2d`);if(l.globalCompositeOperation=`copy`,l.drawImage(this.colour,a,o,i,i,0,0,i,i),l.globalCompositeOperation=`destination-in`,l.drawImage(fn(`soft`,`#000000`),0,0,i,i),e.mask){let t=this.patchMask.getContext(`2d`);t.clearRect(0,0,i,i),t.drawImage(e.mask.canvas,e.mask.x-s,e.mask.y-c),l.drawImage(this.patchMask,0,0,i,i,0,0,i,i)}l.globalCompositeOperation=`source-over`,this.cc.save(),this.cc.globalAlpha=.7*this.opacity,this.cc.drawImage(this.patch,0,0,i,i,s,c,i,i),this.cc.restore(),e.last=t,e.bbox=Xn(e.bbox,{x:s-1,y:c-1,w:i+2,h:i+2})}composeLive(e,t){let n=this.lc;if(n.save(),n.beginPath(),n.rect(t.x,t.y,t.w,t.h),n.clip(),n.clearRect(t.x,t.y,t.w,t.h),n.drawImage(this.coverage,t.x,t.y,t.w,t.h,t.x,t.y,t.w,t.h),e.grain&&(n.globalCompositeOperation=`destination-in`,n.fillStyle=e.grain,n.fillRect(t.x,t.y,t.w,t.h)),e.mask){let r=e.mask;tr(n,t,r),n.globalCompositeOperation=`destination-in`,n.drawImage(r.canvas,r.x,r.y)}n.restore()}composeErase(e){let t=this.cc;t.save(),t.beginPath(),t.rect(e.x,e.y,e.w,e.h),t.clip(),t.clearRect(e.x,e.y,e.w,e.h),t.drawImage(this.backup,e.x,e.y,e.w,e.h,e.x,e.y,e.w,e.h),t.globalCompositeOperation=`destination-out`,t.globalAlpha=this.opacity,t.drawImage(this.live,e.x,e.y,e.w,e.h,e.x,e.y,e.w,e.h),t.restore()}drawStickerPreview(){let e=this.stroke?.sticker;if(!e)return;let t=this.lc;e.drawn&&t.clearRect(e.drawn.x,e.drawn.y,e.drawn.w,e.drawn.h),t.save(),t.translate(e.x,e.y),t.rotate(e.rot),t.font=`${Math.round(e.size)}px ${Qn}`,t.textAlign=`center`,t.textBaseline=`middle`,t.fillText(this.sticker,0,e.size*.06),t.restore();let n=e.size*.8;e.drawn=Zn({x:e.x-n,y:e.y-n,w:n*2,h:n*2})}fillAt(e,t,n=!0){this.finishFill();let r;if(this.regions){let n=zn(this.regions,e,t);n>0&&(r=Wn(this.regions,n))}else r=qn(this.colour,e,t);if(!r)return!1;this.flushCapture(),this.takeBackup();let i={x:r.x,y:r.y,w:r.w,h:r.h},a=K(1);a.width=r.w,a.height=r.h;let o=a.getContext(`2d`);this.paintFill(o,r,e-r.x,t-r.y),o.globalCompositeOperation=`destination-in`,o.drawImage(r.canvas,0,0);let s=e,c=t,l=Math.max(Math.hypot(s-i.x,c-i.y),Math.hypot(s-i.x-i.w,c-i.y),Math.hypot(s-i.x,c-i.y-i.h),Math.hypot(s-i.x-i.w,c-i.y-i.h)),u=this.fillMode===`glitter`?`glitter`:this.fillMode===`glow`?`glow`:`cover`;if(this.fillAnim={canvas:a,rect:i,cx:s,cy:c,radius:l,start:performance.now(),effect:u},this.onFill?.(),!n)this.finishFill();else{this.live.style.visibility=`visible`,this.live.style.opacity=`1`;let e=()=>{let t=this.fillAnim;if(!t||t.canvas!==a)return;let n=Math.min(1,(performance.now()-t.start)/340),r=this.lc;r.clearRect(t.rect.x,t.rect.y,t.rect.w,t.rect.h),r.save(),r.beginPath(),r.arc(t.cx,t.cy,Math.max(4,t.radius*(1-(1-n)**3)),0,Math.PI*2),r.clip(),r.drawImage(t.canvas,t.rect.x,t.rect.y),r.restore(),n<1?requestAnimationFrame(e):this.finishFill()};requestAnimationFrame(e)}return!0}paintFill(e,t,n,r){if(this.colourHex===`rainbow`)return this.rainbowFill(e,t,n,r);let i=this.colourHex,{w:a,h:o}=t,s=this.fillMode;if(s===`solid`)e.fillStyle=i,e.fillRect(0,0,a,o);else if(s===`glow`){let t=Math.max(40,Math.hypot(Math.max(n,a-n),Math.max(r,o-r))),s=e.createRadialGradient(n,r,0,n,r,t);s.addColorStop(0,V(i,.75)),s.addColorStop(.5,V(i,.25)),s.addColorStop(1,i),e.fillStyle=s,e.fillRect(0,0,a,o)}else if(s===`gradient`){let t=Math.max(40,Math.hypot(Math.max(n,a-n),Math.max(r,o-r))),s=e.createRadialGradient(n,r,0,n,r,t);s.addColorStop(0,V(i,.6)),s.addColorStop(.55,i),s.addColorStop(1,V(i,-.25)),e.fillStyle=s,e.fillRect(0,0,a,o)}else s===`glitter`?this.glitterFill(e,t,i):this.drawPattern(e,t,s,V(i,.72),i)}drawPattern(e,t,n,r,i){let{w:a,h:o}=t;e.fillStyle=r,e.fillRect(0,0,a,o),e.fillStyle=i;let s=-t.x,c=-t.y;if(n===`dots`)for(let t=Math.floor(-c/64)*64;t<o-c+64;t+=64)for(let n=Math.floor(-s/64)*64;n<a-s+64;n+=64){let r=Math.round(t/64)%2*32;e.beginPath(),e.arc(n+s+r,t+c,15,0,Math.PI*2),e.fill()}else if(n===`stripes`){e.save(),e.translate(s,c),e.rotate(-Math.PI/4);let t=W*1.5;for(let n=-3072;n<t;n+=72)e.fillRect(n,-3072,30,t*2);e.restore()}else if(n===`stars`||n===`hearts`)for(let t=Math.floor(-c/110)*110;t<o-c+110;t+=110)for(let r=Math.floor(-s/110)*110;r<a-s+110;r+=110){let i=Math.round(t/110)%2*55;n===`stars`?rr(e,r+s+i,t+c,30):ir(e,r+s+i,t+c,30)}}rainbowFill(e,t,n,r){let{w:i,h:a}=t,o=this.fillMode,s=n=>{let r=e.createLinearGradient(-t.x,-t.y,W-t.x,W-t.y);return Cn.forEach((e,t)=>r.addColorStop(t/(Cn.length-1),V(e,n))),r};if(o===`gradient`||o===`glow`){let t=Math.max(40,Math.hypot(Math.max(n,i-n),Math.max(r,a-r))),s=e.createRadialGradient(n,r,0,n,r,t),c=o===`glow`?[`#ffffff`,...Cn]:Cn;c.forEach((e,t)=>s.addColorStop(t/(c.length-1),e)),e.fillStyle=s,e.fillRect(0,0,i,a)}else if(o===`glitter`){let n=this.glitterKind;n===`colour`&&(this.glitterKind=`rainbow`),this.glitterFill(e,t,Cn[0]),this.glitterKind=n}else o===`solid`?(e.fillStyle=s(0),e.fillRect(0,0,i,a)):this.drawPattern(e,t,o,s(.72),s(0))}glitterFill(e,t,n){let{w:r,h:i}=t,a=this.glitterKind;if(a===`rainbow`||a===`holo`){let n=e.createLinearGradient(-t.x,-t.y,W-t.x,W-t.y),r=a===`rainbow`?[`#ff5d5d`,`#ffb13c`,`#ffe14d`,`#5fd068`,`#3fb7ff`,`#8b6cff`]:[`#ffd6ec`,`#c9f2ff`,`#e3d4ff`,`#d4ffe9`,`#ffe9c9`];r.forEach((e,t)=>n.addColorStop(t/(r.length-1),e)),e.fillStyle=n}else e.fillStyle=a===`gold`?`#e8b923`:a===`silver`?`#c9d1d9`:n;e.fillRect(0,0,r,i);let o=er(a,n),s=un(131),c=Math.min(6e4,Math.round(r*i/80));for(let n=0;n<c;n++){let n=s()*r,a=s()*i;e.fillStyle=o(s(),n+t.x,a+t.y);let c=2+s()*5;e.fillRect(n,a,c,c)}}finishFill(){let e=this.fillAnim;e&&(this.fillAnim=void 0,this.lc.clearRect(e.rect.x,e.rect.y,e.rect.w,e.rect.h),this.cc.drawImage(e.canvas,e.rect.x,e.rect.y),this.applyEffect(e.effect,e.canvas,{x:0,y:0,w:e.rect.w,h:e.rect.h},1,e.rect),e.canvas.width=e.canvas.height=0,this.deferCapture(e.rect),this.hasPaint=!0,this.onCommit?.())}takeBackup(){for(let[e,t]of[[this.bc,this.colour],[this.glitterBackup.getContext(`2d`),this.glitterMap],[this.glowBackup.getContext(`2d`),this.glowMap]])e.globalCompositeOperation=`copy`,e.drawImage(t,0,0),e.globalCompositeOperation=`source-over`}applyEffect(e,t,n,r,i=n){if(e===`none`)return;let a=i.x*G,o=i.y*G,s=i.w*G,c=i.h*G,l=this.hasEffects;for(let[i,u]of[[this.gm,`glitter`],[this.wm,`glow`]])(e===u||l)&&(i.save(),i.globalAlpha=r,i.globalCompositeOperation=e===u?`source-over`:`destination-out`,i.drawImage(t,n.x,n.y,n.w,n.h,a,o,s,c),i.restore());(e===`glitter`||e===`glow`)&&(this.hasEffects=!0),this.hasEffects&&this.onEffects?.()}hasEffects=!1;deferCapture(e){this.flushCapture(),this.pendingCapture=e,setTimeout(()=>this.flushCapture(),0)}flushCapture(){let e=this.pendingCapture;if(!e)return;this.pendingCapture=void 0;let t=[{ctx:this.cc,...e,before:H(this.backup,e.x,e.y,e.w,e.h)}];if(this.hasEffects){let n=Math.max(0,Math.floor(e.x*G)-1),r=Math.max(0,Math.floor(e.y*G)-1),i=Math.min(512,Math.ceil((e.x+e.w)*G)+1)-n,a=Math.min(512,Math.ceil((e.y+e.h)*G)+1)-r;t.push({ctx:this.gm,x:n,y:r,w:i,h:a,before:H(this.glitterBackup,n,r,i,a)}),t.push({ctx:this.wm,x:n,y:r,w:i,h:a,before:H(this.glowBackup,n,r,i,a)})}this.history.push({parts:t})}undo(){this.finishFill(),this.flushCapture(),this.history.undo()&&(this.onCommit?.(),this.hasEffects&&this.onEffects?.())}redo(){this.finishFill(),this.flushCapture(),this.history.redo()&&(this.onCommit?.(),this.hasEffects&&this.onEffects?.())}clear(){this.finishFill(),this.flushCapture();let e=[{ctx:this.cc,x:0,y:0,w:W,h:W,before:H(this.colour,0,0,W,W)},{ctx:this.gm,x:0,y:0,w:512,h:512,before:H(this.glitterMap,0,0,512,512)},{ctx:this.wm,x:0,y:0,w:512,h:512,before:H(this.glowMap,0,0,512,512)}];this.cc.clearRect(0,0,W,W),this.gm.clearRect(0,0,512,512),this.wm.clearRect(0,0,512,512),this.history.push({parts:e}),this.onCommit?.(),this.onEffects?.()}load(e,t){this.cancel(),this.finishFill(),this.pendingCapture=void 0,this.cc.clearRect(0,0,W,W),e&&this.cc.drawImage(e,0,0,W,W),this.gm.clearRect(0,0,512,512),this.wm.clearRect(0,0,512,512),this.hasEffects=!1,t&&this.unpackEffects(t),this.hasPaint=!!e,this.history.clear(),this.onEffects?.()}effectsPng(){if(!this.hasEffects)return Promise.resolve(null);let e=this.gm.getImageData(0,0,512,512).data,t=this.wm.getImageData(0,0,512,512).data,n=K(512),r=n.getContext(`2d`),i=r.createImageData(512,512),a=!1;for(let n=3;n<e.length;n+=4)i.data[n-3]=e[n],i.data[n-2]=t[n],i.data[n]=255,(e[n]>8||t[n]>8)&&(a=!0);return a?(r.putImageData(i,0,0),kn(n).finally(()=>n.width=n.height=0)):Promise.resolve(null)}unpackEffects(e){let t=K(512),n=t.getContext(`2d`,{willReadFrequently:!0});n.drawImage(e,0,0,512,512);let r=n.getImageData(0,0,512,512).data;t.width=t.height=0;let i=this.gm.createImageData(512,512),a=this.wm.createImageData(512,512);for(let e=0;e<r.length;e+=4)i.data[e+3]=r[e],a.data[e+3]=r[e+1],(r[e]>8||r[e+1]>8)&&(this.hasEffects=!0);this.gm.putImageData(i,0,0),this.wm.putImageData(a,0,0)}colourAt(e,t){let n=this.cc.getImageData(Math.max(0,Math.min(2047,Math.round(e))),Math.max(0,Math.min(2047,Math.round(t))),1,1).data;if(!(n[3]<30))return`#${[n[0],n[1],n[2]].map(e=>e.toString(16).padStart(2,`0`)).join(``)}`}composite(e,t,n=W){this.finishFill();let r=K(n),i=r.getContext(`2d`);return i.fillStyle=t,i.fillRect(0,0,n,n),i.drawImage(this.colour,0,0,n,n),e&&i.drawImage(e,0,0,n,n),r}colourPng(){return this.finishFill(),kn(this.colour)}dispose(){this.cancel(),this.finishFill(),this.pendingCapture=void 0;for(let e of[this.colour,this.live,this.coverage,this.backup,this.glitterMap,this.glowMap,this.glitterBackup,this.glowBackup])e.width=e.height=0;this.history.clear(),this.regions=void 0,Un()}};function er(e,t){if(e===`gold`)return e=>e<.06?`#ffffff`:Jn[Math.floor(e*4)%4];if(e===`silver`)return e=>Yn[Math.floor(e*4)%4];if(e===`rainbow`)return e=>e<.06?`#ffffff`:`hsl(${Math.floor(e*3600)%360} 92% 58%)`;if(e===`holo`)return(e,t,n)=>e<.1?`#ffffff`:`hsl(${Math.floor(t*.09+n*.06+e*40)%360} 85% 74%)`;let n=V(t,.55),r=V(t,-.35);return e=>e<.55?t:e<.78?n:e<.95?r:`#ffffff`}function tr(e,t,n){let r=n.x+n.w,i=n.y+n.h,a=t.x+t.w,o=t.y+t.h;t.y<n.y&&e.clearRect(t.x,t.y,t.w,n.y-t.y),o>i&&e.clearRect(t.x,i,t.w,o-i),t.x<n.x&&e.clearRect(t.x,t.y,n.x-t.x,t.h),a>r&&e.clearRect(r,t.y,a-r,t.h)}function nr(e,t,n,r){e.save(),e.globalAlpha=1,e.fillStyle=`#ffffff`,e.beginPath();for(let i=0;i<8;i++){let a=i/8*Math.PI*2,o=i%2==0?r:r*.22;e.lineTo(t+Math.cos(a)*o,n+Math.sin(a)*o)}e.closePath(),e.fill(),e.restore()}function rr(e,t,n,r){e.beginPath();for(let i=0;i<10;i++){let a=-Math.PI/2+i/10*Math.PI*2,o=i%2==0?r:r*.45;e.lineTo(t+Math.cos(a)*o,n+Math.sin(a)*o)}e.closePath(),e.fill()}function ir(e,t,n,r){e.beginPath(),e.moveTo(t,n+r*.9),e.bezierCurveTo(t-r*1.3,n-r*.1,t-r*.6,n-r*1.1,t,n-r*.35),e.bezierCurveTo(t+r*.6,n-r*1.1,t+r*1.3,n-r*.1,t,n+r*.9),e.fill()}var ar,or=new Map,sr=0;function cr(){return ar??=fetch(`./voices/manifest.json`).then(e=>e.ok?e.json():void 0).catch(()=>void 0),ar}function lr(e){let n=or.get(e);return n||(n=(async()=>{let n=t.context,r=(await cr())?.lines[e];if(!n||!r)return;let i=await fetch(`./voices/${r.file}`);if(i.ok)return n.decodeAudioData(await i.arrayBuffer())})().catch(()=>void 0),or.set(e,n)),n}async function ur(e){if(!t.enabled)return;let n=++sr,r=await lr(e);r&&n===sr&&t.play(r)}function dr(e){for(let t of e)lr(t)}var fr=`#1d2b36`,q=e=>`<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" stroke="${fr}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${e}</svg>`,pr=e=>`<g transform="rotate(-38 32 32)">${e}</g>`,mr={crayon:q(pr(`<path d="M3 32 15 24.5h6v15h-6z" fill="currentColor"/>
      <rect x="21" y="23" width="38" height="18" rx="4" fill="currentColor"/>
      <rect x="28" y="23" width="23" height="18" fill="#fff" fill-opacity=".4" stroke="none"/>
      <path d="M28 23v18M51 23v18M34 27h11M34 37h11" stroke-opacity=".55"/>`)),pencil:q(pr(`<path d="M3 32 17 25.5v13z" fill="#f4c99c"/>
      <path d="M3 32 8.5 29.5v5z" fill="currentColor"/>
      <rect x="17" y="25.5" width="33" height="13" fill="currentColor"/>
      <path d="M17 32h33" stroke-opacity=".35"/>
      <rect x="50" y="25.5" width="6" height="13" fill="#cfd5de"/>
      <path d="M56 25.5h3a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-3z" fill="#ff9fb2"/>`)),marker:q(pr(`<path d="M3 32 11 27.5v9z" fill="currentColor"/>
      <rect x="11" y="27" width="7" height="10" fill="#e3e9ee"/>
      <rect x="18" y="23.5" width="30" height="17" rx="3.5" fill="#f8fafb"/>
      <rect x="22" y="28" width="22" height="8" rx="2" fill="currentColor"/>
      <rect x="47" y="22.5" width="14" height="19" rx="5" fill="currentColor"/>`)),paint:q(pr(`<path d="M2 32c5-6.5 11-8 18-6.5v13C13 40 7 38.5 2 32z" fill="currentColor"/>
      <path d="M7 31.5c3-2 7-2.8 11-2.4" fill="none" stroke="#fff" stroke-opacity=".55"/>
      <rect x="20" y="25.5" width="10" height="13" rx="1.5" fill="#cfd5de"/>
      <path d="M30 27.5 61 30v4l-31 2.5z" fill="#d68a4c"/>`)),watercolour:q(`${pr(`<path d="M2 33c6-5 12-6 19-4.5v7C14 37 8 37 2 33z" fill="currentColor" fill-opacity=".75"/>
      <rect x="21" y="28.5" width="8" height="7" rx="1" fill="#cfd5de"/>
      <path d="M29 29.5 60 31v2l-31 1.5z" fill="#6b8cff"/>`)}
      <path d="M47 39s-7 8-7 12.5a7 7 0 0 0 14 0C54 47 47 39 47 39z" fill="currentColor" fill-opacity=".55"/>`),spray:q(`<rect x="24" y="23" width="22" height="35" rx="6" fill="#f3f6f8"/>
     <rect x="24" y="31" width="22" height="15" fill="currentColor"/>
     <rect x="29" y="15" width="12" height="9" rx="2.5" fill="currentColor"/>
     <rect x="31.5" y="10" width="7" height="5.5" rx="1.5" fill="#cfd5de"/>
     <g fill="currentColor" stroke="none"><circle cx="22" cy="11" r="2.2"/><circle cx="16" cy="8" r="1.8"/><circle cx="17" cy="15" r="2"/><circle cx="10" cy="12" r="1.6"/><circle cx="11" cy="5" r="1.4"/><circle cx="6" cy="17" r="1.3"/></g>`),glitter:q(`<path d="M12 54 37 29" stroke-width="7"/><path d="M12 54 37 29" stroke="#f3f6f8" stroke-width="3"/>
     <path d="M44 7l4.4 9.3 10.2 1.3-7.5 7.1 1.9 10.1L44 30l-9 4.8 1.9-10.1-7.5-7.1 10.2-1.3z" fill="currentColor"/>
     <g fill="#ffd54a" stroke="none"><path d="M17 15l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z"/><path d="M53 41l1.3 3.2 3.2 1.3-3.2 1.3-1.3 3.2-1.3-3.2-3.2-1.3 3.2-1.3z"/></g>
     <g fill="currentColor" stroke="none"><circle cx="27" cy="13" r="1.8"/><circle cx="57" cy="29" r="1.6"/><circle cx="46" cy="50" r="2"/></g>`),rainbow:q(pr(`<clipPath id="pp-rb"><path d="M2 32c5-6.5 11-8 18-6.5v13C13 40 7 38.5 2 32z"/></clipPath>
      <g clip-path="url(#pp-rb)" stroke="none"><rect x="0" y="24" width="22" height="3" fill="#ff4d4d"/><rect x="0" y="27" width="22" height="2.6" fill="#ff9a3c"/><rect x="0" y="29.6" width="22" height="2.6" fill="#ffe14d"/><rect x="0" y="32.2" width="22" height="2.6" fill="#4cd163"/><rect x="0" y="34.8" width="22" height="2.6" fill="#3fb4ff"/><rect x="0" y="37.4" width="22" height="3" fill="#8b6cff"/></g>
      <path d="M2 32c5-6.5 11-8 18-6.5v13C13 40 7 38.5 2 32z" fill="none"/>
      <rect x="20" y="25.5" width="10" height="13" rx="1.5" fill="#cfd5de"/>
      <path d="M30 27.5 61 30v4l-31 2.5z" fill="#ffb6d9"/>`)),glow:q(`<circle cx="15" cy="49" r="13" fill="currentColor" fill-opacity=".18" stroke="none"/>
     <circle cx="15" cy="49" r="7.5" fill="currentColor" fill-opacity=".35" stroke="none"/>
     ${pr(`<path d="M8 32 17 28v8z" fill="currentColor"/>
      <rect x="17" y="26.5" width="38" height="11" rx="5" fill="#2e3a59"/>
      <rect x="22" y="29.5" width="26" height="5" rx="2.5" fill="currentColor" stroke="none"/>`)}`),smudge:q(`<path d="M6 46c8-7 16-9 26-6" fill="none" stroke="currentColor" stroke-width="9" stroke-opacity=".55"/>
     <path d="M30 52c-6-1-9-5-8-9l5-13c1-3 5-3 6 0l1 4 2-15c.5-3.5 5.5-3.5 6 0l1 11 2-6c1-3 5.5-2.5 5.5 1l-1 9 2.5-3c2-2.5 5.5-.5 4.5 2.5L52 46c-2 5-7 7-12 7z" fill="#ffd7b8"/>
     <path d="M36 23v12M42 27v9" fill="none" stroke-opacity=".4"/>`),eraser:q(pr(`<rect x="6" y="22" width="52" height="20" rx="5" fill="#ff9fb2"/>
      <path d="M30 22h28v20H30z" fill="#7cc4ff"/>
      <path d="M30 22v20" />
      <rect x="6" y="22" width="52" height="20" rx="5" fill="none"/>`)),fill:q(`<path d="M10 22 32 10l14 24-22 12z" fill="#e8edf1"/>
     <path d="M10 22c-1 6 3 10 8 9l14-8" fill="none"/>
     <path d="M46 34c4 3 8 9 6 15a5 5 0 0 1-9.5-1.5C41.5 44 44 39 46 34z" fill="currentColor"/>
     <path d="M17 31c6 4 15 4 24-1l5 4c-8 7-19 8-27 3z" fill="currentColor"/>
     <path d="M20 12c-5-6 2-10 6-5" fill="none"/>`),sticker:q(`<path d="M32 6l7.6 15.4 17 2.5-12.3 12 2.9 16.9L32 44.8l-15.2 8 2.9-16.9-12.3-12 17-2.5z" fill="#ffd54a"/>
     <path d="M47.2 52.8 41 40l13.5-2" fill="#fff6c9"/>
     <circle cx="26" cy="27" r="2.4" fill="${fr}" stroke="none"/><circle cx="38" cy="27" r="2.4" fill="${fr}" stroke="none"/>
     <path d="M26 34c3.5 3 8.5 3 12 0" fill="none"/>`)},J=(e,t=3)=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="${t}" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,Y={home:J(`<path d="M4 11.5 12 4.5l8 7"/><path d="M6.5 10v9.5h11V10"/><path d="M10 19.5v-5h4v5"/>`),undo:J(`<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>`),redo:J(`<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>`),check:J(`<path d="M5 12.5 9.8 17 19 7"/>`,3.6),back:J(`<path d="M15 5 8 12l7 7"/>`,3.4),close:J(`<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>`,3.4),plus:J(`<path d="M12 5v14M5 12h14"/>`,3.4),gear:J(`<circle cx="12" cy="12" r="3.2"/><path d="M10.4 3h3.2l.5 2.3 1.9.8 2-1.3 2.3 2.3-1.3 2 .8 1.9 2.3.5v3.2l-2.3.5-.8 1.9 1.3 2-2.3 2.3-2-1.3-1.9.8-.5 2.3h-3.2l-.5-2.3-1.9-.8-2 1.3-2.3-2.3 1.3-2-.8-1.9L3 13.6v-3.2l2.3-.5.8-1.9-1.3-2 2.3-2.3 2 1.3 1.9-.8z"/>`,2),linesOn:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5 20 8v8l-8 4.5L4 16V8z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M8 13.5c2-3 5-3.5 8-2.5" fill="none" stroke="var(--pp-current, #ff4d4d)" stroke-width="3.4" stroke-linecap="round"/></svg>`,linesOff:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5 20 8v8l-8 4.5L4 16V8z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-dasharray="3 3"/><path d="M2.5 15c5-6 12-8 19-6" fill="none" stroke="var(--pp-current, #ff4d4d)" stroke-width="3.4" stroke-linecap="round"/></svg>`,palette:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.6-2.2-.5-1.4.4-2.8 2-2.8H18a3 3 0 0 0 3-3C21 7 17 3 12 3z" fill="#fffdf6" stroke="currentColor" stroke-width="2"/><circle cx="7.5" cy="11" r="1.8" fill="#ff4d4d"/><circle cx="10" cy="7" r="1.8" fill="#ffc93c"/><circle cx="14.5" cy="7" r="1.8" fill="#3fa34d"/><circle cx="17" cy="11" r="1.8" fill="#3aa0ff"/></svg>`,wheel:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><linearGradient id="pp-wh" x1="0" x2="1"><stop offset="0" stop-color="#ff4d4d"/><stop offset=".33" stop-color="#ffe14d"/><stop offset=".66" stop-color="#3fb4ff"/><stop offset="1" stop-color="#c46cff"/></linearGradient></defs><circle cx="12" cy="12" r="9" fill="none" stroke="url(#pp-wh)" stroke-width="5"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,dropper:J(`<path d="m14.5 6.5 3 3"/><path d="M16 4.5a2.1 2.1 0 0 1 3 3l-2 2-3-3z"/><path d="M14 8 6 16l-1.5 3.5L8 18l8-8"/>`,2.2),trash:J(`<path d="M4.5 7h15M9.5 7V4.5h5V7"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v5.5M14 11v5.5"/>`,2.4),camera:J(`<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>`,2.3),page:J(`<path d="M6 3.5h8.5l4 4V20.5H6z"/><path d="M14.5 3.5v4h4"/>`,2.3),paper:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="4" width="14" height="16" rx="2" fill="var(--pp-paper-swatch, #fff)" stroke="currentColor" stroke-width="2.2"/><path d="M8.5 9h7M8.5 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".45"/></svg>`,share:J(`<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5"/><path d="M5 12v7.5h14V12"/>`,2.6),sound:J(`<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>`,2.4),mute:J(`<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>`,2.4),newPage:J(`<path d="M6 3.5h8.5l4 4V20.5H6z"/><path d="M12.2 10v6M9.2 13h6"/>`,2.3),star:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.8l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.7l-5.6 3.1 1.3-6.2L3 9.3l6.3-.7z" fill="currentColor"/></svg>`,moon:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.5 15.2A7.5 7.5 0 1 1 9 4.6a6 6 0 0 0 9.5 10.6z" fill="#ffd54a" stroke="#1d2b36" stroke-width="1.6" stroke-linejoin="round"/><path d="M19 4.2l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6zM15 8.5l.4.9.9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4z" fill="#ffd54a"/></svg>`,sun:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="5" fill="#ffc93c" stroke="#e0960f" stroke-width="1.5"/><g stroke="#ffb020" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></g></svg>`,idea:`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" fill="#ffd54a" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9.5 19h5M10.5 21.5h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,shuffle:J(`<path d="M4 7h3.5c4 0 5 10 9 10H20M4 17h3.5c1.6 0 2.7-1.6 3.6-3.4M13 10.4c.9-1.8 2-3.4 3.5-3.4H20"/><path d="m17.5 4.5 2.5 2.5-2.5 2.5M17.5 14.5l2.5 2.5-2.5 2.5"/>`,2.3),frame:J(`<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="m3.5 16 5-5 4 4 3-3 5 5"/><circle cx="15.5" cy="8.5" r="1.6"/>`,2.2)},hr={solid:e=>`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" rx="9" fill="${e}"/></svg>`,gradient:e=>`<svg viewBox="0 0 40 40" aria-hidden="true"><defs><radialGradient id="pp-fg" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect x="4" y="4" width="32" height="32" rx="9" fill="${e}"/><rect x="4" y="4" width="32" height="32" rx="9" fill="url(#pp-fg)"/></svg>`,dots:e=>`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" rx="9" fill="${e}" fill-opacity=".3"/><g fill="${e}"><circle cx="13" cy="13" r="3.5"/><circle cx="27" cy="13" r="3.5"/><circle cx="20" cy="20" r="3.5"/><circle cx="13" cy="27" r="3.5"/><circle cx="27" cy="27" r="3.5"/></g></svg>`,stripes:e=>`<svg viewBox="0 0 40 40" aria-hidden="true"><clipPath id="pp-fs"><rect x="4" y="4" width="32" height="32" rx="9"/></clipPath><rect x="4" y="4" width="32" height="32" rx="9" fill="${e}" fill-opacity=".3"/><g clip-path="url(#pp-fs)" stroke="${e}" stroke-width="5"><path d="M0 20 20 0M0 34 34 0M6 40 40 6M20 40 40 20"/></g></svg>`,stars:e=>`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" rx="9" fill="${e}" fill-opacity=".3"/><path d="M20 9l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L20 25.5l-6.5 3.4 1.3-7.2-5.3-5.1 7.3-1z" fill="${e}"/></svg>`,hearts:e=>`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" rx="9" fill="${e}" fill-opacity=".3"/><path d="M20 30c-9-6-12-10-10-15 2-4 7-4 10 0 3-4 8-4 10 0 2 5-1 9-10 15z" fill="${e}"/></svg>`,glitter:e=>`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" rx="9" fill="${e}"/><g fill="#fff"><path d="M14 10l1.3 3.4 3.4 1.3-3.4 1.3L14 19.4l-1.3-3.4-3.4-1.3 3.4-1.3z"/><circle cx="27" cy="16" r="1.6"/><circle cx="22" cy="28" r="1.4"/><path d="M28 24l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z"/></g></svg>`,glow:e=>`<svg viewBox="0 0 40 40" aria-hidden="true"><defs><radialGradient id="pp-fgl"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${e}"/><stop offset="1" stop-color="${e}" stop-opacity="0"/></radialGradient></defs><rect x="4" y="4" width="32" height="32" rx="9" fill="#141a3c"/><circle cx="20" cy="20" r="14" fill="url(#pp-fgl)"/><path d="M29 9l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z" fill="#fff"/></svg>`},gr=(e,t)=>`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" rx="9" fill="${e}"/>${t.map((e,t)=>`<circle cx="${9+t*7%22}" cy="${9+t*11%22}" r="${1.4+t%3*.7}" fill="${e}"/>`).join(``)}<path d="M27 8l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff"/></svg>`,_r={colour:`<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="4" y="4" width="32" height="32" rx="9" fill="var(--pp-current)"/><g fill="#fff"><circle cx="12" cy="14" r="1.8"/><circle cx="22" cy="27" r="1.5"/><circle cx="28" cy="18" r="1.3"/></g><path d="M27 8l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#fff"/></svg>`,gold:gr(`#e8b923`,[`#fff1a8`,`#c98b0b`,`#ffd54a`,`#fff`,`#c98b0b`,`#fff1a8`,`#ffd54a`,`#c98b0b`]),silver:gr(`#c9d1d9`,[`#ffffff`,`#8d99a6`,`#e3e8ee`,`#ffffff`,`#8d99a6`,`#b9c3cd`,`#ffffff`,`#8d99a6`]),rainbow:gr(`#ffe7f3`,[`#ff4d4d`,`#ff9a3c`,`#ffd60a`,`#4cd163`,`#3fb4ff`,`#8b6cff`,`#ff5fa2`,`#14b8a6`]),holo:gr(`#dfe9ff`,[`#ffc2e2`,`#b8f0ff`,`#d9c6ff`,`#c9ffe4`,`#ffe2b8`,`#ffffff`,`#ffc2e2`,`#b8f0ff`])},X=(e,t)=>({hex:e,name:t}),vr=[{id:`crayons`,badge:`🖍️`,label:`Crayon box`,swatches:[X(`#f23a2f`,`red`),X(`#ff8a1f`,`orange`),X(`#ffd60a`,`yellow`),X(`#9bd63a`),X(`#2fb344`,`green`),X(`#14b8a6`),X(`#38bdf8`),X(`#2563eb`,`blue`),X(`#8b5cf6`,`purple`),X(`#ff5fa2`,`pink`),X(`#c2185b`),X(`#8b5a2b`,`brown`),X(`#e7b07a`),X(`#ffd9b8`),X(`#1d1d1f`,`black`),X(`#9aa3ad`,`grey`),X(`#ffffff`,`white`),X(`#e6b422`)]},{id:`skin`,badge:`✋`,label:`Skin`,swatches:[`#fde4cf`,`#f7cfaa`,`#eab48c`,`#d79c6d`,`#bb7d50`,`#93603c`,`#6e452b`,`#4a2d1c`,`#ffd1b3`,`#c98b6b`].map(e=>X(e))},{id:`sea`,badge:`🌊`,label:`Sea`,swatches:[`#03256c`,`#0b5fa5`,`#1e96fc`,`#5ec8f2`,`#bdeefc`,`#13c4a3`,`#7be0c3`,`#ff8c61`,`#ffd166`,`#f2e2c4`].map(e=>X(e))},{id:`jungle`,badge:`🌴`,label:`Jungle`,swatches:[`#123524`,`#1f6f43`,`#38a35b`,`#8bd17c`,`#d4f5b4`,`#6b21a8`,`#b46cff`,`#ff8a1f`,`#ffcb47`,`#5a3a22`].map(e=>X(e))},{id:`candy`,badge:`🍭`,label:`Candy`,swatches:[`#ffb3c7`,`#ff85a8`,`#ffd1a6`,`#fff1a8`,`#c9f2b4`,`#b8ecff`,`#a9b8ff`,`#d7b8ff`,`#f3c4ff`,`#ffffff`].map(e=>X(e))},{id:`sunset`,badge:`🌅`,label:`Sunset`,swatches:[`#2b1055`,`#6a1b9a`,`#c2185b`,`#f4436c`,`#ff7a45`,`#ffa53d`,`#ffd36e`,`#ffe9b0`,`#3d2c8d`,`#1d1b2f`].map(e=>X(e))},{id:`neon`,badge:`⚡`,label:`Neon`,swatches:[`#39ff14`,`#00f0ff`,`#ff00e6`,`#fff200`,`#ff3131`,`#ff8f00`,`#b026ff`,`#4d6bff`,`#00ff9d`,`#ffffff`].map(e=>X(e))},{id:`happy`,badge:`😊`,label:`Happy`,swatches:[`#ffd60a`,`#ff9f1c`,`#ff5d8f`,`#4cc9f0`,`#80ed99`,`#ffef9f`,`#ff7a45`,`#b388ff`].map(e=>X(e))},{id:`calm`,badge:`😌`,label:`Calm`,swatches:[`#cfe8ef`,`#9ad1d4`,`#5fa8d3`,`#62b6a0`,`#b8e0d2`,`#e8f1f2`,`#a3b9c9`,`#d6c7e8`].map(e=>X(e))},{id:`silly`,badge:`🤪`,label:`Silly`,swatches:[`#ff00e6`,`#39ff14`,`#ffe600`,`#00e5ff`,`#ff6b00`,`#8a2be2`,`#ff3b8d`,`#00ff9d`].map(e=>X(e))},{id:`sleepy`,badge:`😴`,label:`Sleepy`,swatches:[`#1b1f4b`,`#2e3a87`,`#4b5fc1`,`#8c9eff`,`#c5cae9`,`#f6e6a8`,`#7e57c2`,`#ede7f6`].map(e=>X(e))},{id:`cosy`,badge:`🥰`,label:`Cosy`,swatches:[`#7f4f24`,`#b5835a`,`#e6ccb2`,`#ede0d4`,`#c9184a`,`#ff8fa3`,`#ffb4a2`,`#9c6644`].map(e=>X(e))}];function yr(e){return vr.find(t=>t.id===e)??vr[0]}function br(e){return e===`rainbow`?`rainbow`:vr[0].swatches.find(t=>t.hex.toLowerCase()===e.toLowerCase())?.name}function xr(e,t){let n=F(`button`,{type:`button`,class:`pp-swatch`,"aria-label":t,"data-hex":e});return e===`rainbow`?(n.classList.add(`pp-swatch--rainbow`),n):(n.style.setProperty(`--sw`,e),Tn(e)>.9&&(n.dataset.light=``),n)}function Sr(e){return new Promise(t=>{let n=I({label:`Colour sets`,className:`pp-sheet`,onEscape:()=>r(void 0)}),r=e=>{n.close(),t(e)},i=F(`div`,{class:`pp-palettes`});for(let t of vr){let n=F(`button`,{type:`button`,class:`pp-palette-row`,"aria-label":t.label,"aria-pressed":String(t.id===e)});n.append(F(`span`,{class:`pp-palette-badge`},t.badge));let a=F(`span`,{class:`pp-palette-strip`});for(let e of t.swatches.slice(0,10)){let t=F(`span`,{class:`pp-palette-dot`});t.style.background=e.hex,a.append(t)}n.append(a),n.addEventListener(`click`,()=>r(t.id)),i.append(n)}n.card.append(Cr(()=>r(void 0)),i)})}function Cr(e){let t=F(`button`,{type:`button`,class:`pp-round pp-sheet-close`,"aria-label":`Close`,html:Y.close});return t.addEventListener(`click`,e),t}function wr(e){return new Promise(t=>{let[n,r,i]=bn(e.startsWith(`#`)?e:`#ff4d4d`);r<.05&&i<.05&&(i=.9);let a=I({label:`Colour wheel`,className:`pp-sheet pp-wheel-sheet`,onEscape:()=>o(void 0)}),o=e=>{a.close(),t(e)},s=Math.min(2,window.devicePixelRatio||1),c=F(`canvas`,{class:`pp-wheel`,width:320*s,height:320*s}),l=F(`div`,{class:`pp-wheel-preview`}),u=F(`button`,{type:`button`,class:`pp-round pp-go`,"aria-label":`Use this colour`,html:Y.check});u.addEventListener(`click`,()=>o(h())),a.card.append(Cr(()=>o(void 0)),c,F(`div`,{class:`pp-wheel-row`},l,u));let d=c.getContext(`2d`);d.scale(s,s);let f=Math.floor(114*Math.SQRT2)-6,p=160-f/2,m=160-f/2,h=()=>yn(n,r,i);function g(){d.clearRect(0,0,320,320);for(let e=0;e<360;e+=1)d.beginPath(),d.strokeStyle=`hsl(${e} 95% 52%)`,d.lineWidth=36,d.arc(160,160,140,(e-90.6)*Math.PI/180,(e-89)*Math.PI/180),d.stroke();let e=d.createLinearGradient(p,0,p+f,0);e.addColorStop(0,`#fff`),e.addColorStop(1,yn(n,1,1)),d.fillStyle=e,d.beginPath(),d.roundRect(p,m,f,f,14),d.fill();let t=d.createLinearGradient(0,m,0,m+f);t.addColorStop(0,`rgba(0,0,0,0)`),t.addColorStop(1,`#000`),d.fillStyle=t,d.fill();let a=(n-90)*Math.PI/180;_(160+Math.cos(a)*140,160+Math.sin(a)*140,yn(n,1,1)),_(p+r*f,m+(1-i)*f,h()),l.style.background=h()}function _(e,t,n){d.beginPath(),d.arc(e,t,16,0,Math.PI*2),d.fillStyle=n,d.fill(),d.lineWidth=5,d.strokeStyle=`#fff`,d.stroke(),d.lineWidth=2,d.strokeStyle=`rgba(0,0,0,.45)`,d.stroke()}let v,y=e=>{let t=c.getBoundingClientRect(),n=(e.clientX-t.left)/t.width*320,r=(e.clientY-t.top)/t.height*320;return{x:n,y:r,d:Math.hypot(n-160,r-160)}},b=e=>{let t=y(e);v===`ring`?n=(Math.atan2(t.y-160,t.x-160)*180/Math.PI+90+360)%360:v===`square`&&(r=Math.max(0,Math.min(1,(t.x-p)/f)),i=Math.max(0,Math.min(1,1-(t.y-m)/f))),g()};c.addEventListener(`pointerdown`,e=>{v=y(e).d>114?`ring`:`square`,c.setPointerCapture(e.pointerId),b(e)}),c.addEventListener(`pointermove`,e=>v&&b(e)),c.addEventListener(`pointerup`,()=>v=void 0),c.addEventListener(`pointercancel`,()=>v=void 0),g()})}var Tr=`pp.recent.`;function Er(e){try{let t=JSON.parse(localStorage.getItem(Tr+e)??`[]`);return Array.isArray(t)?t.filter(e=>typeof e==`string`).slice(0,8):[]}catch{return[]}}function Dr(e,t){let n=[t,...Er(e).filter(e=>e.toLowerCase()!==t.toLowerCase())].slice(0,8);try{localStorage.setItem(Tr+e,JSON.stringify(n))}catch{}return n}var Z=1024,Or=36;function Q(e,t=e,n){let r=document.createElement(`canvas`);return r.width=e,r.height=t,n&&(r.className=n),r}function kr(){let e=Q(64),t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,30);n.addColorStop(0,`rgba(255,255,255,0.9)`),n.addColorStop(.25,`rgba(255,250,220,0.35)`),n.addColorStop(1,`rgba(255,250,220,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),t.fillStyle=`#ffffff`,t.beginPath();for(let e=0;e<8;e++){let n=e/8*Math.PI*2,r=e%2==0?30:4;t.lineTo(32+Math.cos(n)*r,32+Math.sin(n)*r)}return t.closePath(),t.fill(),e}var Ar=class{painter;lines;night=Q(Z,Z,`pp-layer pp-night-layer`);halo=Q(Z,Z,`pp-layer pp-halo`);sparkle=Q(Z,Z,`pp-layer pp-sparkle`);sprite=kr();calm=en();points=new Uint32Array;twinkles=[];raf=0;lastFrame=0;refreshTimer=0;nightOn=!1;disposed=!1;constructor(e,t){this.painter=e,this.lines=t,this.night.hidden=this.halo.hidden=!0,document.addEventListener(`visibilitychange`,this.onVisibility)}get isNight(){return this.nightOn}refresh(){clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>{this.disposed||(this.sample(),this.nightOn&&this.drawNight(),this.run())},120)}setNight(e){this.nightOn=e,this.night.hidden=this.halo.hidden=!e,e&&this.drawNight()}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),clearTimeout(this.refreshTimer),document.removeEventListener(`visibilitychange`,this.onVisibility);for(let e of[this.night,this.halo,this.sparkle,this.sprite])e.width=e.height=0}onVisibility=()=>{document.hidden?(cancelAnimationFrame(this.raf),this.raf=0):this.run()};sample(){if(!this.painter.hasEffects){this.points=new Uint32Array;return}let e=this.painter.glitterMap.getContext(`2d`).getImageData(0,0,512,512).data,t=[];for(let n=0,r=3;r<e.length;n++,r+=4)e[r]>90&&t.push(n);let n=Math.max(1,Math.floor(t.length/4e3));this.points=Uint32Array.from(t.filter((e,t)=>t%n===0))}run(){this.raf||this.calm||this.disposed||document.hidden||(this.points.length===0&&this.twinkles.length===0?this.sparkle.getContext(`2d`).clearRect(0,0,Z,Z):this.raf=requestAnimationFrame(this.frame))}frame=e=>{this.raf=0,e-this.lastFrame>=30&&(this.lastFrame=e,this.step(e)),this.run()};step(e){let t=this.sparkle.getContext(`2d`);t.clearRect(0,0,Z,Z),this.twinkles=this.twinkles.filter(t=>e-t.born<t.life);let n=Math.min(Or,Math.ceil(this.points.length/60));if(this.twinkles.length<n&&this.points.length)for(let t=0;t<2&&this.twinkles.length<n;t++){let t=this.points[Math.floor(Math.random()*this.points.length)],n=Z/512;this.twinkles.push({x:(t%512+Math.random())*n,y:(Math.floor(t/512)+Math.random())*n,born:e,life:700+Math.random()*900,size:14+Math.random()*22,spin:Math.random()*Math.PI})}for(let n of this.twinkles){let r=(e-n.born)/n.life,i=Math.sin(Math.PI*r),a=n.size*(.35+.65*i);t.save(),t.globalAlpha=i,t.translate(n.x,n.y),t.rotate(n.spin+r*.6),t.drawImage(this.sprite,-a/2,-a/2,a,a),t.restore()}}drawNight(){jr(this.night.getContext(`2d`),this.painter,Z);let e=this.halo.getContext(`2d`);e.clearRect(0,0,Z,Z),Mr(e,this.painter,Z)}compose(e,t){let n=Q(t),r=n.getContext(`2d`);r.fillStyle=e,r.fillRect(0,0,t,t),r.drawImage(this.painter.colour,0,0,t,t);let i=this.lines();if(this.nightOn){let e=Q(t);if(jr(e.getContext(`2d`),this.painter,t),r.drawImage(e,0,0),e.width=e.height=0,r.save(),r.globalCompositeOperation=`screen`,Mr(r,this.painter,t),r.restore(),i){let e=Q(t),n=e.getContext(`2d`);n.drawImage(i,0,0,t,t),n.globalCompositeOperation=`source-in`,n.fillStyle=`#ffffff`,n.fillRect(0,0,t,t),r.globalAlpha=.45,r.drawImage(e,0,0),r.globalAlpha=1,e.width=e.height=0}}else i&&r.drawImage(i,0,0,t,t);let a=t/512;for(let e=0;e<Math.min(40,Math.ceil(this.points.length/50));e++){let e=this.points[Math.floor(Math.random()*this.points.length)],n=t*(.012+Math.random()*.018);r.drawImage(this.sprite,e%512*a-n/2,Math.floor(e/512)*a-n/2,n,n)}return n}};function jr(e,t,n){e.save(),e.clearRect(0,0,n,n),e.fillStyle=`rgba(6, 10, 36, 0.9)`,e.fillRect(0,0,n,n),t.hasEffects&&(e.globalCompositeOperation=`destination-out`,e.imageSmoothingEnabled=!0,e.drawImage(t.glowMap,0,0,n,n)),e.restore()}function Mr(e,t,n){if(t.hasEffects)for(let[r,i]of[[64,1],[160,.9]]){let a=Q(r),o=a.getContext(`2d`);o.drawImage(t.colour,0,0,r,r),o.globalCompositeOperation=`destination-in`,o.drawImage(t.glowMap,0,0,r,r),e.save(),e.globalAlpha=i,e.imageSmoothingEnabled=!0,e.imageSmoothingQuality=`high`,e.drawImage(a,0,0,n,n),e.restore(),a.width=a.height=0}}var $=(e,t=3)=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="${t}" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,Nr=e=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${e}</svg>`,Pr={play:Nr(`<path d="M7.5 5.2v13.6a1.2 1.2 0 0 0 1.8 1l10.6-6.8a1.2 1.2 0 0 0 0-2L9.3 4.2a1.2 1.2 0 0 0-1.8 1z"/>`),pause:$(`<path d="M8.5 5.5v13M15.5 5.5v13"/>`,4),back:$(`<path d="M15 5 8 12l7 7"/>`,3.5),check:$(`<path d="M5 12.5 9.8 17 19 7"/>`,3.5),close:$(`<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>`,3.5),backspace:$(`<path d="M9 5.5h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-6-6.5z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/>`,2.5),home:$(`<path d="M4 11.5 12 4.5l8 7"/><path d="M6.5 10v9.5h11V10"/>`),restart:$(`<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4v4.5H9"/>`),lock:$(`<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>`,2.6),gear:$(`<circle cx="12" cy="12" r="3.2"/><path d="M10.4 3h3.2l.5 2.3 1.9.8 2-1.3 2.3 2.3-1.3 2 .8 1.9 2.3.5v3.2l-2.3.5-.8 1.9 1.3 2-2.3 2.3-2-1.3-1.9.8-.5 2.3h-3.2l-.5-2.3-1.9-.8-2 1.3-2.3-2.3 1.3-2-.8-1.9L3 13.6v-3.2l2.3-.5.8-1.9-1.3-2 2.3-2.3 2 1.3 1.9-.8z"/>`,2.2),music:$(`<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>`,2.5),speaker:$(`<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>`,2.5),clock:$(`<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>`,2.6),moon:Nr(`<path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.3 6.3 0 0 0 10.1 10.1z"/>`),star:Nr(`<path d="M12 2.8l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.7l-5.6 3.1 1.3-6.2L3 9.3l6.3-.7z"/>`),left:Nr(`<path d="M16.5 5.2v13.6a1.2 1.2 0 0 1-1.8 1L4.1 13a1.2 1.2 0 0 1 0-2l10.6-6.8a1.2 1.2 0 0 1 1.8 1z"/>`),right:Nr(`<path d="M7.5 5.2v13.6a1.2 1.2 0 0 0 1.8 1L19.9 13a1.2 1.2 0 0 0 0-2L9.3 4.2a1.2 1.2 0 0 0-1.8 1z"/>`),up:$(`<path d="M12 19.5V5M5.5 11 12 4.5l6.5 6.5"/>`,3.5),sword:$(`<path d="M19.5 4.5 9 15M19.5 4.5h-4l-8 8M19.5 4.5v4l-8 8"/><path d="M5 13.5l5.5 5.5M7.5 16.5 4 20"/>`,2.6),throw:$(`<path d="M4 18c3-8 9-12 16-12"/><path d="M15 4.5 20 6l-2 4.6"/><circle cx="6" cy="18.5" r="2.5" fill="currentColor"/>`,2.6),horn:$(`<path d="M3.5 10v4l13 5.5v-15z"/><path d="M7 15.3 8.3 20h3l-1-3.4"/><path d="M19.5 9.5c.8 1.5.8 3.5 0 5"/>`,2.4),hand:$(`<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M11 10V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 10.5V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1.2-5.3-3.3L4 13.8a1.5 1.5 0 0 1 2.4-1.7L8 14"/>`,2.2)},Fr=null;function Ir(e={}){if(Fr)return Fr;let t=e.holdMs??2500,n=Math.max(1,e.tries??3);return Fr=new Promise(e=>{let r=`hold`,i=``,a=0,o=0,s=0,c=I({label:`For grown-ups`,layer:`gate`,cardClassName:`fg-gate`,onEscape:()=>u(!1),onKey:e=>r===`pad`&&ae(e)}),{card:l}=c,u=t=>{cancelAnimationFrame(b),c.close(),Fr=null,e(t)},d=F(`button`,{type:`button`,id:`fg-gate-cancel`,class:`fg-btn fg-btn--paper fg-btn--round`,"aria-label":`Back`});d.append(tn(Pr.close)),d.addEventListener(`click`,()=>u(!1));let f=F(`h2`,{class:`fg-title`},`For grown-ups`),p=F(`p`,{class:`fg-sub`},`Press and hold the circle`);l.dataset.step=`hold`,l.append(F(`div`,{class:`fg-gate-head`},d,f),p);let m=2*Math.PI*46,h=F(`button`,{type:`button`,id:`fg-gate-hold`,class:`fg-hold`,"data-fg-hold":`true`,"aria-label":`Press and hold`});h.innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="fg-hold-track" cx="50" cy="50" r="46"/><circle class="fg-hold-fill" cx="50" cy="50" r="46" stroke-dasharray="${m}" stroke-dashoffset="${m}"/></svg>`;let g=F(`span`,{class:`fg-hold-face`});g.append(tn(Pr.hand)),h.append(g);let _=h.querySelector(`.fg-hold-fill`);l.append(h),an(h);let v=new Set,y=0,b=0,x=0,S=e=>{let n=Math.min(250,e-x);if(x=e,y=v.size>0?y+n/t:Math.max(0,y-n/t*3),_.style.strokeDashoffset=String(m*(1-Math.min(1,y))),h.dataset.down=String(v.size>0),y>=1)return oe();b=v.size>0||y>0?requestAnimationFrame(S):0},C=e=>{v.add(e),b||=(x=performance.now(),requestAnimationFrame(S))},ee=e=>v.delete(e);h.addEventListener(`pointerdown`,e=>{e.preventDefault();try{h.setPointerCapture(e.pointerId)}catch{}C(e.pointerId)});for(let e of[`pointerup`,`pointercancel`,`lostpointercapture`])h.addEventListener(e,e=>ee(e.pointerId));h.addEventListener(`keydown`,e=>{(e.key===` `||e.key===`Enter`)&&!e.repeat&&(e.preventDefault(),C(`key`))}),h.addEventListener(`keyup`,e=>(e.key===` `||e.key===`Enter`)&&ee(`key`)),h.addEventListener(`blur`,()=>ee(`key`)),h.addEventListener(`contextmenu`,e=>e.preventDefault());let w=F(`p`,{class:`fg-gate-question`,"aria-live":`polite`}),T=F(`output`,{class:`fg-gate-answer`,"aria-label":`Your answer`}),E=F(`div`,{class:`fg-gate-tries`,"aria-hidden":`true`}),D=F(`div`,{class:`fg-pad`});for(let e of[`1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`,`del`,`0`,`ok`]){let t=F(`button`,{type:`button`,id:`fg-gate-key-${e}`,class:`fg-btn ${e===`ok`?``:e===`del`?`fg-btn--sun`:`fg-btn--paper`}`,"aria-label":e===`ok`?`Done`:e===`del`?`Delete`:e});t.append(e===`ok`?tn(Pr.check):e===`del`?tn(Pr.backspace):document.createTextNode(e)),t.addEventListener(`click`,()=>e===`ok`?ie():e===`del`?re():ne(e)),D.append(t)}let O=()=>{o=12+Math.floor(Math.random()*8),s=3+Math.floor(Math.random()*7),w.textContent=`What is ${o} × ${s}?`,i=``,te()},te=()=>{T.textContent=i||`?`,T.dataset.empty=String(!i),E.replaceChildren(...Array.from({length:n},(e,t)=>F(`i`,{"data-used":String(t<a)})))},ne=e=>{i.length<3&&(i+=e),te()},re=()=>{i=i.slice(0,-1),te()},ie=()=>{if(i){if(Number(i)===o*s)return u(!0);if(a++,a>=n)return u(!1);l.classList.remove(`fg-shake`),l.offsetWidth,l.classList.add(`fg-shake`),O()}},ae=e=>{if(/^[0-9]$/.test(e.key))ne(e.key);else if(e.key===`Backspace`)re();else if(e.key===`Enter`)ie();else return!1;return e.preventDefault(),!0};function oe(){b=0,r=`pad`,l.dataset.step=`pad`,p.textContent=`Type the answer`,h.replaceWith(w),w.after(T,E,D),O(),an(D.querySelector(`button`))}}),Fr}function Lr(e,n){return new Promise(r=>{let i=I({label:`Well done!`,className:`pp-finish`,onEscape:()=>o(`keep`)}),a=URL.createObjectURL(e),o=e=>{i.close(),URL.revokeObjectURL(a),r(e)},s=F(`div`,{class:`pp-frame`},F(`img`,{src:a,alt:`Your picture`})),c=F(`div`,{class:`pp-finish-stars`,html:Y.star.repeat(3)}),l=F(`button`,{type:`button`,class:`pp-round pp-finish-btn`,"aria-label":`Keep colouring`});l.innerHTML=`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 54c8-2 12-8 14-14l22-22 6 6-22 22c-6 2-12 6-14 14z" fill="#ffc93c" stroke="#1d2b36" stroke-width="3" stroke-linejoin="round"/><path d="M44 18l6-6 6 6-6 6z" fill="#d68a4c" stroke="#1d2b36" stroke-width="3" stroke-linejoin="round"/></svg>`;let u=F(`button`,{type:`button`,class:`pp-round pp-finish-btn pp-go`,"aria-label":`All pictures`,html:Y.home}),d=F(`button`,{type:`button`,class:`pp-round pp-finish-btn pp-finish-save`,"aria-label":`Save to Photos (grown-ups)`,html:Y.share});l.addEventListener(`click`,()=>o(`keep`)),u.addEventListener(`click`,()=>o(`home`)),d.addEventListener(`click`,async()=>{await Ir()&&await Rr(e,n)}),i.card.append(s,c,F(`div`,{class:`pp-finish-row`},l,u,d)),en()||i.root.prepend(...zr(54)),t.cheer(),setTimeout(()=>void ur(`done-${1+Math.floor(Math.random()*3)}`),700)})}async function Rr(e,t){let n=window.claude;if(typeof n?.use==`function`)try{let r=await n.use(`downloads`);if(r){await r.save({filename:t,data:e});return}}catch{}let r=new File([e],t,{type:e.type||`image/png`}),i=navigator;if(i.canShare?.({files:[r]}))try{await i.share({files:[r]});return}catch{return}let a=F(`a`,{href:URL.createObjectURL(e),download:t});document.body.append(a),a.click(),setTimeout(()=>{URL.revokeObjectURL(a.href),a.remove()},2e3)}function zr(e){let t=[`#ff4d4d`,`#ffc93c`,`#3fa34d`,`#3aa0ff`,`#8b5cf6`,`#ff5fa2`,`#14b8a6`];return Array.from({length:e},(e,n)=>{let r=F(`span`,{class:`pp-confetti`});return r.style.left=`${Math.random()*100}%`,r.style.background=t[n%t.length],r.style.animationDelay=`${Math.random()*1.2}s`,r.style.animationDuration=`${2.2+Math.random()*1.6}s`,r.style.setProperty(`--spin`,`${Math.random()>.5?``:`-`}${360+Math.random()*360}deg`),n%3==0&&(r.style.borderRadius=`50%`),r})}function Br(e,t,n,r){let i=I({label:`Colouring idea`,className:`pp-sheet`,onEscape:()=>i.close()}),a=F(`canvas`,{class:`pp-idea`,width:512,height:512}),o=F(`button`,{type:`button`,class:`pp-round pp-go pp-big`,"aria-label":`Another idea`,html:Y.shuffle});i.card.append(Cr(()=>i.close()),a,F(`div`,{class:`pp-idea-row`},o));let s=n.map(e=>e.hex).filter(e=>!/^#(1d1d1f|ffffff)$/i.test(e)),c=Math.floor(Math.random()*1e3),l=()=>{let n=a.getContext(`2d`),i=n.createImageData(512,512),o=new Uint32Array(i.data.buffer),l=e.size/512,u=e.size*e.size,d=new Map,f=t=>{let n=d.get(t);if(n===void 0){let i=s[(t*7919+c*104729)%s.length]??r;e.areas[t]>u*.12&&(i=V(i,.62));let a=parseInt(i.slice(1),16);n=4278190080|(a&255)<<16|a&65280|a>>16&255,d.set(t,n)}return n};for(let t=0;t<512;t++){let n=Math.floor(t*l)*e.size;for(let r=0;r<512;r++){let i=e.labels[n+Math.floor(r*l)];i>0&&(o[t*512+r]=f(i))}}n.putImageData(i,0,0),n.drawImage(t,0,0,512,512)};o.addEventListener(`click`,()=>{c++,l()}),l()}var Vr=1,Hr=15e3,Ur=8,Wr=class{stage;page;handlers;scale=1;tx=0;ty=0;base=0;pointers=new Map;drawingId;lastPencil=-1/0;pinch;ro;constructor(e,t,n){this.stage=e,this.page=t,this.handlers=n,this.ro=new ResizeObserver(()=>this.layout()),this.ro.observe(e),e.addEventListener(`pointerdown`,this.onDown),e.addEventListener(`pointermove`,this.onMove),e.addEventListener(`pointerup`,this.onUp),e.addEventListener(`pointercancel`,this.onUp),e.addEventListener(`pointerleave`,this.onLeave),e.addEventListener(`wheel`,this.onWheel,{passive:!1}),e.addEventListener(`touchstart`,Gr,{passive:!1}),e.addEventListener(`touchmove`,Gr,{passive:!1}),e.addEventListener(`gesturestart`,Gr),e.addEventListener(`contextmenu`,Gr),this.layout()}dispose(){this.ro.disconnect(),this.stage.removeEventListener(`pointerdown`,this.onDown),this.stage.removeEventListener(`pointermove`,this.onMove),this.stage.removeEventListener(`pointerup`,this.onUp),this.stage.removeEventListener(`pointercancel`,this.onUp),this.stage.removeEventListener(`pointerleave`,this.onLeave),this.stage.removeEventListener(`wheel`,this.onWheel)}reset(e=!0){this.scale=1,this.tx=this.ty=0,this.apply(e)}get zoomed(){return this.scale>1.02}layout(){let e=this.stage.getBoundingClientRect();this.base=Math.max(120,Math.floor(Math.min(e.width,e.height)-12)),this.page.style.width=this.page.style.height=`${this.base}px`,this.page.style.left=`${(e.width-this.base)/2}px`,this.page.style.top=`${(e.height-this.base)/2}px`,this.clamp(),this.apply(!1)}apply(e){this.page.style.transformOrigin=`0 0`,this.page.style.transition=e?`transform 0.28s cubic-bezier(.2,.8,.2,1)`:``,this.page.style.transform=`translate(${this.tx}px, ${this.ty}px) scale(${this.scale})`}clamp(){let e=this.stage.getBoundingClientRect(),t=parseFloat(this.page.style.left)||0,n=parseFloat(this.page.style.top)||0,r=this.base/3,i=this.base*this.scale;this.tx=Math.max(r-t-i,Math.min(e.width-r-t,this.tx)),this.ty=Math.max(r-n-i,Math.min(e.height-r-n,this.ty))}origin(){let e=this.stage.getBoundingClientRect();return{x:e.left+(parseFloat(this.page.style.left)||0),y:e.top+(parseFloat(this.page.style.top)||0)}}toPage(e,t){let n=this.page.getBoundingClientRect();return{x:(e-n.left)/n.width*W,y:(t-n.top)/n.height*W}}point(e){let{x:t,y:n}=this.toPage(e.clientX,e.clientY),r=e.pointerType===`pen`,i=r&&e.pressure>0?e.pressure:.5,a=e.altitudeAngle;return{x:t,y:n,pressure:i,tilt:r&&typeof a==`number`?Math.max(0,Math.min(1,1-a/(Math.PI/2))):0}}onDown=e=>{if(e.button>0)return;e.preventDefault();try{this.stage.setPointerCapture(e.pointerId)}catch{}this.pointers.set(e.pointerId,{id:e.pointerId,type:e.pointerType,x:e.clientX,y:e.clientY}),e.pointerType===`pen`&&(this.lastPencil=performance.now());let t=[...this.pointers.values()].filter(e=>e.type===`touch`);e.pointerType===`touch`&&(this.pencilActive||t.length>=2)?(this.drawingId!==void 0&&this.pointers.get(this.drawingId)?.type===`touch`&&(this.handlers.strokeIsYoung()?this.handlers.cancel():this.handlers.end(e),this.drawingId=void 0),t.length>=2?this.startPinch(t[0],t[1]):this.pinch=void 0):this.drawingId===void 0&&(this.drawingId=e.pointerId,this.handlers.hover?.(void 0),this.handlers.begin(this.point(e),e))};onMove=e=>{let t=this.pointers.get(e.pointerId);if(!t){e.pointerType===`pen`&&e.buttons===0&&this.handlers.hover?.(this.point(e));return}if(t.x=e.clientX,t.y=e.clientY,e.pointerType===`pen`&&(this.lastPencil=performance.now()),e.pointerId===this.drawingId){let t=typeof e.getCoalescedEvents==`function`?e.getCoalescedEvents():[],n=t.length?t:[e];this.handlers.move(n.map(e=>this.point(e)),e);return}let n=[...this.pointers.values()].filter(e=>e.type===`touch`);this.pinch&&n.length>=2?this.updatePinch(n[0],n[1]):n.length===1&&this.pencilActive&&this.pan(n[0],e)};get pencilActive(){return performance.now()-this.lastPencil<Hr}lastPan;pan(e,t){!this.lastPan||this.lastPan.id!==e.id?this.lastPan={x:t.clientX,y:t.clientY,id:e.id}:(this.tx+=t.clientX-this.lastPan.x,this.ty+=t.clientY-this.lastPan.y,this.lastPan={x:t.clientX,y:t.clientY,id:e.id},this.clamp(),this.apply(!1))}onUp=e=>{this.pointers.has(e.pointerId)&&(this.pointers.delete(e.pointerId),e.pointerId===this.drawingId&&(this.drawingId=void 0,e.type===`pointercancel`?this.handlers.cancel():this.handlers.end(e)),[...this.pointers.values()].filter(e=>e.type===`touch`).length<2&&this.pinch&&(this.pinch=void 0,this.scale<1.08&&this.reset(!0)),this.lastPan?.id===e.pointerId&&(this.lastPan=void 0))};onLeave=e=>{e.pointerType===`pen`&&!this.pointers.has(e.pointerId)&&this.handlers.hover?.(void 0)};startPinch(e,t){this.pinch={d:Math.max(10,Math.hypot(e.x-t.x,e.y-t.y)),cx:(e.x+t.x)/2,cy:(e.y+t.y)/2,scale:this.scale,tx:this.tx,ty:this.ty}}updatePinch(e,t){let n=this.pinch,r=Math.max(10,Math.hypot(e.x-t.x,e.y-t.y)),i=(e.x+t.x)/2,a=(e.y+t.y)/2,o=Math.max(Vr*.85,Math.min(Ur,n.scale*(r/n.d))),s=this.origin(),c=(n.cx-s.x-n.tx)/n.scale,l=(n.cy-s.y-n.ty)/n.scale;this.tx=i-s.x-o*c,this.ty=a-s.y-o*l,this.scale=o,this.clamp(),this.apply(!1)}onWheel=e=>{if(e.preventDefault(),e.ctrlKey||e.metaKey){let t=this.scale;this.scale=Math.max(Vr,Math.min(Ur,this.scale*Math.exp(-e.deltaY*.01)));let n=this.origin(),r=(e.clientX-n.x-this.tx)/t,i=(e.clientY-n.y-this.ty)/t;this.tx=e.clientX-n.x-this.scale*r,this.ty=e.clientY-n.y-this.scale*i}else this.tx-=e.deltaX,this.ty-=e.deltaY;this.scale<=1.001&&(this.tx=this.ty=0),this.clamp(),this.apply(!1)}};function Gr(e){e.preventDefault()}var Kr=[`crayon`,`pencil`,`marker`,`paint`,`watercolour`,`spray`,`glitter`,`rainbow`,`glow`,`fill`,`sticker`,`smudge`,`eraser`],qr={crayon:`Crayon`,pencil:`Pencil`,marker:`Felt-tip marker`,paint:`Paint brush`,watercolour:`Watercolour`,spray:`Spray paint`,glitter:`Glitter`,rainbow:`Rainbow brush`,glow:`Glow pen`,smudge:`Smudge`,eraser:`Eraser`,fill:`Fill bucket`,sticker:`Stickers`},Jr=[`solid`,`gradient`,`dots`,`stripes`,`stars`,`hearts`,`glitter`,`glow`],Yr=[`colour`,`gold`,`silver`,`rainbow`,`holo`],Xr=[`⭐`,`✨`,`❤️`,`🌸`,`🦋`,`🐞`,`🌈`,`☀️`,`🌙`,`🍓`,`🍭`,`🐶`,`🐱`,`🦄`,`🐯`,`🦖`,`🐠`,`🚗`,`🚀`,`🎈`,`👑`],Zr=[`#ffffff`,`#fff4d6`,`#e2f4ff`,`#ffe4ef`,`#dcc29a`,`#1c2140`],Qr=[.1,.38,.75],$r=e=>e.kind===`picture`?`pic:${e.picture.key}`:e.kind,ei=e=>{try{let t=localStorage.getItem(`pp.tool.${e}`);return t&&t in R?t:`crayon`}catch{return`crayon`}},ti=(e,t)=>{try{localStorage.setItem(e,t)}catch{}};async function ni(e,n){let{profile:r,source:i}=n,a=n.art,o=a?.paper??(i.kind,`#ffffff`),s=new $n;s.insideLines=r.insideLines,s.tool=ei(r.id);let c=(()=>{try{return localStorage.getItem(`pp.palette.${r.id}`)??`crayons`}catch{return`crayons`}})();s.colourHex=Er(r.id)[0]??yr(c).swatches[0].hex;let l=(e,t,n)=>F(`button`,{type:`button`,class:e,"aria-label":t,html:n}),u=l(`pp-round`,`All pictures`,Y.home),d=l(`pp-round`,`Undo`,Y.undo),f=l(`pp-round`,`Redo`,Y.redo),p=l(`pp-round pp-lines-toggle`,`Stay inside the lines`,Y.linesOn),m=l(`pp-round`,`Paper colour`,Y.paper),h=l(`pp-round`,`Fresh page`,Y.newPage),g=l(`pp-round`,`Colouring idea`,Y.idea),_=l(`pp-round pp-go pp-done`,`Finished!`,Y.check),v=l(`pp-round pp-lights`,`Lights off`,Y.moon),y=F(`div`,{class:`pp-top`},u,d,f,F(`span`,{class:`pp-top-gap`}),v,i.kind===`blank`?null:g,h,i.kind===`blank`?m:p,_),b=F(`div`,{class:`pp-tools`,role:`toolbar`,"aria-label":`Tools`}),x=new Map;for(let e of Kr){let t=l(`pp-tool`,qr[e],mr[e]);t.dataset.tool=e,t.addEventListener(`click`,()=>we(e)),x.set(e,t),b.append(t)}let S=F(`div`,{class:`pp-options`}),C=F(`div`,{class:`pp-size-row`,role:`group`,"aria-label":`Brush size`}),ee=Qr.map((e,t)=>{let n=l(`pp-size`,[`Thin`,`Medium`,`Thick`][t],`<span></span>`);return n.style.setProperty(`--dot`,`${10+t*9}px`),n.addEventListener(`click`,()=>Te(e)),C.append(n),n}),w=F(`input`,{type:`range`,min:`0`,max:`100`,id:`pp-size-slider`,class:`pp-slider`,"aria-label":`Brush size`});w.addEventListener(`input`,()=>Te(Number(w.value)/100,!1));let T=F(`input`,{type:`range`,min:`15`,max:`100`,value:`100`,id:`pp-opacity-slider`,class:`pp-slider pp-opacity`,"aria-label":`See-through`});T.addEventListener(`input`,()=>{s.opacity=Number(T.value)/100});let E=F(`div`,{class:`pp-fill-modes`,role:`group`,"aria-label":`Fill pattern`}),D=Jr.map(e=>{let n=l(`pp-mode`,`Fill: ${e}`,``);return n.addEventListener(`click`,()=>{s.fillMode=e,t.tap(),Ee()}),E.append(n),n}),O=F(`div`,{class:`pp-glitter-kinds`,role:`group`,"aria-label":`Glitter`}),te=Yr.map(e=>{let n=l(`pp-mode`,`Glitter: ${e}`,_r[e]);return n.addEventListener(`click`,()=>{s.glitterKind=e,t.tap(),Ee()}),O.append(n),n}),ne=F(`div`,{class:`pp-stickers`,role:`group`,"aria-label":`Sticker`}),re=Xr.map(e=>{let n=l(`pp-sticker`,`Sticker ${e}`,``);return n.textContent=e,n.addEventListener(`click`,()=>{s.sticker=e,t.tap(),Ee()}),ne.append(n),n});S.append(C,w,T,E,O,ne);let ie=F(`div`,{class:`pp-toolpanel`},b,S),ae=F(`button`,{type:`button`,class:`pp-current`,"aria-label":`Colour wheel`}),oe=F(`div`,{class:`pp-swatches`,role:`group`,"aria-label":`Colours`}),se=F(`div`,{class:`pp-recents`,role:`group`,"aria-label":`Colours I used`}),ce=l(`pp-round pp-small`,`Colour sets`,Y.palette),le=l(`pp-round pp-small`,`Colour wheel`,Y.wheel),ue=l(`pp-round pp-small`,`Pick a colour from the picture`,Y.dropper),de=F(`div`,{class:`pp-colours`},ae,oe,se,F(`div`,{class:`pp-colour-tools`},ce,le,ue)),fe=F(`div`,{class:`pp-paper`});s.colour.className=`pp-layer`,s.live.className=`pp-layer`,fe.append(s.colour,s.live);let pe,me,he;i.kind!==`blank`&&(me=i.kind===`picture`?ft(i.picture):URL.createObjectURL(i.lines),he=i.kind===`picture`?mt(i.picture):me,pe=F(`img`,{class:`pp-layer pp-lines`,src:me,alt:``,draggable:`false`}),fe.append(pe));let ge,k=new Ar(s,()=>ge);s.colour.after(k.night,k.halo,k.sparkle),s.onEffects=()=>k.refresh();let A=F(`div`,{class:`pp-hover`});A.hidden=!0;let _e=F(`div`,{class:`pp-page`},fe,A),ve=F(`div`,{class:`pp-busy`}),ye=F(`div`,{class:`pp-stage`},_e,ve),j=F(`div`,{class:`pp-editor`},y,ie,ye,de,F(`div`,{class:`pp-defs`,"aria-hidden":`true`,html:`<svg width="0" height="0"><defs><linearGradient id="pp-rainbow-def" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4d4d"/><stop offset=".2" stop-color="#ff9a3c"/><stop offset=".4" stop-color="#ffd60a"/><stop offset=".6" stop-color="#4cd163"/><stop offset=".8" stop-color="#3fb4ff"/><stop offset="1" stop-color="#8b6cff"/></linearGradient></defs></svg>`}));e.replaceChildren(j);function be(){let e=s.colourHex,t=e===Sn;j.classList.toggle(`pp-rainbow-on`,t),j.style.setProperty(`--pp-current`,t?`#ff5fa2`:e),j.style.setProperty(`--pp-current-ink`,!t&&Tn(e)>.62?`#1d2b36`:`#ffffff`);for(let t of oe.children)t.setAttribute(`aria-pressed`,String(t.dataset.hex?.toLowerCase()===e.toLowerCase()));for(let[n,r]of Jr.entries())D[n].innerHTML=hr[r](t?r===`glow`?`#ff5fa2`:`url(#pp-rainbow-def)`:e)}function xe(){oe.replaceChildren(...[{hex:Sn,name:`rainbow`},...yr(c).swatches].map(e=>{let t=xr(e.hex,e.name??`Colour`);return t.addEventListener(`click`,()=>{Ce(e.hex);let t=br(e.hex);t&&ur(`colour-${t}`)}),t})),ce.innerHTML=`<span class="pp-badge">${yr(c).badge}</span>`,be()}function Se(){se.replaceChildren(...Er(r.id).slice(0,6).map(e=>{let t=xr(e,`Colour I used`);return t.classList.add(`pp-swatch--recent`),t.addEventListener(`click`,()=>Ce(e)),t}))}function Ce(e,n=!1){s.colourHex=e,n||Dr(r.id,e),t.pick(),be(),Se()}function we(e){if(!s.drawing){s.tool=e,ti(`pp.tool.${r.id}`,e),t.tap();for(let[t,n]of x)n.setAttribute(`aria-pressed`,String(t===e));j.dataset.tool=e,Ee()}}function Te(e,n=!0){s.sizes[s.tool]=e,n&&t.tap(),Ee()}function Ee(){let e=R[s.tool],t=e.id===`fill`,n=e.id===`sticker`;C.hidden=t,w.hidden=t,T.hidden=t||n,E.hidden=!t,O.hidden=!(e.id===`glitter`||t&&s.fillMode===`glitter`),ne.hidden=!n,te.forEach((e,t)=>e.setAttribute(`aria-pressed`,String(Yr[t]===s.glitterKind)));let r=s.sizes[e.id];w.value=String(Math.round(r*100));let i=Qr.reduce((e,t,n)=>Math.abs(t-r)<Math.abs(Qr[e]-r)?n:e,0);ee.forEach((e,t)=>e.setAttribute(`aria-pressed`,String(t===i))),D.forEach((e,t)=>e.setAttribute(`aria-pressed`,String(Jr[t]===s.fillMode))),re.forEach((e,t)=>e.setAttribute(`aria-pressed`,String(Xr[t]===s.sticker)))}function De(){d.disabled=!s.history.canUndo,f.disabled=!s.history.canRedo}function Oe(){p.innerHTML=s.insideLines?Y.linesOn:Y.linesOff,p.setAttribute(`aria-pressed`,String(s.insideLines)),p.setAttribute(`aria-label`,s.insideLines?`Staying inside the lines`:`Colouring anywhere`)}function ke(){fe.style.setProperty(`--pp-paper`,o),j.style.setProperty(`--pp-paper-swatch`,o)}s.history.onChange=De,xe(),Se(),we(s.tool),De(),Oe(),ke(),ve.hidden=!1;let Ae=(async()=>{if(he)try{ge=await ri(he),s.regions=await Rn(ge,W),Kn(s.regions)}catch{}})();if(a){let[e,t]=await Promise.all([N.colours(a),N.effects(a)]);if(e)try{let n=await createImageBitmap(e),r=t?await createImageBitmap(t).catch(()=>void 0):void 0;s.load(n,r),n.close(),r?.close()}catch{s.load()}}Ae.then(()=>ve.hidden=!0),pe||(ve.hidden=!0);let M=!1,je={x:0,y:0,t:0},Me={x:0,y:0,t:0},Ne=0,Pe=new Wr(ye,_e,{begin(e,n){if(t.unlock(),Me={x:n.clientX,y:n.clientY,t:performance.now()},je={x:e.x,y:e.y,t:performance.now()},M)return;let r=R[s.tool];r.id!==`fill`&&(s.begin(e),r.family!==`tap`&&t.startBrush(r.id),n.pointerType===`pen`&&(Ne=window.setTimeout(()=>{s.strokeLength>14||(s.cancel(),t.stopBrush(),Fe(e))},650)))},move(e){if(M||R[s.tool].id===`fill`)return;s.move(e);let n=e.at(-1),r=performance.now(),i=Math.max(1,r-je.t);t.brushSpeed(Math.hypot(n.x-je.x,n.y-je.y)/i*1e3),je={x:n.x,y:n.y,t:r},s.strokeLength>14&&clearTimeout(Ne)},end(e){clearTimeout(Ne),t.stopBrush();let n=Pe.toPage(e.clientX,e.clientY);if(M){Fe({...n,pressure:.5,tilt:0});return}let r=R[s.tool];if(r.id===`fill`){if(Math.hypot(e.clientX-Me.x,e.clientY-Me.y)>24)return;Ae.then(()=>s.fillAt(n.x,n.y,!0));return}let i=r.id===`sticker`;s.end(),i&&t.sticker()},cancel(){clearTimeout(Ne),t.stopBrush(),s.cancel()},strokeIsYoung(){return performance.now()-Me.t<280||s.strokeLength<40},hover(e){if(!e||R[s.tool].family===`tap`){A.hidden=!0;return}let t=on(R[s.tool],s.sizes[s.tool])/W*100;A.hidden=!1,A.style.width=A.style.height=`${t}%`,A.style.left=`${e.x/W*100}%`,A.style.top=`${e.y/W*100}%`}});function Fe(e){M=!1,j.classList.remove(`pp-picking`),Ce(s.colourAt(e.x,e.y)??o)}s.onFill=()=>t.fill();function Ie(e){k.setNight(e),j.classList.toggle(`pp-night`,e),v.innerHTML=e?Y.sun:Y.moon,v.setAttribute(`aria-label`,e?`Lights on`:`Lights off`),v.setAttribute(`aria-pressed`,String(e))}v.addEventListener(`click`,()=>{t.unlock();let e=!k.isNight;t.lights(e),Ie(e),e&&setTimeout(()=>void ur(`lights-off`),500)});let Le=!1,Re=0,ze=!!a?.done,Be=0,Ve=Promise.resolve(),He=0;s.onCommit=()=>{Le=!0,De(),clearTimeout(Be),Be=window.setTimeout(Ue,4e3)};function Ue(){s.drawing?Be=window.setTimeout(Ue,1500):Ge()}function We(){let e=s.composite(ge,o,320),t=e.toDataURL(`image/jpeg`,.8);return e.width=e.height=0,t}function Ge(){return clearTimeout(Be),Ve=Ve.then(async()=>{if(!Le)return;await Ae;let e=performance.now();Le=!1;let t=Date.now(),n=!a;a??={id:wt(),profile:r.id,page:$r(i),paper:o,created:t,updated:t,thumb:``},a.updated=t,a.paper=o,a.done=ze||void 0,a.thumb=We();let c=await s.colourPng();if(!c)return;let l=await s.effectsPng();await N.save(a,c,n&&i.kind===`photo`?i.lines:void 0,l),Re=performance.now()-e,He||=window.setTimeout(()=>{He=0,a&&N.sync(a.id)},6e4)}),Ve}let Ke=()=>{document.hidden&&Ge().then(()=>a&&N.sync(a.id))};document.addEventListener(`visibilitychange`,Ke);async function qe(){await Ge(),a&&N.sync(a.id),n.onExit()}u.addEventListener(`click`,()=>{t.tap(),qe()}),d.addEventListener(`click`,()=>{s.undo(),t.undo()}),f.addEventListener(`click`,()=>{s.redo(),t.redo()}),p.addEventListener(`click`,()=>{s.insideLines=!s.insideLines,Gt(r.id,{insideLines:s.insideLines}),t.tap(),Oe()}),m.addEventListener(`click`,()=>{t.tap(),ii(o).then(e=>{e&&(o=e,ke(),Le=!0,Ge())})}),h.addEventListener(`click`,()=>{t.tap(),ai().then(async e=>{e&&(await Ge(),a&&N.sync(a.id),a=void 0,ze=!1,s.load(),Pe.reset(),De())})}),_.addEventListener(`click`,async()=>{t.unlock(),(a||s.hasPaint)&&(ze=!0,Le=!0),await Ge(),a&&N.sync(a.id),await Ae;let e=k.compose(o,1600),n=await new Promise(t=>e.toBlob(t,`image/png`));e.width=e.height=0,n&&await Lr(n,`paint-pond-${i.kind===`picture`?i.picture.id:i.kind===`blank`?`drawing`:`photo-colouring`}.png`)===`home`&&qe()}),g.addEventListener(`click`,()=>{t.tap(),Ae.then(()=>{s.regions&&ge&&Br(s.regions,ge,yr(c).swatches,o)})}),ae.addEventListener(`click`,()=>void wr(s.colourHex).then(e=>e&&Ce(e))),le.addEventListener(`click`,()=>void wr(s.colourHex).then(e=>e&&Ce(e))),ce.addEventListener(`click`,()=>{t.tap(),Sr(c).then(e=>{e&&(c=e,ti(`pp.palette.${r.id}`,e),xe())})}),ue.addEventListener(`click`,()=>{t.tap(),M=!M,j.classList.toggle(`pp-picking`,M)});let Je=0;if(location.hash.includes(`debug`)){let e=F(`div`,{class:`pp-debug`});j.append(e);let t=0,n=performance.now(),r=0,i=()=>{t++,e.isConnected&&requestAnimationFrame(i)};requestAnimationFrame(i),Je=window.setInterval(()=>{let i=performance.now();r=Math.round(t*1e3/(i-n)),t=0,n=i;let a=s.stats;e.textContent=`${r} fps · stroke frame ${a.frameMs.toFixed(1)} ms (worst ${a.worstFrameMs.toFixed(1)}) · lift ${a.endMs.toFixed(0)} ms · save ${Re.toFixed(0)} ms · ${N.status()}`},500)}let Ye=e=>{if(document.querySelector(`.fg-overlay`))return;let t=e.metaKey||e.ctrlKey;t&&e.key.toLowerCase()===`z`?(e.preventDefault(),e.shiftKey?s.redo():s.undo()):e.key===`[`||e.key===`]`?Te(Math.max(0,Math.min(1,s.sizes[s.tool]+(e.key===`]`?.08:-.08))),!1):e.key===`0`&&!t&&Pe.reset()};return window.addEventListener(`keydown`,Ye),()=>{window.removeEventListener(`keydown`,Ye),clearInterval(Je),document.removeEventListener(`visibilitychange`,Ke),clearTimeout(Be),clearTimeout(He),Pe.dispose(),k.dispose(),s.dispose(),i.kind===`photo`&&me&&URL.revokeObjectURL(me)}}function ri(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>t(r),r.onerror=()=>n(Error(`image failed to load`)),r.src=e})}function ii(e){return new Promise(t=>{let n=I({label:`Paper colour`,className:`pp-sheet`,onEscape:()=>r(void 0)}),r=e=>{n.close(),t(e)},i=F(`div`,{class:`pp-papers`});for(let t of Zr){let n=F(`button`,{type:`button`,class:`pp-paper-choice`,"aria-label":`Paper`,"aria-pressed":String(t===e)});n.style.background=t,n.addEventListener(`click`,()=>r(t)),i.append(n)}n.card.append(Cr(()=>r(void 0)),i)})}function ai(){return new Promise(e=>{let t=I({label:`Start a fresh page?`,className:`pp-sheet pp-confirm`,onEscape:()=>n(!1)}),n=n=>{t.close(),e(n)},r=F(`button`,{type:`button`,class:`pp-round pp-big pp-stop`,"aria-label":`No, keep this page`,html:Y.close}),i=F(`button`,{type:`button`,class:`pp-round pp-big pp-go`,"aria-label":`Yes, a fresh page`,html:Y.newPage});r.addEventListener(`click`,()=>n(!1)),i.addEventListener(`click`,()=>n(!0)),t.card.append(F(`div`,{class:`pp-confirm-art`,html:Y.newPage}),F(`div`,{class:`pp-confirm-row`},r,i))})}function oi(){return new Promise(e=>{let t=F(`input`,{type:`file`,accept:`image/*`,class:`pp-hidden-input`});document.body.append(t);let n=!1,r=r=>{n||(n=!0,t.remove(),e(r))};t.addEventListener(`change`,async()=>{let e=t.files?.[0];if(!e)return r(void 0);try{r(await ci(await si(e)))}catch{r(void 0)}}),t.addEventListener(`cancel`,()=>r(void 0)),window.addEventListener(`focus`,()=>setTimeout(()=>!t.files?.length&&r(void 0),1200),{once:!0}),t.click()})}function si(e){return new Promise((t,n)=>{let r=URL.createObjectURL(e),i=new Image;i.onload=()=>{URL.revokeObjectURL(r),t(i)},i.onerror=()=>{URL.revokeObjectURL(r),n(Error(`not an image`))},i.src=r})}function ci(e){return new Promise(t=>{let n=I({label:`Make a colouring page`,className:`pp-sheet pp-trace`,onEscape:()=>u(void 0)}),r=F(`canvas`,{class:`pp-trace-preview`,width:512,height:512}),i=F(`input`,{type:`range`,min:`1`,max:`10`,value:`5`,id:`pp-trace-strength`,class:`pp-slider`,"aria-label":`Line strength`}),a=F(`button`,{type:`button`,class:`pp-round pp-go pp-big`,"aria-label":`Colour this`,html:Y.check});n.card.append(Cr(()=>u(void 0)),r,F(`div`,{class:`pp-trace-row`},F(`span`,{class:`pp-trace-thin`,"aria-hidden":`true`}),i,F(`span`,{class:`pp-trace-thick`,"aria-hidden":`true`})),a);let o=li(e),s=ui(o,5),c=()=>{let e=r.getContext(`2d`);e.fillStyle=`#fff`,e.fillRect(0,0,512,512),e.drawImage(s,0,0,512,512)};c();let l=0;i.addEventListener(`input`,()=>{cancelAnimationFrame(l),l=requestAnimationFrame(()=>{s.width=s.height=0,s=ui(o,Number(i.value)),c()})});let u=e=>{n.close(),s.width=s.height=0,t(e)};a.addEventListener(`click`,()=>s.toBlob(e=>u(e??void 0),`image/png`))})}function li(e){let t=document.createElement(`canvas`);t.width=t.height=W;let n=t.getContext(`2d`,{willReadFrequently:!0});n.fillStyle=`#fff`,n.fillRect(0,0,W,W);let r=Math.min(W/e.naturalWidth,W/e.naturalHeight)*.94,i=e.naturalWidth*r,a=e.naturalHeight*r;n.drawImage(e,(W-i)/2,(W-a)/2,i,a);let o=n.getImageData(0,0,W,W).data;t.width=t.height=0;let s=new Float32Array(W*W);for(let e=0,t=0;e<s.length;e++,t+=4)s[e]=o[t]*.299+o[t+1]*.587+o[t+2]*.114;return s}function ui(e,t){let n=W,r=new Float64Array((n+1)*(n+1));for(let t=0;t<n;t++){let i=0;for(let a=0;a<n;a++)i+=e[t*n+a],r[(t+1)*(n+1)+a+1]=r[t*(n+1)+a+1]+i}let i=34-t*2.8,a=new Uint8Array(n*n);for(let t=0;t<n;t++){let o=Math.max(0,t-24),s=Math.min(n,t+24+1);for(let c=0;c<n;c++){let l=Math.max(0,c-24),u=Math.min(n,c+24+1),d=(s-o)*(u-l),f=r[s*(n+1)+u]-r[o*(n+1)+u]-r[s*(n+1)+l]+r[o*(n+1)+l],p=e[t*n+c];p<f/d-i&&p<215&&(a[t*n+c]=1)}}let o=new Uint8Array(n*n);for(let e=1;e<n-1;e++)for(let t=1;t<n-1;t++){let r=e*n+t;o[r]=+(a[r-n-1]+a[r-n]+a[r-n+1]+a[r-1]+a[r]+a[r+1]+a[r+n-1]+a[r+n]+a[r+n+1]>=5)}let s=document.createElement(`canvas`);s.width=s.height=n;let c=s.getContext(`2d`),l=c.createImageData(n,n),u=new Uint32Array(l.data.buffer);for(let e=1;e<n-1;e++)for(let t=1;t<n-1;t++){let r=e*n+t;(o[r]||o[r-1]||o[r+1]||o[r-n]||o[r+n])&&(u[r]=4280098077)}return c.putImageData(l,0,0),s}var di=(e,t=`pp-avatar`)=>F(`span`,{class:t,"aria-hidden":`true`},e.avatar);function fi(e,n){let r=F(`div`,{class:`pp-profiles`});for(let e of Ht()){let i=F(`button`,{type:`button`,class:`pp-profile`,"aria-label":e.name||`Player ${e.avatar}`},di(e),e.name?F(`span`,{class:`pp-profile-name`},e.name):null);i.addEventListener(`click`,()=>{t.tap(),n(e)}),r.append(i)}let i=F(`button`,{type:`button`,class:`pp-round pp-small pp-grownups`,"aria-label":`Grown-ups`,html:Y.gear});i.addEventListener(`click`,async()=>{await Ir()&&(await wi(),fi(e,n))}),e.replaceChildren(F(`div`,{class:`pp-screen pp-who`},F(`h2`,{class:`pp-who-title`},`Who is colouring?`),r,i))}var pi=!1;function mi(e,n,r,i){pi||(pi=!0,ur(`home-pick`),dr([`colour-red`,`colour-blue`,`colour-yellow`,`colour-green`,`done-1`,`done-2`,`done-3`]));let a=F(`header`,{class:`pp-home-top`}),o=F(`button`,{type:`button`,class:`pp-me`,"aria-label":`Change who is colouring`},di(n),n.name?F(`span`,null,n.name):null);o.addEventListener(`click`,()=>{t.tap(),i()}),a.append(o,F(`span`,{class:`pp-home-logo`,"aria-hidden":`true`},`Paint Pond`));let s=ht(n.level),c=F(`section`,{class:`pp-starts`,"aria-label":`Start colouring`});if(s){let e=N.latestFor(n.id,`pic:${s.key}`),t=hi(`pp-start pp-start--today`,`Today's picture`,gi(s,e));t.append(F(`span`,{class:`pp-start-badge`,html:Y.sun})),t.addEventListener(`click`,()=>r({kind:`picture`,picture:s,art:e})),c.append(t)}let l=hi(`pp-start pp-start--blank`,`Blank page`,F(`span`,{class:`pp-start-art pp-start-art--blank`,html:vi()}));l.addEventListener(`click`,()=>r({kind:`blank`}));let u=hi(`pp-start pp-start--photo`,`Colour a photo of my drawing`,F(`span`,{class:`pp-start-art pp-start-art--photo`,html:Y.camera}));u.addEventListener(`click`,()=>r({kind:`photo`}));let d=N.list(n.id),f=F(`span`,{class:`pp-start-art pp-stack`});for(let e of d.slice(0,3))f.append(F(`img`,{src:e.thumb,alt:``}));d.length||(f.innerHTML=Y.frame);let p=hi(`pp-start pp-start--mine`,`My pictures`,f);d.length&&p.append(F(`span`,{class:`pp-count`},String(d.length))),p.addEventListener(`click`,()=>{t.tap(),xi(e,n,r,()=>mi(e,n,r,i))}),c.append(l,u,p);let m=F(`section`,{class:`pp-shelf`,"aria-label":`Books`});for(let a of st){let o=F(`button`,{type:`button`,class:`pp-book`,"aria-label":a.title});o.style.setProperty(`--book`,a.colour);let s=F(`span`,{class:`pp-book-covers`});for(let e of _i(a,n))s.append(F(`img`,{src:ft(e),alt:``,loading:`lazy`}));o.append(s,F(`span`,{class:`pp-book-title`},a.title)),o.addEventListener(`click`,()=>{t.tap(),yi(e,n,a,r,()=>mi(e,n,r,i))}),m.append(o)}e.replaceChildren(F(`div`,{class:`pp-screen pp-home`},a,F(`div`,{class:`pp-scroll`},c,m)))}function hi(e,t,n){return F(`button`,{type:`button`,class:e,"aria-label":t},n)}function gi(e,t){return F(`span`,{class:`pp-thumb-wrap`},F(`img`,{class:`pp-thumb`,src:t?.thumb||ft(e),alt:``,loading:`lazy`}))}function _i(e,t){return[...e.pictures].sort((e,n)=>Math.abs(e.level-t.level)-Math.abs(n.level-t.level)).slice(0,3)}function vi(){return`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="8" width="40" height="48" rx="4" fill="#fff" stroke="#1d2b36" stroke-width="2.5"/><path d="M20 40c6-10 12 2 18-8s8-4 8-4" fill="none" stroke="#ff5fa2" stroke-width="5" stroke-linecap="round"/><path d="M20 24c4-4 8-4 12 0" fill="none" stroke="#3fb4ff" stroke-width="5" stroke-linecap="round"/></svg>`}function yi(e,n,r,i,a){let o=F(`button`,{type:`button`,class:`pp-round`,"aria-label":`Back`,html:Y.back});o.addEventListener(`click`,()=>{t.tap(),a()});let s=F(`header`,{class:`pp-book-top`},o,F(`h2`,{class:`pp-book-name`},r.title));s.style.setProperty(`--book`,r.colour);let c=F(`div`,{class:`pp-grid`}),l=[...r.pictures].sort((e,t)=>(e.level===n.level?-1:0)-(t.level===n.level?-1:0)||e.level-t.level);for(let e of l){let r=N.latestFor(n.id,`pic:${e.key}`),a=F(`button`,{type:`button`,class:`pp-tile`,"aria-label":e.title},gi(e,r),bi(e.level));r?.done&&a.append(F(`span`,{class:`pp-tile-star`,html:Y.star})),a.addEventListener(`click`,()=>{t.tap(),i({kind:`picture`,picture:e,art:r})}),c.append(a)}let u=F(`div`,{class:`pp-screen pp-bookview`},s,F(`div`,{class:`pp-scroll`},c));u.style.setProperty(`--book`,r.colour),e.replaceChildren(u)}function bi(e){let t=F(`span`,{class:`pp-level`,"aria-label":[``,`Easy`,`Medium`,`Detailed`][e]});for(let n=1;n<=3;n++)t.append(F(`i`,{class:n<=e?`on`:``}));return t}function xi(e,n,r,i){let a=!1,o=F(`button`,{type:`button`,class:`pp-round`,"aria-label":`Back`,html:Y.back});o.addEventListener(`click`,()=>{t.tap(),i()});let s=F(`button`,{type:`button`,class:`pp-round pp-small`,"aria-label":`Remove pictures (grown-ups)`,html:Y.trash}),c=F(`div`,{class:`pp-grid`}),l=()=>{let e=N.list(n.id);if(c.replaceChildren(),!e.length)c.append(F(`div`,{class:`pp-empty`,html:Y.frame}));else for(let n of e){let e=F(`button`,{type:`button`,class:`pp-tile pp-tile--art`,"aria-label":Si(n)},F(`span`,{class:`pp-thumb-wrap`},F(`img`,{class:`pp-thumb`,src:n.thumb,alt:``})));n.done&&e.append(F(`span`,{class:`pp-tile-star`,html:Y.star})),a&&e.append(F(`span`,{class:`pp-tile-x`,html:Y.close})),e.addEventListener(`click`,async()=>{a?(await N.remove(n.id),l()):(t.tap(),r({kind:`art`,art:n}))}),c.append(e)}};s.addEventListener(`click`,async()=>{(a||await Ir())&&(a=!a,s.setAttribute(`aria-pressed`,String(a)),l())}),l();let u=F(`header`,{class:`pp-book-top`},o,F(`h2`,{class:`pp-book-name`},`My pictures`),F(`span`,{class:`pp-top-gap`}),s);e.replaceChildren(F(`div`,{class:`pp-screen pp-bookview pp-mine`},u,F(`div`,{class:`pp-scroll`},c)))}function Si(e){return e.page.startsWith(`pic:`)?lt(e.page.slice(4))?.title??`Picture`:e.page===`blank`?`Drawing`:`Photo drawing`}var Ci=[[1,`Age 3+`],[2,`Age 6+`],[3,`Age 8+`]];function wi(){return new Promise(e=>{let n=I({label:`Grown-ups`,className:`pp-sheet pp-parents`,onEscape:()=>r()}),r=()=>{n.close(),e()},i=F(`div`,{class:`pp-parents-body`}),a=()=>{i.replaceChildren(),i.append(F(`h2`,null,`Grown-ups`));for(let e of Ht()){let t=F(`div`,{class:`pp-parent-row`}),n=F(`button`,{type:`button`,class:`pp-parent-avatar`,"aria-label":`Change picture`},e.avatar);n.addEventListener(`click`,()=>{let t=Rt[(Rt.indexOf(e.avatar)+1)%Rt.length];Gt(e.id,{avatar:t}),a()});let r=F(`input`,{type:`text`,id:`pp-name-${e.id}`,class:`pp-parent-name`,value:e.name,placeholder:`Name (optional)`,maxlength:`20`,autocomplete:`off`});r.addEventListener(`change`,()=>Gt(e.id,{name:r.value.trim().slice(0,20)}));let o=F(`div`,{class:`pp-parent-levels`,role:`group`,"aria-label":`Pictures first`});for(let[t,n]of Ci){let r=F(`button`,{type:`button`,class:`pp-chip`,"aria-pressed":String(e.level===t)},n);r.addEventListener(`click`,()=>{Gt(e.id,{level:t}),a()}),o.append(r)}let s=F(`button`,{type:`button`,class:`pp-round pp-small`,"aria-label":`Remove this child`,html:Y.trash});s.disabled=Ht().length<=1,s.addEventListener(`click`,()=>{qt(e.id),a()}),t.append(n,r,o,s),i.append(t)}let e=F(`button`,{type:`button`,class:`pp-chip pp-chip--add`,html:`${Y.plus}<span>Add a child</span>`});e.addEventListener(`click`,()=>{Kt(),a()});let n=F(`button`,{type:`button`,class:`pp-chip`,"aria-pressed":String(Jt().sound),html:`${Jt().sound?Y.sound:Y.mute}<span>Sounds</span>`});n.addEventListener(`click`,()=>{Yt({sound:!Jt().sound}),t.enabled=Jt().sound,a()});let r={local:`Pictures are saved on this device.`,account:`Pictures are saved on this device and in your claude.ai account.`,"account-readonly":`Pictures are saved on this device. Your claude.ai access to this page is view-only, so they are not copied to your account.`}[N.status()];i.append(F(`div`,{class:`pp-parent-actions`},e,n),F(`p`,{class:`pp-parent-note`},r))};a(),n.card.append(Cr(r),i)})}function Ti(e,t){return new Promise(n=>{let r=F(`canvas`,{class:`pp-title-canvas`,"aria-hidden":`true`}),i=F(`h1`,{class:`pp-logo`,"aria-label":`Paint Pond`});`Paint Pond`.split(``).forEach((e,t)=>{let n=F(`span`,{class:`pp-logo-letter`,"aria-hidden":`true`},e===` `?`\xA0`:e);n.style.setProperty(`--i`,String(t)),i.append(n)});let a=F(`button`,{type:`button`,class:`pp-play`,"aria-label":`Play`,html:Ei()});a.disabled=!0;let o=F(`div`,{class:`pp-title`},r,F(`div`,{class:`pp-title-front`},i,a));e.replaceChildren(o),t.finally(()=>{a.disabled=!1,a.focus({preventScroll:!0})});let s=Oi(r);a.addEventListener(`click`,()=>{s(),n()})})}function Ei(){return Y.check.replace(/<path[^>]*\/>/,`<path d="M8.5 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.8l-10-6.5a1 1 0 0 0-1.5.9z" fill="currentColor" stroke="none"/>`)}var Di=[`#ff4d4d`,`#ff9a3c`,`#ffd60a`,`#4cd163`,`#3fb4ff`,`#8b6cff`,`#ff5fa2`];function Oi(e){let t=e.getContext(`2d`),n=en(),r=0,i=0,a=1,o=0,s=performance.now(),c=[],l=[],u=Array.from({length:6},(e,t)=>({x:(t+.5)/6+(Math.random()-.5)*.08,s:.7+Math.random()*.5,p:Math.random()*6})),d=0,f=()=>{a=Math.min(2,window.devicePixelRatio||1),r=e.clientWidth,i=e.clientHeight,e.width=Math.round(r*a),e.height=Math.round(i*a)};f(),window.addEventListener(`resize`,f);let p=()=>i*.72,m=e=>{let f=(e-s)/1e3;t.setTransform(a,0,0,a,0,0);let h=t.createLinearGradient(0,0,0,p());h.addColorStop(0,`#bfe9ff`),h.addColorStop(1,`#fff4d6`),t.fillStyle=h,t.fillRect(0,0,r,i),t.fillStyle=`#ffd25e`,t.beginPath(),t.arc(r*.84,i*.17,Math.min(r,i)*.08,0,Math.PI*2),t.fill();let g=r/2,_=i*.62,v=Math.min(r*.46,i*.5),y=Math.max(10,v*.075);Di.slice(0,6).forEach((e,r)=>{let i=n?1:Math.min(1,Math.max(0,(f-r*.12)/.9));if(i<=0)return;let a=v-r*y*1.05;t.strokeStyle=e,t.lineWidth=y,t.lineCap=`round`,t.globalAlpha=.92,t.beginPath(),t.arc(g,_,a,Math.PI,Math.PI+Math.PI*ki(i)),t.stroke(),t.globalAlpha=.25,t.lineWidth=2,t.strokeStyle=`#ffffff`,t.beginPath(),t.arc(g,_,a-y*.2,Math.PI,Math.PI+Math.PI*ki(i)),t.stroke(),t.globalAlpha=1});let b=p(),x=t.createLinearGradient(0,b,0,i);x.addColorStop(0,`#5cc8c2`),x.addColorStop(1,`#0f7c80`),t.fillStyle=x,t.beginPath(),t.moveTo(0,b);for(let e=0;e<=r;e+=24)t.lineTo(e,b+Math.sin(e/60+f*1.6)*4);t.lineTo(r,i),t.lineTo(0,i),t.closePath(),t.fill(),!n&&f>1&&e>d&&(d=e+380+Math.random()*600,c.push({x:r*(.12+Math.random()*.76),y:-20,v:0,c:Di[Math.floor(Math.random()*Di.length)]}));for(let n=c.length-1;n>=0;n--){let r=c[n];r.v+=.5,r.y+=r.v,t.fillStyle=r.c,t.beginPath(),t.moveTo(r.x,r.y-16),t.bezierCurveTo(r.x+9,r.y-2,r.x+9,r.y+9,r.x,r.y+9),t.bezierCurveTo(r.x-9,r.y+9,r.x-9,r.y-2,r.x,r.y-16),t.fill(),r.y>b+10&&(l.push({x:r.x,y:b+14+Math.random()*(i-b)*.5,t:e,c:r.c}),c.splice(n,1))}for(let n=l.length-1;n>=0;n--){let r=l[n],i=(e-r.t)/1400;if(i>1)l.splice(n,1);else{t.strokeStyle=r.c,t.globalAlpha=1-i,t.lineWidth=4;for(let e of[1,.6])t.beginPath(),t.ellipse(r.x,r.y,10+i*70*e,(10+i*70*e)*.32,0,0,Math.PI*2),t.stroke();t.globalAlpha=1}}for(let e of u){let n=e.x*r,a=b+(i-b)*.55+Math.sin(f*1.3+e.p)*4,o=Math.min(r,i)*.05*e.s;t.fillStyle=`#3fa34d`,t.beginPath(),t.ellipse(n,a,o*1.4,o*.55,0,.25,Math.PI*2-.25),t.lineTo(n,a),t.closePath(),t.fill(),t.fillStyle=`#2d7f3a`,t.beginPath(),t.ellipse(n,a+o*.12,o*1.4,o*.5,0,.35,Math.PI-.35),t.fill(),e.s>1.05&&(t.fillStyle=`#ff9fc6`,t.beginPath(),t.arc(n-o*.5,a-o*.2,o*.32,0,Math.PI*2),t.fill())}o=requestAnimationFrame(m)};return o=requestAnimationFrame(m),()=>{cancelAnimationFrame(o),window.removeEventListener(`resize`,f),e.width=e.height=0}}var ki=e=>1-(1-e)**3,Ai=document.getElementById(`pp-app`);document.addEventListener(`gesturestart`,e=>e.preventDefault());var ji;async function Mi(){`serviceWorker`in navigator&&(navigator.serviceWorker.register(`./sw.js`).catch(()=>{}),navigator.storage?.persist?.().catch(()=>!1));let e=Promise.all([Vt(),N.ready()]).catch(()=>{});document.getElementById(`pp-loading`)?.setAttribute(`data-done`,``),await Ti(Ai,e),t.unlock(),await e,t.enabled=Jt().sound;let n=Ht().length===1?Ht()[0]:void 0;n?Pi(n):Ni()}function Ni(){ji?.(),ji=void 0,fi(Ai,e=>Pi(e))}function Pi(e){ji?.(),ji=void 0,mi(Ai,Ut(e.id),t=>void Fi(Ut(e.id),t),()=>Ni())}async function Fi(e,t){let n,r=`art`in t?t.art:void 0;if(t.kind===`photo`){let e=await oi();if(!e)return;n={kind:`photo`,lines:e}}else if(t.kind===`art`){let e=t.art;if(e.page.startsWith(`pic:`)){let t=lt(e.page.slice(4));if(!t)return;n={kind:`picture`,picture:t}}else if(e.page===`photo`){let t=await N.lines(e);if(!t)return;n={kind:`photo`,lines:t}}else n={kind:`blank`}}else t.kind===`picture`?(n={kind:`picture`,picture:t.picture},r=t.art):n={kind:`blank`};ji?.(),ji=await ni(Ai,{profile:e,source:n,art:r,onExit:()=>{Xt(),Pi(e)}})}Mi();