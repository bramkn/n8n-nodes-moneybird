import config from "./Config.json";

import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	OptionsWithUri,
} from 'request';

import {
	IBinaryData,
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

import {
	LoadedContacts,
	LoadedProducts,
	LoadedResource,
	MoneybirdApiCredentials,
} from './types';



export async function moneybirdApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	isFileRequest:boolean=false,
) {
	const credentials = await this.getCredentials('moneybird') as MoneybirdApiCredentials;
	const options: OptionsWithUri = {
		headers: {
			'authorization': `bearer ${credentials.apiToken}`,
		},
		method,
		body,
		qs,
		uri: `${credentials.host}/api/v2/${credentials.administrationId}/${endpoint}.json`,
		json: true,
		gzip: true,
		rejectUnauthorized: true,
	};
	if(isFileRequest){
		options.headers![`Content-Type`] = 'multipart/form-data';
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}
	try {
		return await this.helpers.request!(options);
	} catch (error:any) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function getResources(){
	const returnData: INodePropertyOptions[] = [];
	for(const key of Object.keys((config as IDataObject) || {})){
		returnData.push(
			{
				name: key,
				value: key,
			}
		)
	}

	return returnData;


}

export async function getOperations(resource:string){
	const operationConfig = (config as IDataObject)[resource] || {};
	const returnData: INodePropertyOptions[] = [];
	for(const key of Object.keys(operationConfig)){
		returnData.push(
			{
				name: key,
				value: key,
			}
		)
	}

	return returnData;


}


















export async function moneybirdApiRequestSingleItemReturned(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
){
	const result = await moneybirdApiRequest.call(this,method, endpoint, body, qs);
	const newItem: INodeExecutionData = {
		json: {},
		binary: {},
	};
	newItem.json = result;
	return newItem;
}


export async function moneybirdApiRequestUploadFile(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	item:INodeExecutionData = {
		json: {},
		binary: {},
	},
	itemIndex:number = 0,
	prefix:string=''
){
	if (item.binary === undefined) {
		throw new NodeOperationError(this.getNode(), 'No binary data exists on item!');
	}
	const binaryPropertyNameFull = this.getNodeParameter(`${prefix}_binaryPropertyName`, itemIndex) as string;
	const binaryPropertyNames = binaryPropertyNameFull.split(',').map(key => key.trim());
	for (const propertyData of binaryPropertyNames) {
		let propertyName = 'file';
		let binaryPropertyName = propertyData;
		if (propertyData.includes(':')) {
			const propertyDataParts = propertyData.split(':');
			propertyName = propertyDataParts[0];
			binaryPropertyName = propertyDataParts[1];
		} else if (binaryPropertyNames.length > 1) {
			throw new NodeOperationError(this.getNode(), 'If more than one property should be send it is needed to define the in the format:<code>"sendKey1:binaryProperty1,sendKey2:binaryProperty2"</code>');
		}

		if (item.binary[binaryPropertyName] === undefined) {
			throw new NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
		}

		const binaryProperty = item.binary[binaryPropertyName] as IBinaryData;
		const binaryDataBuffer = await this.helpers.getBinaryDataBuffer!(itemIndex, binaryPropertyName);

		body[propertyName] = {
			value: binaryDataBuffer,
			options: {
				filename: binaryProperty.fileName,
				contentType: binaryProperty.mimeType,
			},
		};

	}

	const result = await moneybirdApiRequest.call(this,method, endpoint, body, qs,true);
	const newItem: INodeExecutionData = {
		json: {},
		binary: {},
	};
	newItem.json = result;
	return newItem;
}

export async function formatFilters(this: IExecuteFunctions | ILoadOptionsFunctions,input:IDataObject){
	const filterArray:string[] =[];
	Object.entries(input).forEach(entry => {
		const [key, value] = entry;
		filterArray.push(`${key}:${value}`);

	});
	if(filterArray.length>0){
		return filterArray.join(',');
	}
	else{
		return '';
	}
}

export const toOptions = (items: LoadedResource[]) =>
	items.map(({ name, id }) => ({ name, value: id }));

export const contactsToOptions = (items: LoadedContacts[]) =>
	items.map(({ company_name, id }) => ({ name: company_name, value: id }));

export const ProductsToOptions = (items: LoadedProducts[]) =>
	items.map(({ title, id }) => ({ name: title, value: id }));

export async function getRecords(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	itemIndex:number,
	endpoint:string,
	resource:string,
	qs:IDataObject ={},
){
	const returnItems: INodeExecutionData[] = [];

	qs['page'] = 1;
	qs['per_page'] = 100;

	let data;
	let dataArray;
	do{
		data = await moneybirdApiRequest.call(this,'Get', endpoint, {}, qs);
		//console.log(data);
		qs['page'] += 1;
		dataArray = [].concat(data);
		for (let dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
			const newItem: INodeExecutionData = {
				json: {},
				binary: {},
			};
			newItem.json = dataArray[dataIndex];
			returnItems.push(newItem);
		}
	} while (dataArray.length === qs['per_page']);// && returnItems.length < limit);
	return returnItems;
}

export async function addNote(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	itemIndex:number,
	endpoint:string,
	prefix:string,
	idField:string,
){
	const id = this.getNodeParameter(idField, itemIndex, '') as string;
	if(id ===''){
		throw new NodeOperationError(this.getNode(), 'A resource Id is required to add a Note');
	}
	const note = this.getNodeParameter(`${prefix}NoteNote`, itemIndex, '') as string;
	const toDo = this.getNodeParameter(`${prefix}NoteToDo`, itemIndex, false) as boolean;
	const assigneeId = this.getNodeParameter(`${prefix}NoteAssigneeId`, itemIndex, '') as string;

	if(note === ''){
		throw new NodeOperationError(this.getNode(), 'A note is required to be able to add a note.');
	}

	const body:IDataObject ={
		note:{
			note,
			todo:toDo,
			assignee_id:assigneeId,
		},
	};
	endpoint = `${endpoint}/${id}/notes`;
	const result = await moneybirdApiRequest.call(this,'Post', endpoint, body, {});

	const newItem: INodeExecutionData = {
		json: {},
		binary: {},
	};
	newItem.json = result;
	return newItem;
}

export async function deleteNote(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	itemIndex:number,
	endpoint:string,
	idField:string,
	noteIdField:string,
){
	const id = this.getNodeParameter(idField, itemIndex, '') as string;
	const noteId = this.getNodeParameter(noteIdField, itemIndex, '') as string;
	if(id === '' || noteId === ''){
		throw new NodeOperationError(this.getNode(), 'Make sure to include the resource and note Id. for the note you want to delete');
	}

	endpoint = `${endpoint}/${id}/notes/${noteId}`;
	const result = await moneybirdApiRequest.call(this,'Delete', endpoint, {}, {});

	const newItem: INodeExecutionData = {
		json: {},
		binary: {},
	};
	newItem.json = result;
	return newItem;
}


export async function deleteRecord(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	itemIndex:number,
	endpoint:string,
	idField:string,
	){
	const id = this.getNodeParameter(idField, itemIndex, '') as string;
	if(id===''){
		throw new NodeOperationError(this.getNode(), 'An Id is required to delete a Record');
	}
	endpoint = 	`${endpoint}/${id}`;

	const result = await moneybirdApiRequest.call(this,'Delete', endpoint, {}, {});
	const newItem: INodeExecutionData = {
		json: {},
		binary: {},
	};
	newItem.json = result;
	return newItem;
}

export async function getRequiredId(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	itemIndex:number,
	idField:string,
	errorName:string,
){
	const id = this.getNodeParameter(idField, itemIndex, '') as string;
	if(id===''){
		throw new NodeOperationError(this.getNode(), `The ${errorName} is required.`);
	}

	return id;

}
