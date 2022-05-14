export const prompts = [
    {
        id: 1,
        text: ['You wake up in a strange Zendesk queue with no obvious exit. There is a dragon. The dragon whispers in your ear "To find the exit, you must help get my WooCommerce order emails working".', 'What do you do?'],
        options: [
            {
                text: 'determine if WordPress emails are working',
                nextText: 2,
            },
            {
                text: 'check the order status',
                nextText: 1,
                requiredState: (currentState) => !currentState.orderStatusForNotWorking,
                setState: { orderStatusForNotWorking: true },
            },
            {
                text: 'conflict troubleshooting',
                nextText: 1,
                requiredState: (currentState) => !currentState.conflictForNotWorking,
                setState: { conflictForNotWorking: true },
            },
            {
                text: 'suggest the dragon contact their host',
                nextText: 1,
                requiredState: (currentState) => !currentState.hostForNotWorking,
                setState: { hostForNotWorking: true },
            },
            {
                text: 'Cast a \'bug be gone\' spell on the dragon\'s website',
                nextText: 1,
                requiredState: (currentState) => !currentState.spellForNotWorking,
                setState: { spellForNotWorking: true },
            }
        ]
    },
    {//which plugin to install to test if emails are being sent
        id: 2,
        text: ['Sorcery causes a box of plugins to appear.', 'Which of the plugins should be installed?'],
        options: [
            {
                text: 'WP Test Email',
                nextText: 13,
                action: 'plugin install wp-test-email'
            },
            {
                text: 'Query monitor',
                nextText: 2,
                requiredState: (currentState) => !currentState.queryMonitorForEmailTest,
                setState: { queryMonitorForEmailTest: true },
            },
            {
                text: 'WP Mail Logging',
                setState: { wpMailLoggingInstall: true },
                nextText: 2,
                requiredState: (currentState) => !currentState.mailLoggingForEmailTest,
                setState: { mailLoggingForEmailTest: true },
            },
            {
                text: 'Akismet',
                nextText: 2,
                requiredState: (currentState) => !currentState.akismetEmailTest,
                setState: { akismetEmailTest: true },
            }
        ]
    },
    {//wp test email installed. Prompt to send a test email
        id: 3,
        text: ['Send a test email and then check if it has been received'],
        options: [
            {
                text: 'Yes',
                nextText: 4,
            },
            {
                text: 'No',
                nextText: 5,
            }
        ]
    },
    {//test email was received
        id: 4,
        text: ['WordPress emails are being snet and received as expected.'],
        options: [
            {
                text: 'Move to WooCommerce email troubleshooting',
                nextText: 6,
            },
            {
                text: 'Ask the dragon to show you the exit.',
                nextText: 4,
                requiredState: (currentState) => !currentState.askedDragonForExit,
                setState: { askedDragonForExit: true },

            }
        ]
    },
    {//test email not received
        id: 5,
        text: ['The email was not received. What is the next step?'],
        options: [
            {
                text: 'Determine if the email was sent.',
                nextText: 7,
            },
            {
                text: 'wrong answer',
                nextText: -1,
            }
        ]
    },
    {//What steps can you take to test WooCommerce email functionality? (I don't think this text node is used)
        id: 6,
        text: ['To test the WooCommerce email functionality, which of the following should be done:'],
        options: [
            {
                text: 'place a test order',
                nextText: 8,
            },
            {
                text: 'manually send the order from the order actions menu.',
                nextText: 8,
            }
        ]
    },
    {//prompt to choose from a list of plugins (I don't think this text node is used)
        id: 7,
        text: ['a box of plugins, choose one'],
        options: [
            {
                text: 'wp mail log',
                nextText: 9,
            }
        ]
    },
    {//options for testing WooCommerce emails.
        id: 8,//options for testing WooCommerce emails.
        text: ['Cool, was the order email received?'],
        options: [
            {
                text: 'Yes',
                nextText: 14,
            },
            {
                text: 'No',
                nextText: 14,
            }
        ]
    },
    {//wp email log has been installed. prompt to send a test email and check log
        id: 9,//wp email log has been installed.
        text: ['wp email log installed. Send a test email and check the log. Was it logged?'],
        options: [
            {
                text: 'Yes',
                nextText: 3,
            },
            {
                text: 'No',
                nextText: 10,
            }
        ]
    },
    {//email not logged, not received
        id: 10,//email not logged, not received
        text: ['email not received or sent. what now?'],
        options: [
            {
                text: 'conflict troubleshooting',
                nextText: 11,
            },
            {
                text: 'check error log',
                nextText: 12,
            }
        ]
    },
    {//conflict troubleshooting was chosen.
        id: 11,//conflict troubleshooting was chosen.
        text: ['take the site to conflict troubleshooting conditions and re-send the test email. Is it received?'],
        options: [
            {
                text: 'Yes',
                nextText: 4,
            },
            {
                text: 'No',
                nextText: 12,
            }
        ]
    },
    {//conflict t-shooting hasn't resolved anything.
        id: 12,
        text: ['WordPress emails are not sent or received, not even under conflict troubleshooting conditions. What do you do?'],
        options: [
            {
                text: 'Refer the dragon to their host for assistance.',
                nextText: 13,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 13,
            }
        ]
    },
    {//wp test email has been installed. Prompt to send a test email
        id: 13,
        text: ['A wizard has magically installed WP Test Email for you. Next, send a test email.', 'Was the test email received?'],
        options: [
            {
                text: 'Yes',
                nextText: 20,
            },
            {
                text: 'No',
                nextText: 15,
            }
        ]
    },
    {//the WordPress email was received
        id: 14,
        text: ['The WordPress email was received!'],
        options: [
            {
                text: 'Cool!',
                nextText: -1,
            }
        ]
    },
    {//wp email not received, but was it sent?
        id: 15,
        text: ['We know that the WordPress email was not received, but we don\'t know if it has been sent.', 'What can we do to find out if the email was sent?'],
        options: [
            {
                text: 'Escalate to Ohana',
                nextText: 15,
                requiredState: (currentState) => !currentState.escalateForNotReceived,
                setState: { escalateForNotReceived: true },
            },
            {
                text: 'Install & activate the wp mail log plugin',
                nextText: 16,
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 15,
                requiredState: (currentState) => !currentState.hostForNotReceived,
                setState: { hostForNotReceived: true },
            },
            {
                text: 'Conflict troubleshooting',
                nextText: 15,
                requiredState: (currentState) => !currentState.conflictForNotReceived,
                setState: { conflictForNotReceived: true },
            }
        ]
    },
    {//which plugin to install for mail logging?
        id: 16,
        text: ['A wizard has magically installed WP Mail Logging for you. Next, send a new test email and after, check the mail log to see if it was sent.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: -1.
            },
            {
                text: 'No',
                nextText: 17,
            },
        ]
    },
    {//email was not logged
        id: 17,
        text: ['The lack of a logged email indicates that there is something within the WordPress installation that is preventing emails from being sent.', 'What can be done to break this spell?'],
        options: [
            {
                text: 'Conflict troubleshooting',//These two buttons look the same, but lead to different places based on where we're at in the troubleshooting process., seems there should be a way to handle that logically.
                nextText: 18,
                requiredState: (currentState) => null === currentState.orderEmailLogged
            },
            {
                text: 'Conflict troubleshooting',
                nextText: 23,
                requiredState: (currentState) => !currentState.orderEmailLogged
            },
            {
                text: 'Escalate to Ohana',
                nextText: 17,
                requiredState: (currentState) => !currentState.escalateForNotLogged,
                setState: { escalateForNotLogged: true },
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 17,
                requiredState: (currentState) => !currentState.hostForNotLogged,
                setState: { hostForNotLogged: true },
            },
            {
                text: 'Check the WooCommerce fatal error log',
                nextText: 19,
            }
        ]
    },
    {//conflict tshooting was chosen for lack of logged email
        id: 18,
        text: ['Disable ALL plugins and activate a default theme such as Twenty Twenty-Two then send a test email.', 'Was the test email logged this time?'],
        options: [
            {
                text: 'Yes',
                nextText: 20,
            }
        ]
    },
    {//chose to check fatal error log when email not logged
        id: 19,
        text: ['Good choice! The dragon is pleased. The fatal error log is a good place to look for clues about why things aren\'t working as expected. The dragon reckons further information about fatal errors is for another time. For the purpose of this excercise, let\'s assume the fatal error presents evidence that there is a plugin conflict behind this.', 'What should you do?'],
        options: [
            {
                text: 'Conflict troubleshooting',
                nextText: 18,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 19,
                requiredState: (currentState) => !currentState.escalateForfatal,
                setState: { escalateForfatal: true },
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 19,
                requiredState: (currentState) => !currentState.hostForfatal,
                setState: { hostForfatal: true },
            },
            {
                text: 'Ask in #woo-devs',
                nextText: 19,
                requiredState: (currentState) => !currentState.slackForfatal,
                setState: { slackForfatal: true },
            }
        ]
    },
    {//wp emails working
        id: 20,
        text: ['Great! it seems WordPress emails are working as expected. Now, we need to determine if WooCommerce emails are working. Open an order and use the order actions menu to re-send the admin new order notification.', 'Was the email received?'],
        options: [
            {
                text: 'Yes',
                nextText: 21,
            },
            {
                text: 'No',
                nextText: 22,
            }
        ]
    },
    {//wc; emails working
        id: 21,
        text: ['Good job. Game over.'],
        options: [
            {
                text: 'Start over',
                nextText: -1,
            }
        ]
    },
    {//wc; email not received
        id: 22,
        text: ['Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: 23,
            },
            {
                text: 'No',
                nextText: 17,
                setState: {orderEmailLogged: false},
            }
        ]
    },
    {//order email not logged
        id: 23,
        text: ['Disable all plugins except for WooCommerce and activate a default theme such as Twenty Twenty-Two or Storefront then send a test email.', 'Was the test email logged this time?'],
        options: [
            {
                text: 'Yes',
                nextText: 20,
            }
        ]
    }
]

export const gameState = {}