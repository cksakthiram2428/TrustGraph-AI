const express = require('express');
const cors = require('cors');
const db = require('./database');
 
const app = express();
const port = 3000;
 
app.use(cors());
app.use(express.json());
 
// ═══════════════════════════════════════════════════════════════════════════════
// GET — Read all suppliers
// ════════════════════════════════════════════════════════════════════════════════
app.get('/api/suppliers', (req, res) => {
  db.all('SELECT * FROM suppliers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const suppliers = rows.map(row => ({
      id: row.id,
      name: row.name,
      industry: row.industry,
      score: row.score,
      risk: row.risk,
      riskIcon: row.riskIcon,
      riskColor: row.riskColor,
      insight: row.insight,
      details: {
        paymentDelay: row.paymentDelay,
        deliveryReliability: row.deliveryReliability,
        qualityRate: row.qualityRate,
        complaintCount: row.complaintCount
      }
    }));
    res.json(suppliers);
  });
});
 
// ════════════════════════════════════════════════════════════════════════════════
// POST — Create a new supplier
// ═══════════════════════════════════════════════════════════════════════════════
app.post('/api/suppliers', (req, res) => {
  const { id, name, industry, score, risk, riskIcon, riskColor, insight, paymentDelay, deliveryReliability, qualityRate, complaintCount } = req.body;
 
  if (!id || !name) {
    return res.status(400).json({ error: 'id and name are required' });
  }
 
  const sql = `INSERT INTO suppliers (id, name, industry, score, risk, riskIcon, riskColor, insight, paymentDelay, deliveryReliability, qualityRate, complaintCount) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [id, name, industry || '', score || 50, risk || 'Medium Risk', riskIcon || '🟡', riskColor || 'yellow', insight || '', paymentDelay || 'N/A', deliveryReliability || 'N/A', qualityRate || 'N/A', complaintCount || 0];
 
  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Supplier created', id });
  });
});
 
// ═════════════════════════════════════════════════════════════════════════════════
// PUT — Update an existing supplier
// ══════════════════════════════════════════════════════════════════════════════
app.put('/api/suppliers/:id', (req, res) => {
  const { name, industry, score, risk, riskIcon, riskColor, insight, paymentDelay, deliveryReliability, qualityRate, complaintCount } = req.body;
 
  const sql = `UPDATE suppliers SET 
    name = COALESCE(?, name),
    industry = COALESCE(?, industry),
    score = COALESCE(?, score),
    risk = COALESCE(?, risk),
    riskIcon = COALESCE(?, riskIcon),
    riskColor = COALESCE(?, riskColor),
    insight = COALESCE(?, insight),
    paymentDelay = COALESCE(?, paymentDelay),
    deliveryReliability = COALESCE(?, deliveryReliability),
    qualityRate = COALESCE(?, qualityRate),
    complaintCount = COALESCE(?, complaintCount)
    WHERE id = ?`;
  const params = [name, industry, score, risk, riskIcon, riskColor, insight, paymentDelay, deliveryReliability, qualityRate, complaintCount, req.params.id];
 
  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier updated', id: req.params.id });
  });
});
 
// ═════════════════════════════════════════════════════════════════════════════════
// DELETE — Remove a supplier
// ═══════════════════════════════════════════════════════════════════════════════
app.delete('/api/suppliers/:id', (req, res) => {
  db.run('DELETE FROM suppliers WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Supplier not found' });
    res.json({ message: 'Supplier deleted', id: req.params.id });
  });
});
 
// ════════════════════════════════════════════════════════════════════════════════
// GET — Stats
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/stats', (req, res) => {
  db.all('SELECT * FROM stats', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
 
// ═════════════════════════════════════════════════════════════════════════════════
// GET — Network graph data
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/network', (req, res) => {
  db.all('SELECT * FROM network_nodes', [], (err, nodes) => {
    if (err) return res.status(500).json({ error: err.message });
    db.all('SELECT * FROM network_edges', [], (err, edges) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        nodes,
        edges: edges.map(e => [e.fromId, e.toId])
      });
    });
  });
});
 
// ════════════════════════════════════════════════════════════════════════════════
// NEW — Authentication endpoint
// ══════════════════════════════════════════════════════════════════════════════
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.all('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length > 0) {
      return res.json({ success: true, message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});
 
// ════════════════════════════════════════════════════════════════════════════════
// NEW — Download supplier report
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/supplier/report/:id', (req, res) => {
  const supplierId = req.params.id;
  
  db.all('SELECT * FROM suppliers WHERE id = ?', [supplierId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    const supplier = rows[0];
    
    // Generate a simple report
    const report = {
      id: supplier.id,
      name: supplier.name,
      industry: supplier.industry,
      score: supplier.score,
      risk: supplier.risk,
      riskIcon: supplier.riskIcon,
      riskColor: supplier.riskColor,
      details: supplier.details,
      generatedAt: new Date().toISOString()
    };
    
    res.setHeader('Content-Disposition', 'attachment; filename=supplier_report.json'); res.setHeader('Content-Disposition', 'attachment; filename=supplier_report.json'); res.json({ report });
  });
});
 
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});