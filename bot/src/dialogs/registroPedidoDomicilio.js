
const {
  ChoiceFactory,
  ChoicePrompt,
  ComponentDialog,
  ConfirmPrompt,
  DialogSet,
  DialogTurnStatus,
  NumberPrompt,
  TextPrompt,
  WaterfallDialog
} = require('botbuilder-dialogs');
const { PedidoDomicilio: PedidoDomicilio } = require('../entities/pedidoDomicilio');
const { Validators } = require('../commons/validators')

const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

const PEDIDO_DOMICILIO = 'PEDIDO_DOMICILIO';

/*
contenido CONTENIDO_PROMPT; 
direccion DIRECCION_PROMPT;
*/

const CONTENIDO_PROMPT = 'CONTENIDO_PROMPT';
const DIRECCION_PROMPT = 'DIRECCION_PROMPT';
const FINAL_CONFIRM_PROMPT = 'FINAL_CONFIRM_PROMPT';

class RegistroPedidoDomicilioDialog extends ComponentDialog {
  constructor(userState, proceso) {
      super('registroPedidoDomicilioDialog');

      this.validators = new Validators();

      this.proceso = proceso;

      this.registroPedidoDomicilio = userState.createProperty(PEDIDO_DOMICILIO);

      this.addDialog(new TextPrompt(CONTENIDO_PROMPT));
      this.addDialog(new TextPrompt(DIRECCION_PROMPT, this.validators.direccionValidator));
      this.addDialog(new ConfirmPrompt(FINAL_CONFIRM_PROMPT));

      this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
          this.contenidoStep.bind(this),
          this.direccionStep.bind(this),
          this.finalConfirmStep.bind(this),
          this.summaryStep.bind(this)
      ]));

      this.initialDialogId = WATERFALL_DIALOG;
  }

  /**
   * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {*} turnContext
   * @param {*} accessor
   */
  async run(turnContext, accessor) {
      const dialogSet = new DialogSet(accessor);
      dialogSet.add(this);

      const dialogContext = await dialogSet.createContext(turnContext);
      const results = await dialogContext.continueDialog();
      if (results.status === DialogTurnStatus.empty) {
          await dialogContext.beginDialog(this.id);
      }
  }



    async contenidoStep(step) {
        return await step.prompt(CONTENIDO_PROMPT, 'Escribe lo que deseas ordenar brevemente');
    }

    async direccionStep(step) {
      step.values.contenido = step.result;
      const promptOptions = { prompt: 'Ahora indicanos a donde debemos enviar el domicilio', retryPrompt: 'la dirección parece incompleta, intentalo nuevamente' };

      return await step.prompt(DIRECCION_PROMPT, promptOptions);
  }


  async finalConfirmStep(step) {
    step.values.direccion = step.result;
    
    let msg = 'Te presento un resumen de la información que nos haz dado hasta el momento: '
            + `Tu Pedido es: ${ step.values.contenido }. `
            + `Será enviado a la dirección: ${step.values.direccion}. `
            
    await step.context.sendActivity(msg);

    // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is a Prompt Dialog.
    return await step.prompt(FINAL_CONFIRM_PROMPT, '¿Estan todos los datos correctos?', ['si', 'no'] );
  }



  async summaryStep(step) {
    if (step.result) {
        const pedidoDomicilio = await this.registroPedidoDomicilio.get(step.context, new PedidoDomicilio());

        pedidoDomicilio.contenido = step.values.contenido;
        pedidoDomicilio.direccion = step.values.direccion;

        pedidoDomicilio.idUsuario = step.context.activity.from.id
        pedidoDomicilio.idConversacion = step.context.activity.conversation.id

         await step.context.sendActivity('Se esta enviando tu pedido al restaurante');
         try{
            await this.proceso.iniciarCaso(pedidoDomicilio)
            await step.context.sendActivity('Enhorabuena, el restaurante ha recibido tu pedido')
         } catch(ex){
            await step.context.sendActivity('Parece que hubo un problema procesando tu solicitud, por favor intentalo mas tarde');
         }
    } else {
        await step.context.sendActivity('¡Oh no! Pero no te preocupes podemos intentarlo de nuevo.');
    }

      // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is the end.
      return await step.endDialog();
  }
}

module.exports.RegistroPedidoDomicilioDialog = RegistroPedidoDomicilioDialog;