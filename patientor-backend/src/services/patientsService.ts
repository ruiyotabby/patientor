import { v1 as uuid } from 'uuid';
import patientsData from '../../data/patients';
import {
	EntryWithoutId,
	NewPatientEntry,
	NonSensitivePatientEntry,
	PatientEntry,
} from '../types';

const getEntry = (): NonSensitivePatientEntry[] => {
	return patientsData as NonSensitivePatientEntry[];
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
	}
	throw new Error('Id does not match any patients');
};

const addEntry = (id: string, entry: EntryWithoutId) => {
	const patient = patientsData.find((patient) => patient.id === id);
	if (patient) {
		const newEntry = {
			id: uuid(),
			...entry,
		};
		patient.entries = patient.entries?.concat(newEntry);
		return patient;
	}
	throw new Error('Id does not match any patients');
};

export default {
	getEntry,
	addPatient,
	getPatient,
	addEntry,
};
