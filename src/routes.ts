import express from 'express';
import { authenticateToken } from './middleware';
import CaptionsController from './controller';

const router = express.Router();

router.post('/captions', authenticateToken, async (req, res) => {
    const controller = new CaptionsController();
    try {
      const script = await controller.getCaptions(req.body);
      res.status(200).send(script)
    } catch (err) {
      res.status(200).send("Could not find the script for that video")
    }
})

export default router;