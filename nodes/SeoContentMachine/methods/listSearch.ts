import type {IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from 'n8n-workflow';

export async function taskSearch(this: ILoadOptionsFunctions, _filter?: string,): Promise<INodeListSearchResult> {

	const {address} = await this.getCredentials('scmApi'); //only need address as baseURL

	const options: IHttpRequestOptions = {method: 'GET', baseURL: address as string, json: true, url: '/task/find/'};
	const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);

	let returnData: INodeListSearchItems[] = [];
	if (resp && resp.success) {
		for (const task of resp.result) {
			returnData.push({
				name: task.data.jobName,
				value: task._id,
				// url: `https://docs.google.com/spreadsheets/d/`,
			});

		}
	}

	if (_filter)
		returnData = returnData.filter(t => t.name.toLowerCase().includes(_filter.toLowerCase()));

	return {results: returnData};
}

export async function groupSearch(this: ILoadOptionsFunctions, _filter?: string,): Promise<INodeListSearchResult> {

	const {address} = await this.getCredentials('scmApi'); //only need address as baseURL
	const options: IHttpRequestOptions = {method: 'GET', baseURL: address as string, json: true, url: '/task/groups/'};
	const resp = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);

	let returnData: INodeListSearchItems[] = [{name: '', value: ''}];
	if (resp && resp.success) {
		for (const groupName of resp.result) {
			returnData.push({
				name: groupName,
				value: groupName,
			});
		}
	}

	if (_filter)
		returnData = returnData.filter(t => t.name.toLowerCase().includes(_filter.toLowerCase()));

	return {results: returnData};
}
