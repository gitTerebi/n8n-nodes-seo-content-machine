import type {IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from 'n8n-workflow';

export async function taskSearch(this: ILoadOptionsFunctions, _filter?: string,): Promise<INodeListSearchResult> {

	const scm = await this.getCredentials('scmApi');
	// scmConn.address
	// 	scmConn.apiKey

	const resp = await this.helpers.httpRequest({
		url: scm.address + '/task/find?apikey=' + scm.apiKey
	} as IHttpRequestOptions)

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

	const scm = await this.getCredentials('scmApi');
	// scmConn.address
	// 	scmConn.apiKey

	const resp = await this.helpers.httpRequest({
		url: scm.address + '/task/groups?apikey=' + scm.apiKey
	} as IHttpRequestOptions)

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
