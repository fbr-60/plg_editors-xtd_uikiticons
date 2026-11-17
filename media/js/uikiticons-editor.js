window.openUikitIconsModal = function(editorId) {
  const pluginOptions = Joomla.getOptions('plg_editorsxtd_uikiticons') || {};
  const icons = (pluginOptions.icons && pluginOptions.icons.length)
    ? pluginOptions.icons
    : ['check', 'square-check', 'plus', 'chevron-right', 'arrow-right', 'star', 'heart', 'bolt', 'info', 'warning', 'close', 'location'];

  const colors = [
    { name: 'blue',   label: 'Синий' },
    { name: 'green',  label: 'Зеленый' },
    { name: 'orange', label: 'Оранжевый' },
    { name: 'red',    label: 'Красный' },
    { name: 'gray',   label: 'Серый' },
    { name: 'dark',   label: 'Темный' }
  ];

  const oldModal = document.getElementById('uk-icons-xtd-modal');
  if (oldModal) oldModal.remove();

  const modal = document.createElement('div');
  modal.id = 'uk-icons-xtd-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;';

  modal.innerHTML = `
    <div style="background:#fff;padding:20px;border-radius:8px;width:420px;max-width:95%;box-shadow:0 10px 30px rgba(0,0,0,0.2);">
      <h3 style="margin:0 0 15px;font-size:18px;">Настройка иконки списка / блока</h3>
      
      <div style="margin-bottom:12px;">
        <label style="display:block;margin-bottom:5px;font-weight:bold;font-size:13px;">1. Выберите иконку:</label>
        <select id="uk-xtd-icon" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;">
          ${icons.map(i => `<option value="${i}">${i}</option>`).join('')}
        </select>
      </div>

      <div style="margin-bottom:12px;">
        <label style="display:block;margin-bottom:5px;font-weight:bold;font-size:13px;">2. Выберите цвет:</label>
        <select id="uk-xtd-color" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;">
          ${colors.map(c => `<option value="${c.name}">${c.label} (${c.name})</option>`).join('')}
        </select>
      </div>

      <div style="margin-bottom:10px;">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="checkbox" id="uk-xtd-circle">
          <span>В цветном круге (<code>icn-circle</code>)</span>
        </label>
      </div>

      <div style="margin-bottom:18px;">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px;">
          <input type="checkbox" id="uk-xtd-text-color">
          <span>Покрасить текст в цвет иконки (<code>icn-text</code>)</span>
        </label>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button type="button" id="uk-xtd-cancel" style="padding:8px 14px;border:1px solid #ccc;background:#f5f5f5;border-radius:4px;cursor:pointer;">Отмена</button>
        <button type="button" id="uk-xtd-apply" style="padding:8px 16px;border:none;background:#1e87f0;color:#fff;border-radius:4px;cursor:pointer;font-weight:bold;">Применить</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#uk-xtd-cancel').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

  modal.querySelector('#uk-xtd-apply').onclick = () => {
    try {
      const icon = modal.querySelector('#uk-xtd-icon')?.value || 'check';
      const color = modal.querySelector('#uk-xtd-color')?.value || 'blue';
      const isCircle = modal.querySelector('#uk-xtd-circle')?.checked || false;
      const isTextColor = modal.querySelector('#uk-xtd-text-color')?.checked || false;

      const ed = window.tinyMCE ? window.tinyMCE.get(editorId) : null;
      if (ed) {
        const node = ed.selection.getNode();
        const ul = node.closest('ul');
        const target = ul ? ul : node;

        Array.from(target.classList).forEach(cls => {
          if (cls.startsWith('icnList_') || cls.startsWith('icn_') || cls === 'icn-circle' || cls === 'icn-text') {
            target.classList.remove(cls);
          }
        });

        const prefix = target.tagName === 'UL' ? 'icnList' : 'icn';
        target.classList.add(`${prefix}_${icon}_${color}`);
        if (isCircle) target.classList.add('icn-circle');
        if (isTextColor) target.classList.add('icn-text');

        // Сообщаем TinyMCE, что содержимое изменилось
        ed.nodeChanged();
      }
    } finally {
      // Гарантированно закрываем модальное окно в любом случае
      modal.remove();
    }
  };
};
