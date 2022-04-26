// Assignment Code
var generateBtn = document.querySelector("#generate");

// Write password to the #password input

//Define variables
var availableChars = "";
var passwordLength = 7;
var a = 0
var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var numeric = "0123456789";
var special = "!#$%&'()*+,-./:;<=>?@[]^_` {|}~" ;
var passwordVal = "";


  
//  Request length from user and validate number is between 8-128;
function setLength(){
  passwordLength = Math.floor(window.prompt("Password Length (8-128)", 8))
  validateLength();
  }  
function validateLength(){
  if (passwordLength > 7 && passwordLength < 129) {
  console.log(passwordLength)
  } else{
     window.alert("Invalid Selection, please try again");
     setLength();
  };
};

// Write Password function - set and validate the length, randomly generate characters from available set

function writePassword() {
  setLength();
  validateLength();
  availableChars = "" ;
  function writePass(){ 
// build availableChars based on user selections
    if (window.confirm("Include lowercase characters?")) {
      availableChars = availableChars.concat(lowercaseLetters);
    } 
    if (window.confirm("Include uppercase characters?")) {
      availableChars = availableChars.concat(uppercaseLetters);
    };
    if (window.confirm("Include numeric characters?")){
      availableChars = availableChars.concat(numeric)
    };
    if (window.confirm("Include special characters?")){
     availableChars = availableChars.concat(special)
   };

// Randomly generate from available characters list
   
    for(i = 0; i < passwordLength; i++){
        a = Math.floor(Math.random() * (availableChars.length));
       passwordVal = passwordVal.concat(availableChars[a]);
        };

  // console.log(passwordVal);  console logging for validation
  // update password text in html document
    var passwordText =  document.querySelector("#password");
    passwordText.value = passwordVal;
    passwordVal = "";
    availableChars = "";
};    
  ;
  //  console.log(passwordVal);  
  writePass();  

};
// function copyText(){
//  navigator.clipboard.writeText(copyText.value); 
// }
// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
