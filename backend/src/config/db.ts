import mongoose from 'mongoose';

let server: any = null; // Keep track of the server instance

export const connectDB = (URL: string, PORT: any, app: any) => {
  if (server) {
    console.log(`Server is already running on port ${PORT}`);
    return;
  }

  mongoose
    .connect(URL)
    .then(() => {
      server = app
        .listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        })
        .on('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            console.error(
              `Port ${PORT} is already in use. Please use a different port or kill the process using the port.`
            );
          } else {
            console.error('Server error:', err);
          }
        });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
};

export const closeServer = async () => {
  await mongoose.connection.close();
  await server.close();
};
