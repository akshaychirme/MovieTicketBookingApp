import express from 'express';
import path from 'path';
import authRoute from './routes/auth';
import basicAuth  from './middleware/basicAuth'; 
import { checkAdminRole } from './middleware/checkAdminRole';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

//server static files
app.use(express.static(path.join(__dirname, '../public')));

// Define the registration and login routes
app.use('/auth', authRoute);

app.get('/adminDashboard.html', basicAuth, checkAdminRole, (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'adminDashboard.html'));
  });

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`server is running at http://localhost:${PORT}`);
})
