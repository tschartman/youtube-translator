"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubtitles = void 0;
const he_1 = __importDefault(require("he"));
const axios_1 = __importDefault(require("axios"));
const lodash_1 = require("lodash");
const striptags_1 = __importDefault(require("striptags"));
function getSubtitles({ videoID, lang = 'en', }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(videoID);
        // * ensure we have access to captions data
        if (!data.includes('captionTracks'))
            throw new Error(`Could not find captions for video: ${videoID}`);
        const regex = /"captionTracks":(\[.*?\])/;
        const execResult = regex.exec(data);
        if (!execResult)
            throw new Error("could not extract caption tracks from data");
        const [match] = regex.exec(data) || [];
        const { captionTracks } = JSON.parse(`{${match}}`);
        const subtitle = (0, lodash_1.find)(captionTracks, {
            vssId: `.${lang}`,
        }) ||
            (0, lodash_1.find)(captionTracks, {
                vssId: `a.${lang}`,
            }) ||
            (0, lodash_1.find)(captionTracks, ({ vssId }) => vssId && vssId.match(`.${lang}`));
        // * ensure we have found the correct subtitle lang
        if (!subtitle || (subtitle && !subtitle.baseUrl))
            throw new Error(`Could not find ${lang} captions for ${videoID}`);
        const { data: transcript } = yield axios_1.default.get(subtitle.baseUrl);
        const lines = transcript
            .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', '')
            .replace('</transcript>', '')
            .split('</text>')
            .filter((line) => line && line.trim())
            .map((line) => {
            const startRegex = /start="([\d.]+)"/;
            const durRegex = /dur="([\d.]+)"/;
            const [, start] = startRegex.exec(line) || [];
            const [, dur] = durRegex.exec(line) || [];
            const htmlText = line
                .replace(/<text.+>/, '')
                .replace(/&amp;/gi, '&')
                .replace(/<\/?[^>]+(>|$)/g, '');
            const decodedText = he_1.default.decode(htmlText);
            const text = (0, striptags_1.default)(decodedText);
            return {
                start,
                dur,
                text,
            };
        });
        return lines;
    });
}
exports.getSubtitles = getSubtitles;
//# sourceMappingURL=parser.js.map