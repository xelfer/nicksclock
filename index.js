var config = {};
config.IOT_BROKER_ENDPOINT      = "a1v9yu6xvaswb1.iot.ap-southeast-2.amazonaws.com";
config.IOT_BROKER_REGION        = "ap-southeast-2";
config.IOT_THING_NAME           = "pi";
config.params                   = { thingName: 'pi' };
//Loading AWS SDK libraries

var AWS = require('aws-sdk');
AWS.config.region = config.IOT_BROKER_REGION;

//Initializing client for IoT
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.application.applicationId !== "amzn1.ask.skill.f6fc94e1-b548-4499-84e0-9aad75a5571e") {
             context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("GoodMorning" === intentName) {
        goodMorning(intent, session, callback);
    } else if ("GoodNight" === intentName) {
        goodMorning(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    var cardTitle = "Good Morning";
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = true;

    var request = require("request");
    var location = "";
    var temp = "";
    var description = "";
    var news = "";

    var IFTTTkey = "NC7Q6pzwnJUARfptNyXlI";
    request('https://maker.ifttt.com/trigger/WeMo/with/key/' + IFTTTkey, function (error, response, body) { })

    request({
        url: "http://api.openweathermap.org/data/2.5/weather?id=2171507&appid=5b0bf755ef773f2a284183cfee4aa540&units=metric",
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            location = body.name;
            temp = body.main.temp;
            description = body.weather[0].description;

            request({
                    url: "https://newsapi.org/v1/articles?source=time&sortBy=top&apiKey=7516817b3d0d4d02ac778918fbd317d4",
                    json: true
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        news = body.articles[0].title;
                        speechOutput = "Good morning! The weather today in " + location + " is " + temp + " degrees with a " + description + ". The top news headline is " + news + ". I have turned on your kettle, have a great day!";
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    }                   
                });
        }
    });
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for using Nick's Clock, Have a nice day!";
    var shouldEndSession = true;
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function goodMorning(intent, session, callback) {
    var cardTitle = "Good Morning";
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = true;

    var request = require("request");
    var location = "";
    var temp = "";
    var description = "";
    var news = "";

    var IFTTTkey = "NC7Q6pzwnJUARfptNyXlI";
    request('https://maker.ifttt.com/trigger/WeMo/with/key/' + IFTTTkey, function (error, response, body) {
    })

    request({
        url: "http://api.openweathermap.org/data/2.5/weather?id=2171507&appid=5b0bf755ef773f2a284183cfee4aa540&units=metric",
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            location = body.name;
            temp = body.main.temp;
            description = body.weather[0].description;

            request({
                    url: "https://newsapi.org/v1/articles?source=time&sortBy=top&apiKey=7516817b3d0d4d02ac778918fbd317d4",
                    json: true
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        news = body.articles[0].title;

                        speechOutput = "Good morning! The weather today in " + location + " is " + temp + " degrees with a " + description + ". The top news headline is " + news + ". I have turned on your kettle, have a great day!";
                        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                    }
                });
        }
    });
}

// --------------- Helpers that build all of the responses -----------------------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
