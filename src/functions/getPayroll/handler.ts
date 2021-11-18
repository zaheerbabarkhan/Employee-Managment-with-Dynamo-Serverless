import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getData } from '@libs/dynamo.utils';
import { Handler } from 'aws-lambda';

const getEmployeePayroll: Handler = async (event) => {
	const id = event.pathParameters.id;
	const query = {
		TableName: 'EmployeeTable',
		Key: {
			employeeId: id,
		},
	};
	const employee = await getData(query);
	return formatJSONResponse({
		payroll: employee.payroll,
	});
};

export const main = middyfy(getEmployeePayroll);
