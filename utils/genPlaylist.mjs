import playlist from "./getJsonPlaylist.mjs";
import fs from "fs";

function getJsonFileFromFileSystem(filePath) {
  let file_f;
  if (fs["existsSync"](filePath)) {
    file_f = JSON.parse(
    fs["readFileSync"](filePath, { encoding: "utf8", flag: "r" })
  );
  }
  return file_f;
}

export default async function genPlaylist(url, c = 0) {
  try {
    let m3u8PlaylistFile =
      '#EXTM3U  x-tvg-url="https://tobalan.github.io/epg.xml.gz"\x0a';
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
      0x10: "Business",
      17: "Educational",
      18: "Shopping",
      19: "JioDarshan",
    };

    const langMap = {
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
      16: "French",
    };

    let channel_filter_file = getJsonFileFromFileSystem('channels_filtered.json');
    var unwanted_category = channel_filter_file['unwanted_category'] || {};
    var unwanted_language = channel_filter_file['unwanted_language'] || {};
    var unwanted_channels = channel_filter_file['unwanted_channels'] || {};

    // fs
    let response = await playlist();

    const ServerUrl = `${url}`;
    for (let resData of response["result"]) {

      if((resData.channelCategoryId in unwanted_category || resData.channelLanguageId in unwanted_language || resData.channel_id in unwanted_channels) && c==1) 
      {
        continue;
      }
      
      const channel_name = resData["channel_name"];
      const channel_number = resData["channel_id"];
      const channelLogoUrl =
        "https://jiotv.catchup.cdn.jio.com/dare_images/images/" +
        resData["logoUrl"];
      var channelCategory = genreMap[resData["channelCategoryId"]];
      var marathi_channels = [691,612,445,755,414,617,442,691,1146,695,736,1151,153,738,232,735,441,422,1159,846,1342,1346,2763,1326,1548,1705,1706,1217,1223,1228,1273,1293,1358,1360,1412,1419,1420,1422,1423,1424,1452,1894,1933,1972,2071,2254,2424,2758];
        if (marathi_channels.includes(resData["channel_id"])) {
          channelCategory = 'Marathi';
        }



      
      const channelLanguage = langMap[resData["channelLanguageId"]];
      const logoUrl = resData["logoUrl"].split(".")[0];
      m3u8PlaylistFile += `#EXTINF:-1 tvg-chno="${channel_number}" tvg-name="${channel_name}" tvg-logo="${channelLogoUrl}" tvg-language="${channelLanguage}" tvg-type="${channelCategory}" group-title="${channelCategory}"`;
      if (resData["isCatchupAvailable"]) {
        m3u8PlaylistFile += ` catchup="vod" catchup-source="${ServerUrl}/catchup/getm3u8/\${start}/\${end}/${channel_number}/index.m3u8" catchup-days="7"`;
      }
      m3u8PlaylistFile += `, ${channel_name}\x20\x0a`;
      m3u8PlaylistFile +=
        ServerUrl +
        "/getm3u8/" +
        resData["channel_id"] +
        "/master.m3u8" +
        "\x0a";
    }
    m3u8PlaylistFile += `#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_HD.png" group-title="Sony Liv",SONY HD
https://dai.google.com/linear/hls/event/dBdwOiGaQvy0TA1zOsjV6w/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_SAB_HD.png" group-title="Sony Liv",SONY SAB HD
https://dai.google.com/linear/hls/event/CrTivkDESWqwvUj3zFEYEA/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_Pal.png" group-title="Sony Liv",SONY PAL
https://dai.google.com/linear/hls/event/dhPrGRwDRvuMQtmlzppzQQ/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_Pix_HD.png" group-title="Sony Liv",SONY PIX HD
https://dai.google.com/linear/hls/event/x7rXWd2ERZ2tvyQWPmO1HA/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/SET_MAX.png" group-title="Sony Liv",SONY MAX
https://dai.google.com/linear/hls/event/Oc1isQAET3WaNPoABfScmg/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_Max_HD.png" group-title="Sony Liv",SONY MAX HD
https://dai.google.com/linear/hls/event/UcjHNJmCQ1WRlGKlZm73QA/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_MAX2.png" group-title="Sony Liv",SONY MAX2
https://dai.google.com/linear/hls/event/MdQ5Zy-PSraOccXu8jflCg/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_Wah.png" group-title="Sony Liv",SONY WAH
https://dai.google.com/linear/hls/event/gX5rCBf6Q7-D5AWY-sovzQ/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_Pix_SD.png" group-title="Sony Liv",SONY PIX HD
https://dai.google.com/linear/hls/event/x7rXWd2ERZ2tvyQWPmO1HA/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Ten_HD.png" group-title="Sony Liv",SONY TEN 1 HD
https://dai.google.com/linear/hls/event/wG75n5U8RrOKiFzaWObXbA/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Ten2_HD.png" group-title="Sony Liv",SONY TEN 2 HD
https://dai.google.com/linear/hls/event/V9h-iyOxRiGp41ppQScDSQ/master.m3u8
#EXTINF:-1 tvg-logo="https://jiotv.catchup.cdn.jio.com/dare_images/images/Ten_2.png" group-title="Sony Liv",SONY TEN 2
https://dai.google.com/linear/hls/event/LK-ik89MQIi_pWBbg74KNQ/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Ten3_HD.png" group-title="Sony Liv",SONY TEN 3 HD
https://dai.google.com/linear/hls/event/ltsCG7TBSCSDmyq0rQtvSA/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Ten_3.png" group-title="Sony Liv",SONY TEN 3
https://dai.google.com/linear/hls/event/BCOFZq1JQjq12fmaO6lAAA/master.m3u8
#EXTINF:-1 tvg-logo="https://www.sonypicturesnetworks.com/images/logos/SONY_SportsTen4_HD_Logo_CLR.png" group-title="Sony Liv",SONY TEN 4 HD
https://pubads.g.doubleclick.net/ssai/event/tNzcW2ZhTVaViggo5ocI-A/master.m3u8
#EXTINF:-1 tvg-logo="https://www.sonypicturesnetworks.com/images/logos/SONY_SportsTen4_HD_Logo_CLR.png" group-title="Sony Liv",SONY TEN 4
https://dai.google.com/linear/hls/event/smYybI_JToWaHzwoxSE9qA/master.m3u8
#EXTINF:-1 tvg-logo="https://www.sonypicturesnetworks.com/images/logos/SONY_SportsTen5_HD_Logo_CLR.png" group-title="Sony Liv",SONY TEN 5 HD
https://dai.google.com/linear/hls/event/Sle_TR8rQIuZHWzshEXYjQ/master.m3u8
#EXTINF:-1 tvg-logo="https://www.sonypicturesnetworks.com/images/logos/SONY_SportsTen5_HD_Logo_CLR.png" group-title="Sony Liv",SONY TEN 5
https://dai.google.com/linear/hls/event/r-eLp41YTHWTagvQSXFtAQ/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_BBC_Earth_HD.png" group-title="Sony Liv",SONY BBC EARTH
https://dai.google.com/linear/hls/event/6bVWYIKGS0CIa-cOpZZJPQ/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_Yay_Hindi.png" group-title="Sony Liv",SONY YAY
https://dai.google.com/linear/hls/event/GPY7RqOrSkmKJ8z1GbVNhg/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_Marathi_SD.png" group-title="Sony Liv",SONY MARATHI
https://dai.google.com/linear/hls/event/I2phC6tgTDuJngxw9gJgPw/master.m3u8
#EXTINF:-1 tvg-logo="http://jiotv.catchup.cdn.jio.com/dare_images/images/Sony_aath.png" group-title="Sony Liv",SONY AATH 
https://dai.google.com/linear/hls/event/j-YEIDwORxubtP_967VcZg/master.m3u8`;
    return m3u8PlaylistFile;
  } catch (error) {
    console.error(error);
    return "";
  }
}

