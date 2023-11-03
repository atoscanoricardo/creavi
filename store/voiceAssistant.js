// /store/voiceAssistant.js
import { commands } from "../config/voiceCommands.json";
import * as voiceCommandsFunctions from "../services/voiceCommandsFunctions";
import { defineStore } from "pinia";

export const useVoiceAssistantStore = defineStore("voiceAssistant", {
  state: () => ({
    isListening: false,
    lastCommand: "",
    instruction: "",
    recognition: null,
    grammar: "#JSGF V1.0; grammar commands; public <command> = hola isabella | adiós isabella | hola isabela | adios isabela;",
  }),
  actions: {
    startListening() {
      var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
      var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

      this.isListening = true;
      const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      const speechRecognitionList = new SpeechGrammarList();

      speechRecognitionList.addFromString(this.grammar, 1);
      recognition.grammars = speechRecognitionList;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = "es-ES";

      recognition.onresult = (event) => {
        const result = event.results[0][0];
        const command = result.transcript;
        const confidence = Math.floor(result.confidence * 10000) / 100;

        this.lastCommand = `Comando: "${command}" ${confidence}% de confianza`;

        this.executeCommand(command.toLowerCase());
      };

      recognition.onend = () => {
        recognition.start();
      };

      recognition.start();
      this.recognition = recognition;
    },

    stopListening() {
      this.isListening = false;
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }
    },

    executeCommand(command) {
      const foundCommand = commands.find((c) => c.name.toLowerCase() === command);

      if (foundCommand) {
        const action = foundCommand.action;
        if (voiceCommandsFunctions[action]) {
          voiceCommandsFunctions[action]();
        } else {
          console.log("Función no encontrada para el comando:", command);
        }
      } else {
        console.log("Comando no reconocido:", command);
      }
    },
  },
});
