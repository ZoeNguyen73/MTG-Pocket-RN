import { sets } from "../../constants";

const SET_LIST_CODE = [
  "blb",
  "dsk",
  "fdn",
  "dft",
  "tdm",
  "fin",
  "eoe",
  "spm",
  "tla"
];

const generateSetListData = () => {
  const arr = [];
  for (let i = 0; i < SET_LIST_CODE.length; i++) {
    const code = SET_LIST_CODE[i];
    const setData = sets[code];
    const set = {
      code,
      play_booster_image: setData.play_booster,
      collector_booster_image: setData.collector_booster,
    };
    arr.push(set);
  }

  return arr;
};

export default generateSetListData;