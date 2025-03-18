/// LICENCE -----------------------------------------------------------------------------

//
// Copyright 2018 - Cédric Batailler
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be included in all copies
// or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// OVERVIEW -----------------------------------------------------------------------------

// safari & ie exclusion ----------------------------------------------------------------
var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var is_ie = /*@cc_on!@*/false || !!document.documentMode;

var is_compatible = !(is_safari || is_ie);


if (!is_compatible) {

  var safari_exclusion = {
    type: "html-keyboard-response",
    stimulus:
      "<p>Désolé, cette étude n'est pas compatible avec votre navigateur.</p>" +
      "<p>Merci d'essayer à nouveau avec un navigateur compatible (par ex., Chrome or Firefox).</p>",
    choices: jsPsych.NO_KEYS
  };

  var timeline_safari = [];

  timeline_safari.push(safari_exclusion);
  jsPsych.init({ timeline: timeline_safari });

}

// firebase initialization ---------------------------------------------------------------
var firebase_config = {
    apiKey: "AIzaSyAPTEPrT8V9T1-GouWXnW6jknK3brmagJs",
    databaseURL: "https://postdocgent.firebaseio.com/"
};

firebase.initializeApp(firebase_config);
var database = firebase.database();

// id variables
var prolificID = jsPsych.data.getURLVariable("prolificID");
if(prolificID == null) {prolificID = "999";}

var id = jsPsych.randomization.randomID(15)

// Preload images
var preloadimages = [];

// connection status ---------------------------------------------------------------------
// This section ensure that we don't lose data. Anytime the 
// client is disconnected, an alert appears onscreen
var connectedRef = firebase.database().ref(".info/connected");
var connection = firebase.database().ref("VAAST_auditive/" + id + "/")
var dialog = undefined;
var first_connection = true;

connectedRef.on("value", function (snap) {
  if (snap.val() === true) {
    connection
      .push()
      .set({
        status: "connection",
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })

    connection
      .push()
      .onDisconnect()
      .set({
        status: "disconnection",
        timestamp: firebase.database.ServerValue.TIMESTAMP
      })

    if (!first_connection) {
      dialog.modal('hide');
    }
    first_connection = false;
  } else {
    if (!first_connection) {
      dialog = bootbox.dialog({
        title: 'Connection lost',
        message: '<p><i class="fa fa-spin fa-spinner"></i> Please wait while we try to reconnect.</p>',
        closeButton: false
      });
    }
  }
});

// Consent --------------------------------------------------------------
  var check_consent = function(elem) {
    if (document.getElementById('info').checked 
      & document.getElementById('volunt').checked 
      & document.getElementById('anony').checked 
      & document.getElementById('end').checked 
      & document.getElementById('consqc').checked 
      & document.getElementById('summ').checked 
      & document.getElementById('participate').checked ) {
      return true;
    }
    else {
      alert("Si vous souhaitez participer, vous devez cocher toutes les cases. Si vous ne souhaitez pas participer, fermez la fenêtre du navigateur.");
      return false;
    }
    return false;
  };


  var consent = {
    type:'external-html',
    url: "https://marinerougier.github.io/VAAST_RC_auditory/external_page_consent.html",
    cont_btn: "start",
    check_fn: check_consent,
        on_load: function() {
          window.scrollTo(0, 0)
        },
  };


// counter variables
var vaast_trial_n = 1;
var browser_events_n = 1;

// Variable input -----------------------------------------------------------------------
// color to approach
var vaast_condition_approach = jsPsych.randomization.sampleWithoutReplacement(["approach_blue", "approach_yellow"], 1)[0];

// group associated with the yellow or blue color
var ColorGroup   = jsPsych.randomization.sampleWithoutReplacement(["G1Y", "G1B"], 1)[0];

// cursor helper functions
var hide_cursor = function () {
  document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="cursor-toggle"> html { cursor: none; } </style>');
}
var show_cursor = function () {
  document.querySelector('#cursor-toggle').remove();
}

var hiding_cursor = {
  type: 'call-function',
  func: hide_cursor
}

var showing_cursor = {
  type: 'call-function',
  func: show_cursor
}

