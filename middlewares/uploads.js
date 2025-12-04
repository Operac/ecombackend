const multer = require("multer");
// store files in memory as Buffer
const storage = multer.memoryStorage();

// gain access to the stored files
const uploads = multer({storage});

// export the middleware to allow stored files accessable for pushing to database
module.exports= uploads