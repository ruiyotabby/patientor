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

const getPatient = (id: string) => {
	const foundPatient = patientsData.find((patient) => patient.id === id);
	if (foundPatient) {
		const { id, dateOfBirth, entries, gender, name, occupation } = foundPatient;
		return { name, occupation, dateOfBirth, gender, entries, id };
		// return foundPatient as NonSensitivePatientEntry;
	}
	throw new Error('Id does not match any patients');
};

export default {
	getEntry,
	addPatient,
	getPatient,
};
