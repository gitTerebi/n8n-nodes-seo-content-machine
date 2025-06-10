import type {INodeProperties} from 'n8n-workflow';

export const otherOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['other'],
			},
		},
		options: [
			{
				name: 'About Me',
				value: 'about',
				description: 'Generate about me',
				action: 'Generate about me',
			},
			{
				name: 'Spin',
				value: 'spin',
				description: 'Spin/Rewrite text',
				action: 'Spin text',
			}
		],
		default: 'spin',
	},
];

export const otherFields: INodeProperties[] = [
	{
		displayName: 'Keyword',
		name: 'aboutKeyword',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['other'],
				operation: ['about'],
			},
		},
		description: 'Keyword for about me',
	},
	{
		displayName: 'Text',
		name: 'spinText',
		type: 'string',
		required: true,
		default: '',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['other'],
				operation: ['spin'],
			},
		},
		description: 'Text to spin',
	},
	{
		displayName: 'Protected Keywords',
		name: 'csvprotectedwords',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['other'],
				operation: ['spin'],
			},
		},
		description: 'CSV list of keywords to protect',
	},
];

