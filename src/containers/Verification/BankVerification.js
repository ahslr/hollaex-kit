import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import {
	required,
	requiredBoolean,
	exactLength,
	onlyNumbers,
	maxLength
} from '../../components/Form/validations';
import renderFields from '../../components/Form/factoryFields';
import { Button } from '../../components';
import STRINGS from '../../config/localizedStrings';
import { verifyBankData } from '../../actions/verificationActions';
import { getErrorLocalized } from '../../utils/errors';
import HeaderSection from './HeaderSection';
import { isMobile } from 'react-device-detect';

const SHABA_PREFIX = 'IR';
const FORM_NAME = 'BankVerification';
const SELECT_FIELDS = ['isIranianAccount'];

class BankVerification extends Component {
	state = {
		formFields: {}
	};

	componentDidMount() {
		this.generateFormFields(this.props.isIranianAccount);
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.isIranianAccount !== this.props.isIranianAccount ||
			nextProps.activeLanguage !== this.props.activeLanguage
		) {
			this.generateFormFields(nextProps.isIranianAccount);
		}
	}

	generateFormFields = (isIranianAccount = false) => {
		const formFields = {
			isIranianAccount: {
				type: 'select',
				label:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.IRANIAN_ACCOUNT_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.IRANIAN_ACCOUNT_LABEL,
				defaultValue: true,
				options: [
					{ value: true, label: STRINGS.YES },
					{ value: false, label: STRINGS.NO }
				],
				validate: [requiredBoolean],
				fullWidth: isMobile
			}
		};

		if (isIranianAccount) {
			formFields.bank_name = {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.BANK_NAME_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.BANK_NAME_PLACEHOLDER,
				validate: [required],
				fullWidth: isMobile
			};
			formFields.card_number = {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.CARD_NUMBER_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.CARD_NUMBER_PLACEHOLDER,
				validate: [
					required,
					onlyNumbers,
					exactLength(
						16,
						STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.VALIDATIONS.CARD_NUMBER
					)
				],
				maxLength: 16,
				fullWidth: isMobile
			};
			formFields.account_number = {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.ACCOUNT_NUMBER_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.ACCOUNT_NUMBER_PLACEHOLDER,
				validate: [
					required,
					maxLength(
						50,
						STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.VALIDATIONS
							.ACCOUNT_NUMBER_MAX_LENGTH
					)
				],
				maxLength: 50,
				fullWidth: isMobile
			};
			formFields.shaba_number = {
				type: 'text',
				label:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.SHABA_NUMBER_LABEL,
				placeholder:
					STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.FORM_FIELDS
						.SHABA_NUMBER_PLACEHOLDER,
				validate: [
					required,
					maxLength(
						50,
						STRINGS.USER_VERIFICATION.BANK_ACCOUNT_FORM.VALIDATIONS
							.SHABA_NUMBER_MAX_LENGTH
					)
				],
				format: (value = '') => {
					if (value.indexOf(SHABA_PREFIX) === -1) {
						if (value.length < 2) {
							return SHABA_PREFIX;
						} else {
							return `${SHABA_PREFIX}${value}`;
						}
					}
					return value;
				},
				maxLength: 50,
				fullWidth: isMobile
			};
		}
		this.setState({ formFields });
	};

	handleSubmit = ({ isIranianAccount, ...rest }) => {
		if (!isIranianAccount) {
			this.props.moveToNextStep();
		} else {
			return verifyBankData(rest)
				.then(({ data }) => {
					// console.log(data);
					this.props.moveToNextStep('bank', {
						bank_data: rest,
						full_name: data.name
					});
				})
				.catch((err) => {
					const error = { _error: err.message };
					if (err.response && err.response.data) {
						error._error = err.response.data.message;
					}
					throw new SubmissionError(error);
				});
		}
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
					title={STRINGS.USER_VERIFICATION.TITLE_BANK_HEADER}
					openContactForm={openContactForm}
				/>
				{renderFields(formFields)}
				{error && (
					<div className="warning_text">{getErrorLocalized(error)}</div>
				)}
				<Button
					label={STRINGS.NEXT}
					type="button"
					onClick={handleSubmit(this.handleSubmit)}
					disabled={pristine || submitting || !valid || !!error}
				/>
			</form>
		);
	}
}

const BankVerificationForm = reduxForm({
	form: FORM_NAME
})(BankVerification);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = (state) => {
	const values = {};
	SELECT_FIELDS.forEach((fieldName) => {
		values[fieldName] = selector(state, 'isIranianAccount');
	});
	return values;
};

export default connect(mapStateToProps)(BankVerificationForm);