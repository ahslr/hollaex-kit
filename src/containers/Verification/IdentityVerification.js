import React, { Component } from 'react';
import moment from 'moment';
import { reduxForm, SubmissionError } from 'redux-form';
import {
	required,
	requiredBoolean,
	isBefore,
	requiredWithCustomMessage
} from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { COUNTRIES_OPTIONS } from '../../utils/countries';

import { isMobile } from 'react-device-detect';
import { ICONS } from '../../config/constants';
import { getErrorLocalized } from '../../utils/errors';
import { updateUser } from '../../actions/userAction';
import HeaderSection from './HeaderSection';

const FORM_NAME = 'IdentityVerification';

class IdentityVerification extends Component {
	state = {
		formFields: {}
	};

	componentDidMount() {
		this.generateFormFields(this.props.activeLanguage, this.props.fullName);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeLanguage !== this.props.activeLanguage) {
			this.generateFormFields(nextProps.activeLanguage, nextProps.fullName);
		}
	}

	generateFormFields = (language, fullName = '') => {
		const ID_NUMBER_TYPE = 'PASSPORT';
		const formFields = {
			full_name: {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.FULL_NAME_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.FULL_NAME_PLACEHOLDER,
				disabled: fullName.length > 0,
				validate: [required],
				fullWidth: isMobile
			},
			gender: {
				type: 'select',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.GENDER_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.GENDER_PLACEHOLDER,
				options: [
					{
						value: false,
						label:
							STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
								.GENDER_OPTIONS.MAN,
						icon: ICONS.GENDER_M
					},
					{
						value: true,
						label:
							STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
								.GENDER_OPTIONS.WOMAN,
						icon: ICONS.GENDER_F
					}
				],
				validate: [requiredBoolean],
				fullWidth: isMobile
			},
			dob: {
				type: 'date-dropdown',
				language,
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.DOB_LABEL,
				validate: [required, isBefore()],
				endDate: moment().add(1, 'days'),
				pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}',
				fullWidth: isMobile
			},
			nationality: {
				type: 'autocomplete',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.NATIONALITY_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.NATIONALITY_PLACEHOLDER,
				options: COUNTRIES_OPTIONS,
				validate: [required],
				fullWidth: isMobile
			},
			id_number: {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS[
						`ID_${ID_NUMBER_TYPE}_NUMBER_LABEL`
					],
				placeholder:
					STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS[
						`ID_${ID_NUMBER_TYPE}_NUMBER_PLACEHOLDER`
					],
				validate: [
					requiredWithCustomMessage(
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.ID_NUMBER
					)
				],
				fullWidth: isMobile
			},
			id_issued_date: {
				type: 'date-dropdown',
				label:
					STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS
						.ISSUED_DATE_LABEL,
				validate: [
					requiredWithCustomMessage(
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS.ISSUED_DATE
					),
					isBefore()
				],
				endDate: moment().add(1, 'days'),
				language,
				fullWidth: isMobile
			},
			id_expiration_date: {
				type: 'date-dropdown',
				label:
					STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.FORM_FIELDS
						.EXPIRATION_DATE_LABEL,
				validate: [
					requiredWithCustomMessage(
						STRINGS.USER_VERIFICATION.ID_DOCUMENTS_FORM.VALIDATIONS
							.EXPIRATION_DATE
					),
					isBefore(moment().add(15, 'years'))
				],
				endDate: moment().add(15, 'years'),
				addYears: 15,
				yearsBefore: 5,
				language,
				fullWidth: isMobile
			},
			country: {
				type: 'autocomplete',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.COUNTRY_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.COUNTRY_PLACEHOLDER,
				options: COUNTRIES_OPTIONS,
				validate: [required],
				fullWidth: isMobile
			},
			city: {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.CITY_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.CITY_PLACEHOLDER,
				validate: [required],
				fullWidth: isMobile
			},
			address: {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.ADDRESS_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.ADDRESS_PLACEHOLDER,
				validate: [required],
				fullWidth: isMobile
			},
			postal_code: {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.POSTAL_CODE_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.FORM_FIELDS
						.POSTAL_CODE_PLACEHOLDER,
				validate: [required],
				fullWidth: isMobile
			}
		};

		this.setState({ formFields });
	};

	handleSubmit = (values) => {
		if (this.props.fullName) {
			delete values.full_name;
		}
		return updateUser(values)
			.then(({ data }) => {
				this.props.moveToNextStep('identity', data);
			})
			.catch((err) => {
				const error = { _error: err.message };
				if (err.response && err.response.data) {
					error._error = err.response.data.message;
				}
				throw new SubmissionError(error);
			});
	};

	render() {
		const {
			handleSubmit,
			pristine,
			submitting,
			valid,
			error,
			openContactForm
		} = this.props;
		const { formFields } = this.state;
		return (
			<form className="d-flex flex-column w-100 verification_content-form-wrapper">
				<HeaderSection
					title={
						STRINGS.USER_VERIFICATION.USER_DOCUMENTATION_FORM.INFORMATION
							.TITLE_PERSONAL_INFORMATION
					}
					openContactForm={openContactForm}
				/>
				{renderFields(formFields)}
				{error && (
					<div className="warning_text">{getErrorLocalized(error)}</div>
				)}
				<Button
					type="button"
					onClick={handleSubmit(this.handleSubmit)}
					label={STRINGS.NEXT}
					disabled={pristine || submitting || !valid || !!error}
				/>
			</form>
		);
	}
}

const IdentityVerificationForm = reduxForm({
	form: FORM_NAME
})(IdentityVerification);

export default IdentityVerificationForm;