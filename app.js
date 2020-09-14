'use strict';
// fs(File System) モジュールを読み込んで使えるようにする
const fs = require('fs');
// readline モジュールを読み込んで使えるようにする
const readline = require('readline');
//popu-pref.csv をファイルとして読み込める状態にする
const rs = fs.createReadStream('./popu-pref.csv');
// readline モジュールに rs を設定する
const rl = readline.createInterface({ input: rs, output: {} });
 // key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
// popu-pref.csv のデータを一行ずつ読み込んで、設定された関数を実行する
rl.on('line', lineString => {
  // ["2010", "北海道", "237155", "258530"]のようなデータ配列に分配
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);　// 年
  const prefecture = columns[1]; // 都道府県名
  const popu = parseInt(columns[3]);// 15～19歳の人口
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});


rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
      value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value], i) => {
      return  (i + 1) + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });
    console.log(rankingStrings);
  });
