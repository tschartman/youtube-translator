import {Post, Route, Body} from "tsoa";
import { getSubtitles } from "./parser";

interface CaptionRequest {
  url: string,
  lang: 'en' | 'de' | 'fr' | void
}

interface CaptionResponse {
  script: string
}

@Route("captions")
export default class CaptionsController {
  @Post("/")
  public async getCaptions(@Body() request: CaptionRequest): Promise<CaptionResponse> {
    const data = await getSubtitles({videoID: request.url, lang: request.lang})
    const script = data.map((obj: { text: string; }) => {
      return obj.text
    }).join(" ")
    return script
  }
}