// Preload images in the VAAST 
// Preload faces
var faces = [
      "stimuli/Face19_B.png",
      "stimuli/Face28_B.png",
      "stimuli/Face55_B.png",
      "stimuli/Face95_B.png",
      "stimuli/Face104_B.png",
      "stimuli/Face115_B.png",
      "stimuli/Face119_B.png",
      "stimuli/Face142_B.png",
      "stimuli/Face10_J.png",
      "stimuli/Face16_J.png",
      "stimuli/Face17_J.png",
      "stimuli/Face45_J.png",
      "stimuli/Face85_J.png",
      "stimuli/Face103_J.png",
      "stimuli/Face116_J.png",
      "stimuli/Face132_J.png",
      "stimuli/Face19_J.png",
      "stimuli/Face28_J.png",
      "stimuli/Face55_J.png",
      "stimuli/Face95_J.png",
      "stimuli/Face104_J.png",
      "stimuli/Face115_J.png",
      "stimuli/Face119_J.png",
      "stimuli/Face142_J.png",
      "stimuli/Face10_B.png",
      "stimuli/Face16_B.png",
      "stimuli/Face17_B.png",
      "stimuli/Face45_B.png",
      "stimuli/Face85_B.png",
      "stimuli/Face103_B.png",
      "stimuli/Face116_B.png",
      "stimuli/Face119_B_Example.png",
      "stimuli/Face95_J_Example.png"
];

preloadimages.push(faces);

// Voices for the VAAST
var voices = [
      "voices_VAAST/Voice_1.wav",
      "voices_VAAST/Voice_2.wav",
      "voices_VAAST/Voice_3.wav",
      "voices_VAAST/Voice_4.wav",
      "voices_VAAST/Voice_5.wav",
      "voices_VAAST/Voice_6.wav",
      "voices_VAAST/Voice_7.wav",
      "voices_VAAST/Voice_8.wav",
      "voices_VAAST/Voice_9.wav",
      "voices_VAAST/Voice_10.wav",
      "voices_VAAST/Voice_11.wav",
      "voices_VAAST/Voice_12.wav",
      "voices_VAAST/Voice_13.wav",
      "voices_VAAST/Voice_14.wav",
      "voices_VAAST/Voice_15.wav",
      "voices_VAAST/Voice_16.wav"
];


// VAAST --------------------------------------------------------------------------------
// VAAST variables ----------------------------------------------------------------------

var movement_blue     = undefined;
var movement_yellow   = undefined;
var group_to_approach = undefined;
var group_to_avoid    = undefined;

 var genColor = function (colorID, colorName) { return "<span style='color:" + colorID + "'><b>" + colorName + "</b></span>" };
 var blue = genColor("#2a57ea", "bleu");
 var yellow = genColor("#b5a21b", "jaune");

switch(vaast_condition_approach) {
  case "approach_blue":
    movement_blue    = "approach";
    movement_yellow    = "avoidance";
    group_to_approach = blue;
    group_to_avoid    = yellow;
    break;

  case "approach_yellow":
    movement_blue    = "avoidance";
    movement_yellow    = "approach";
    group_to_approach = yellow;
    group_to_avoid   = blue;
    break;
}

// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------

var vaast_stim_training_G1Y = [
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face19_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face28_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face55_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face95_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face104_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face115_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face119_B.png'},
  {movement: movement_blue, group: "blue", stimulus: 'stimuli/Face142_B.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face10_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face16_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face17_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face45_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face85_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face103_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face116_J.png'},
  {movement: movement_yellow,  group: "yellow",  stimulus: 'stimuli/Face132_J.png'}
]

var vaast_stim_training_G1B = [
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face19_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face28_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face55_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face95_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face104_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face115_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face119_J.png'},
  {movement: movement_yellow, group: "yellow", stimulus: 'stimuli/Face142_J.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face10_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face16_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face17_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face45_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face85_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face103_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face116_B.png'},
  {movement: movement_blue, group: "blue",  stimulus: 'stimuli/Face132_B.png'}
]

