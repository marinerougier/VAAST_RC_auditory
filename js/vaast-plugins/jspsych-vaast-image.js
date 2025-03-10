/**************************************************************
* VAAST implementation in jsPsych. 
* (image trial)
*
*
*                   (cedric.batailler@univ-grenoble-alpes.fr)
***************************************************************/

 jsPsych.plugins['vaast-image'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('vaast-image', 'stimulus', 'image');
  jsPsych.pluginAPI.registerPreload('vaast-image', 'voice', 'audio');  // ADD THIS


  plugin.info = {
    name: 'vaast-image',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed filename.'
      },
      voice: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Voice',
        default: undefined,
        description: 'The audio file to be played with the stimulus.'
      },
      approach_key: {
        type: jsPsych.plugins.parameterType.HTML_STRING, 
        pretty_name: 'Approach key',
        default: 'Z',
        description: 'Key press that is associated with an approach movement.'
      },
      avoidance_key: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Avoidance key',
        default: 'S',
        description: 'Key press that is associated with an avoidance movement.'
      },
      control_key: {
        type: jsPsych.plugins.parameterType.HTML_STRING, 
        pretty_name: 'Control key',
        default: 'D',
        description: 'Key press that is associated with a control movement.'
      },
      key_to_move_forward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key to move forward',
        array: true,
        default: jsPsych.ALL_KEYS,
        description: 'The keys that allow the user to advance to the next trial if their key press was incorrect.'
      },
      display_feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Display feedback',
        default: false,
        description: 'If true, then html when wrong will be displayed when user makes an incorrect key press.'
      },
      feedback_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Display feedback',
        default: null,
        description: 'If true, then html when wrong will be displayed when user makes an incorrect key press.'
      },
      html_when_wrong: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'HTML when wrong',
        default: '<span style="color: red; font-size: 80px">X</span>',
        description: 'The html code to display when a user presses the wrong key.'
      }, 
      force_correct_key_press: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Force correct key press',
        default: false,
        description: 'If true, in order to advance to the next trial after a wrong key press the user will be forced to press the correct key.'
      },
      stim_movement: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus key association',
        options: ['approach', 'avoidance'],
        default: 'undefined',
        description: 'Stimulus will be associated with either "approach" or "avoidance".'
      },
      font_sizes: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: 'Stimulus size',
        default: null,
        description: 'An array with sizes of the image as function of the position.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      background_images: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: 'Background',
        default: undefined,
        description: 'Array with the images displayed as background as function of the position.'
      },
      position: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Initial position',
        default: 3,
        description: 'The position in the "background_images" array which will be used to set the background.'
      }
    }
  }


  plugin.trial = function(display_element, trial) {
  
  var audio = new Audio(trial.voice);  // Create the audio object
audio.addEventListener("canplaythrough", function () {  
    console.log("Audio loaded successfully:", trial.voice);
    audio.play().catch(error => console.error("Audio play error:", error));
});
audio.addEventListener("error", function () {
    console.error("Audio file could not be loaded:", trial.voice);
});

 var html_v = "<audio id='vaast-audio' src='" + trial.voice + "'></audio>";


    var html_str = "";
    
    html_str += "<div style='position:absolute;right:0;top:0;width:100%; height:100%;background:url("+trial.background_images[trial.position]+") center no-repeat; background-color:#000000'></div>";
    html_str += "<div style='position:relative;right:0;top;0;width:"+trial.font_sizes[trial.position]+"px'><img width='"+trial.font_sizes[trial.position]+"' src='"+trial.stimulus+"' id='jspsych-vaast-stim'></img></div>";

    html_str += "<div id='wrongImgID' style='position:relative; top: 100px; margin-left: auto; margin-right: auto; left: 0; right: 0'>";

    if(trial.display_feedback === true) {
      html_str += "<div id='wrongImgContainer' style='visibility: hidden; position: absolute; top: -75px; margin-left: auto; margin-right: auto; left: 0; right: 0'><p>"+trial.html_when_wrong+"</p></div>";
    }

    html_str += "</div>";

    display_element.innerHTML = html_v + html_str;
if (trial.voice) {
    document.getElementById("vaast-audio").play();
}

/*
    // Play the corresponding voice if assigned
    if (trial.voice) {
        var audio = new Audio(trial.voice);
        audio.play().catch(error => console.error("Audio play error:", error));
    }
*/
    // store response
    var response = {
      rt: null,
      key: null,
      correct: false
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "voice": trial.voice,
        "key_press": response.key,
        "correct": response.correct,
        "movement": trial.stim_movement,
        "position": trial.position
      };

      // clears the display
      display_element.innerHTML = '';


      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    var AppKeyCode = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(trial.approach_key);
    var ContKeyCode = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(trial.control_key);
    var AvoKeyCode = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(trial.avoidance_key);

    // function to handle responses by the subject
    var after_response = function(info) {
      var wImg = document.getElementById("wrongImgContainer");
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-vaast-stim').className += ' responded';

      // only record the first response
      if (response.key == null ) {
        response = info;
      }

      if(trial.stim_movement == "avoidance") {
        if(response.rt !== null && response.key == AvoKeyCode) {
          response.correct = true;
          if (trial.response_ends_trial) {
            end_trial();
          }
        } else {
          response.correct = false;
          if(!trial.response_ends_trial && trial.display_feedback == true) {
            wImg.style.visibility = "visible";
          }
          if(trial.response_ends_trial && trial.display_feedback == true && trial.feedback_duration !== null) {
            wImg.style.visibility = "visible";
            jsPsych.pluginAPI.setTimeout(function() {
              end_trial();
            }, trial.feedback_duration);
          }
          if(trial.response_ends_trial && trial.display_feedback == true && trial.feedback_duration == null) {
            wImg.style.visibility = "visible";
            if(trial.force_correct_key_press) {
              var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: end_trial,
                valid_responses: [trial.avoidance_key]
              });
            } else {
            var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: end_trial,
              valid_responses: trial.key_to_move_forward
            });}
           } else if(trial.response_ends_trial && trial.display_feedback != true) {
            end_trial();
          } else if(!trial.response_ends_trial && trial.display_feedback != true) {

          }
        }
      } else if(trial.stim_movement == "approach") {
        if(response.rt !== null && response.key == AppKeyCode) {
          response.correct = true;
          if (trial.response_ends_trial) {
            end_trial();
          }
        } else {
          response.correct = false;
          if(!trial.response_ends_trial && trial.display_feedback == true) {
            wImg.style.visibility = "visible";
          }
          if(trial.response_ends_trial && trial.display_feedback == true && trial.feedback_duration !== null) {
            wImg.style.visibility = "visible";
            jsPsych.pluginAPI.setTimeout(function() {
              end_trial();
            }, trial.feedback_duration);
          }
          if(trial.response_ends_trial && trial.display_feedback == true && trial.feedback_duration == null) {
            wImg.style.visibility = "visible";
            if(trial.force_correct_key_press) {
              var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: end_trial,
                valid_responses: [trial.approach_key]
              });
            } else {
            var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: end_trial,
              valid_responses: trial.key_to_move_forward
            });}
          } else if(trial.response_ends_trial && trial.display_feedback != true) {
            end_trial();
          } else if(!trial.response_ends_trial && trial.display_feedback != true) {

          }
        }
      }
    else if(trial.stim_movement == "control") {
        if(response.rt !== null && response.key == ContKeyCode) {
          response.correct = true;
          if (trial.response_ends_trial) {
            end_trial();
          }
        } else {
          response.correct = false;
          if(!trial.response_ends_trial && trial.display_feedback == true) {
            wImg.style.visibility = "visible";
          }
          if(trial.response_ends_trial && trial.display_feedback == true && trial.feedback_duration !== null) {
            wImg.style.visibility = "visible";
            jsPsych.pluginAPI.setTimeout(function() {
              end_trial();
            }, trial.feedback_duration);
          }
          if(trial.response_ends_trial && trial.display_feedback == true && trial.feedback_duration == null) {
            wImg.style.visibility = "visible";
            if(trial.force_correct_key_press) {
              var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: end_trial,
                valid_responses: [trial.control_key]
              });
            } else {
            var keyListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: end_trial,
              valid_responses: trial.key_to_move_forward
            });}
          } else if(trial.response_ends_trial && trial.display_feedback != true) {
            end_trial();
          } else if(!trial.response_ends_trial && trial.display_feedback != true) {

          }
        }
      }
    };

    // start the response listener
    if (trial.approach_key != jsPsych.NO_KEYS && trial.avoidance_key != jsPsych.NO_KEYS && trial.control_key != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.approach_key, trial.avoidance_key, trial.control_key],
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null && trial.response_ends_trial != true) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
