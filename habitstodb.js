/*
* SETUP
*/

var sqlite3 = require('sqlite3');
var xlsx = require('node-xlsx');
var fs = require('fs');

// db configuration
 var db = new sqlite3.Database('./bwomtest.db');


var xlsarray = xlsx.parse(__dirname + '/excels/Prevención_Pérdidas_Orina.xlsx'); 

//fs.writeFile('helloworld.txt', JSON.stringify(xlsarray), function (err) {
//  if (err) return console.log(err);
//});

//var parsresul = xlsarray[1].data[2][4];
//console.log("CELL HTML: " + parsresul);

var k = 1;  //this is the tab variable, 0: intro, 1: habits, 2: curiosities
var rows = 5; //depending on each tab
var re = new RegExp("<li>");
var goal = "PPO";

  for (var i = 1; i <rows; i++) { //For all rows except header
    for (var j = 0; j <xlsarray[k].data[i].length; j++) { //for all columns

        var teststring = xlsarray[k].data[i][j];
        var flagli = 0;

        if(j==0) {var week = teststring;}
        if(j==1) {var title_es = teststring;}
        if(j==2) {var title_en = teststring;}

        if(j==3) { //content_es

          if(!teststring.startsWith("<p>") && undefined != teststring){

            var description_es = teststring.replace(/\r\n-{1}/, "<ul><li>");
            description_es = description_es.replace(/\r\n-/g, "</li><li>");

            description_es = description_es.replace(/\r\n1.{1}/, "<ol><li>");
            description_es = description_es.replace(/\r\n[2-9]./g, "</li><li>");
            
            description_es = description_es.replace(/\r\n\r\n/g, "</p><p>");
            description_es = description_es.replace(/\r\n/g, "<br/>");
            description_es = description_es.replace(/^/,"<p>");
            description_es = description_es.replace(/$/,"</p>");

            flagli = re.test(description_es); 

          }
        }
        if(j==4) { //content_en

          if(!teststring.startsWith("<p>") && undefined != teststring){

            var description_en = teststring.replace(/\r\n-{1}/, "<ul><li>");
            description_en = description_en.replace(/\r\n-/g, "</li><li>");

            description_en = description_en.replace(/\r\n1.{1}/, "<ol><li>");
            description_en = description_en.replace(/\r\n[2-9]./g, "</li><li>");

            description_en = description_en.replace(/\r\n\r\n/g, "</p><p>");
            description_en = description_en.replace(/\r\n/g, "<br/>");
            description_en = description_en.replace(/^/,"<p>");
            description_en = description_en.replace(/$/,"</p>");

            flagli = flagli || re.test(description_en); 

          }
        }
    }
if(flagli) console.log("FOUND");
    //db.serialize(function() {
    db.run("INSERT INTO habits (title_es, description_es, title_en, description_en, week, flagli, goal) VALUES(?, ?, ?, ?, ?, ?, ?);", title_es, description_es, title_en, description_en, week, flagli, goal, function(err, result) {

        if (err) return console.log(err);
        //res.json(result);
    });
    //});

  }
