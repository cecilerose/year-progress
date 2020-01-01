const Twitter = require("twitter-lite");
const dotenv = require("dotenv");

dotenv.config();

function getYearProgress() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const firstDayOfTheYear = new Date(`${currentYear}-01-01`);
  const diffInMilliseconds =
    currentDate.getTime() - firstDayOfTheYear.getTime();
  const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
  const yearProgress = (diffInDays * 100) / 365;

  return yearProgress;
}
function getProgressBar(progress) {
  const roundedProgress = Math.ceil(progress);
  const totalSlots = 15;
  const fullSlots = Math.ceil((roundedProgress * totalSlots) / 100);
  const emptySlots = totalSlots - fullSlots;
  const unicodeFull = "⬛";
  const unicodeEmpty = "⬜";
  const barFull = unicodeFull.repeat(fullSlots);
  const barEmpty = unicodeEmpty.repeat(emptySlots);

  return `${barFull}${barEmpty} ${roundedProgress}%`;
}

const yearProgress = getYearProgress();
const progressBar = getProgressBar(yearProgress);

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

client
  .post("statuses/update", {
    status: progressBar
  })
  .then(data => console.log(data))
  .catch(err => console.error(err));
