export const prompts = [
    {
        id: 1,
        text: ['You wake up in a strange Zendesk queue with no obvious exit. There is a dragon who is also a WooCommerce Payments user. The dragon whispers in your ear "To find the exit, you must help get my WooCommerce order emails working on my self-hosted site".', 'What do you do?'],
        options: [
            {
                text: 'determine if WordPress emails are working',
                nextText: 2,
                setState: { orderStatusForNotWorking: null, conflictForNotWorking: null, hostForNotWorking: null, spellForNotWorking: null },
                action: { 'installPlugins': ['wp-test-email'] },
            },
            {
                text: 'check the order status',
                nextText: 1,
                requiredState: (currentState) => !currentState.orderStatusForNotWorking,
                setState: { orderStatusForNotWorking: true, showFlyover: true, flyoverText: 'WooCommerce emails rely on WordPress functionality. Don\'t you think it would be a better idea to find out if WordPress emails work?' },
            },
            {
                text: 'Conflict troubleshooting',
                nextText: 1,
                requiredState: (currentState) => !currentState.conflictForNotWorking,
                setState: { conflictForNotWorking: true, showFlyover: true, flyoverText: 'It\'s a bit premature for such a heavy-handed approach as conflict troubleshooting.' },
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 1,
                requiredState: (currentState) => !currentState.hostForNotWorking,
                setState: { hostForNotWorking: true, showFlyover: true, flyoverText: 'The dragon has cast a red-robot spell on you. It\'s quite premature to be suggesting this.' },
            },
            {
                text: 'Cast a \'bug be gone\' spell on the dragon\'s website',
                nextText: 1,
                requiredState: (currentState) => !currentState.spellForNotWorking,
                setState: { spellForNotWorking: true, showFlyover: true, flyoverText: 'That was just silly.' },
            }
        ]
    },
    {//2 which plugin to install to test if emails are being received
        id: 2,
        text: ['Sorcery causes a box of plugins to appear.', 'Which of the plugins should be installed?'],
        options: [
            {
                text: 'WP Test Email',
                nextText: 13,
                setState: { queryMonitorForEmailTest: null, mailLoggingForEmailTest: null, akismetEmailTest: null, showCheckBoxFlyover: true }
            },
            {
                text: 'Query monitor',
                nextText: 2,
                requiredState: (currentState) => !currentState.queryMonitorForEmailTest,
                setState: { queryMonitorForEmailTest: true, showFlyover: true, flyoverText: 'Query monitor is great, but not the right tool for this job.' },
            },
            {
                text: 'WP Mail Logging',
                setState: { wpMailLoggingInstall: true },
                nextText: 2,
                requiredState: (currentState) => !currentState.mailLoggingForEmailTest,
                setState: { mailLoggingEnabled: true, mailLoggingForEmailTest: true, showFlyover: true, flyoverText: 'This is a good choice to find out if the emails are sent. For now, focus on whether the email is received.' },
            },
            {
                text: 'Akismet',
                nextText: 2,
                requiredState: (currentState) => !currentState.akismetEmailTest,
                setState: { akismetEmailTest: true, showFlyover: true, flyoverText: 'Nope.' },
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
                    nextText: 3,
                },
                {
                    text: 'Escalate to Ohana',
                    nextText: 3,
                },
                {
                    text: 'Suggest the dragon have a look at mailpoet',
                    nextText: 3,
                }
            ]

    },
    {//4 test email was received
        id: 4,
        text: ['There are no evil spells affecting WordPress emails.', 'What do you do?'],
        options: [
            {
                text: 'Move to WooCommerce email troubleshooting',
                nextText: 5,
                setState: { wpEmailTroubleshootingDone: true }
            },
            {
                text: 'Ask the dragon to show you the exit.',
                nextText: 4,
                requiredState: (currentState) => !currentState.askedDragonForExit,
                setState: { askedDragonForExit: true, showFlyover: true, flyoverText: 'Determining that WordPress emails are working is only the first step in the process.' },

            }
        ]
    },
    {//5 check if wc emails are enabled first.
        id: 5,
        text: ['What should you check first? '],
        options: [
            {
                text: 'Ensure that the WooCommerce order emails are enabled',
                nextText: 6,
            },
            {
                text: 'The fatal error log',
                nextText: 5,
                setState: { showFlyover: true, flyoverText: 'The fatal error log can contain clues, but now is a bit early in the troubleshooting process for that.' }
            }
        ]
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
                text: 'Open an issue on GitHub',
                nextText: 6,
                setState: { showFlyover: true, flyoverText: 'The dragon doesn\'t think you\'ve identifed a bug just yet..' },
                //action: { 'getOrderId': [] }
            },
            {
                text: 'Ask in Slack',
                nextText: 6,
                requiredState: (currentState) => !currentState.askInSlack,
                setState: { askInSlack: true, showFlyover: true, flyoverText: 'Your colleagues tell you that you can place a test order or use the order actions menu to resend the new order email.' }
            },
            {
                text: 'First, validate the dragon\'s purchase',
                nextText: 6,
                requiredState: (currentState) => !currentState.validatePurchase,
                setState: { validatePurchase: true, showFlyover: true, flyoverText: 'The dragon qualifies for WooCommerce core support because of the use of the revenue sharing plugin WooCommerce Payments.' }
            },
        ]
    },
    {//7 prompt to choose from a list of plugins
        id: 7,
        text: ['A book of magic spells appears.', 'Which spell should you choose to cast?'],
        options: [
            {
                text: 'WP Mail Logging',
                nextText: 22,
                setState: { mailLoggingEnabled: true },
                action: { 'installPlugins': ['wp-mail-logging'] },
            },
            {
                text: 'Query monitor',
                nextText: 7,
                requiredState: (currentState) => !currentState.queryMonitorForEmailTest,
                setState: { queryMonitorForEmailTest: true, showFlyover: true, flyoverText: 'Query monitor is great, but not the right tool for this job.' },
            },
            {
                text: 'Akismet',
                nextText: 7,
                requiredState: (currentState) => !currentState.akismetEmailTest,
                setState: { akismetEmailTest: true, showFlyover: true, flyoverText: 'Nope.' },
            },
            {
                text: 'WP Test Email',
                nextText: 7,
                requiredState: (currentState) => !currentState.wpTestEmailEmailLog,
                setState: { wpTestEmailEmailLog: true, showFlyover: true, flyoverText: 'This was already installed in the earlier stages of the process. Try again.' },
            },
        ]
    },
    {//8 options for testing WooCommerce emails.
        id: 8,//options for testing WooCommerce emails.
        text: ['The dragon casts \'red robot\' spell on you. It weighs heavily on your mind.', 'We know that the WordPress email was not received, but we don\'t know if it has been sent.', 'What sorcery can be performed to find out if the email was sent?'],
        options: [
            {
                text: 'Escalate to Ohana',
                nextText: 8,
                requiredState: (currentState) => !currentState.escalateForNotReceived,
                setState: { escalateForNotReceived: true, showFlyover: true, flyoverText: 'Do you know enough about the problem to escalate at this point? The dragon doesn\'t think so.' },
            },
            {
                text: 'Install & activate the wp mail log plugin',
                nextText: 16,
                action: { 'installPlugins': ['wp-mail-logging'] },
                setState: { mailLoggingEnabled: true },
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 8,
                requiredState: (currentState) => !currentState.hostForNotReceived,
                setState: { hostForNotReceived: true, showFlyover: true, flyoverText: 'The dragon has cast a red-robot spell on you. It\'s quite premature to be suggesting this.' },
            },
            {
                text: 'Conflict troubleshooting',
                nextText: 8,
                requiredState: (currentState) => !currentState.conflictForNotReceived,
                setState: { conflictForNotReceived: true, showFlyover: true, flyoverText: 'It\'s a bit premature for such a heavy-handed approach as conflict troubleshooting.' },
            },
            {
                text: 'Cast a \'green robot\' spell',
                nextText: 8,
                requiredState: (currentState) => !currentState.spellForNotWorking,
                setState: { spellForNotWorking: true, showFlyover: true, flyoverText: 'That\'s just silly.' },
            },
            {
                text: 'Ask the dragon for a bottle of Oaxacan \'red robot be gone\'',
                nextText: 8,
                requiredState: (currentState) => !currentState.mezcal,
                setState: { mezcal: true, showFlyover: true, flyoverText: 'That\'s just silly.' }
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
        text: ['Check your <a href="http://localhost:{MailhogPort}">inbox (Mailhog)</a>. Was the test email received?'],
        options: [
            {
                text: 'Yes',
                nextText: 20,
                setState: { wpEmailReceived: true },
                action: { 'getOrderId': [] }
            },
            {
                text: 'No',
                nextText: 15,
                setState: { testEmailSent: null },
            }
        ],
        flyover: {
            text: ['A wizard has magically installed WP Test Email for you. Next, <a href="http://{domain}/wp-admin/tools.php?page=wp-test-email">send a test email</a>.', 'Your test site uses <a href="https://github.com/mailhog/MailHog">Mailhog</a> so the email address you send that to is inconsequential.'],
            checkboxes: [
                {
                    text: 'The test email has been sent.',
                    setState: { emailSent: true }
                }
            ],
            close: (currentState) => false === currentState.emailSent,
        }
    },
    {//14 the WordPress email was received
        id: 14,
        text: ['Evil spells have been removed from WordPress emails!', 'What can you do to find the exit?'],
        options: [
            {
                text: 'Move to WooCommerce email troubleshooting.',
                nextText: 5,
            },
            {
                text: 'Ask the dragon for the exit',
                nextText: 8,
                setState: { showFlyover: true, flyoverText: 'The dragon claims their WooCommerce order emails aren\'t working and rejects your request.' }
            }
        ]
    },
    {//15 wp email not received, but was it sent?
        id: 15,
        text: ['We know that the WordPress email was not received, but we don\'t know if it has been sent.', 'What sorcery can be performed to find out if the email was sent?'],
        options: [
            {
                text: 'Escalate to Ohana',
                nextText: 8,
                requiredState: (currentState) => !currentState.escalateForNotReceived,
                setState: { escalateForNotReceived: true },
            },
            {
                text: 'Install & activate the wp mail log plugin',
                nextText: 16,
                action: { 'installPlugins': ['wp-mail-logging'] },
                setState: { mailLoggingEnabled: true },
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 8,
                requiredState: (currentState) => !currentState.hostForNotReceived,
                setState: { hostForNotReceived: true },
            },
            {
                text: 'Conflict troubleshooting',
                nextText: 8,
                requiredState: (currentState) => !currentState.conflictForNotReceived,
                setState: { conflictForNotReceived: true },
            }
        ]
    },
    {//16 wp mail logging installed. Send a new test email. Was it logged?
        id: 16,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.wpEmailTroubleshootingDone ? 24 : 38,
                setState: { wpEmailLogged: true },
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.conflictTroubleshootingDone ? 3 : 17,
                increment: 'notLoggedCount',
            },
        ],
        flyover: {
            text: ['A wizard has magically installed WP Test Email for you. Next, <a href="http://{domain}/wp-admin/tools.php?page=wp-test-email">send a test email</a>.', 'Your test site uses <a href="https://github.com/mailhog/MailHog">Mailhog</a> so the email address you send that to is inconsequential.'],
            checkboxes: [
                {
                    text: 'The test email has been sent.',
                    setState: { testEmailSent: true }
                },
            ],
            close: (currentState) => false === currentState.testEmailSent,
        }
    },
    /**
     * In the wp flow just send to 18
     * 
     * in the wc flow - what has been done?
     * 
     * 
     * NO failed order paid
     */
    {//17 email was not logged
        id: 17,
        text: ['The lack of a logged email indicates that there is something within the WordPress installation that is preventing emails from being sent.', 'What can be done to break this spell?'],
        options: [
            {
                text: 'Conflict troubleshooting',
                nextText: 22,
                setState: { conflictTroubleshootingDone: true, escalateForNotLogged: null, hostForNotLogged: null }
            },
            {
                text: 'Escalate to Ohana',
                nextText: 17,
                requiredState: (currentState) => !currentState.escalateForNotLogged,
                setState: { escalateForNotLogged: true, showFlyover: true, flyoverText: 'A conflict hasn\'t been ruled out yet. Ohana asks you to conflict troubleshoot.' },
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 17,
                requiredState: (currentState) => !currentState.hostForNotLogged,
                setState: { hostForNotLogged: true, showFlyover: true, flyoverText: 'The dragon\'s host blames WooCommerce.' },
            },
            {
                text: 'Check the WooCommerce fatal error log',
                nextText: 19,
            },
            {
                text: 'Install Divi',
                nextText: 17,
                setState: { showFlyover: true, flyoverText: 'That just made things worse.' }
            }
        ]
    },
    {//18 conflict tshooting was chosen for lack of logged email
        id: 18,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the test email logged this time?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => 0 === currentState.notLoggedCount ? 20 : 30,
                setState: { wpEmailTroubleshootingDone: true },
                action: { 'installPlugins': ['woocommerce'] },
            },
            {
                text: 'No',
                nextText: 3,
                action: { 'installPlugins': ['woocommerce'] },
            }
        ],
        flyover: {
            text: ['Disable ALL plugins and activate a default theme such as Twenty Twenty-Two then send a test email.'],
            checkboxes: [
                {
                    text: 'The site is in conflict troubleshooting conditions',
                    setState: { conflictConditions: true }
                },
                {
                    text: 'The test email has been sent.',
                    setState: { testEmailSent: true },
                },
            ],
            close: (currentState) => !(currentState.testEmailSent && currentState.conflictConditions),
        }
    },
    {//19 chose to check fatal error log when email not logged
        id: 19,
        text: ['Your magic is strong! The dragon is pleased. The fatal error log is a good place to look for clues about why things aren\'t working as expected. The dragon reckons further information about fatal errors is for another time. For now, assume the fatal error presents evidence that there is a plugin conflict behind this.', 'What should you do?'],
        options: [
            {
                text: 'Conflict troubleshooting',
                nextText: 23,
                setState: { conflictTroubleshootingDone: true, escalateForfatal: null, hostForfatal: null, slackForfatal: null }
            },
            {
                text: 'Escalate to Ohana',
                nextText: 19,
                requiredState: (currentState) => !currentState.escalateForfatal,
                setState: { escalateForfatal: true, showFlyover: true, flyoverText: 'A conflict hasn\'t been rule out yet. Ohana asks you to conflict troubleshoot.' },
            },
            {
                text: 'Suggest the dragon contact their host',
                nextText: 19,
                requiredState: (currentState) => !currentState.hostForfatal,
                setState: { hostForfatal: true, showFlyover: true, flyoverText: 'The dragon doesn\'t believe you have enough information yet to pass along to the host to actually get any help. The host will just blame WooCommerce.' },
            },
            {
                text: 'Ask in #woo-devs',
                nextText: 19,
                requiredState: (currentState) => !currentState.slackForfatal,
                setState: { slackForfatal: true, showFlyover: true, flyoverText: 'A response comes back. It asks if you\'ve conflict tested yet.' },
            }
        ]
    },
    {//20 wp emails working
        id: 20,
        text: ['WordPress emails are not affected by bad magic. Now, we need to determine if WooCommerce emails have had a spell cast against them.', 'What step can you take to determine if the order emails are working?'],
        options: [
            {
                text: 'Place a test order',
                nextText: 20,
                setState: { chosePlaceTestOrder: true, wpEmailTroubleshootingDone: true, startedWithTestOrder: true, showFlyover: true, flyoverText: 'Yes..but first?' }
            },
            {
                text: 'Use the order actions menu',
                nextText: 20,
                setState: { chosePlaceTestOrder: false, wpEmailTroubleshootingDone: true, orderActionsTested: true, startedWithOrderActions: true, showFlyover: true, flyoverText: 'Yes..but first?' },
                action: { 'getOrderId': [] }
            },
            {
                text: 'Ensure that the WooCommerce order emails are enabled.',
                nextText: 6,
            },
        ]
    },
    {//21 chose place test order
        /**
         *  If the email was not received, is logging enabled?
         *      If logging is enabled, find out if the email was logged?
         *          If it was logged, there's an upstream problem. Was WordPress email received?
         *              If it was, suggest adjusting the 'From' email address for WooCommerce emails.
         *              //If it was not, suggest an SMTP solution
         *          If it was not logged
         *              has order status been checked?
         *                  If not, send to order status check.
         *                      is order paid?
         *                          if not, Manually transition the order. Order email logged?
         *                              if not, ct
         *                              if so, upstream problem likely
         *                          if so, send to CT
         *                  If so, send to CT.
         *                      place test order. Was it logged?
         *                          Yes. Game over
         *                          No. suggest escalate.
         *      If logging is not enabled, send to enable logging.
         * 
         *  If the email was received, are WP emails also received?
         *      If yes, send to end of game.
         *      If no there's probably an upstream problem. Suggest an SMTP solution.
         *  
         */
        id: 21,
        text: ['Check your <a href="http://localhost:{MailhogPort}">inbox (Mailhog)</a> to see if the email was received.', 'Was the test email received?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.wpEmailReceived ? 9 : 42,
                setState: { testOrderEmailReceived: true },
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.mailLoggingEnabled ? 22 : 7,
                //nextText: (currentState) => currentState.mailLoggingEnabled ? currentState.wcOrderEmailLogged ? currentState.wpEmailReceived ? 42 : currentState.orderStatusChecked ? 25 : 17 : 7 : 7,
                setState: { testOrderEmailReceived: false },
            }
        ],
        flyover: {
            text: ['Place a test order.'],
            checkboxes: [
                {
                    text: 'The test order has has been placed.',
                    setState: { testOrderPlaced: true }
                }
            ],
            close: (currentState) => false === currentState.testOrderPlaced,
        }
    },
    {//22 wc; email not received
        id: 22,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.wpEmailReceived ? 42 : 43,
                setState: { wcOrderEmailLogged: true }
            },
            {
                text: 'No',
                nextText: (currentState) => "undefined" === typeof currentState.orderStatusPaid ? 25 : 49,
                setState: { orderEmailLogged: false },
                increment: 'notLoggedCount',
            }
        ]
    },
    {//23 order email not logged on the test order side
        id: 23,
        text: ['After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the test email logged this time?'],
        options: [
            {
                text: 'Yes',
                nextText: 24,
                setState: { orderEmailLogged: true, conflictTroubleshootingDone: true, testEmailSent: null, conflictConditions: null },
            },
            {
                text: 'No',
                nextText: 25,
                setState: { orderEmailLogged: false, conflictTroubleshootingDone: true, testEmailSent: null, conflictConditions: null },
                increment: 'notLoggedCount',
            }
        ],
        flyover: {
            text: ['Disable all plugins except for WooCommerce and activate a default theme such as Twenty Twenty-Two or Storefront then place another test order.'],
            checkboxes: [
                {
                    text: 'The site is in conflict troubleshooting conditions',
                    setState: { conflictConditions: true }
                },
                {
                    text: 'The test order has been placed.',
                    setState: { testEmailSent: true },
                },
            ],
            close: (currentState) => !(currentState.testEmailSent && currentState.conflictConditions),
        }
    },
    {//24 email was logged. Game concluded.
        id: 24,
        text: ['The email was logged which is an indication that WordPress, WooCommerce, and wp_mail are all working as expected. The problem with the emails is most likely upstream.', 'what do you do?'],
        options: [
            {
                text: 'Suggest the dragon contact their host',
                nextText: 12,
                setState: { showFlyover: true, flyoverText: 'Not a bad choice, but was there an opportunity to suggest Mailpoet?.' }
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
                nextText: 26,
                setState: { orderStatusPaid: false }
            },
            {
                text: 'Processing',
                nextText: (currentState) => currentState.conflictTroubleshootingDone ? 40 : 17,
                setState: { orderStatusPaid: true }
            },
            {
                text: 'Completed',
                nextText: (currentState) => currentState.conflictTroubleshootingDone ? 40 : 17,
                setState: { orderStatusPaid: true }
            },
            {
                text: 'On hold',
                nextText: 26,
                setState: { orderStatusPaid: false }
            },
            {
                text: 'Cancelled',
                nextText: 26,
                setState: { orderStatusPaid: false }
            },
            {
                text: 'Refunded',
                nextText: 26,
                setState: { orderStatusPaid: false }
            },
            {
                text: 'Failed',
                nextText: 26,
                setState: { orderStatusPaid: false }
            }
        ]
    },
    {//26 test order placed but status not set to paid
        id: 26,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: 27,
                setState: { orderStatusPaid: true, unpaidOrderTransitioned: null },
            },
            {
                text: 'No',
                nextText: 17,
                setState: { orderStatusPaid: true, unpaidOrderTransitioned: null },
            }
        ],
        flyover: {
            text: ['It seems there may be a payment gateway problem. Troubleshooting this is a separate adventure. For now, transition the order to either Processing or Completed.'],
            checkboxes: [
                {
                    text: 'The order has been transitioned.',
                    setState: { unpaidOrderTransitioned: true },
                },
            ],
            close: (currentState) => false === currentState.unpaidOrderTransitioned,
        }
    },
    {//27 Game over
        id: 27,
        text: ['Check your <a href="http://localhost:{MailhogPort}">inbox (Mailhog)</a> to see if the order email was received.', 'Was the order email received?'],
        options: [
            {
                text: 'Yes',
                nextText: 44,
                setState: { testOrderEmailReceived: true },
            },
            {
                text: 'No',
                nextText: 48,
                //nextText: (currentState) => currentState.mailLoggingEnabled ? currentState.wcOrderEmailLogged ? currentState.wpEmailReceived ? 42 : currentState.orderStatusChecked ? 25 : 17 : 7 : 7,
                setState: { testOrderEmailReceived: false },
            }
        ],
    },
    {//28 chose order actions menu
        id: 28,
        text: ['Check your <a href="http://localhost:{MailhogPort}">inbox (Mailhog)</a> if it was received.', 'Was the test email received?'],
        options: [
            {
                text: 'Yes',
                nextText: 21,
                setState: { orderEmailReceivedViaOrderActions: true, testOrderActionEmail: null },
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.mailLoggingEnabled ? 22 : 7,
                setState: { testOrderActionEmail: null },
            }
        ],
        flyover: {
            text: ['Use the order actions menu {fromThisOrder}to send the admin new order email'],
            checkboxes: [
                {
                    text: 'Admin new order email has been sent via order action menu.',
                    setState: { testOrderActionEmail: true }
                }
            ],
            close: (currentState) => false === currentState.testOrderActionEmail,
        }
    },
    {//29 order email not logged - on the order actions flow.
        id: 29,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the test email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.lastNode == 17 ? 21 : currentState.chosePlaceTestOrder ? currentState.orderActionsTested && currentState.conflictTroubleshootingDone ? 41 : 30 : 35,
                setState: { conflictTroubleshootingDone: true, testEmailSent: null, conflictConditions: null, orderEmailLoggedCTC: true },
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.wpEmailReceived ? 40 : 39,
                setState: { conflictTroubleshootingDone: true, testEmailSent: null, conflictConditions: null },
            }
        ],
        flyover: {
            text: ['Disable all plugins except for WooCommerce and activate a default theme such as Twenty Twenty-Two or Storefront then use the order actions menu {fromThisOrder}to send the admin new order email. '],
            checkboxes: [
                {
                    text: 'The site is in conflict troubleshooting conditions',
                    setState: { conflictConditions: true }
                },
                {
                    text: 'Admin new order email has been sent via order action menu.',
                    setState: { testEmailSent: true },
                },
            ],
            close: (currentState) => !(currentState.testEmailSent && currentState.conflictConditions),
        }
    },
    {//30 wp emails not received but they are logged.
        id: 30,
        text: ['Emails sent (logged) but not received indicate a problem upstream from the WordPress installation. This could be emails going to spam, email servers refusing to deliver emails, etc. This would be for the dragon to take to their host but we should determine if WooCommerce order emails are being sent.', 'What step can you take to determine if the order emails are working?'],
        options: [
            {
                text: 'Ensure WooCommerce order emails are enabled',
                nextText: 6,
                setState: { chosePlaceTestOrder: true, startedWithTestOrder: true }
            }
        ]
    },
    {//31 chose order actions menu in the not received path
        id: 31,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.orderStatusPaid && !currentState.conflictTroubleshootingDone ? 17 : 41,
                setState: { orderActionsTested: true, testOrderActionEmail: null, loggedWithOrderActions: true },
            },
            {
                text: 'No',
                nextText: (currentState) => 7 === parseInt(currentState.lastNode) ? 29 : !currentState.conflictTroubleshootingDone ? 17 : 39,
                setState: { orderActionsTested: true, testOrderActionEmail: null },
            }
        ],
        flyover: {
            text: ['Use the order actions menu {fromThisOrder}to send the admin new order email.'],
            checkboxes: [
                {
                    text: 'Admin new order email has been sent via order action menu.',
                    setState: { testOrderActionEmail: true },
                },
            ],
            close: (currentState) => false === currentState.testOrderActionEmail,
        }
    },
    {//32 chose order actions menu - in the not received flow
        id: 32,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => 25 === currentState.lastNode ? 17 : 33,
                setState: { chosePlaceTestOrder: true, orderActionsTested: true, testOrderActionEmail: null, loggedWithOrderActions: true },
            },
            {
                text: 'No',
                nextText: (currentState) => true === currentState.conflictTroubleshootingDone ? 37 : 17,
                setState: { orderActionsTested: true, testOrderActionEmail: null },

            }
        ],
        flyover: {
            text: ['Use the order actions menu {fromThisOrder}to send the admin new order email.'],
            checkboxes: [
                {
                    text: 'Admin new order email has been sent via order action menu.',
                    setState: { testOrderActionEmail: true },
                },
            ],
            close: (currentState) => false === currentState.testOrderActionEmail,
        }
    },
    {//33 chose place test order - in not received flow.
        id: 33,
        text: ['After, check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: (currentState) => currentState.wpEmailReceived ? 42 : 24,
                setState: { testOrderEmailLogged: true, wcEmailSentOnTransition: true },
            },
            {
                text: 'No',
                nextText: (currentState) => ("undefined" === typeof currentState.orderStatusPaid) ? 25 : 17,
                increment: 'notLoggedCount',
                setState: { testOrderEmailLogged: false },
            }
        ],
        flyover: {
            text: ['Place a test order.'],
            checkboxes: [
                {
                    text: 'Test order placed',
                    setState: { testOrderEmailPlaced: true },
                },
            ],
            close: (currentState) => false === currentState.testOrderEmailPlaced,
        }
    },
    {//34 test order placed but status not set to paid - in not received flow.
        id: 34,
        text: ['Check the <a href="http://{domain}/wp-admin/tools.php?page=wpml_plugin_log">WP Mail Logging Log</a> to see if the email was logged.', 'Was the email logged?'],
        options: [
            {
                text: 'Yes',
                nextText: 24,
                setState: { unpaidOrderTransitioned: null },
            },
            {
                text: 'No',
                nextText: (currentState) => currentState.conflictTroubleshootingDone ? 40 : 17,
                increment: 'notLoggedCount',
                setState: { unpaidOrderTransitioned: null },
            }
        ],
        flyover: {
            text: ['It seems there may be a payment gateway problem. Troubleshooting this is a separate adventure. For now, transition the order to either Processing or Completed.'],
            checkboxes: [
                {
                    text: 'The order has been transitioned to a paid status.',
                    setState: { unpaidOrderTransitioned: true },
                },
            ],
            close: (currentState) => false === currentState.unpaidOrderTransitioned,
        }
    },
    {//35 wc order emails not received but they are logged, we haven't tried a test order yet..
        id: 35,
        text: ['Emails sent (logged) but not received indicate a problem upstream from the WordPress installation. This could be emails going to spam, email servers refusing to deliver emails, etc. This would be for the dragon to address, but we should determine if WooCommerce order emails are triggered by an order transition.', 'What should you do'],
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
                setState: { orderStatusForNotLogged: true, showFlyover: true, flyoverText: 'Go ahead and place a test order first, then if the email isn\'t logged you can check the order status.' },
            },
            {
                text: 'Suggest the dragon contact their host.',
                nextText: 35,
                requiredState: (currentState) => !currentState.hostForNotLogged,
                setState: { hostForNotLogged: true, showFlyover: true, flyoverText: 'The dragon doesn\'t believe you have enough information yet to pass along to the host to actually get any help. The host will just blame WooCommerce.' },
            },
            {
                text: 'Conflict troubleshooting',
                nextText: 35,
                requiredState: (currentState) => !currentState.conflictForNotLogged,
                setState: { conflictForNotLogged: true, showFlyover: true, flyoverText: 'The dragon lashes out angrily. Have you even placed a test order to check the WooCommerce order email functionality?' },
            },
            {
                text: 'Suggest the dragon look into Mailpoet or a SMTP solution',
                nextText: 35,
                setState: { showFlyover: true, flyoverText: 'This is definitely information that you should consider passing along to the dragon, but you should figure out if anything is wrong with the WooCommerce order emails first' }
            }
        ]
    },
    {//36 wc order email logged with order actions menu, not with order transition.
        id: 36,
        text: ['This is quite a mystery...wc order email was sent (logged) when using order action menu, but not on transition. What should you do?'],
        options: [
            {
                text: 'Check for the use of the woocommerce_defer_transactional_emails filter.',
                nextText: 12,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 12,
            },
            {
                text: 'Suggest the dragon investigate MailPoet',
                nextText: 12,
            }
        ]
    },
    {//37 CT resolved a not logged problem with wp emails, but wc emails are not logged with order actions menu or transition.
        id: 37,
        text: ['Given that WordPress emails are logged under conflict troubleshooting conditions but WooCommerce order emails are not, there\'s likely something deeper behind this.', 'What\'s the next step?'],
        options: [
            {
                text: 'Suggest the dragon contact their developer',
                nextText: 37,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 12,
            },
            {
                text: 'Ask in slack',
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
                text: 'Ensure that the WooCommerce order emails are enabled.',
                nextText: 6,
            },
            {
                text: 'Ask the dragon to show you the exit.',
                nextText: 38,
                requiredState: (currentState) => !currentState.askedDragonForExit,
                setState: { askedDragonForExit: true },

            }
        ]
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
        text: ['WooCommerce order emails are neither sent (logged) nor received even under conflict troubleshooting conditions. There\'s probably something deeper going on.', 'What\'s next?'],
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
        text: ['WordPress emails are working fine. WooCommerce order emails are sent (logged) but not received', 'What is the best next step?'],
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
    {//43 emails logged, not received. This is universal.
        id: 43,
        text: ['Emails are not received at all. WordPress emails are logged under normal conditions. WooCommerce order emails are logged under conflict troubleshooting conditions.', 'What do you do?'],
        options: [
            {
                text: 'Escalate to Ohana',
                nextText: 43,
            },
            {
                text: 'Suggest the dragon set their \'From\' email to match the WordPress admin email',
                nextText: 11,
            },
            {
                text: 'Suggest the dragon evaluate MailPoet or an SMTP service for their needs',
                nextText: 11,
            }
        ]

    },
    {//44 wp emails received fine. wc email works under ctc
        id: 44,
        text: ['WordPress emails are sent (logged). WooCommerce order emails seem to work under conflict troubleshooting conditions.', 'What should you do?'],
        options: [
            {
                text: 'Explain to the dragon that the problem seems to be external to WooCommerce',
                nextText: 12,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 44,
                setState: { showFlyover: true, flyoverText: 'WooCommerce order emails are working under conflict troubleshooting conditions' }
            },
            {
                text: 'Refer the dragon to their host',
                nextText: 44,
                setState: { showFlyover: true, flyoverText: 'Maybe mention that once they get their conflict sorted if emails aren\'t working, then they should contact their host.' }
            }
        ]
    },
    {//45 
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

    },
    {//47 wc emails work manually via order actions but not via transition
        id: 47,
        text: ['WooCommerce order emails seem to be sent ok manually but not on order transition. Even under conflict troubleshooting conditions.', 'What should you do?'],
        options: [
            {
                text: 'Suggest the dragon contact their developer',
                nextText: 47,
            },
            {
                text: 'Escalate to Ohana',
                nextText: 12,
            },
            {
                text: 'Ask in #woo-support',
                nextText: 47,
            }
        ]
    },
    {//wc order emails sent not received
        id: 48,
        text: ['WooCommerce order emails are sent (logged) under conflict troubleshooting conditions, but they are not received.', 'What should you do?'],
        options: [
            {
                text: 'Escalate to Ohana',
                nextText: 48,
            },
            {
                text: 'Suggest the dragon set their \'From\' email to match the WordPress admin email',
                nextText: 11,
            },
            {
                text: 'Suggest the dragon evaluate MailPoet or an SMTP service for their needs',
                nextText: 11,
            }
        ]
    },
    {
        id: 49,
        text: ['WordPress emails work as expected, WooCommerce order emails are not sent (logged) even under conflict troubleshooting conditions', 'What do you do?'],
        options: [
            {
                text: 'Escalate to Ohana',
                nextText: 12,
            },
            {
                text: 'Suggest the dragon set their \'From\' email to match the WordPress admin email',
                nextText: 49,
            },
            {
                text: 'Suggest the dragon evaluate MailPoet or an SMTP service for their needs',
                nextText: 49,
            }
        ]
    }


]

export const gameState = { notLoggedCount: 0/*, chosePlaceTestOrder: false, mailLoggingEnabled: true*/ }
