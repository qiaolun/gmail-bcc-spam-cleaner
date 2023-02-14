function deleteBccSpam() {

  const myEmail = Session.getEffectiveUser().getEmail();
  Logger.log('my email: ' + myEmail);

  const threads = GmailApp.getSpamThreads(0, 100);

  for (const thread of threads) {
    const messages = thread.getMessages();
    const message = messages[0];
    const to = message.getTo();
    const cc = message.getCc();

    Logger.log('to: ' + to + ', cc: ' + cc);

    if (to.includes(myEmail)) {
      continue;
    }
    if (cc.includes(myEmail)) {
      continue;
    }

    Logger.log('delete bcc: ' + message.getSubject());
    thread.moveToTrash();
  }
}

function deleteBccInbox() {

  const myEmail = Session.getEffectiveUser().getEmail();
  Logger.log('my email: ' + myEmail);

  const threads = GmailApp.getInboxThreads(0, 10);

  for (const thread of threads) {
    const messages = thread.getMessages();
    const message = messages[0];
    const to = message.getTo();
    const cc = message.getCc();
    const from = message.getFrom();

    Logger.log('to: ' + to + ', cc: ' + cc);

    if (message.isInPriorityInbox()) {
      continue;
    }

    if (to.includes(myEmail)) {
      continue;
    }
    if (cc.includes(myEmail)) {
      continue;
    }

    if (from.replace('>', '').endsWith('.facebook.com')) {
      continue;
    }

    Logger.log('delete bcc: ' + message.getSubject());
    thread.moveToTrash();
  }
}