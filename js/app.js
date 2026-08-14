/* ========== 路由与启动 ========== */
(function () {
  const App = (window.App = window.App || {});
  const u = App.u,
    ui = App.ui;

  const TABS = [
    { hash: '#/home', name: '首页', icon: 'home' },
    { hash: '#/modules', name: '刷题', icon: 'grid' },
    { hash: '#/review', name: '复盘', icon: 'note' },
    { hash: '#/mistakes', name: '错题', icon: 'book' },
    { hash: '#/checkin', name: '打卡', icon: 'calendar' },
    { hash: '#/papers', name: '试卷', icon: 'file' },
  ];

  const isPC = () => window.innerWidth >= 768;

  function renderTabs(hash) {
    const bar = document.getElementById('tabbar');
    bar.innerHTML = '';

    // PC 侧边栏：顶部 Logo 区
    if (isPC()) {
      const logo = u.el(`<div class="sidebar-logo">
        <span class="sidebar-logo-icon">${ui.icon('home', 20)}</span>考公助手
      </div>`);
      bar.appendChild(logo);
    }

    TABS.forEach((t) => {
      const on = hash === t.hash || (t.hash === '#/modules' && hash.startsWith('#/module/'));
      const el = u.el(`<button class="tab ${on ? 'on' : ''}"><span class="ic">${ui.icon(t.icon, 20)}</span>${t.name}</button>`);
      el.onclick = () => (location.hash = t.hash);
      bar.appendChild(el);
    });

    // PC 侧边栏底部：设置入口
    if (isPC()) {
      const spacer = u.el('<div style="flex:1"></div>');
      bar.appendChild(spacer);
      const settingsBtn = u.el(`<button class="tab ${hash === '#/settings' ? 'on' : ''}"><span class="ic">${ui.icon('gear', 20)}</span>设置</button>`);
      settingsBtn.onclick = () => (location.hash = '#/settings');
      bar.appendChild(settingsBtn);
    }

    // 移动端 settings 页隐藏底部 TabBar；PC 侧边栏始终显示（CSS media query 覆盖 hide）
    bar.classList.toggle('hide', !isPC() && hash === '#/settings');
  }

  function render() {
    const view = document.getElementById('view');
    const hash = location.hash || '#/home';
    const y = window.scrollY;
    if (hash.startsWith('#/module/')) App.pages.modules.detail(view, hash.slice(9));
    else if (hash === '#/modules') App.pages.modules.render(view);
    else if (hash === '#/mistakes') App.pages.mistakes.render(view);
    else if (hash === '#/review') App.pages.review.render(view);
    else if (hash === '#/checkin') App.pages.checkin.render(view);
    else if (hash === '#/papers') App.pages.papers.render(view);
    else if (hash === '#/settings') App.pages.settings.render(view);
    else App.pages.home.render(view);
    renderTabs(hash);
    window.scrollTo(0, Math.min(y, document.body.scrollHeight));
    // 页面切入动画
    view.classList.remove('page-in');
    void view.offsetWidth;
    view.classList.add('page-in');
  }

  let lastHash = '';
  window.addEventListener('hashchange', () => {
    const changed = location.hash !== lastHash;
    lastHash = location.hash;
    render();
    if (changed) window.scrollTo(0, 0);
  });

  window.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) location.hash = '#/home';
    lastHash = location.hash;
    render();
  });

  // 窗口宽度跨越断点时重新渲染 TabBar（PC ↔ 手机切换）
  let lastPC = isPC();
  window.addEventListener('resize', () => {
    const nowPC = isPC();
    if (nowPC !== lastPC) {
      lastPC = nowPC;
      renderTabs(location.hash || '#/home');
    }
  });

  App.render = render;
})();
