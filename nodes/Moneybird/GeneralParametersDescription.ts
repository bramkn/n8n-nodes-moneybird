import { INodeProperties } from 'n8n-workflow';

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
						name: 'field',
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
					'Create',
					'Update',
				],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldName',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getFieldsData',
						},
						default: '',
						description: 'Field name to include in item. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
						description: 'Value for the field to add/edit',
					},
				],
			},
		],
	},
];
