import { useParams } from 'react-router-dom';
import { Diagnosis, HealthCheckRating, Patient } from '../../types';
import {
	Male,
	Female,
	Transgender,
	MedicalServices,
	Favorite,
	Work,
} from '@mui/icons-material';

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
			<h3>entries</h3>
			{patient?.entries?.length === 0 && <div>No entries found</div>}
			{patient?.entries?.map((entry) => (
				<EntryDetails key={entry.id} entry={entry} />
			))}
		</>
	);
};

interface EntryProp {
	id: string;
	description: string;
	date: string;
	specialist: string;
	diagnosisCodes?: Array<Diagnosis['code']>;
	type: 'Hospital' | 'HealthCheck' | 'OccupationalHealthcare';
	employerName?: string;
	sickLeave?: {
		startDate: string;
		endDate: string;
	};
	discharge?: {
		date: string;
		criteria: string;
	};
	healthCheckRating?: HealthCheckRating;
}

const EntryDetails = ({ entry }: { entry: EntryProp }) => {
	switch (entry.type) {
		case 'Hospital':
			return <Hospital entry={entry} />;
		case 'HealthCheck':
			return <HealthCheck entry={entry} />;
		case 'OccupationalHealthcare':
			return <OccupationalHealthcare entry={entry} />;
		default:
			return <div>entry type "{entry.type}" not found</div>;
	}
};

const HealthCheck = ({ entry }: { entry: EntryProp }) => {
	const colorHealthRating = (): string => {
		switch (entry.healthCheckRating) {
			case 0:
				return 'green';
			case 1:
				return 'yellow';
			case 2:
				return 'orange';
			case 3:
				return 'red';
			default:
				console.error('some error occured in HealthCheck Component');

				return 'error';
		}
	};
	return (
		<section
			style={{
				border: '2px solid black',
				borderRadius: 4,
				padding: 3,
				margin: 5,
			}}
		>
			{entry.date} <MedicalServices />
			<div>
				<em>{entry.description}</em>
			</div>
			<Favorite style={{ color: colorHealthRating() }} />
			<div>diagnose by {entry.specialist}</div>
		</section>
	);
};
const OccupationalHealthcare = ({ entry }: { entry: EntryProp }) => {
	const { date, employerName, sickLeave, specialist, description } = entry;
	return (
		<section
			style={{
				border: '2px solid black',
				borderRadius: 4,
				padding: 3,
				margin: 5,
			}}
		>
			{date} <Work />
			{employerName}
			{sickLeave && (
				<div>
					sick leave from <b>{sickLeave.startDate}</b> to{' '}
					<b>{sickLeave.endDate}</b>
				</div>
			)}
			<div>
				<em>{description}</em>
			</div>
			diagnose by {specialist}
		</section>
	);
};

const Hospital = ({ entry }: { entry: EntryProp }) => {
	const { date, description, specialist, discharge } = entry;
	return (
		<section
			style={{
				border: '2px solid black',
				borderRadius: 4,
				padding: 3,
				margin: 5,
			}}
		>
			{date} <MedicalServices />
			<div>
				To be discharged on <b>{discharge?.date}</b> as {discharge?.criteria}
			</div>
			<div>
				<em>{description}</em>
			</div>
			diagnose by {specialist}
		</section>
	);
};

export default PatientPage;
