/*
* SETUP
*/

var sqlite3 = require('sqlite3');
var xlsx = require('node-xlsx');
var fs = require('fs');

// db configuration
 var db = new sqlite3.Database('./bwomtest.db');

var xlsarray = xlsx.parse(__dirname + '/excels/Prevenir_Prolapso.xlsx'); 

var k = 2; //this is the tab variable, 0: intro, 1: habits, 2: curiosities
var rows = 17; //depending on how many data rows in tab
var re = new RegExp("<li>");
var goal = "PP";

  for (var i = 1; i <rows; i++) { //For all rows except header //xlsarray[k].data.length should work....
    for (var j = 0; j <xlsarray[k].data[i].length; j++) { //for all columns

        var teststring = xlsarray[k].data[i][j];
        var flagli = 0;

        if(j==0) {var day = teststring;}
        if(j==1) {var subtitle_es = teststring;}
        if(j==3) {var subtitle_en = teststring;}

        if(j==2) { //content_es

          if(!teststring.startsWith("<p>") && undefined != teststring){

            var content_es = teststring.replace(/\r\n-{1}/, "<ul><li>"); 
            content_es = content_es.replace(/\r\n-/g, "</li><li>");

            content_es = content_es.replace(/\r\n1.{1}/, "<ol><li>");
            content_es = content_es.replace(/\r\n[2-9]./g, "</li><li>");

            content_es = content_es.replace(/\r\n\r\n/g, "</p><p>");
            content_es = content_es.replace(/\r\n/g, "<br/>");
            content_es = content_es.replace(/^/,"<p>");
            content_es = content_es.replace(/$/,"</p>");

            flagli = re.test(content_es); 

          }
        }
        if(j==4) { //content_en

          if(!teststring.startsWith("<p>") && undefined != teststring){
  
            var content_en  = teststring.replace(/\r\n-{1}/, "<ul><li>");
            content_en = content_en.replace(/\r\n-/g, "</li><li>");

            content_en = content_en.replace(/\r\n1.{1}/, "<ol><li>");
            content_en = content_en.replace(/\r\n[2-9]./g, "</li><li>");

            content_en = content_en.replace(/\r\n\r\n/g, "</p><p>");
            content_en = content_en.replace(/\r\n/g, "<br/>");
            content_en = content_en.replace(/^/,"<p>");
            content_en = content_en.replace(/$/,"</p>");

            flagli = flagli || re.test(content_en); 

          }
        }
    }
if(flagli) console.log("FOUND");
    //db.serialize(function() {
    db.run("INSERT INTO curiosities (subtitle_es, content_es, subtitle_en, content_en, day, flagli, goal) VALUES(?, ?, ?, ?, ?, ?, ?);", subtitle_es, content_es, subtitle_en, content_en, day, flagli, goal, function(err, result) {

        if (err) return console.log(err);
        //res.json(result);
    });
    //});

  }
//-----------------------

/*for (var i = 0; i <xlsarray[1].data.length; i++) {
    for (var j = 0; j <xlsarray[1].data[i].length; j++) {
        var column = JSON.stringify(xlsarray[1].data[i][j]);
        //console.log(column + "\n"); //prints out each cell
    }
}

 db.serialize(function() {
    db.all("INSERT INTO objetivo1 (text) VALUES(?);", column, function(err, rows) {

    if (err) return console.log(err);
    //res.json(rows);

    });
  });


//////// encontrar una manera de cerrar li y ul!!
// var re = /<li>/g;
//while ((match = re.exec(resul)) != null) {
//    console.log("match found at " + match.index);
//}

*/
