import 'dotenv/config';
import express from 'express';
import ConnectDB from './utils/db.js';
import router from './routes/authRoutes.js';
const app = express();
app.use(express.json());


app.use('/api/auth', router);

const PORT = process.env.PORT || 5000;

ConnectDB().then(() => {

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

});



