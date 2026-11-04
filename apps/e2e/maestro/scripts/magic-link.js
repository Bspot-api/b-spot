// The newest magic link MailDev received for EMAIL since the last reset (control server).
const response = http.get(CONTROL_URL + '/magic-link?email=' + encodeURIComponent(EMAIL));
if (response.status !== 200) throw new Error('magic link lookup failed: ' + response.status);
output.link = json(response.body).link;
