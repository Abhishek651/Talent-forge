// 1. Load environment variables FIRST
require('dotenv').config();

// 2. Import your app, services, and database AFTER dotenv
const app = require('./src/app');
const {generateInterviewReport} = require('./src/services/ai.service.js');
// const {jobDescription, resume, selfDescription} = require('./src/services/sample-user-data');
const connectDB = require('./src/config/database');
// const nvidiaService = require('./src/services/nvidia.api.js')
// const {openRouterService} = require('./src/services/openrouter.api.js')
// const aiService = require('./src/services/provider.js');



// 3. Connect to DB and invoke the AI test
connectDB();

// nvidiaService().then((data) => {
//     console.log(data);
// });

// const response = async()=> await openRouterService();
// response();

// let response;
// async function getResponse(){
//     response = await aiService();
//     console.log(response)
// };
// getResponse()

// ai report call test
// generateInterviewReport(jobDescription, resume, selfDescription);

// 4. Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
