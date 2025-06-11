import type {IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription} from 'n8n-workflow';
import {NodeConnectionType, NodeOperationError} from 'n8n-workflow';
import {taskOperations} from "./TaskOperations";
import {otherFields, otherOperations} from "./OtherOperations";
import {listSearch} from './methods';

export class SeoContentMachine implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SEO Content Machine',
		name: 'seoContentMachine',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'SEO Content Machine node',
		defaults: {
			name: 'SEO Content Machine',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'scmApi',
				required: true,
			},
		],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{name: 'Task', value: 'task'},
					{name: 'Other', value: 'other'},
				],
				default: 'task',
			},
			...taskOperations,
			...otherOperations,
			...otherFields
		],
	};

	methods = {
		listSearch
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const scm = await this.getCredentials('scmApi');

		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex);
				const operation = this.getNodeParameter('operation', itemIndex);
				item = items[itemIndex];

				if (resource === 'task') {

					const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;

					if (operation === 'abort') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/abort/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'data') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/data/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'delete') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/delete/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'duplicate') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/duplicate/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'find') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/find/?apikey=' + scm.apiKey});
					}
					if (operation === 'start') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/start/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'status') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/status/' + taskId.value + '?apikey=' + scm.apiKey});
					}

				}

				if (resource === 'other') {

					if (operation === 'about') {
						const aboutKeyword = this.getNodeParameter('aboutKeyword', itemIndex);

						item.json = await this.helpers.httpRequest({
							url: scm.address + '/aboutme?apikey=' + scm.apiKey + '&keyword=' + aboutKeyword
						})
					}

					if (operation === 'spin') {
						const spinText = this.getNodeParameter('spinText', itemIndex);
						const csvprotectedwords = this.getNodeParameter('csvprotectedwords', itemIndex);

						item.json = await this.helpers.request({
							method: "POST",
							uri: scm.address + '/spin?apikey=' + scm.apiKey,
							body: {text: spinText, csvprotectedwords},
							json: true,
						});
					}

				}

			} catch
				(error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex});
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

		return [items];
	}
}
