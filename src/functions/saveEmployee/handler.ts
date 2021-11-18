import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const querystring = require('querystring');
import schema from './schema';
import { saveData } from '@libs/dynamo.utils';
import { v4 } from 'uuid';

const save: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const data = querystring.decode(event.body);
	const id = v4();
	const query = {
		TableName: 'EmployeeTable',
		Item: {
			employeeId: id,
			fullName: data.fullName,
			dateOfBirth: data.dateOfBirth,
			address: data.address,
			jobRole: data.jobRole,
			fullTime: data.fullTime,
			contractLengthDays: data.contractLengthDays,
			department: data.department,
			payroll: {
				salary: data.salary,
			},
			dateJoined: data.dateJoined,
			status: data.status,
			phone: data.phone,
			email: data.email,
			// attendance: [],
		},
	};
	const savedEmployee = await saveData(query);
	return formatJSONResponse({
		employee: savedEmployee,
	});
};

export const main = middyfy(save);
