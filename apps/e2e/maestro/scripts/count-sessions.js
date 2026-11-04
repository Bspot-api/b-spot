// How many sessions EMAIL still has in the database (control server).
const response = http.get(CONTROL_URL + '/sessions?email=' + encodeURIComponent(EMAIL));
if (response.status !== 200) throw new Error('session count failed: ' + response.status);
output.sessionCount = json(response.body).count;
