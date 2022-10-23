import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MoneybirdApi implements ICredentialType {
	name = 'moneybirdApi';
	displayName = 'Moneybird API';
	properties: INodeProperties[] = [
		{
			displayName: 'Administration Id',
			name: 'administrationId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Api Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];


}
