  // Server ko start krna
  // databae se connect krna

  const app = require('./app')

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
    
  })