  // an object of state constants
  const states = {
      consent_message: 'consent_message',
      question1: 'question1',
      question2: 'question2',
      question3: 'question3',
      question4: 'question4',
      question5: 'question5',
      question6: 'question6',
      question7: 'question7',
      question8: 'question8',
      question9: 'question9',
      question10: 'question10',
      feedback_moreinfo: 'feedback_moreinfo',
      feedback_appnotworking: 'feedback_appnotworking',
      feedback_default: 'feedback_default',
      closing: 'closing',
  }

  // mapping of each to state to the response associated with each state
  const responses = {
      [states.consent_message]: {  
          "text": "This is a research project being conducted by University of the Philippines along with University of California, Davis. Your participation in this research study is voluntary. You may choose not to participate.\n\nWe will do our best to keep your information confidential. All data is stored in a password protected electronic format. To help protect your confidentiality, the surveys will not contain information that will personally identify you.\n\nIf you do not wish to participate in the research study, please decline participation by clicking on the \"Disagree\" button. Otherwise, click \"Agree\".",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Agree",
              "payload":"agree",
              "image_url":"https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_Approved-check-checkbox-confirm-green-success-tick-16.png"
            },
            {
              "content_type":"text",
              "title":"Disagree",
              "payload":"disagree",
              "image_url":"https://cdn2.iconfinder.com/data/icons/custom-flat-vol5/12/custom_flat_wrong-2-16.png"
            }
          ]
      },
      [states.question1]: {  
          "text": "I’m here to help you with problems with your health, your plants, or your animals. Are you having trouble with one of those?",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Yes",
              "payload":"yes",
              "image_url":"https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_Approved-check-checkbox-confirm-green-success-tick-16.png"
            },
            {
              "content_type":"text",
              "title":"No",
              "payload":"no",
              "image_url":"https://cdn2.iconfinder.com/data/icons/custom-flat-vol5/12/custom_flat_wrong-2-16.png"
            }
          ]
      },
      [states.question2]: {
          "text": "What are you having trouble with?",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Humans",
              "payload":"humans",
              "image_url":"https://cdn1.iconfinder.com/data/icons/CrystalClear/22x22/apps/Login-Manager.png"
            },
            {
              "content_type":"text",
              "title":"Animals",
              "payload":"animals",
              "image_url":"https://cdn3.iconfinder.com/data/icons/insect-and-animal/256/Chicken-16.png"
            },
            {
              "content_type":"text",
              "title":"Plants",
              "payload":"plants",
              "image_url":"https://cdn0.iconfinder.com/data/icons/household-2-2-colored/232/plants-green-decor-20.png"
            }
          ]
      },
      [states.question3]: { "text": 'Could you provide us with more info on this person? What are his/her symptoms? You can also post a photo.'},
      [states.question4]: { "text": 'Could you provide us with more info on what kind of animal trouble are you having? You can also post a photo.'},
      [states.question5]: { "text": 'Could you provide us with more info on what kind of plant trouble are you having? You can also post a photo.'},
      [states.question6]: {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "list",
              "top_element_style": "large",
              "elements": [
                {
                  "title": "Here are our advice for your health problem:",
                  "subtitle": "If the symptomps persist, please go to the nearest clinic.",
                  "image_url": "https://cdn4.iconfinder.com/data/icons/health-test-and-medical-science/64/Health_Test_And_Medical_Science-34-128.png",
                },
                {
                  "title": "Advice 1",
                  "subtitle": "(placeholder)",
                  "image_url": "https://cdn.glitch.com/203a7311-d8dc-4408-b5ef-8672ee56d939%2Fdiabetes-problem-002-128.png?1518186442093",
                  "buttons": [
                    //Only one button is allowed here, API will return an error that this element has too many elements otherwise.
                    {
                      "title": "View Details",
                      "type": "web_url",
                      "url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064",
                      "messenger_extensions": true,
                      "webview_height_ratio": "tall",
                      //fallback_url is needed for the webview to work in web browsers
                      "fallback_url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064"            
                    }
                  ]
                },
                {
                  "title": "Advice 2",
                  "subtitle": "(placeholder)",
                  "image_url": "https://cdn3.iconfinder.com/data/icons/health-medicine/512/Recovery_2-128.png",
                  "buttons": [
                    //Only one button is allowed here, API will return an error that this element has too many elements otherwise.
                    {
                      "title": "View Details",
                      "type": "web_url",
                      "url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064",
                      "messenger_extensions": true,
                      "webview_height_ratio": "full",
                      //fallback_url is needed for the webview to work in web browsers
                      "fallback_url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064"            
                    }
                  ]
                },
              ],
               "buttons": [
                {
                  "title": "Okay, I understand",
                  "type": "postback",
                  "payload": "okay"            
                }
              ]  
            }
          }
      },
      [states.question7]: {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "list",
              "top_element_style": "large",
              "elements": [
                {
                  "title": "Here are our advice for your animal problem:",
                  "subtitle": "We\'ll also forward your concern to Dr. Cheryl\'s group. We will update when necessary.",
                  "image_url": "https://cdn4.iconfinder.com/data/icons/health-test-and-medical-science/64/Health_Test_And_Medical_Science-34-128.png",
                },
                {
                  "title": "Advice 1",
                  "subtitle": "(placeholder)",
                  "image_url": "https://cdn2.iconfinder.com/data/icons/pets-9/253/pet_care-64.png",
                  "buttons": [
                    //Only one button is allowed here, API will return an error that this element has too many elements otherwise.
                    {
                      "title": "View Details",
                      "type": "web_url",
                      "url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064",
                      "messenger_extensions": true,
                      "webview_height_ratio": "tall",
                      //fallback_url is needed for the webview to work in web browsers
                      "fallback_url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064"            
                    }
                  ]
                },
                {
                  "title": "Advice 2",
                  "subtitle": "(placeholder)",
                  "image_url": "https://cdn1.iconfinder.com/data/icons/veterinary-cartoon/512/g12095-64.png",
                  "buttons": [
                    //Only one button is allowed here, API will return an error that this element has too many elements otherwise.
                    {
                      "title": "View Details",
                      "type": "web_url",
                      "url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064",
                      "messenger_extensions": true,
                      "webview_height_ratio": "full",
                      //fallback_url is needed for the webview to work in web browsers
                      "fallback_url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064"            
                    }
                  ]
                },
              ],
               "buttons": [
                {
                  "title": "Okay, I understand",
                  "type": "postback",
                  "payload": "okay"            
                }
              ]  
            }
          }
      },
      [states.question8]:  {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "list",
              "top_element_style": "large",
              "elements": [
                {
                  "title": "Here are our advice for your plant problem:",
                  "subtitle": "We\'ll also forward your concern to the necessary specialists, then update you as necessary.",
                  "image_url": "https://cdn0.iconfinder.com/data/icons/ecology-33/140/Ecology_plant_care-64.png",
                },
                {
                  "title": "Advice 1",
                  "subtitle": "(placeholder)",
                  "image_url": "https://cdn0.iconfinder.com/data/icons/insecticide-ii/524/insecticide-color-15-64.png",
                  "buttons": [
                    //Only one button is allowed here, API will return an error that this element has too many elements otherwise.
                    {
                      "title": "View Details",
                      "type": "web_url",
                      "url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064",
                      "messenger_extensions": true,
                      "webview_height_ratio": "tall",
                      //fallback_url is needed for the webview to work in web browsers
                      "fallback_url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064"            
                    }
                  ]
                },
                {
                  "title": "Advice 2",
                  "subtitle": "(placeholder)",
                  "image_url": "https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_eco_friendly-128.png",
                  "buttons": [
                    //Only one button is allowed here, API will return an error that this element has too many elements otherwise.
                    {
                      "title": "View Details",
                      "type": "web_url",
                      "url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064",
                      "messenger_extensions": true,
                      "webview_height_ratio": "full",
                      //fallback_url is needed for the webview to work in web browsers
                      "fallback_url": "https://smapi.gupshup.io/sm/api/facebook/smartmsg/embed/01f06cc4-4a98-4a1e-a564-23992c813064"            
                    }
                  ]
                },
              ],
               "buttons": [
                {
                  "title": "Okay, I understand",
                  "type": "postback",
                  "payload": "okay"            
                }
              ]  
            }
          }
      },
      [states.question9]: {
        "text": "One Health recognizes that the health of people is connected to the health of animals and the environment. The goal of One Health is to encourage the collaborative efforts of multiple disciplines-working locally, nationally, and globally-to achieve the best health for people, animals, and our environment. For more info, follow our project using this link: https://onehealth.up.edu.ph/",
        "quick_replies":[
            {
              "content_type":"text",
              "title":"Noted!",
              "payload":"noted",
              "image_url":"https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_Approved-check-checkbox-confirm-green-success-tick-16.png"
            },
            {
              "content_type":"text",
              "title":"I have a concern",
              "payload":"feedback",
              "image_url":"https://cdn2.iconfinder.com/data/icons/basic-elements-flat/614/763_-_Question_Mark-20.png"
            },
          ]
      },
      [states.question10]: { "text": 'What is your concern? You can type it here or post a photo.'},
      [states.feedback_moreinfo]: {
        "text": 'If you need more info, you can contact <placeholder> for your questions.',
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Okay",
            "payload":"okay",
            "image_url":"https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_Approved-check-checkbox-confirm-green-success-tick-16.png"
          }
        ]
      },
      [states.feedback_appnotworking]: {
        "text": 'Thanks for the feedback on state of the app, we\'ll look into it and update you ASAP.',
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Okay",
            "payload":"okay",
            "image_url":"https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_Approved-check-checkbox-confirm-green-success-tick-16.png"
          }
        ]
      },
      [states.feedback_default]: {
        "text": 'Thanks for the feedback, we\'ll look into it and update you ASAP.',
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Okay",
            "payload":"okay",
            "image_url":"https://cdn2.iconfinder.com/data/icons/weby-flat-vol-1/512/1_Approved-check-checkbox-confirm-green-success-tick-16.png"
          }
        ]
      },
      [states.closing]: {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "It\'s been a pleasure serving you. For more details, please visit our website.",
                //"subtitle": "https://onehealth.up.edu.ph/",
                "image_url": "https://cdn.glitch.com/203a7311-d8dc-4408-b5ef-8672ee56d939%2FOneHealth.color.png?1518185081996",
                "default_action": {
                  "type": "web_url",
                  "url": "https://onehealth.up.edu.ph/",
                  "messenger_extensions": "false",
                  "webview_height_ratio": "full"
                },
              }],
            },
          }
      }
  }

  // mapping of each state to the next state
  const nextStates = {
      [states.consent_message] : { agree: states.question1, disagree: states.closing },
      [states.question1]: { yes: states.question2, no: states.question9 },
      [states.question2]: { humans: states.question3, animals: states.question4, plants: states.question5 },
      [states.question3]: states.question6,
      [states.question4]: states.question7,
      [states.question5]: states.question8,
      [states.question6]: states.closing,
      [states.question7]: states.closing,
      [states.question8]: states.closing,
      [states.question9]: { noted: states.closing, feedback: states.question10 },
      [states.question10]: { moreinfo: states.feedback_moreinfo, appnotworking: states.feedback_appnotworking, default: states.feedback_default },
      [states.feedback_moreinfo]: { okay: states.closing },
      [states.feedback_appnotworking]: { okay: states.closing },
      [states.feedback_default]: { okay: states.closing },
      [states.closing]: states.consent_message,
  }

  const statesWithPostbacks = [states.question6, states.question7, states.question8];
  const statesWithNLP = {[states.question10]: 'FEEDBACK'};//The value for the keys (e.g. 'FEEDBACK') should be the corresponding entity in the Wit.AI application






module.exports.states = states;
module.exports.responses = responses;
module.exports.nextStates = nextStates;
module.exports.statesWithPostbacks = statesWithPostbacks;
module.exports.statesWithNLP = statesWithNLP;