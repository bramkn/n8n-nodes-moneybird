import { INodeProperties } from 'n8n-workflow';
import productConfig from "./ConfigProducts.json";

export const GeneralParameters: INodeProperties[] = [
	{
		// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
		displayName: 'ID',
		name: 'id',
		// eslint-disable-next-line n8n-nodes-base/node-param-description-missing-from-dynamic-options
		type: 'options',
		typeOptions: {
			loadOptionsDependsOn: ['resource','operation'],
			loadOptionsMethod: 'getIds',
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
		type: 'options',
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
	{
		displayName: 'Query Parameter / Filter',
		name: 'query',
		placeholder: 'Add Query Parameter / Filter',
		type: 'fixedCollection',
		typeOptions: {
			loadOptionsDependsOn:['resource','operation'],
			multipleValues: true,
			sortable: true,
		},
		default: {},
		displayOptions: {
			show: {
				operation:[
					'Get Many',
				],
			},
		},
		options: [
			{
				name: 'query',
				displayName: 'Query',
				values: [
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
						displayName: 'Query Parameter Name',
						name: 'param',
						// eslint-disable-next-line n8n-nodes-base/node-param-description-missing-from-dynamic-options
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getQueryOptions',
						},
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to apply in the filter',
					},
				],
			},
		],
	},
	{
		displayName: 'Field Data',
		name: 'data',
		placeholder: 'Add field data',
		type: 'collection',
		options: 	(productConfig as INodeProperties[]),
		default: {},
		displayOptions: {
			show: {
				operation:[
					'Create',
					'Update',
				],
			},
		},
	},
];
