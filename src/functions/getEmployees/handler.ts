import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getListData } from '@libs/dynamo.utils';
import { Handler } from 'aws-lambda';

const getEmployeesList: Handler = async () => {
	const query = {
		TableName: 'EmployeeTable',
	};
	const Employees = await getListData(query);
	return formatJSONResponse({
		employee: Employees,
	});
};

export const main = middyfy(getEmployeesList);
