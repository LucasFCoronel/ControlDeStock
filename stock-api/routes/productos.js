import express from 'express';
import db from '../db.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Crear producto
router.post('/', async (req, res) => {
  const { nombre, descripcion = '', precio, stock, categoria = '' } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    await db.execute(
      `INSERT INTO productos (nombre, descripcion, precio, stock, categoria, creado_en)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nombre, descripcion, precio, stock, categoria]
    );
    res.json({ message: 'Producto agregado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion = '', precio, stock, categoria = '' } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?
       WHERE id = ?`,
      [nombre, descripcion, precio, stock, categoria, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM productos WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado con éxito' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

export default router;
