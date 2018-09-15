import React from 'react';
import { CurrencyBall } from '../../components';
import { CURRENCIES, ICONS, BASE_CURRENCY } from '../../config/constants';
import { Link } from 'react-router';
import { isMobile } from 'react-device-detect';
import {
	calculatePrice,
	fiatFormatToCurrency,
	fiatSymbol
} from '../../utils/currency';
import { ActionNotification } from '../../components';
import STRINGS from '../../config/localizedStrings';

export const AssetsBlock = ({
	balance,
	prices,
	totalAssets,
	wallets,
	onOpenDialog,
	bankaccount,
	navigate
}) => (
	<div className="wallet-assets_block">
		<table className="wallet-assets_block-table">
			<thead>
				<tr className="table-bottom-border">
					<th />
					<th>{STRINGS.CURRENCY}</th>
					<th>{STRINGS.DEPOSIT_WITHDRAW}</th>
					<th className="td-amount" />
					<th>{STRINGS.AMOUNT}</th>
				</tr>
			</thead>
			<tbody>
				{Object.entries(CURRENCIES)
					.filter(([key]) => balance.hasOwnProperty(`${key}_balance`))
					.map(([key, { formatToCurrencyFull }]) => {
						const balanceValue = balance[`${key}_balance`];
						const balanceText =
							key === BASE_CURRENCY
								? fiatFormatToCurrency(balanceValue)
								: fiatFormatToCurrency(
										calculatePrice(balanceValue, prices[key])
									);
						return (
							<tr className="table-row table-bottom-border" key={key}>
								<td className="table-icon td-fit">
									<Link to={`/wallet/${key.toLowerCase()}`}>
										<CurrencyBall
											name={CURRENCIES[key].shortName}
											symbol={key}
											size="s"
										/>
									</Link>
								</td>
								<td className="td-name td-fit">
									<Link to={`/wallet/${key.toLowerCase()}`}>
										{STRINGS[`${key.toUpperCase()}_FULLNAME`]}
									</Link>
								</td>
								<td className="td-wallet">
									{wallets[CURRENCIES[key].fullName.toLowerCase()] ||
									(key === fiatSymbol && bankaccount.verified) ? (
										<div className="d-flex justify-content-between deposit-withdrawal-wrapper">
											<ActionNotification
												text={STRINGS.WALLET_BUTTON_FIAT_DEPOSIT}
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => navigate(`wallet/${key}/deposit`)}
												useSvg={true}
												className="csv-action"
												showActionText={isMobile}
											/>
											<ActionNotification
												text={STRINGS.WALLET_BUTTON_FIAT_WITHDRAW}
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => navigate(`wallet/${key}/withdraw`)}
												useSvg={true}
												className="csv-action"
												showActionText={isMobile}
											/>
										</div>
									) : (
										key !== fiatSymbol && (
											<ActionNotification
												text={STRINGS.GENERATE_WALLET}
												status="information"
												iconPath={ICONS.BLUE_PLUS}
												onClick={() => onOpenDialog(key)}
												className="need-help"
												useSvg={true}
											/>
										)
									)}
								</td>
								<td className="td-amount" />
								<td className="td-amount">
									<div className="d-flex">
										<div className="mr-4">
											{STRINGS.formatString(
												STRINGS[`${key.toUpperCase()}_PRICE_FORMAT`],
												formatToCurrencyFull(balanceValue),
												STRINGS[`${key.toUpperCase()}_CURRENCY_SYMBOL`]
											)}
										</div>
										{!isMobile &&
											key !== BASE_CURRENCY &&
											parseFloat(balanceText || 0) > 0 && (
												<div>
													{`(≈ ${
														STRINGS[
															`${BASE_CURRENCY.toUpperCase()}_CURRENCY_SYMBOL`
														]
													} ${balanceText})`}
												</div>
											)}
									</div>
								</td>
							</tr>
						);
					})}
			</tbody>
			{!isMobile &&
				BASE_CURRENCY && (
					<tfoot>
						<tr>
							<td />
							<td />
							<td />
							<td />
							<td>
								<div className="d-flex">
									<div className="mr-4">{STRINGS.WALLET_TABLE_TOTAL}</div>
									<div style={{ direction: 'rtl' }}>{totalAssets}</div>
								</div>
							</td>
						</tr>
					</tfoot>
				)}
		</table>
	</div>
);