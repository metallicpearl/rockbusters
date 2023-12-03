
import moment from "moment/moment";

const dbUrl = 'https://rbanswers-15f6.restdb.io/rest/top-25-scores';
const dbMasterKey = '03ea6b0ec6848c82bc24262f90437f9378af0';
const dbCorsKey = '656b0a25d8bcace6ca9d19e4';


async function getData()
{

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

async function removeData(idsToDelete)
{
  var myHeaders = new Headers();
  myHeaders.append("apikey", dbMasterKey);

  var requestOptions = {
  method: 'DELETE',
  headers: myHeaders,
  redirect: 'follow'
};

var url = dbUrl +'/*?q={}';

await fetch(url, requestOptions)
  .then(response => response())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}



async function pushNewData(tempHoldArray)
{
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

export async function Process([tally,elapsedseconds,name])
{
    
    var tempHoldArray = [];
    var idsToDelete = [];
    tempHoldArray.push(await JSON.parse(`{"name" : "${name}", "score" : "${tally}", "time" : "${elapsedseconds}"}`));
    var existingData = JSON.parse(await getData());
    var currentRecordCount = await existingData.length;
    for (var x = 0;x < currentRecordCount;x++)
    {
        var newname = await existingData[x]['name'];
        var newscore = await existingData[x]['score'];
        var newtime = await existingData[x]['time'];
        var currentdate = moment(Date.now()).format('YYYY-MM-DD');
        var valueToAdd = JSON.parse(`{"name" : "${newname}", "score" : "${newscore}", "time" : "${newtime}", "date": "${currentdate}"}`);
        tempHoldArray.push(await valueToAdd);
    }

    for (var x = 0;x < currentRecordCount;x++)
    {
      var idToDelete = await existingData[x]['_id']
      idsToDelete.push(JSON.stringify('_id') +":" + JSON.stringify(idToDelete));
    }

    var result = tempHoldArray.sort((a, b) => {   
        var timeA = a["time"];
        var timeB = b["time"];
        var scoreA = a.score;
        var scoreB = b.score;
        return scoreB - scoreA || timeA - timeB 
    });


      const arrayShorten = async () => {
        if (tempHoldArray.length > 25)
        {
          tempHoldArray.length = 25
        };
      } 

      console.log(tempHoldArray);
      await removeData(idsToDelete);
      await arrayShorten();
      await pushNewData(tempHoldArray);
      
  
  }

function sortValues(value){return function
 compare(a, b) {    
    if (a[value] < b[value]) {    
      return 1;    
    }    
    if (a[value] > b[value]) {    
      return -1;    
    }    
    return 0;    
  } }