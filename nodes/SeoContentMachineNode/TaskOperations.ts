import type {INodeProperties} from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			// {
			// 	name: 'Create',
			// 	value: 'create',
			// 	description: 'Create a task',
			// 	action: 'Create a task',
			// },
			// {
			// 	name: 'Delete',
			// 	value: 'delete',
			// 	description: 'Delete a task',
			// 	action: 'Delete a task',
			// },
			// {
			// 	name: 'Get',
			// 	value: 'get',
			// 	description: 'Get a task',
			// 	action: 'Get a task',
			// },
			// {
			// 	name: 'Get Many',
			// 	value: 'getAll',
			// 	description: 'Get many tasks',
			// 	action: 'Get many tasks',
			// },
			{
				name: 'Abort',
				value: 'abort',
				description: 'Abort a running task',
				action: 'Abort a task',
			},
			{
				name: 'Start',
				value: 'start',
				description: 'Start a task',
				action: 'Start a task',
			},
			// {
			// 	name: 'Update',
			// 	value: 'update',
			// 	description: 'Update a task',
			// 	action: 'Update a task',
			// },
		],
		default: 'start',
	},
	{
		displayName: 'Task',
		name: 'taskId',
		type: 'resourceLocator',
		default: {mode: 'list', value: ''},
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'taskSearch',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9\\-_]{2,}',
							errorMessage: 'Not a valid task ID',
						},
					},
				],
				url: '=https://docs.google.com/spreadsheets/d/{{$value}}/edit',
			},
		],
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
	},

];

export const taskGetFields: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get'],
			},
		},
		description: 'Unique identifier for the object',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {password: true},
				default: '',
				description: 'The password for the task if it is password protected',
			},
			{
				displayName: 'Context',
				name: 'context',
				type: 'options',
				options: [
					{
						name: 'View',
						value: 'view',
					},
					{
						name: 'Embed',
						value: 'embed',
					},
					{
						name: 'Edit',
						value: 'edit',
					},
				],
				default: 'view',
				description: 'Scope under which the request is made; determines fields present in response',
			},
		],
	},
];
export const taskDeleteFields: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get'],
			},
		},
		description: 'Unique identifier for the object',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {password: true},
				default: '',
				description: 'The password for the task if it is password protected',
			},
			{
				displayName: 'Context',
				name: 'context',
				type: 'options',
				options: [
					{
						name: 'View',
						value: 'view',
					},
					{
						name: 'Embed',
						value: 'embed',
					},
					{
						name: 'Edit',
						value: 'edit',
					},
				],
				default: 'view',
				description: 'Scope under which the request is made; determines fields present in response',
			},
		],
	},
];
