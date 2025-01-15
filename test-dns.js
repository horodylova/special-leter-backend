const dns = require('dns');

dns.lookup('db.zdyhayhguzfcjuilwnua.supabase.co', (err, address, family) => {
  if (err) {
    console.error("DNS Lookup Error:", err.message);
  } else {
    console.log("Supabase Host Address:", address, "Family:", family);
  }
});