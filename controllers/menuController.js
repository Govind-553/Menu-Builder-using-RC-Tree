import pool from '../config/database.js';

export async function getAllMenuItems(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM menu_items ORDER BY parent_id, title');
    const menuTree = buildMenuTree(rows);
    res.json(menuTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createMenuItem(req, res) {
  const { id, title, parent_id } = req.body;
  try {
    await pool.execute(
      'INSERT INTO menu_items (id, title, parent_id) VALUES (?, ?, ?)',
      [id, title, parent_id || null]
    );
    res.status(201).json({ id, title, parent_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateMenuItem(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE menu_items SET title = ? WHERE id = ?',
      [title, id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Menu item not found' });
    } else {
      res.json({ id, title }); 
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteMenuItem(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.execute(
      'DELETE FROM menu_items WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Menu item not found' });
    } else {
      res.json({ message: 'Menu item deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

function buildMenuTree(items, parentId = null) {
  return items
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      key: item.id,
      title: item.title,
      children: buildMenuTree(items, item.id),
    }));
}
