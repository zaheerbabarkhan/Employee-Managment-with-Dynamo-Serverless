import type { AWS } from '@serverless/typescript';
import saveEmployee from '@functions/saveEmployee';
import updateEmployee from '@functions/updateEmployee';
import updatePayroll from '@functions/updatePayroll';
import updateAttendance from '@functions/updateAttendance';
import deleteEmployee from '@functions/deleteEmployee';
import getEmployeesList from '@functions/getEmployees';
import getEmployee from '@functions/getEmployee';
import getPayroll from '@functions/getPayroll';
import getAttendence from '@functions/getAttendence';

const serverlessConfiguration: AWS = {
	service: 'employee-managment-with-dynamo-serverless',
	frameworkVersion: '2',
	custom: {
		'dynamodb': {
			'stages': ['dev'],
			'start': {
				'migrate': true,
				'seed': true,
			},
		},
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: { 'require.resolve': undefined },
			platform: 'node',
		},
	},
	plugins: [
		'serverless-esbuild',
		'serverless-offline',
		'serverless-dynamodb-local',
	],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
		},
		lambdaHashingVersion: '20201221',
		iamRoleStatements: [
			{
				'Sid': 'SpecificTable',
				'Effect': 'Allow',
				'Action': [
					'dynamodb:Get*',
					'dynamodb:Query',
					'dynamodb:Scan',
					'dynamodb:Delete*',
					'dynamodb:Update*',
					'dynamodb:PutItem',
				],
				'Resource': 'arn:aws:dynamodb:*:*:table/EmployeeTable',
			},
		],
	},
	// import the function via paths
	functions: {
		saveEmployee,
		updateEmployee,
		updatePayroll,
		updateAttendance,
		deleteEmployee,
		getEmployeesList,
		getEmployee,
		getPayroll,
		getAttendence,
	},
	'resources': {
		'Resources': {
			'employeeTable': {
				'Type': 'AWS::DynamoDB::Table',
				'Properties': {
					'TableName': 'EmployeeTable',
					'AttributeDefinitions': [
						{
							'AttributeName': 'employeeId',
							'AttributeType': 'S',
						},
					],
					'KeySchema': [
						{
							'AttributeName': 'employeeId',
							'KeyType': 'HASH',
						},
					],
					'ProvisionedThroughput': {
						'ReadCapacityUnits': 1,
						'WriteCapacityUnits': 1,
					},
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
