import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const querystring = require('querystring');
import schema from './schema';
import { updateData } from '@libs/dynamo.utils';

const updateAttendance: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		const data = querystring.decode(event.body);
		const workHours = {
			day: data.date,
			in: data.in,
			out: data.out,
		};
		const id = event.pathParameters.id;
		const query = {
			TableName: 'EmployeeTable',
			Key: {
				employeeId: id,
			},
			UpdateExpression:
				'set #attendance = list_append(if_not_exists(#attendance, :empty_list), :time)',
			ExpressionAttributeNames: {
				'#attendance': 'attendance',
			},
			ExpressionAttributeValues: {
				':time': [workHours],
				':empty_list': [],
			},
			ReturnValues: 'UPDATED_NEW',
		};
		const updatedEmployee = await updateData(query);
		return formatJSONResponse({
			employee: updatedEmployee,
		});
	};

export const main = middyfy(updateAttendance);
