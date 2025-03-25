import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect('mongodb+srv://vickydgl2000:dRCllcfvcmTs8jzq@cluster0.wrddl.mongodb.net/', {
      dbName: "RESERVATIONS",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log(`Some error occured while connecing to database: ${err}`);
    });
};