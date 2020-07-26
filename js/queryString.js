var temp1 = decodeURI(location.href.split("?"));
var temp =temp1.split(",");

var data=temp[1].split("=");
// console.log(data[1]);//%23단맛%23짠맛

var input_text = data[1].split("%23");

for(var i=0;i<input_text.length-1;i++){
  var word = input_text[i+1].replace("+","");
  $('#searchword').append(" \"#" + word + "\"");
}