var vaast_stim_training    = undefined;
switch (ColorGroup) {
case "G1Y":
    vaast_stim_training    = vaast_stim_training_G1Y;
    break;

  case "G1B":
    vaast_stim_training    = vaast_stim_training_G1B;
    break;
}

// Shuffle voices and assign them to faces
var shuffled_voices = jsPsych.randomization.shuffle(voices);
for (var i = 0; i < vaast_stim_training.length; i++) {
    vaast_stim_training[i].voice = shuffled_voices[i % shuffled_voices.length]; // Assign voices
}

// vaast background images --------------------------------------------------------------,

var background = [
  "background/1.jpg",
  "background/2.jpg",
  "background/3.jpg",
  "background/4.jpg",
  "background/5.jpg",
  "background/6.jpg",
  "background/7.jpg"
];


// vaast stimuli sizes -------------------------------------------------------------------

var stim_sizes = [
  34,
  38,
  42,
  46,
  52,
  60,
  70
];

var resize_factor = 7;
var image_sizes = stim_sizes.map(function (x) { return x * resize_factor; });

// Helper functions ---------------------------------------------------------------------
// next_position():
// Compute next position as function of current position and correct movement. Because
// participant have to press the correct response key, it always shows the correct
// position.
var next_position_training = function () {
  var current_position = jsPsych.data.getLastTrialData().values()[0].position;
  var current_movement = jsPsych.data.getLastTrialData().values()[0].movement;
  var position = current_position;

  if (current_movement == "approach") {
    position = position + 1;
  }

  if (current_movement == "avoidance") {
    position = position - 1;
  }

  if (current_movement == "control") {
    position = position ;
  }
  return (position)
}

// Saving blocks ------------------------------------------------------------------------
// Every function here send the data to keen.io. Because data sent is different according
// to trial type, there are differents function definition.

