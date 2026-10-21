
'use strict';
// Atualize os dados abaixo com informações e fotografias confirmadas pela igreja.
const conteudo = {
  programacao: [
  {
    "dia": "Segunda-feira · 19/10",
    "encontro": "Consagração",
    "horario": "07:30"
  },
  {
    "dia": "Segunda-feira · 19/10",
    "encontro": "Círculo de oração",
    "horario": "19:30"
  },
  {
    "dia": "Terça-feira · 20/10",
    "encontro": "Culto de doutrina na sede",
    "horario": "19:00"
  },
  {
    "dia": "Quarta-feira · 21/10",
    "encontro": "GV Mulheres agraciadas",
    "horario": "19:00"
  },{"dia":"Quarta-feira · 21/10","encontro":"GV Alfa e Metanoia","horario":"19:00"},
  {
    "dia": "Quinta-feira · 22/10",
    "encontro": "Círculo de oração na sede",
    "horario": "14:00"
  },
  {
    "dia": "Quinta-feira · 22/10",
    "encontro": "Culto de doutrina",
    "horario": "19:15"
  },
{
    "dia": "Domingo · 25/10",
    "encontro": "Culto de celebração",
    "horario": "09:00"
  }
],
  fotos: [
    { arquivo: '../imagens/imagem-5.jpg', descricao: 'Juventude em comunhão na igreja' },
    { arquivo: '../imagens/imagem-6.jpg', descricao: 'Encontro da juventude na congregação' },
    { arquivo: '../imagens/imagem-7.jpg', descricao: 'Encontro da comunidade ao ar livre' },
    { arquivo: '../imagens/imagem-8.jpg', descricao: 'Comunhão na Congregação da Serrinha' }
  ]
};

const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('#menu');
menuButton.hidden = false;
menu.dataset.enhanced = 'true';
function fecharMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const aberto = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(aberto));
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) fecharMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    fecharMenu();
    menuButton.focus();
  }
});
document.querySelector('#ano').textContent = new Date().getFullYear();

const agenda = document.querySelector('#agenda');
if (agenda) agenda.replaceChildren(...conteudo.programacao.map(item => {
  const row = document.createElement('tr');
  ['encontro', 'dia', 'horario'].forEach((campo, index) => {
    const cell = document.createElement(index === 0 ? 'th' : 'td');
    if (index === 0) cell.scope = 'row';
    cell.textContent = item[campo];
    row.append(cell);
  });
  return row;
}));

