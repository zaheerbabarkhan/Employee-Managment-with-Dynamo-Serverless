import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { deleteData } from '@libs/dynamo.utils';
import { Handler } from 'aws-lambda';

const deleteEmployee: Handler = async (event) => {
	const id = event.pathParameters.id;
	const query = {
		TableName: 'EmployeeTable',
		Key: {
			employeeId: id,
		},
	};
	const deletedEmployee = await deleteData(query);
	return formatJSONResponse({
		employee: deletedEmployee,
	});
};

export const main = middyfy(deleteEmployee);
