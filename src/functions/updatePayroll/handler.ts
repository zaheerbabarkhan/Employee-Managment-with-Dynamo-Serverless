import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const querystring = require('querystring');
import schema from './schema';
import { updateData } from '@libs/dynamo.utils';

const updatePayroll: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const data = querystring.decode(event.body);
	const id = event.pathParameters.id;
	const query = {
		TableName: 'EmployeeTable',
		Key: {
			employeeId: id,
		},
		UpdateExpression:
			'set #payroll.#salary = :salary, #payroll.#medical = :medical, #payroll.#tax = :tax',
		ExpressionAttributeNames: {
			'#payroll': 'payroll',
			'#salary': 'salary',
			'#medical': 'medicalWithHeld',
			'#tax': 'taxPercentWithheld',
		},
		ExpressionAttributeValues: {
			':salary': data.salary,
			':medical': data.medicalWithheld,
			':tax': data.taxPercentWithheld,
		},
		ReturnValues: 'UPDATED_NEW',
	};
	const updatedEmployee = await updateData(query);
	return formatJSONResponse({
		employee: updatedEmployee,
	});
};

export const main = middyfy(updatePayroll);
