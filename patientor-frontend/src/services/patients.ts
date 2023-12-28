import axios from 'axios';
import { NewEntry, Patient, PatientFormValues } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
	const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

	return data;
};

const create = async (object: PatientFormValues) => {
	const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

	return data;
};

const addEntry = async (id: string, newEntry: NewEntry) => {
	const { data } = await axios.post<Patient>(
		`${apiBaseUrl}/patients/${id}/entries`,
		newEntry
	);

	return data;
};

export default {
	getAll,
	create,
	addEntry,
};
