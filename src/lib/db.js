import mongoose from "mongoose";

export const connectDB = () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to database.");

    return;
  }

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("Successfully connected to database"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectDB, 5000);
    });
};
