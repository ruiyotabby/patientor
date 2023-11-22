import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';
import {
	NewPatientEntry,
	NonSensitivePatientEntry,
	PatientEntry,
} from '../types';

const getEntry = (): NonSensitivePatientEntry[] => {
	return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation,
	}));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
	const newPatientEntry = {
		id: uuid(),
		...entry,
	};
	patientsData.push(newPatientEntry);
	return newPatientEntry;
};

export default {
	getEntry,
	addPatient,
};