// init ---------------------------------------------------------------------------------
var saving_id = function () {
  database
    .ref("participant_id_AuditiveRC_AAT/")
    .push()
    .set({
      id: id,
      prolificID: prolificID,
      vaast_condition_approach : vaast_condition_approach,
      ColorGroup: ColorGroup,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
}

// vaast trial --------------------------------------------------------------------------
var saving_vaast_trial = function () {
  database
    .ref("vaast_trial_AAT_RR_AuditiveRC_AAT/").
    push()
    .set({
      id: id,
      prolificID: prolificID,
      vaast_condition_approach : vaast_condition_approach,   
      ColorGroup: ColorGroup,   
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      vaast_trial_data: jsPsych.data.get().last(4).json()
    })
}


// demographic logging ------------------------------------------------------------------

var saving_browser_events = function (completion) {
  database
    .ref("browser_event_RR_AuditiveRC_AAT/")
    .push()
    .set({
      id: id,
      prolificID: prolificID,
      vaast_condition_approach : vaast_condition_approach,
      ColorGroup: ColorGroup,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      completion: completion,
      event_data: jsPsych.data.getInteractionData().json()
    })
}


// saving blocks ------------------------------------------------------------------------
var save_id = {
  type: 'call-function',
  func: saving_id
}

var save_vaast_trial = {
  type: 'call-function',
  func: saving_vaast_trial
}

// EXPERIMENT ---------------------------------------------------------------------------
// Switching to fullscreen --------------------------------------------------------------
var fullscreen_trial = {
  type: 'fullscreen',
  message: 'Pour commencer, merci de passer en mode plein écran </br></br>',
  button_label: 'Passer en mode plein écran',
  fullscreen_mode: true
}


// VAAST --------------------------------------------------------------------------------
var Gene_Instr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Expérience sur la catégorisation</h1>" +
    "<br>" +
    "<p class='instructions'> Dans cette recherche, nous nous intéressons à la capacité générale des individus à catégoriser " +
    "autrui. </p>" +
    "<p class='instructions'>Dans cette expérience, vous allez " +
    "réaliser deux tâches de catégorisation : " +
    "<br>" +
    "- Tâche 1 : La tâche du jeu vidéo (environ 10 min)" +
    "<br>" +
    "- Tâche 2 : La tâche de reconnaissance (environ 30 min)" +
    "<br>" +
    "<br>" +
    "Pour terminer, vous répondrez à quelques questions (environ 1 min). </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

// vaast cond instructions

var vaast_instructions_1 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1 : Tâche du jeu vidéo</h1>" +
    "<p class='instructions'>Cette tâche ressemble à un jeu vidéo. Vous serez " +
    "dans un environnement virtuel dans lequel vous pourrez avancer ou reculer: </p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};


var vaast_instructions_2 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1 : Tâche du jeu vidéo</h1>" +
    "<p class='instructions'>Dans cet environnement, des visages vous seront présentés. </b>A chaque fois qu'un visage apparaitra, <u>il "+
    "se présentera à vous disant 'bonjour'</u>. <b><br><br> Votre tâche sera de catégoriser le visage le plus rapidement possible en fonction de sa couleur de fond (c'est-à-dire, " + group_to_approach + " ou " + group_to_avoid + "). " +
    "Pour catégoriser le visage, vous devrez soit avancer soit reculer dans l'environnement virtuel. Des instructions plus précises suivront. <br>" +
    "<p class='instructions'>Notez que ces visages ont été volontairement <b>floutés</b>. Voici " +
    "deux exemples de visages qui seront affichés : <br>" +
    "<center><img src = '"+ vaast_stim_training[0]['stimulus']+"'>" +
    "                              " +
    "<img src = '"+ vaast_stim_training[9]['stimulus']+"'></center>" +
    "<br><br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_3 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1 : Tâche du jeu vidéo</h1>" +
    "<p class='instructions'>Vous pourrez avancer/reculer dans l'environnement en utilisant les touches suivantes de votre clavier :" +
    "<br>" +
    "<br>" +
    "<img src = 'media/keyboard_vaast_french.png'>" +
    "<br>" +
    "<br></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_4 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1 : Tâche du jeu vidéo</h1>" +
    "<p class='instructions'>Au début de chaque essai, vous verrez apparaître le symbole 'O'. " +
    "Ce symbole indique que vous devez appuyer sur la touche de DÉPART (c'est-à-dire, la <b>touche D</b>) pour commencer l'essai. </p>" +
    "<p class='instructions'>Ensuite, vous verrez une croix de fixation (+) au centre de l'écran, suivie d'un visage vous disant 'bonjour'. </p>" +
    "<p class='instructions'>En fonction de la couleur de fond (" + group_to_approach + " ou " + group_to_avoid + ") du visage, votre tâche est d'avancer en appuyant sur la touche AVANCER (c'est-à-dire, la <b>touche E</b>) " +
    "ou de reculer en appuyant sur la touche RECULER (c'est-à-dire, la <b>touche C</b>) le plus rapidement possible. Après avoir appuyé sur la touche E ou C, le visage disparaîtra et vous devrez " +
    "appuyer à nouveau sur la touche de DÉPART (touche D). " +
    "<p class='instructions'><b>Veuillez <u>utiliser uniquement l'index</u> de votre main dominante pour toutes ces actions. </b></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_5 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'> Tâche 1 : Tâche du jeu vidéo</h1>" +
    "<p class='instructions'>Plus spécifiquement, vous devrez : " +
    "<ul class='instructions'>" +
    "<li><strong>Avancer pour les visages ayant un fond " + group_to_approach + " </strong></li>" +
    "<strong>en appuyant sur la touche E</strong>" +
    "<br>" +
    "<br>" +
    "<li><strong>Reculer pour les visages ayant un fond " + group_to_avoid + " </strong></li>" +
    "<strong>en appuyant sur la touche C</strong>" +
    "</ul>" +
    "<p class='instructions'>Lisez attentivement et assurez-vous de mémoriser les instructions ci-dessus. </p>" +
    "<p class='instructions'><strong>De plus, notez qu'il est EXTRÊMEMENT IMPORTANT d'essayer d'être aussi rapide et précis·e que possible. </strong>" +
    "Une croix rouge apparaîtra si votre réponse est incorrecte. </p>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>ENTRÉE</strong> pour " +
    "commencer la tâche.</p>",
  choices: [13]
};


var vaast_instructions_end = {
  type: "html-keyboard-response",
  stimulus:
    "<p class='instructions'>La tâche du jeu vidéo (tâche 1) est terminée. " +
    "Vous allez maintenant réaliser la tâche de reconnaissance (tâche 2). </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " commencer la tâche 2.</p>",
  choices: [32]
};


// Creating a trial for the VAAST cond ---------------------------------------------------------------------

var vaast_start = {
  type: 'vaast-text',
  stimulus: "o",
  position: 3,
  background_images: background,
  font_sizes: stim_sizes,
  approach_key: "d",
  stim_movement: "approach",
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_fixation = {
  type: 'vaast-fixation',
  fixation: "+",
  font_size: 46,
  position: 3,
  background_images: background
}


var vaast_first_step_training = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  voice: jsPsych.timelineVariable('voice'),  // Add a voice when the face appears
  position: 3,
  background_images: background,
  font_sizes: image_sizes,
  approach_key: "e",
  avoidance_key: "c",
  control_key: "d",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
};


var vaast_second_step = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes: image_sizes,
  stim_movement: jsPsych.timelineVariable('movement'),
  response_ends_trial: false,
  trial_duration: 650 // registered report: 300
}

