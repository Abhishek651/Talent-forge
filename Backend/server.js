// 1. Load environment variables FIRST
require('dotenv').config();

// 2. Import your app, services, and database AFTER dotenv
const app = require('./src/app');
const {generateInterviewReport} = require('./src/services/ai.service.js');
const {jobDescription, resume, selfDescription} = require('./src/services/sample-user-data');
const connectDB = require('./src/config/database');

// 3. Connect to DB and invoke the AI test
connectDB();




// ai report call test
// generateInterviewReport(jobDescription, resume, selfDescription);

// 4. Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});