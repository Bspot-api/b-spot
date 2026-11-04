// Demotes EMAIL server-side; the user stays logged in as a regular user (control server).
const response = http.post(CONTROL_URL + '/admins/revoke?email=' + encodeURIComponent(EMAIL), { body: '' });
if (response.status !== 200) throw new Error('admin revocation failed: ' + response.status);
