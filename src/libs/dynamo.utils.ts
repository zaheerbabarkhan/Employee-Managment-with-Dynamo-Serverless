import * as AWS from 'aws-sdk';

const dynamoClient = process.env.IS_OFFLINE
	? new AWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: 'http://localhost:8000',
	  })
	: new AWS.DynamoDB.DocumentClient({});

export const saveData = async (query) => {
	try {
		await dynamoClient.put(query).promise();
		return query.Item;
	} catch (error) {
		return 'Object Not Saved';
	}
};

export const updateData = async (query) => {
	try {
		const updatedEmployee = await dynamoClient.update(query).promise();
		return updatedEmployee;
	} catch (error) {
		console.log(error);
		return 'Object Not Updated';
	}
};

export const deleteData = async (query) => {
	try {
		await dynamoClient.delete(query).promise();
		return 'Object Deleted';
	} catch (error) {
		return 'Object Not Deleted';
	}
};

export const getListData = async (query) => {
	try {
		const data = await dynamoClient.scan(query).promise();
		return data.Items;
	} catch (error) {
		return 'Object Not Found';
	}
};

export const getData = async (query) => {
	try {
		const data = await dynamoClient.get(query).promise();
		return data.Item;
	} catch (error) {
		return {
			data: 'Object Not Found',
		};
	}
};
