// Reads the stored suggestion whose notes are SUGGESTION_NOTES (control server).
const response = http.get(CONTROL_URL + '/suggestions?notes=' + encodeURIComponent(SUGGESTION_NOTES));
if (response.status !== 200) throw new Error('suggestion lookup failed: ' + response.status);
const rows = json(response.body);
output.suggestionCount = rows.length;
output.suggestionBrand = rows.length > 0 ? rows[0].brandName : '';
output.suggestionBarcode = rows.length > 0 ? rows[0].barcode : '';
