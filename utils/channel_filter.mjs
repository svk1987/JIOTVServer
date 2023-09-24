import express from "express";
const router = express.Router();
import fs from "fs";

const genreMap = {
  8: "Sports",
  5: "Entertainment",
  6: "Movies",
  12: "News",
  13: "Music",
  7: "Kids",
  9: "Lifestyle",
  10: "Infotainment",
  15: "Devotional",
  16: "Business",
  17: "Educational",
  18: "Shopping",
  19: "JioDarshan",
};

const languageMap = {
  6: "English",
  1: "Hindi",
  2: "Marathi",
  3: "Punjabi",
  4: "Urdu",
  5: "Bengali",
  7: "Malayalam",
  8: "Tamil",
  9: "Gujarati",
  10: "Odia",
  11: "Telugu",
  12: "Bhojpuri",
  13: "Kannada",
  14: "Assamese",
  15: "Nepali",
  16: "French"
};

router.post("/channel_filter", (req, res) => {
  let genre = req.body.category || [];
  var unwanted_category = {...genreMap};

  let language = req.body.language || [];
  var unwanted_language = {...languageMap};

  let channel = req.body.channel || [];
  var channelsList = getJsonFileFromFileSystem('channels.jiotv').result;

  unwanted_category = createUnwantedList(genre, unwanted_category);
  unwanted_language = createUnwantedList(language, unwanted_language);
  var unwanted_channels = {};
  for (let c of channelsList) {
    if (!(c.channelCategoryId in unwanted_category || c.channelLanguageId in unwanted_language  || c.channel_id in channel) ){
      unwanted_channels[c.channel_id] = c.channel_name;
    }
  }  

  var response =  { "unwanted_category": unwanted_category, 'unwanted_language': unwanted_language, 'unwanted_channels': unwanted_channels };
  fs["writeFileSync"]("./channels_filtered.json",  JSON.stringify(response));
  res.redirect("customize");
});

function createUnwantedList(src, unwanted_list) {
  for (var key in unwanted_list){
    if(src.includes(key)) {
    delete unwanted_list[key]; 
    }
  }
  return unwanted_list;
}

function getJsonFileFromFileSystem(filePath) {
  let file_f;
  if (fs["existsSync"](filePath)) {
    file_f = JSON.parse(
    fs["readFileSync"](filePath, { encoding: "utf8", flag: "r" })
  );
  }
  return file_f;
}

router.get("/channel_filter", (req, res) => {

  let channel_filter_file = getJsonFileFromFileSystem('channels_filtered.json');
  var channelsList = getJsonFileFromFileSystem('channels.jiotv').result;
  var unwanted_channels = channel_filter_file['unwanted_channels'] || {};
  var unwanted_category = channel_filter_file['unwanted_category'] || {};
  var unwanted_language = channel_filter_file['unwanted_language'] || {};

  var categories = [];
  var jsonData;
  for (var key  in genreMap) {
    jsonData = {};
    jsonData['id'] = key;
    jsonData['value'] = genreMap[key];
    jsonData['wanted'] = !(key in unwanted_category);
    categories.push(jsonData);
  }

  var languages = [];
  for (var key  in languageMap) {
    jsonData = {};
    jsonData['id'] = key;
    jsonData['value'] = languageMap[key];
    jsonData['wanted'] = !(key in unwanted_language);
    languages.push(jsonData);
  }

  var channels = [];
  for (let resData of channelsList) {
    jsonData = {};
    jsonData['language'] = languageMap[resData.channelLanguageId];
    jsonData['category'] = genreMap[resData.channelCategoryId];
    jsonData['channel_id'] = resData.channel_id;
    jsonData['channel_name'] = resData.channel_name;
    jsonData['disabled'] = (resData.channelCategoryId in unwanted_category || resData.channelLanguageId in unwanted_language);
    // (resData.channel_id in channel_filter_file['unwanted_channels']) || (resData.channel_id in channel_filter_file['unwanted_language'])

    jsonData['value'] = languageMap[resData.channelLanguageId] + '|' + genreMap[resData.channelCategoryId] + '|' + resData.channel_id +' : ' + resData.channel_name;
    jsonData['wanted'] = !(resData.channel_id in unwanted_channels) && !jsonData['disabled'];
    channels.push(jsonData);
  }  

  channels.sort(function(a, b){
    return a.disabled - b.disabled;
});

  res.status(200).send({ categoryMap: categories, languageMap: languages, channels: channels });
});

export default router;