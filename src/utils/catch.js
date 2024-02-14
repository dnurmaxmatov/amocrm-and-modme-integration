import environments from "../config/environments.js";
import axios from "axios";

const catchFn =(error, msg)=>{
  console.log(error);
    axios.post(
      `https://api.telegram.org/bot${environments.BOT_TOKEN}/sendMessage`,
      {
        chat_id: environments.CHAT_ID,
        text: `*${msg}*\n\n${error}`,
        parse_mode: "Markdown"
      }
    );
  }

export default catchFn;
