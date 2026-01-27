/* Lightweight HTTP wrapper used across services.

This delegates to `window.Liferay.Util.fetch` which – in the
development HTML (`index.html`) – is shimmed to include a
credential header. In a real Liferay deployment this will be the
platform-aware fetch helper and will include the portal auth
context. */
class ApiService {

    /* makeCall: perform a fetch, check the response and return parsed JSON
    - url: full endpoint URL
    - method: HTTP verb
    - body: optional JS object; if present it is JSON-stringified and sets `Content-Type: application/json` */
    static makeCall(url, method, body) {
        console.log("API Call:", method, url, body ? body : "");

        let call = window.Liferay.Util
            .fetch(url, {
                method: method,
                ...(body ? { headers: { 'Content-Type': 'application/json'} } : {}),
                ...(body ? { body: JSON.stringify(body) } : {})
            }).then(response => {
                if (!response.ok) {
                    // Let callers observe the rejection via promise chain; logging is done by consumers.
                    throw new Error('Network response was not ok ' + response.statusText);
                }

                if (response.status === 204) {
                    return null;
                }

                return response.json();
            });

        // This console.log helps during local dev to inspect API responses; callers generally rely on the resolved value.
        return call.then(data => {
            console.log("API CALL: Data...", data);
            return data;
        });

    }

}

export default ApiService;