var vaast_second_step_training = {
  chunk_type: "if",
  timeline: [vaast_second_step],
  conditional_function: function () {
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}


// VAAST training block -----------------------------------------------------------------
var vaast_training = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training,
    vaast_second_step_training,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1,                                 //here, put 12 for 192 trials in total
  randomize_order: true,
  data: {
    phase: "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    voice: jsPsych.timelineVariable('voice'),
    movement: jsPsych.timelineVariable('movement'),
    group: jsPsych.timelineVariable('group'),
  }
};


// end fullscreen -----------------------------------------------------------------------

var fullscreen_trial_exit = {
  type: 'fullscreen',
  fullscreen_mode: false
}


// procedure ----------------------------------------------------------------------------
// Initialize timeline ------------------------------------------------------------------

var timeline = [];

timeline.push(consent);

// fullscreen
timeline.push(
  fullscreen_trial,
  hiding_cursor);

// prolific verification
timeline.push(save_id);

timeline.push(Gene_Instr,
              vaast_instructions_1,
          		vaast_instructions_2,
          		vaast_instructions_3,
          		vaast_instructions_4,
          		vaast_instructions_5,
          		vaast_training,
          		vaast_instructions_end
          		);

timeline.push(showing_cursor);

timeline.push(fullscreen_trial_exit);

// Launch experiment --------------------------------------------------------------------
// preloading ---------------------------------------------------------------------------
// Preloading. For some reason, it appears auto-preloading fails, so using it manually.
// In principle, it should have ended when participants starts VAAST procedure (which)
// contains most of the image that have to be pre-loaded.
var loading_gif = ["media/loading.gif"]
var vaast_instructions_images = ["media/vaast-background.png", "media/keyboard_vaast_french.png"];
var vaast_bg_filename = background;

jsPsych.pluginAPI.preloadImages(loading_gif);
jsPsych.pluginAPI.preloadImages(vaast_instructions_images);
jsPsych.pluginAPI.preloadImages(vaast_bg_filename);
jsPsych.pluginAPI.preloadAudioFiles(voices);

// timeline initiaization ---------------------------------------------------------------
if (is_compatible) {
  jsPsych.init({
    timeline: timeline,
    preload_images: preloadimages,
    max_load_time: 1000 * 500,
    exclusions: {
      min_width: 1100,
      min_height: 600,
      max_width: 1600,
      max_height: 900,
    },
    on_interaction_data_update: function () {
      saving_browser_events(completion = false);
    },
    on_finish: function () {
      saving_browser_events(completion = true);
      window.location.href = "https://marinerougier.github.io/VAAST_RC_auditory/RC.html?id=" + id + "&prolificID=" + 
      prolificID + "&vaast_condition_approach=" + vaast_condition_approach + "&movement_blue=" + movement_blue 
      + "&movement_yellow=" + movement_yellow + "&ColorGroup=" + ColorGroup;
    }
  });
}


