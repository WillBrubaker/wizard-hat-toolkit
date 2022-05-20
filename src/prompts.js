export const prompts = [
    {
        id: 1,
        text: ['You wake up in a strange Zendesk queue with no obvious exit. There is a dragon. The dragon whispers in your ear "To find the exit, you must help get my WooCommerce order emails working on my self-hosted site".', 'What do you do?'],
        options: [
            {
                text: 'determine if WordPress emails are working',
                nextText: 2,
                setState: { orderStatusForNotWorking: null, conflictForNotWorking: null, hostForNotWorking: null, spellForNotWorking: null },
                action: {'installPlugins': ['wp-test-email']},
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
    {//2 which plugin to install to test if emails are being sent
        id: 2,
        text: ['Sorcery causes a box of plugins to appear.', 'Which of the plugins should be installed?'],
        options: [
            {
                text: 'WP Test Email',
                nextText: 13,
                setState: { queryMonitorForEmailTest: null, mailLoggingForEmailTest: null, akismetEmailTest: null }
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
                setState: { ailLoggingEnabled: true, mailLoggingForEmailTest: true },
            },
            {
                text: 'Akismet',
                nextText: 2,
                requiredState: (currentState) => !currentState.akismetEmailTest,
                setState: { akismetEmailTest: true },
            }
        ]
    },
    {//3 wp email not sent or received
        id: 3,
        text: ['WordPress emails are not sent (logged) or received.', 'What do you do?'],
        options:
            [
                {
                    text: 'Explain to the dragon that further help is out of scope',
                    nextText: 12,
                },
                {
                    text: 'Ask the dragon for the exit.',
                    nextText: 11,
                },
                {
                    text: 'Escalate to Ohana',
                    nextText: 3,
                }
            ]

    },
    {//4 test email was received
        id: 4,
        text: ['You have determined that WordPress emails are not affected by any evil spells.', 'What do you do?'],
        options: [
            {
                text: 'Move to WooCommerce email troubleshooting',
                nextText: 6,
                setState: { wpEmailTroubleshootingDone: true }
            },
            {
                text: 'Ask the dragon to show you the exit.',
                nextText: 4,
                requiredState: (currentState) => !currentState.askedDragonForExit,
                setState: { askedDragonForExit: true },

            }
        ]
    },
    {//5 empty
        id: 5,
        text: ['Emails are sent (logged) ']
    },
    {//6 What steps can you take to test WooCommerce email functionality?
        id: 6,
        text: ['Which spell can be cast to test the WooCommerce order email functionality?'],
        options: [
            {
                text: 'Place a test order',
                nextText: 21,
                setState: { chosePlaceTestOrder: true, wpEmailTroubleshootingDone: true, askInSlack: null, validatePurchase: null, startedWithTestOrder: true }
            },
            {
                text: 'Use the order actions menu.',
                nextText: 28,
                setState: { chosePlaceTestOrder: false, wpEmailTroubleshootingDone: true, askInSlack: null, validatePurchase: null, orderActionsTested: true, startedWithOrderActions: true }
            },
            {
                text: 'Ask in Slack',
                nextText: 6,
                requiredState: (currentState) => !currentState.askInSlack,
                setState: { askInSlack: true }
            },
            {
                text: 'First, validate the dragon\'s purchase',
                nextText: 6,
                requiredState: (currentState) => !currentState.validatePurchase,
                setState: { validatePurchase: true }
            }
        ]
    },
    {//7 prompt to choose from a list of plugins
        id: 7,
        text: ['A book of magic spells appears.', 'Which spell should you choose to cast?'],
        options: [
            {
                text: 'WP Mail Logging',
                nextText: (currentState) => null === currentState.chosePlaceTestOrder/*still in the wp flow*/ ? 9 : currentState.chosePlaceTestOrder ? 33 : 31,
                setState: { mailLoggingEnabled: true },
                action: {'installPlugins': ['wp-mail-logging']},
            },
            {
                text: 'Query monitor',
                nextText: 7,
                requiredState: (currentState) => !currentState.queryMonitorForEmailTest,
                setState: { queryMonitorForEmailTest: true },
            },
            {
                text: 'Akismet',
                nextText: 7,
                requiredState: (currentState) => !currentState.akismetEmailTest,
                setState: { akismetEmailTest: true },
            },
            {
                text: 'WP Test Email',
                nextText: 7,
                requiredState: (currentState) => !currentState.wpTestEmailEmailLog,
                setState: { wpTestEmailEmailLog: true },
            },
        ]
    },
    {//8 options for testing WooCommerce emails.
        id: 8,//options for testing WooCommerce emails.
        text: ['The dragon casts \'red robot\' spell on you. It weighs heavily on your mind. The dragon informs you that the problem isn\'t about WordPress emails, but WooCommerce order emails.', 'What do you do to rid yourself of this spell?'],
        options: [
            {
                text: 'Yes',
                nextText: 14,
            },
            {
                text: 'No',
                nextText: 14,
            },
            {
                text: 'determine if WordPress emails are working',
                nextText: 8,
                setState: { orderStatusForNotWorking: null, conflictForNotWorking: null, hostForNotWorking: null, spellForNotWorking: null }
            },
            {
                text: 'check the order status',
                nextText: 8,
                requiredState: (currentState) => !currentState.orderStatusForNotWorking,
                setState: { orderStatusForNotWorking: true },
            },
            {
                text: 'conflict troubleshooting',
                nextText: 8,
                requiredState: (currentState) => !currentState.conflictForNotWorking,
                setState: { conflictForNotWorking: true },
            },
            {
                text: 'suggest the dragon contact their host',
                nextText: 8,
                requiredState: (currentState) => !currentState.hostForNotWorking,
                setState: { hostForNotWorking: true },
            },
            {
                text: 'Cast a \'green robot\' spell',
                nextText: 8,
                requiredState: (currentState) => !currentState.spellForNotWorking,
                setState: { spellForNotWorking: true },
            },
            {
                text: 'Ask the dragon for a bottle of Oaxacan \'red robot be gone\'',
                nextText: 8,
                requiredState: (currentState) => !currentState.mezcal,
                setState: { mezcal: true }
            }
        ]
    },
    {//9 WooCommerce order emails working as expected
        id: 9,
        text: ['WooCommerce order emails do not appear to be affected by any bad magic.', 'What do you do?'],
        options: [
            {
                text: 'Ask the dragon for the exit.',
                nextText: 11,
            }
        ]
    },
    {//10 game over
        id: 10,
        text: ['Thanks for playing'],
        options: [

        ]
    },
    {//11 asked for the exit.
        id: 11,
        text: ['The dragon thanks you for your help and shows you the exit.'],
        options: [
            {
                text: 'Exit',
                nextText: 0,
            }
        ]
    },
    {//12
        id: 12,
        text: ['The dragon expresses understanding, but is saddened that this can\'t be resolved right now.'],
        options: [
            {
                text: 'Ask the dragon for the exit.',
                nextText: 11,
            }
        ]
    },
    {//13 wp test email has been installed. Prompt to send a test email
        id: 13,
        text: ['A wizard has magically installed WP Test Email for you. Next, <a href="http://{domain}/wp-admin/tools.php?page=wp-test-email">send a test email</a>.', 'Your test site uses <a href="https://github.com/mailhog/MailHog">Mailhog</a> so the email address you send that to is inconsequential.', 'Check your <a href="http://localhost:{MailhogPort}">inbox (Mailhog)</a>. Was the test email received?'],
        checkboxen: [
            {
                label: 'The test email has been sent.',
                nextText: 13,
                setState: {testEmailSent: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: 20,
                setState: { wpEmailReceived: true, testEmailSent: null },
                requiredState: (currentState) => currentState.testEmailSent,
                action: {'getOrderId': []}
            },
            {
                text: 'No',
                nextText: 15,
                setState: { testEmailSent: null },
                requiredState: (currentState) => currentState.testEmailSent,
            }
        ]
    },
    {//14 the WordPress email was received
        id: 14,
        text: ['Evil spells have been removed from WordPress emails!', 'What can you do to find the exit?'],
        options: [
            {
                text: 'Move to WooCommerce email troubleshooting.',
                nextText: 6,
            },
            {
                text: 'Ask the dragon for the exit',
                nextText: 8,
            }
        ]
    },
    {//15 wp email not received, but was it sent?
        id: 15,
        text: ['We know that the WordPress email was not received, but we don\'t know if it has been sent.', 'What sorcery can be performed to find out if the email was sent?'],
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
                action: {'installPlugins': ['wp-mail-logging']},
                setState: { mailLoggingEnabled: true },
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
    {//16 wp mail logging installed. Send a new test email. Was it logged?
        id: 16,
        text: ['A wizard has magically installed WP Mail Logging for you. Next, send a new test email. After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        checkboxen: [
            {
                label: 'The test email has been sent.',
                nextText: 16,
                setState: {testEmailSent: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.wpEmailTroubleshootingDone ? 24 : 38,
                setState: { wpEmailLogged: true, testEmailSent: null },
                requiredState: (currentState) => currentState.testEmailSent,
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.conflictTroubleshootingDone ? 3 : 17,
                increment: 'notLoggedCount',
                requiredState: (currentState) => currentState.testEmailSent,
                setState: { testEmailSent: null },
            },
        ]
    },
    {//17 email was not logged
        id: 17,
        text: ['The lack of a logged email indicates that there is something within the WordPress installation that is preventing emails from being sent.', 'What can be done to break this spell?'],
        options: [
            {
                text: 'Conflict troubleshooting',
                nextText: (currentState) => !currentState.wpEmailTroubleshootingDone ? 18 : (currentState.chosePlaceTestOrder && !currentState.orderActionsTested) || currentState.orderEmailReceivedViaOrderActions ? 23 : 29,
                setState: { conflictTroubleshootingDone: true, escalateForNotLogged: null, hostForNotLogged: null }
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
    {//18 conflict tshooting was chosen for lack of logged email
        id: 18,
        text: ['Disable ALL plugins and activate a default theme such as Twenty Twenty-Two then send a test email. After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the test email logged this time?'],
        checkboxen: [
            {
                label: 'The site is in conflict troubleshooting conditions',
                nextText: 18,
                setState: {conflictConditions: true}
            },
            {
                label: 'The test email has been sent.',
                nextText: 18,
                setState: {testEmailSent: true},
            },
            
        ],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => 0 === currentState.notLoggedCount ? 20 : 30,
                setState: { wpEmailTroubleshootingDone: true, testEmailSent: null, conflictConditions: null },
                requiredState: (currentState) => currentState.testEmailSent && currentState.conflictConditions,
                action: {'installPlugins': ['woocommerce']},
            },
            {
                text: 'No',
                nextText: 3,
                requiredState: (currentState) => currentState.testEmailSent && currentState.conflictConditions,
                setState: { testEmailSent: null, conflictConditions: null },
                action: {'installPlugins': ['woocommerce']},
            }
        ]
    },
    {//19 chose to check fatal error log when email not logged
        id: 19,
        text: ['Your magic is strong! The dragon is pleased. The fatal error log is a good place to look for clues about why things aren\'t working as expected. The dragon reckons further information about fatal errors is for another time. For this exercise, let\'s assume the fatal error presents evidence that there is a plugin conflict behind this.', 'What should you do?'],
        options: [
            {
                text: 'Conflict troubleshooting',
                nextText: (currentState) => !currentState.wpEmailTroubleshootingDone ? 18 : (currentState.chosePlaceTestOrder && !currentState.orderActionsTested) || currentState.orderEmailReceivedViaOrderActions ? 23 : 29,
                setState: { conflictTroubleshootingDone: true, escalateForfatal: null, hostForfatal: null, slackForfatal: null }
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
    {//20 wp emails working
        id: 20,
        text: ['WordPress emails are not affected by bad magic. Now, we need to determine if WooCommerce emails have had a spell cast against them.', 'What step can you take to determine if the order emails are working?'],
        options: [
            {
                text: 'Place a test order',
                nextText: 21,
                setState: { chosePlaceTestOrder: true, wpEmailTroubleshootingDone: true, startedWithTestOrder: true }
            },
            {
                text: 'Use the order actions menu.',
                nextText: 28,
                setState: { chosePlaceTestOrder: false, wpEmailTroubleshootingDone: true, orderActionsTested: true, startedWithOrderActions: true }
            }
        ]
    },
    {//21 chose place test order
        id: 21,
        text: ['Place a test order. After, Check your <a href="http://localhost:{MailhogPort}">inbox (Mailhog)</a> to see if the email was received.', 'Was the test email received?'],
        checkboxen: [
            {
                label: 'Test order placed',
                nextText: 21,
                setState: {testOrderEmailPlaced: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.lastNode === 29 ? 44 : 9,
                setState: { chosePlaceTestOrder: true, testOrderEmailReceived: true, testOrderEmailPlaced: null },
                requiredState: (currentState) => currentState.testOrderEmailPlaced,
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.lastNode === 29 ? 42 : currentState.lastNode === 6 ? 25 : (currentState.lastNode === 20) || (currentState.lastNode === 28 && currentState.wpEmailReceived) ? 7 : (currentState.lastNode === 28 && currentState.wpEmailLogged) ? 22 : currentState.lastNode === 28 ? 25 : 22,
                setState: { chosePlaceTestOrder: true, testOrderEmailReceived: false, testOrderEmailPlaced: null },
                requiredState: (currentState) => currentState.testOrderEmailPlaced,
            }
        ]
    },
    {//22 wc; email not received
        id: 22,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.lastNode === 30 ? 45 : 24,
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.lastNode === 30 ? 25 : 17,
                setState: { orderEmailLogged: false },
                increment: 'notLoggedCount',
            }
        ]
    },
    {//23 order email not logged on the test order side
        id: 23,
        text: ['Disable all plugins except for WooCommerce and activate a default theme such as Twenty Twenty-Two or Storefront then place another test order. After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the test email logged this time?'],
        checkboxen: [
            {
                label: 'The site is in conflict troubleshooting conditions',
                nextText: 23,
                setState: {conflictConditions: true}
            },
            {
                label: 'The test email has been sent.',
                nextText: 23,
                setState: {testEmailSent: true},
            },
            
        ],
        options: [
            {
                text: 'Yes',
                nextText: 24,
                setState: { orderEmailLogged: true, conflictTroubleshootingDone: true, testEmailSent: null,  conflictConditions: null},
                requiredState: (currentState) => currentState.conflictConditions && currentState.testEmailSent,
            },
            {
                text: 'No',
                nextText: (currentState) => "undefined" === typeof currentState.orderActionsTested || currentState.orderEmailReceivedViaOrderActions ? 31 : 40,
                setState: { orderEmailLogged: false, conflictTroubleshootingDone: true , testEmailSent: null, conflictConditions: null},
                requiredState: (currentState) => currentState.conflictConditions && currentState.testEmailSent,
                increment: 'notLoggedCount',
            }
        ]
    },
    {//24 email was logged. Game concluded.
        id: 24,
        text: ['The email was logged which is an indication that WordPress, WooCommerce, and wp_mail are all working as expected. The problem with the emails is most likely upstream.', 'what do you do?'],
        options: [
            {
                text: 'Suggest the dragon contact their host',
                nextText: 27,
            },
            {
                text: 'Suggest the dragon investigate MailPoet',
                nextText: 12,
            }
        ],
    },
    {//25 test order placed, email not received, what is the order status?
        id: 25,
        text: ['WooCommerce order emails are only sent when the order is transitioned to a paid status (either processing or completed).', 'What is the order status?'],
        options: [
            {
                text: 'Pending payment',
                nextText: (currentState) => currentState.notLoggedCount ? 32 : currentState.sentNotReceived ? 26 : 34,
                setState: { orderStatusPaid: false }
            },
            {
                text: 'Processing',
                nextText: (currentState) => currentState.testOrderForNotLogged && currentState.notLoggedCount ? 36 : !currentState.notLoggedCount ? currentState.mailLoggingEnabled ? 31 : 7 : currentState.orderActionsTested ? 24 : 31,
                setState: { orderStatusPaid: true }
            },
            {
                text: 'Completed',
                nextText: (currentState) => currentState.testOrderForNotLogged && currentState.notLoggedCount ? 36 : !currentState.notLoggedCount ? currentState.mailLoggingEnabled ? 31 : 7 : currentState.orderActionsTested ? 24 : 31,
                setState: { orderStatusPaid: true }
            },
            {
                text: 'On hold',
                nextText: (currentState) => currentState.notLoggedCount ? 32 : currentState.sentNotReceived ? 26 : 34,
                setState: { orderStatusPaid: false }
            },
            {
                text: 'Cancelled',
                nextText: (currentState) => currentState.notLoggedCount ? 32 : currentState.sentNotReceived ? 26 : 34,
                setState: { orderStatusPaid: false }
            },
            {
                text: 'Refunded',
                nextText: (currentState) => currentState.notLoggedCount ? 32 : currentState.sentNotReceived ? 26 : 34,
                setState: { orderStatusPaid: false }
            },
            {
                text: 'Failed',
                nextText: (currentState) => currentState.notLoggedCount ? 32 : currentState.sentNotReceived ? 26 : 34,
                setState: { orderStatusPaid: false }
            }
        ]
    },
    {//26 test order placed but status not set to paid
        id: 26,
        text: ['It seems there may be a payment gateway problem. Troubleshooting this is a separate adventure. For now, transition the order to either Processing or Completed, and after, check your <a href="http://localhost:{MailhogPort}">inbox (Mailhog)</a> to see if the email was received.', 'Was the test email received??'],
        checkboxen: [
            {
                label: 'The order has been transitioned.',
                nextText: 26,
                setState: {unpaidOrderTransitioned: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: 27,
                setState: { orderStatusPaid: true, unpaidOrderTransitioned: null },
                requiredState: (currentState) => currentState.unpaidOrderTransitioned,
            },
            {
                text: 'No',
                nextText: 22,
                setState: { orderStatusPaid: true, unpaidOrderTransitioned: null },
                requiredState: (currentState) => currentState.unpaidOrderTransitioned,
            }
        ]
    },
    {//27 Game over
        id: 27,
        text: ['Game Over'],
        options: [
            {
                text: 'Restart',
                nextText: -1,
            }
        ]
    },
    {//28 chose order actions menu
        id: 28,
        text: ['Use the order actions menu to send the admin new order email then check your <a href="http://localhost:{MailhogPort}">inbox (Mailhog)</a> if it was received.', 'Was the test email received?'],
        checkboxen: [
            {
                label: 'Admin new order email has been sent via order action menu.',
                nextText: 28,
                setState: {testOrderActionEmail: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: 21,
                setState: { orderEmailReceivedViaOrderActions: true, testOrderActionEmail: null},
                requiredState: (currentState) => currentState.testOrderActionEmail,
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.mailLoggingEnabled ? 22 : 7,
                requiredState: (currentState) => currentState.testOrderActionEmail,
                setState: {testOrderActionEmail: null},
            }
        ]
    },
    {//29 order email not logged - on the order actions flow.
        id: 29,
        text: ['Disable all plugins except for WooCommerce and activate a default theme such as Twenty Twenty-Two or Storefront then use the order actions menu to send the admin new order email. After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the test email logged this time?'],
        checkboxen: [
            {
                label: 'The site is in conflict troubleshooting conditions',
                nextText: 29,
                setState: {conflictConditions: true}
            },
            {
                label: 'Admin new order email has been sent via order action menu.',
                nextText: 29,
                setState: {testEmailSent: true},
            },
            
        ],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.lastNode == 17 ? 21 : currentState.chosePlaceTestOrder ? currentState.orderActionsTested && currentState.conflictTroubleshootingDone ? 41 : 30 : 35,
                setState: { conflictTroubleshootingDone: true, testEmailSent: null, conflictConditions: null },
                requiredState: (currentState) => currentState.conflictConditions && currentState.testEmailSent
            },
            {
                text: 'No',
                nextText: 40,
                setState: { conflictTroubleshootingDone: true, testEmailSent: null, conflictConditions: null },
                requiredState: (currentState) => currentState.conflictConditions && currentState.testEmailSent
            }
        ]
    },
    {//30 wp emails not received but they are logged.
        id: 30,
        text: ['Emails sent (logged) but not received indicate a problem upstream from the WordPress installation. This could be emails going to spam, email servers refusing to deliver emails, etc. This would be for the dragon to take to their host but we should determine if WooCommerce order emails are being sent.', 'What step can you take to determine if the order emails are working?'],
        options: [
            {
                text: 'Place a test order',
                nextText: 22,
                setState: { chosePlaceTestOrder: true, startedWithTestOrder: true }
            },
            {
                text: 'Use the order actions menu.',
                nextText: 32,
                setState: { chosePlaceTestOrder: false, startedWithOrderActions: true }
            }
        ]
    },
    {//31 chose order actions menu in the not received path
        id: 31,
        text: ['Use the order actions menu to send the admin new order email. After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        checkboxen: [
            {
                label: 'Admin new order email has been sent via order action menu.',
                nextText: 31,
                setState: {testOrderActionEmail: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.orderStatusPaid && !currentState.conflictTroubleshootingDone ? 17 : 41,
                setState: { orderActionsTested: true, testOrderActionEmail: null },
                requiredState: (currentState) => currentState.testOrderActionEmail,
            },
            {
                text: 'No',
                nextText: (currentState) => 7 === parseInt(currentState.lastNode) ? 29 : 39,
                setState: { orderActionsTested: true, testOrderActionEmail: null },
                requiredState: (currentState) => currentState.testOrderActionEmail,
            }
        ]
    },
    {//32 chose order actions menu - in the not received flow
        id: 32,
        text: ['Use the order actions menu to send the admin new order email. After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        checkboxen: [
            {
                label: 'Admin new order email has been sent via order action menu.',
                nextText: 32,
                setState: {testOrderActionEmail: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: 33,
                setState: { chosePlaceTestOrder: true, orderActionsTested: true, testOrderActionEmail: null },
                requiredState: (currentState) => currentState.testOrderActionEmail
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.conflictTroubleshootingDone ? 37 : 17,
                setState: { orderActionsTested: true, testOrderActionEmail: null },
                requiredState: (currentState) => currentState.testOrderActionEmail

            }
        ]
    },
    {//33 chose place test order - in not received flow.
        id: 33,
        text: ['Place a test order. After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        checkboxen: [
            {
                label: 'Test order placed',
                nextText: 33,
                setState: {testOrderEmailPlaced: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.wpEmailReceived ? 42 : 24,
                setState: { testOrderEmailPlaced: null},
                requiredState: (currentState) => currentState.testOrderEmailPlaced,
            },
            {
                text: 'No',
                nextText: (currentState) => (currentState.testOrderForNotLogged || "undefined" === typeof currentState.orderStatusPaid) ? 25 : currentState.conflictTroubleshootingDone ? 32 : 17,
                increment: 'notLoggedCount',
                setState: { testOrderEmailPlaced: null},
                requiredState: (currentState) => currentState.testOrderEmailPlaced,
            }
        ]
    },
    {//34 test order placed but status not set to paid - in not received flow.
        id: 34,
        text: ['It seems there may be a payment gateway problem. Troubleshooting this is a separate adventure. For now, transition the order to either Processing or Completed. After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        checkboxen: [
            {
                label: 'The order has been transitioned.',
                nextText: 34,
                setState: {unpaidOrderTransitioned: true},
            },
        ],
        options: [
            {
                text: 'Yes',
                nextText: 24,
                setState: {unpaidOrderTransitioned: null},
                requiredState: (currentState) => currentState.unpaidOrderTransitioned,
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.conflictTroubleshootingDone ? 40 : 17,
                increment: 'notLoggedCount',
                setState: {unpaidOrderTransitioned: null},
                requiredState: (currentState) => currentState.unpaidOrderTransitioned
            }
        ]
    },
    {//35 wc order emails not received but they are logged, we haven't tried a test order yet..
        id: 35,
        text: ['Emails sent (logged) but not received indicate a problem upstream from the WordPress installation. This could be emails going to spam, email servers refusing to deliver emails, etc. This would be for the dragon to take to their host but we should determine if WooCommerce order emails are triggered by an order transition.', 'What should you do'],
        options: [
            {
                text: 'Place a test order',
                nextText: 33,
                setState: { testOrderForNotLogged: true, orderStatusForNotLogged: null, hostForNotLogged: null, conflictForNotLogged: null }
            },
            {
                text: 'Check the order status.',
                nextText: 35,
                requiredState: (currentState) => !currentState.orderStatusForNotLogged,
                setState: { orderStatusForNotLogged: true },
            },
            {
                text: 'suggest the dragon contact their host.',
                nextText: 35,
                requiredState: (currentState) => !currentState.hostForNotLogged,
                setState: { hostForNotLogged: true },
            },
            {
                text: 'conflict troubleshooting',
                nextText: 35,
                requiredState: (currentState) => !currentState.conflictForNotLogged,
                setState: { conflictForNotLogged: true },
            },
        ]
    },
    {//36 wc order email logged with order actions menu, not with order transition.
        id: 36,
        text: ['This is quite a mystery...wc order email was sent (logged) when using order action menu, but not on transition. Is that filter in use?'],
        options: [
            {
                text: 'Reset',
                nextText: -1,
            }
        ]
    },
    {//37 CT resolved a not logged problem with wp emails, but wc emails are not logged with order actions menu or transition.
        id: 37,
        text: ['Given that WordPress emails are logged under conflict troubleshooting conditions but WooCommerce order emails are not, there\'s likely something deeper behind this.', 'What\'s the next step?'],
        options: [
            {
                text: 'suggest the dragon contact their developer',
                nextText: 37,
            },
            {
                text: 'escalate to Ohana',
                nextText: 37,
            },
            {
                text: 'ask in slack',
                nextText: 37,
            }
        ]
    },
    {//38 email was logged. 
        id: 38,
        text: ['The email was logged which is an indication that WordPress and wp_mail are all working as expected. The problem with the emails is most likely upstream.', 'what do you do?'],
        options: [
            {
                text: 'Suggest the dragon contact their host',
                nextText: 38,
                requiredState: (currentState) => !currentState.askedDragoncontactHost,
                setState: { askedDragoncontactHost: true },
            },
            {
                text: 'Move to WooCommerce email troubleshooting',
                nextText: 6,
            },
            {
                text: 'Ask the dragon to show you the exit.',
                nextText: 38,
                requiredState: (currentState) => !currentState.askedDragonForExit,
                setState: { askedDragonForExit: true },

            },
        ],
    },
    {//39 wp emails are logged, but wc emails are not sent (logged) or received with order actions menu or order transition.
        id: 39,
        text: ['Given that WordPress emails are sent (logged) but WooCommerce order emails are not sent or received, even under conflict troubleshooting conditions, indicates that there\'s likely something deeper behind this.', 'What\'s the next step?'],
        options: [
            {
                text: 'Suggest the dragon contact their developer',
                nextText: 39,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 12,
            },
            {
                text: 'Ask in #woo-support',
                nextText: 39,
            }
        ]
    },
    {//40 wp emails are received, but WooCommerce emails are not sent (logged) or received
        id: 40,
        text: ['WordPress emails are received, but WooCommerce order emails are neither sent (logged) nor received even under conflict troubleshooting conditions. There\'s probably something deeper going on.', 'What\'s next?'],
        options: [
            {
                text: 'Suggest the dragon contact their developer',
                nextText: 40,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 12,
            },
            {
                text: 'Ask in #woo-support',
                nextText: 40,
            }
        ]
    },
    {//41 WP emails work fine. WC emails work via order action but not via transition
        id: 41,
        text: ['WordPress emails are received as expected, but WooCommerce order emails only work via the order actions menu and not on order transition even under conflict troubleshooting conditions.'],
        options: [
            {
                text: 'Suggest the dragon contact their developer',
                nextText: 41,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 12,
            },
            {
                text: 'Ask in #woo-support',
                nextText: 41,
            }
        ]
    },
    {//42 WP emails work fine. WC emails are not received, but they are sent. Most likely a "From" email address thing
        id: 42,
        text: [' WordPress emails are working fine. WooCommerce order emails are sent (logged) but not received', 'What is the best next step?'],
        options: [
            {
                text: 'Escalate to Ohana',
                nextText: 42,
            },
            {
                text: 'Suggest the dragon set their \'From\' email to match the WordPress admin email',
                nextText: 11,
            },
            {
                text: 'Suggest the dragon evaluate MailPoet for their needs',
                nextText: 11,
            }
        ]
    },
    {//43 wp emails received fine. wc email not received but it is logged.
        id: 43,

    },
    {//44 wp emails received fine. wc email works under ctc
        id: 44,
        text: ['wp emails received. wc emails work under conflict troubleshooting conditions'],
        options: [
            {
                text: 'Awesome',
                nextText: 12,
            }
        ]
    },
    {
        id: 45,
        text: ['wp emails logged, wc email logged with test order. Problem is upstream'],
        options: [
            {
                text: 'refer the dragon to their host',
                nextText: 12,
            }
        ]
    },
    {//46 mostly a duplicate of 22 but for a different flow
        id: 46,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: 24,
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.conflictTroubleshootingDone ? "undefined" === typeof currentState.orderStatusPaid ? 25 : 31 : 17,
                setState: { orderEmailLogged: false },
                increment: 'notLoggedCount',
            }
        ]

    }


]

export const gameState = { notLoggedCount: 0/*, chosePlaceTestOrder: false, mailLoggingEnabled: true*/ }
