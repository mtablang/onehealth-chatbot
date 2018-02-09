  /* Types of responses: */
  const responses_examples = {
      '1_text': { "text": 'Could you provide us with more info on this person? What is his/her sickness? You can also post a photo.'},

      '2_quick_reply': {  
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
    
      '3_generic_template-postback_buttons': {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "What are you having trouble with?",
                "subtitle": "Tap a button to answer.",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Humans",
                    "payload": "humans",
                  },
                  {
                    "type": "postback",
                    "title": "Animals",
                    "payload": "animals",
                  },
                  {
                    "type": "postback",
                    "title": "Plants",
                    "payload": "plants",
                  }
                ],
              }]
            }
          }
      },
    
      '4_generic_template-web_url': {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [{
                "title": "It\'s been a pleasure serving you. For more details, please visit our website.",
                //"subtitle": "https://onehealth.up.edu.ph/",
                "image_url": "https://onehealth.up.edu.ph/assets/images/OneHealth.color.png",
                "default_action": {
                  "type": "web_url",
                  "url": "https://onehealth.up.edu.ph/",
                  "messenger_extensions": "false",
                  "webview_height_ratio": "tall"
                },
              }],
            },
          }
      },
    
      '5_list_template': {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "list",
              "top_element_style": "compact",
              "elements": [
                {
                  "title": "Classic T-Shirt Collection",
                  "subtitle": "See all our colors",
                  "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",          
                  "buttons": [
                  //Only one button is allowed here, API will return an error that this element has too many elements otherwise.
                    {
                      "title": "View",
                      "type": "web_url",
                      "url": "https://peterssendreceiveapp.ngrok.io/collection",
                      "messenger_extensions": true,
                      "webview_height_ratio": "tall",
                      "fallback_url": "https://peterssendreceiveapp.ngrok.io/"            
                    }
                  ]
                },
                {
                  "title": "Classic White T-Shirt",
                  "subtitle": "See all our colors",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                    "messenger_extensions": false,
                    "webview_height_ratio": "tall"
                  }
                },
                {
                  "title": "Classic Blue T-Shirt",
                  "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
                  "subtitle": "100% Cotton, 200% Comfortable",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                  },
                  "buttons": [
                  //Only one button is allowed here, API will return an error that this element has too many elements otherwise.
                    {
                      "title": "Shop Now",
                      "type": "web_url",
                      "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                      "messenger_extensions": true,
                      "webview_height_ratio": "tall",
                      "fallback_url": "https://peterssendreceiveapp.ngrok.io/"            
                    }
                  ]        
                }
              ],
               "buttons": [
                {
                  "title": "View More",
                  "type": "postback",
                  "payload": "payload"            
                }
              ]  
            }
          }
      }
  }
