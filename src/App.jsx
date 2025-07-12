import { useEffect, useState } from 'react';
import { JsonEditor } from 'json-edit-react'
import Base64 from './Base64';

const authidRegex = /^[a-z0-9]{64}$/;
const tenantRegex = /^[a-zA-Z0-9_-]{2,64}$/;

function App() {
	const urlParams = new URLSearchParams(window.location.search);
	const authid = urlParams.get('authid');
	const tenant = urlParams.get('tenant');
	const nextUrl = urlParams.get('next');
	
	const [error, setError] = useState(null);
	const [data, setData] = useState(null);

	useEffect(() => {
		
		if (!authidRegex.test(authid)) {
			setError("Invalid authorization.");
			return;
		}

		if (!tenantRegex.test(tenant)) {
			setError("Invalid tenant.");
			return;
		}

		fetch(`/api/seacat-pki/${tenant}/auth/${authid}?next=${nextUrl}`)
			.then(response => {
				if (response.status == 404) {
					throw new Error("Requested authorization not found, maybe it is expired. Please try again.");
				}
				if (response.status != 200) {
					throw new Error("Requested authorization fetch failed with status: " + response.status);
				}
				return response.json();
			})
			.then(data => {
				if (data.result == 'OK') {
					setData(data.data);
				} else if (data.result == 'NOT_FOUND') {
					setError("Requested authorization not found.");
				} else {
					setError("Error fetching authorization data: " + data.result);
				}
			})
			.catch(error => {
				setError(error.message);
			});
	}, [authid, tenant, nextUrl]);

	const authorize = async () => {
		setError(null);
		const randomId = crypto.randomUUID();
		const params = new URLSearchParams();
		params.append("r", randomId);

		try {
			const response1 = await fetch(`/api/seacat-pki/${tenant}/fido2/authentication_options?${params}`);
			if (response1.status != 200) {
				throw new Error("FIDO2 authentication options fetch failed with status: " + response1.status);
			}
			const options = await response1.json();

			const credential = await navigator.credentials.get({
				publicKey: {
					...options,
					challenge: Base64.decodeArrayBuffer(options.challenge),
					allowCredentials: options.allowCredentials.map(x => {
						return {
							id: Base64.decodeArrayBuffer(x.id),
							type: x.type,
						}
					})
				},
			});

			// Convert credential to JSON format
			const credentialJSON = {
				id: credential.id,
				rawId: Base64.encodeArrayBuffer(credential.rawId),
				type: credential.type,
				authenticatorAttachment: credential.authenticatorAttachment,
				response: {
					authenticatorData: Base64.encodeArrayBuffer(credential.response.authenticatorData),
					clientDataJSON: Base64.encodeArrayBuffer(credential.response.clientDataJSON),
					signature: Base64.encodeArrayBuffer(credential.response.signature),
					userHandle: Base64.encodeArrayBuffer(credential.response.userHandle),
				},
				action: {
					method: 'authorize',
					authid: authid,
				},
			};			

			const response2 = await fetch(`/api/seacat-pki/${tenant}/fido2/authentication?${params}`, {
				method: 'PUT',
				body: JSON.stringify(credentialJSON),
			});
			if (response2.status != 200) {
				throw new Error("FIDO2 authentication failed with status: " + response2.status);
			}
			const result = await response2.json();
			if (result.result === 'OK') {
				alert("Success fully authorized.");
				setError(null);
				if (nextUrl) {
					window.location.href = nextUrl;
				}
			} else {
				setError("Authorization failed. " + (result?.message || result?.result || "General error."));
			}

		} catch (e) {
			setError("FIDO2 credential verification failed.");
		}
	}

	return (
		<div>
			<h1>TeskaLabs SeaCat PKI Authorization</h1>
			<div hidden={data === null}>
				<div id="json-editor">
					<JsonEditor data={data} viewOnly={true} minWidth={"100%"}/>
				</div>
				<button id="authorize-button" onClick={authorize}>Authorize</button>
			</div>
			<div id="error" hidden={error === null}>
				{error}
			</div>
		</div>
	)
}

export default App;
