 export class Modal {
  constructor() {
    this.modal = document.getElementById('modal');
    this.form = document.getElementById('menuForm');
    this.titleInput = document.getElementById('titleInput');
    this.modalTitle = document.getElementById('modalTitle');
    this.closeBtn = document.querySelector('.close-btn');
    this.cancelBtn = document.getElementById('cancelBtn');
    
    this.currentItem = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    title: this.titleInput.value,
    key: this.currentItem?.key || null, 
    parentId: this.currentItem?.parentId || null,
  };
  document.dispatchEvent(new CustomEvent('saveItem', { detail: data }));
  this.close();
});

    this.closeBtn.addEventListener('click', () => this.close());
    this.cancelBtn.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open(item = null) {
    this.currentItem = item;
    this.modalTitle.textContent = item?.key ? 'Edit Item' : 'Add Root Node';
    this.titleInput.value = item ?.title || '';
    this.modal.classList.add('active');
    this.titleInput.focus();
  }

  close() {
    this.modal.classList.remove('active');
    this.form.reset();
    this.currentItem = null;
  }
}