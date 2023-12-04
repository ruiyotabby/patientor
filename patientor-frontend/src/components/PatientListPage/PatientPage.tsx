import { useParams } from 'react-router-dom';
import { Diagnosis, Patient } from '../../types';
import { Male, Female, Transgender } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import diagnosisService from '../../services/diagnosis';

interface Props {
	patients: Patient[];
}

const PatientPage = ({ patients }: Props) => {
	const { id } = useParams();
	const patient = patients.find((patient) => patient.id === id);
	const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

	useEffect(() => {
		diagnosisService.getAll().then((response) => setDiagnoses(response));
	}, []);

	return (
		<>
			<h3>
				{patient?.name}
				{patient?.gender === 'male' ? (
					<Male />
				) : patient?.gender === 'female' ? (
					<Female />
				) : (
					<Transgender />
				)}
			</h3>
			<div>ssh: {patient?.ssn}</div>
			<div>occupation: {patient?.occupation}</div>
			<h3>entries</h3>
			{patient?.entries?.map((entry) => (
				<div key={entry.id}>
					{entry.date} {entry.description}
					<ul>
						{entry.diagnosisCodes?.map((code, id) => (
							<li key={id}>
								{code}{' '}
								{diagnoses.find((diagnosis) => diagnosis.code === code)?.name}
							</li>
						))}
					</ul>
				</div>
			))}
		</>
	);
};

export default PatientPage;