const dialog = document.querySelector('#lightbox');
const imagem = document.querySelector('#foto-ampliada');
const legenda = document.querySelector('#legenda');
const galeria = document.querySelector('#fotos');
let ultimoBotao;
const agendaPosterButton = document.querySelector('#ampliar-agenda');
if (agendaPosterButton) agendaPosterButton.hidden = false;
agendaPosterButton?.addEventListener('click', () => {
 ultimoBotao = agendaPosterButton;
 imagem.src = agendaPosterButton.querySelector('img').src;
 imagem.alt = 'Cartaz da agenda semanal';
 legenda.textContent = 'Agenda semanal · 19 a 25 de outubro de 2026.';
 dialog.showModal();
});
if (galeria && conteudo.fotos.length) {
  galeria.replaceChildren(...conteudo.fotos.map(foto => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Ampliar: ${foto.descricao}`);
    const img = document.createElement('img');
    img.src = foto.arquivo;
    img.alt = foto.descricao;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 1600;
    img.height = 900;
    const caption = document.createElement('span');
    caption.textContent = foto.descricao;
    button.append(img, caption);
    button.addEventListener('click', () => {
      ultimoBotao = button;
      imagem.src = foto.arquivo;
      imagem.alt = foto.descricao;
      legenda.textContent = foto.descricao;
      dialog.showModal();
    });
    return button;
  }));
  galeria.nextElementSibling.hidden = true;
}
dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => ultimoBotao?.focus());

// Présentation compacte des horaires sur mobile, en conservant les tableaux sans JavaScript.
document.querySelectorAll('.schedule-wrap').forEach(wrap => {
  const table = wrap.querySelector('table');
  const list = document.createElement('ul');
  list.className = 'mobile-schedule';
  list.setAttribute('aria-label', table.caption?.textContent || 'Programmation');
  const radio = Boolean(wrap.closest('#radio'));
  table.querySelectorAll('tbody tr').forEach(row => {
    const cells = [...row.children].map(cell => cell.textContent.trim());
    const item = document.createElement('li');
    const title = document.createElement('h3');
    title.textContent = radio ? cells[1] : cells[0];
    const details = document.createElement('p');
    const hour = document.createElement('span');
    hour.className = 'schedule-time';
    hour.textContent = radio ? cells[0] : cells[2];
    const description = document.createElement('span');
    description.textContent = radio ? cells[2] : cells[1];
    details.append(hour);
    details.append(description);
    item.append(title, details);
    list.append(item);
  });
  wrap.append(list);
  wrap.classList.add('has-mobile-list');
});

// Anima cada seção uma vez, sem ocultar conteúdo quando JavaScript não estiver disponível.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let sectionObserver;
const motionTargets = [...document.querySelectorAll('main > section:not(.hero), .welcome-strip')];
function configureMotion() {
  sectionObserver?.disconnect();
  motionTargets.forEach(element => element.classList.remove('motion-enter'));
  if (motionPreference.matches || !('IntersectionObserver' in window)) return;
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-enter');
      sectionObserver.unobserve(entry.target);
    });
  }, {threshold: 0, rootMargin: '0px 0px -40px 0px'});
  motionTargets.forEach(element => sectionObserver.observe(element));
}
configureMotion();
motionPreference.addEventListener('change', configureMotion);
const siteHeader = document.querySelector('.header');
let headerFramePending = false;
function updateHeaderDepth() {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
  headerFramePending = false;
}
window.addEventListener('scroll', () => {
  if (headerFramePending) return;
  headerFramePending = true;
  requestAnimationFrame(updateHeaderDepth);
}, {passive:true});
updateHeaderDepth();
// Entrada em sequência dos cartões, fotos e horários.
document.querySelectorAll('.group-grid, .gallery, .mobile-schedule').forEach(group => {
  [...group.children].forEach((item, index) => item.style.setProperty('--entry-delay', `${Math.min(index, 4) * 110}ms`));
});

/* ================= ANIMAÇÕES AMPLIADAS ================= */
(function () {
  try {
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    const hero = document.querySelector('.hero');
    const heroArt = document.querySelector('.hero-art');
    const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

    // ---------- Barra de progresso + voltar ao topo + parallax ----------
    document.body.prepend(mk('div', 'scroll-progress'));
    const toTop = mk('button', 'to-top', '<span aria-hidden="true">↑</span>');
    toTop.type = 'button';
    toTop.setAttribute('aria-label', 'Voltar ao topo');
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    document.body.append(toTop);
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = root.scrollHeight - innerHeight;
        root.style.setProperty('--p', (max > 0 ? Math.min(y / max, 1) : 0).toFixed(4));
        toTop.classList.toggle('show', y > 650);
        if (!reduced && heroArt) heroArt.style.setProperty('--sy', (-Math.min(y, 800) * 0.07).toFixed(1) + 'px');
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    // ---------- Menu: ícone, itens em sequência e destaque da seção atual ----------
    const menu = document.querySelector('#menu');
    const menuButton = document.querySelector('.menu-button');
    const menuIcon = menuButton && menuButton.querySelector('span');
    menu.querySelectorAll('a').forEach((a, i) => a.style.setProperty('--i', i));
    if (menuIcon) {
      new MutationObserver(() => { menuIcon.textContent = menu.classList.contains('open') ? '✕' : '☰'; })
        .observe(menu, { attributes: true, attributeFilter: ['class'] });
    }
    const links = new Map([...menu.querySelectorAll('a[href^="#"]')].map(a => [a.getAttribute('href').slice(1), a]));
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        const a = links.get(e.target.id);
        if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
      }), { rootMargin: '-45% 0px -50% 0px' });
      ['inicio', ...links.keys()].forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
    }

    // ---------- Faixa em movimento (decorativa) ----------
    const strip = document.querySelector('.welcome-strip');
    if (strip) {
      const set = ['AMAR', 'ACOLHER', 'SERVIR', 'RESTAURAÇÃO', 'MISERICÓRDIA', 'ENSINO'].map(t => `<span>${t}</span>`).join('');
      const half = set + set;
      strip.insertAdjacentElement('afterend', mk('div', 'marquee', `<div class="marquee-track">${half}${half}</div>`)).setAttribute('aria-hidden', 'true');
    }

    // ---------- Mapa: toque para ativar ----------
    const mapBox = document.querySelector('.map-box');
    if (mapBox) {
      mapBox.addEventListener('click', () => mapBox.classList.add('active'));
      document.addEventListener('click', e => { if (!mapBox.contains(e.target)) mapBox.classList.remove('active'); });
    }

    // ---------- Botões: ondulação ao clicar + efeito magnético ----------
    document.querySelectorAll('.button').forEach(b => {
      b.addEventListener('pointerdown', e => {
        if (reduced) return;
        const r = b.getBoundingClientRect();
        const s = Math.max(r.width, r.height) * 2;
        const el = mk('span', 'ripple');
        el.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
        b.append(el);
        el.addEventListener('animationend', () => el.remove());
      });
      if (fine && !reduced) {
        b.addEventListener('pointermove', e => {
          const r = b.getBoundingClientRect();
          b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
          b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
        });
        b.addEventListener('pointerleave', () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); });
      }
    });

    // ---------- Cartões: inclinação 3D e brilho ----------
    if (fine && !reduced) {
      document.querySelectorAll('.group-card').forEach(card => {
        card.addEventListener('pointermove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          card.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
          card.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
          card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
          card.classList.add('tilting');
        });
        card.addEventListener('pointerleave', () => {
          card.classList.remove('tilting');
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      });
    }

    // ---------- Rádio: contagem da frequência + equalizador ----------
    if (reduced || !hero) return; // Efeitos do destaque apenas na página inicial.

    // ---------- Hero: título por palavras, digitação ----------
    const h1 = document.querySelector('.hero h1');
    if (h1) {
      let i = 0;
      (function walk(node) {
        [...node.childNodes].forEach(n => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(p => {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.append(document.createTextNode(' ')); return; }
              const w = mk('span', 'w'), wi = mk('span', 'wi');
              wi.style.setProperty('--i', i++);
              wi.textContent = p;
              w.append(wi); frag.append(w);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
        });
      })(h1);
    }
    function typeInto(el, speed, delay, done) {
      const full = el.textContent.trim();
      const minW = el.offsetWidth;
      if (minW) el.style.minWidth = minW + 'px';
      const sr = mk('span', 'sr-only'); sr.textContent = full;
      const vis = mk('span', 'typed caret'); vis.setAttribute('aria-hidden', 'true');
      el.replaceChildren(sr, vis);
      let n = 0;
      setTimeout(function tick() {
        vis.textContent = full.slice(0, ++n);
        if (n < full.length) setTimeout(tick, speed + Math.random() * 30);
        else { setTimeout(() => vis.classList.remove('caret'), 1400); done && done(); }
      }, delay);
    }
    const eyebrow = document.querySelector('.hero .eyebrow');
    const caption = document.querySelector('.art-caption');
    if (eyebrow) typeInto(eyebrow, 55, 500, () => { if (caption) typeInto(caption, 60, 300); });
    else if (caption) typeInto(caption, 60, 1500);

    const hint = mk('a', 'scroll-hint');
    hint.href = '#programacao';
    hint.setAttribute('aria-label', 'Rolar para a programação');
    hero.append(hint);

    // ---------- Hero: partículas (brasas de luz) ----------
    const canvas = mk('canvas', 'hero-canvas');
    canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const cols = ['238,87,27', '230,180,94', '28,119,115', '217,130,42'];
    let W = 0, H = 0, ps = [], raf = 0, onScreen = true;
    const mouse = { x: -999, y: -999 };
    const spawn = init => ({
      x: Math.random() * W, y: init ? Math.random() * H : H + 12,
      r: 1.4 + Math.random() * 3.4, vy: 0.22 + Math.random() * 0.6,
      ph: Math.random() * 6.28, sw: 0.3 + Math.random() * 0.8,
      c: cols[(Math.random() * cols.length) | 0], a: 0.3 + Math.random() * 0.45
    });
    function resize() {
      const r = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(W < 700 ? 24 : 70, Math.max(18, W * H / 22000)));
      while (ps.length < n) ps.push(spawn(true));
      ps.length = n;
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.y -= p.vy; p.ph += 0.015; p.x += Math.sin(p.ph) * p.sw * 0.6;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14400) { const d = Math.sqrt(d2) || 1, f = (120 - d) / 120; p.x += dx / d * f * 3; p.y += dy / d * f * 3; }
        if (p.y < -12 || p.x < -20 || p.x > W + 20) Object.assign(p, spawn(false), { x: Math.random() * W });
        const a = p.a * Math.min(1, p.y / (H * 0.3));
        ctx.fillStyle = `rgba(${p.c},${(a * 0.18).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(${p.c},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      const run = onScreen && !document.hidden;
      if (run && !raf) raf = requestAnimationFrame(frame);
      if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero); else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) new IntersectionObserver(es => { onScreen = es[0].isIntersecting; sync(); }).observe(hero);
    document.addEventListener('visibilitychange', sync);
    sync();
    if (fine) {
      let pending = false;
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
        if (pending) return; pending = true;
        requestAnimationFrame(() => {
          heroArt.style.setProperty('--px', ((mouse.x / r.width - 0.5) * -26).toFixed(1) + 'px');
          heroArt.style.setProperty('--py', ((mouse.y / r.height - 0.5) * -18).toFixed(1) + 'px');
          pending = false;
        });
      });
      hero.addEventListener('pointerleave', () => {
        mouse.x = mouse.y = -999;
        heroArt.style.setProperty('--px', '0px'); heroArt.style.setProperty('--py', '0px');
      });
    }

    // ---------- Revelação ao rolar (variações + escalonamento) ----------
    if (!('IntersectionObserver' in window)) return;
    root.classList.add('js-motion');
    const R = (sel, type, d) => document.querySelectorAll(sel).forEach(el => { el.dataset.r = type; if (d) el.dataset.d = d; });
    R('section:not(.hero) .eyebrow', 'left');
    R('section:not(.hero) h2', 'blur', 120);
    R('.section-heading > p', 'up', 200);
    R('.group-label', 'left');
    R('.group-card', 'flip');
    R('.schedule-wrap tbody tr', 'left');
    R('.mobile-schedule li', 'up');
    R('.gallery button', 'zoom');
    R('.note', 'up');
    R('.youtube > div', 'left');
    R('.youtube > a', 'zoom', 250);
    R('.education > div', 'left');
    R('.education > a', 'right', 200);
    R('.history-intro', 'up', 100);
    R('.history-details', 'up', 200);
    R('.location > div:first-child', 'left');
    R('.map-box', 'right', 150);
    R('.church-social > *', 'zoom');
    R('.welcome-strip > *', 'up');
    R('footer > *', 'up');
    const revealIO = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e, n) => {
          const el = e.target;
          revealIO.unobserve(el);
          const delay = (+el.dataset.d || 0) + Math.min(n, 6) * 90;
          el.style.setProperty('--d', delay + 'ms');
          requestAnimationFrame(() => el.classList.add('in', 'seen'));
          // Ao terminar, devolve o elemento ao estado normal (libera o hover).
          setTimeout(() => { el.removeAttribute('data-r'); el.classList.remove('in'); el.style.removeProperty('--d'); }, delay + 1250);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('[data-r]').forEach(el => revealIO.observe(el));
  } catch (err) {
    console.warn('Animações extras indisponíveis:', err);
    document.documentElement.classList.remove('js-motion');
    document.querySelectorAll('[data-r]').forEach(el => el.removeAttribute('data-r'));
  }
})();

// Entradas suaves em todas as páginas, sem esconder conteúdo ou depender do hero.
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      if (preference.matches) return;
      const animation = target.animate([
        {opacity: .35, transform: 'translateY(22px)'},
        {opacity: 1, transform: 'translateY(0)'}
      ], {duration: 750, delay: Number(target.dataset.motionDelay || 0), easing: 'cubic-bezier(.2,.7,.3,1)'});
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    });
  }, {threshold: .12});
  document.querySelectorAll('.feature-copy, .learning-art, .radio-device, .journey-card, .radio-bottom, .inner-page .section-heading, .history-intro, .history-details, .youtube-copy, .youtube-identity, .gallery button, .group-card').forEach((element, index) => {
    element.dataset.motionDelay = String(index % 3 * 90);
    observer.observe(element);
  });
  preference.addEventListener('change', () => {
    if (preference.matches) { animations.forEach(animation => animation.cancel()); animations.clear(); }
  });
})();
