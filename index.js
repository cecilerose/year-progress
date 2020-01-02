const fs = require("fs");
const Twitter = require("twitter-lite");
const dotenv = require("dotenv");
const log = require("./log.json");

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
  const roundedProgress = progress;
  const totalSlots = 10;
  const fullSlots = Math.ceil((roundedProgress * totalSlots) / 100);
  const emptySlots = totalSlots - fullSlots;
  const unicodeFull = "🔵";
  const unicodeEmpty = "⚪️";
  const barFull = unicodeFull.repeat(fullSlots);
  const barEmpty = unicodeEmpty.repeat(emptySlots);

  return `${barFull}${barEmpty} ${roundedProgress}%`;
}
function hasPercentageChanged(percentage) {
  const arePercentagesTheSame = log.percentage === percentage;
  return !arePercentagesTheSame;
}

const yearProgress = Math.ceil(getYearProgress());
const progressBar = getProgressBar(yearProgress);
const percentageHasChanged = hasPercentageChanged(yearProgress);

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

if (percentageHasChanged) {
  client
  .post("statuses/update", {
    status: progressBar
  })
  .then(data => {
    console.log(data);
    
    const newLog = {
      percentage: yearProgress
    };

    fs.writeFileSync("log.json", JSON.stringify(newLog));
  })
  .catch(err => {
    console.error("errors:", err.errors.map(error => error.message).join(", "));
  });
} else {
  console.log("the percentage has not changed, quitting.");
}
