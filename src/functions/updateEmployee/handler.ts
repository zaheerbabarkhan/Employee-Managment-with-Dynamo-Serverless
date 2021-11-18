import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
const querystring = require('querystring');
import schema from './schema';
import { updateData } from '@libs/dynamo.utils';

const updateEmployee: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		const data = querystring.decode(event.body);
		const id = event.pathParameters.id;
		const query = {
			TableName: 'EmployeeTable',
			Key: {
				employeeId: id,
			},
			UpdateExpression:
				'set fullName = :fullName,  dateOfBirth = :dateOfBirth, address = :address, #status = :status, phone = :phone, email = :email',
			ExpressionAttributeNames: {
				'#status': 'status',
			},
			ExpressionAttributeValues: {
				':fullName': data.fullName,
				':dateOfBirth': data.dateOfBirth,
				':address': data.address,
				':status': data.status,
				':phone': data.phone,
				':email': data.email,
			},
			ReturnValues: 'UPDATED_NEW',
		};
		const updatedEmployee = await updateData(query);
		return formatJSONResponse({
			employee: updatedEmployee,
		});
	};

export const main = middyfy(updateEmployee);
