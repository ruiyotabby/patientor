import { useParams } from 'react-router-dom';
import { Diagnosis, HealthCheckRating, NewEntry, Patient } from '../../types';
import {
	Male,
	Female,
	Transgender,
	MedicalServices,
	Favorite,
	Work,
} from '@mui/icons-material';
import {
	Alert,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	TextField,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SyntheticEvent, useState } from 'react';
import patientService from '../../services/patients';
import { AxiosError } from 'axios';

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
			<NewEntryForm id={id!} />
			{patient?.entries?.length === 0 && <div>No entries found</div>}
			{patient?.entries?.map((entry) => (
				<EntryDetails key={entry.id} entry={entry} />
			))}
		</>
	);
};

const NewEntryForm = ({ id }: { id: string }) => {
	const [type, setType] = useState<
		'OccupationalHealthcare' | 'Hospital' | 'HealthCheck' | string
	>('');
	const [date, setDate] = useState('');
	const [description, setDescription] = useState('');
	const [specialist, setSpecialist] = useState('');
	const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
	const [criteria, setCriteria] = useState('');
	const [dischargeDate, setDischargeDate] = useState('');
	const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
	const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');
	const [employerName, setEmployerName] = useState('');
	const [healthRating, setHealthRating] = useState<HealthCheckRating | string>(
		''
	);

	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');

	const typeForm = (type: string) => {
		switch (type) {
			case 'Hospital':
				return (
					<div style={{ marginTop: 4 }}>
						Discharge:
						<div style={{ marginLeft: 15 }}>
							<TextField
								required
								label='Criteria'
								value={criteria}
								onChange={({ target }) => setCriteria(target.value)}
								variant='standard'
								sx={{ width: '100%' }}
							/>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									format='YYYY-MM-DD'
									label='Date'
									onChange={(
										target: { $y: number; $M: number; $D: number } | null
									) =>
										setDischargeDate(
											`${target?.$y}-${target!.$M + 1}-${target?.$D}`
										)
									}
									slotProps={{
										textField: {
											variant: 'standard',
											required: true,
										},
									}}
									sx={{
										width: '100%',
									}}
								/>
							</LocalizationProvider>
						</div>
					</div>
				);
			case 'OccupationalHealthcare':
				return (
					<div>
						<TextField
							required
							label='EmployerName'
							variant='standard'
							value={employerName}
							onChange={({ target }) => setEmployerName(target.value)}
							sx={{ width: '100%' }}
						/>
						<div style={{ marginTop: 4 }}>Sick Leave:</div>
						<div style={{ marginLeft: 15 }}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									format='YYYY-MM-DD'
									label='start date'
									onChange={(
										target: { $y: number; $M: number; $D: number } | null
									) =>
										setSickLeaveStartDate(
											`${target?.$y}-${target!.$M + 1}-${target?.$D}`
										)
									}
									slotProps={{
										textField: {
											variant: 'standard',
											required: true,
										},
									}}
									sx={{
										width: '100%',
									}}
								/>
							</LocalizationProvider>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									format='YYYY-MM-DD'
									label='end date'
									onChange={(
										target: { $y: number; $M: number; $D: number } | null
									) =>
										setSickLeaveEndDate(
											`${target?.$y}-${target!.$M + 1}-${target?.$D}`
										)
									}
									slotProps={{
										textField: {
											variant: 'standard',
											required: true,
										},
									}}
									sx={{
										width: '100%',
									}}
								/>
							</LocalizationProvider>
						</div>
					</div>
				);
			case 'HealthCheck':
				return (
					<div>
						<FormControl required fullWidth sx={{ marginTop: 1 }}>
							<InputLabel>Health rating</InputLabel>
							<Select
								required
								label='Health rating'
								value={healthRating}
								onChange={({ target }) => setHealthRating(target.value)}
							>
								<MenuItem value={HealthCheckRating.Healthy}>Healthy</MenuItem>
								<MenuItem value={HealthCheckRating.LowRisk}>Low Risk</MenuItem>
								<MenuItem value={HealthCheckRating.HighRisk}>
									High Risk
								</MenuItem>
								<MenuItem value={HealthCheckRating.CriticalRisk}>
									Critical Risk
								</MenuItem>
							</Select>
						</FormControl>
					</div>
				);
			default:
				return <div></div>;
		}
	};

	const handleOpen = () => setOpen(true);

	const handleClose = () => setOpen(false);

	const submitNewEntry = async (event: SyntheticEvent) => {
		event.preventDefault();
		let newEntry = {
			description,
			date,
			specialist,
		} as NewEntry;

		if (diagnosisCodes.length > 0) newEntry = { ...newEntry, diagnosisCodes };

		switch (type) {
			case 'HealthCheck':
				newEntry = {
					...newEntry,
					type,
					healthCheckRating: healthRating as HealthCheckRating,
				};
				break;
			case 'Hospital':
				newEntry = {
					...newEntry,
					type,
					discharge: {
						date: dischargeDate,
						criteria,
					},
				};
				break;
			case 'OccupationalHealthcare':
				newEntry = {
					...newEntry,
					type,
					employerName,
					sickLeave: {
						startDate: sickLeaveStartDate,
						endDate: sickLeaveEndDate,
					},
				};
				break;
			default:
				return () => {
					throw new Error(`Unhandled discriminated union member: ${type} `);
				};
		}
		try {
			await patientService.addEntry(id, newEntry);
		} catch (error) {
			if (error instanceof Error && error instanceof AxiosError) {
				handleOpen();
				setMessage(error.response?.data);
			} else {
				console.log(error);
			}
		}
	};

	const cancelNewEntry = () => {
		[
			setCriteria,
			setDate,
			setDescription,
			setDischargeDate,
			setEmployerName,
			setHealthRating,
			setSickLeaveEndDate,
			setSickLeaveStartDate,
			setSpecialist,
			setType,
		].forEach((i) => i(''));
		setDiagnosisCodes([]);
	};

	return (
		<form
			onSubmit={submitNewEntry}
			style={{ border: '2px dotted black', padding: 10 }}
		>
			<h3>New entry</h3>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={open}
				onClose={handleClose}
				autoHideDuration={3000}
			>
				<Alert variant='filled' onClose={handleClose} severity='error'>
					{message}
				</Alert>
			</Snackbar>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker
					format='YYYY-MM-DD'
					label='Date'
					onChange={(target: { $y: number; $M: number; $D: number } | null) =>
						setDate(`${target?.$y}-${target!.$M + 1}-${target?.$D}`)
					}
					slotProps={{
						textField: {
							variant: 'standard',
							required: true,
						},
					}}
					sx={{
						width: '100%',
					}}
				/>
			</LocalizationProvider>
			<TextField
				// required
				label='Description'
				value={description}
				onChange={({ target }) => setDescription(target.value)}
				variant='standard'
				sx={{ width: '100%' }}
			/>
			<TextField
				required
				label='Specialist'
				value={specialist}
				onChange={({ target }) => setSpecialist(target.value)}
				variant='standard'
				sx={{ width: '100%' }}
			/>
			<TextField
				label='Diagnosis Codes'
				placeholder='234.7, 478,...'
				value={diagnosisCodes}
				onChange={({ target }) => setDiagnosisCodes(target.value.split(','))}
				variant='standard'
				sx={{ width: '100%' }}
			/>
			<FormControl required fullWidth sx={{ marginTop: 1 }}>
				<InputLabel required>Type</InputLabel>
				<Select
					required
					label='Type'
					value={type}
					onChange={({ target }) => setType(target.value)}
				>
					<MenuItem value={'HealthCheck'}>Health Check</MenuItem>
					<MenuItem value={'Hospital'}>Hospital</MenuItem>
					<MenuItem value={'OccupationalHealthcare'}>
						Occupational Healthcare
					</MenuItem>
				</Select>
			</FormControl>
			{typeForm(type)}
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<Button variant='contained' color='error' onClick={cancelNewEntry}>
					CANCEL
				</Button>
				<button type='submit' style={{ minWidth: 64 }}>
					ADD
				</button>
			</div>
		</form>
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
			return <div>entry type "{entry.type}" not recognized</div>;
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
				console.error(
					'some error occured in colorHealthRating func; HealthCheck Component'
				);
				return '';
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
