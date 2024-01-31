require("dotenv").config();
const app = require("./app");
const https = require('https');
const fs = require('fs');

const port = process.env.PORT;
 https.createServer({
  cert: fs.readFileSync('./localhost.crt'),
  key: fs.readFileSync('./localhost.key')
},app ).listen(port);

// app.listen(port, () => {
//   console.log(`Server is running at port ${port}`);
// });
