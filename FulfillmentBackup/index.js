// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Image, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function QueriesManual(agent) {
    agent.add(`Manual queries may be issued by the CRA, the Data Management (DM), the Coding Specialist, the Global Pharmacovigilance and Epidemiology SafetyCase Manager, and the Medical or Scientist Expert.`);
    agent.add(`The record will turn 𝗽𝗶𝗻𝗸 and the query text: \n\n •  "Opened by the DM to Site" (if raised by DM) \n •  "Opened by the CRA to Site" (if raised by CRA) \n •  "Opened by the Coder to Site" (if raised by Coding Specialist) \n •  "Opened by the Safety to Site" (if raised by Safety case manager) \n •  "Opened by the Scientific Expert to Site" (if raised by Medical or Scientist Expert) \n\n The query will also appear on your Task Summary.`);
  }

  function DemographyRaceTypes(agent) {
    agent.add(`Here are the different race categories, check all that apply from the following types: \n\n •  American Indian or Alaska Native \n •  Asian \n •  Black \n •  Native Hawaiian or Other Pacific Islander \n •  White \n •  Not Reported \n •  Unknown`);
  }
  
  function DemographyRaceExplain(agent) {
    const race = agent.parameters.RaceType;
    if (race == 'Asian'){
        agent.add(`Asian is a person having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian subcontinent, including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam.`);
    } else if (race == 'American Indian or Alaska Native'){
        agent.add(`American Indian or Alaska Native is a person having origins in any of the original peoples of North and South America (including Central America), and who maintains tribal affiliation or community attachment (e.g. Eskimo, Aleut, etc...).`);
    } else if (race == 'Black'){
        agent.add(`Black is a person having origins in any of the black racial groups of Africa.`);
    } else if (race == 'Unknown'){
        agent.add(`Unknown is a subject who does not know his Race.`);
    } else if (race == 'Not Reported'){
        agent.add(`Not Reported is a subject who chooses not to report his Race, it should be entered as Not Reported.`);
    } else if (race == 'White'){
        agent.add(`White is a person having origins in any of the original peoples of Europe, the Middle East, or North Africa.`);
    } else if (race == 'Native Hawaiian or Other Pacific Islander'){
        agent.add(`Native Hawaiian or Other Pacific Islander is a person having origins in any of the original peoples of Hawaii, Guam, Samoa, or other Pacific Islands.`);
    } else {
        agent.add(`I'm sorry I could not recognise this race category, please try reformulating, or make sure you have typed it correctly.`);
    }
  }
  
  function MedicalHistoryTerm(agent){
      agent.add(`•  Enter only one term or medical concept per row. \n•  Describe the medical event using concise medical terminology \n  ◦  i.e. syndrome names, to describe any significant medical history and concomitant chronic conditions (ex: Hypertension, diabetes) \n  ◦  Enter Pyelonephritis and not "Kidney Infection" \n•  Do not use any signs, symbols and abbreviations \n  ◦  i.e Enter Gastroesophageal Reflux and not GER`);
      agent.add(`•  Do not report surgical procedures but the medical conditions leading to surgery: \n  ◦  e.g chronic tonsillitis instead of tonsillectomy. \n•  The Diagnosis must be as precise as possible and must answer the questions: \n  ◦  What is the event? Where is it localized? \n•  Avoid the use of the following terms: \n  ◦  e.g "Illness", "Febrile illness", "With", "As a result of", "Due to".`);
  }
  
  function MedicalHistoryDiagnosis(agent){
      agent.add(`Refer to the examples provided below for each body system. Note that the diagnoses to be reported should not be limited to this list. \n  •  Blood and lymphatic: e.g bone marrow depression, thrombocytopenia \n  •  Cardiovascular: e.g cardiomyopathy, angina pectoris, hypertension \n  •  Gastro-intestinal: e.g chronic pancreatitis, intussusception \n  •  Neurological: e.g convulsions, myelitis transverse \n  •  Renal and urinary: e.g glomerulonephritis, chronic renal failure \n  •  Respiratory: e.g bronchospasm, asthma`);
      agent.add(`The following will be applicable to studies with Infants and Toddlers population only: \n  •  Endocrine: e.g Addison's disease, diabetes mellitus \n  •  Congenital, familial and genetic: e.g cystic fibrosis`);
      agent.add(`The following will be applicable to studies with Children/Adolescents and Adults population only: \n  •  Hepato-biliary: e.g chronic hepatitis. Psychiatric \n  •  Endocrine and metabolic: e.g Addison's disease, diabetes mellitus \n  •  Neoplasms benign, malignant and unspecified: e.g breast cancer (in fact any medical history of cancer) \n  •  Musculoskeletal and connective tissue: systemic lupus erythematosus, myopathy, myositis \n  •  Check the medical history entered for SAEs, if any, to make sure all relevant information is also entered in the CRF`);
  }
  
  function AdditionalFormsFill(agent){
      agent.add(`This form must be completed for each subject. For each subject, please indicate Yes or No to the below questions: \n  •  “Were any medications taken?” - Yes is ticked if the subject took at least one concomitant medication. \n  •  “Were any adverse events experienced?” - Yes is ticked if the subject experienced at least one Adverse Event or Serious Adverse Event.`);
      agent.add(`If you click on Yes and SAVE, an “Adverse Event” folder and a “Concomitant Medication” form will appear:`);
      let img = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/AdditionalForms2_zpszlguy9qo.png');
      agent.add(new Image(img));
  }
  
  function AdverseEventInstruction3(agent){
      agent.add(`•  In case the patient suffers several AE with no connection between each other, report each AE on an individual form.\n•  In case the patient suffers several symptoms that are related to a unique diagnosis, please complete only a unique AE form reporting the diagnosis. If the diagnosis is not available, report each symptom on an individual form.\n•  In case one or several AEs being a consequence of one primary, the primary AE shall be clearly distinguished from the others.`);
  }
  
  function AdverseEventDetermine(agent){
      agent.add(`Is the diagnosis known?`);
      agent.add(new Suggestion('Yes'));
      agent.add(new Suggestion('No'));
  }
  
  function AdverseEventDetermineNo(agent){
      agent.add(`Is the AE composed of 1 single symptom?`);
      agent.add(new Suggestion('Yes'));
      agent.add(new Suggestion('No'));
  }
  
  function SeriousAEToDo(agent){
      agent.add(`If a Serious Adverse Event happens: \n  •  Enter within the 24 hours an AE log line \n  •  Ticked Seriousness = Yes and Save the AE form`);
      let img2 = new Image('http://i346.photobucket.com/albums/p426/pierrerm38/Seriousness_zpsdcwk6781.png');
      agent.add(new Image(img2));
  }
  
  function SeriousAEAutoFill(agent){
      agent.add(`The following fields are automatically filled based on AE information you provided: \n  •  Diagnosis (where possible) or signs and symptoms \n  •  Date of SAE onset \n  •  Date of SAE resolution \n  •  SAE ongoing? \n  •  Severity of the SAE \n  •  Outcome \n  •  Casual relationship (investigator's opinion) \n  •  Action taken in response to the AE \n  •  Action \n  •  Is this SAE the cause for study discontinuation`);
      agent.add(`If any modification is needed, this one must be done in the AE form.`);
  }
  
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Queries.Manual', QueriesManual);
  intentMap.set('Demography.Race.Types', DemographyRaceTypes);
  intentMap.set('Demography.Race.Explain', DemographyRaceExplain);
  intentMap.set('MedicalHistory.Term', MedicalHistoryTerm);
  intentMap.set('MedicalHistory.Diagnosis', MedicalHistoryDiagnosis);
  intentMap.set('AdditionalForms.Fill', AdditionalFormsFill);
  intentMap.set('AdverseEvent.Instruction3', AdverseEventInstruction3);
  intentMap.set('AdverseEvent.Determine', AdverseEventDetermine);
  intentMap.set('AdverseEvent.Determine - no', AdverseEventDetermineNo);
  intentMap.set('SeriousAE.ToDo', SeriousAEToDo);
  intentMap.set('SeriousAE.AutoFill', SeriousAEAutoFill);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
