import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from './api.js';
import { MenuTree } from './menuTree.js';
import { Modal } from './modal.js';
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@9.0.0/dist/esm-browser/index.js';

export class App {
  constructor() {
    this.menuTree = new MenuTree(document.getElementById('menuTree'));
    this.modal = new Modal();
    this.addRootBtn = document.getElementById('addRootBtn');

    this.setupEventListeners();
    this.loadMenuItems();
  }

  setupEventListeners() {
    this.addRootBtn.addEventListener('click', () => {
      this.modal.open();
    });

    document.addEventListener('addItem', (e) => {
      this.modal.open({ parentId: e.detail.parentId });
    });

    document.addEventListener('editItem', (e) => {
      this.modal.open(e.detail);
    });

    document.addEventListener('deleteItem', async (e) => {
      if (confirm('Are you sure you want to delete this item?')) {
        try {
          await deleteMenuItem(e.detail.id);
          await this.loadMenuItems();
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('Failed to delete item');
        }
      }
    });

    document.addEventListener('saveItem', async (e) => {
      const data = e.detail;
      try {
        if (data.key) {
          // Update existing menu item
          await updateMenuItem(data.key, { title: data.title });
        } else {
          // Create a new menu item
          await createMenuItem({
            id: uuidv4(), 
            title: data.title,
            parent_id: data.parentId || null,
          });
        }
        await this.loadMenuItems();
      } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item');
      }
    });
  }

  async loadMenuItems() {
    try {
      const items = await fetchMenuItems();
      this.menuTree.render(items);
    } catch (error) {
      console.error('Error loading menu items:', error);
      alert('Failed to load menu items');
    }
  }
}

new App();
