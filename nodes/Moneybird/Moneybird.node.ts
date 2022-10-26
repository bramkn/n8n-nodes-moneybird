import { IExecuteFunctions } from 'n8n-core';
import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { GeneralParameters } from './GeneralParametersDescription';
import { getBodyParams, getConfig, getFieldsData, getIds, getManyRecords, getOperations, getQueryOptions, getQueryParams, getResources, moneybirdApiRequest } from './GenericFunctions';
import { operations, resources } from './ResourceAndOperationDescription';
import { OperationConfig } from './types';

export class Moneybird implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Moneybird',
		name: 'moneybird',
		group: ['transform'],
		version: 1,
		description: 'Moneybird',
		icon: 'file:moneybird.svg',
		defaults: {
			name: 'Moneybird',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'moneybirdApiTokenApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['accessToken'],
					},
				},
			},
			{
				name: 'moneybirdOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'accessToken',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'accessToken',
			},
			...resources,
			...operations,
			...GeneralParameters,
		],
	};

	methods = {
		loadOptions: {
			async getResources(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const data = await getResources.call(this);
				return data;
			},
			async getOperations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const resource = this.getNodeParameter('resource', '') as string;
				const data = await getOperations.call(this,resource);
				return data;
			},
			async getIds(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const resource = this.getNodeParameter('resource', '') as string;
				const operation = this.getNodeParameter('operation', '') as string;
				const data = await getIds.call(this,resource,operation);
				return data;
			},
			async getQueryOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const resource = this.getNodeParameter('resource', '') as string;
				const operation = this.getNodeParameter('operation', '') as string;
				const data = await getQueryOptions.call(this,resource,operation);
				return data;
			},
			async getFieldsData(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const resource = this.getNodeParameter('resource', '') as string;
				const operation = this.getNodeParameter('operation', '') as string;
				const data = await getFieldsData.call(this,resource,operation);
				return data;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0, '') as string;
		const operation = this.getNodeParameter('operation', 0, '') as string;
		const config:OperationConfig = await getConfig.call(this,resource,operation) as OperationConfig;
		const returnItems: INodeExecutionData[] = [];


		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				if(config.method==='get'){
					const id = this.getNodeParameter('id', itemIndex, '') as string;
					const parentId = this.getNodeParameter('parentId', itemIndex, '') as string;
					const endpoint = config.uri.replace(':id',id).replace(':parentId',parentId);
					const queryParams = await getQueryParams.call(this,itemIndex);
					const results = await getManyRecords.call(this,endpoint,queryParams);
					returnItems.push(...results);
				}

				if(config.method==='post'){
					const id = this.getNodeParameter('id', itemIndex, '') as string;
					const parentId = this.getNodeParameter('parentId', itemIndex, '') as string;
					const endpoint = config.uri.replace(':id',id).replace(':parentId',parentId);
					const bodyParams = await getBodyParams.call(this,itemIndex);
					if(config.object!== undefined){

					}
					const results = await moneybirdApiRequest.call(this,'Post',endpoint,bodyParams);
					returnItems.push(...results);
				}
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(returnItems);
	}
}
