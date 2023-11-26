import express from 'express';
import patientsService from '../services/patientsService';
import toNewPatientEntry from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(patientsService.getEntry());
});

router.post('/', (req, res) => {
	try {
		const newPatientEntry = toNewPatientEntry(req.body);
		const addedEntry = patientsService.addPatient(newPatientEntry);
		console.log(addedEntry);

		res.status(201).json(addedEntry);
	} catch (error) {
		let errorMessage = 'Something went wrong ';
		if (error instanceof Error) {
			errorMessage += 'Error: ' + error.message;
		}
		res.status(400).send(errorMessage);
	}
});

router.get('/:id', (req, res) => {
	try {
		const { id } = req.params;
		const foundPatient = patientsService.getPatient(id);

		res.send(foundPatient);
	} catch (error) {
		let errorMessage = 'Something went wrong ';
		if (error instanceof Error) {
			errorMessage += 'Error: ' + error.message;
		}
		res.status(400).send(errorMessage);
	}
});

export default router;
