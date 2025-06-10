import {IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties,} from 'n8n-workflow';

export class ScmApi implements ICredentialType {
	name = 'scmApi';
	displayName = 'SEO Content Machine API';

	documentationUrl = 'https://seocontentmachine.com/api-docs';

	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'Address',
			name: 'address',
			type: 'string',
			default: 'http://127.0.0.1:8008',
		},
		{
			displayName: 'API key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			// auth: {
			// 	username: '={{ $credentials.username }}',
			// 	password: '={{ $credentials.password }}',
			// },
			qs: {
				// Send this as part of the query string
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.address}}',
			url: '',
		},
	};
}
