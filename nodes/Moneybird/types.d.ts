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
