import mongoose from 'mongoose';

let server: any;

export const connectDB = (URL: any, PORT: any, app: any) => {
  if (!server) {
    mongoose
      .connect(URL)
      .then(() => {
        server = app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
      });
  }
};

export const closeServer = async () => {
  await mongoose.connection.close();
  await server.close();
};
