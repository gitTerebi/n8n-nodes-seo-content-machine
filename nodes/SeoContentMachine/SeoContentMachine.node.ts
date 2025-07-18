import type {IDataObject, IExecuteFunctions, IHttpRequestOptions, INodeExecutionData, INodeType, INodeTypeDescription} from 'n8n-workflow';
import {NodeConnectionType, NodeOperationError} from 'n8n-workflow';
import {taskFields, taskOperations} from "./TaskOperations";
import {otherFields, otherOperations} from "./OtherOperations";
import {listSearch} from './methods';

export class SeoContentMachine implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SEO Content Machine',
		name: 'seoContentMachine',
		icon: 'file:cogs256.svg',
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
		const {address} = await this.getCredentials('scmApi'); //only need address as baseURL

		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex);
				const operation = this.getNodeParameter('operation', itemIndex);
				item = items[itemIndex];

				if (resource === 'task') {
					if (operation === 'create') {
						const taskType = this.getNodeParameter('taskType', itemIndex) as string;
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: `/create/${taskType.replace(/ /, '')}/`,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'find') {
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/find/',
							qs: {
								// these will be added to the qs (which already contains the api key)
								type: this.getNodeParameter('taskType', itemIndex) as string,
								group: (this.getNodeParameter('taskGroup', itemIndex) as IDataObject).value as string,
								name: this.getNodeParameter('taskName', itemIndex) as string,
								status: this.getNodeParameter('taskStatus', itemIndex) as string,
							},
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'abort') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/abort/' + taskId.value,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'content') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						const contentPath = this.getNodeParameter('taskContentPath', itemIndex) as string;

						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/content/' + taskId.value + '/' + contentPath,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'data') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/data/' + taskId.value,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'delete') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/delete/' + taskId.value,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'duplicate') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/duplicate/' + taskId.value,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'start') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/start/' + taskId.value,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'status') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/status/' + taskId.value,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'update') {
						const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;
						const options: IHttpRequestOptions = {
							method: 'POST', baseURL: address as string, json: true,
							body: JSON.parse(this.getNodeParameter('taskData', itemIndex) as string),
							url: '/task/data/' + taskId.value,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}
				}

				if (resource === 'other') {

					if (operation === 'about') {
						const options: IHttpRequestOptions = {
							method: 'GET', baseURL: address as string, json: true,
							url: '/task/aboutme',
							qs: {keyword: this.getNodeParameter('aboutKeyword', itemIndex) as string}
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
					}

					if (operation === 'spin') {
						const options: IHttpRequestOptions = {
							method: 'POST', baseURL: address as string, json: true,
							body: {text: this.getNodeParameter('spinText', itemIndex), csvprotectedwords: this.getNodeParameter('csvprotectedwords', itemIndex)},
							url: `/spin`,
						};
						item.json = await this.helpers.httpRequestWithAuthentication.call(this, 'scmApi', options,);
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
