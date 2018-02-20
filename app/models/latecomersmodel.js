const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const date = new Date();
let hh = date.getHours();
let mm = date.getMinutes();
let month = date.getMonth() + 1;
hh = hh < 10 ? '0' + hh : hh;
mm = mm < 10 ? '0' + mm : mm;
month = month < 10 ? '0' + month : month;
const day = `${date.getDate()}.${month}.${date.getFullYear()}`;
const hour = `${hh}:${mm}`;

function comingLate(hours, minutes) {
  let hoursToMinutes;
  let totalLate;
  if (hours < 9) {
    totalLate = 0;
  } else if (hours === 9) {
    totalLate = minutes;
  } else if (hours > 9) {
    hoursToMinutes = (hours - 9) * 60;
    totalLate = minutes + hoursToMinutes;
  }
  return totalLate;
}
/*
let start = moment.duration('09:15', 'HH:mm');
let end = moment.duration()
*/

const lateComersSchema = new Schema({
  name: { type: String },
  day: { type: String, default: day },
  hour: { type: String, default: hour },
  minLate: { type: String, default: comingLate(date.getHours(), date.getMinutes()) }
});

const LateComer = mongoose.model('latecomers', lateComersSchema);
module.exports = LateComer;
