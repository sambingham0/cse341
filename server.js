const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const app = express();
const PORT = 8080;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Parse JSON request bodies
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', function(req, res, next) {
  // Dynamically set the host based on the request
  swaggerDocument.host = req.get('host');
  swaggerDocument.schemes = req.protocol === 'https' ? ['https'] : ['http'];
  req.swaggerDoc = swaggerDocument;
  next();
}, swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup());

// Also serve the swagger.json for download
app.get('/api-docs/swagger.json', (req, res) => {
  const dynamicSwagger = { ...swaggerDocument };
  dynamicSwagger.host = req.get('host');
  dynamicSwagger.schemes = req.protocol === 'https' ? ['https'] : ['http'];
  res.json(dynamicSwagger);
});

// MongoDB Atlas connection
require('dotenv').config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Routes
const indexRouter = require('./routes/index');
const contactsRouter = require('./routes/contacts');
app.use('/', indexRouter);
app.use('/contacts', contactsRouter);

let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db('professionalDB');
    app.locals.db = db;
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}


startServer();

// Gracefully close MongoDB connection on shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await client.close();
  process.exit(0);
});