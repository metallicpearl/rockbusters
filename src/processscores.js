
import moment from "moment/moment";
import { getSecrets } from "./secrets";



let dbUrl = undefined;
let dbMasterKey = undefined;
let dbCorsKey = undefined;

let savedValueToCheck = "";

async function getData() {

  var secrets = getSecrets();
  dbUrl = secrets[0]['dbUrl'];
  dbMasterKey = secrets[1]['dbMasterKey'];
  dbCorsKey = secrets[2]['dbCorsKey'];

  var x;
  var myHeaders = new Headers();
  myHeaders.append('apikey', dbCorsKey);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  await fetch(dbUrl, requestOptions)
    .then(async response => x = response.text());
  return x;

}

async function removeData(idsToDelete) {
  var myHeaders = new Headers();
  myHeaders.append("apikey", dbMasterKey);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  var url = dbUrl + '/*?q={}';

  await fetch(url, requestOptions)
    .then(response => response())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}



async function pushNewData(tempHoldArray) {
  var myHeaders = new Headers();
  myHeaders.append("apikey", dbMasterKey);
  myHeaders.append("Content-Type", "application/json");
  var arrHold = Array.from(tempHoldArray);

  var x;

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(arrHold),
    redirect: 'follow'
  };

  await fetch(dbUrl, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}


export async function Process([tally, elapsedseconds, name]) {

  try {

    if ([tally, elapsedseconds, name] != null) {
      var tempHoldArray = [];
      var idsToDelete = [];
      if (name == "")
      {
        name = "[(No name provided)]"
      }
      
      var existingData = JSON.parse(await getData());
      var currentRecordCount = await existingData.length;
      for (var x = 0; x < currentRecordCount; x++) {
        var nameValue = (await existingData[x]['name']);
        var nameBracketsReplaced;
        if (await existingData[x]['new'] == true)
        {
          nameBracketsReplaced = nameValue.replaceAll('[','').replaceAll(']','');
        }
        else
        {
        nameBracketsReplaced = nameValue.replaceAll('[','').replaceAll(']','').replaceAll('<< YOU','').replaceAll('YOU >>','');
        }
        var newname = nameBracketsReplaced;
        if (newname == "[No name provided]" || newname == "" || newname == "[]")
        {
          newname = "(No name provided)"
        }
        var newscore = await existingData[x]['score'];
        var newtime = await existingData[x]['time'];
        var currentdate = moment(Date.now()).format('YYYY-MM-DD');
        var valueToAdd = JSON.parse(`{"name" : "${newname}", "score" : "${newscore}", "time" : "${newtime}", "date": "${currentdate}", "new":"false"}`);
        tempHoldArray.push(await valueToAdd);
      }
      var valueAdd = JSON.parse(`{"name" : "${name}", "score" : "${tally}", "time" : "${elapsedseconds}", "date": "${currentdate}", "new":"true"}`);
      tempHoldArray.push(valueAdd);
      for (var x = 0; x < currentRecordCount; x++) {
        var idToDelete = await existingData[x]['_id']
        idsToDelete.push(JSON.stringify('_id') + ":" + JSON.stringify(idToDelete));
      }
      tempHoldArray.filter((item,
        index) => tempHoldArray.indexOf(item) === index);

      var result = tempHoldArray.sort((a, b) => {
        var timeA = a["time"];
        var timeB = b["time"];
        var scoreA = a.score;
        var scoreB = b.score;
        return scoreB - scoreA || timeA - timeB
      });

      const arrayShorten = async () => {
        if (tempHoldArray.length > 10) {
          tempHoldArray.length = 10
        };
      }

      console.log(tempHoldArray);
      await removeData(idsToDelete);
      await arrayShorten();
      await pushNewData(result);

      var newData = JSON.parse(await getData());
      var newDataLength = newData.length;
      var dataString = "";


      for (var x = 0; x < newDataLength; x++) {
        var name = `${newData[x]['name']}`;
        var score = `${newData[x]['score']}`;
        var time = `${newData[x]['time']}`;
        var newRow = `${newData[x]['new']}`;
        var position = `${x + 1}`
        if (newRow == 'true')
        {
        dataString += `YOU >> ` + `${position}: ${name} - (${score} in ${time} seconds)` +  ` << YOU \n`;
        }
        else
        {
          dataString += `${position}: ${name} - (${score} in ${time} seconds) \n`;
        }
      }
    
      return dataString;
      

      
    }
  }
  catch (x){
    console.log(x);
    return "!! Unable to fetch results - this is likely because the rest database I use for storing results has a rate limit and I'm cheap so I've used the free one so Suzanne can have a new kitchen. Try again later !!"
  }




  function sortValues(value) {
    return function
      compare(a, b) {
      if (a[value] < b[value]) {
        return 1;
      }
      if (a[value] > b[value]) {
        return -1;
      }
      return 0;
    }
  }
}