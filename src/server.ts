import express from 'express';
import morgan from "morgan";
import dotenv from 'dotenv';
import swaggerUi from "swagger-ui-express";
import { getSubtitles } from './parser';
import {Post, Route} from "tsoa";
import CaptionsController from './controller';

dotenv.config();

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
  
app.post('/captions', async (req, res) => {
    const controller = new CaptionsController();
    const script = controller.getCaptions(req.body); 

    res.status(200).send(script)
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});