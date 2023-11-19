import diagnosesData from '../../data/diagnoses';
import { DiagnosesEntry } from '../types';

const getEntries = (): DiagnosesEntry[] => {
	return diagnosesData;
};

export default {
	getEntries,
};
