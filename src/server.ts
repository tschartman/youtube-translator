import express from 'express';
import morgan from "morgan";
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import router from './routes';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET:string = process.env.JWT_SECRET as string;

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("tiny"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

app.get('/', (req, res) => {
  return res.send('Welcome')
})

app.use(router)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});