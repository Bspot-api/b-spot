// Submits the moderation flow's suggestions through the API's public endpoint, as a visitor would.
const brands = [MODERATION_TO_APPROVE, MODERATION_TO_EDIT, MODERATION_TO_REJECT, MODERATION_TO_DELETE];
for (let i = 0; i < brands.length; i++) {
  const response = http.post(API_URL + '/api/brand-suggestions', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandName: brands[i] }),
  });
  if (response.status !== 201) throw new Error('suggestion creation failed: ' + response.status);
}
