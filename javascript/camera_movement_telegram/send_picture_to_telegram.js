const fs = require('fs'); // load required module

const trigger = 'zigbee.0.00158d0001ef6056.double_click'  // Define trigger here, example : motion sensor or button 
const camerapicture = 'http://192.168.178.43/eec360c16d4f74799eacd7a662b3ede4/live/snapshot_720.jpg' ;    // Object from camera
const imagepath = '\tmp'                                       // Path to temporary store image from camera
const message = 'Motion detected'                // Message tesxt to telegram when picture is sent


// ##########################################################################
// ##########################################################################
// ##########################################################################
// ##################### Don't chane anything below #########################
// ################################ v 0.5.0 #################################
// ##########################################################################
// ##########################################################################
// ##########################################################################


// State to execute script
on({id: trigger, val: true}, function (obj) {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;

    // sent image immediatly
    getImage();

    // sent second image 2 seconds later
    var timeout_01 = setTimeout(function () {

        getImage();

    }, 2000);
 
    // sent second image 4 seconds later
    var timeout_02 = setTimeout(function () {

        getImage();

    }, 4000);

});

// Get picture from camera
function getImage() {

    console.log("bewegung erkannt");

    var fname = imagepath + Date.now() + '.jpg';
    request.get({url: camerapicture, encoding: 'binary'}, function (err, response, body) {
        fs.writeFile(fname, body, 'binary', function(err) {
            if (err) {
                log('Fehler beim Bild speichern: ' + err, 'warn');
            } else {
                setTimeout(function() { sendImage(fname); }, 2000); 
            }
        }); 
    });
}

// Send picture to telegram
function sendImage (fname) { 
    try {
        sendTo('telegram.0', {
            text:                   fname,
            caption:                message, 
            disable_notification:   true
        });
    }
    catch(err) { if (err.code != "ENOENT") log(err); }  
    setTimeout(function() { deleteImage(fname); }, 3000); 
}

// delete picture
function deleteImage(fname) {
    try {
//        var stats = fs.statSync(path);
        try { fs.unlinkSync(fname); }
        catch(err) { if (err.code != "ENOENT") log(err); }     
    }
    catch(err) { if (err.code != "ENOENT") log(err); }
}