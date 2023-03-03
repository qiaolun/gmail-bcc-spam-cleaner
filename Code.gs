
function trimGmail(mail) {

  let list = mail.split(',')
  for (let i in list) {
    let m = list[i];
    let parts = m.split('@')

    m = parts[0].replaceAll(/\+[^@]*/g, '').replaceAll('.', '') + '@' + parts[1];
    list[i] = m;
  }
  return list.join(', ')
}

function isThreadSpam(myEmail, thread) {
  const messages = thread.getMessages();
  const message = messages[0];
  const to = message.getTo();
  const cc = message.getCc();
  const from = message.getFrom();

  const listId = message.getHeader('List-ID');
  if (listId.indexOf('.7289367.xt.local') !== -1) {
    // is spam list
    return true;
  }

  if (from.replace('>', '').endsWith('.facebook.com')) {
    return false;
  }

  // check bcc
  if (trimGmail(to).includes(myEmail)) {
    return false;
  }
  if (trimGmail(cc).includes(myEmail)) {
    return false;
  }

  Logger.log('is bcc');

  // is bcc spam
  return true;
}


function deleteBccSpam() {

  const myEmail = Session.getEffectiveUser().getEmail();
  Logger.log('my email: ' + myEmail);

  const threads = GmailApp.getSpamThreads(0, 100);

  for (const thread of threads) {

    if (!isThreadSpam(myEmail, thread)) {
      continue;
    }

    if (thread.isImportant()) {
      thread.markUnimportant();
    }

    Logger.log('delete bcc: ' + thread.getFirstMessageSubject());
    thread.moveToTrash();
  }
}

function deleteBccInbox() {

  const myEmail = Session.getEffectiveUser().getEmail();
  Logger.log('my email: ' + myEmail);

  const threads = GmailApp.getInboxThreads(0, 10);

  for (const thread of threads) {
    if (!isThreadSpam(myEmail, thread)) {
      continue;
    }

    if (thread.isImportant()) {
      thread.markUnimportant();
    }

    Logger.log('delete bcc: ' + thread.getFirstMessageSubject());
    thread.moveToSpam();
  }
}