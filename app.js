/* Plain browser scripts and relative paths keep this gallery usable via file://. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const catalog = window.GALLERY_CATALOG;
  const pageSize = 48;
  const angles = ['正面', '俯視', '仰視', '側面', '斜側'];
  const labels = {
    '全身單人・標準系': 'Full body · Standard', '上半身單人': 'Upper body',
    '全身單人・性感系': 'Full body · Expressive', '雙人纏綿': 'Couples',
    '春季穿搭': 'Spring', '夏季穿搭': 'Summer', '秋季穿搭': 'Autumn', '冬季穿搭': 'Winter',
    '內衣・睡衣': 'Underwear & sleepwear', '性感穿搭': 'Sensual styles', '泳裝・度假': 'Swimwear & holiday', '派對・禮服': 'Party & formal',
    '正臉參考': 'Face references', '造型氛圍': 'Style & mood',
    '正面': 'Front', '俯視': 'From above', '仰視': 'From below', '側面': 'Side', '斜側': 'Three-quarter',
    '短髮': 'Short hair', '中髮': 'Medium hair', '中長髮': 'Medium-long hair', '長髮': 'Long hair',
    '站姿': 'Standing', '坐姿': 'Sitting', '蹲姿': 'Crouching', '趴臥': 'Lying face down', '扭身': 'Twisting',
    '前傾': 'Leaning forward', '後仰・挺背': 'Leaning back', '跪立・四肢着地': 'Kneeling & on all fours',
    '可愛系': 'Playful', '貼臉系': 'Hands near face', '特殊': 'Other',
    '坐位貼身': 'Seated close embrace', '擠胸・強調事業線系': 'Chest and cleavage emphasis',
    '正常位（傳教士）': 'Missionary position', '騎乘位': 'Straddling position',
    '跪立': 'Upright kneeling', '坐位': 'Seated', '貼身': 'Close embrace',
    '立位': 'Standing', '側臥位': 'Side lying', '側坐・女孩坐': 'Side sitting & W-sitting',
    '性感・大膽系': 'Sensual & bold', '面對面坐位': 'Face-to-face sitting',
    '背向坐位': 'Seated facing away', '立位貼身': 'Standing close embrace', '後入位': 'Rear-entry position'
  };
  const restricted = new Set(['全身單人・性感系', '雙人纏綿', '內衣・睡衣', '性感穿搭']);
  const categoryOrder = ['全身單人・標準系', '上半身單人', '全身單人・性感系', '雙人纏綿'];
  const state = { collection: 'pose', page: 1, entries: [], previewIndex: 0, angleIndex: 0 };
  const label = value => labels[value] ? `${value} / ${labels[value]}` : value;
  const title = item => `${item.name} / ${item.nameEn}`;
  const number = value => value.toLocaleString('en');
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  $('info-button').addEventListener('click', () => $('info-dialog').showModal());
  $('info-close').addEventListener('click', () => $('info-dialog').close());
  $('info-dialog').addEventListener('close', () => $('info-button').focus());
  $('info-dialog').addEventListener('click', event => {
    if (event.target !== $('info-dialog')) return;
    const rect = $('info-dialog').getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('info-dialog').close();
  });
  if (!catalog) {
    $('results').textContent = '未能載入資料目錄，請將 catalog.js 放在 index.html 旁。 / Catalogue could not be loaded. Keep catalog.js beside index.html.';
    $('pagination').hidden = true;
    return;
  }
  // Search only the displayed Traditional Chinese and English catalogue fields.
  for (const items of Object.values(catalog)) {
    for (const item of items) item.searchText = [item.id, item.name, item.nameEn, item.keywords, label(item.category), label(item.detail), label(item.angle)].join(' ').toLowerCase();
  }
  function baseItems() {
    return catalog[state.collection].filter(item => !$('safe').checked || !restricted.has(item.category));
  }
  function setOptions(element, values, title) {
    const current = element.value;
    element.replaceChildren(new Option(title, ''), ...values.map(value => new Option(label(value), value)));
    element.value = values.includes(current) ? current : '';
  }
  function updateFilters() {
    const items = baseItems();
    const categories = [...new Set(items.map(item => item.category))];
    if (state.collection === 'pose') categories.sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));
    setOptions($('category'), categories, '所有分類 / All categories');
    const withinCategory = items.filter(item => !$('category').value || item.category === $('category').value);
    setOptions($('detail'), [...new Set(withinCategory.map(item => item.detail).filter(Boolean))], '所有類型 / All types');
    setOptions($('angle'), angles.filter(angle => items.some(item => item.angle === angle)), '所有角度 / All angles');
    $('detail-field').hidden = state.collection === 'costume';
    $('detail-label').textContent = state.collection === 'portrait' ? '頭髮長度 / Hair length' : '姿勢類型 / Pose type';
    $('angle-field').hidden = $('view-field').hidden = state.collection !== 'pose';
  }
  function matchingItems() {
    const terms = $('search').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return baseItems().filter(item =>
      (!$('category').value || item.category === $('category').value) &&
      (!$('detail').value || item.detail === $('detail').value) &&
      (!$('angle').value || item.angle === $('angle').value) &&
      terms.every(term => item.searchText.includes(term))
    );
  }
  function buildEntries(items) {
    if (state.collection !== 'pose' || $('view').value === 'images') return items.map(item => [item]);
    const groups = new Map();
    for (const item of items) {
      const key = `${item.category}|${item.group}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    return [...groups.values()].map(group => group.sort((a,b) => angles.indexOf(a.angle) - angles.indexOf(b.angle)))
      .sort((a,b) => categoryOrder.indexOf(a[0].category) - categoryOrder.indexOf(b[0].category) || a[0].group.localeCompare(b[0].group));
  }
  function render(resetPage = true) {
    if (resetPage) state.page = 1;
    if (resetPage) $('gallery-scroll').scrollTop = 0;
    const items = matchingItems();
    state.entries = buildEntries(items);
    const pages = Math.max(1, Math.ceil(state.entries.length / pageSize));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * pageSize;
    const shown = state.entries.slice(start, start + pageSize);
    const grouped = state.collection === 'pose' && $('view').value === 'groups';
    $('results').textContent = `${number(state.entries.length)} ${grouped ? '組姿勢 / pose groups' : '項參考 / references'}${grouped ? ` · ${number(items.length)} 張圖片 / images` : ''}${$('safe').checked ? ' · 安全模式已開啟 / Safe mode on' : ''}`;
    $('gallery').innerHTML = shown.map((entry, index) => {
      const item = entry[0];
      return `<article class="card"><button type="button" class="image-button" data-index="${start + index}" aria-label="預覽 / Preview ${esc(title(item))}"><img src="${esc(item.thumb)}" alt="${esc(title(item))}" loading="lazy" decoding="async"><span class="badge">${entry.length > 1 ? `${entry.length} 個角度 / angles` : esc(label(item.angle) || '檢視圖片 / View image')}</span></button><h2><span lang="zh-HK">${esc(item.name)}</span><span class="title-en" lang="en">${esc(item.nameEn)}</span></h2><div class="card-meta"><span>${esc(label(item.detail) || label(item.category))}</span><span>${esc(state.collection === 'pose' ? item.group : item.id)}</span></div></article>`;
    }).join('');
    $('empty').hidden = shown.length !== 0;
    $('pagination').hidden = shown.length === 0;
    $('page-label').textContent = `第 ${state.page} / ${pages} 頁 · Page ${state.page} of ${pages}`;
    $('previous').disabled = state.page === 1;
    $('next').disabled = state.page === pages;
  }
  function resetFilters() {
    for (const id of ['search', 'category', 'detail', 'angle']) $(id).value = '';
    updateFilters();
    render();
  }
  document.querySelector('.collections').addEventListener('click', event => {
    const button = event.target.closest('[data-collection]');
    if (!button) return;
    state.collection = button.dataset.collection;
    document.querySelectorAll('[data-collection]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    resetFilters();
  });
  $('search').addEventListener('input', () => render());
  $('category').addEventListener('change', () => { $('detail').value = ''; updateFilters(); render(); });
  for (const id of ['detail', 'angle', 'view']) $(id).addEventListener('change', () => render());
  $('safe').addEventListener('change', () => { updateFilters(); render(); });
  $('reset').addEventListener('click', resetFilters);
  $('empty-reset').addEventListener('click', resetFilters);
  function changePage(direction) {
    state.page += direction;
    render(false);
    $('gallery-scroll').scrollTop = 0;
  }
  $('previous').addEventListener('click', () => changePage(-1));
  $('next').addEventListener('click', () => changePage(1));
  $('gallery').addEventListener('error', event => {
    if (event.target.tagName === 'IMG') event.target.parentElement.classList.add('image-failed');
  }, true);
  let previewTrigger;
  function showPreview() {
    const entry = state.entries[state.previewIndex];
    const item = entry[state.angleIndex];
    $('image-error').hidden = true;
    $('preview-image').hidden = false;
    $('preview-image').src = item.image;
    $('preview-image').alt = `${title(item)}${item.angle ? ` — ${label(item.angle)}` : ''}`;
    $('preview-title').innerHTML = `<span lang="zh-HK">${esc(item.name)}</span><span class="title-en" lang="en">${esc(item.nameEn)}</span>`;
    $('preview-category').textContent = label(item.category);
    $('preview-id').textContent = item.id;
    $('preview-detail').textContent = [label(item.detail), label(item.angle)].filter(Boolean).join(' · ');
    $('preview-keywords').textContent = item.keywords ? `關鍵字 / Keywords: ${item.name} / ${item.keywords}` : '';
    $('preview-position').textContent = `第 ${number(state.previewIndex + 1)} / ${number(state.entries.length)} 項參考 · Reference ${number(state.previewIndex + 1)} of ${number(state.entries.length)}`;
    $('preview-angles').innerHTML = entry.length > 1 ? entry.map((angle, index) => `<button type="button" data-angle="${index}" aria-pressed="${index === state.angleIndex}">${esc(label(angle.angle))}</button>`).join('') : '';
    $('open-original').href = item.image;
    $('preview-previous').disabled = state.previewIndex === 0;
    $('preview-next').disabled = state.previewIndex === state.entries.length - 1;
  }
  $('gallery').addEventListener('click', event => {
    const button = event.target.closest('[data-index]');
    if (!button) return;
    previewTrigger = button;
    state.previewIndex = Number(button.dataset.index);
    state.angleIndex = 0;
    showPreview();
    $('preview').showModal();
    $('close').focus();
  });
  $('preview-image').addEventListener('error', () => { $('preview-image').hidden = true; $('image-error').hidden = false; });
  $('preview-angles').addEventListener('click', event => {
    const button = event.target.closest('[data-angle]');
    if (!button) return;
    state.angleIndex = Number(button.dataset.angle);
    showPreview();
    $('preview-angles').querySelector(`[data-angle="${state.angleIndex}"]`).focus();
  });
  function movePreview(direction) {
    const index = state.previewIndex + direction;
    if (index < 0 || index >= state.entries.length) return;
    state.previewIndex = index;
    state.angleIndex = 0;
    showPreview();
  }
  $('preview-previous').addEventListener('click', () => movePreview(-1));
  $('preview-next').addEventListener('click', () => movePreview(1));
  $('close').addEventListener('click', () => $('preview').close());
  $('preview').addEventListener('close', () => previewTrigger?.focus());
  $('preview').addEventListener('click', event => {
    if (event.target !== $('preview')) return;
    const rect = $('preview').getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $('preview').close();
  });
  $('preview').addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') movePreview(-1);
    else if (event.key === 'ArrowRight') movePreview(1);
    else {
      const entry = state.entries[state.previewIndex];
      state.angleIndex = (state.angleIndex + (event.key === 'ArrowUp' ? -1 : 1) + entry.length) % entry.length;
      showPreview();
    }
  });
  updateFilters();
  render();
})();
