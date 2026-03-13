/* ═══════════════════════════════════════════════════════
   Õhtuleht Brand Manual — Interactive JavaScript
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── SIDEBAR TOGGLE (Mobile) ──────────────────── */
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const hamburger = document.getElementById('hamburger');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('visible');
  }
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('visible');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  // Close sidebar when a nav link is clicked on mobile
  document.querySelectorAll('.nav-link, .nav-sub').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    });
  });

  /* ─── ACTIVE NAV TRACKING (Scroll Spy) ─────────── */
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = [];

  navLinks.forEach(function (link) {
    const id = link.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) {
      sections.push({ id: id, el: section, link: link });
    }
  });

  function updateActiveNav() {
    const mainEl = document.getElementById('main');
    if (!mainEl) return;

    const scrollTop = mainEl.scrollTop;
    const mainTop = mainEl.getBoundingClientRect().top;
    let current = sections[0];

    for (let i = 0; i < sections.length; i++) {
      var rect = sections[i].el.getBoundingClientRect();
      if (rect.top - mainTop - 120 <= 0) {
        current = sections[i];
      }
    }

    navLinks.forEach(function (l) { l.classList.remove('active'); });
    if (current && current.link) {
      current.link.classList.add('active');
    }
  }

  const mainEl = document.getElementById('main');
  if (mainEl) {
    mainEl.addEventListener('scroll', updateActiveNav, { passive: true });
  }

  /* ─── SMOOTH SCROLL FOR NAV LINKS ─────────────── */
  document.querySelectorAll('.nav-link[href^="#"], .nav-sub[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target && mainEl) {
        var targetTop = target.getBoundingClientRect().top - mainEl.getBoundingClientRect().top + mainEl.scrollTop;
        mainEl.scrollTo({
          top: targetTop - 8,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ─── COLOR SWATCH COPY TO CLIPBOARD ───────────── */
  window.copyColor = function (hex, el) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(function () {
        showCopyFeedback(el, hex);
      });
    } else {
      // Fallback for older browsers
      var temp = document.createElement('textarea');
      temp.value = hex;
      temp.style.position = 'fixed';
      temp.style.left = '-9999px';
      document.body.appendChild(temp);
      temp.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      document.body.removeChild(temp);
      showCopyFeedback(el, hex);
    }
  };

  function showCopyFeedback(el, hex) {
    // Visual feedback on swatch
    if (el) {
      el.classList.add('just-copied');
      setTimeout(function () {
        el.classList.remove('just-copied');
      }, 1200);
    }
    // Toast notification
    showToast('Copied: ' + hex);
  }

  /* ─── TOAST NOTIFICATION ───────────────────────── */
  function showToast(message) {
    var toast = document.getElementById('toast');
    var toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }

  /* ─── TOPIC PILL TOGGLE ────────────────────────── */
  window.toggleTopic = function (el) {
    el.classList.toggle('following');
    if (el.classList.contains('following')) {
      el.innerHTML = '<span>✓</span> ' + el.textContent.replace('✓ ', '').trim();
    } else {
      var text = el.textContent.replace('✓ ', '').trim();
      el.innerHTML = '<span class="topic-pill-icon">●</span> ' + text;
    }
    // Update counter
    updateTopicCount();
  };

  function updateTopicCount() {
    var counter = document.getElementById('topic-counter');
    var grid = document.getElementById('topicGrid');
    if (!counter || !grid) return;
    var count = grid.querySelectorAll('.topic-pill.following').length;
    counter.textContent = count + ' / 20 teemat valitud';
  }

  /* ─── TOGGLE SWITCH ────────────────────────────── */
  window.toggleSwitch = function (el) {
    el.classList.toggle('on');
  };

  /* ─── FONT SIZE CONTROL DEMO ───────────────────── */
  var fontSizes = [16, 18, 21, 24];
  var fontSizeLabels = ['Sm', 'Md', 'Lg', 'XL'];
  var currentFontSizeIdx = 1;

  window.changeFontSize = function (direction) {
    currentFontSizeIdx += direction;
    if (currentFontSizeIdx < 0) currentFontSizeIdx = 0;
    if (currentFontSizeIdx >= fontSizes.length) currentFontSizeIdx = fontSizes.length - 1;

    var label = document.getElementById('fsc-value');
    var preview = document.getElementById('font-size-preview');
    if (label) label.textContent = fontSizeLabels[currentFontSizeIdx] + ' ' + fontSizes[currentFontSizeIdx] + 'px';
    if (preview) preview.style.fontSize = fontSizes[currentFontSizeIdx] + 'px';

    // Update button disabled states
    var btnMinus = document.getElementById('fsc-minus');
    var btnPlus = document.getElementById('fsc-plus');
    if (btnMinus) btnMinus.disabled = currentFontSizeIdx === 0;
    if (btnPlus) btnPlus.disabled = currentFontSizeIdx === fontSizes.length - 1;
  };

  /* ─── INIT ─────────────────────────────────────── */
  updateActiveNav();
})();
