import mongoose, { ConnectOptions } from "mongoose";

const connectionURL = `mongodb+srv://${process.env.MONGODB_CREDENTIALS}@pukemon.bgib8be.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(connectionURL, {
    useNewUrlParser: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });
