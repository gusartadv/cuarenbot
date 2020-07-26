const { ActivityHandler, TurnContext  } = require('botbuilder');

class AutogestionBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     */
    constructor(conversationReferences, conversationState, userState, dialogs, dialogsReferences) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialogs) throw new Error('[DialogBot]: Missing parameter. dialog is required');
        if (!conversationReferences) throw new Error('[DialogBot]: Missing parameter. conversationReferences is required');

        // Dependency injected dictionary for storing ConversationReference objects used in NotifyController to proactively message users
        this.conversationReferences = conversationReferences;
        this.dialogReferences = dialogsReferences;

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogs = dialogs;
        this.dialogState = this.conversationState.createProperty('DialogState');

        this.onMessage(async (context, next) => {
            console.log('Running dialog with Message Activity.');

            this.addConversationReference(context.activity);
            
            let currentDialog = this.getCurrentDialog(context.activity);
            console.log(currentDialog)
            // Run the Dialog with the new message Activity.
            await this.dialogs[currentDialog].run(context, this.dialogState);

            await next();
        });

        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });
    }

    addConversationReference(activity) {
        const conversationReference = TurnContext.getConversationReference(activity);
        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }

    //TODO: encontrar una mejor implementación para esto
    getCurrentDialog(activity) {
        const conversationReference = TurnContext.getConversationReference(activity);
        return this.dialogReferences[conversationReference.conversation.id] || 'default'
    }

    setDialog(idConversation, idDialog) {
        this.dialogReferences[idConversation] = idDialog
    }
}

module.exports.AutogestionBot = AutogestionBot;