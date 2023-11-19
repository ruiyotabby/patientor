import patientsData from '../../data/patients';
import { NonSensitivePatientEntry } from '../types';

const getEntry = (): NonSensitivePatientEntry[] => {
	return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation,
	}));
};

export default {
	getEntry,
};
