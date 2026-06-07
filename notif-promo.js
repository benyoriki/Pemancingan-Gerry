/*!
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Pemancingan Gerry × Benyoriki.com — Smart Promo Notif v3  ║
 * ║  Tema: Fishing · Emerald · Ocean · Glassmorphism Modern    ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * - Tampil tiap 30 detik
 * - 8 notifikasi berganti otomatis
 * - Swipe kanan untuk tutup (mobile)
 * - Auto dismiss 12 detik
 * - Animasi masuk dari kiri bawah dengan spring bounce
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     INJECT CSS — FISHING THEME
  ══════════════════════════════════════ */
  var style = document.createElement('style');
  style.id  = 'pg-notif-style';
  style.textContent = `

    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@500;700&display=swap');

    /* ── STACK CONTAINER ── */
    #pg-notif-stack {
      position: fixed;
      bottom: 86px;
      left: 16px;
      z-index: 9500;
      display: flex;
      flex-direction: column-reverse;
      gap: 10px;
      pointer-events: none;
      width: 360px;
      max-width: calc(100vw - 32px);
    }

    /* ── CARD ── */
    .pg-card {
      position: relative;
      background: linear-gradient(
        135deg,
        rgba(7, 22, 14, 0.96) 0%,
        rgba(10, 28, 20, 0.94) 50%,
        rgba(7, 18, 28, 0.96) 100%
      );
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      border-radius: 20px;
      overflow: hidden;
      pointer-events: all;
      cursor: pointer;
      border: 1px solid rgba(16, 217, 126, 0.18);
      box-shadow:
        0 0 0 1px rgba(16,217,126,0.08),
        0 8px 32px rgba(0,0,0,0.65),
        0 20px 56px rgba(0,0,0,0.45),
        inset 0 1px 0 rgba(255,255,255,0.06);
      /* masuk dari kiri bawah */
      transform: translateX(calc(-100% - 32px)) translateY(20px) scale(0.88) rotate(-2deg);
      opacity: 0;
      transition:
        transform 0.6s cubic-bezier(0.34,1.5,0.64,1),
        opacity   0.4s ease,
        box-shadow 0.3s ease;
      will-change: transform, opacity;
      transform-origin: left bottom;
      font-family: 'DM Sans', sans-serif;
    }

    .pg-card.pg-show {
      transform: translateX(0) translateY(0) scale(1) rotate(0deg);
      opacity: 1;
    }
    .pg-card.pg-hide {
      transform: translateX(calc(-100% - 32px)) translateY(12px) scale(0.9);
      opacity: 0;
      transition:
        transform 0.38s cubic-bezier(0.4,0,0.6,1),
        opacity 0.28s ease;
    }
    .pg-card:hover {
      transform: translateX(8px) scale(1.02) !important;
      box-shadow:
        0 0 0 1.5px rgba(16,217,126,0.35),
        0 16px 48px rgba(0,0,0,0.7),
        0 0 60px rgba(16,217,126,0.08),
        inset 0 1px 0 rgba(255,255,255,0.09) !important;
      transition: transform 0.28s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.28s ease !important;
    }

    /* Neon border glow */
    .pg-card::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 21px;
      background: var(--pg-border, linear-gradient(135deg,rgba(16,217,126,0.4),rgba(14,165,233,0.3)));
      z-index: -1;
      opacity: 0;
      transition: opacity 0.5s;
    }
    .pg-card.pg-show::before {
      opacity: 1;
      animation: pg-border-pulse 4s ease-in-out infinite;
    }
    @keyframes pg-border-pulse {
      0%,100%{ opacity: 0.45; }
      50%{ opacity: 1; }
    }

    /* Ripple saat muncul */
    .pg-card.pg-show::after {
      content: '';
      position: absolute;
      left: -20px; bottom: -20px;
      width: 80px; height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16,217,126,0.18) 0%, transparent 70%);
      animation: pg-ripple-in 0.7s ease-out forwards;
      pointer-events: none;
      z-index: 0;
    }
    @keyframes pg-ripple-in {
      from { transform: scale(0); opacity: 1; }
      to   { transform: scale(4); opacity: 0; }
    }

    /* ── ACCENT BAR TOP ── */
    .pg-accent-bar {
      height: 3px;
      width: 100%;
      position: relative;
      z-index: 2;
    }
    .pg-accent-bar::after {
      content: '';
      position: absolute;
      top: 0; left: 8%; right: 8%;
      height: 14px;
      background: inherit;
      filter: blur(12px);
      opacity: 0.65;
      border-radius: 0 0 12px 12px;
    }

    /* ── WATER/NATURE BG PATTERN ── */
    .pg-nature-bg {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle at 85% 15%, rgba(16,217,126,0.04) 0%, transparent 55%),
        radial-gradient(circle at 10% 85%, rgba(14,165,233,0.04) 0%, transparent 50%),
        linear-gradient(rgba(16,217,126,.018) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16,217,126,.018) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 24px 24px, 24px 24px;
      pointer-events: none;
      z-index: 0;
    }

    /* ── AMBIENT GLOW ── */
    .pg-glow {
      position: absolute;
      top: -50px; right: -50px;
      width: 200px; height: 200px;
      border-radius: 50%;
      opacity: 0.06;
      pointer-events: none;
      filter: blur(48px);
      z-index: 0;
      animation: pg-glow-breathe 3.5s ease-in-out infinite;
    }
    @keyframes pg-glow-breathe {
      0%,100%{ opacity: 0.04; transform: scale(1); }
      50%{     opacity: 0.11; transform: scale(1.2); }
    }

    /* ── SHIMMER ── */
    .pg-shimmer {
      position: absolute; inset: 0;
      background: linear-gradient(
        110deg,
        transparent 30%,
        rgba(255,255,255,.025) 45%,
        rgba(255,255,255,.055) 50%,
        rgba(255,255,255,.025) 55%,
        transparent 70%
      );
      background-size: 300% 100%;
      animation: pg-shimmer 4.5s ease-in-out infinite;
      pointer-events: none;
      z-index: 1;
      border-radius: inherit;
    }
    @keyframes pg-shimmer {
      0%  { background-position: 240% center; }
      100%{ background-position: -240% center; }
    }

    /* ── WATER RIPPLE (dekorasi pojok) ── */
    .pg-water-rings {
      position: absolute;
      bottom: -12px; right: -12px;
      width: 80px; height: 80px;
      pointer-events: none;
      z-index: 1;
    }
    .pg-water-rings span {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(16,217,126,0.15);
      animation: pg-water 3s ease-out infinite;
    }
    .pg-water-rings span:nth-child(1){ width:30px;height:30px; top:25px;left:25px; animation-delay:0s; }
    .pg-water-rings span:nth-child(2){ width:55px;height:55px; top:12px;left:12px; animation-delay:.6s; }
    .pg-water-rings span:nth-child(3){ width:80px;height:80px; top:0;left:0;       animation-delay:1.2s; }
    @keyframes pg-water {
      0%  { transform: scale(0.5); opacity: 0.6; }
      100%{ transform: scale(1.1); opacity: 0; }
    }

    /* ── CLOSE BUTTON ── */
    .pg-close {
      position: absolute; top: 10px; right: 10px;
      width: 22px; height: 22px;
      border-radius: 50%;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      cursor: pointer;
      font-size: 9px; font-weight: 700;
      color: rgba(255,255,255,.3);
      display: flex; align-items: center; justify-content: center;
      transition: all .22s ease;
      z-index: 10;
    }
    .pg-close:hover {
      background: rgba(239,68,68,.2);
      color: #ff4d6a;
      border-color: rgba(239,68,68,.4);
      transform: scale(1.15) rotate(90deg);
    }

    /* ── COUNT BADGE ── */
    .pg-num-badge {
      position: absolute; top: -7px; right: -7px;
      width: 20px; height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10d97e, #0ea5e9);
      color: white; font-size: 9px; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid rgba(7,22,14,.95);
      z-index: 10;
      animation: pg-badge-pop .45s cubic-bezier(0.34,1.56,0.64,1);
      font-family: 'Space Mono', monospace;
    }
    @keyframes pg-badge-pop {
      from { transform: scale(0) rotate(-180deg); }
      to   { transform: scale(1) rotate(0deg); }
    }

    /* ── INNER LAYOUT ── */
    .pg-inner {
      padding: 13px 14px 10px;
      display: flex;
      gap: 11px;
      align-items: flex-start;
      position: relative;
      z-index: 2;
    }

    /* ── ICON ── */
    .pg-icon-wrap {
      width: 46px; height: 46px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
      position: relative;
      border: 1px solid rgba(255,255,255,.09);
    }
    .pg-icon-pulse {
      position: absolute; inset: -5px;
      border-radius: 19px; opacity: 0;
      animation: pg-icon-pulse 2.8s ease-in-out infinite;
    }
    @keyframes pg-icon-pulse {
      0%,100%{ transform: scale(1); opacity: 0; }
      50%{     transform: scale(1.22); opacity: 0.12; }
    }
    .pg-icon-ring {
      position: absolute; inset: -5px;
      border-radius: 19px;
      border: 1.5px dashed transparent;
      animation: pg-ring-spin 5s linear infinite;
    }
    @keyframes pg-ring-spin {
      from{ transform: rotate(0deg); }
      to{   transform: rotate(360deg); }
    }

    /* ── BODY ── */
    .pg-body { flex: 1; min-width: 0; }
    .pg-meta {
      display: flex; align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .pg-source {
      font-size: 9px; font-weight: 800;
      letter-spacing: 1.2px; text-transform: uppercase;
      display: flex; align-items: center; gap: 5px;
    }
    .pg-time {
      font-size: 9px;
      color: rgba(255,255,255,.25);
      font-family: 'Space Mono', monospace;
    }
    /* Live dot — fish-hook animasi 🎣 */
    .pg-live-dot {
      display: inline-block;
      width: 6px; height: 6px; border-radius: 50%;
      background: #10d97e;
      box-shadow: 0 0 7px #10d97e;
      flex-shrink: 0;
      animation: pg-live-blink 1.6s ease-in-out infinite;
    }
    @keyframes pg-live-blink {
      0%,100%{ opacity: 1; box-shadow: 0 0 7px #10d97e; }
      50%{     opacity: 0.3; box-shadow: 0 0 2px #10d97e; }
    }

    .pg-title {
      font-size: 13px; font-weight: 800;
      color: #e8fff4; line-height: 1.3;
      margin-bottom: 4px; letter-spacing: -.15px;
    }
    .pg-desc {
      font-size: 11px;
      color: rgba(200,230,215,.5);
      line-height: 1.65;
    }
    .pg-desc strong { color: rgba(220,255,235,.82); font-weight: 700; }

    /* Inline badge */
    .pg-badge {
      display: inline-flex; align-items: center; gap: 3px;
      font-size: 9px; font-weight: 800;
      padding: 2px 7px; border-radius: 99px;
      margin-left: 5px; vertical-align: middle;
      letter-spacing: .3px; white-space: nowrap;
      border: 1px solid;
    }

    /* ── STAT PILLS ── */
    .pg-stat-row {
      display: flex; gap: 6px; margin: 8px 0 2px; flex-wrap: wrap;
    }
    .pg-stat-pill {
      display: flex; align-items: center; gap: 4px;
      background: rgba(16,217,126,.04);
      border: 1px solid rgba(16,217,126,.1);
      border-radius: 9px; padding: 4px 9px;
    }
    .pg-pill-label {
      font-size: 8.5px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .6px; color: rgba(200,230,215,.38);
    }
    .pg-pill-val {
      font-family: 'Space Mono', monospace;
      font-size: 10px; font-weight: 700; color: #e8fff4;
    }
    .pg-pill-badge {
      font-size: 8.5px; font-weight: 800;
      padding: 1px 6px; border-radius: 99px; margin-left: 2px;
    }

    /* ── SOCIAL PROOF ── */
    .pg-proof {
      display: flex; align-items: center; gap: 7px;
      margin: 7px 0 2px;
    }
    .pg-avatars { display: flex; flex-shrink: 0; }
    .pg-av {
      width: 20px; height: 20px;
      border-radius: 50%;
      border: 2px solid rgba(7,22,14,.95);
      margin-left: -5px;
      font-size: 7.5px; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      color: white; flex-shrink: 0; text-transform: uppercase;
    }
    .pg-av:first-child { margin-left: 0; }
    .pg-proof-text { font-size: 10px; color: rgba(200,230,215,.3); line-height: 1.3; }
    .pg-proof-num  { color: rgba(220,255,235,.65); font-weight: 700; }

    /* ── DIVIDER ── */
    .pg-divider {
      height: 1px;
      background: linear-gradient(90deg,
        transparent,
        rgba(16,217,126,.12),
        rgba(14,165,233,.08),
        transparent
      );
      margin: 0 13px;
      position: relative; z-index: 2;
    }

    /* ── FOOTER ── */
    .pg-footer {
      padding: 9px 12px 13px;
      display: flex; gap: 7px;
      position: relative; z-index: 2;
    }
    .pg-cta {
      flex: 1; padding: 10px 12px;
      border-radius: 11px; font-size: 11.5px; font-weight: 800;
      border: none; cursor: pointer; color: white;
      transition: all .28s cubic-bezier(0.34,1.4,0.64,1);
      letter-spacing: .15px;
      position: relative; overflow: hidden;
      text-shadow: 0 1px 4px rgba(0,0,0,.4);
      font-family: 'DM Sans', sans-serif;
    }
    .pg-cta::before {
      content: '';
      position: absolute; top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
      transition: left .45s ease;
    }
    .pg-cta:hover::before { left: 100%; }
    .pg-cta:hover  { transform: translateY(-2px) scale(1.03); filter: brightness(1.1); }
    .pg-cta:active { transform: scale(0.97); }

    .pg-dismiss {
      padding: 10px 11px; border-radius: 11px;
      font-size: 11px; font-weight: 600;
      background: rgba(255,255,255,.04);
      border: 1px solid rgba(255,255,255,.07);
      cursor: pointer; color: rgba(200,230,215,.28);
      transition: all .22s ease; white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
    }
    .pg-dismiss:hover {
      background: rgba(255,255,255,.08);
      color: rgba(200,230,215,.6);
      border-color: rgba(255,255,255,.15);
    }

    /* ── TIMER BAR ── */
    .pg-timer-bar {
      position: absolute; bottom: 0; left: 0;
      height: 2.5px; border-radius: 0 0 20px 20px;
      animation: pg-drain var(--pg-life,12s) linear forwards;
      z-index: 10;
    }
    @keyframes pg-drain { from{width:100%;} to{width:0%;} }

    /* ── PARTICLES ── */
    .pg-particle {
      position: absolute; width: 3.5px; height: 3.5px;
      border-radius: 50%; pointer-events: none; z-index: 20;
      animation: pg-burst .85s ease-out forwards;
    }
    @keyframes pg-burst {
      0%  { transform:translate(0,0) scale(1.2); opacity:1; }
      100%{ transform:translate(var(--pdx),var(--pdy)) scale(0); opacity:0; }
    }

    /* ── FISH SWIM DECORATION ── */
    .pg-fish-deco {
      position: absolute;
      bottom: 36px; left: -28px;
      font-size: 14px; opacity: 0;
      pointer-events: none; z-index: 1;
      animation: pg-fish-swim 1.8s 0.4s ease-out forwards;
      filter: drop-shadow(0 0 4px rgba(16,217,126,0.5));
    }
    @keyframes pg-fish-swim {
      0%  { transform: translateX(0) scaleX(-1); opacity: 0; }
      40% { opacity: 0.7; }
      100%{ transform: translateX(420px) scaleX(-1); opacity: 0; }
    }

    /* ── MOBILE ── */
    @media (max-width: 480px) {
      #pg-notif-stack {
        bottom: 72px;
        left: 10px; right: 10px;
        width: auto;
      }
      .pg-card { border-radius: 17px; }
      .pg-title { font-size: 12.5px; }
      .pg-desc  { font-size: 10.5px; }
      .pg-cta   { font-size: 11px; padding: 9px 10px; }
      .pg-icon-wrap { width: 40px; height: 40px; font-size: 20px; }
      .pg-inner { padding: 11px 11px 8px; }
      .pg-stat-row { gap: 5px; }
    }

    /* Stack collapse saat scroll */
    #pg-notif-stack.pg-collapsed .pg-card:not(:first-child) {
      transform: translateX(0) scale(0.95) translateY(6px) !important;
      opacity: 0.4 !important;
      pointer-events: none;
    }

  `;
  document.head.appendChild(style);

  /* ══════════════════════════════════════
     CONFIG
  ══════════════════════════════════════ */
  var CFG = {
    url         : 'https://benyoriki.com/',
    intervalSec : 30,   /* Tampil tiap 30 detik */
    firstDelay  : 5,    /* Pertama kali muncul setelah 5 detik */
    lifeSec     : 12,   /* Auto dismiss setelah 12 detik */
    maxStack    : 3,
  };

  /* ══════════════════════════════════════
     8 NOTIFIKASI — KONTEKS BENYORIKI.COM
     disesuaikan gaya Pemancingan Gerry
  ══════════════════════════════════════ */
  var NOTIFS = [

    /* 1 — Website Bisnis Siap Cepat */
    {
      accent   : 'linear-gradient(90deg,#10d97e,#0ea5e9)',
      border   : 'linear-gradient(135deg,rgba(16,217,126,.5),rgba(14,165,233,.35))',
      glow     : '#10d97e',
      iconBg   : 'linear-gradient(135deg,rgba(16,217,126,.18),rgba(14,165,233,.12))',
      iconPls  : 'linear-gradient(135deg,#10d97e,#0ea5e9)',
      iconBdr  : 'rgba(16,217,126,.4)',
      iconRing : 'rgba(16,217,126,.55)',
      emoji    : '🚀',
      src      : 'BENYORIKI.COM · PROMO',
      srcClr   : '#10d97e',
      badge    : '⚡ Mulai Rp 200rb',
      badgeBg  : 'rgba(16,217,126,.14)',
      badgeClr : '#6ee7b7',
      title    : 'Website Bisnis Siap 2–6 Hari Kerja!',
      desc     : 'Kasir online, toko digital, dashboard real-time — <strong>demo dulu baru bayar.</strong> Tidak suka? Tidak bayar sepeser pun!',
      pills    : [
        { label:'BASIC', val:'Rp 200rb', badge:'Landing Page', bg:'rgba(16,217,126,.12)',  clr:'#10d97e' },
        { label:'PRO',   val:'Rp 3jt',   badge:'Kasir+DB',    bg:'rgba(14,165,233,.12)',  clr:'#7dd3fc' },
      ],
      proof    : ['R','A','T'], proofClr:['#10d97e','#0ea5e9','#34d399'],
      proofTxt : '<span class="pg-proof-num">127 UMKM</span> sudah minta penawaran hari ini',
      cta      : '🎯 Konsultasi Gratis Sekarang →',
      ctaBg    : 'linear-gradient(135deg,#059669,#10d97e)',
      ctaShd   : 'rgba(16,217,126,.4)',
      timer    : 'linear-gradient(90deg,#10d97e,#0ea5e9)',
      fish     : '🐟',
    },

    /* 2 — Demo Dulu Baru Bayar */
    {
      accent   : 'linear-gradient(90deg,#0ea5e9,#6366f1)',
      border   : 'linear-gradient(135deg,rgba(14,165,233,.5),rgba(99,102,241,.35))',
      glow     : '#0ea5e9',
      iconBg   : 'linear-gradient(135deg,rgba(14,165,233,.18),rgba(99,102,241,.12))',
      iconPls  : 'linear-gradient(135deg,#0ea5e9,#6366f1)',
      iconBdr  : 'rgba(14,165,233,.4)',
      iconRing : 'rgba(14,165,233,.55)',
      emoji    : '👁️',
      src      : 'BENYORIKI · GARANSI',
      srcClr   : '#38bdf8',
      badge    : '✅ Zero Risk',
      badgeBg  : 'rgba(14,165,233,.13)',
      badgeClr : '#7dd3fc',
      title    : 'Lihat Demo Dulu, Baru Bayar!',
      desc     : 'Tidak suka hasilnya? <strong>Tidak perlu bayar sepeser pun.</strong> Bayar 50% di muka, sisanya setelah Anda puas dan setuju.',
      pills    : [
        { label:'PROSES', val:'2–6 Hari', badge:'Kerja',      bg:'rgba(14,165,233,.1)',  clr:'#38bdf8' },
        { label:'REVISI', val:'Gratis',   badge:'Sampai Puas',bg:'rgba(16,217,126,.1)',  clr:'#10d97e' },
      ],
      proof    : ['K','L','M'], proofClr:['#0ea5e9','#38bdf8','#7dd3fc'],
      proofTxt : '<span class="pg-proof-num">100% klien</span> tidak ada yang tidak puas',
      cta      : '👁️ Lihat Demo Website Sekarang →',
      ctaBg    : 'linear-gradient(135deg,#0369a1,#0ea5e9)',
      ctaShd   : 'rgba(14,165,233,.4)',
      timer    : 'linear-gradient(90deg,#0ea5e9,#6366f1)',
      fish     : '🐠',
    },

    /* 3 — Kasir Online Realtime */
    {
      accent   : 'linear-gradient(90deg,#f59e0b,#ef4444)',
      border   : 'linear-gradient(135deg,rgba(245,158,11,.5),rgba(239,68,68,.35))',
      glow     : '#f59e0b',
      iconBg   : 'linear-gradient(135deg,rgba(245,158,11,.18),rgba(239,68,68,.12))',
      iconPls  : 'linear-gradient(135deg,#f59e0b,#ef4444)',
      iconBdr  : 'rgba(245,158,11,.4)',
      iconRing : 'rgba(245,158,11,.55)',
      emoji    : '🖥️',
      src      : 'BENYORIKI · KASIR ONLINE',
      srcClr   : '#fbbf24',
      badge    : '📊 Real-Time',
      badgeBg  : 'rgba(245,158,11,.13)',
      badgeClr : '#fcd34d',
      title    : 'Kasir Online + Dashboard Real-Time!',
      desc     : 'Pantau stok, omzet, dan laba <strong>langsung dari HP Anda.</strong> Cocok untuk warung, toko, pemancingan, hingga UMKM skala besar.',
      pills    : [
        { label:'FITUR',  val:'Lengkap',  badge:'Multi-Role',  bg:'rgba(245,158,11,.1)', clr:'#fbbf24' },
        { label:'AKSES',  val:'Dari HP',  badge:'Real-Time',   bg:'rgba(239,68,68,.1)',  clr:'#f87171' },
      ],
      proof    : ['W','D','S'], proofClr:['#f59e0b','#ef4444','#fbbf24'],
      proofTxt : '<span class="pg-proof-num">Puluhan usaha</span> sudah pakai kasir online ini',
      cta      : '🖥️ Coba Demo Kasir Gratis →',
      ctaBg    : 'linear-gradient(135deg,#b45309,#f59e0b)',
      ctaShd   : 'rgba(245,158,11,.4)',
      timer    : 'linear-gradient(90deg,#f59e0b,#ef4444)',
      fish     : '🎣',
    },

    /* 4 — Toko Digital WhatsApp */
    {
      accent   : 'linear-gradient(90deg,#25D366,#10d97e)',
      border   : 'linear-gradient(135deg,rgba(37,211,102,.5),rgba(16,217,126,.35))',
      glow     : '#25D366',
      iconBg   : 'linear-gradient(135deg,rgba(37,211,102,.18),rgba(16,217,126,.12))',
      iconPls  : 'linear-gradient(135deg,#25D366,#10d97e)',
      iconBdr  : 'rgba(37,211,102,.4)',
      iconRing : 'rgba(37,211,102,.55)',
      emoji    : '🛒',
      src      : 'BENYORIKI · TOKO DIGITAL',
      srcClr   : '#34d399',
      badge    : '💬 Terintegrasi WA',
      badgeBg  : 'rgba(37,211,102,.13)',
      badgeClr : '#6ee7b7',
      title    : 'Toko Digital Terintegrasi WhatsApp!',
      desc     : 'Terima order otomatis, notifikasi WA langsung, stok update sendiri. <strong>Pelanggan pesan dari HP, Anda langsung tahu!</strong>',
      pills    : [
        { label:'ORDER',  val:'Otomatis', badge:'Via WA',       bg:'rgba(37,211,102,.1)', clr:'#34d399' },
        { label:'NOTIF',  val:'Instan',   badge:'Real-Time',    bg:'rgba(16,217,126,.1)', clr:'#10d97e' },
      ],
      proof    : ['F','O','D'], proofClr:['#25D366','#34d399','#6ee7b7'],
      proofTxt : '<span class="pg-proof-num">Banyak toko</span> sudah beralih ke sistem ini',
      cta      : '🛒 Lihat Demo Toko Digital →',
      ctaBg    : 'linear-gradient(135deg,#047857,#25D366)',
      ctaShd   : 'rgba(37,211,102,.4)',
      timer    : 'linear-gradient(90deg,#25D366,#10d97e)',
      fish     : '🐡',
    },

    /* 5 — Harga Spesial UMKM */
    {
      accent   : 'linear-gradient(90deg,#a855f7,#ec4899)',
      border   : 'linear-gradient(135deg,rgba(168,85,247,.5),rgba(236,72,153,.35))',
      glow     : '#a855f7',
      iconBg   : 'linear-gradient(135deg,rgba(168,85,247,.18),rgba(236,72,153,.12))',
      iconPls  : 'linear-gradient(135deg,#a855f7,#ec4899)',
      iconBdr  : 'rgba(168,85,247,.4)',
      iconRing : 'rgba(168,85,247,.55)',
      emoji    : '💎',
      src      : 'BENYORIKI · HARGA SPESIAL',
      srcClr   : '#c084fc',
      badge    : '🔥 Termurah',
      badgeBg  : 'rgba(168,85,247,.13)',
      badgeClr : '#e879f9',
      title    : 'Website Pro Mulai Rp 200rb Saja!',
      desc     : '<strong>Basic Rp 200rb</strong> landing page · <strong>Standar Rp 1.2jt</strong> toko · <strong>Pro Rp 3jt</strong> kasir+dashboard. Harga UMKM-friendly!',
      pills    : [
        { label:'BASIC',   val:'Rp 200rb', badge:'Landing',  bg:'rgba(168,85,247,.1)',  clr:'#c084fc' },
        { label:'STANDAR', val:'Rp 1.2jt', badge:'Toko+WA', bg:'rgba(236,72,153,.1)',  clr:'#f472b6' },
      ],
      proof    : ['B','P','Q'], proofClr:['#a855f7','#ec4899','#c084fc'],
      proofTxt : '<span class="pg-proof-num">Harga terjangkau</span> untuk semua skala bisnis',
      cta      : '💎 Lihat Paket Harga Lengkap →',
      ctaBg    : 'linear-gradient(135deg,#7e22ce,#a855f7)',
      ctaShd   : 'rgba(168,85,247,.42)',
      timer    : 'linear-gradient(90deg,#a855f7,#ec4899)',
      fish     : '🐟',
    },

    /* 6 — Login Multi-Role & Chat Internal */
    {
      accent   : 'linear-gradient(90deg,#06b6d4,#10d97e)',
      border   : 'linear-gradient(135deg,rgba(6,182,212,.5),rgba(16,217,126,.35))',
      glow     : '#06b6d4',
      iconBg   : 'linear-gradient(135deg,rgba(6,182,212,.18),rgba(16,217,126,.12))',
      iconPls  : 'linear-gradient(135deg,#06b6d4,#10d97e)',
      iconBdr  : 'rgba(6,182,212,.4)',
      iconRing : 'rgba(6,182,212,.55)',
      emoji    : '👥',
      src      : 'BENYORIKI · SISTEM LOGIN',
      srcClr   : '#22d3ee',
      badge    : '🔐 Multi-Role',
      badgeBg  : 'rgba(6,182,212,.13)',
      badgeClr : '#67e8f9',
      title    : 'Sistem Login Multi-Role + Chat Tim!',
      desc     : 'Admin, kasir, gudang — <strong>akses berbeda, data aman.</strong> Dilengkapi chat internal antar staf tanpa perlu WA pribadi.',
      pills    : [
        { label:'ROLE',  val:'Multi-Level', badge:'Aman',     bg:'rgba(6,182,212,.1)',  clr:'#22d3ee' },
        { label:'CHAT',  val:'Internal',    badge:'Real-Time',bg:'rgba(16,217,126,.1)', clr:'#10d97e' },
      ],
      proof    : ['N','C','H'], proofClr:['#06b6d4','#22d3ee','#67e8f9'],
      proofTxt : '<span class="pg-proof-num">Tim solid</span> dikelola lebih mudah dengan sistem ini',
      cta      : '👥 Lihat Demo Sistem Login →',
      ctaBg    : 'linear-gradient(135deg,#0e7490,#06b6d4)',
      ctaShd   : 'rgba(6,182,212,.4)',
      timer    : 'linear-gradient(90deg,#06b6d4,#10d97e)',
      fish     : '🐠',
    },

    /* 7 — Gratis Konsultasi by Riki Hermawan */
    {
      accent   : 'linear-gradient(90deg,#10d97e,#fbbf24)',
      border   : 'linear-gradient(135deg,rgba(16,217,126,.5),rgba(251,191,36,.35))',
      glow     : '#10d97e',
      iconBg   : 'linear-gradient(135deg,rgba(16,217,126,.18),rgba(251,191,36,.12))',
      iconPls  : 'linear-gradient(135deg,#10d97e,#fbbf24)',
      iconBdr  : 'rgba(16,217,126,.4)',
      iconRing : 'rgba(251,191,36,.55)',
      emoji    : '🧑‍💻',
      src      : 'BENYORIKI · BY RIKI S.KOM',
      srcClr   : '#10d97e',
      badge    : '🎓 S.Kom Expert',
      badgeBg  : 'rgba(16,217,126,.13)',
      badgeClr : '#6ee7b7',
      title    : 'Konsultasi Gratis dengan Riki Hermawan!',
      desc     : 'Real-Time Web System Specialist. <strong>WA langsung: +62 898-8995-637.</strong> Ceritakan kebutuhan bisnis Anda, solusi siap dalam 10 menit!',
      pills    : [
        { label:'RESPON',  val:'< 10 Mnt', badge:'Cepat',    bg:'rgba(16,217,126,.1)',  clr:'#10d97e' },
        { label:'KONSUL',  val:'GRATIS',   badge:'No Hidden', bg:'rgba(251,191,36,.1)',  clr:'#fbbf24' },
      ],
      proof    : ['R','I','K'], proofClr:['#10d97e','#fbbf24','#34d399'],
      proofTxt : '<span class="pg-proof-num">Riki S.Kom</span> siap bantu bisnis Anda berkembang',
      cta      : '🧑‍💻 Hubungi Riki via WhatsApp →',
      ctaBg    : 'linear-gradient(135deg,#065f46,#10d97e)',
      ctaShd   : 'rgba(16,217,126,.42)',
      timer    : 'linear-gradient(90deg,#10d97e,#fbbf24)',
      fish     : '🎣',
    },

    /* 8 — Portofolio Live */
    {
      accent   : 'linear-gradient(90deg,#0ea5e9,#10d97e)',
      border   : 'linear-gradient(135deg,rgba(14,165,233,.5),rgba(16,217,126,.35))',
      glow     : '#0ea5e9',
      iconBg   : 'linear-gradient(135deg,rgba(14,165,233,.18),rgba(16,217,126,.12))',
      iconPls  : 'linear-gradient(135deg,#0ea5e9,#10d97e)',
      iconBdr  : 'rgba(14,165,233,.4)',
      iconRing : 'rgba(14,165,233,.55)',
      emoji    : '🏆',
      src      : 'BENYORIKI · PORTOFOLIO LIVE',
      srcClr   : '#38bdf8',
      badge    : '⭐ 8+ Website Live',
      badgeBg  : 'rgba(14,165,233,.13)',
      badgeClr : '#7dd3fc',
      title    : 'Lihat Portofolio Nyata — Bisa Dicoba!',
      desc     : 'Bukan cuma screenshot — <strong>website asli bisa Anda akses sekarang.</strong> Tattoo studio, frozen food, toko aqua, es teler & lainnya.',
      pills    : [
        { label:'PROYEK', val:'8+ Live', badge:'Bisa Coba', bg:'rgba(14,165,233,.1)',  clr:'#38bdf8' },
        { label:'KLIEN',  val:'100% Puas', badge:'Garansi', bg:'rgba(16,217,126,.1)',  clr:'#10d97e' },
      ],
      proof    : ['J','D','O'], proofClr:['#0ea5e9','#38bdf8','#7dd3fc'],
      proofTxt : '<span class="pg-proof-num">8 website live</span> bisa diakses dan dicoba langsung',
      cta      : '🌐 Lihat Portofolio Live →',
      ctaBg    : 'linear-gradient(135deg,#0369a1,#0ea5e9)',
      ctaShd   : 'rgba(14,165,233,.42)',
      timer    : 'linear-gradient(90deg,#0ea5e9,#10d97e)',
      fish     : '🐡',
    },

  ];

  /* ══════════════════════════════════════
     STATE
  ══════════════════════════════════════ */
  var idx = 0, countdown = CFG.intervalSec, num = 0;
  var stack = document.getElementById('pg-notif-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'pg-notif-stack';
    document.body.appendChild(stack);
  }

  /* ══════════════════════════════════════
     PARTICLES
  ══════════════════════════════════════ */
  function burst(card, color) {
    for (var i = 0; i < 7; i++) {
      var p   = document.createElement('div');
      p.className = 'pg-particle';
      var ang = (360 / 7) * i;
      var d   = 26 + Math.random() * 20;
      p.style.cssText =
        'background:' + color + ';' +
        'box-shadow:0 0 5px ' + color + ';' +
        'left:22px;top:22px;' +
        '--pdx:' + (Math.cos(ang * Math.PI / 180) * d) + 'px;' +
        '--pdy:' + (Math.sin(ang * Math.PI / 180) * d) + 'px;' +
        'animation-delay:' + (Math.random() * 0.08) + 's';
      card.appendChild(p);
      setTimeout(function(el){ el.remove(); }, 900, p);
    }
  }

  /* ══════════════════════════════════════
     BUILD PILLS HTML
  ══════════════════════════════════════ */
  function pillsHTML(pills) {
    if (!pills || !pills.length) return '';
    var items = pills.map(function(p) {
      return '<div class="pg-stat-pill">' +
        '<span class="pg-pill-label">' + p.label + '</span>' +
        '<span class="pg-pill-val">' + p.val + '</span>' +
        '<span class="pg-pill-badge" style="background:' + p.bg + ';color:' + p.clr + '">' + p.badge + '</span>' +
        '</div>';
    }).join('');
    return '<div class="pg-stat-row">' + items + '</div>';
  }

  /* ══════════════════════════════════════
     BUILD CARD HTML
  ══════════════════════════════════════ */
  function buildCard(d, n) {
    var avs = d.proof.map(function(l, i) {
      return '<div class="pg-av" style="background:' + d.proofClr[i] + ';box-shadow:0 0 6px ' + d.proofClr[i] + '66">' + l + '</div>';
    }).join('');

    return [
      '<div class="pg-glow" style="background:' + d.glow + '"></div>',
      '<div class="pg-nature-bg"></div>',
      '<div class="pg-shimmer"></div>',
      '<div class="pg-water-rings"><span></span><span></span><span></span></div>',
      '<div class="pg-accent-bar" style="background:' + d.accent + '"></div>',
      /* ikan kecil berenang */
      '<div class="pg-fish-deco">' + (d.fish || '🐟') + '</div>',
      '<button class="pg-close" aria-label="Tutup">✕</button>',
      n > 1 ? '<div class="pg-num-badge">' + n + '</div>' : '',
      '<div class="pg-inner">',
        '<div class="pg-icon-wrap" style="background:' + d.iconBg + ';border-color:' + d.iconBdr + '">',
          '<div class="pg-icon-pulse" style="background:' + d.iconPls + '"></div>',
          '<div class="pg-icon-ring" style="border-color:' + d.iconRing + '"></div>',
          d.emoji,
        '</div>',
        '<div class="pg-body">',
          '<div class="pg-meta">',
            '<span class="pg-source" style="color:' + d.srcClr + '"><span class="pg-live-dot"></span>' + d.src + '</span>',
            '<span class="pg-time">Baru saja</span>',
          '</div>',
          '<div class="pg-title">' + d.title +
            '<span class="pg-badge" style="background:' + d.badgeBg + ';color:' + d.badgeClr + ';border-color:' + d.badgeClr + '44">' + d.badge + '</span>' +
          '</div>',
          '<div class="pg-desc">' + d.desc + '</div>',
          pillsHTML(d.pills),
          '<div class="pg-proof">',
            '<div class="pg-avatars">' + avs + '</div>',
            '<span class="pg-proof-text">' + d.proofTxt + '</span>',
          '</div>',
        '</div>',
      '</div>',
      '<div class="pg-divider"></div>',
      '<div class="pg-footer">',
        '<button class="pg-cta" style="background:' + d.ctaBg + ';box-shadow:0 5px 18px ' + d.ctaShd + '">' + d.cta + '</button>',
        '<button class="pg-dismiss">Nanti</button>',
      '</div>',
      '<div class="pg-timer-bar" style="background:' + d.timer + ';--pg-life:' + CFG.lifeSec + 's"></div>',
    ].join('');
  }

  /* ══════════════════════════════════════
     NAVIGATE
  ══════════════════════════════════════ */
  function navigate() {
    window.open(CFG.url, '_blank', 'noopener,noreferrer');
  }

  /* ══════════════════════════════════════
     DISMISS
  ══════════════════════════════════════ */
  function dismiss(card) {
    if (!card || !card.parentNode) return;
    card.classList.remove('pg-show');
    card.classList.add('pg-hide');
    setTimeout(function() { if (card.parentNode) card.remove(); }, 430);
  }

  /* ══════════════════════════════════════
     SHOW
  ══════════════════════════════════════ */
  function show() {
    var d = NOTIFS[idx % NOTIFS.length];
    idx++; num++;

    var existing = stack.querySelectorAll('.pg-card');
    if (existing.length >= CFG.maxStack) dismiss(existing[existing.length - 1]);

    var card = document.createElement('div');
    card.className = 'pg-card';
    card.setAttribute('role', 'alert');
    card.setAttribute('aria-live', 'polite');
    card.style.setProperty('--pg-border', d.border);
    card.innerHTML = buildCard(d, num);
    stack.prepend(card);

    /* Animasi masuk */
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        card.classList.add('pg-show');
        setTimeout(function() { burst(card, d.glow); }, 300);
      });
    });

    /* Events */
    card.addEventListener('click', function(e) {
      if (!e.target.closest('button')) { navigate(); dismiss(card); }
    });
    card.querySelector('.pg-cta').addEventListener('click', function(e) {
      e.stopPropagation(); navigate(); dismiss(card);
    });
    card.querySelector('.pg-dismiss').addEventListener('click', function(e) {
      e.stopPropagation(); dismiss(card);
    });
    card.querySelector('.pg-close').addEventListener('click', function(e) {
      e.stopPropagation(); dismiss(card);
    });

    /* Swipe kiri untuk dismiss (mobile) */
    var sx = 0;
    card.addEventListener('touchstart', function(e) {
      sx = e.touches[0].clientX;
    }, { passive: true });
    card.addEventListener('touchend', function(e) {
      /* swipe kiri (berlawanan arah masuk dari kiri) */
      if (sx - e.changedTouches[0].clientX > 64) dismiss(card);
    }, { passive: true });

    /* Auto dismiss */
    setTimeout(function() { dismiss(card); }, CFG.lifeSec * 1000);
    countdown = CFG.intervalSec;
  }

  /* ══════════════════════════════════════
     TICK SYSTEM — 30 DETIK
  ══════════════════════════════════════ */
  var tickTimer = null;
  function tick()      { if (--countdown <= 0) show(); }
  function startTick() { if (!tickTimer) tickTimer = setInterval(tick, 1000); }
  function stopTick()  { clearInterval(tickTimer); tickTimer = null; }

  document.addEventListener('visibilitychange', function() {
    document.hidden ? stopTick() : startTick();
  });

  /* Scroll — collapse stack saat scroll naik */
  var lastY = 0;
  window.addEventListener('scroll', function() {
    var y = window.scrollY || window.pageYOffset;
    stack.classList.toggle('pg-collapsed', y < lastY && y > 150);
    lastY = y;
  }, { passive: true });

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  function init() {
    setTimeout(show, CFG.firstDelay * 1000);
    startTick();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

}());
