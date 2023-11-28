import { useParams } from 'react-router-dom';
import { Patient } from '../../types';
import { Male, Female, Transgender } from '@mui/icons-material';

interface Props {
	patients: Patient[];
}

const PatientPage = ({ patients }: Props) => {
	const { id } = useParams();
	const patient = patients.find((patient) => patient.id === id);

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
		</>
	);
};

export default PatientPage;
