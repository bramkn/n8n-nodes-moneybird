export type MoneybirdApiCredentials = {
	host:string;
	administrationId: string;
	apiToken: string;
}

export type LoadedResource = {
	id: number;
	name: string;
}

export type LoadedContacts = {
	id: number;
	company_name: string;
}

export type LoadedProducts = {
	id:number,
	title:string
}

export type FieldsUiValues = Array<{
	fieldId: string;
	fieldValue: string;
}>;

export type IDList = {
	uri: string;
	idField:string;
	nameField:string
}

export type QueryParam = {
	displayname:string;
	name:string;
	type:string;
	array:boolean;
	options:string;
	description:string;
}

export type OperationConfig = {
	uri:string;
	method:string;
	object:string;
	IdList?:IDList;

}
