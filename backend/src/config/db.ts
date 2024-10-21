import mongoose from 'mongoose';

let server: any;

export const connectDB = (PORT: any, app: any) => {
  mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
};

export const closeServer = () => {
  server?.close(); // Close the server if it exists
};
