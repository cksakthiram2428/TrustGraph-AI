const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'trustgraph.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      // 1. Create Tables
      db.run(`CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT,
        industry TEXT,
        score INTEGER,
        risk TEXT,
        riskIcon TEXT,
        riskColor TEXT,
        insight TEXT,
        paymentDelay TEXT,
        deliveryReliability TEXT,
        qualityRate TEXT,
        complaintCount INTEGER
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT,
        label TEXT,
        icon TEXT
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS network_nodes (
        id INTEGER PRIMARY KEY,
        label TEXT,
        x INTEGER,
        y INTEGER,
        score INTEGER,
        size INTEGER
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS network_edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fromId INTEGER,
        toId INTEGER
      )`);

      // 2. Clear existing data (for seeding purposes)
      db.run(`DELETE FROM suppliers`);
      db.run(`DELETE FROM stats`);
      db.run(`DELETE FROM network_nodes`);
      db.run(`DELETE FROM network_edges`);

      // 3. Seed Suppliers
      const insertSupplier = db.prepare(`INSERT INTO suppliers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      const suppliersData = [
        ['A', 'Rajesh Textiles Pvt Ltd', 'Textiles & Apparel', 91, 'Very Low Risk', 'check_circle', 'emerald', 'Excellent track record. Consistently on-time delivery for 18 months.', '0 days avg', '98.5%', '99.2%', 0],
        ['B', 'Mehta Electronics Corp', 'Electronics & Components', 43, 'High Risk', 'alert', 'red', '73% probability of delay next 30 days', '23 days avg', '62.1%', '71.8%', 14],
        ['C', 'Gupta Food Processing', 'Food & Beverages', 78, 'Low Risk', 'check_circle', 'green', 'Reliable partner with minor seasonal delivery variance.', '3 days avg', '91.4%', '94.6%', 2],
        ['D', 'Sharma Logistics Hub', 'Logistics & Warehousing', 61, 'Medium Risk', 'warning', 'yellow', 'Recent dip in delivery KPIs. Monitor closely.', '11 days avg', '79.3%', '85.7%', 7],
        ['E', 'Patel Pharma Solutions', 'Pharmaceuticals', 29, 'Critical Risk', 'alert', 'error', 'Recommend immediate alternative', '38 days avg', '41.2%', '52.4%', 23]
      ];
      suppliersData.forEach(s => insertSupplier.run(s));
      insertSupplier.finalize();

      // 4. Seed Stats
      const insertStat = db.prepare(`INSERT INTO stats (value, label, icon) VALUES (?, ?, ?)`);
      const statsData = [
        ['2,400+', 'MSMEs Protected', 'check_circle'],
        ['₹840Cr', 'Risk Prevented', 'shield'],
        ['94%', 'Prediction Accuracy', 'check_circle']
      ];
      statsData.forEach(s => insertStat.run(s));
      insertStat.finalize();

      // 5. Seed Network Nodes
      const insertNode = db.prepare(`INSERT INTO network_nodes (id, label, x, y, score, size) VALUES (?, ?, ?, ?, ?, ?)`);
      const nodesData = [
        [1, 'Your Co.', 50, 50, 95, 18],
        [2, 'Rajesh Textiles', 20, 25, 91, 12],
        [3, 'Mehta Elec.', 80, 20, 43, 12],
        [4, 'Gupta Foods', 15, 70, 78, 11],
        [5, 'Sharma Log.', 75, 65, 61, 10],
        [6, 'Patel Pharma', 85, 45, 29, 10],
        [7, 'Verma Steel', 35, 80, 84, 10],
        [8, 'Kumar Auto', 60, 85, 72, 10],
        [9, 'Singh Pack.', 30, 15, 88, 9],
        [10, 'Das Chem.', 65, 35, 55, 9]
      ];
      nodesData.forEach(n => insertNode.run(n));
      insertNode.finalize();

      // 6. Seed Network Edges
      const insertEdge = db.prepare(`INSERT INTO network_edges (fromId, toId) VALUES (?, ?)`);
      const edgesData = [
        [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
        [1, 10], [2, 9], [4, 7], [5, 8], [7, 8],
        [3, 10], [9, 2], [6, 3]
      ];
      edgesData.forEach(e => insertEdge.run(e));
      insertEdge.finalize();

      console.log('Database seeded successfully.');
    });
  }
});

module.exports = db;
