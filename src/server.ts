import express from 'express';
import dotenv from 'dotenv';
import { getSubtitles } from './parser';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.send('Welcome')
})
  
app.post('/captions', async (req, res) => {

  const {youtubeUrl} = req.body;
  if (!youtubeUrl) {
    res.status(400).send('youtubeUrl is required');
  } else {
    const data = await getSubtitles({videoID: youtubeUrl, lang: 'en'})
    const script = data.map((obj: { text: string; }) => {
      return obj.text
    }).join(" ")
    res.status(200).send(script)
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});