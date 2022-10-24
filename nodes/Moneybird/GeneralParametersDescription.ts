import { INodeProperties } from 'n8n-workflow';

export const GeneralParameters: INodeProperties[] = [
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'ID',
		name: 'id',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-missing-from-dynamic-options
		type: 'string',
		typeOptions: {
			loadOptionsDependsOn: ['resource','operation'],
			loadOptionsMethod: 'getId',
		},
		displayOptions: {
			show: {
				operation: ['Get'],
			},
		},
		default: '',
	},
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'Parent ID',
		name: 'parentId',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-missing-from-dynamic-options
		type: 'string',
		typeOptions: {
			loadOptionsDependsOn: ['resource','operation'],
			loadOptionsMethod: 'getIds',
		},
		displayOptions: {
			show: {
				operation: [''],
			},
		},
		default: '',
	},
];
