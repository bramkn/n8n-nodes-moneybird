import { INodeProperties } from 'n8n-workflow';

export const resources: INodeProperties[] = [
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Resource',
		name: 'resource',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-missing-from-dynamic-options
		type: 'options',
		noDataExpression: true,
		typeOptions: {
			loadOptionsMethod: 'getResources',
		},
		default: '',
	},
];

export const operations: INodeProperties[] = [
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Operation',
		name: 'operation',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-missing-from-dynamic-options
		type: 'options',
		typeOptions: {
			loadOptionsDependsOn: ['resource'],
			loadOptionsMethod: 'getOperations',
		},
		noDataExpression: true,
		default: '',
	},
];
