import React from 'react';
import classnames from 'classnames';
import { ActionNotification } from '../';
import { ICONS } from '../../config/constants';
import STRINGS from '../../config/localizedStrings';

const renderPageCount = (currentPage, totalPages) => {
	if (totalPages > 0) {
		return (
			<div>
				{STRINGS.formatString(
					STRINGS.PAGINATOR_FORMAT,
					currentPage,
					totalPages
				)}
			</div>
		);
	}
};

const Paginator = ({
	goToPreviousPage,
	goToNextPage,
	currentPage,
	count,
	pageSize
}) => {
	const totalPages = Math.ceil(count / pageSize);
	const previousIsDisabled = currentPage <= 1;
	const nextIsDisabled = currentPage >= totalPages;
	return (
		<div className="table_controllers-wrapper d-flex justify-content-between align-items-center">
			<div
				onClick={!previousIsDisabled ? goToPreviousPage : undefined}
				className={classnames({
					disabled: previousIsDisabled,
					pointer: !previousIsDisabled
				})}
			>
				<ActionNotification
					text={STRINGS.PREVIOUS_PAGE}
					status="information"
					iconPath={ICONS.BLUE_ARROW_LEFT}
					textPosition="left"
					iconPosition="left"
					rotateIfLtr={true}
					useSvg={true}
				/>
			</div>
			{renderPageCount(currentPage, totalPages)}
			<div
				onClick={!nextIsDisabled ? goToNextPage : undefined}
				className={classnames({
					disabled: nextIsDisabled,
					pointer: !nextIsDisabled
				})}
			>
				<ActionNotification
					text={STRINGS.NEXT_PAGE}
					status="information"
					iconPath={ICONS.BLUE_ARROW_RIGHT}
					rotateIfRtl={true}
					useSvg={true}
				/>
			</div>
		</div>
	);
};

export default Paginator;
