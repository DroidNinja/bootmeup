/**
 * Created by droidNinja on 20/01/17.
 */
var kue = require('kue');
const TYPE = {
    SEND_NOTIFICATION: "SEND_NOTIFICATION",
    SEND_EMAIL: "SEND_EMAIL"
};
var queue = kue.createQueue();

queue.process(TYPE.SEND_NOTIFICATION, function(job, done){
    console.log(JSON.stringify(job));
    done();
});

queue.process(TYPE.SEND_EMAIL, function(job, done){
    console.log("email sent");
    done();
});

module.exports = {


    sendNotification : function (notificationObj) {
        queue.create(TYPE.SEND_NOTIFICATION, notificationObj).priority('high').attempts(2).save();
    },
    sendEmail : function (notificationObj) {
        queue.create(TYPE.SEND_EMAIL, notificationObj).priority('normal').attempts(2).save();
    }

};