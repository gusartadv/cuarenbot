const path = require('path');
// Read environment variables from .env file
const ENV_FILE = path.join(__dirname, '/../.env');
require('dotenv').config({ path: ENV_FILE });

console.log(ENV_FILE)
const restify = require('restify');

const { Configuration } = require('./configuration')
console.log('Configuración:', Configuration)

const { ConsoleAdapter } = require('./adapters/consoleAdapter');
const {TwilioWhatsAppAdapter} = require('@botbuildercommunity/adapter-twilio-whatsapp')
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter, ConversationState, MemoryStorage, UserState } = require('botbuilder');

// Import our custom bot class that provides a turn handling function.
const { AutogestionBot } = require('./bots/autogestionbot');

//Dialogs
const { RegistroPedidoDomicilioDialog } = require('./dialogs/registroPedidoDomicilio');

//FormTask
//const { SatisfaccionUsuarioFormTask } = require('./dialogs/formTask/satisfaccionUsuarioFormTask');

//plantillas notificaciones
const { TemplateManager } = require('./templates/templateManager')

//procesos BPM
const { ProcesoBPM } = require('./bpm/procesoBPM')
const { APIBpmsIntegration } = require('./integrations/api-bpms')

const defaultChannel = Configuration.defaultChannel;

//adapters
const consoleAdapter = new ConsoleAdapter();
const botFrameworkAdapter = new BotFrameworkAdapter(Configuration.botframeworkAdapter);
const whatsAppAdapter = new TwilioWhatsAppAdapter(Configuration.twilioWhatsAppAdapter);

//local context
const conversationReferences = {};

const dialogReferences = {}
// Define the state store for your bot.
// See https://aka.ms/about-bot-state to learn more about using MemoryStorage.
// A bot requires a state storage system to persist the dialog and user state between messages.
const memoryStorage = new MemoryStorage();

// Create conversation state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// configuramos el proceso a iniciar
const proceso = new ProcesoBPM(Configuration.bpm);
//usamos la integración con el BPMS de BonitaSoft
proceso.usarBPMS(new APIBpmsIntegration(Configuration.apibpms))

// Create the main dialog.
const registroPedidoDomicilio = new RegistroPedidoDomicilioDialog(userState, proceso);


//form task

const dialogs = {
    registroPedidoDomicilio: registroPedidoDomicilio,
    default: registroPedidoDomicilio

}
//Aqu
const bot = new AutogestionBot(conversationReferences, conversationState, userState, dialogs, dialogReferences);

// Create templateManager to send proactive messages
const templateManager = new TemplateManager();

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.listen(process.env.port || process.env.PORT || 8087, function() {
    console.log(`\n${ server.name } listening to ${ server.url }.`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

// Listen for incoming notifications and send proactive messages to users.
server.post('/api/notify/:iduser', async (req, res) => {

    
    const conversationReference = getConversationReference(req.params.iduser)
    const templateFilled = templateManager.findTemplateAndReplaceParams(req.body.idTemplate, req.body.params)
    await continueConversation(defaultChannel, conversationReference, templateFilled)

    //no estoy seguro de esto
    bot.setDialog(req.params.iduser, 'default');
    //build response
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.write('{ "result": "OK"}');
    res.end();
});

//
server.get('/api/formTask/:formTaskId/context/:varName', async (req, res) => {
    let formTaskId = req.params.formTaskId;
    let contextVarName = req.params.varName;
    let TaskId = req.query.id;
    //let conversationId = req.query.idConversation
    console.log(`Se ha recibido una petición del bpm, formTaskId: ${formTaskId}, taskId: ${TaskId}`)
    //obtenemos el contexto de la tarea
    let context = await proceso.obtenerContextoDeTarea(TaskId, contextVarName);
    
    conversationId = context.conversationId
    console.log(conversationId)
    
    //cargamos en el template el mensaje de solicitud del formulario para que el usuario responda
    const conversationReference = getConversationReference(conversationId)
    const templateFilled = templateManager.findTemplateAndReplaceParams(formTaskId+'Request', [])
    dialogs[formTaskId].asignBPMTask(TaskId);
    bot.setDialog(conversationId, formTaskId);

    await continueConversation(defaultChannel, conversationReference, templateFilled)
    //build response
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.write('El bot esta enviando el formulario');
});


// WhatsApp endpoint for Twilio
server.post('/api/whatsapp/messages', (req, res) => {
    whatsAppAdapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await bot.run(context);
    });
});


// Listen for incoming requests. Bot Emulator, Bot Framework
server.post('/api/messages', (req, res) => {
    botFrameworkAdapter.processActivity(req, res, async (context) => {
        // Route the message to the bot's main handler.
        await bot.run(context);
    });
});

/*
// Para probarlo en consola
consoleAdapter.listen(async (context) => {
    await bot.run(context);
});

// Emit a startup message with some instructions.
console.log('> Console Bot is online.');
console.log(''); 
*/

function getConversationReference(idUsuario){
    const idUserFiltered = Object.keys(conversationReferences)
                                                .filter((value) => value === idUsuario);
    return conversationReferences[idUserFiltered[0]]
}

async function continueConversation(channel, conversationReference, message){
    if(channel === 'whatsapp'){
        await whatsAppAdapter.continueConversation(conversationReference, async turnContext => {
            await turnContext.sendActivity(message);
        });
    }

    if(channel === 'botframework'){
        await botFrameworkAdapter.continueConversation(conversationReference, async turnContext => {
            await turnContext.sendActivity(message);
        });
    }
}

