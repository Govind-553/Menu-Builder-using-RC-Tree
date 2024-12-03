export class MenuTree {
  constructor(container) {
    this.container = container;
    this.data = [];
  }

  render(items) {
    this.data = items;
    this.container.innerHTML = this.buildTreeHTML(items); 
    this.attachEventListeners(); 
  }

buildTreeHTML(items, level = 0) {
    if (!items || items.length === 0) return '';

    const html = items
      .map(item => {
        const hasChildren = item.children && item.children.length > 0;
        const childrenHTML = this.buildTreeHTML(item.children, level + 1);
        return `
          <li class="menu-item">
            <div class="item-container">
              <span class="item-title">${item.title}</span>
              ${hasChildren ? `<button class="toggle-btn" data-id="${item.key}">+</button>` : ''}
              <div class="actions">
                <button class="btn secondary edit-btn" data-id="${item.key}">Edit</button>
                <button class="btn primary add-btn" data-id="${item.key}">Add</button>
                <button class="btn danger delete-btn" data-id="${item.key}">Delete</button>
              </div>
            </div>
            ${childrenHTML ? `<ul class="menu-level menu-level-${level}" style="display: none;">${childrenHTML}</ul>` : ''}
          </li>
        `;
      })
      .join('');

    return `<ul class="menu-level menu-level-${level}">${html}</ul>`;
  }  
  
  
  attachEventListeners() {
        this.container.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const parentItem = btn.closest('.menu-item');
        const childMenu = parentItem.querySelector('.menu-level');
        if (childMenu) {
          const isExpanded = childMenu.style.display === 'block';
          childMenu.style.display = isExpanded ? 'none' : 'block';
          btn.textContent = isExpanded ? '+' : '-';
        }
      });
    });

    this.container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = this.findItem(id);
        if (item) {
          document.dispatchEvent(new CustomEvent('editItem', { detail: item }));
        }
      });
    });
    
    this.container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        document.dispatchEvent(new CustomEvent('deleteItem', { detail: { id } }));
      });
    });

    this.container.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const parentId = btn.dataset.id;
        document.dispatchEvent(new CustomEvent('addItem', { detail: { parentId } }));
      });
    });
  }

  findItem(id, items = this.data) {
    for (const item of items) {
      if (item.key === id) return item;
      if (item.children) {
        const found = this.findItem(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }
}
