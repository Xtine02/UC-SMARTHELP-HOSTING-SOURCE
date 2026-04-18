require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Get a student user
    const [users] = await conn.query('SELECT user_id, email, role FROM users WHERE role = "student" LIMIT 1');
    if (users.length === 0) {
      console.log('No student users found');
      process.exit(0);
    }
    
    const studentId = users[0].user_id;
    const studentEmail = users[0].email;
    console.log(`Using student: ${studentEmail} (ID: ${studentId})`);

    // Create a test ticket backdated to 3 minutes ago
    const backdate = new Date(Date.now() - 3 * 60 * 1000);
    const [ticketResult] = await conn.execute(
      `INSERT INTO tickets (user_id, subject, description, status, department, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [studentId, 'Debug Test Ticket', 'This is a test ticket for debugging', 'pending', 'General', backdate]
    );
    
    const ticketId = (ticketResult).insertId;
    console.log(`✅ Created test ticket ${ticketId} with created_at = ${backdate.toISOString()}`);

    // Show current notifications for this user
    const [notificationsBefore] = await conn.query(
      'SELECT notification_id, type, title, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [studentId]
    );
    console.log(`\nNotifications BEFORE overdue check (user ${studentId}):`);
    console.log(notificationsBefore);

    console.log(`\n⏳ Waiting 70 seconds for checkOverdueTickets to run...`);
    await new Promise(resolve => setTimeout(resolve, 70000));

    // Show notifications after
    const [notificationsAfter] = await conn.query(
      'SELECT notification_id, type, title, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [studentId]
    );
    console.log(`\nNotifications AFTER overdue check (user ${studentId}):`);
    console.log(notificationsAfter);

    // Check ticket status
    const [tickets] = await conn.query('SELECT ticket_id, status FROM tickets WHERE ticket_id = ?', [ticketId]);
    console.log(`\nTicket status:`, tickets[0]);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await conn.end();
  }
})();
