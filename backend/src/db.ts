import mongoose, { mongo } from 'mongoose';


export const connectDB = (uri:string) => {
  return mongoose.connect(uri)
}

// mongoose.connect(MONGO_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   });


// const mongoose = require("mongoose");

// const connectDB = async (url) => {
//   try {
//     await mongoose.connect(url);
//     console.log("Mongo db connected");
//   } catch (error) {
//     console.log(error.message);
//     // process.exit(0);
//   }
// };

// module.exports = connectDB;
