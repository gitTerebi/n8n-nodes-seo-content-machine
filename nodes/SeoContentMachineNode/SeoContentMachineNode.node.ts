import type {IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription} from 'n8n-workflow';
import {NodeConnectionType, NodeOperationError} from 'n8n-workflow';
import {taskGetFields, taskOperations} from "./TaskOperations";

import {listSearch} from './methods';

export class SeoContentMachineNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SEO Content Machine',
		name: 'seoContentMachineNode',
		group: ['transform'],
		version: 1,
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
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'task',
			},
			...taskOperations,
			...taskGetFields
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
				const taskId = this.getNodeParameter('taskId', itemIndex) as IDataObject;

				item = items[itemIndex];

				if (resource === 'task') {
					if (operation === 'abort') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/abort/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'delete') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/delete/' + taskId.value + '?apikey=' + scm.apiKey});
					}
					if (operation === 'start') {
						item.json = await this.helpers.httpRequest({url: scm.address + '/task/start/' + taskId.value + '?apikey=' + scm.apiKey});
					}
				}

			} catch (error) {
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
