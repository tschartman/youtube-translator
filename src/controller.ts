import {Post, Route, Body} from "tsoa";
import { getSubtitles } from "./parser";

interface CaptionResponse {
  script: string
}

@Route("captions")
export default class CaptionsController {
  @Post("/")
  public async getCaptions(@Body() youtubeUrl: string): Promise<CaptionResponse> {
    const data = await getSubtitles({videoID: youtubeUrl, lang: 'en'})
    const script = data.map((obj: { text: string; }) => {
      return obj.text
    }).join(" ")
    return {
      script 
    }
  }
}