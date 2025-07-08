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
			{
				name: 'Abort',
				value: 'abort',
				description: 'Abort a running task',
				action: 'Abort a task',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new task',
				action: 'Create a task',
			},
			{
				name: 'Data',
				value: 'data',
				description: 'Get task data',
				action: 'Get task data',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a task',
				action: 'Delete a task',
			},
			{
				name: 'Duplicate',
				value: 'duplicate',
				description: 'Duplicate a task',
				action: 'Duplicate a task',
			},
			{
				name: 'Find',
				value: 'find',
				description: 'Find tasks',
				action: 'Find tasks',
			},
			{
				name: 'Start',
				value: 'start',
				description: 'Start a task',
				action: 'Start a task',
			},
			{
				name: 'Status',
				value: 'status',
				description: 'Get task status',
				action: 'Get task status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update task data',
				action: 'Update task data',
			}
		],
		default: 'start',
	},
];

export const taskFields: INodeProperties[] = [
	{
		displayName: 'Task',
		name: 'taskId',
		type: 'resourceLocator',
		default: {mode: 'list', value: ''},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['abort', 'data', 'delete', 'duplicate', 'start', 'status', 'update'],
			}
		},
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
				// url: '=https://docs.google.com/spreadsheets/d/{{$value}}/edit',
			},
		],
	},
	{
		displayName: 'Type',
		name: 'taskType',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['find', 'create'],
			},
		},
		options: [
			{name: '', value: ''},
			{name: 'AI Writer', value: 'writing assistant'},
			{name: 'Article Creator', value: 'article creator'},
			{name: 'CSV Template Merge', value: 'mail merge'},
			{name: 'Dynamic Page', value: 'web scraper'},
			{name: 'Google Maps Scraper', value: 'google maps scraper'},
			{name: 'Keyword Finder', value: 'keyword finder'},
			{name: 'Post Emailer', value: 'post emailer'},
			{name: 'Post Uploader', value: 'post uploader'},
			{name: 'RSS Scraper', value: 'rss scraper'},
			{name: 'Search & News', value: 'google scraper'},
			{name: 'Spin & Translate', value: 'bulk translator'},
			{name: 'Static Page', value: 'article downloader'},
			{name: 'Url Finder', value: 'url finder'},
			{name: 'Wayback Scraper', value: 'wayback scraper'},
			{name: 'Web Crawler', value: 'web crawler'},
			{name: 'WP XML Generator', value: 'wp xml generator'},
			{name: 'Youtube Sub Scraper', value: 'youtube sub scraper'},
		],
		description: 'Type of task',
	},
	{
		displayName: 'Group',
		name: 'taskGroup',
		type: 'resourceLocator',
		default: {mode: 'list', value: ''},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'groupSearch',
					searchable: true,
				},
			}
		],
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['find'],
			},
		},
		description: 'Group of task',
	},
	{
		displayName: 'Name',
		name: 'taskName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['find'],
			},
		},
		description: 'Name of task',
	},
	{
		displayName: 'Status',
		name: 'taskStatus',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['find'],
			},
		},
		options: [
			{name: '', value: ''},
			{name: 'Aborted', value: 'aborted'},
			{name: 'Done', value: 'done'},
			{name: 'Draft', value: 'draft'},
			{name: 'Failed', value: 'failed'},
			{name: 'Running', value: 'running'},
			{name: 'Waiting', value: 'waiting'},
		],
		description: 'Group of task',
	},
	{
		displayName: 'Task Data',
		name: 'taskData',
		type: 'json',
		required: true,
		default: '',
		typeOptions: {
			rows: 16,
		},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['update'],
			},
		},
		description: 'Task data JSON',
	},

];
