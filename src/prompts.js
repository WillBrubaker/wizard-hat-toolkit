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
    {
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
    {
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
    {
        id: 4,//test email was received
        text: ['WordPress emails are being received as expected.'],
        options: [
            {
                text: 'Move to WooCommerce email troubleshooting',
                nextText: 6,
            },
        ]
    },
    {
        id: 5,//test email not received
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
    {
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
    {
        id: 7,
        text: ['a box of plugins, choose one'],
        options: [
            {
                text: 'wp mail log',
                nextText: 9,
            }
        ]
    },
    {
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
    {
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
    {
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
    {
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
    {
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
    {
        id: 13,
        text: ['A wizard has magically installed WP Test Email for you. Next, send a test email.', 'Was the test email received?'],
        options: [
            {
                text: 'Yes',
                nextText: 14
            },
            {
                text: 'No',
                nextText: 15
            }
        ]
    },
    {
        id: 14,//the WooCommerce order email
        text: ['The WooCommerce order email was received!'],
        options: [
            {
                text: 'Cool!',
                nextText: -1,
            }
        ]
    },
    {
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
    {
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
    {
        id: 17,
        text: ['The lack of a logged email indicates that there is something within the WordPress installation that is preventing emails from being sent.', 'What can be done to break this spell?'],
        options: [
            {
                text: 'Conflict troubleshooting',
                nextText: 18,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 16,
                requiredState: (currentState) => !currentState.escalateForNotLogged,
                setState: { escalateForNotLogged: true },
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 16,
                requiredState: (currentState) => !currentState.hostForNotLogged,
                setState: { hostForNotLogged: true },
            },
        ]
    },
    {
        id: 18,//conflict tshooting was chosen for lack of logged email
        text: ['Disable ALL plugins and activate a default theme such as Twenty Twenty-Two then send a test email.', 'Was the test email logged this time?'],
        options: [
            {
                text: 'Yes',
                nextText: 19,
            }
        ]
    }
]

export const gameState = {}