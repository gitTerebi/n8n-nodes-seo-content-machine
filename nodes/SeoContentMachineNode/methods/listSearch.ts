import type {IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult} from 'n8n-workflow';

export async function taskSearch(
	this: ILoadOptionsFunctions,
	_filter?: string,
): Promise<INodeListSearchResult> {

	const scm = await this.getCredentials('scmApi');
	// scmConn.address
	// 	scmConn.apiKey

	const resp = await this.helpers.httpRequest({
		url: scm.address + '/all-tasks?apikey=' + scm.apiKey
	} as IHttpRequestOptions)

	let returnData: INodeListSearchItems[] = [];
	if (resp && resp.success) {
		for (const task of resp.result) {

			returnData.push({
				name: task.name,
				value: task.id,
				// url: `https://docs.google.com/spreadsheets/d/`,
			});

		}
	}

	if (_filter)
		returnData = returnData.filter(t => t.name.toLowerCase().includes(_filter.toLowerCase()));

	return {results: returnData};
}
