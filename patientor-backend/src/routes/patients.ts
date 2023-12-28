import express from 'express';
import patientsService from '../services/patientsService';
import { toNewEntry, toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(patientsService.getEntry());
});

router.post('/', (req, res) => {
	try {
		const newPatientEntry = toNewPatient(req.body);
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

router.post('/:id/entries/', (req, res) => {
	try {
		const newEntry = toNewEntry(req.body);
		const { id } = req.params;
		const newPatientData = patientsService.addEntry(id, newEntry);
		res.status(201).json(newPatientData);
	} catch (error) {
		let errorMessage = 'Something went wrong ';
		if (error instanceof Error) {
			errorMessage += 'Error: ' + error.message;
		}
		res.status(400).send(errorMessage);
	}
});

export default router;
