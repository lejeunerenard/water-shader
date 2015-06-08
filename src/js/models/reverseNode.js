module.exports = function(audioCtx) {
   // Create a ScriptProcessorNode with a bufferSize of 8192 and a single input and output channel

   var scriptNode = audioCtx.createScriptProcessor(8192, 1, 1);

   // Give the node a function to process audio events
   scriptNode.onaudioprocess = function(audioProcessingEvent) {
      // The input buffer is the song we loaded earlier
      var inputBuffer = audioProcessingEvent.inputBuffer;

      // The output buffer contains the samples that will be modified and played
      var outputBuffer = audioProcessingEvent.outputBuffer;

      // Loop through the output channels (in this case there is only one)
      for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
         var inputData = inputBuffer.getChannelData(channel);
         var outputData = outputBuffer.getChannelData(channel);

         // Loop through the 8192 samples
         for (var sample = 0; sample < inputBuffer.length; sample++) {
            // make output equal to the same as the input
            outputData[inputBuffer.length - sample] = - inputData[sample];
         }
      }
   };

   return scriptNode;
};
