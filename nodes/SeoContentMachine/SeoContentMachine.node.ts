import type {IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription} from 'n8n-workflow';
import {NodeConnectionType, NodeOperationError} from 'n8n-workflow';
import {taskFields, taskOperations} from "./TaskOperations";
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
			...taskFields,
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

					if (operation === 'create') {
						const taskType = <string>this.getNodeParameter('taskType', itemIndex);
						item.json = await this.helpers.httpRequest({
							url: scm.address + '/create/' + taskType.replace(/ /, '') + '/?apikey=' + scm.apiKey
						});
					}

					if (operation === 'find') {
						item.json = await this.helpers.httpRequest({
							url: scm.address + '/task/find/?apikey=' + scm.apiKey +
								'?&type=' + this.getNodeParameter('taskType', itemIndex) +
								'&group=' + (this.getNodeParameter('taskGroup', itemIndex) as IDataObject).value +
								'&name=' + this.getNodeParameter('taskName', itemIndex) +
								'&status=' + this.getNodeParameter('taskStatus', itemIndex)
						});
					}

					if (operation === 'abort') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/abort/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'data') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/data/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'delete') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/delete/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'duplicate') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/duplicate/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'start') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/start/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'status') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/status/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'update') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						item.json = await this.helpers.request({
							method: "POST",
							uri: scm.address + '/task/data/' + taskId + '?apikey=' + scm.apiKey,
							body: this.getNodeParameter('taskData', itemIndex),
							json: true,
						});
					}
				}

				if (resource === 'other') {

					if (operation === 'about') {
						item.json = await this.helpers.httpRequest({
							url: scm.address + '/aboutme?apikey=' + scm.apiKey +
								'&keyword=' + this.getNodeParameter('aboutKeyword', itemIndex)
						})
					}

					if (operation === 'spin') {
						item.json = await this.helpers.request({
							method: "POST",
							uri: scm.address + '/spin?apikey=' + scm.apiKey,
							body: {text: this.getNodeParameter('spinText', itemIndex), csvprotectedwords: this.getNodeParameter('csvprotectedwords', itemIndex)},
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
