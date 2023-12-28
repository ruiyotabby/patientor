import {
	EntryWithoutId,
	Gender,
	NewPatientEntry,
	DiagnosesEntry,
	HealthCheckRating,
} from './types';

export const toNewEntry = (object: unknown): EntryWithoutId => {
	if (!object || typeof object !== 'object') {
		throw new Error('Incorrect or missing data');
	}

	if (
		'description' in object &&
		'specialist' in object &&
		'date' in object &&
		'type' in object
	) {
		const newEntry = {
			description: parseDescription(object.description),
			date: parseDate(object.date),
			specialist: parseSpecialist(object.specialist),
			diagnosisCodes: parseDiagnosisCodes(object),
		} as EntryWithoutId;

		const type = parseType(object.type);

		if (type === 'HealthCheck' && 'healthCheckRating' in object) {
			Object.assign(newEntry, {
				type: type,
				healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
			});
		} else if (type === 'Hospital' && 'discharge' in object) {
			Object.assign(newEntry, {
				type: type,
				discharge: parseDischarge(object.discharge),
			});
		} else if (type === 'OccupationalHealthcare' && 'employerName' in object) {
			Object.assign(newEntry, {
				type: type,
				employerName: parseEmployerName(object.employerName),
				sickLeave: parseSickLeave(object),
			});
		} else {
			throw new Error('Incorrect type');
		}

		return newEntry;
	}
	throw new Error('Incorrect data');
};

const parseSickLeave = (
	object: unknown
): { startDate: string; endDate: string } | object => {
	if (
		!object ||
		typeof object !== 'object' ||
		!('sickLeave' in object) ||
		!object.sickLeave ||
		!isSickLeave(object.sickLeave)
	) {
		return {};
	}
	return object.sickLeave;
};

const isSickLeave = (
	leave: object
): leave is { startDate: string; endDate: string } => {
	return (
		Object.keys(leave).includes('startDate' && 'endDate') &&
		Object.values(leave).filter(
			(v) => typeof v === 'string' || v instanceof String
		).length == 2
	);
};

const parseType = (type: unknown): string => {
	if (!type || !isString(type)) {
		throw new Error('Incorrect or missing type');
	}
	return type;
};

const parseEmployerName = (employerName: unknown): string => {
	if (!employerName || !isString(employerName)) {
		throw new Error('Incorrect or missing employerName');
	}
	return employerName;
};

const parseDischarge = (
	discharge: unknown
): {
	date: string;
	criteria: string;
} => {
	if (!discharge || !isDischarge(discharge)) {
		throw new Error('incorrect or mising discharge object');
	}
	return discharge;
};

const isDischarge = (
	discharge: object
): discharge is {
	date: string;
	criteria: string;
} => {
	return (
		Object.keys(discharge).includes('date' && 'criteria') &&
		Object.values(discharge).filter(
			(v) => typeof v === 'string' || v instanceof String
		).length == 2
	);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
	if (rating == null || !isNumber(rating) || !isHealthRating(rating)) {
		console.log(rating);

		throw new Error('Incorrect or missing rating');
	}
	return rating;
};

const isNumber = (num: unknown): num is number =>
	(!isNaN(Number(num)) && isFinite(Number(num))) ||
	typeof num === 'number' ||
	num instanceof Number;

const isHealthRating = (rating: number): rating is HealthCheckRating =>
	Object.values(HealthCheckRating).includes(rating);

const parseDiagnosisCodes = (
	object: unknown
): Array<DiagnosesEntry['code']> => {
	if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
		return [] as Array<DiagnosesEntry['code']>;
	}
	return object.diagnosisCodes as Array<DiagnosesEntry['code']>;
};

const parseDescription = (description: unknown): string => {
	if (!description || !isString(description)) {
		throw new Error('Incorrect or missing description');
	}
	return description;
};

const parseSpecialist = (specialist: unknown): string => {
	if (!specialist || !isString(specialist)) {
		throw new Error('Incorrect or missing specialist');
	}
	return specialist;
};

const parseDate = (date: unknown): string => {
	return parseDateOfBirth(date);
};

export const toNewPatient = (object: unknown): NewPatientEntry => {
	if (!object || typeof object !== 'object') {
		throw new Error('Incorrect or missing data');
	}

	if (
		'name' in object &&
		'dateOfBirth' in object &&
		'ssn' in object &&
		'gender' in object &&
		'occupation' in object
	) {
		const newEntry: NewPatientEntry = {
			name: parseName(object.name),
			dateOfBirth: parseDateOfBirth(object.dateOfBirth),
			ssn: parseSsn(object.ssn),
			gender: parseGender(object.gender),
			occupation: parseOccupation(object.occupation),
		};

		return newEntry;
	}

	throw new Error('Incorrect data');
};

const parseOccupation = (occupation: unknown): string => {
	if (!occupation || !isString(occupation)) {
		throw new Error('Incorrect or missing occupation');
	}
	return occupation;
};

const parseGender = (gender: unknown): Gender => {
	if (!gender || !isString(gender) || !isGender(gender)) {
		throw new Error('Incorrect or missing gender');
	}
	return gender;
};

const isGender = (param: string): param is Gender => {
	return Object.values(Gender)
		.map((v) => v.toString())
		.includes(param);
};

const parseSsn = (ssn: unknown): string => {
	if (!ssn || !isString(ssn)) {
		throw new Error('Incorrect or missing ssn');
	}
	return ssn;
};

const parseDateOfBirth = (date: unknown): string => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error('Incorrect or missing date');
	}
	return date;
};

const isDate = (date: string): boolean => Boolean(Date.parse(date));

const parseName = (name: unknown): string => {
	if (!name || !isString(name)) {
		throw new Error('Incorrect or missing name');
	}
	return name;
};

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};
