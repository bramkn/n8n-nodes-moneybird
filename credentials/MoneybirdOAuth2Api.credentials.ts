import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MoneybirdOAuth2Api implements ICredentialType {
	name = 'moneybirdOAuth2Api';
	displayName = 'Moneybird API OAuth2 API';
	extends = ['oAuth2Api'];
	properties: INodeProperties[] = [
		{
			displayName: 'Administration Id',
			name: 'administrationId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://moneybird.com/oauth/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://moneybird.com/oauth/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'multiOptions',
			options: [
				{
					name:'Sales Invoices',
					value:'sales_invoices',
				},
				{
					name:'Documents',
					value:'documents',
				},
				{
					name:'Estimates',
					value:'estimates',
				},
				{
					name:'Bank',
					value:'bank',
				},
				{
					name:'Time Entries',
					value:'time_entries',
				},
				{
					name:'Settings',
					value:'settings',
				},
			],
			default: ['sales_invoices'],
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},

	];


}
